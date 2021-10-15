let stories = []
let regex = /[!"“”#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

loadData();

// Load data
function loadData() {
    d3.json("data/stories.json").then(function(data) {
        stories = data;
        stories.forEach((d) => {
            let cleanSentences = []
            let sentences = d.story.replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)/gm, "$1$2|").split('|')
            sentences.forEach((s) => {

                var cleanString = s.toLowerCase().replace(regex, '').trim(" ");
                cleanSentences.push(cleanString);
            });
            let filteredStory = cleanSentences.join(" ")
            d.story = filteredStory;
        });
        console.log(stories);
    });
}
