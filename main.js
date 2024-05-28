document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    const links = {
        'overall-link': { script: 'sketches/overall.js', class: 'overall', data: '/data/Additional_Tags_Overall.csv' },
        'harry-potter-link': { script: 'sketches/harrypotter.js', class: 'harry-potter', data: '/data/Additional_Tags_Harry_Potter.csv' },
        'marvel-link': { script: 'sketches/marvel.js', class: 'marvel', data: '/data/Additional_Tags_Marvel.csv' },
        'boku-no-hero-link': { script: 'sketches/boku_no_hero.js', class: 'boku-no-hero', data: '/data/Additional_Tags_Boku_No_Hero.csv' }
    };

    Object.keys(links).forEach(id => {
        document.getElementById(id).addEventListener('click', function (e) {
            e.preventDefault();
            loadSketch(links[id].script);
            changeBackground(links[id].class);
            updateBanner(links[id].data);
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

    function updateBanner(dataUrl) {
        const banner = document.getElementById('banner');
        banner.innerHTML = '';

        d3.csv(dataUrl).then(data => {
            console.log("CSV Data loaded:", data);

            data.forEach(tag => {
                console.log("Processing tag:", tag);

                if (tag.tag && tag.frequency && tag.category) {
                    const tagElement = document.createElement('span');
                    tagElement.classList.add('tag');
                    tagElement.style.fontVariationSettings = `'wght' ${mapFrequencyToWeight(tag.frequency)}`;

                    const categoryImage = getCategoryImage(tag.category);
                    tagElement.innerHTML = `<img src="${categoryImage}" alt="${tag.category}" class="category-image" /> ${tag.tag}`;

                    banner.appendChild(tagElement);
                } else {
                    console.error("Tag data is incomplete:", tag);
                }
            });

            // Duplicate the tags for continuous scrolling
            data.forEach(tag => {
                if (tag.tag && tag.frequency && tag.category) {
                    const tagElement = document.createElement('span');
                    tagElement.classList.add('tag');
                    tagElement.style.fontVariationSettings = `'wght' ${mapFrequencyToWeight(tag.frequency)}`;

                    const categoryImage = getCategoryImage(tag.category);
                    tagElement.innerHTML = `<img src="${categoryImage}" alt="${tag.category}" class="category-image" /> ${tag.tag}`;

                    banner.appendChild(tagElement);
                }
            });
        }).catch(error => {
            console.error("Error loading CSV data:", error);
        });
    }

    function mapFrequencyToWeight(frequency) {
        // Map frequency to font weight between 100 and 900
        const minWeight = 100;
        const maxWeight = 900;
        const minFrequency = 1; // Adjust based on your data
        const maxFrequency = 183; // Adjust based on your data

        return Math.round(((frequency - minFrequency) / (maxFrequency - minFrequency)) * (maxWeight - minWeight) + minWeight);
    }

    function getCategoryImage(category) {
        // Define image paths for each category
        const categorySymbols = {
            "Romance": "/content/tags/love.png",
            "Angst": "/content/tags/angsst.png",
            "Action": "/content/tags/blitz.png",
            "Fluff": "/content/tags/chick.png",
            "Alternate Universe": "/content/tags/universe.png",
            "Canon": "/content/tags/canon.png",
            "Abuse": "/content/tags/abuse.png",
            "Sex": "/content/tags/lemonn.png",
            "Meta": "/content/tags/meta.png",
            "Family": "/content/tags/familyy.png",
            "Dark": "/content/tags/tot.png",
            "Magic": "/content/tags/magic.png",
            "Mental Health": "/content/tags/butterfly.png",
            "Other": "/content/tags/otherr.png",
            "Fandom": "/content/tags/fandom.png"
        };

        return categorySymbols[category] || "/content/tags/fandom.png"; // Default image
    }

    // Load the default link
    const defaultLink = 'overall-link';
    console.log(`Loading default link: ${defaultLink}, Script: ${links[defaultLink].script}, Background: ${links[defaultLink].class}, Data: ${links[defaultLink].data}`);
    loadSketch(links[defaultLink].script);
    changeBackground(links[defaultLink].class);
    updateBanner(links[defaultLink].data);
});
