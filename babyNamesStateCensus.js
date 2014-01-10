// tutorial http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs
// https://github.com/MatthewMueller/cheerio

// instructions
// npm install request cheerio

var censusUrl = 'http://www.ssa.gov/cgi-bin/namesbystate.cgi';

var states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
var year = 2012;
var stateTableSelector = 'table[width="72%"]';


// depencies
var request = require('request');
var cheerio = require('cheerio');

//for(var i = 0; i < states.length; i++) {
for(var i = 0; i < 1; i++) {
	var stateCode = states[i];

	var url = censusUrl + '?state=' stateCode + '&year=' + year;

	request(url, function(err, resp, body) {
        if (err)
            throw err;
        $ = cheerio.load(body);
		var dataTable = $(stateTableSelector);
        console.log(dataTable);
        // TODO: scraping goes here!
    });

}
