
// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'
const width = 1000;
const height = 200;
let svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);

async function updateVisualization(orders) {
	const padding = 30;
	const textPadding = 100;

	const text = svg.select("text").remove();
	svg.append("text")
        .attr("x", padding)
        .attr("y", height / 2)
        .text(`Order: ${orders.length}`);

    const circle = svg.selectAll("circle")
        .data(orders)
	
    circle
		.enter()
        .append("circle")
        .attr("fill", (d) => {
            if (d.product == "coffee"){
                return "blue";
            }
            else {
                return "red";
            }
        })
        .attr("cx", (d, i) => i * 100 + padding + textPadding)
        .attr("cy", height / 2)
        .attr("r", 25)

    circle.exit().remove();
	console.log(orders);
	
}