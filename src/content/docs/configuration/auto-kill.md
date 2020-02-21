# Automatically kill programs

InGRAINd can execute various commands to react to certain events with minimum overhead.

Because events are not _intercepted_, merely _observed_ by the eBPF
probe, InGRAIN cannot block a program from executing a certain
action. 

However, using the events pipeline to filter and execute commands,
InGRAIN can react to events quickly and reliably without involving
other processing components. This means you fundamentally cannot stop
a task from executing, but long-running processes can be killed.

You can configure this behaviour by adding the `Exec` step to your
`pipeline`:

	[[pipeline.s3.steps]]
	type = "Exec"
	arguments = ["kill", "-9", "{ process_id }"]
	only_if = [
		{ key = "some_key", regex = "prefix.*" }
	]

## Monitoring a directory

For example, to stop someone editing your SSH keys using
Vim, you can use the following configuration:

	[[probe]]
	pipelines = ["console"]
	[probe.config]
	type = "files"
	monitor_dirs = ["/home/user"]

	[[pipeline.s3.steps]]
	type = "Exec"
	command = ["kill", "-9", "{ process_id }"]
	only_if = [
		{ key = "process_str", regex = ".*vim" },
		{ key = "path_str", regex = ".*.ssh/id_.*" },
	]
