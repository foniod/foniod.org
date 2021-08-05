# Ansible

InGRAINd provides [Ansible](https://ansible.com) roles [in the
repository](https://github.com/redsift/foniod/tree/master/ansible/roles/foniod)
that you can lift and integrate into your deployment systems.

The role installs OSQuery by default on compatible systems, which
means you can use the InGRAINd - OSQuery bridge to gather a wide range
of system statistics using a single [configuration
file](https://github.com/redsift/foniod/blob/master/ansible/roles/foniod/templates/etc/foniod/foniod.toml.j2).

## Configuration

To keep configuration as simple as possible, the role relies on the
following
[variables](https://github.com/redsift/foniod/blob/master/ansible/roles/foniod/vars/main.yml):

    foniod_circleci_url
	foniod_circleci_sha256
	foniod_http_api_key
	foniod_http_uri
	
By default the agent will send events to an HTTP backend periodically.

## SystemD

The Ansible role, by default, deploys a [SystemD service
file](`https://github.com/redsift/foniod/blob/master/deploy/ansible/roles/foniod/templates/etc/systemd/system/foniod.service.j2`)
and configures it to use the configuration location for
[`/etc/foniod/foniod.toml`](https://github.com/redsift/foniod/blob/master/deploy/ansible/roles/foniod/templates/etc/foniod/foniod.toml.j2).

## Keeping up-to-date

To keep InGRAINd up-to-date, we will reference the URL and hash of the
latest stable release in the repository's [variables
file](https://github.com/redsift/foniod/blob/master/ansible/roles/foniod/vars/main.yml),
so you can synchronise the role and override the default variables in
your deployment.
