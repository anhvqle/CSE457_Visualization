

// Function to convert date objects to strings or reverse
var dateFormatter = d3.timeFormat("%Y-%m-%d");
var dateParser = d3.timeParse("%Y-%m-%d");

// (1) Load data asynchronously
var files = ["data/perDayData.json", "data/myWorldFields.json"];
var promises = [];

files.forEach(function(url){
	promises.push(d3.json(url))
});

Promise.all(promises).then(function(values){
	console.log(values);
	createVis(values[0], values[1]);
});

function createVis(perDayData, metaData){

	// (2) Make our data look nicer and more useful
	var allData = perDayData.map(function (d, index) {
		
		var result = {
			time: dateParser(d.day),
			count: +d["count(*)"] + 1
		};

		// Convert votes for the 15 priorities from key-value format into one single array (for each day)
		result.priorities = d3.range(0,15).map(function(counter){
			return d["sum(p"+counter+")"]
		});

		// Create an array of values for age 0 - 99
		result.ages = d3.range(0,99).map(function(){
			return 0;
		});

		// Insert the votes in the newly created array 'result.ages'
		d.age.forEach(function(a){
			if(a.age < 100){
				result.ages[a.age] = a["count(*)"];
			}
		})
		return result;

	});

	// (3) Create event handler
	var myEventHandler = {};

	// (4) Create visualization instances
	var countVis = new CountVis("countvis", allData, myEventHandler); //context
    let ageVis = new AgeVis("agevis", allData);
    let prioVis = new PrioVis("priovis", allData, metaData);

	// *** TO-DO ***
	// (5) Bind event handler
    $(myEventHandler).bind("selectionChanged", function(event, rangeStart, rangeEnd){
        ageVis.onSelectionChange(rangeStart, rangeEnd);
    });

    $(myEventHandler).bind("selectionChanged", function(event, rangeStart, rangeEnd){
        prioVis.onSelectionChange(rangeStart, rangeEnd);
    });
}
