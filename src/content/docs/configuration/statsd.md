# StatsD

Besides supporting StatsD as an [upstream backend]({{< relref
"/docs/configuration/backends" >}}#statsd) to which InGRAINd can send
data, it can also act as a StatsD *server* that accepts metrics from
applications and forwards them to another upstream.

This allows you to use only InGRAINd on your system as the component
that collects and forwards system performance, security, and
application metrics.

An example config file that provides a local a StatsD collector then
forwards it to an upstream server would look like this:

	[[probe]]
	pipelines = ["statsd"]
	[probe.config]
	type = "StatsD"
	bind_address = "127.0.0.1:8125"
	flush_interval = "10000"
	
	[pipeline.statsd.config]
	backend = "StatsD"
	use_tags = false
	
To then run InGRAINd, you should make sure to set `STATSD_HOST` and
`STATSD_PORT` variables that point to the upstream server.
