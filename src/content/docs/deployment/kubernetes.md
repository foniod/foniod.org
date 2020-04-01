# Kubernetes

Monitoring a Kubernetes cluster is easy based on the YAML files that
are in the InGRAINd repository.

You can use the following
[containers](https://quay.io/repository/redsift/ingraind?tag=latest&tab=tags)
built from the InGRAINd releases for various platforms:
 
 * `latest-gke`: Google Container Optimized OS (COS)
 * `latest-amzn2`: Amazon Linux 2
 * `latest-fedora31`: Fedora 31
 * `latest-elrepo8`: CentOS8/Epel
 * `latest-elrepo7`: CentOS7/Epel
 * `latest-ubuntu-18.04`: Ubuntu 18.04

For deploying InGRAINd on Google Kubernetes Engine, use the
`latest-gke` flavor, targeting Container Optimized OS (COS).

When using Amazon Elastic Kubernetes Service (EKS), use
`latest-amzn2`, which also works on Amazon Linux VMs as a privileged
Docker container.

InGRAINd requires access to system folders and eBPF-related system
calls, therefore it needs to run as a privileged container.

To deploy InGRAINd on Kubernetes, adjust the `ingraind.yaml` file with
the correct flavor of the containers for your host operating system,
and use the usual deployment ritual:

	kubectl apply -f config.yaml
	kubectl apply -f ingraind.yaml

Refer to the pages on [configuration](/docs/configuration/syntax/) and the example
[`config.toml`](https://github.com/redsift/ingraind/blob/master/config.toml.example)
for fine-tuning `config.yaml`.

