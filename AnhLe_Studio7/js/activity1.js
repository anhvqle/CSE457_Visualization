
var width = 500,
    height = 500;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);

// Load data
d3.json("data/airports.json").then(function(data) {
  console.log(data);

    // i) INITIALIZE FORCE-LAYOUT AND DEFINE 'NODES' AND 'EDGES'
    var simulation = d3.forceSimulation( data.nodes )
        .force("charge", d3.forceManyBody())
        .force('link', d3.forceLink( data.links ))
        .force("center",d3.forceCenter().x(width / 2).y(height / 2));
  
    // ii) DRAW THE LINKS (SVG LINE)
    var link = svg.selectAll(".link")
        .data(data.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "grey");

    // iii) DRAW THE NODES (SVG CIRCLE)
    var node = svg.selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("fill", (d) => {
            if (d.country === "United States") 
                return "steelBlue";
            else 
                return "red";
        })
        .attr("class", "node")
        .attr("r", 6)

    // iv) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
    simulation.on("tick", function () {
        // Update node coordinates
        node.attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y);
    
        // Update edge coordinates
        link.attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);
    });

    node.append("title").text((d) => d.name);

    // Implement draggable nodes
    function dragstart(d) {
        if (!d.active) simulation.alphaTarget(0.3).restart();
        d.subject.fx = d.subject.x;
        d.subject.fy = d.subject.y;
    }

    function drag(d) {
        d.subject.fx = d.x;
        d.subject.fy = d.y;
    }

    function dragend(d) {
        if (!d.active) simulation.alphaTarget(0);
        d.subject.fx = null;
        d.subject.fy = null;
    }

    node.call(d3.drag()
        .on("start", dragstart)
        .on("drag", drag)
        .on("end", dragend));

});