export function legendSketch(p) {
    let categoryImages = {};
    let legends = [
        { name: "Romance", imageKey: "love" },
        { name: "Angst", imageKey: "angsst" },
        { name: "Action", imageKey: "blitz" },
        { name: "Fluff", imageKey: "chick" },
        { name: "Alternate Universe", imageKey: "universe" },
        { name: "Canon", imageKey: "canon" },
        { name: "Abuse", imageKey: "abuse" },
        { name: "Sex", imageKey: "lemonn" },
        { name: "Substance", imageKey: "substance2" },
        { name: "Meta", imageKey: "meta" },
        { name: "Family", imageKey: "familyy" },
        { name: "Dark", imageKey: "tot" },
        { name: "Magic", imageKey: "magic" },
        { name: "Mental Health", imageKey: "butterfly" },
        { name: "Other", imageKey: "otherr" },
        { name: "Fandom", imageKey: "fandom" }
    ];

    p.preload = function () {
        legends.forEach(legend => {
            categoryImages[legend.imageKey] = p.loadImage(`/content/tags/${legend.imageKey}.png`,
                () => console.log(`Loaded image: ${legend.imageKey}`),
                () => console.error(`Failed to load image: ${legend.imageKey}`)
            );
        });
    };

    p.setup = function () {
        let container = document.getElementById('popup-tags-legend');
        if (container) {
            let canvas = p.createCanvas(300, legends.length * 25 + 20);
            canvas.parent(container);
        } else {
            console.error('Parent container not found');
        }
    };

    p.draw = function () {
        // p.background(255);

    //         let ratings = [
    //             { name: "Explicit", frequency: 206, color: '#b09eec' },
    //             { name: "Mature", frequency: 165, color: '#ff93ec' },
    //             { name: "Teen And Up Audiences", frequency: 455, color: '#b9f1ff' }, 
    //             { name: "General Audiences", frequency: 83, color: '#bdff9f'}, 
    //             { name: "Not Rated", frequency: 64, color: '#fef9b5'} 
    //             <span style="color: #b09eec; font-weight: bold;">Explicit</span>,
    //             <span style="color: #ff93ec; font-weight: bold;">Mature</span>
    //             <span style="color: #b9f1ff; font-weight: bold;">Teen And Up Audiences</span>
    //             <span style="color: #bdff9; font-weight: bold;">General Audiences</span>
    //             <span style="color: #fef9b5; font-weight: bold;">Not Rated</span>
    // ];
   
    // ratings.forEach((legend, index) => {
    //     p.textAlign(p.LEFT, p.CENTER);
    //   p.fill(legend.color);
    //  p.noStroke();
    // //   p.ellipse(10, 10 + index * 30, 5);
    //   p.textSize(16);
    //   p.textStyle(p.BOLD);
    //   p.text(legend.name, 10, 15 + index * 30);
    // });

        legends.forEach((legend, index) => {
            if (categoryImages[legend.imageKey]) {
                p.image(categoryImages[legend.imageKey], 10, 10 + index * 25, 20, 20);
            }
            p.fill(255);
            p.textSize(12);
            p.text(legend.name, 100, 25 + index * 25);
        });
    };
}
