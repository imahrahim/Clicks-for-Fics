document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    const links = {
        'overall-link': { script: 'sketches/overall.js', class: 'overall' },
        'harry-potter-link': { script: 'sketches/harrypotter.js', class: 'harry-potter' },
        'marvel-link': { script: 'sketches/marvel.js', class: 'marvel' },
        'boku-no-hero-link': { script: 'sketches/boku_no_hero.js', class: 'boku-no-hero' }
    };

    Object.keys(links).forEach(id => {
        document.getElementById(id).addEventListener('click', function (e) {
            e.preventDefault();
            loadSketch(links[id].script);
            changeBackground(links[id].class);
        });
    });

    document.getElementById('relationships-btn').addEventListener('click', function () {
        showRelationships();
    });

    document.getElementById('additional-tags-btn').addEventListener('click', function () {
        toggleAdditionalTags();
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

        // Ensure canvas-container and relationship-filter are visible
        document.getElementById('canvas-container').style.visibility = 'visible';
        document.getElementById('relationship-filter').style.visibility = 'visible';
        document.getElementById('additional-tags-container').style.visibility = 'hidden';
    }

    function showRelationships() {
        document.getElementById('canvas-container').style.visibility = 'visible';
        document.getElementById('relationship-filter').style.visibility = 'visible';
        document.getElementById('additional-tags-container').style.visibility = 'hidden';
    }

    function toggleAdditionalTags() {
        let canvasContainer = document.getElementById('canvas-container');
        let additionalTagsContainer = document.getElementById('additional-tags-container');
        let relationshipFilter = document.getElementById('relationship-filter');
        
        if (additionalTagsContainer.style.visibility === 'hidden') {
            canvasContainer.style.visibility = 'hidden';
            relationshipFilter.style.visibility = 'hidden';
            additionalTagsContainer.style.visibility = 'visible';
        } else {
            canvasContainer.style.visibility = 'visible';
            relationshipFilter.style.visibility = 'visible';
            additionalTagsContainer.style.visibility = 'hidden';
        }
    }

    function changeBackground(className) {
        document.body.className = className;
    }

    // Load the default sketch
    loadSketch('sketches/harrypotter.js');
});
