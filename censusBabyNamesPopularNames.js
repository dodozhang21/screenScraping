// tutorial http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs
// https://github.com/MatthewMueller/cheerio

// instructions
// npm install request cheerio requirejs

var censusUrl = 'http://www.ssa.gov/cgi-bin/popularnames.cgi';

var csvSaveLocation = 'censusBabyNamesPopularNames.txt';
var year = 2012;
var topHowMany = 100;
var postVarsForPercentBirths = "year="+year+"&top="+topHowMany+"&number=p";
var postVarsForTotalBirths = "year="+year+"&top="+topHowMany+"&number=n";
var postHeaders = {'content-type' : 'application/x-www-form-urlencoded'};
var dataTableSelector = 'table[summary="Popularity for top 100"]';


// dependencies
var request = require('request');
var cheerio = require('cheerio');
var requirejs = require('requirejs');
var fs = require('fs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});


requirejs(['lib/censusBabyNamesFunctions'], function(fct) {

	var rows = [];

	// total births
	request.post({
		headers: postHeaders,
		url:     censusUrl,
		body:    postVarsForTotalBirths
	}, function(error, response, body){
		if (error) throw error;
		$ = cheerio.load(body);
		var dataTable = $(dataTableSelector);

		parseData(dataTable);

		// for progress
		console.log('byTotalBirths is done');

		// percent births
		request.post({
			headers: postHeaders,
			url:     censusUrl,
			body:    postVarsForPercentBirths
		}, function(error, response, body){
			if (error) throw error;
			$ = cheerio.load(body);
			var dataTable = $(dataTableSelector);

			parseData(dataTable);

			// for progress
			console.log('byPercentBirths is done');

			var csv = "";
			for(var i = 0; i < rows.length; i++) {
				var row = rows[i];

				csv += row.rank + ',';
				csv += '0,'; // gender id
				csv += row.maleName + ',';
				csv += row.maleBirths + ',';
				csv += row.malePercentBirths + '\n';

				
				csv += row.rank + ',';
				csv += '1,'; // gender id
				csv += row.femaleName + ',';
				csv += row.femaleBirths + ',';
				csv += row.femalePercentBirths + '\n';
			}

			fct.writeFile(fs, csvSaveLocation, csv);
			
		});

		
	});

	function parseData(dataTable) {
		var trs = $(dataTable).find('tr');

		var index = 0;
		$(trs).each(function() {
			var tr = $(this);

			var tds = $(tr).find('td');

			// expects the first column to be a number (rank)
			if($(tds).eq(0) !== undefined
				&& fct.isNumeric($(tds.eq(0)).text())) {

				// create the dataRecord obj
				var dataRecord = rows[index];
				if(dataRecord === undefined) {
					dataRecord = {};
				}

				var col1 = $(tds.eq(0)).text()
					,col2 = $(tds.eq(1)).text()
					,col3 = $(tds.eq(2)).text()
					,col4 = $(tds.eq(3)).text()
					,col5 = $(tds.eq(4)).text()
					;

				// column 1
				dataRecord.rank = col1;
				// column 2
				dataRecord.maleName = col2;
				// column 3
				if(col3.indexOf('%') === -1) {
					dataRecord.maleBirths = col3.replace(",","");
				} else {
					dataRecord.malePercentBirths = col3.replace("%","");
				}
				// column 4
				dataRecord.femaleName = col4;
				// column 5
				if(col5.indexOf('%') === -1) {
					dataRecord.femaleBirths = col5.replace(",","");
				} else {
					dataRecord.femalePercentBirths = col5.replace("%","");
				}

				// add to array
				rows.push(dataRecord);

				index++;

			}

		}); // after row loop
	}

});