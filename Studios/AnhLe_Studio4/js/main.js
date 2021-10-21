// SVG Size
var width = 700,
  height = 500;

// Load CSV file
d3.csv("data/wealth-health-2014.csv").then(function (data) {
  data.forEach(function (d) {
    d.LifeExpectancy = +d.LifeExpectancy;
    d.Income = +d.Income;
    d.Population = +d.Population;
  });
  data.sort((d1, d2) => d2.Population - d1.Population);

  console.log(data);
  let padding = 20;
  let incomeScale = d3
    .scaleLog()
    .domain([d3.min(data, (d) => d.Income), d3.max(data, (d) => d.Income)])
    .range([padding, width - padding]);

  let incomeAxisScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Income) - 1000, d3.max(data, (d) => d.Income) + 1000])
    .range([padding, width - padding]);

  let lifeExpectancyScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d.LifeExpectancy) - 5,
      d3.max(data, (d) => d.LifeExpectancy) + 5,
    ])
    .range([height - padding, padding]);

  let rScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d.Population),
      d3.max(data, (d) => d.Population),
    ])
    .range([4, 30]);

  let colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

  console.log(colorPalette.range());

  let colorScale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.Region))
    .range(colorPalette.range())
    .unknown(undefined);

  let svg = d3
    .select("#chart-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  let group = svg.append("g");

  group
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("fill", (d) => colorScale(d.Region))
    .attr("r", (d) => rScale(d.Population))
    .attr("cx", (d) => incomeScale(d.Income))
    .attr("cy", (d) => lifeExpectancyScale(d.LifeExpectancy));

  let xAxis = d3.axisBottom().scale(incomeAxisScale).ticks(10);
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .call(xAxis)
    .attr("transform", "translate(" + 0 + "," + (height - padding) + ")");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 1.5 * padding)
    .text("Income per Person (GDP per Capita)");

  let yAxis = d3.axisLeft().scale(lifeExpectancyScale).ticks(10);
  svg
    .append("g")
    .attr("class", "axis-label")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", -1 * padding)
    .attr("y", 2 * padding)
    .attr("transform", "rotate(-90)")
    .text("life expectancy");
});
