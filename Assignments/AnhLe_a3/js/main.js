let regex = /[!"“”#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
let male_keywords = ['he', 'hes', 'hell', 'him', 'his', 'hed', 'men', 'man', 'gentleman', 'gentlemen', 'guy', 'gent', 'bro', 'brother', 'king', 'boyfriend', 'guys', 'husband', 'son', 'mr', 'father', 'dad', 'grandfather', 'granddad', 'newphew', 'pop', 'papa', 'sir', 'uncle', 'boy', 'boys', 'king', 'prince', 'boys'];
let female_keywords = ['she', 'shes', 'shell', 'her', 'hers', 'shed', 'women', 'woman', 'girl', 'girls', 'girlfriend', 'mom', 'mother', 'wife', 'aunt', 'gentlewoman', 'gentlewomen', 'grandmother', 'grandwoman', 'mrs', 'madam', 'queen', 'princess', 'sister', 'lady', 'niece', 'ms', 'miss'];
let neutral_keywords = ['you', 'youd', 'youll', 'your', 'youre', 'youve', 'yours', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'them', 'their', 'theirs', 'we', 'wed', 'well', 'were', 'weve', 'our', 'ours', 'people', 'person', 'parent', 'child', 'children', 'parents', 'sibling', 'siblings', 'i', 'me', 'ive', 'iam', 'ill'];

loadData();

// Load data
function loadData() {
    d3.json("data/stories.json").then(function(data) {
        let stories = data;
        stories.forEach((d, i) => {
            let male_keyword_count = 0, female_keyword_count = 0, neutral_keyword_count = 0;
            let cleanSentences = []
            let sentences = d.story.replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)/gm, "$1$2|").split('|')
            sentences.forEach((s) => {
                var cleanString = s.toLowerCase().replace(regex, '').trim(" ");
                cleanSentences.push(cleanString);
            });
            let filteredStory = cleanSentences.join(" ")
            d.story = filteredStory;

            let words = filteredStory.split(" ");
            words.forEach((d) => {
                if (male_keywords.includes(d))
                    male_keyword_count++;
                else if (female_keywords.includes(d))
                    female_keyword_count++;
                else if (neutral_keywords.includes(d))
                    neutral_keyword_count++;
            })

            let frequency = {};
            filteredStory.split(" ").forEach(function(w) {
                if (!frequency[w]) {
                    frequency[w] = 0;
                }
                frequency[w] += 1;
            });

            let sortFrequency = [];
            for (let f in frequency) {
                sortFrequency.push([f, frequency[f]]);
            }

            sortFrequency = sortFrequency.filter((a) => a[0].length > 1);

            sortFrequency.sort((a, b) =>  b[1] - a[1]);

            let frequency_list = [];
            sortFrequency.forEach((a) => {
                let temp = {"text": a[0], "count": a[1]}
                frequency_list.push(temp)
            })

            d.frequency_list = frequency_list.slice(0, 50);
            d.index = i;
            d.male_keyword_count = male_keyword_count;
            d.female_keyword_count = female_keyword_count;
            d.neutral_keyword_count = neutral_keyword_count;
        });

        console.log(stories);

        let colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

        let colorScale = d3
            .scaleOrdinal()
            .domain(stories.map((d) => d.title))
            .range(colorPalette.range())

        createVisualization(stories, colorScale);
    });
}

function createVisualization(stories, colorScale) {
    let storyList = new StoryList(stories, colorScale);
}
