export function relationshipLegendSketch(p) {
  p.setup = function () {
    let canvas = p.createCanvas(300, 300);
    canvas.parent(p._userNode); // ensures the canvas is appended to the correct DOM element
  };

  p.draw = function () {
    // p.background(255, 200, 200);
p.clear();
    // let legends = [
    //   { name: "Marvel", color: "#F0519E" },
    //   { name: "Harry Potter", color: "#589BCF" },
    //   { name: "Boku No Hero", color: "#87D4A5" },
    // ];
   
    // legends.forEach((legend, index) => {
    //     p.textAlign(p.LEFT, p.CENTER);
    //   p.fill(legend.color);
    //  p.noStroke();
    // //   p.ellipse(10, 10 + index * 30, 5);
    //   p.textSize(16);
    //   p.textStyle(p.BOLD);
    //   p.text(legend.name, 10, 15 + index * 30);
    // });

    p.rectMode(p.CENTER)
    p.strokeWeight(1);
    p.fill("#ffffffc8");
    p.stroke(0);
    p.rect(150, 100, 200, 20);
    p.rect(150, 130, 200, 20, 20);

    p.fill("#ffffff79");
    p.noStroke();
    p.rect(150, 150, 200, 20);

    p.textFont("Calibri, sans-serif");
    p.textSize(11);
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD)
    p.text("male", 150, 110);
    p.textStyle(p.BOLDITALIC)
    p.text("female", 150, 140);

    p.textStyle(p.ITALIC)
    p.text("other", 150,160);

    p.textAlign(p.CENTER, p.CENTER);

    p.text("frequency of", 250, 255);
    p.text("relationship", 250, 265);
    p.stroke(0);
    p.strokeWeight(5);
    p.line(20, 250, 210, 250);

    p.strokeWeight(2);
    p.line(20, 260, 210, 260);

    p.strokeWeight(1);
    p.line(20, 270, 210, 270);
  };
}
