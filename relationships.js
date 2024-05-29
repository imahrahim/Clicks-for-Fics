export function relationshipsSketch(p) {
  p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight);
      // Weitere Initialisierung
  };

  p.draw = function() {
      p.background(200);
      // Zeichnen der Beziehungen
  };

  p.loadData = function(dataUrl) {
      p.loadJSON(dataUrl, function(data) {
          console.log('Data loaded:', data);
          // Datenverarbeitungslogik hier
      });
  };

  p.updateRelationshipType = function(type) {
      console.log('Relationship type updated:', type);
      // Beziehungstyp-Logik hier
  };
}
