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
    self.svgWidth = 500;
    self.svgHeight = 500;

    //creates svg element within the div

    self.svg = divWordle.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)

    self.updateWordle();
};

Wordle.prototype.updateWordle = function () {
    var self = this;

	self.svg
        .append("text")
        .attr("class", "story-title")
        .attr("y", 30)
		.attr("x", self.svgWidth/2 - 130)
		.html("Word Cloud")

    let frequency_list = self.stories.frequency_list;

    var color = d3.scaleLinear()
            .domain([0,1,2,3,4,5,6,10,15,20,100])
            .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

    d3.layout.cloud().size([600, 600])
            .words(frequency_list)
            .rotate(0)
            .fontSize((d) => d.count * 4)
            .on("end", draw)
            .start();

    function draw(words) {
        let g = self.svg.append("g")
            .attr("transform", "translate(200,250)")
            
        g.selectAll(".wordle-text")
            .data(words)
            .enter()
            .append("text")
            .attr("class", "wordle-text")
            .transition()
            .duration(600)
            .style("font-size", function(d) { return d.count + "px"; })
            .style("fill", function(d) { return color(d.count); })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
};