# Getting Started

To get started with foniod, you will need a Linux-based
system. Generally, any recent release of a modern distribution will
work fine.

To deploy on Kubernetes and on various cloud platforms, you will want
to take a peek at our [Kubernetes
tutorial](/docs/deployment/kubernetes/)

If you're running Fedora 31, or Ubuntu 18.04, you will be able to get
going using [Docker](#docker) and a configuration file.

A configuration file will look like the snippet below. Name it `config.toml`.


    # Monitor network activity, both IPv4 and IPv6.
	[[probe]]
	pipelines = ["console"]
	[probe.config]
	type = "Network"
    
	# Log inbound DNS traffic.
	# This includes all answers to outbound UDP DNS queries.
	[[probe]]
	pipelines = ["console"]
	[probe.config]
	type = "DNS"
	interface = "wlp61s0"
    
	# Intercept TLS handshakes and log server name and cypher details.
	[[probe]]
	pipelines = ["console"]
	[probe.config]
	type = "TLS"
	interface = "wlp61s0"
	
	# Monitor access to /usr/bin by all processes.
	# This will log all applications started from that directory.
	[[probe]]
	pipelines = ["console"]
	[probe.config]
	type = "Files"
	monitor_dirs = ["/usr/bin"]
    
	# Add the Docker Container ID to all events observed in a container.
	[[pipeline.console.steps]]
	type = "Container"
    
	# Add system details to every log event.
	[[pipeline.console.steps]]
	type = "AddSystemDetails"
    
	# Group events for every second. Disable histogram aggregations.
	[[pipeline.console.steps]]
	type = "Buffer"
	interval_s = 1
	enable_histograms = false
    
	# Print everything on the console in JSON format
	[pipeline.console.config]
	backend = "Console"
	
For an exhaustive list of grains and configuration options, look at
the [example
configuration](https://github.com/redsift/foniod/blob/master/config.toml.example)
in the repository.

## Docker

To start an foniod Docker container on Ubuntu 18.04, use the following command line:

	docker run -v $(pwd)/config.toml:/config/foniod.toml --privileged --rm quay.io/redsift/foniod:latest-ubuntu-18.04
	
For running on Fedora 31, you can use the following:

	docker run -v $(pwd)/config.toml:/config/foniod.toml --privileged --rm quay.io/redsift/foniod:latest-fedora31

## Build from scratch

To get `foniod` working on your workstation, you will need to start by
installing a few packages and the Rust toolchain.

	curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

### Ubuntu

On Ubuntu, the list of dependencies can be installed with `apt`.

	apt-get -y install debhelper cmake libllvm9 llvm-9-dev libclang-9-dev \
       libelf-dev bison flex libedit-dev clang-format-9 \
       devscripts zlib1g-dev libfl-dev \
       pkg-config libssl-dev \
       curl wget \
       git \
       clang \
       capnproto 
	
### Fedora

On Fedora, install dependencies using the following command.

	yum install -y clang-9.0.0 llvm-9.0.0 llvm-libs-9.0.0 llvm-devel-9.0.0 llvm-static-9.0.0 capnproto kernel kernel-devel elfutils-libelf-devel ca-certificates


### Building

After installing the dependencies, build `foniod` with the usual build ritual.

	cargo build --release
	
And run it as root.
	
	sudo ./target/release/foniod ./config.toml
	
If everything worked, you should start seeing output on the console from events happening on your system.

To get into more advanced topics, read the [configuration](/docs/configuration/syntax/) pages.

