export function tagsSketch(p) {
    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        // Weitere Initialisierung
    };

    p.draw = function() {
        p.background(100);
        // Zeichnen der Tags
    };

    p.loadTagData = function(dataUrl) {
        p.loadTable(dataUrl, 'csv', function(data) {
            console.log('Tag data loaded:', data);
            // Datenverarbeitungslogik hier
        });
    };
}
