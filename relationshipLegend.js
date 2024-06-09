export function relationshipLegendSketch(p) {
  p.setup = function () {
    let canvas = p.createCanvas(300, 400);
    canvas.parent(p._userNode); // ensures the canvas is appended to the correct DOM element
  };

  p.draw = function () {
    // p.background(255, 200, 200);
p.clear();

    p.rectMode(p.CENTER)
    p.textAlign(p.CENTER, p.CENTER);

    p.strokeWeight(2);
    p.fill("#ffffffff");
    p.stroke(0);
    p.rect(150, 50, 290, 20);
    p.rect(150, 80, 290, 20, 20);

    p.fill("#ffffff79");
    p.noStroke();
    p.rect(150, 110, 290, 20);

    p.textFont("Whyte");
    p.textSize(11);
    p.fill(0);
    p.textStyle(p.BOLD)
    p.text("male", 150, 50);
    p.textStyle(p.BOLDITALIC)
    p.text("female", 150, 80);

    p.textStyle(p.ITALIC)
    p.text("other", 150,110);

  

    p.rectMode(p.CORNER);
    let w = 300;
    let xScale = d3.scaleLog()
    .domain([1, 100 || 1])
    .range([10, w - 10]);
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
            p.fill('#ffffff38')
            if (x >= 0 && x <= p.width - 10) {
                p.rect(x, 170, rectWidth, 70); 
                p.push()
                p.angleMode(p.DEGREES)
                p.translate(x+1, 185); 
                p.rotate(270); 
                p.fill(255)
                p.textSize(8)
                p.text(i-1,0,0)
                p.pop()
            }
        }
        draw = !draw;
    }

    p.fill(255)
    p.textStyle(p.NORMAL)
    p.text("gender of character", 150, 20);
    p.text("frequency of character = (f)", 150, 155);
    p.text("frequency of relationships", 150, 280);

    p.stroke(255);
    p.strokeWeight(5);
    p.line(10, 300, 290, 330);

    p.strokeWeight(2);
    p.line(10, 310, 290, 340);

    p.strokeWeight(1);
    p.line(10, 320, 290, 350);

  };
}
