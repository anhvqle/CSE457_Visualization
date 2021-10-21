I used external resources:
1. https://remarkablemark.org/blog/2019/09/28/javascript-remove-punctuation/
2. https://stackoverflow.com/questions/18914629/split-string-into-sentences-in-javascript/31430385#31430385
3. Assignment 2 codes
4. http://bl.ocks.org/ericcoopey/6382449
5. http://bl.ocks.org/joews/9697914
6. https://www.d3-graph-gallery.com/graph/circular_barplot_label.html

- All codes implemented in the js folder. Main html file is index.html
- I make sure of the d3-tip library (/bower_components) for the tooltip as well as the d3 word cloud (d3.layout.cloud.js)
- Data are parsed and saved into both a csv and a json files. Each object has a title, which is the story title,
and a story, which includes the whole plot preprocessed. 
- Later on, I added the word frequency list for processed words of each story as well as the gender keyword counts for
male, female, and gender neutral.