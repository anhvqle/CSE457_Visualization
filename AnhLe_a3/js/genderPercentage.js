function GenderPercentage(stories, colorScale){
    var self = this;
    self.stories = stories;
    self.colorScale = colorScale;
    self.init();
};

GenderPercentage.prototype.init = function(){
    var self = this;

    console.log("Percentage");

    //Gets access to the div element created for this chart from HTML
    var divGenderPercentage = d3.select("#gender-percentage").html("");
    self.svgBounds = divGenderPercentage.node().getBoundingClientRect();
    self.svgWidth = 1000;
    self.svgHeight = 300;

    //creates svg element within the div

    self.svg = divGenderPercentage.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)
        .append("g")
		.attr("transform","translate(0,0)");

    self.updateGenderPercentage();
};

GenderPercentage.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + row.gender + ">" + row.gender+":\t\t"+row.wordCount+"("+row.percentage+"%)" + "</li>"
    });

    return text;
}

GenderPercentage.prototype.updateGenderPercentage = function () {
    var self = this;

    console.log(self.stories);

    let total = self.stories.female_keyword_count + self.stories.male_keyword_count + self.stories.neutral_keyword_count;

    let percentMale = Number((self.stories.male_keyword_count/total * 100).toFixed(2));
    let percentNeutral = Number((self.stories.neutral_keyword_count/total * 100).toFixed(2));
    let percentFemale = Number((self.stories.female_keyword_count/total * 100).toFixed(2));

    tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            console.log("TIP HERE");
            tooltip_data = {
                "result":[
                    {"gender": "male", "wordCount": self.stories.male_keyword_count,"percentage": percentMale,"party":"D"} ,
                    {"gender": "neutral", "wordCount": self.stories.neutral_keyword_count,"percentage": percentNeutral,"party":"R"} ,
                    {"gender": "female", "wordCount": self.stories.female_keyword_count,"percentage": percentFemale,"party":"I"}
                ]
            }
            return self.tooltip_render(tooltip_data);
        });

	let percentScale = d3.scaleLinear().domain([0, 100]).range([0, self.svgWidth]);

    let percentData = [
        {"gender": "male", "percentage": percentMale, "x": 0},
        {"gender": "neutral", "percentage": percentNeutral, "x": percentMale},
        {"gender": "female", "percentage": percentFemale, "x": percentMale + percentNeutral}
    ]

    let bars = self.svg.selectAll(".genderPercentage").exit().remove()
        .data(percentData)
        .enter()
        .append("rect")
        .attr("class", (d) => `genderPercentage ${d.gender}`)
        .attr("x", (d) => percentScale(d.x))
        .attr("y", 75) 
        .attr("width", (d) => percentScale(d.percentage))
        .attr("height", self.svgHeight/5)
        .call(tip)
        .on('mouseover', function(e) {
            d3.selectAll(".male, .neutral, .female").attr("opacity", 0.5);
            if (e.target.classList.contains("male")) {
                d3.selectAll(".male").attr("opacity", 1);
            } else if (e.target.classList.contains("neutral")) {
                d3.selectAll(".neutral").attr("opacity", 1);
            } else if (e.target.classList.contains("female")) {
                d3.selectAll(".female").attr("opacity", 1);
            }
            tip.show
        })
        .on('mouseout', function(e) {
            d3.selectAll(".male, .neutral, .female").attr("opacity", 1);
            tip.hide
        })

    self.svg.selectAll(".genderPercentageText").remove();

    self.svg.append('text')
        .attr("class", "genderPercentageText female")
        .attr("x", self.svgWidth)
        .attr("y", 60)
        .text(percentFemale > 0 ? `Female: ${percentFemale}%` : "")

    self.svg.append('text')
        .attr("class", "genderPercentageText male")
        .attr("x", 0)
        .attr("y", 60)
        .text(percentMale > 0 ? `Male: ${percentMale}%` : "")

    let x = 0;
    if (percentMale == 0) {
        x = 0;
    }
    else if(percentFemale == 0) {
        x = self.svgWidth - 140;
    }
    else if(percentMale > 0 && percentMale < 10) {
        x = percentScale(percentMale + 8);
    }
    else {
        x = percentScale(percentMale);
    }
    self.svg.append('text')
        .attr("class", "genderPercentageText neutral")
        .attr("x", x)
        .attr("y", 60)
        .text(`Neutral: ${percentNeutral}%`);
};