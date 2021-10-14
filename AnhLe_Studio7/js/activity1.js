
var width = 400,
    height = 400;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);





// Load data
d3.json("data/airports.json").then(function(data) {
  console.log(data);

  // i) INITIALIZE FORCE-LAYOUT AND DEFINE 'NODES' AND 'EDGES'
  
  // ii) DRAW THE LINKS (SVG LINE)

  // iii) DRAW THE NODES (SVG CIRCLE)

  // iv) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS

});