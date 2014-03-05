var censusUrl = 'http://www.ssa.gov/cgi-bin/namesbystate.cgi';
var states = ['AL', 'AK', 'AZ', 'AR', 'CA'];


var request = require('request');


for(var i = 0; i < states.length; i++) {
	var stateCode = states[i];

	var url = censusUrl + '?state=' + stateCode;

	request(url, function(err, resp, body) {

		console.log(stateCode);
	
	});
}