var facts = [
	"Students: ~7714 undergraduates and ~7681 graduate and professional students.",
	"Students come from more than 100 countries and all 50 states + the District of Columbia, Guam, Puerto Rico and the Virgin Islands.", 
	"More than 90% of undergraduates are from out of state and approximately 65% come from more than 500 miles away.", 
	"About 380 undergraduate student groups and more than 150 graduate student groups in 2017-18",
	"80% of undergraduate students pursue multiple majors and/or minors", 
	"About 1 in 3 undergraduate students study abroad", 
	"1,503 university-employed physicians at the School of Medicine representing 76 specialties provided clinical care to 49 clinical sites through Washington University Physicians, one of the largest academic clinical practices in the nation.", 
	"1,121,579 outpatient visits to Washington University Physicians in 2017",
	"1,795 beds in the Washington University Medical Center",
	"3rd ranking among largest employers in St. Louis – St. Louis Business Journal Book of Lists 2017", 
	"Honors: 24 Nobel Laureates, 9 Pulitzer Prize winners, 4 Poet Laureate of the United States winner, 15 National Medal of Science winners", 
	"Washington Uinversity Motto: Per Veritatem Vis (Strength Through Truth)", 
	"Washington University was founded in 1853",
	"According to the Gephardt Institute for Civic and Community Engagement, Washington University volunteers more than 7 million person hours to the community each year.", 
	"About 60% of undergraduate students participate in community service.",
	"The total gifts and grants for 2018 was $353.3 million, from 65,588 donors.",
	"About 75% of undergraduates participate in intramural sports, in more than 30 all-male, all-female and coed teams"
];



document.getElementById("cse457-basics").onclick = function(){
	var randomFact = facts[Math.floor(Math.random()*facts.length)];

	// CREATE NEW PARAGRAPH-TAG
	var paragraph = document.createElement("li");
	paragraph.className = "generated-content"; 

	// CREATE PARAGRAPH CONTENT
	var node = document.createTextNode(randomFact);

	// ADD PARAGRAPH CONTENT TO TAG
	paragraph.appendChild(node);

	// ADD PARAGRAPH TO DIV-CONTAINER WITH ID "fun-facts"
	var element = document.getElementById("fun-facts");
	element.appendChild(paragraph);
}