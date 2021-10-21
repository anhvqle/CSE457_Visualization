
/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

PrioVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.filteredData = this.data;

    this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

PrioVis.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 20, right: 0, bottom: 200, left: 140 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // Scales and axes
    vis.x = d3.scaleBand()
        .rangeRound([0, vis.width])
        .paddingInner(0.2)
        .domain(d3.range(0,15));

    vis.y = d3.scaleLinear()
        .range([vis.height,0]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    // Axis title
    vis.svg.append("text")
        .attr("x", -50)
        .attr("y", -8)
        .text("Votes");


    // (Filter, aggregate, modify data)
    vis.wrangleData();
}


/*
 * Data wrangling
 */

PrioVis.prototype.wrangleData = function(){
	var vis = this;

    // *** TO-DO ***
	// Create a sequence of values from 0 - 14 (priorities: 1-15; array length: 15)
	// ...

    
	// Iterate over each priority and fill array
    // ...
    
    
	vis.displayData = votesPerPriority;
	// Update the visualization
	vis.updateVis();
}


/*
 * The drawing function
 */

PrioVis.prototype.updateVis = function(){
    var vis = this;
    
    // Update domains
    vis.y.domain([0, d3.max(vis.displayData)]);

    var bars = vis.svg.selectAll(".bar")
        .data(this.displayData)

    bars.enter().append("rect")
        .attr("class", "bar")

        .merge(bars)
        .transition()
        .attr("width", vis.x.bandwidth())
        .attr("height", function(d){
            return vis.height - vis.y(d);
        })
        .attr("x", function(d, index){
            return vis.x(index);
        })
        .attr("y", function(d){
            return vis.y(d);
        })

    bars.exit().remove();

    // Call axis function with the new domain
    vis.svg.select(".y-axis").call(vis.yAxis);

    // *** TO-DO ***
    // Update x-axis tick values to something more meaningful
    vis.svg.select(".x-axis").call(vis.xAxis);
}


PrioVis.prototype.onSelectionChange = function(selectionStart, selectionEnd){
    var vis = this;
    
    // *** TO-DO ***
    // Filter data depending on selected time period (brush)
 

	vis.wrangleData();
}
