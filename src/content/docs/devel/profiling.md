# Profiling

## During development
The recommended way to profile `ingraind` binaries is using `perf`.
The default `--release` builds are not stripped, therefore it should be easy to analyse the results.

    sudo perf record ./target/release/ingraind
    sudo perf report

## Docker

If running in a container, the recommended way is to start `ingraind`, then attach `perf`, and look the results off the box.

    sudo docker run -d --name ingraind -e OPTION=value [...] --pid=host --net=host --privileged ingraind
    sudo perf record -a -p `pgrep ingraind`

Looking at the results in this scenario is a bit tricky, because we will need to tell `perf` where the binaries are located to resolve the symbols.

This can be done by starting an `ingraind` container on the box that we're using for analysis (if different from the system where we collected the data), then using the merged overlay filesystem as a base for symbol resolution. Note, **you will need to use the same container version**, as the symbols **will** change between builds.

This can be easily done like so:

    export VERSION=sha256_of_profiled_container
    docker run -d --rm --name ingraind -it ingraind:$VERSION /bin/sh

    export CONTAINER_HASH=$(docker inspect ingraind |grep MergedDir |sed 's;.*: "\(.*\)",;\1;')
    sudo perf report -f -i perf.data_docker --symfs /var/lib/docker/overlay2/$CONTAINER_HASH/merged

After you're done, you can shut down the container.

    docker stop ingraind

## Stat
To get detailed stats about the execution of `ingraind`, you can `perf stat` like so:

    $ perf stat -a -p `pgrep ingraind`

    Performance counter stats for process id '28037':

       3593.405601      cpu-clock (msec)          #    0.114 CPUs utilized
           147,307      context-switches          #    0.041 M/sec
             1,611      cpu-migrations            #    0.448 K/sec
                60      page-faults               #    0.017 K/sec
     6,076,570,590      cycles                    #    1.691 GHz
     4,317,115,815      instructions              #    0.71  insn per cycle
       788,078,499      branches                  #  219.312 M/sec
        29,054,771      branch-misses             #    3.69% of all branches

      31.398821987 seconds time elapsed
