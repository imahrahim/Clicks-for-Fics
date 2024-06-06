export function tagsSketch(isReverse) {
    return function(p) {
        let tags = [];
        let scrollX = 0;
        let reverseScrollX = 0;

        let categoryImages = {};
        let currentFandom = "Overall";
        const font = ('Whyte Inktrap');
        
        const fandomColors = {
            "Overall": { 
                ordered: "/content/background/Overall_O.png", 
                unordered: "/content/background/Overall_Tags.png", 
                color: "#8056c47e" 
            },
            "Marvel": { 
                ordered: "/content/background/Marvel_O.png", 
                unordered: "/content/background/Marvel_Tags.png", 
                color: "#f0519e74" 
            },
            "Harry Potter": { 
                ordered: "/content/background/Harry_O.png", 
                unordered: "/content/background/Harry_Tags.png", 
                color: "#589bcf6e" 
            },
            "Boku No Hero": { 
                ordered: "/content/background/Boku_O.png", 
                unordered: "/content/background/Boku_Tags.png", 
                color: "#87d4a473" 
            }
        };

        p.preload = function () {
            categoryImages["Romance"] = p.loadImage("/content/tags/love.png");
            categoryImages["Angst"] = p.loadImage("/content/tags/angsst.png");
            categoryImages["Action"] = p.loadImage("/content/tags/blitz.png");
            categoryImages["Fluff"] = p.loadImage("/content/tags/chick.png");
            categoryImages["Alternate Universe"] = p.loadImage("/content/tags/universe.png");
            categoryImages["Canon"] = p.loadImage("/content/tags/canon.png");
            categoryImages["Abuse"] = p.loadImage("/content/tags/abuse.png");
            categoryImages["Sex"] = p.loadImage("/content/tags/lemonn.png");
            categoryImages["Substance"] = p.loadImage("/content/tags/substance2.png");
            categoryImages["Meta"] = p.loadImage("/content/tags/meta.png");
            categoryImages["Family"] = p.loadImage("/content/tags/familyy.png");
            categoryImages["Dark"] = p.loadImage("/content/tags/tot.png");
            categoryImages["Magic"] = p.loadImage("/content/tags/magic.png");
            categoryImages["Mental Health"] = p.loadImage("/content/tags/butterfly.png");
            categoryImages["Other"] = p.loadImage("/content/tags/otherr.png");
            categoryImages["Fandom"] = p.loadImage("/content/tags/fandom.png");
        };

        p.setup = function () {
            let canvasContainer = p._renderer.elt.parentElement;
            if (!canvasContainer) {
                console.log("Canvas-Container nicht gefunden.");
                return;
            }
            let canvas = p.createCanvas(canvasContainer.offsetWidth, 40).parent(canvasContainer);
            console.log("Canvas erstellt mit Breite:", canvasContainer.offsetWidth, " Höhe: 40");

            p.loadTagData("/data/Additional_Tags_Overall.csv", "Overall", isReverse);
            updateBackground();
        };

        p.draw = function () {
            p.clear();
            p.background(fandomColors[currentFandom].color);
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
                console.log("Keine Tags zum Zeichnen verfügbar.");
                return;
            }
            let x = isReverse ? reverseScrollX : scrollX;
            p.textSize(24);
            tags.forEach(tag => {
                let img = categoryImages[tag.category];
                if (!img) {
                    // console.log("Kein Bild für Kategorie:", tag.category);
                    return;
                }
                let scaledWidth = 40;
                let scaledHeight = img.height * (scaledWidth / img.width);
                p.image(img, x, p.height / 2 - scaledHeight / 2, scaledWidth, scaledHeight);
        
                p.textFont(font);
                p.textStyle(p.NORMAL);
                p.textSize('1.5rem');
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
                isReverse = reverse;
                updateBackground();
                p.redraw(); 
            });
        };

        function updateBackground() {
            const order = document.getElementById('toggle-order-checkbox').checked ? 'unordered' : 'ordered';
            const backgroundImage = fandomColors[currentFandom][order];
            console.log("FandomColors:", currentFandom, order);
            if (backgroundImage) {
                document.body.style.backgroundImage = `url(${backgroundImage})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundAttachment = 'fixed';
            } else {
                console.error(`Background image for ${currentFandom} with order ${order} not found.`);
            }
        }

        document.getElementById('toggle-order-checkbox').addEventListener('change', updateBackground);
    };
}
