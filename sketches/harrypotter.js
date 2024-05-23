new p5((sketch) => {
  let harryPotterData;
  let selectedCharacter = null;
  let relationshipType = "romantic";
  let selectedFandoms = new Set();
  let fandomPositions = {};
  let w = 1200;
  let h = 2000;

  sketch.preload = function () {
    console.log("Preloading data...");
    harryPotterData = sketch.loadJSON('data/harry_potter_love_mono_merged.json', () => {
        console.log("Data loaded:", harryPotterData);
        sketch.Fandoms();
    }, () => {
        console.error("Failed to load data");
    });
};

  sketch.Fandoms = function () {
    const fandoms = new Set();

    for (let character in harryPotterData) {
      fandoms.add(harryPotterData[character].fandom);
    }

    let i = 0;
    fandoms.forEach((fandom) => {
      fandomPositions[fandom] = {
        x: w-200,
        y: 50 + i * 10,
      };
      i++;
    });

    selectedFandoms = new Set(fandoms);
    console.log('fandomPositions', selectedFandoms);
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

    // Zeichnen der Visualisierung
    sketch.drawVisualization();
  };

  sketch.drawVisualization = function () {
    console.log("Drawing visualization...");


    if (!harryPotterData) {
      console.error("Data not loaded");
      return;
    }

    sketch.background(200, 200, 250); // Clear the canvas with the same background color
    
    
    sketch.textAlign(sketch.LEFT, sketch.CENTER);
    sketch.fill(255, 0, 0);
    for (let fandom in fandomPositions ) {
      sketch.ellipse(
        fandomPositions[fandom].x,
        fandomPositions[fandom].y,
        5
      );
      sketch.fill(0);
      sketch.text(
        fandom,
        fandomPositions[fandom].x + 15,
        fandomPositions[fandom].y
      );
    }
    
    // Create logarithmic scale for frequency
    let xScale = d3
      .scaleLog()
      .domain([1, d3.max(Object.values(harryPotterData), (d) => d.frequency)])
      .range([10, w- 250]);

    let yScale = d3
      .scaleLinear()
      .domain([0, Object.keys(harryPotterData).length])
      .range([50, h - 50]);

    let i = 0;
    sketch.rectMode(sketch.CENTER);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);

    for (let character in harryPotterData) {
      let node = harryPotterData[character];

      //Fandom and Character Links
      sketch.stroke(100, 100, 100,20);
      sketch.strokeWeight(1);
      if (fandomPositions[node.fandom]) {
        sketch.line(
          xScale(node.frequency + 1),
          yScale(i),
          fandomPositions[node.fandom].x,
          fandomPositions[node.fandom].y
        );
      }
      sketch.noStroke();
      if (node.fandom === "Harry Potter - J. K. Rowling") {
        sketch.fill(0, 0, 150);
      } else {
        sketch.fill(150);
      }
      sketch.rect(xScale(node.frequency + 1), yScale(i), 120, 10); // Rectangle centered

      sketch.fill(0);
      sketch.textSize(8);
      sketch.text(character, xScale(node.frequency + 1), yScale(i)); // Text centered

      node.connections.forEach((conn) => {
        let targetNode = harryPotterData[conn.target];
        if (targetNode) {
          sketch.stroke(100, 100, 150);
          sketch.strokeWeight(conn.frequency * 0.1);
          sketch.line(
            xScale(node.frequency + 1),
            yScale(i),
            xScale(targetNode.frequency + 1),
            yScale(Object.keys(harryPotterData).indexOf(conn.target))
          );
        }
      });

      i++;
    }

  };

  sketch.windowResized = function () {
    sketch.resizeCanvas(sketch.windowWidth - 20, sketch.windowHeight - 80);
    if (harryPotterData) {
      sketch.drawVisualization();
    }
  };
}, "canvas-container");
