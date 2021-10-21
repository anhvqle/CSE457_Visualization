// Global variable with 60 attractions (JSON format)
// console.log(attractionData);

dataFiltering();

function dataFiltering() {
  var attractions = attractionData;

  /* **************************************************
   *
   * ADD YOUR CODE HERE (ARRAY/DATA MANIPULATION)
   *
   * CALL THE FOLLOWING FUNCTION TO RENDER THE BAR-CHART:
   *
   * renderBarChart(data)
   *
   * - 'data' must be an array of JSON objects
   * - the max. length of 'data' is 5
   *
   * **************************************************/
  let popularAttraction = attractions
    .sort(
      (attraction1, attraction2) => attraction2.Visitors - attraction1.Visitors
    )
    .slice(0, 5);
  renderBarChart(popularAttraction);
}

function dataManipulation() {
  let selectBox = document.getElementById("attraction-category");
  let selectedValue = selectBox.options[selectBox.selectedIndex].value;
  if (selectedValue === "all") {
    dataFiltering();
    return;
  }
  var attractions = attractionData;

  let popularAttraction = attractions
    .sort(
      (attraction1, attraction2) => attraction2.Visitors - attraction1.Visitors
    )
    .filter((attraction) => attraction.Category === selectedValue)
    .slice(0, 5);
  renderBarChart(popularAttraction);
}
