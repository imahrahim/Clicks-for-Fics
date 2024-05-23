new p5((sketch) => {
  let harryPotterData;
  let selectedCharacter = null;
  let relationshipType = "romantic";
  let fandomPositions = {};
  let w = 1310;
  let h = 2000;
  let opacity = 50; // Default opacity for non-highlighted elements

  let nodes = [];
  let links = [];
  let xScale, yScale;

  sketch.preload = function () {
    console.log("Preloading data...");
    harryPotterData = sketch.loadJSON(
      "data/harry_potter_love_mono_merged.json",
      () => {
        console.log("Data loaded:", harryPotterData);
        sketch.processData(harryPotterData);
        sketch.Fandoms();
      },
      () => {
        console.error("Failed to load data");
      }
    );
  };

  sketch.Fandoms = function () {
    const fandoms = new Set();

    for (let character in harryPotterData) {
      fandoms.add(harryPotterData[character].fandom);
    }

    let i = 0;
    fandoms.forEach((fandom) => {
      fandomPositions[fandom] = {
        x: 150,
        y: 50 + i * 15, // Adjusted the spacing for better visibility
        visible: true,
      };
      i++;
    });

    console.log("fandomPositions", fandomPositions);
  };

  sketch.processData = function (data) {
    // Create nodes and links from the data
    Object.keys(data).forEach((character) => {
      const characterData = data[character];
      const characterNode = {
        id: character,
        group: "character",
        gender: characterData.gender,
        frequency: characterData.frequency,
        fandom: characterData.fandom,
        visible: true, // Characters initially visible
      };
      nodes.push(characterNode);

      characterData.connections.forEach((relationship) => {
        links.push({
          source: character,
          target: relationship.target,
          category: relationship.category,
          visible: false,
          frequency: relationship.frequency,
        });
      });
    });

    // Define scales for positioning
    xScale = d3
      .scaleLog()
      .domain([1, d3.max(nodes, (d) => d.frequency)])
      .range([150, w - 100]);

    yScale = d3
      .scaleLinear()
      .domain([0, nodes.length])
      .range([50, h - 50]);

    // Set initial positions for nodes
    nodes.forEach((node, i) => {
      node.x = xScale(node.frequency + 1);
      node.y = yScale(i);
    });

    // Debugging: output all nodes and their positions
    console.log("Nodes:", nodes);
    console.log("Initial links:", links);
  };

  document
    .getElementById("relationship-select")
    .addEventListener("change", function () {
      relationshipType = this.value;
      sketch.drawVisualization();
    });

  sketch.setup = function () {
    console.log("Setup function called");
    let canvas = sketch.createCanvas(w, h);
    console.log("Canvas created");
    canvas.parent("canvas-container");
    sketch.background(200, 200, 250); // Setting a light gray background for visibility

    // Event listener for mouse clicks
    canvas.mousePressed(() => {
      const mouseX = sketch.mouseX;
      const mouseY = sketch.mouseY;

      // Check if a character node is clicked
      let clickedCharacter = null;

      for (let node of nodes) {
        let d = sketch.dist(mouseX, mouseY, node.x, node.y);
        if (d < 10 && node.visible && node.group === "character") {
          clickedCharacter = node.id;
          break;
        }
      }

      if (clickedCharacter) {
        if (selectedCharacter === clickedCharacter) {
          // If the same character is clicked again, reset the selection
          selectedCharacter = null;
        } else {
          selectedCharacter = clickedCharacter;
        }
        sketch.updateVisibility();
        sketch.drawVisualization();
      }
    });

    // Drawing the visualization
    sketch.drawVisualization();
  };

  sketch.updateVisibility = function () {
    if (!selectedCharacter) {
      // Reset all nodes and links to visible if no character is selected
      nodes.forEach((node) => {
        node.visible = true;
      });
      links.forEach((link) => {
        link.visible = true;
      });
      for (let fandom in fandomPositions) {
        fandomPositions[fandom].visible = true;
      }
      return;
    }

    let visibleFandoms = new Set();
    for (let node of nodes) {
      node.visible =
        selectedCharacter === node.id ||
        (selectedCharacter &&
          links.some(
            (link) =>
              (link.source === selectedCharacter && link.target === node.id) ||
              (link.target === selectedCharacter &&
                link.source === node.id &&
                link.visible)
          ));
      if (node.visible) {
        visibleFandoms.add(node.fandom);
      }
    }

    for (let link of links) {
      if (
        link.source === selectedCharacter ||
        link.target === selectedCharacter
      ) {
        link.visible = true;
      } else {
        link.visible = false;
      }
    }

    for (let fandom in fandomPositions) {
      fandomPositions[fandom].visible = visibleFandoms.has(fandom);
    }
  };

  sketch.drawVisualization = function () {
    console.log("Drawing visualization...");

    if (!harryPotterData) {
      console.error("Data not loaded");
      return;
    }

    sketch.background(200, 200, 250); // Clear the canvas with the same background color

    // Draw connections
    for (let link of links) {
      if (link.visible) {
        let sourceNode = nodes.find((n) => n.id === link.source);
        let targetNode = nodes.find((n) => n.id === link.target);
        if (
          sourceNode &&
          targetNode &&
          sourceNode.visible &&
          targetNode.visible
        ) {
          sketch.stroke(255,0,0);
          sketch.strokeWeight(link.frequency * 0.1);
          sketch.line(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
        }
      }
    }

    // Draw characters
    sketch.rectMode(sketch.CENTER);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);

    for (let node of nodes) {
      if (node.visible) {
        // Draw lines from characters to their fandoms
        if (fandomPositions[node.fandom]) {
          sketch.stroke(10, 20);
          sketch.strokeWeight(1);
          sketch.line(
            node.x,
            node.y,
            fandomPositions[node.fandom].x,
            fandomPositions[node.fandom].y
          );
        }

        // Draw nodes
        sketch.noStroke();
        sketch.fill(
          node.gender === "male"
            ? sketch.color(150, 150, 250)
            : sketch.color(220, 150, 220)
        );
        sketch.rect(node.x, node.y, 120, 10); // Rectangle centered

        sketch.fill(10);
        sketch.textSize(8);
        sketch.text(node.id, node.x, node.y); // Text centered
      }
    }

    // Draw fandoms
    for (let fandom in fandomPositions) {
      sketch.noStroke();
      sketch.textAlign(sketch.LEFT, sketch.CENTER);
      sketch.fill(0, fandomPositions[fandom].visible ? 255 : opacity);
      sketch.ellipse(fandomPositions[fandom].x, fandomPositions[fandom].y, 3);
      sketch.fill(0, fandomPositions[fandom].visible ? 255 : opacity);
      sketch.textSize(8);
      sketch.text(
        fandom,
        fandomPositions[fandom].x - 130,
        fandomPositions[fandom].y
      );
    }
  };

  sketch.windowResized = function () {
    sketch.resizeCanvas(sketch.windowWidth - 20, sketch.windowHeight - 80);
    if (harryPotterData) {
      sketch.drawVisualization();
    }
  };
}, "canvas-container");
