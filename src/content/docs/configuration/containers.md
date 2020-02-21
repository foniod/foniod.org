# Containers

Monitoring containerised workloads is usually not an easy thing to
do. With InGRAINd, you can get the ID of the Docker container that's
hosting the applications with simply including the following in the
`Container` step in your pipeline.

	[[pipeline.console.steps]]
	type = "Container"

This will add the `docker_id` tag to each event that comes from a
container, allowing you to link them to a running Docker container.

Since Kubernetes is based on Docker, this also allows you to monitor
workloads in Kubernetes clusters.

For instance, when a container is tagged like the following,

    "docker_id": "c746bf8f9aadb4d5a3577fb67f34029c07c03607a4979779854dd59f373ef5b8"
	
You can gather information about it just by using the usual Docker CLI:

    $ docker inspect c746bf8f9aadb4d5a3577fb67f34029c07c03607a4979779854dd59f373ef5b8

    
