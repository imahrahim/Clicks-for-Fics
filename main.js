document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    const links = {
        'overall-link': { script: 'sketches/overall.js', class: 'overall', data: 'https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/data/Additional_Tags_Overall.csv' },
        'harry-potter-link': { script: 'sketches/harrypotter.js', class: 'harry-potter', data: 'https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/data/Additional_Tags_Harry_Potter.csv' },
        'marvel-link': { script: 'sketches/marvel.js', class: 'marvel', data: 'https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/data/Additional_Tags_Marvel.csv' },
        'boku-no-hero-link': { script: 'sketches/boku_no_hero.js', class: 'boku-no-hero', data: 'https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/data/Additional_Tags_Boku_No_Hero.csv' }
    };

    Object.keys(links).forEach(id => {
        document.getElementById(id).addEventListener('click', function (e) {
            e.preventDefault();
            loadSketch(links[id].script);
            changeBackground(links[id].class);
            updateBanner(links[id].data);
            changeBannerColor(links[id].class);
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

    function changeBannerColor(className) {
        const bannerContainer = document.getElementById('banner-container');
        bannerContainer.className = ''; // Remove any existing class
        bannerContainer.classList.add('overall', className); // Add the new class
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

                    const categorySymbol = getCategorySymbol(tag.category);
                    tagElement.innerHTML = `<img src="${categorySymbol}" alt="${tag.category}" style="width: 20px; height: 20px;"> ${tag.tag}`;

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

                    const categorySymbol = getCategorySymbol(tag.category);
                    tagElement.innerHTML = `<img src="${categorySymbol}" alt="${tag.category}" style="width: 20px; height: 20px;"> ${tag.tag}`;

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

    function getCategorySymbol(category) {
        // Define symbols or numbers for each category
        const categorySymbols = {
            "Romance": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/love.png",
            "Angst": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/angsst.png",
            "Action": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/blitz.png",
            "Fluff": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/chick.png",
            "Alternate Universe": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/universe.png",
            "Canon": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/canon.png",
            "Abuse": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/abuse.png",
            "Sex": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/lemonn.png",
            "Meta": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/meta.png",
            "Family": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/familyy.png",
            "Dark": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/tot.png",
            "Magic": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/magic.png",
            "Mental Health": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/butterfly.png",
            "Other": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/otherr.png",
            "Fandom": "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/fandom.png"
        };

        return categorySymbols[category] || "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/main/content/tags/fandom.png"; // Default symbol
    }

    // Load the default link
    const defaultLink = 'overall-link';
    console.log(`Loading default link: ${defaultLink}, Script: ${links[defaultLink].script}, Background: ${links[defaultLink].class}, Data: ${links[defaultLink].data}`);
    loadSketch(links[defaultLink].script);
    changeBackground(links[defaultLink].class);
    updateBanner(links[defaultLink].data);
    changeBannerColor(links[defaultLink].class);
});
