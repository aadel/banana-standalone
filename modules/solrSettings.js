var fs = require("fs");
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var solrUrl, basicAuth, username, password;

if (process.env.BANANA_SOLR_HOST)
    solrUrl = 'http://' + process.env.BANANA_SOLR_HOST + ':8983';
else if (config.solrUrl)
    solrUrl = config.solrUrl;
else
    solrUrl = 'http://localhost:8983';

if (config.basicAuth === true) {
    basicAuth = true;
    username = config.username;
    password = config.password;
}

console.log('solrUrl: %s', solrUrl);

module.exports = {
    solrUrl: solrUrl,
    basicAuth: basicAuth,
    username: username,
    password: password};