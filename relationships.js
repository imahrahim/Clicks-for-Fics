let dataShips;
let nodes = [];
let links = [];
let xScale, yCharacterScale, yFandomScale;
let h = 2000;

let currentRelationshipType = "romantic";

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
    let canvasContainer = document.getElementById("relationships-visualization");
    let canvas = p.createCanvas(canvasContainer.offsetWidth, 2000).parent("relationships-visualization");
    canvas.mouseClicked(p.handleClick);

    p.updateXScale();

    p.loadData("/data/Overall.json");

    window.addEventListener('resize', () => {
      p.updateXScale();
      p.updateNodePositions();
      p.drawVisualization();
    });
  };

  let selectedNode = null;

  p.handleClick = function () {
    let mouseX = p.mouseX;
    let mouseY = p.mouseY;
    let foundNode = null;
    nodes.forEach((node) => {
      if (p.dist(mouseX, mouseY, node.x, node.y) < 20) {
        foundNode = node;
      }
    });
    if (foundNode) {
      if (selectedNode === foundNode) {
        selectedNode = null;
      } else {
        selectedNode = foundNode;
        console.log("Node clicked:", selectedNode.id);
      }

      p.updateVisibility();
      p.drawVisualization();
    }
  };

  p.updateVisibility = function () {
    if (!selectedNode) {
      nodes.forEach(node => {
        if (node.group === "character") {
          node.visible = links.some(link => link.type === currentRelationshipType && (link.source === node.id || link.target === node.id));
        } else if (node.group === "fandom") {
          node.visible = nodes.some(character => character.visible && character.fandom === node.id);
        }
      });

      links.forEach(link => {
        link.visible = link.type === currentRelationshipType || link.type === "fandom";
      });
    } else {
      nodes.forEach(node => node.visible = false);
      links.forEach(link => link.visible = false);

      links.forEach(link => {
        if ((link.source === selectedNode.id || link.target === selectedNode.id) && (link.type === currentRelationshipType || link.type === "fandom")) {
          link.visible = true;
          let sourceNode = nodes.find(node => node.id === link.source);
          let targetNode = nodes.find(node => node.id === link.target);
          if (sourceNode) sourceNode.visible = true;
          if (targetNode) targetNode.visible = true;
        }
      });
    }

    p.updateFandomScale(); 
    p.updateNodePositions();

    p.drawVisualization();
  };

  p.updateXScale = function () {
    let relationshipContainer = document.getElementById("relationships-visualization");
    let w = relationshipContainer.offsetWidth;

    xScale = d3
      .scaleLog()
      .domain([1, d3.max(nodes, (d) => d.frequency) || 1])
      .range([150, w - 200]);
  };

  p.updateFandomScale = function () {
    let visibleFandomNodes = nodes.filter(node => node.visible && node.group === "fandom");

    yFandomScale = d3
      .scaleLinear()
      .domain([0, visibleFandomNodes.length])
      .range([20, h - 20]);
  };

  p.initializeCharacterScale = function () {
    let characterNodes = nodes.filter(node => node.group === "character");
    console.log('characterNode.length:', characterNodes.length)
    yCharacterScale = d3
      .scaleLinear()
      .domain([0, characterNodes.length])
      .range([20, h - 20]);
  };

  p.updateNodePositions = function () {
    p.initializeCharacterScale();
    let characterIndex = 0;
    let fandomIndex = 0;
    nodes.forEach((node) => {
        if (node.group === "character") {
          node.x = xScale(node.frequency + 1);
          node.y = yCharacterScale(characterIndex);
          characterIndex++;
        } else if (node.visible && node.group === "fandom") {
          node.x = 90;
          node.y = yFandomScale(fandomIndex); 
          fandomIndex++;
        }
    });
  };

  p.draw = function () {
    p.background(255, 1);
    let hoverNode = p.checkHover();
    p.drawVisualization();
    if (hoverNode) {
      p.drawTooltip(hoverNode);
    }
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
    let fandomNodes = new Set();

    Object.keys(data).forEach((character, index) => {
      const characterData = data[character];
      const characterNode = {
        id: character,
        group: "character",
        gender: characterData.gender,
        frequency: characterData.frequency,
        fandom: characterData.fandom,
        visible: false,
      };
      nodes.push(characterNode);

      if (characterData.fandom) {
        fandomNodes.add(characterData.fandom);
        links.push({
          source: character,
          target: characterData.fandom,
          type: "fandom",
          visible: false,
        });
      }

      ["romantic", "friendship"].forEach((type) => {
        characterData.relationships[type].forEach((relationship) => {
          links.push({
            source: character,
            target: relationship.target,
            type: type,
            visible: false,
          });
        });
      });
    });

    p.updateXScale(); 
    p.initializeCharacterScale(); 

    let index = 0;
    p.updateFandomScale(); 
    fandomNodes.forEach((fandom) => {
      nodes.push({
        id: fandom,
        group: "fandom",
        visible: false,
        x: 90,
        y: yFandomScale(index),
      });
      index++;
    });

    p.updateNodePositions();

    p.updateVisibility();
    p.drawVisualization();
  };

  p.drawVisualization = function () {
    if (!dataShips) {
      console.error("Data not loaded");
      return;
    }

    p.clear();

    for (const link of links) {
      if (link.visible) {
        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);
        if (sourceNode && targetNode && sourceNode.visible && targetNode.visible) {
          p.stroke(connectionsColors[link.type] || connectionsColors["other"]);
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

  p.updateRelationshipType = function (type) {
    currentRelationshipType = type;
    console.log("Relationship type updated:", type);

    p.updateVisibility();
  };

  p.checkHover = function () {
    let hoverNode = null;
    nodes.forEach((node) => {
      if (p.dist(p.mouseX, p.mouseY, node.x, node.y) < 20) {
        hoverNode = node;
      }
    });
    return hoverNode;
  };

  p.drawTooltip = function (node) {
    p.fill(255);
    p.noStroke();
    p.textSize(12);
    p.text(`ID: ${node.id}\nFrequency: ${node.frequency}`, 800, 200);
  };
}
