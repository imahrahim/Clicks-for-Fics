let dataShips;
let nodes = [];
let links = [];
let xScale, yCharacterScale, yFandomScale;
let h = 2000;
let currentRelationshipType = 'romantic';
let visibleFandomNodes = [];
let fandomText = 200;

let selectedNode = null;

const fandomColors = {
  "Harry Potter - J. K. Rowling": "#589BCF",
  "Marvel": "#F0519E",
  "Boku no Hero Academia": "#87D4A5",
  "Boku No Hero Academia": "#87D4A5",
  other: "#ffffff81",
};

const otherColors = {
  "Harry Potter - J. K. Rowling": "#589bcf74",
  "Marvel": "#f0519e7e",
  "Boku no Hero Academia": "#87d4a480",
  "Boku No Hero Academia": "#87d4a480",
  other: "#ffffff8d",
}

const fandomColorsHover = {
  "Harry Potter - J. K. Rowling": "#589BCF",
  "Marvel": "#F0519E",
  "Boku no Hero Academia": "#87D4A5",
  "Boku No Hero Academia": "#87D4A5",
  other: "#ffffffff",
};

const otherColorsHover = {
  "Harry Potter - J. K. Rowling": "#589bcfff",
  "Marvel": "#f0519eff",
  "Boku no Hero Academia": "#87d4a4ff",
  "Boku No Hero Academia": "#87d4a4ff",
  other: "#ffffffff",
}

const linksColors = {
  "fandom": "#8056c43f",
  "romantic": "#0e0917",
  "friendship": "#ffffff",
};

const font = ('Whyte')

