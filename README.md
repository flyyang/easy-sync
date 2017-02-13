# easy-sync

This tool is used to sync your dev code to remote test server.

## Why easy sync?

I'm a web developer. Sometimes write some `php` scripts or backend templates.
These scripts have no need to compile, all i have to do is, copy to the test 
server, refresh the webpage or use `curl` to test the interface.
 
Below is how i do to copy the files to the remote test server: 

``` bash
scp -p 6666 test.php root@192.168.45.1:/var/www/app/ 

## enter the remote server password
```
The copy step will be verbose when you edit very often. Type the scp command, 
then input the server password. Sometimes unacceptable!

What if i edited a file, some tool will help me copy to the test server without
password? Sounds nice!

[inotify](https://github.com/rvoicilas/inotify-tools/wiki) and `sshpass` will 
help us do this. `inotify` to watch files, sshpass combine scp to copy the 
changed files.

## Who can use this tool?

Currently, this tool is only support linux(centos).

## How to use?

### install the tool

```
./install.sh ## install the tool
```

### config the enviroment

### open a tab to watch and cp to remote server

