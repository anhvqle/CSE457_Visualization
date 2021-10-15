function StoryList(stories, colorScale){
    var self = this;
    self.stories = stories;
    self.colorScale = colorScale;
    self.init();
};

StoryList.prototype.init = function(){
    var self = this;

    //Gets access to the div element created for this chart from HTML
    var divStoryList = d3.select("#story-list");
    self.svgBounds = divStoryList.node().getBoundingClientRect();
    self.svgWidth = 400;
    self.svgHeight = 1000;

    //creates svg element within the div
    self.svg = divStoryList.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)
        .append("g")
		.attr("transform","translate(0,0)");

    self.chooseStory();
};

StoryList.prototype.chooseStory = function () {
	var self = this;

	self.svg.selectAll(".title").exit().remove()
        .data(self.stories)
        .enter()
        .append("text")
		.text((d) => d.title)
        .attr("fill", "black")
		.attr("y", (_, i) => 20 + i * (self.svgHeight/self.stories.length))
		.attr("x", 25)
		.attr("class", "title")
        .attr("id", (d) => d.index)
		.on("click", function selectStory() {
            // console.log(d3.select(this));
            self.svg.selectAll(".icon").remove();
    
            self.svg.selectAll(".title").attr("fill", "black");
            d3.select(this).attr("fill", "steelBlue");
    
            self.svg.append("text")
                .text("👉🏼")
                .attr("class", "icon")
                .attr("y", d3.select(this).attr("y"));

            updateVis(self.stories[d3.select(this).attr('id')], self.colorScale);
        })
};

function updateVis(stories, colorScale) {
    let wordle = new Wordle(stories, colorScale);
    let circularBarplot = new CircularBarplot(stories, colorScale);
    let genderPercentage = new GenderPercentage(stories, colorScale);
}