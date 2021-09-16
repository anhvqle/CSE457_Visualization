d3.select("#first_rectangle")
  .append("svg")
  .append("rect")
  .attr("width", "400px")
  .attr("height", "200px")
  .attr("fill", "green")

d3.select("#container").append("p").text("Dynamic Content")

var states = ["Kansas", "Nebraska", "Missouri", "Iowa", "Illinois",  "Indiana"];

var p = d3.select("body").selectAll("p")
  .data(states)
  .enter()
  .append("p")
  .text(function (d, index) {
      return d;
  });

var sandwiches = [
  { name: "Thesis", price: 7.95, size: "large" },
  { name: "Dissertation", price: 8.95, size: "large" },
  { name: "Highlander", price: 6.50, size: "small" },
  { name: "Just Tuna", price: 6.50, size: "small" },
  { name: "So-La", price: 7.95, size: "large" },
  { name: "Special", price: 12.50, size: "small" }
];

const svg = d3.select("#circle").append("svg")
  .attr("width", 500)
  .attr("height", 100);


svg.selectAll("circle")
  .data(sandwiches)
  .enter()
  .append("circle")
  .attr("stroke", "black")
  .attr("fill", function(d) {
    if(d.price <= 7.0)
        return "green";
    else
        return "yellow";
  })
  .attr("cx", (_d, i) => i * 75 + 30)
  .attr("cy", 50)
  .attr("r", (d) => (d.size  === "large") ? 30 : 15)



// Activity III

let filtered;
d3.csv("data/cities.csv")
  .then(data => {
    filtered = [...data].map((d) => {
      d.eu = d.eu === "true"
      d.population = parseInt(d.population);
      d.x = parseFloat(d.x);
      d.y = parseFloat(d.y);
      return d;
    }).filter((d) => d.eu);

    console.log(filtered);
    d3.select("#cities").append("p").text(`Number of cities: ${filtered.length}`)
    const svg = d3.select("#cities").append("svg")
                        .attr("width", 700)
                        .attr("height", 550);
                        
    svg.selectAll("circle")
        .data(filtered)
        .enter()
        .append("circle")
        .attr("fill", "#a15c2f")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.population < 1000000 ? 4 : 8)
    
    svg.selectAll("text")
        .data(filtered)
        .enter()
        .append("text")
        .attr("class", "city-label")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y - 10)
        .text((d) => d.population >= 1000000 ? d.city : "");
  })
  .catch(error => {
    console.error("Error loading the data")
  });