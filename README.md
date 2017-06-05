# easy-sync

This tool is used to sync your dev code to remote test server.

## Why easy-sync?

I'm a web developer. Sometimes wrote some `php` scripts or backend templates.
These scripts have no need to compile, all i have to do is, copy to the test server, refresh the webpage or use `curl` to test the interface.

Below is how i do to copy the files to the remote test server:

``` bash
scp -p 6666 test.php root@192.168.45.1:/var/www/app/

## then enter the remote server password
```
The copy step will be verbose when you edit very often. Type the scp command,
then input the server password. Sometimes unacceptable!

What if i edited a file, some tool will help me copy to the test server without
password? Sounds nice!

## How to use?

### rquirements

* `Node^6.9`
* `sshpass`

### install the tool

```
npm install -g easy-sync2
```

### config your sessions /root/.easy-sync.rc

```
dev:
  user: root
  host: 192.168.0.2
  port: 61209
  password: xxxx
  local-path: ~/app
  remote-path: /var/www/app
test:
.
.
```

### watch and sync your code

``` bash
easy-sync -s -n dev  # sync code
```

## Examples

### check easy-sync version
```
easy-sync -v|--version
```

### watch and sync your code
``` bash
easy-sync -sn dev

```

### check sesion conf

```

easy-snc -l [sessionName]

```

### get sshPass login cmd

```
easy-sync -S -name dev

# output : sshpass -p password ssh -p port  user@host
```
