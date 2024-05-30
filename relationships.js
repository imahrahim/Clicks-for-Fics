let dataShips;
let nodes = [];
let links = [];
let xScale, yCharacterScale, yFandomScale;
let h = 2000;

let currentRelationshipType = "romantic";

const fandomColors = {
  "Harry Potter - J. K. Rowling": "#0000ff",
  "Marvel": "#dd1b76",
  "Boku no Hero Academia": "#157b14",
  "Boku No Hero Academia": "#157b14",
  other: "#0000008d",
}
const fandomColorsFemale = {
  "Harry Potter - J. K. Rowling": "#ffffff",
  "Marvel": "#ffffff",
  "Boku no Hero Academia": "#ffffff",
  "Boku No Hero Academia": "#ffffff",
  other: "#ffffff8d",
}

const linksColors = {
  "fandom": "#ffffff3c",
  "romantic": "#cd4c79",
  "friendship": "#0ea65d",
}

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
    let buffer = 5; 
  
    nodes.forEach((node) => {
      let textWidth = p.textWidth(node.id);
      let textHeight = 10;  
  
      let textX1 = node.x - textWidth / 2 - buffer;
      let textX2 = node.x + textWidth / 2 + buffer;
      let textY1 = node.y - textHeight / 2 - buffer;
      let textY2 = node.y + textHeight / 2 + buffer;
  
      if (mouseX >= textX1 && mouseX <= textX2 && mouseY >= textY1 && mouseY <= textY2) {
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
    console.log('Canvas width:', relationshipContainer.offsetWidth);

    xScale = d3.scaleLog()
    .domain([1, d3.max(nodes, (d) => d.frequency) || 1])
    .range([200, w - 200]);
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
    let relationshipContainer = document.getElementById("relationships-visualization");
    let w = relationshipContainer.offsetWidth;
    p.background(255, 1);
    let hoverNode = p.checkHover();
    p.drawVisualization();
    if (hoverNode) {
      p.drawTooltip(hoverNode); // Update des Sticky Tooltips bei Hover
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
            frequency: relationship.frequency,
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
          p.stroke(linksColors[link.type]);
          if (link.type === 'fandom') {
            p.strokeWeight(1)
          } else {
            p.strokeWeight(link.frequency * 0.2);
          }
          p.line(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
        }
      }
    }

    p.rectMode(p.CENTER);
    p.textAlign(p.CENTER, p.CENTER);

    for (const node of nodes) {
      if (node.visible) {
        p.noStroke();
        if (node.gender === 'male') {
          p.stroke(255)
          p.strokeWeight(1)
          p.fill(fandomColors[node.fandom] || fandomColors["other"]);
          p.rect(node.x, node.y, 200, 12);
          p.noStroke();
          p.textFont(font);
          p.fill(255);
          p.textSize(8);
          p.text(node.id, node.x, node.y);
        } else if (node.gender === 'female') {
          p.stroke(fandomColors[node.fandom] || fandomColors["other"])
          p.strokeWeight(1)
          p.fill(fandomColorsFemale[node.fandom] || fandomColorsFemale["other"]);
          p.rect(node.x, node.y, 200, 12, 10);
          p.noStroke();
          p.textFont(font);
          p.fill(fandomColors[node.fandom] || fandomColors["other"]);
          p.textSize(8);
          p.text(node.id, node.x, node.y);
        }
        else {
          p.noStroke();
          p.textFont(font);
          p.fill(0);
          p.textSize(8);
          p.text(node.id, node.x, node.y);
        }

        if (node.group === "fandom") {
          p.fill(fandomColors[node.id] || fandomColors["other"]);
          p.stroke('#000000');
          p.strokeWeight(1);
          p.rect(node.x, node.y, 200, 10);

          p.textAlign(p.CENTER, p.CENTER);
          p.noStroke();
          p.fill(255);  // Weiße Schriftfarbe für besseren Kontrast
          p.textFont(font);
          p.textSize(8);  // Größere Schriftgröße
          p.text(node.id, node.x, node.y);
        }
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
    let buffer = 5;  // Puffer um den Text herum

    nodes.forEach((node) => {
      if (node.visible) {
        let textWidth = p.textWidth(node.id);
        let textHeight = 10;

        let textX1 = node.x - textWidth / 2 - buffer;
        let textX2 = node.x + textWidth / 2 + buffer;
        let textY1 = node.y - textHeight / 2 - buffer;
        let textY2 = node.y + textHeight / 2 + buffer;

        if (p.mouseX >= textX1 && p.mouseX <= textX2 && p.mouseY >= textY1 && p.mouseY <= textY2) {
          hoverNode = node;
        }
      }
    });

    let tooltip = document.getElementById('stickyTooltip');
    if (!hoverNode) {
      tooltip.style.display = 'none';
    } else {
      tooltip.style.display = 'block';
      tooltip.innerHTML = `${hoverNode.id}`;
    }
    return hoverNode;
  };

  p.drawTooltip = function (node) {
    let tooltip = document.getElementById('stickyTooltip');
    tooltip.innerHTML = `${node.id}`;
  };
}
