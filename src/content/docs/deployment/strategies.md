# Deployment Strategies

The best deployment strategy for your environment depends on a few factors.
Whether you want to monitor containers, the orchestration service
you're running, and the amount of automation you already have, there
are a few routes to go.

# An abundance of containers

To monitor containers across your fleet, you can use the native
[Kubernetes](../kubernetes/) support. This comes packaged suitable for
your environment and there's no need to install drivers or kernel
modules if you're on one of the big cloud providers.

# A fleet of VMs

To provision InGRAINd as part of your VM fleet, or
[Packer](https://packer.io) images, you're best off taking inspiration
from the [Ansible](../ansible/) rules, or using the integrations.

Ansible integrates neatly with both
[Packer](https://packer.io/docs/provisioners/ansible.html) and
[Terraform](https://www.redhat.com/en/resources/hashicorp-terraform-ansible-infrastructure-as-code-overview)
through their modular environments.
