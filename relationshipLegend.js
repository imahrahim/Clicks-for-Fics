export function relationshipLegendSketch(p) {
    p.setup = function () {
        let canvas = p.createCanvas(300, 100);
        canvas.parent(p._userNode); // ensures the canvas is appended to the correct DOM element
    };

    p.draw = function () {
        p.background(255);

        let legends = [
            { name: "Marvel", color:"#F0519E"}, 
            { name: "Harry Potter", color: "#589BCF" }, 
            { name: "Boku No Hero", color: "#87D4A5"}  
        ];
    

        legends.forEach((legend, index) => {
            p.fill(legend.color);
            p.noStroke();
            p.ellipse(10, 10 + index * 30, 20);
            p.fill(0);
            p.textSize(12);
            p.text(legend.name, 30, 10 + index * 30);
        });
    };
}
