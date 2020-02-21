# Network monitoring

The network monitoring grain in InGRAINd collects network events
straight from the kernel, unlike most network monitoring
solutions. Because of this, InGRAINd can observe detailed statistics
about the network behaviour of applications without impacting network
throughput and performance.

Enabling network monitoring for all network interfaces, therefore, is
as easy as enabling the `Network` probe in `config.toml`:

	[[probe]]
	pipelines = ["console"]
	[probe.config]
	type = "Network"

The grain monitors all outgoing connections from the box, and will
print the details of outgoing connections:


	[{"timestamp":1582294577893714161,
	"kind":13,
	"name":"connection.out_count",
	"measurement":1,
	"tags":{"s_ip":"127.0.0.1",
	        "s_port":"45719",
			"d_ip":"127.0.0.1",
			"process_id":"4878",
			"process_str":"Socket Thread",
			"d_port":"1313"}}]
			
The details of an outbound and inbound traffic is also clearly
visible, even on localhost:

	[{"timestamp":1582294577893874264,
	"kind":9,
	"name":"volume.out_byte",
	"measurement":0,
	"tags":{"d_port":"1313",
			"d_ip":"127.0.0.1",
			"process_str":"Socket Thread",
			"s_port":"45719",
			"s_ip":"127.0.0.1",
			"process_id":"4878",
			"proto":"tcp"}}]

	[{"timestamp":1582294577893943829,
	"kind":9,
	"name":"volume.in_byte",
	"measurement":72,
	"tags":{"s_port":"8453",
			"d_port":"38834",
			"d_ip":"127.0.0.1",
			"s_ip":"127.0.0.1",
			"proto":"tcp",
			"process_str":"hugo",
			"process_id":"34081"}}]

The value of `measurement` is in bytes, and every single `read()` and
`write()` system call can be observed for UDP and TCP traffic.


