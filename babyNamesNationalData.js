var $;
function isNumeric(input) {
    return (input - 0) == input && (input+'').replace(/^\s+|\s+$/g, "").length > 0;
}
function supportHtml5Storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}
// Add jQuery
(function(){
    if (typeof window.jQuery === 'undefined') {
        var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
            GM_JQ = document.createElement('script');

        GM_JQ.src = '//code.jquery.com/jquery-latest.min.js';
        GM_JQ.type = 'text/javascript';
        GM_JQ.async = true;

        GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
    }
    GM_wait();
})();

// Check if jQuery's loaded
function GM_wait() {
    if (typeof window.jQuery === 'undefined') {
        window.setTimeout(GM_wait, 100);
    } else {
        $ = window.jQuery.noConflict(true);
        letsJQuery();
    }
}

// All your GM code must be inside this function
function letsJQuery() {
    if(!supportHtml5Storage()) {
        alert('You must run this script in a brower that supports local storage!');
    }

    //localStorage.clear();

    // define data table, update if html changed
    var dataTable = $('table[summary="Popularity for top 100"]').get(0);

    var trs = $(dataTable).find('tr');

    var rows = localStorage.getItem('babyNamesNationalData');
    if(rows === null) {
        rows = [];
    } else {
        rows = JSON.parse(rows);
    }

    var index = 0;
    $(trs).each(function() {
        var tr = $(this);

        var tds = $(tr).find('td');

        // expects the first column to be a number (rank)
        if($(tds).get(0) !== undefined
            && isNumeric($(tds.get(0)).text())) {

            // create the dataRecord obj
            var dataRecord = rows[index];
            if(dataRecord === undefined) {
                dataRecord = {};
            }

            // column 1
            dataRecord.rank = $(tds.get(0)).text();
            // column 2
            dataRecord.maleName = $(tds.get(1)).text();
            // column 3
            var thirdColumn = $(tds.get(2)).text();
            if(thirdColumn.indexOf('%') === -1) {
                dataRecord.maleBirths = thirdColumn.replace(",","");
            } else {
                dataRecord.malePercentBirths = thirdColumn.replace("%","");
            }
            // column 4
            dataRecord.femaleName = $(tds.get(3)).text();
            // column 5
            var fifthColumn = $(tds.get(4)).text();
            if(fifthColumn.indexOf('%') === -1) {
                dataRecord.femaleBirths = fifthColumn.replace(",","");
            } else {
                dataRecord.femalePercentBirths = fifthColumn.replace("%","");
            }

            // add to array
            rows.push(dataRecord);

            index++;

        }

    }); // after row loop

    localStorage.setItem(
        'babyNamesNationalData',
        JSON.stringify(rows)
    );

    console.log(JSON.parse(
        localStorage.getItem('babyNamesNationalData')
    ));
}