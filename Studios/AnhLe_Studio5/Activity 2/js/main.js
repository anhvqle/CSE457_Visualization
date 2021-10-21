
// SVG drawing area

var margin = {top: 40, right: 10, bottom: 60, left: 60};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Initialize data
loadData();

// Create a 'data' property under the window object
// to store the coffee chain data
Object.defineProperty(window, 'data', {
	// data getter
	get: function() { return _data; },
	// data setter
	set: function(value) {
		_data = value;
		// update the visualization each time the data property is set by using the equal sign (e.g. data = [])
		updateVisualization()
	}
});

// axis g
var g1 = svg.append("g");
var g2 = svg.append("g");

// Scales
var xScale = d3.scaleBand()
    .rangeRound([0, width])
	.paddingInner(0.1);

var yScale = d3.scaleLinear()
    .range([height, 0]);

var yAxis = d3.axisLeft()
var xAxis = d3.axisBottom()

let rankingType = "stores";


// Load CSV file
function loadData() {
	
	d3.csv("data/coffee-house-chains.csv").then(function(csv) {

		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});

		// Store csv data in global variable
		data = csv;
		// console.log(data)
		// updateVisualization gets automatically called within the data = csv call;
		// basically(whenever the data is set to a value using = operator);
		// see the definition above: Object.defineProperty(window, 'data', { ...

	});
}

d3.select("#ranking-type").on("change", () => {
    rankingType = d3.select("#ranking-type").property("value");
	updateVisualization();
});


// Render visualization
function updateVisualization() {
    data.sort((a, b) => b[rankingType] - a[rankingType]);
    xScale.domain(data.map((d) => d.company))
	yScale.domain([0, d3.max(data, (d) => d[rankingType])])
	yAxis.scale(yScale);
	xAxis.scale(xScale).ticks(10);

    const rect = svg.selectAll("rect").data(data);
    rect.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.company))
        .attr("width", xScale.bandwidth())
        .transition()
        .duration(750)
        .attr("y", (d) => yScale(d[rankingType]))
        .attr("height", (d) => height - yScale(d[rankingType]))

    rect.exit().remove();
		
	g1.attr("class", "axis x-axis")
	.transition()
		.call(xAxis)
		.attr("transform", "translate(" + 0 + "," + height + ")");

	g2.attr("class", "axis-label").transition().call(yAxis);

    svg.select(".axis-title").remove();
	svg.append("text")
        .attr("class", "axis-title")
        .attr("text-anchor", "end")
        .attr("x", 10)
        .attr("y", -10)
        .text(rankingType == "stores" ? "Stores" : "Billion USD");
}