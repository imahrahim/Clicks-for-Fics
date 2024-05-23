document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    const links = {
        'overall-link': 'sketches/overall.js',
        'harry-potter-link': 'sketches/harrypotter.js',
        'marvel-link': 'sketches/marvel.js',
        'boku-no-hero-link': 'sketches/boku_no_hero.js'
    };

    Object.keys(links).forEach(id => {
        document.getElementById(id).addEventListener('click', function (e) {
            e.preventDefault();
            loadSketch(links[id]);
        });
    });

    function loadSketch(scriptUrl) {
        console.log("Loading sketch:", scriptUrl);

        // Remove existing canvas
        let canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.remove();
        }

        // Remove existing script
        let oldScript = document.getElementById('sketch-script');
        if (oldScript) {
            oldScript.remove();
        }

        // Stop current p5.js instance
        if (window.p5 && window.p5.instance) {
            window.p5.instance.remove();
            console.log("Current p5.js instance stopped");
        }

        // Load new sketch script
        let script = document.createElement('script');
        script.src = scriptUrl;
        script.id = 'sketch-script';
        script.onload = function() {
            console.log("Sketch loaded:", scriptUrl);
        };
        script.onerror = function() {
            console.error("Failed to load sketch:", scriptUrl);
        };
        document.body.appendChild(script);
    }

    // Load the default sketch
    loadSketch('sketches/harrypotter.js');
});
