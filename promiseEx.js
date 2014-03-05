var censusUrl = 'http://www.ssa.gov/cgi-bin/namesbystate.cgi';
var states = ['AL', 'AK', 'AZ', 'AR', 'CA'];


var request = require('request');

var promiseIo = require("promised-io/promise");
var Deferred = promiseIo.Deferred;

// create an array of promises
var allStates = [];
for(var i = 0; i < states.length; i++) {
	allStates[i] = new Deferred();
}

// allow the corresponding promise to resolve per async call
for(var i = 0; i < states.length; i++) {
	var stateCode = states[i];

	(function(sc, stateSpecificPromise) {
		var url = censusUrl + '?state=' + sc;

		request(url, function(err, resp, body) {

			stateSpecificPromise.resolve({
				'stateCode': sc
					,'data': sc + ' page parsed data'
			});
		
		});
	})(stateCode, allStates[i]);
}

// when all promises returned
var group = promiseIo.all(allStates);
group.then(function(array){
	for(var i = 0; i < array.length; i++) {

		console.log('stateCode: ' + array[i].stateCode + ', data: ' + array[i].data);

	}
});