/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 200;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
VotePercentageChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party == "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });

    return text;
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function(electionResult){
    var self = this;

    // Compute the percentage of votes won by that party
    let totalIVotes = 0, totalDVotes = 0, totalRVotes = 0, totalVotes = 0;
    electionResult.forEach((d) => {
        totalIVotes += d.I_Votes;
        totalDVotes += d.D_Votes;
        totalRVotes += d.R_Votes;
        totalVotes += d.I_Votes + d.D_Votes + d.R_Votes;
    })

    let percentIVotes = round(totalIVotes / totalVotes * 100, 1);
    let percentDVotes = round(totalDVotes / totalVotes * 100, 1);
    let percentRVotes = round(totalRVotes / totalVotes * 100, 1);

    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            /* populate data in the following format
             * pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */
            tooltip_data = {
                "result":[
                    {"nominee": electionResult[0].D_Nominee,"votecount": totalDVotes,"percentage": percentDVotes,"party":"D"} ,
                    {"nominee": electionResult[0].R_Nominee,"votecount": totalRVotes,"percentage": percentRVotes,"party":"R"} ,
                    {"nominee": electionResult[0].I_Nominee,"votecount": totalIVotes,"percentage": percentIVotes,"party":"I"}
                ]
            }
            return self.tooltip_render(tooltip_data);
        });


    // ******* TODO: PART III *******

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.
    let percentScale = d3.scaleLinear().domain([0, 100]).range([0, self.svgWidth]);

    let percentData = [
        {"party": "I", "percentage": percentIVotes, "x": 0},
        {"party": "D", "percentage": percentDVotes, "x": percentIVotes},
        {"party": "R", "percentage": percentRVotes, "x": percentIVotes + percentDVotes}
    ]

    let bars = self.svg.selectAll(".votePercentage").exit().remove()
        .data(percentData)
        .enter()
        .append("rect")
        .attr("class", (d) => `votePercentage ${self.chooseClass(d.party)}`)
        .attr("x", (d) => percentScale(d.x))
        .attr("y", 75) 
        .attr("width", (d) => percentScale(d.percentage))
        .attr("height", self.svgHeight/5)
        .call(tip)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary
    self.svg.selectAll(".votesPercentageText").remove();
    self.svg.append('text')
        .attr("class", `votesPercentageText ${self.chooseClass('R')}`)
        .attr("x", self.svgWidth)
        .attr("y", 30)
        .text(electionResult[0].R_Nominee)

    self.svg.append('text')
        .attr("class", `votesPercentageText ${self.chooseClass('I')}`)
        .attr("x", 0)
        .attr("y", 30)
        .text(percentIVotes > 0 ? electionResult[0].I_Nominee : "");

    self.svg.append('text')
        .attr("class", `votesPercentageText ${self.chooseClass('D')}`)
        .attr("x", percentIVotes == 0 ? 0 : (percentIVotes > 0 && percentIVotes < 8 ? percentScale(percentIVotes + 10) : percentScale(percentIVotes)))
        .attr("y", 30)
        .text(electionResult[0].D_Nominee);

    self.svg.append('text')
        .attr("class", `votesPercentageText ${self.chooseClass('R')}`)
        .attr("x", self.svgWidth)
        .attr("y", 60)
        .text(`${percentRVotes}%`)

    self.svg.append('text')
        .attr("class", `votesPercentageText ${self.chooseClass('I')}`)
        .attr("x", 0)
        .attr("y", 60)
        .text(percentIVotes > 0 ? `${percentIVotes}%` : "");

    self.svg.append('text')
        .attr("class", `votesPercentageText ${self.chooseClass('D')}`)
        .attr("x", percentIVotes == 0 ? 0 : (percentIVotes > 0 && percentIVotes < 8 ? percentScale(percentIVotes + 10) : percentScale(percentIVotes)))
        .attr("y", 60)
        .text(`${percentDVotes}%`);

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.
    self.svg.selectAll('.middlePoint').remove();
    self.svg.append('line')  
        .attr('class', 'middlePoint') 
        .attr('x1', self.svgWidth / 2)
        .attr('x2', self.svgWidth / 2)
        .attr('y1', 60)
        .attr('y2', self.svgHeight - 65)
        .style('stroke', 'black')

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element
    self.svg.selectAll('.votesPercentageNote').remove();
    self.svg.append('text')
        .attr('class','votesPercentageNote')
        .attr("x", self.svgWidth / 2)
        .attr("text-anchor",'middle')
        .attr('y', 50)
        .text("Popular Vote (50%)");

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party.
    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.
};
