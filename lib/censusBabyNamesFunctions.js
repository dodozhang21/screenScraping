define(function () {
    //Do setup work here

    return {
        isNumeric: function(input) {
			return (input - 0) == input && (input+'').replace(/^\s+|\s+$/g, "").length > 0;
		},
		trim: function(str){
			str = ""+str; // convert to string
			return str.replace(/^\s+|\s+$/g, '');
		},
		isNotBlank: function(str) {
			return this.trim(str) !== '';
		},
		writeFile: function(fs, csvSaveLocation, csv) {
			fs.writeFile(csvSaveLocation, csv, function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log("The file has been saved to '" + csvSaveLocation + "'!");
				}
			}); 
		}
    }
});