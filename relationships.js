export function relationshipsSketch(p) {
  p.setup = function() {
      p.createCanvas(p.windowWidth-50, 2000);
      // Weitere Initialisierung
  };

  p.draw = function() {
      p.background(255,1);
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
