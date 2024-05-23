new p5((sketch) => {
    let harryPotterData;

    sketch.preload = function() {
        console.log("Preloading data...");
        harryPotterData = sketch.loadJSON('data/harry_potter_love_mono_merged.json', () => {
            console.log("Data loaded:", harryPotterData);
        }, () => {
            console.error("Failed to load data");
        });
    };

    sketch.setup = function() {
        console.log("Setup function called");
        let canvas = sketch.createCanvas(1200, 800);
        console.log("Canvas created");
        canvas.parent('canvas-container');
        sketch.background(220);  // Setting a light gray background for visibility

        // Zeichnen der Visualisierung
        sketch.drawVisualization();
    };

    sketch.drawVisualization = function() {
        console.log("Drawing visualization...");

        if (!harryPotterData) {
            console.error("Data not loaded");
            return;
        }

        sketch.background(200,200,250);  // Clear the canvas with the same background color

        // Create logarithmic scale for frequency
        let xScale = d3.scaleLog()
            .domain([1, d3.max(Object.values(harryPotterData), d => d.frequency)])
            .range([10, sketch.width - 120]);

        let yScale = d3.scaleLinear()
            .domain([0, Object.keys(harryPotterData).length])
            .range([50, sketch.height - 50]);

            let i = 0;
            sketch.rectMode(sketch.CENTER);
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
    
            for (let character in harryPotterData) {
                let node = harryPotterData[character];
                sketch.noStroke();
                sketch.fill(150);
                sketch.rect(xScale(node.frequency + 1), yScale(i), 120, 10);  // Rectangle centered
    
                sketch.fill(0);
                sketch.textSize(8);
                sketch.text(character, xScale(node.frequency + 1), yScale(i));  // Text centered
    
                node.connections.forEach(conn => {
                    let targetNode = harryPotterData[conn.target];
                    if (targetNode) {
                        sketch.stroke(100,100,150);
                        sketch.line(xScale(node.frequency + 1), yScale(i), 
                                    xScale(targetNode.frequency + 1), yScale(Object.keys(harryPotterData).indexOf(conn.target)));
                    }
                });
    
                i++;
            }
    };

    sketch.windowResized = function() {
        sketch.resizeCanvas(sketch.windowWidth - 20, sketch.windowHeight - 80);
        if (harryPotterData) {
            sketch.drawVisualization();
        }
    };
}, 'canvas-container');
