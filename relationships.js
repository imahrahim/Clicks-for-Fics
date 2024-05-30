let dataShips;
let nodes = [];
let links = [];
let xScale, yScale;
let h = 2000;

const connectionsColors = {
  "male-male": "#609199",
  "female-male": "#ff1493",
  "male-female": "#ff1493",
  "female-female": "#ffaa00",
  other: "#bdb6ba",
};

const nodesColor = "#ffffff";
const font = "BasementGrotesque";

export function relationshipsSketch(p) {
  p.setup = function () {
    let canvasContainer = document.getElementById(
      "relationships-visualization"
    );
    let canvas = p
      .createCanvas(canvasContainer.offsetWidth, 2000)
      .parent("relationships-visualization");
    canvas.mouseClicked(p.handleClick);

    p.loadData("/data/Overall.json");
  };

  p.handleClick = function () {
    let mouseX = p.mouseX;
    let mouseY = p.mouseY;
    nodes.forEach((node) => {
      if (p.dist(mouseX, mouseY, node.x, node.y) < 5) {
        console.log("Node clicked:", node.id);
        p.updateVisibility(node);
      }
    });
  };

  p.draw = function () {
    p.background(255, 1); // Setze Hintergrundfarbe und Transparenz
    p.drawVisualization();
  };

  p.loadData = function (dataUrl) {
    p.loadJSON(dataUrl, function (data) {
      dataShips = data;
      console.log("Data loaded:", dataShips);
      p.processData(dataShips);
    });
  };

  p.processData = function (data) {
    nodes = [];
    links = [];

    Object.keys(data).forEach((character, index) => {
      const characterData = data[character];
      const characterNode = {
        id: character,
        group: "character",
        gender: characterData.gender,
        frequency: characterData.frequency,
        fandom: characterData.fandom,
        visible: true,
      };
      nodes.push(characterNode);

      ["romantic", "friendship"].forEach((type) => {
        characterData.relationships[type].forEach((relationship) => {
          links.push({
            source: character,
            target: relationship.target,
            type: type,
            visible: true,
            frequency: relationship.frequency,
          });
        });
      });
    });

    p.updateScales();

    nodes.forEach((node, i) => {
      node.x = xScale(node.frequency + 1);
      node.y = yScale(i);
    });

    // console.log("Nodes:", nodes);
    // console.log("Initial links:", links);
  };

  p.drawVisualization = function () {
    if (!dataShips) {
      console.error("Data not loaded");
      return;
    }

    for (const link of links) {
      if (link.visible) {
        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);
        if (
          sourceNode &&
          targetNode &&
          sourceNode.visible &&
          targetNode.visible
        ) {
          p.stroke(
            connectionsColors[link.category] || connectionsColors["other"]
          );
          p.strokeWeight(link.frequency * 0.2);
          p.line(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
        }
      }
    }

    p.rectMode(p.CENTER);
    p.textAlign(p.CENTER, p.CENTER);

    for (const node of nodes) {
      if (node.visible) {
        p.noStroke();
        p.fill(nodesColor);
        p.rect(node.x, node.y, 160, 12);

        p.textFont(font);
        p.fill(10);
        p.textSize(8);
        p.text(node.id, node.x, node.y);
      }
    }
  };

  p.updateVisibility = function (selectedNode) {
    nodes.forEach((node) => (node.visible = false)); // Erst alle ausblenden
    links.forEach((link) => {
      link.visible = false; // Erst alle Verbindungen ausblenden
      if (link.source === selectedNode.id || link.target === selectedNode.id) {
        link.visible = true;
        nodes.find(
          (n) => n.id === link.source || n.id === link.target
        ).visible = true;
      }
    });
    p.drawVisualization();
  };

  p.drawNode = function (node) {
    if (node.visible) {
      p.fill(node.color || nodesColor);
      p.ellipse(node.x, node.y, 20, 20);
      p.fill(0);
      p.text(node.id, node.x, node.y + 4);
    }
  };

  p.updateScales = function () {
    let relationshipContainer = document.getElementById("relationships-visualization");
    let w = relationshipContainer.offsetWidth;

    xScale = d3
      .scaleLog()
      .domain([1, d3.max(nodes, (d) => d.frequency)])
      .range([150, w - 100]);

    yScale = d3
      .scaleLinear()
      .domain([0, nodes.length])
      .range([20, h - 20]);
  };

  p.updateRelationshipType = function (type) {
    console.log("Relationship type updated:", type);
    links.forEach((link) => {
      link.visible = link.type === type;
    });
    p.drawVisualization();
  };
}
