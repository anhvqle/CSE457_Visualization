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
    self.svgHeight = 600;

    //creates svg element within the div

    self.svg = divWordle.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)

    self.updateWordle();
};

Wordle.prototype.updateWordle = function () {
    var self = this;

    let words = self.stories.frequency.map((d) => d[0]);

	self.svg
        .append("text")
        .attr("class", "story-title")
        .attr("y", 30)
		.attr("x", self.svgWidth/2 - self.stories.title.length*9)
		.html(self.stories.title)
    
    d3.layout.cloud()
        .size([600, 600])
        .words(words.map(function(d) {
          return {text: d, size: 10 + Math.random() * 90, test: "haha"};
        }))
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();
    
    function draw(words) {
        self.svg.append("g")
            .attr("transform","translate(500,350)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
};