export function relationshipsSketch(p) {
 
  p.setup = function () {
    let canvasContainer = document.getElementById("relationships-visualization");
    let canvas = p.createCanvas(canvasContainer.offsetWidth, 2000).parent("relationships-visualization");
    canvas.mouseClicked(p.handleClick);

    p.loadData("https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/data/Overall.json");

    window.addEventListener('resize', () => {
      p.updateXScale();
      p.updateNodePositions();
      p.drawVisualization();
    });
  };

  p.resetSelectedNode = function () {
    selectedNode = null;
    p.updateVisibility();
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

    Object.keys(data).forEach((character) => {
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

      if (characterData.fandom) {
        fandomNodes.add(characterData.fandom);
        links.push({
          source: character,
          target: characterData.fandom,
          type: "fandom",
          visible: true, 
        });
      }

      ["romantic", "friendship"].forEach((type) => {
        characterData.relationships[type].forEach((relationship) => {
          links.push({
            source: character,
            target: relationship.target,
            frequency: relationship.frequency,
            type: type,
            visible: true, 
          });
        });
      });
    });

    p.updateXScale();
    p.initializeCharacterScale();

    let index = 0;
    visibleFandomNodes = Array.from(fandomNodes);
    p.updateFandomScale(); 

    visibleFandomNodes.forEach((fandom) => {
      nodes.push({
        id: fandom,
        group: "fandom",
        visible: true,
        x: fandomText, 
        y: yFandomScale(index), 
      });
      index++;
    });

    p.updateNodePositions();
    p.updateVisibility();
  };


  p.draw = function () {
    p.clear();
    p.drawVisualization();
    p.checkHover();
  };

  p.drawBackgroundScale = function () {
    p.rectMode(p.CORNER);
    let startX = xScale.domain()[0];
    let endX = xScale.domain()[1];
    let step = 10; 
    let draw = true; 

    for (let i = startX; i < endX; i += step) {
        let x = xScale(i);
        let xNext = xScale(i + step);
        let rectWidth = xNext - x; 
        
        if (draw) {
            p.noStroke();
            p.fill('#ffffff7e')
            if (x >= 200 && x <= p.width - 150) {
                p.rect(x, 0, rectWidth, p.height); 
                p.push()
                p.angleMode(p.DEGREES)
                p.translate(x+1, 10); 
                p.rotate(270); 
                p.fill(0);
                p.textAlign(p.CENTER, p.CENTER); 
                p.fill(0)
                p.textSize(8)
                p.text(i-1,0,0)
                p.pop()
            }
        }
        draw = !draw;
    }
};

p.drawVisualization = function () {
  if (!dataShips) {
      console.error("Data not loaded");
      return;
  }

  p.clear();
  p.drawBackgroundScale();

  // Zeichne zuerst alle regulären Links und Knoten (nicht hervorgehoben)
  for (const link of links) {
      if (link.visible) {
          const sourceNode = nodes.find((n) => n.id === link.source);
          const targetNode = nodes.find((n) => n.id === link.target);
          if (sourceNode && targetNode && sourceNode.visible && targetNode.visible) {
              p.stroke(link.type === 'fandom' ? (fandomColors[sourceNode.fandom] || linksColors[link.type]) : linksColors[link.type]);
              p.strokeWeight(link.type === 'fandom' ? 1 : link.frequency * 0.5);
              p.line(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
          }
      }
  }

  p.rectMode(p.CENTER);
  p.textAlign(p.CENTER, p.CENTER);

  // Zeichne alle regulären Knoten (nicht hervorgehoben)
  for (const node of nodes) {
      if (node.visible && !node.isHovered) {
          p.noStroke();
          let rectWidth = 230;
          let rectHeight = 15;
          let textSize = 10;

          if (node.group === "character") {
              if (node.gender === 'female'){
                  p.fill(fandomColors[node.fandom] || fandomColors["other"]);
                  p.stroke(0);
                  p.strokeWeight(1);
                  p.rect(node.x, node.y, rectWidth, rectHeight, 20);
              } else if (node.gender === 'male') {
                  p.fill(fandomColors[node.fandom] || fandomColors["other"]);
                  p.stroke(0);
                  p.strokeWeight(1);
                  p.rect(node.x, node.y, rectWidth, rectHeight);
              } else {
                  p.fill(otherColors[node.fandom] || otherColors['other']);
                  p.stroke(255);
                  p.strokeWeight(0);
                  p.rect(node.x, node.y, rectWidth, rectHeight);
              }

              p.noStroke();
              p.fill(0);
              p.textFont(font);
              if (node.gender === 'male') {
                  p.textStyle(p.BOLD);
              } else if (node.gender === 'female') {
                  p.textStyle(p.BOLDITALIC);
              } else {
                  p.textStyle(p.ITALIC);
              }
              p.textSize(textSize);
              p.text(node.id, node.x, node.y);

          } else if (node.group === "fandom") {
              p.fill(255, 0);
              p.rect(node.x - 100, node.y, 200, 30);
              p.fill(fandomColors[node.id] || 'black');
              p.ellipse(node.x, node.y, 4);
              p.textAlign(p.RIGHT, p.CENTER);
              p.strokeWeight(1);
              p.stroke(0);
              p.fill(fandomColors[node.id] || 'white');
              p.textFont(font);
              p.textStyle(p.BOLD);
              p.textSize(10);
              p.text(node.id.toUpperCase(), node.x - 10, node.y);
          }
      }
  }

  // Zeichne die hervorgehobenen Knoten zuletzt, damit sie oben liegen
  for (const node of nodes) {
      if (node.visible && node.isHovered) {
          p.noStroke();
          let rectWidth = 300;
          let rectHeight = 25;
          let textSize = 14;


          if (node.group === "character") {
              if (node.gender === 'female'){
                  p.fill(fandomColorsHover[node.fandom] || fandomColorsHover["other"]);
                  p.stroke(0);
                  p.strokeWeight(3);
                  p.rect(node.x, node.y, rectWidth, rectHeight, 20);
              } else if (node.gender === 'male') {
                  p.fill(fandomColorsHover[node.fandom] || fandomColorsHover["other"]);
                  p.stroke(0);
                  p.strokeWeight(3);
                  p.rect(node.x, node.y, rectWidth, rectHeight);
              } else {
                  p.fill(otherColorsHover[node.fandom] || otherColorsHover['other']);
                  p.stroke(255);
                  p.strokeWeight(0);
                  p.rect(node.x, node.y, rectWidth, rectHeight);
              }

              p.noStroke();
              p.fill(0);
              p.textFont(font);
              p.textAlign(p.CENTER, p.CENTER);
              if (node.gender === 'male') {
                  p.textStyle(p.BOLD);
              } else if (node.gender === 'female') {
                  p.textStyle(p.BOLDITALIC);
              } else {
                  p.textStyle(p.ITALIC);
              }
              p.textSize(textSize);
              let displayText = node.id;
              if (node.isHovered) {
                  displayText += ` (${node.frequency})`;
              }
              p.text(displayText, node.x, node.y);
          }  else if (node.group === "fandom") {
            p.fill(255, 0);
            p.rect(node.x - 100, node.y, 200, 30);
            p.fill(fandomColors[node.id] || 'black');
            p.ellipse(node.x, node.y, 8);  
            p.textAlign(p.RIGHT, p.CENTER);
            p.strokeWeight(1);
            p.stroke(0);
            p.fill(fandomColors[node.id] || 'white');
            p.textFont(font);
            p.textStyle(p.BOLD);
            p.textSize(12);  
            p.text(node.id.toUpperCase(), node.x - 10, node.y);
        }
      }
  }
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

      if (mouseX >= textX1 && mouseX <= textX2 && mouseY >= textY1 && mouseY <= textY2 && node.visible === true) {
        foundNode = node;
      }
    });

    if (foundNode) {
      selectedNode = selectedNode === foundNode ? null : foundNode;
      // console.log("Node clicked:", selectedNode ? selectedNode.id : "none");

      p.updateVisibility();
    }
  };

  p.updateVisibility = function () {
    if (!selectedNode) {
        nodes.forEach(node => {
            if (node.group === "character") {
                node.visible = links.some(link => 
                    (link.type === currentRelationshipType) && 
                    (link.source === node.id || link.target === node.id)
                );
            } else if (node.group === "fandom") {
                node.visible = nodes.some(character => 
                    character.visible && character.fandom === node.id
                );
            }
        });

        links.forEach(link => {
            link.visible = (link.type === currentRelationshipType) && 
                (nodes.find(n => n.id === link.source).visible || nodes.find(n => n.id === link.target).visible);
        });
    } else {
        nodes.forEach(node => node.visible = false);
        links.forEach(link => link.visible = false);

        links.forEach(link => {
            if ((link.source === selectedNode.id || link.target === selectedNode.id) && 
                (link.type === currentRelationshipType || link.type === "fandom")) {
                link.visible = true;
                let sourceNode = nodes.find(node => node.id === link.source);
                let targetNode = nodes.find(node => node.id === link.target);
                if (sourceNode) sourceNode.visible = true;
                if (targetNode) targetNode.visible = true;
            }
        });

        links.forEach(link => {
            if (link.type === "fandom") {
                let sourceNode = nodes.find(node => node.id === link.source);
                let targetNode = nodes.find(node => node.id === link.target);
                if (sourceNode && targetNode) {
                    if (sourceNode.visible || targetNode.visible) {
                        link.visible = true;
                    }
                }
            }
        });
    }

    nodes.forEach(node => {
        if (node.group === "fandom") {
            node.visible = nodes.some(character => 
                character.visible && character.fandom === node.id
            );
        }
    });

    p.updateFandomScale(); 
    p.updateNodePositions();
    p.drawVisualization();
  };

  p.updateRelationshipType = function (type) {
    currentRelationshipType = type;
    // console.log("Relationship type updated:", type);

    p.updateVisibility();
    p.updateFandomScale(); 
    p.updateNodePositions();
    p.drawVisualization();
  };

  p.initializeCharacterScale = function () {
    let characterNodes = nodes.filter(node => node.group === "character");
    // console.log('Character nodes length:', characterNodes.length);
    yCharacterScale = d3
      .scaleLinear()
      .domain([0, characterNodes.length])
      .range([20, h - 20]);
  };

  p.updateXScale = function () {
    let relationshipContainer = document.getElementById("relationships-visualization");
    let w = relationshipContainer.offsetWidth;
    // console.log('Canvas width:', relationshipContainer.offsetWidth);

    xScale = d3.scaleLog()
    .domain([1, d3.max(nodes, (d) => d.frequency) || 1])
    .range([200, w - 150]);
  };

  p.updateFandomScale = function () {
    yFandomScale = d3
      .scaleLinear()
      .domain([0, visibleFandomNodes.length])
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
        node.x = fandomText;
        node.y = yFandomScale(fandomIndex);
        fandomIndex++;
      }
    });
    // console.log("Node positions updated");
  };

  p.checkHover = function () {
    let hoverNode = null;
    let buffer = 5;  

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

    if (hoverNode) {
      p.cursor(p.HAND);
  } else {
      p.cursor(p.ARROW);
  }

    nodes.forEach((node) => {
        node.isHovered = node === hoverNode;
    });

    return hoverNode;
};

}
