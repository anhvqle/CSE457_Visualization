function Wordle(stories, colorScale){
    var self = this;
    self.stories = stories;
    self.colorScale = colorScale;
    self.init();
};

Wordle.prototype.init = function(){
    var self = this;

    //Gets access to the div element created for this chart from HTML
    var divWordle = d3.select("#wordle").html("");
    self.svgBounds = divWordle.node().getBoundingClientRect();
    self.svgWidth = 1000;
    self.svgHeight = 500;

    //creates svg element within the div

    self.svg = divWordle.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)
        .append("g")
		.attr("transform","translate(0,0)");

    self.updateWordle();
};

Wordle.prototype.updateWordle = function () {
    var self = this;

	self.svg
        .append("text")
        .attr("class", "story-title")
        .attr("y", 30)
		.attr("x", self.svgWidth/2 - self.stories.title.length*9)
		.html(self.stories.title)	
};