function CircularBarplot(stories, colorScale){
    let self = this;
    self.stories = stories;
    self.colorScale = colorScale;
    self.init();
};

CircularBarplot.prototype.init = function(){
    let self = this;
    self.margin = {top: 100, right: 0, bottom: 0, left: 0};
    
    let divCircularBarplot = d3.select("#circular-barplot").html("");
    self.svgBounds = divCircularBarplot.node().getBoundingClientRect();
    self.svgWidth = 500;
    self.svgHeight = 500;

    innerRadius = 90,
    outerRadius = Math.min(self.svgWidth, self.svgHeight) / 2;

    self.svg = divCircularBarplot.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)

    self.svg
        .append("text")
        .attr("class", "story-title")
        .attr("y", 30)
		.attr("x", (self.svgWidth - self.stories.title.length*11)/2)
		.html(self.stories.title)

    self.updateCircularBarplot();
};

CircularBarplot.prototype.updateCircularBarplot = function () {
    let self = this;

    console.log(self.stories.frequency_list)

    let g = self.svg.append("g").attr("transform", "translate(250,250)");

    let x = d3.scaleBand()
        .range([0, 2 * Math.PI])
        .align(0)
        .domain(self.stories.frequency_list.map(function(d) { return d.text; }));

    let y = d3.scaleRadial()
        .range([innerRadius, outerRadius])
        .domain([0, 14000]);

    // Add the bars
    g.append("g")
        .selectAll("path")
        .data(self.stories.frequency_list)
        .enter()
        .append("path")
        .attr("fill", "#69b3a2")
        .attr("id", (d) => d.text + " " + d.count)
        .attr("d", d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius((d) => y(d.count * 80))
                    .startAngle((d) => x(d.text))
                    .endAngle((d) => x(d.text) + x.bandwidth())
                    .padAngle(0.01)
                    .padRadius(innerRadius))

    var barplots = d3.select("#circular-barplot")
    
    barplots.selectAll("path").on("mouseover", function(d) {
        d3.select(this).attr("fill", "orange")

        let id = d3.select(this).attr("id");
        let word = id.split(" ")[0];
        let count = id.split(" ")[1];

        g.selectAll(".tooltip-text")
            .data(self.stories.frequency_list)
            .enter()
            .append("text")
            .attr("class", "tooltip-text")
            .attr("x", -100)
            .attr("y", 200)
            .attr("font-size", "1em")
            .style('fill', 'darkOrange')
            .text(`There are ${count} ${word}'s`);
    })
    .on("mouseout", function(d) {
        d3.select(this).attr("fill", "#69b3a2")
        d3.selectAll(".tooltip-text").remove();
    })

    g.append("g")
        .selectAll("g")
        .data(self.stories.frequency_list)
        .enter()
        .append("g")
        .attr("text-anchor", (d) => (x(d.text) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
        .attr("transform", (d) => "rotate(" + ((x(d.text) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.count * 80)+ 10) + ",0)")
        .append("text")
        .text((d) => d.text)
        .attr("transform", (d) => (x(d.text) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")
};