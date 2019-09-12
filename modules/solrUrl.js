var fs = require("fs");
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var solrUrl;

if (process.env.BANANA_SOLR_HOST)
    solrUrl = 'http://' + process.env.BANANA_SOLR_HOST + ':8983';
else if (config.solrUrl)
    solrUrl = config.solrUrl;
else
    solrUrl = 'http://localhost:8983';

console.log('solrUrl: %s', solrUrl);

module.exports = solrUrl;