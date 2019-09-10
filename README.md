# Banana

The Banana project was forked from Kibana, and works with all kinds of time series (and non-time series) data stored in Apache Solr. It uses Kibana's powerful dashboard configuration capabilities, ports key panels to work with Solr, and provides significant additional capabilities, including new panels that leverage D3.js.

The goal is to create a rich and flexible UI, enabling users to rapidly develop end-to-end applications that leverage the power of Apache Solr. Data can be ingested into Solr through a variety of ways, including LogStash, Flume and other connectors.

## Requirements

* [Apache Solr](https://lucene.apache.org/solr/)
* [Node.js](https://nodejs.org)
* [Grunt](https://gruntjs.com/) for building distribution version

## Installation

To install and run Banana, clone the repository and follow the following steps:

* Download Solr and run it on port 8983

* Open a terminal window and run:

```sh
cd $BANANA_HOME
npm install
npm start
```

where `BANANA_HOME` is the directory of the local repository

## Building the distribution

To build the distribution version, clone the repository and run:

```sh
cd $BANANA_HOME
npm install
grunt build
cd dist
bin/banana
```

* In a browser, navigate to [http://localhost:9901](http://localhost:9901)

## Other installation options

Other installation options are available on the [official repository](https://github.com/lucidworks/banana).

## Trademarks

Kibana is a trademark of Elasticsearch BV  
Logstash is a trademark of Elasticsearch BV
