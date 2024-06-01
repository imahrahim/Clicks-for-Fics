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
        let canvas = p.createCanvas(200, legends.length * 25 + 20);
        canvas.parent(document.getElementById('legend-container'));
    };

    p.draw = function () {
        p.background(255,0);

        legends.forEach((legend, index) => {
            if (categoryImages[legend.imageKey]) {
                p.image(categoryImages[legend.imageKey], 10, 10 + index * 35, 30, 30);
            }
            p.fill(0);
            p.textSize(12);
            p.text(legend.name, 50, 30 + index * 35);
        });
    };
}
