# Ansible

InGRAINd provides [Ansible](https://ansible.com) roles [in the
repository](https://github.com/redsift/ingraind/tree/master/ansible/roles/ingraind)
that you can lift and integrate into your deployment systems.

The role installs OSQuery by default on compatible systems, which
means you can use the InGRAINd - OSQuery bridge to gather a wide range
of system statistics using a single [configuration
file](https://github.com/redsift/ingraind/blob/master/ansible/roles/ingraind/templates/etc/ingraind/ingraind.toml.j2).

## Configuration

To keep configuration as simple as possible, the role relies on the
following
[variables](https://github.com/redsift/ingraind/blob/master/ansible/roles/ingraind/vars/main.yml):

    ingraind_circleci_url
	ingraind_circleci_sha256
	ingraind_http_api_key
	ingraind_http_uri
	
By default the agent will send events to an HTTP backend periodically.

## SystemD

The Ansible role, by default, deploys a [SystemD service
file](`https://github.com/redsift/ingraind/blob/master/deploy/ansible/roles/ingraind/templates/etc/systemd/system/ingraind.service.j2`)
and configures it to use the configuration location for
[`/etc/ingraind/ingraind.toml`](https://github.com/redsift/ingraind/blob/master/deploy/ansible/roles/ingraind/templates/etc/ingraind/ingraind.toml.j2).

## Keeping up-to-date

To keep InGRAINd up-to-date, we will reference the URL and hash of the
latest stable release in the repository's [variables
file](https://github.com/redsift/ingraind/blob/master/ansible/roles/ingraind/vars/main.yml),
so you can synchronise the role and override the default variables in
your deployment.
