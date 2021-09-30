/**
 * Constructor for the TileChart
 */
function TileChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required to lay the tiles
 * and to populate the legend.
 */
TileChart.prototype.init = function(){
    var self = this;

    //Gets access to the div element created for this chart and legend element from HTML
    var divTileChart = d3.select("#tiles").classed("content", true);
    var legend = d3.select("#legend").classed("content",true);
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    var svgBounds = divTileChart.node().getBoundingClientRect();
    self.svgWidth = svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgWidth/2;
    var legendHeight = 50;

    //creates svg elements within the div
    self.legendSvg = legend.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",legendHeight)
        .attr("transform", "translate(" + self.margin.left + ",0)")

    self.svg = divTileChart.append("svg")
                        .attr("width",self.svgWidth)
                        .attr("height",self.svgHeight)
                        .attr("transform", "translate(" + self.margin.left + ",0)")
                        .style("bgcolor","green")

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
TileChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party== "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Renders the HTML content for tool tip.
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
TileChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<h2 class ="  + self.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
    text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
    text += "<ul>"
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });
    text += "</ul>";
    return text;
}

/**
 * Creates tiles and tool tip for each state, legend for encoding the color scale information.
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */
TileChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    electionResult.forEach((d) => {
        if (d.Abbreviation == "AK" || d.Abbreviation == "ME") {
            d.row = 0;
        }
        else if (d.Abbreviation == "VT" || d.Abbreviation == "NH") {
            d.row = 1;
        }
        else if (["WA", "ID", "MT", "ND", "MN", "IL", "WI", "MI", "NY", "RI", "MA"].includes(d.Abbreviation)) {
            d.row = 2;
        }
        else if(["OR", "NV", "WY", "SD", "IA", "IN", "OH", "PA", "NJ", "CT"].includes(d.Abbreviation)) {
            d.row = 3;
        }
        else if(["CA", "UT", "CO", "NE", "MO", "KY", "WV", "VA", "MD", "DC"].includes(d.Abbreviation)) {
            d.row = 4;
        }
        else if(["AZ", "NM", "KS", "AR", "TN", "NC", "SC", "DE"].includes(d.Abbreviation)){
            d.row = 5;
        }
        else if(["OK", "LA", "MS", "AL", "GA"].includes(d.Abbreviation)){
            d.row = 6;
        }
        else {
            d.row = 7;
        }
    })

    electionResult.forEach((d) => {
        if (d.Abbreviation == "AK") {
            d.col = 0;
        }
        else if(["WA", "OR", "CA", "HI"].includes(d.Abbreviation)) {
            d.col = 1;
        }
        else if(["ID", "NV", "UT", "AZ"].includes(d.Abbreviation)) {
            d.col = 2;
        }
        else if(["MT", "WY", "CO", "NM"].includes(d.Abbreviation)) {
            d.col = 3;
        }
        else if(["ND", "SD", "NE", "KS", "OK", "TX"].includes(d.Abbreviation)) {
            d.col = 4;
        }
        else if(["MN", "IA", "MO", "AR", "LA"].includes(d.Abbreviation)) {
            d.col = 5;
        }
        else if(["IL", "IN", "KY", "TN", "MS"].includes(d.Abbreviation)) {
            d.col = 6;
        }
        else if(["WI", "OH", "WV", "NC", "AL"].includes(d.Abbreviation)) {
            d.col = 7;
        }
        else if(["MI", "PA", "VA", "SC", "GA"].includes(d.Abbreviation)) {
            d.col = 8;
        }
        else if(["NY", "NJ", "MD", "DE", "FL"].includes(d.Abbreviation)) {
            d.col = 9;
        }
        else if(["VT", "RI", "CT", "DC"].includes(d.Abbreviation)) {
            d.col = 10;
        }
        else {
            d.col = 11;
        }
    })

    //Calculates the maximum number of columns to be laid out on the svg
    self.maxColumns = d3.max(electionResult,function(d){
                                return parseInt(d["Space"]);
                            });

    //Calculates the maximum number of rows to be laid out on the svg
    self.maxRows = d3.max(electionResult,function(d){
                                return parseInt(d["Row"]);
                        });

    electionResult.forEach((d) => {
        d.victoryMargin = d.R_Percentage - d.D_Percentage;
        if(d.I_Percentage > d.D_Percentage && d.I_Percentage > d.R_Percentage){
            d.State_Winner = 'I';
        }
        else if(d.D_Percentage > d.R_Percentage){
            d.State_Winner = 'D';
        }
        else if(d.R_Percentage > d.D_Percentage){
            d.State_Winner = 'R';
        }
    })

    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function(event, d) {
            return [0,0];
        })
        .html(function(event, d) {
            /* populate data in the following format
             * pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */
            tooltip_data = {
                "state": d.State,
                "winner": d.State_Winner,
                "electoralVotes" : d.Total_EV,
                "result":[
                    {"nominee": d.D_Nominee,"votecount": d.D_Votes,"percentage": d.D_Percentage,"party":"D"} ,
                    {"nominee": d.R_Nominee,"votecount": d.R_Votes,"percentage": d.R_Percentage,"party":"R"} ,
                    {"nominee": d.I_Nominee,"votecount": d.I_Votes,"percentage": d.I_Percentage,"party":"I"}
                ]
            }
            return self.tooltip_render(tooltip_data);
        });

    //Creates a legend element and assigns a scale that needs to be visualized
    self.legendSvg.append("g")
        .attr("class", "legendQuantile");

    var legendQuantile = d3.legendColor()
        .shapeWidth(120)
        .cells(10)
        .orient('horizontal')
        .scale(colorScale);

    // ******* TODO: PART IV *******
    //Tansform the legend element to appear in the center and make a call to this element for it to display.
    self.legendSvg.select(".legendQuantile")
		.attr("transform", `scale (0.65, 0.65) translate(${self.margin.left - 20}, 0)`)
		.call(legendQuantile);

    //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.
    //HINT: Use .tile class to style your tiles;
    self.svg.selectAll(".tile").remove()
    let tiles = self.svg.selectAll(".tile").exit()
        .remove()
        .data(electionResult)
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr("width", self.svgWidth/12)
        .attr("height", self.svgHeight/8)
        .attr("x", (d) => d.col * self.svgWidth/12)
        .attr("y", (d) => d.row * self.svgHeight/8)
        .attr("fill", function(d) {
            if(d.State_Winner == 'I')
                return "#45AD6A";
            else
                return colorScale(d.victoryMargin);
        })
        .call(tip)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    self.svg.selectAll("g").remove()
    var abbreviation = self.svg.append("g");
    abbreviation.selectAll("text")
        .data(electionResult)
        .enter()
        .append("text")
        .attr("class", "tilestext")
        .attr("x", (d) => d.col * self.svgWidth/12 + self.svgWidth/24)
        .attr("y", (d) => d.row * self.svgHeight/8 + self.svgHeight/18)
        .text((d) => d.Abbreviation)

    var total_ev = self.svg.append("g");
    total_ev.selectAll("text")
        .data(electionResult)
        .enter()
        .append("text")
        .attr("class", "tilestext")
        .attr("x", (d) => d.col * self.svgWidth/12 + self.svgWidth/24)
        .attr("y", (d) => d.row * self.svgHeight/8 + self.svgHeight/11)
        .text((d) => d.Total_EV)

    //Display the state abbreviation and number of electoral votes on each of these rectangles
    //Use global color scale to color code the tiles.
    // .tilestext to style the text corresponding to tiles


    //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
    //then, vote percentage and number of votes won by each party.
    //HINT: Use the .republican, .democrat and .independent classes to style your elements.
};
