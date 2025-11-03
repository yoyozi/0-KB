---
title: "Ansible Server Setup and Management Guide"
description: "Complete guide for setting up and managing servers with Ansible, covering installation, playbooks, inventory management, roles, and automation best practices"
tags:
  - ansible
  - devops
  - automation
  - server-management
  - linux
  - ubuntu
  - centos
  - infrastructure-as-code
  - playbooks
  - yaml
date: "2024-11-03T00:00:00.000Z"
lastUpdated: "2024-11-03T00:00:00.000Z"
---

# Ansible Server Setup and Management Guide

A comprehensive guide for automating server configuration and management using Ansible.

## Table of Contents

- [Initial Setup](#initial-setup)
- [Installation](#installation)
- [Basic Configuration](#basic-configuration)
- [Playbooks](#playbooks)
- [Inventory Management](#inventory-management)
- [Conditionals and Tags](#conditionals-and-tags)
- [File Management](#file-management)
- [Service Management](#service-management)
- [User Management](#user-management)
- [Role-Based Ansible](#role-based-ansible)
- [Best Practices](#best-practices)

## Initial Setup

### Generate SSH Keys for Admin and Ansible User

```bash

# Generate default key

ssh-keygen -t ed25519 -C "craig default"

# Generate user-specific keys

ssh-keygen -f craigkey -t ed25519 -C "Craig_user"
ssh-copy-id -i ~/.ssh/craigkey.pub craig@10.10.77.7

ssh-keygen -f mrplodkey -t ed25519 -C "Mrplod_user"

ssh-keygen -f webuser -t ed25519 -C "webUser"
ssh-copy-id -i ~/.ssh/webuser.pub craig@axweb

```

### Setup Git Repository

```bash

# Check if git is installed

which git

# Install git if needed

sudo apt install git

# Clone repository

git clone git@github.com:yoyozi/ansibe_pibuild.git

# Configure git identity

git config --global user.name "Craig Leppan"
git config --global user.email "craig@yoyozi.com"

```

## Installation

### Installing Ansible

```bash

# Update package index

sudo apt update

# Install ansible via apt

sudo apt install ansible

# If you get ModuleNotFoundError, install via pip

sudo pip3 install ansible

# Upgrade pip if needed

sudo /usr/local/bin/python3.8 -m pip install --upgrade pip

```

## Basic Configuration

### Adding Inventory File

```bash

# Add inventory file to git

git add inventory
git commit -m "Added inventory file"
git push origin main

```

### Test Connection with Ping

```bash

# Ping all hosts in inventory

ansible all --key-file ~/.ssh/ansible -i inventory -m ping

```

### Creating ansible.cfg

```ini
[defaults]
inventory = inventory
private_key_file = ~/.ssh/ansible
deprecation_warnings = False

```

### Basic Commands

```bash

# Ping all hosts (using ansible.cfg)

ansible all -m ping

# List all hosts

ansible all --list-hosts

# Gather facts from all hosts

ansible all -m gather_facts

# Gather facts from specific host

ansible all -m gather_facts --limit 10.10.77.7

```

## Running Commands with Elevated Privileges

### Package Management

```bash

# Update package cache

ansible all -m apt -a update_cache=true --become --ask-become-pass

# Install vim-nox

ansible all -m apt -a name=vim-nox --become --ask-become-pass

# Install tmux

ansible all -m apt -a name=tmux --become --ask-become-pass

# Install latest version of tmux

ansible all -m apt -a "name=tmux state=latest" --become --ask-become-pass

# Upgrade distribution

ansible all -m apt -a "upgrade=dist" --become --ask-become-pass

# Update all packages to latest

ansible all -m apt -a "name=* state=latest" --become --ask-become-pass

```

## Playbooks

### Basic Apache Installation Playbook

**Version 1: Simple Installation**

```yaml
---
- hosts: all
  become: true
  tasks:

  - name: install apache2 package
    apt:
      name: apache2

```

**Run the playbook:**

```bash
ansible-playbook --ask-become-pass install_apache.yml

```

**Version 2: With Cache Update**

```yaml
---
- hosts: all
  become: true
  tasks:

  - name: update repository index
    apt:
      update_cache: yes

  - name: install apache2 package
    apt:
      name: apache2

```

**Version 3: With PHP Support**

```yaml
---
- hosts: all
  become: true
  tasks:

  - name: update repository index
    apt:
      update_cache: yes

  - name: install apache2 package
    apt:
      name: apache2

  - name: add php support for apache
    apt:
      name: libapache2-mod-php

```

**Version 4: With Latest State**

```yaml
---
- hosts: all
  become: true
  tasks:

  - name: update repository index
    apt:
      update_cache: yes

  - name: install apache2 package
    apt:
      name: apache2
      state: latest

  - name: add php support for apache
    apt:
      name: libapache2-mod-php
      state: latest

```

### Remove Packages Playbook

```bash

# Copy and modify the install playbook

cp install_apache.yml remove_apache.yml

```

```yaml
---
- hosts: all
  become: true
  tasks:

  - name: remove apache2 package
    apt:
      name: apache2
      state: absent

  - name: remove php support for apache
    apt:
      name: libapache2-mod-php
      state: absent

```

## Conditionals and Tags

### Using When Conditionals

**Ubuntu-specific tasks:**

```yaml
---
- hosts: all
  become: true
  tasks:

  - name: update repository index
    apt:
      update_cache: yes
    when: ansible_distribution == "Ubuntu"

  - name: install apache2 package
    apt:
      name: apache2
      state: latest
    when: ansible_distribution == "Ubuntu"

  - name: add php support for apache
    apt:
      name: libapache2-mod-php
      state: latest
    when: ansible_distribution == "Ubuntu"

```

### Multi-Distribution Support

```yaml
---
- hosts: all
  become: true
  tasks:

  - name: update repository index
    apt:
      update_cache: yes
    when: ansible_distribution == "Ubuntu"

  - name: install apache2 package
    apt:
      name: apache2
      state: latest
    when: ansible_distribution == "Ubuntu"

  - name: add php support for apache
    apt:
      name: libapache2-mod-php
      state: latest
    when: ansible_distribution == "Ubuntu"

  - name: update repository index
    dnf:
      update_cache: yes
    when: ansible_distribution == "CentOS"

  - name: install httpd package
    dnf:
      name: httpd
      state: latest
    when: ansible_distribution == "CentOS"

  - name: add php support for apache
    dnf:
      name: php
      state: latest
    when: ansible_distribution == "CentOS"

```

### Refactored Version

```yaml
---
- hosts: all
  become: true
  tasks:

  - name: install apache2 and php packages for Ubuntu
    apt:
      name:
        - apache2
        - libapache2-mod-php
      state: latest
      update_cache: yes
    when: ansible_distribution == "Ubuntu"

  - name: install apache and php packages for CentOS
    dnf:
      name:
        - httpd
        - php
      state: latest
      update_cache: yes
    when: ansible_distribution == "CentOS"

```

### Using Package Module (Distribution-Agnostic)

```yaml
---
- hosts: all
  become: true
  tasks:

  - name: install apache and php
    package:
      name:
        - "{{ apache_package }}"
        - "{{ php_package }}"
      state: latest
      update_cache: yes

```

**Update inventory with variables:**

```ini
10.10.77.6 apache_package=apache2 php_package=libapache2-mod-php
10.10.77.7 apache_package=httpd php_package=php

```

## Inventory Management

### Targeting Specific Node Groups

**Inventory structure:**

```ini
[web_servers]
172.16.250.132
172.16.250.248

[db_servers]
172.16.250.133

[file_servers]
172.16.250.134

```

### Site-Wide Playbook with Groups

```yaml
---
- hosts: all
  become: true
  pre_tasks:

  - name: install updates (CentOS)
    dnf:
      update_only: yes
      update_cache: yes
    when: ansible_distribution == "CentOS"

  - name: install updates (Ubuntu)
    apt:
      upgrade: dist
      update_cache: yes
    when: ansible_distribution == "Ubuntu"

- hosts: web_servers
  become: true
  tasks:

  - name: install httpd package (CentOS)
    dnf:
      name:
        - httpd
        - php
      state: latest
    when: ansible_distribution == "CentOS"

  - name: install apache2 package (Ubuntu)
    apt:
      name:
        - apache2
        - libapache2-mod-php
      state: latest
    when: ansible_distribution == "Ubuntu"

- hosts: db_servers
  become: true
  tasks:

  - name: install mariadb server package (CentOS)
    dnf:
      name: mariadb
      state: latest
    when: ansible_distribution == "CentOS"

  - name: install mariadb server
    apt:
      name: mariadb-server
      state: latest
    when: ansible_distribution == "Ubuntu"

- hosts: file_servers
  become: true
  tasks:

  - name: install samba package
    package:
      name: samba
      state: latest

```

## Ansible Tags

Tags allow you to run specific parts of a playbook.

### Adding Tags to Tasks

```yaml
---
- hosts: all
  become: true
  pre_tasks:

  - name: install updates (CentOS)
    tags: always
    dnf:
      update_only: yes
      update_cache: yes
    when: ansible_distribution == "CentOS"

  - name: install updates (Ubuntu)
    tags: always
    apt:
      upgrade: dist
      update_cache: yes
    when: ansible_distribution == "Ubuntu"

- hosts: web_servers
  become: true
  tasks:

  - name: install httpd package (CentOS)
    tags: apache,centos,httpd
    dnf:
      name:
        - httpd
        - php
      state: latest
    when: ansible_distribution == "CentOS"

  - name: install apache2 package (Ubuntu)
    tags: apache,apache2,ubuntu
    apt:
      name:
        - apache2
        - libapache2-mod-php
      state: latest
    when: ansible_distribution == "Ubuntu"

- hosts: db_servers
  become: true
  tasks:

  - name: install mariadb server package (CentOS)
    tags: centos,db,mariadb
    dnf:
      name: mariadb
      state: latest
    when: ansible_distribution == "CentOS"

  - name: install mariadb server
    tags: db,mariadb,ubuntu
    apt:
      name: mariadb-server
      state: latest
    when: ansible_distribution == "Ubuntu"

- hosts: file_servers
  tags: samba
  become: true
  tasks:

  - name: install samba package
    tags: samba
    package:
      name: samba
      state: latest

```

### List Available Tags

```bash
ansible-playbook --list-tags site.yml

```

### Run Specific Tags

```bash

# Run only database tasks

ansible-playbook --tags db --ask-become-pass site.yml

# Run only CentOS tasks

ansible-playbook --tags centos --ask-become-pass site.yml

# Run only Apache tasks

ansible-playbook --tags apache --ask-become-pass site.yml

```

## File Management

### Copying Files to Remote Hosts

```yaml
---
- hosts: all
  become: true
  pre_tasks:

  - name: install terraform
    unarchive:
      src: https://releases.hashicorp.com/terraform/0.12.28/terraform_0.12.28_linux_amd64.zip
      dest: /usr/local/bin
      remote_src: yes
      mode: 0755
      owner: root
      group: root

- hosts: web_servers
  become: true
  tasks:

  - name: install apache2 package (Ubuntu)
    tags: apache,apache2,ubuntu
    apt:
      name:
        - apache2
        - libapache2-mod-php
      state: latest
    when: ansible_distribution == "Ubuntu"

  - name: copy html file for site
    tags: apache,apache2,httpd
    copy:
      src: default_site.html
      dest: /var/www/html/index.html
      owner: root
      group: root
      mode: 0644

```

**Run the playbook:**

```bash
ansible-playbook --ask-become-pass file_management.yml

```

## Service Management

### Starting and Enabling Services

```yaml
---
- hosts: web_servers
  become: true
  tasks:

  - name: install httpd package (CentOS)
    tags: apache,centos,httpd
    dnf:
      name:
        - httpd
        - php
      state: latest
    when: ansible_distribution == "CentOS"

  - name: start and enable httpd (CentOS)
    tags: apache,centos,httpd
    service:
      name: httpd
      state: started
      enabled: yes
    when: ansible_distribution == "CentOS"

  - name: install apache2 package (Ubuntu)
    tags: apache,apache2,ubuntu
    apt:
      name:
        - apache2
        - libapache2-mod-php
      state: latest
    when: ansible_distribution == "Ubuntu"

```

### Editing Configuration Files

```yaml
---
- hosts: web_servers
  become: true
  tasks:

  - name: change e-mail address for admin
    tags: apache,centos,httpd
    lineinfile:
      path: /etc/httpd/conf/httpd.conf
      regexp: '^ServerAdmin'
      line: ServerAdmin somebody@somewhere.net
    when: ansible_distribution == "CentOS"
    register: httpd

  - name: restart httpd (CentOS)
    tags: apache,centos,httpd
    service:
      name: httpd
      state: restarted
    when: httpd.changed

  - name: copy html file for site
    tags: apache,apache2,httpd
    copy:
      src: default_site.html
      dest: /var/www/html/index.html
      owner: root
      group: root
      mode: 0644

```

## User Management

### Creating Ansible User with Sudo Access

**Create sudoers file:**

```bash

# Content of sudoer_simone file

simone ALL=(ALL) NOPASSWD: ALL

```

**Update ansible.cfg:**

```ini
[defaults]
inventory = inventory
private_key_file = ~/.ssh/ansible
deprecation_warnings = False
remote_user = simone

```

**Bootstrap playbook:**

```yaml
---
- hosts: all
  become: true
  tasks:

  - name: create simone user
    user:
      name: simone
      groups: root

  - name: add ssh key for simone
    tags: always
    authorized_key:
      user: simone
      key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAe7/ofWLNBq+fRn3UmgAizdicLs9vcS4Oj8VSOD1S/ ansible"

  - name: add sudoers file for simone
    tags: always
    copy:
      src: sudoer_simone
      dest: /etc/sudoers.d/simone
      owner: root
      group: root
      mode: 0440

```

### Complete Bootstrap Example

```yaml
---
- hosts: all
  become: true
  pre_tasks:

  - name: install updates
    tags: update
    apt:
      upgrade: dist
      update_cache: yes

- hosts: all
  become: true
  tasks:

  - name: create mrplod user
    tags: anuser
    user:
      name: mrplod
      groups: sudo
      password: "your_encrypted_password"

  - name: add ssh key for mrplod
    tags: anuser
    authorized_key:
      user: mrplod
      key: "ssh-ed25519 YOUR_PUBLIC_KEY_HERE"

  - name: add sudoers file for mrplod
    tags: anuser
    copy:
      src: ./roles/base/files/sudoer_mrplod
      dest: /etc/sudoers.d/mrplod
      owner: root
      group: root
      mode: 0440

  - name: enable login via sshd
    tags: anuser
    lineinfile:
      path: /etc/ssh/sshd_config
      regexp: '^AllowUsers'
      line: AllowUsers craig mrplod

  - name: restart sshd service after edit
    tags: anuser
    service:
      name: sshd
      state: restarted

```

**Run bootstrap as root:**

```bash
ansible-playbook -u root -i inventory ./bootstrap.yml

```

### Site Playbook with changed_when

Using `changed_when: false` prevents reporting changes when none occur:

```yaml
---
- hosts: all
  become: true
  pre_tasks:

  - name: update repository index (CentOS)
    tags: always
    dnf:
      update_cache: yes
    changed_when: false
    when: ansible_distribution == "CentOS"

  - name: update repository index (Ubuntu)
    tags: always
    apt:
      update_cache: yes
    changed_when: false
    when: ansible_distribution == "Ubuntu"

- hosts: all
  become: true
  tasks:

  - name: add ssh key for simone
    authorized_key:
      user: simone
      key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAe7/ofWLNBq3+fRn3UmgAizdicLs9vcS4Oj8VSOD1S/ ansible"

- hosts: workstations
  become: true
  tasks:

  - name: install unzip
    package:
      name: unzip

  - name: install terraform
    unarchive:
      src: https://releases.hashicorp.com/terraform/0.12.28/terraform_0.12.28_linux_amd64.zip
      dest: /usr/local/bin
      remote_src: yes
      mode: 0755
      owner: root
      group: root

```

## Role-Based Ansible

Roles provide a way to organize playbooks and make them reusable.

### Role Structure

```

├── roles
│   ├── base
│   │   └── tasks
│   │       └── main.yml
│   ├── db_servers
│   │   └── tasks
│   │       └── main.yml
│   ├── file_servers
│   │   └── tasks
│   │       └── main.yml
│   ├── pi_servers
│   │   └── tasks
│   │       └── main.yml
│   ├── web_servers
│   │   └── tasks
│   │       └── main.yml
│   └── workstations
│       └── tasks
│           └── main.yml
├── site.yml
└── inventory

```

### Creating Role Directories

```bash
mkdir roles
mkdir -p roles/base/tasks
mkdir -p roles/web_servers/tasks
mkdir -p roles/db_servers/tasks
mkdir -p roles/file_servers/tasks
mkdir -p roles/workstations/tasks
mkdir -p roles/pi_servers/tasks

# Create main.yml in each role

touch roles/base/tasks/main.yml
touch roles/web_servers/tasks/main.yml
touch roles/db_servers/tasks/main.yml
touch roles/file_servers/tasks/main.yml
touch roles/workstations/tasks/main.yml
touch roles/pi_servers/tasks/main.yml

```

### Site Playbook with Roles

```yaml
---
- hosts: all
  become: true
  pre_tasks:

  - name: update repository index (Ubuntu)
    tags: always
    apt:
      update_cache: yes
    changed_when: false
    when: ansible_distribution == "Ubuntu"

- hosts: all
  become: true
  roles:
    - base

- hosts: workstations
  become: true
  roles:
    - workstations

- hosts: web_servers
  become: true
  roles:
    - web_servers

- hosts: pi_servers
  become: true
  roles:
    - pi_servers

- hosts: psqldb_servers
  become: true
  roles:
    - psqldb_servers

- hosts: mongodb_server
  become: true
  roles:
    - mongodb_server

```

### Inventory for Roles

```ini
[base]
139.162.240.45

[nginx]

[pi_servers]

[file_servers]

[mariadb_servers]

[psqldb_servers]

[workstations]

[mongodb_servers]

```

### Running Role-Based Playbooks

```bash
ansible-playbook site_roles.yml

```

### Role Task Files

All tasks that were in the main site.yml are moved to `roles/<role_name>/tasks/main.yml`.

All required files are placed in `roles/<role_name>/files/`.

## Best Practices

1. **Use roles** for better organization and reusability
2. **Tag your tasks** for selective execution
3. **Use variables** in inventory for flexibility
4. **Implement idempotency** - tasks should be safe to run multiple times
5. **Use `changed_when`** to control change reporting
6. **Keep secrets secure** - use Ansible Vault for sensitive data
7. **Test in development** before running in production
8. **Document your playbooks** with clear task names
9. **Use version control** for all Ansible code
10. **Follow YAML best practices** - consistent indentation and structure
