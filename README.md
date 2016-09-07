# Simple Standalone Consul Client
This is a overly simple consul client for modifying consul nginx redirect data. 

This standalone consul client to be run on consul host server for manipulating URLs key/values.  As of consul v0.6.4, CORS will not function as [it is documented](https://www.consul.io/docs/agent/options.html) and OPTIONS verb is not handled properly for PUT and possibly others.  So in other words run this on the server it will ReST to as it is unable to handle CRSS.

# Installation
Drop these two files into a consul server's /usr/share/consul-ui such that they can be reached from ${SERVER}/ui/test.html
