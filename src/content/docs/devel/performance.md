# Performance

The following measurements were done on an 8-core `Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz`, Arch Linux, and `ingraind` @ [43281a7](https://github.com/redsift/ingraind/commit/43281a70ca0d9cbf8cf2177dbf744c3bb1469d4d).

The following command will produce the raw output:

    cargo build --release && \
    sudo AWS_ACCESS_KEY_ID=x \
         AWS_SECRET_ACCESS_KEY=x \
         AWS_BUCKET=x \
         AWS_INTERVAL=30 \
         DNS_IF=wlp61s0 \
         RUST_BACKTRACE=1 ./target/release/ingraind & sleep 5 \
    && (top -b -d 2 |grep ingraind) >top_log & \
    iperf3 -t 10 -b 10M -c localhost > iperf_log \
    && sleep 1 && iperf3 -t 10 -b 100M -c localhost >>iperf_log \
    && sleep 1 && iperf3 -t 10 -b 1000M -c localhost >>iperf_log \
    && sleep 1 && iperf3 -t 10 -b 10000M -c localhost >>iperf_log \
    && pkill top \
    && @ pkill ingraind

Looking through the logs, we can see that CPU use follows bandwidth:

 | Bandwidth | CPU % |
 |-----------|-------|
 | 10M       | 1%    |
 | 100M      | 4%    |
 | 1000M     | 32%   |
 | 10000M    | 98%   |

![](https://bricks.redsift.cloud/reusable/d3-rs-lines?_datum=[{%22l%22:10,%22v%22:1},{%22l%22:100,%22v%22:4},{%22l%22:1000,%22v%22:32},{%22l%22:10000,%22v%22:98}]&curve=curveMonotoneX&scale=2.0)


This is test only measures the TCPv4 throughput of the one process, but gives a good idea about scaling.
