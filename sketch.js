let data;
let selectedFandoms = new Set();
let relationshipType = 'romantic';

function preload() {
    // Load your JSON data here
    data = loadJSON('harry_potter_love_mono_merged.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    createNavbar();
    drawVisualization();
}

function drawVisualization() {
    background(255);
    // Implement your visualization logic here using d3.js
    let nodes = [];
    let links = [];

    // Populate nodes and links based on the selected fandoms and relationship type
    for (let character in data) {
        if (selectedFandoms.size === 0 || selectedFandoms.has(data[character].fandom)) {
            nodes.push({
                id: character,
                frequency: data[character].frequency,
                fandom: data[character].fandom
            });

            data[character].connections.forEach(conn => {
                links.push({
                    source: character,
                    target: conn.target,
                    frequency: conn.frequency
                });
            });
        }
    }

    // Create scales
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(nodes, d => d.frequency)])
        .range([50, width - 50]);

    let yScale = d3.scaleLinear()
        .domain([0, nodes.length])
        .range([50, height - 50]);

    // Draw nodes and links
    nodes.forEach((node, i) => {
        fill(150);
        ellipse(xScale(node.frequency), yScale(i), 10, 10);
        text(node.id, xScale(node.frequency) + 10, yScale(i));
    });

    links.forEach(link => {
        let sourceNode = nodes.find(n => n.id === link.source);
        let targetNode = nodes.find(n => n.id === link.target);

        if (sourceNode && targetNode) {
            stroke(200);
            line(xScale(sourceNode.frequency), yScale(nodes.indexOf(sourceNode)), 
                 xScale(targetNode.frequency), yScale(nodes.indexOf(targetNode)));
        }
    });
}

function createNavbar() {
    let navbar = select('.navbar');
    navbar.child('a#overall').mousePressed(() => loadData('overall.json'));
    navbar.child('a#harry-potter').mousePressed(() => loadData('harry_potter_love_mono_merged.json'));
    navbar.child('a#marvel').mousePressed(() => loadData('marvel.json'));
    navbar.child('a#boku-no-hero').mousePressed(() => loadData('boku_no_hero.json'));
}

function loadData(filename) {
    data = loadJSON(filename, () => {
        selectedFandoms.clear();
        drawVisualization();
    });
}
