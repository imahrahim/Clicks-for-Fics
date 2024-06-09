export function tagsSketch(isReverse) {
    return function(p) {
        let tags = [];
        let scrollX = 0;
        let reverseScrollX = 0;

        let categoryImages = {};
        let currentFandom = "Overall";
        let overlayImg;

        const font = ('Whyte Inktrap');
        
        const fandomColors = {
            "Overall": { 
                ordered: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/Overall.png", 
                color: "#8056c4af",
                overlay: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/OverallT.png",
            },
            "Marvel": { 
                ordered: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/marvel.png",
                color: "#f0519ebf",
                overlay: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/MarvelT.png",
            },
            "Harry Potter": { 
                ordered: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/HarryPotter.png",
                color: "#589bcfae",
                overlay: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/HarryT.png",
            },
            "Boku No Hero": { 
                ordered: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/BokuNoHero.png",
                color: "#87d4a4df",
                overlay: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/BokuT.png",
            }
        };

        p.preload = function () {
            for (const [category, details] of Object.entries(fandomColors)) {
                details.overlayImg = p.loadImage(details.overlay, () => {}, () => {
                    console.error(`Fehler beim Laden des Overlays für ${category}`);
                });
            }
         
            const categories = ["love", "angsst", "blitz", "chick", "universe", "canon", "abuse", "lemonn", "substance2", "meta", "familyy", "tot", "magic", "butterfly", "otherr", "fandom"];
            categories.forEach(category => {
                categoryImages[category] = p.loadImage(`https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/tags/${category}.png`, () => {}, () => {
                    console.error(`Fehler beim Laden des Bildes für Kategorie ${category}`);
                });
            });
        };

        p.setup = function () {
            let canvasContainer = p._renderer.elt.parentElement;
            if (!canvasContainer) {
                console.log("Canvas-Container nicht gefunden.");
                return;
            }
            let canvas = p.createCanvas(canvasContainer.offsetWidth, 40).parent(canvasContainer);
            console.log("Canvas erstellt mit Breite:", canvasContainer.offsetWidth, " Höhe: 40");

            p.loadTagData("https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/data/Additional_Tags_Overall.csv", "Overall", isReverse);
        };

        p.draw = function () {
            p.clear();
            p.background(fandomColors[currentFandom].color)
            console.log(currentFandom)
            if (tags.length > 0) {
                drawTags();
            } else {
                console.log("Warten auf das Laden der Tags...");
            }
        };

        function mapFrequencyToWeight(frequency) {
            return p.map(frequency, 1, 20, 100, 900);
        }

        function drawTags() {
            if (tags.length === 0) {
                // console.log("Keine Tags zum Zeichnen verfügbar.");
                return;
            }
            let x = isReverse ? reverseScrollX : scrollX;
            p.textSize(24);
            tags.forEach(tag => {
                let img = categoryImages[tag.category.toLowerCase()];
                if (!img) {
                    // console.log("Kein Bild für Kategorie:", tag.category);
                    return;
                }
                let scaledWidth = 40;
                let scaledHeight = img.height * (scaledWidth / img.width);
                p.image(img, x, p.height / 2 - scaledHeight / 2, scaledWidth, scaledHeight);
        
                p.textFont(font);
                p.textStyle(p.NORMAL);
                p.textSize(20);
                p.textStyle(p.BOLD);
                p.textAlign(p.LEFT, p.CENTER);
                p.fill(0);
                p.text(tag.tag, x + scaledWidth + 5, p.height / 2);
        
                x += scaledWidth + p.textWidth(tag.tag) + 100;
            });
        
            let speed = p.map(p.mouseX, 0, p.width, 0.5, 10); 
            if (isReverse) {
                reverseScrollX += speed;
                if (reverseScrollX > p.width) reverseScrollX = -x;
            } else {
                scrollX -= speed;
                if (scrollX < -x + p.width) scrollX = 0;
            }
        }
        
        p.loadTagData = function (dataUrl, fandom, reverse) {
            p.loadTable(dataUrl, "csv", "header", (table) => {
                tags = table.getRows().map((row) => ({
                    tag: row.get("tag"),
                    frequency: row.get("frequency"),
                    category: row.get("category"),
                }));

                currentFandom = fandom;
                overlayImg = fandomColors[fandom].overlayImg;
                isReverse = reverse;
                p.redraw(); 
            });
        };

    };
}
