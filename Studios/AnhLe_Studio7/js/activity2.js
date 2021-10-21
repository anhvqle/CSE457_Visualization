var width = 1000,
    height = 600;

var svg = d3
    .select("#chart-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var files = ["data/world-110m.json", "data/airports.json"];

Promise.all([
    d3.json("data/airports.json"),
    d3.json("data/world-110m.json"),
]).then(function (values) {
    createVisualization(values);
});

const createVisualization = (values) => {
    const [airportData, topoData] = values;
    var projection = d3.geoMercator()
        .translate([width / 2, height / 2])
        .scale(150)
        .center([0, 35]);
    var path = d3.geoPath().projection(projection);
  
    // Convert TopoJSON to GeoJSON (target object = 'states')
    console.log(topoData);
    var world = topojson.feature(topoData, topoData.objects.countries).features;
    console.log(world);
    // Render the U.S. by using the path generator
    svg.selectAll("path")
        .data(world)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#3C3841");
  
    var node = svg.selectAll(".node")
        .data(airportData.nodes)
        .enter()
        .append("circle")
        .attr("fill", "yellow")
        .attr("class", "node")
        .attr("r", 4)
        .attr("transform", function (d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")";
        });

    node.append("title").text((d) => d.name);
  };