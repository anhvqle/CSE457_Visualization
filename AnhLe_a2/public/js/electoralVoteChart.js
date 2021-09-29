
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

    // ******* TODO: PART II *******
    let availableEV = d3.sum(electionResult, d => d.Total_EV);

    // Adding winning 
    let totalIVotes = 0, totalDVotes = 0, totalRVotes = 0, firstDemocratState = 0;
    electionResult.forEach((d) => {
        d.victoryMargin = d.R_Percentage - d.D_Percentage;

        if(d.I_Percentage > d.D_Percentage && d.I_Percentage > d.R_Percentage){
            totalIVotes += d.Total_EV;
            d.winningParty = 'I';
        }
        else if(d.D_Percentage > d.R_Percentage){
            totalDVotes += d.Total_EV;
            d.winningParty = 'D';
        }
        else if(d.R_Percentage > d.D_Percentage){
            totalRVotes += d.Total_EV;
            d.winningParty = 'R';
        }
    })

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory
    electionResult.sort((d1, d2) => d1.victoryMargin - d2.victoryMargin);

    let IVotes = [], otherVotes = [];

    electionResult.forEach((d) => {
        if(d.winningParty == 'I')
            IVotes.push(d);
        else
            otherVotes.push(d);
    });

    let data = IVotes.concat(otherVotes);

    let sum = 0;
    data.forEach((d, i) => {
        if (i - 1 >= 0 && data[i].winningParty === "D" && data[i - 1].winningParty === "I") {
            firstDemocratState = sum;
        }
        d.x = sum;
        sum += d.Total_EV;
    })

    let electoralVoteScale = d3.scaleLinear()
        .domain([0, availableEV])
        .range([0, self.svgWidth]);

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    let bars = self.svg.selectAll(".electoralVotes")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "electoralVotes")
        .attr("x", (d) => electoralVoteScale(d.x))
        .attr("y", 75) 
        .attr("width", (d) => electoralVoteScale(d.Total_EV))
        .attr("height", self.svgHeight/5)
        .attr("fill", function(d) {
            if(d.winningParty == 'I')
                return "#5FAA70";
            else
<<<<<<< HEAD
                return colorScale(d.victoryMargin);
        })

    bars.exit().remove();
=======
                return colorScale(d.R_Percentage - d.D_Percentage);
        }) 
>>>>>>> 49769a2... Assignment 2: Vote Percentage Chart Finished

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    self.svg.selectAll('.middlePoint').remove();
    self.svg.append('line')  
        .attr('class', 'middlePoint') 
        .attr('x1', self.svgWidth / 2)
        .attr('x2', self.svgWidth / 2)
        .attr('y1', 60)
        .attr('y2', 120)
        .style('stroke', 'black')


    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    self.svg.selectAll('.electoralVotesNote').remove();
    self.svg.append('text')
        .attr('class','electoralVotesNote')
        .attr("x", self.svgWidth / 2)
        .attr('y', 50)
        .text("Electoral Vote (270 needed to win)");

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary
    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    self.svg.selectAll(".electoralVoteText").remove();
    self.svg.append('text')
        .attr("class", `electoralVoteText ${self.chooseClass('R')}`)
        .attr("x", self.svgWidth)
        .attr("y", 60)
        .text(totalRVotes)

    self.svg.append('text')
        .attr("class", `electoralVoteText ${self.chooseClass('I')}`)
        .attr("x", 0)
        .attr("y", 60)
        .text(totalIVotes > 0 ? totalIVotes : "");

    self.svg.append('text')
        .attr("class", `electoralVoteText ${self.chooseClass('D')}`)
        .attr("x", totalIVotes == 0 ? 0 : electoralVoteScale(firstDemocratState))
        .attr("y", 60)
        .text(totalDVotes);

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of brushSelection and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

};
