/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)

function staircase() {
    // ****** TODO: PART II ******
    let svg = document.getElementById('first_bar_chart');
    let rects = [...svg.getElementsByTagName("rect")];

    for (let i = 0; i < rects.length; i++){
        console.log(getValue(rects[i]));
    }

    rects = rects.sort((a, b) => getValue(a) - getValue(b));

    let y = 0;
    for (let i = 0; i < rects.length; i++){
        rects[i].setAttribute("y", y);
        rects[i].setAttribute("fill", "#5482B2");
        svg.appendChild(rects[i]);
        y += 18;
    }
}

function getValue(input) {
    return parseInt(input.getAttribute("width"));
}

function update(data) {
    // D3 loads all CSV data as strings;
    // while Javascript is pretty smart
    // about interpreting strings as
    // numbers when you do things like
    // multiplication, it will still
    // treat them as strings where it makes
    // sense (e.g. adding strings will
    // concatenate them, not add the values
    // together, or comparing strings
    // will do string cstaircaseomparison, not
    // numeric comparison)staircase.

    // We need to explicitly convert values
    // to numbers so that comparisons work
    // when we call d3.max()
    data.forEach(function (d) {
        d.a = parseInt(d.a);
        d.b = parseFloat(d.b);
    });

    console.log("Data", data)


    // Set up the scales
    var aScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([0, 150]);
    var bScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 150]);
    var iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars

    var first_bar_chart = d3.select("#first_bar_chart")
    var bars = first_bar_chart.selectAll(".bar")
        .remove()
        .exit()
        .data(data)

    let space = -18;

    bars.enter()
        .append("rect")
        .attr("fill", "steelBlue")
        .attr("class", "bar")
        .attr("y", (d) => {
            space += 18;
            return space;
        })
        .attr("height", 17)
        .attr("width", (d) => aScale(d.a))

    // TODO: Select and update the 'b' bar chart bars
    var second_bar_chart = d3.select("#second_bar_chart")
    var bars = second_bar_chart.selectAll(".bar")
        .remove()
        .exit()
        .data(data)

    space = -18;

    bars.enter()
        .append("rect")
        .attr("fill", "steelBlue")
        .attr("class", "bar")
        .attr("y", (d) => {
            space += 18;
            return space;
        })
        .attr("height", 17)
        .attr("width", (d) => aScale(d.b))

    // TODO: Select and update the 'a' line chart path using this line generator
    var aLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return aScale(d.a);
        });

    var first_line_chart = d3.select("#first_line_chart")
    var line = first_line_chart.selectAll("path")
        .remove()
        .exit()
        .data(data)

    line.enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke-width", "3")
        .attr("stroke", "steelBlue")
        .attr("d", aLineGenerator(data))

    // TODO: Select and update the 'b' line chart path (create your own generator)
    var bLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return aScale(d.b);
        });

    var second_line_chart = d3.select("#second_line_chart")
    var line = second_line_chart.selectAll("path")
        .remove()
        .exit()
        .data(data)

    line.enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke-width", "3")
        .attr("stroke", "steelBlue")
        .attr("d", bLineGenerator(data))

    // TODO: Select and update the 'a' area chart path using this line generator
    var aAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return aScale(d.a);
        });

    var first_area_chart = d3.select("#first_area_chart")
    var area = first_area_chart.selectAll("path")
        .remove()
        .exit()
        .data(data)

    area.enter()
        .append("path")
        .attr("fill", "steelBlue")
        .attr("stroke-width", "3")
        .attr("stroke", "steelBlue")
        .attr("d", aAreaGenerator(data))

    // TODO: Select and update the 'b' area chart path (create your own generator)
    var bAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return aScale(d.b);
        });

    var second_area_chart = d3.select("#second_area_chart")
    var area = second_area_chart.selectAll("path")
        .remove()
        .exit()
        .data(data)

    area.enter()
        .append("path")
        .attr("fill", "steelBlue")
        .attr("stroke-width", "3")
        .attr("stroke", "steelBlue")
        .attr("d", bAreaGenerator(data))

    // TODO: Select and update the scatterplot points

    // ****** TODO: PART IV ******
}

function changeData() {
    // // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else{
        d3.csv('data/' + dataFile + '.csv').then(update);
    }
}

function randomSubset() {
    // Load the file indicated by the select menu,
    // and then slice out a random chunk before
    // passing the data to update()
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv').then(function(data) {
            var subset = [];
            data.forEach(function (d) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            });
            update(subset);
        });
    }
    else{
        changeData();
    }
}