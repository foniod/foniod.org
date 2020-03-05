# OsQuery

[OsQuery](https://osquery.io/) is an endpoint visibility solution
originally developed at Facebook, and now maintained by The Linux
Foundation.

While OsQuery is most often deployed to monitor laptops and desktop
computers, we included it in the default InGRAINd Docker images to
collect dynamic configuration and runtime information about your
environment.

For instance, you can use the OsQuery integration to report statistics
about your processes CPU use periodically using the following
configuration:

	[[probe]]
	pipelines = ["console"]
	[probe.config]
	type = "Osquery"
	interval_ms = 10000

	[[probe.config.queries]]
	query = "SELECT user_time, name as process_str, pid as process_id from processes"
	name = "process_user_time"
	measurement = "user_time"
	measurement_type = "count"
	
	[[probe.config.queries]]
	query = "SELECT system_time, name as process_str, pid as process_id from processes"
	name = "process_system_time"
	measurement = "system_time"
	measurement_type = "count"

The config above will run the `SELECT` queries every 10 seconds.

In the emitted events, every column referenced in the `SELECT`
statement will create a new tag. You can also specify which of the
selected fields should be treated as a measurement, and the associated
unit of measurement.
