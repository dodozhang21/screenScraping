// tutorial http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs
// https://github.com/MatthewMueller/cheerio

// instructions
// npm install request cheerio requirejs promised-io

var censusUrl = 'http://www.ssa.gov/cgi-bin/namesbystate.cgi';

var csvSaveLocation = 'censusBabyNamesState.txt';
// below should be the drop down values for the states selection
var states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
var year = 2012;
var postHeaders = {'content-type' : 'application/x-www-form-urlencoded'};
var dataTableSelector = 'table[width="72%"]';


// dependencies
var request = require('request');
var cheerio = require('cheerio');
var requirejs = require('requirejs');
var fs = require('fs');
var promiseIo = require("promised-io/promise");
var Deferred = promiseIo.Deferred;


requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});


requirejs(['lib/censusBabyNamesFunctions'], function(fct) {

	// use an array of promises for all of the async calls
	// https://github.com/kriszyp/promised-io
	var allStates = [];
	for(var i = 0; i < states.length; i++) {
		allStates[i] = new Deferred();
	}

	// when all of the async call return
	var group = promiseIo.all(allStates);
	group.then(function(array){
		var csv = "";
		for(var i = 0; i < array.length; i++) {
			var stateCode = array[i].stateCode;
			var rows = array[i].rows;

			for(var j = 0; j < rows.length; j++) {
				var row = rows[j];

				if(row.maleName !== undefined) {
					csv += stateCode + ',';
					csv += row.rank + ',';
					csv += '0,'; // for gender id
					csv += row.maleName + ',';
					csv += row.maleBirths + '\n';
				}

				if(row.femaleName !== undefined) {
					csv += stateCode + ',';
					csv += row.rank + ',';
					csv += '1,'; // for gender id
					csv += row.femaleName + ',';
					csv += row.femaleBirths + '\n';
				}

			}
		}

		fct.writeFile(fs, csvSaveLocation, csv);
	});

    for(var i = 0; i < states.length; i++) {
		var stateCode = states[i];

		// ensure the scope of stateCode, wrap code in IIFE
		(function(stateCode, stateSpecificPromise) {
		
			// the post calls are async!!!
			request.post({
				headers: postHeaders,
				url:     censusUrl,
				body:    'state=' + stateCode + '&year=' + year
			}, 
			
				function(error, response, body){
					if (error) throw error;

					
					$ = cheerio.load(body);

					var dataTable = $(dataTableSelector);

					// make sure it's hitting the correct pages
					// console.log($(dataTable).find('caption').html());

					var rows = parseData(dataTable);

					// for progress
					console.log(stateCode + ' is done');

					//console.log(allStates[stateCode]);
					stateSpecificPromise.resolve({
													'stateCode': stateCode
														,'rows': rows
												});

				}
			);
		
		})(stateCode, allStates[i]);
		
		

	} // end of for



	function parseData(dataTable) {
		var rows = [];
		var trs = $(dataTable).find('tr');

		$(trs).each(function() {
			var tr = $(this);

			var tds = $(tr).find('td');

			// expects the first column to be a number (rank)
			if($(tds).eq(0) !== undefined
				&& fct.isNumeric($(tds.eq(0)).text())) {

				// create the dataRecord obj
				var dataRecord = {};

				var col1 = $(tds.eq(0)).text()
					,col2 = $(tds.eq(1)).text()
					,col3 = $(tds.eq(2)).text()
					,col4 = $(tds.eq(3)).text()
					,col5 = $(tds.eq(4)).text()
					;

				// column 1
				dataRecord.rank = col1
				// column 2
				if(fct.isNotBlank(col2)) dataRecord.maleName = col2;
				// column 3
				if(fct.isNotBlank(col3)) dataRecord.maleBirths = col3.replace(",","");
				// column 4
				if(fct.isNotBlank(col4)) dataRecord.femaleName = col4;
				// column 5
				if(fct.isNotBlank(col5)) dataRecord.femaleBirths = col5.replace(",","");

				// add to array
				rows.push(dataRecord);

			}

		}); // after row loop

		return rows;
	}


});


