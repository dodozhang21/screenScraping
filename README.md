screenScraping
==============

Blog Entry: http://pure-essence.net/2014/01/11/screen-scraping-census-baby-name-data-with-nodejs-cheeriojquery-and-promises/

Presented at CIJUG 2014 March meeting: http://cijug.net/meeting/2013/12/01/december/

Screen scrape census popular baby names website and generate csv

Screen scrape census popular baby names by state website and generate csv

instructions
============

Require nodejs

	> npm install request cheerio requirejs promised-io

Open js and update variables

	> node censusBabyNamesPopularNames.js

Open js file and update variables

	> node censusBabyNamesState.js


concepts
============
Examine scope.js and run:

	> node scope

Expected it to print 5 distinct states but it prints CA 5 times.  This is because request calls are async (think of them as ajax calls). When the callbacks are executed once the requests return, the variable stateCode contains its latest value (CA) in the for loop.

To remedy the issue, examine scopeFix.js and run:

	> node scopeFix

Wrapping the request executions in IIFE allows the scope of the variable stateCode/sc to be maintained. Imagine each IIFE as a bubble that reserves each value of stateCode in the loop for each of the request callback to use. To learn more about IIFE, http://benalman.com/news/2010/11/immediately-invoked-function-expression/

Although the scope is fixed, the order of the states printed out is not in the same order as the states array. This is because since each request is an async call, there is no guarantee when it returns.

To remedy the issue and allow execution of code after all async calls return, we leverage promises.

Examine promiseEx.js.  A promise is like a token that you associate with an async call.  The call then "promises" to return back to you an result when it's done.

	var d = new Deferred();		// a token
	d.resolve({			// returns the promise
		'stateCode': sc
		,'data': sc + ' page parsed data'
	});

When all returned:

	var group = promiseIo.all(allStates);
	group.then(function(array) {
		// my array of json objects from the .resolve
	});
