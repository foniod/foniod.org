# Backends

To export data from InGRAINd, you can use a number of _backends_.

These backends can process or forward the data in any way you
want. Currently, the following integrations are available:

 * [Console](#console)
 * [S3](#s3)
 * [StatsD+](#statsd)
 * [HTTP](#http)
 
The flush frequency of a backend can be controlled by using a `Buffer`
pipeline step. If you don't specify either `interval_s` or
`interval_ms` in seconds or milliseconds, respectively, then the by
default events are cached for 10 seconds before being forwarded to the
backend.

If you don't use histogram-type aggregations in your backend, you can
disable it for some performance gains.


	[[pipeline.my_pipeline.steps]]
	type = "Buffer"
	interval_s = 30
	enable_histograms = false
	
As a general rule, backends don't handle errors in the upstream. If
the upstream cannot accept a request for whatever reason, the events
InGRAINd couldn't deliver are not cached, they are simply dropped.

## Console

The `Console` backend is the simplest way to send events to another
program. It will print JSON-formatted events, one event per line, on
the standard output. You can enable it like this:

	[pipeline.console.config]
	backend = "Console"
	
It is great for interactive debugging purposes, or combining it with
other tools as part of a log collector pipeline.

There's no other configuration the `Console` backend receives, so if
you want to process the events, you will need to redirect the InGRAINd
output to your preferred destination.

Note that the `Console` backend is separate from the logging
facilities, which happen on the standard error pipe, and use a completely different infrastrucure.

## S3

The S3 backend will place JSON-formatted data dumps in an S3
bucket. To configure the AWS connection, you can use environment
variables or credentials files [as described in the Rusoto
documentation](https://github.com/rusoto/rusoto/blob/master/AWS-CREDENTIALS.md)

To specify which bucket to use, set the `AWS_S3_BUCKET` environment
variable.

The files will have a name like `hostname_123456789123456789.json`,
where the long number is the UNIX nanosecond-precise timestamp.

## StatsD+

The StatsD+ backend will forward events from InGRAINd to compatible
StatsD servers, such as Grafana, Graphite, or even DataDog. If the
backend supports tags for events, they are also forwarded.

You can add a StatsD+ backend like so, with tagged events disabled:

	[pipeline.statsd.config]
	backend = "StatsD"
	use_tags = false

Configuration of the upstream server is done is done through
2 environment variables:

 * `STATSD_HOST`: the hostname or IP address of the StatsD server
 * `STATSD_PORT`: the port number of the StatsD server
 
Both of the variables above need to be set in order for the backend to
start.

## HTTP

The HTTP server works similarly to the S3 backend, except it can
forward your events to any HTTP server using a `POST` request.

For instance, a realistic HTTP backend could look like so:

	[pipeline.http.config]
	backend = "http"
	uri = "http://example.redsift.com/insert"
	encoding = "json"

	[pipeline.http.config.headers]
	authorization = "Basic realm token"
	"custom-header" = "some value"

To use authenticated endpoints, you can specify extra headers to be
sent in the `[pipeline.http.config.headers]` map, however, these need
to be stored in the config file in unencrypted form.

In addition, the HTTP endpoint can encode its payload as Cap'n Proto in
addition to JSON. The schema for the current version can be found [in
the
repository](https://github.com/redsift/foniod/blob/master/schema/foniod.capnp).

Using Cap'n Proto lets you shave off significant amount of time when
receiving and parsing InGRAINd events, at the cost of additional
complexity.

