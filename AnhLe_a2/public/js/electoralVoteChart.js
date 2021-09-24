
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param brushSelection an instance of the BrushSelection class
 */
function ElectoralVoteChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
    self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
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
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

ElectoralVoteChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    debugger;

    // ******* TODO: PART II *******
    let availableEV = d3.sum(electionResult, d => d.Total_EV);

    let IVotes = [], DVotes = [], RVotes = [];
    let totalIVotes = 0, totalDVotes = 0, totalRVotes = 0;

    electionResult.forEach((d) => {
        if(d.I_Percentage > d.D_Percentage && d.I_Percentage > d.R_Percentage){
            totalIVotes += d.Total_EV;
            IVotes.push(d);
        }
        else if(d.D_Percentage > d.R_Percentage){
            totalDVotes += d.Total_EV;
            DVotes.push(d);
        }
        else if(d.R_Percentage > d.D_Percentage){
            totalRVotes += d.Total_EV;
            RVotes.push(d);
        }
    });

    DVotes.sort((d1, d2) => (d2.D_Percentage - d2.R_Percentage) - (d1.D_Percentage - d1.R_Percentage));
    RVotes.sort((d1, d2) => (d1.R_Percentage - d1.D_Percentage) - (d2.R_Percentage - d2.D_Percentage));

    let data = IVotes.concat(DVotes, RVotes);

    let sum = 0;
    data.forEach((d) => {
        d.x = sum;
        sum += d.Total_EV;
    })

    console.log(data);

    let electoralVoteScale = d3.scaleLinear()
        .domain([0, availableEV])
        .range([0, self.svgWidth]);

    let bars = self.svg.selectAll(".electoralVotes").remove()
        .exit()
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "electoralVotes")
        .attr("x", (d) => electoralVoteScale(d.x))
        .attr("y", 75) 
        .attr("width", (d) => electoralVoteScale(d.Total_EV))
        .attr("height", self.svgHeight/5)
        .attr("fill", (d) => colorScale(d.Total_EV))
        .attr("fill", function(d) {
            if(d.I_Percentage > d.D_Percentage && d.I_Percentage > d.R_Percentage)
                return "green";
            else if(d.D_Percentage > d.R_Percentage)
                return colorScale(0 - d.Total_EV);
            else if(d.R_Percentage > d.D_Percentage)
                return colorScale(d.Total_EV);
        })

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of brushSelection and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

};
