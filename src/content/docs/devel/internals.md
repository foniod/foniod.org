# How it all works

![](./architecture.png)

## Build

Build starts with `build.rs` going through all modules in the `bpf/` directory, and:

 1. Compile all `.c` files with `clang` into BPF bytecode.
 1. Run `bindgen` for all structs, the names of which start with `_data_` (e.g.
    `_data_tcp_connect`).
    
`bpf_helpers.h` is in the `include` directory, so `bindgen` can be run freely on
all `.h` files under `bpf/`. This is quirky, but works.

The produced BPF bytecode ELF packages are embedded in the final binary
using `include_bytes!` statements.
The produced bindings are embedded using `include!` statements.
 
## Runtime

**Grains** are self-contained monitors and reporters. Each grain can gather their
own type of statistics about a particular aspect of the system's operation.
Grains need to manage any BPF modules they might be using. Every grain is
coupled with a dedicated cloud-based analytics backend.

**BPF** probes are using the kernel's eBPF virtual machine to execute a safe
bytecode directly in kernel-space. These modules can only interact with the
outside world using well-defined interfaces, and cannot execute arbitrary system
calls.

The BPF modules will send data to userland using **perf_event** ring-buffers.
These ring-buffers are fixed size buffers with a size multiples of the platform
native VMM page size (4k on x86/x64).

Important to note 2 things:
 * The license of BPF modules needs to be GPL is we want to extract data from
   the kernel into userland through the `perf_event` interface.
 * If the module's version does not match the running kernel's version number,
   the kernel will refuse to load the module. The workaround here is using
   `0xFFFFFFFE` in the binary to stay compatible with gobpf. This version will
   be replaced runtime by redbpf.

After the BPF probes are parsed from the ELF files, the following syscalls are
made, in order:
 1. `bpf_create_map`: All global data is stored in maps. These structures are
    allocated during parsing.
 1. `bpf_prog_load`: Load a program into the BPF VM, and initialise it
 1. `bpf_attach_kprobe`: Attach BPF probes to a syscall. Entry probes and return
    probes are possible, they will be called when entering or exiting a syscall,
    respectively.
 1. `bpf_update_elem`: the `perf_event` ringbuffers are initialised. This
    includes allocating a `perf_reader` object, which are used for userspace
    consumption of the `bpf_perf_event_output` calls in the probes.
    
## Perf Events

Ingraind uses the [perf_event_open
(2)](http://man7.org/linux/man-pages/man2/perf_event_open.2.html) interface to
communicate with the kernel's BPF VM.

The BPF modules will access the `perf_event` ring buffers through a `BPF_MAP`
structure of type `BPF_MAP_PERF_EVENT_ARRAY`. The maps contain an `fd` that is
keyed by the CPU id. Technically, multiple strategies are allowed for keying
this map, but the most popular looks like setting up a separate ring buffer for
every online single CPU.

Events are consumed using an `epoll_wait` loop, and read until exhaustion. The
benefit of a single `epoll_wait` loop is that all the complex logic behind
initialisation of different grains ultimately ends up allowing notifications
through a single `fd`, including all network, and even `perf_event` buffers.

## ELF parsing

A thing to note here before I get into this, is how state is managed in the BPF
VM. There's no global state allowed, so anything that needs to be persisted
between calls into the probe needs to go through `BPF_MAP_.*` structures through
VM opcodes (`#define`'d as function calls, eg. update, delete, etc.).

A corollary to this is that global state used in the [C source
code](https://elixir.bootlin.com/linux/v4.17.1/source/tools/lib/bpf/libbpf.h#L209)
is stored in the ELF binary in named `PROGBITS`
[sections](https://docs.rs/goblin/0.0.15/goblin/elf/section_header/struct.SectionHeader.html),
then loaded and initialised to be `BPF_MAP`s by the loader *as data*. We load
this into memory, treating it as configuration, then instruct the kernel to set
up global state storage to get an `fd` in return. This `fd` can also be used to
send data back and forth between kernel- and userspace in certain cases.

It gets interesting when these are referenced in code (functions). The compiler
generates a `REL`
[section](https://docs.rs/goblin/0.0.15/goblin/elf/reloc/struct.Reloc.html) that
`link`s to the symbol table, and has an `info` field that is a link to the
amended section of code. The `offset` field specifies the offset in bytes from
the start of the section that needs to be modified. A relocation, strictly in
the BPF context, is a rewrite instruction for a specific instruction, in a
specific section, referencing a specific symbol.

Because data access is always through VM opcodes, the instruction at the
`offset` location is... something. We don't actually care. Relocations tell us
to... do something with it.

We need to rewrite the instruction's source register (`src_reg`) with
`BPF_PSEUDO_MAP_FD`, and the immediate constant parameter (`imm`) with the `fd`
of the map that's referenced by the symbol.

So to recap, this is the workflow to deal with loading ELF files:
 1. Load the strings table
 1. Load the symbol table
 1. Parse *all* the sections
 1. Create `BPF_MAP`s from the `maps/` sections to acquire `fd`s
 1. Go through all code sections, and apply relocations such that:
    1. Resolve all `REL` symbols into `fd`s (through the symbol table and back again).
    1. Rewrite the instruction at specified offset


