document.addEventListener('DOMContentLoaded', function () {
    const homePage = document.getElementById('home-page');
    const navbar = document.getElementById('navbar');
    const bannerContainer = document.getElementById('banner-container');
    const canvasContainer = document.getElementById('canvas-container');
    const relationshipFilter = document.getElementById('relationship-filter');
    const additionalTagsContainer = document.getElementById('additional-tags-container');
    const homeLink = document.getElementById('home-link');

    // Show homepage by default
    homePage.style.display = 'block';
    navbar.style.display = 'none';
    canvasContainer.style.display = 'none';
    bannerContainer.style.display = 'none';

    document.getElementById('relationships-btn-home').addEventListener('click', function () {
        homePage.style.display = 'none';
        navbar.style.display = 'flex';
        canvasContainer.style.display = 'block';
        relationshipFilter.style.display = 'block';
        additionalTagsContainer.style.display = 'none';
        loadSketch('sketches/overall.js');
        changeBackground('overall');
        updateBanner('/data/Additional_Tags_Overall.csv', 'overall');
        changeBannerColor('overall');
    });

    document.getElementById('additional-tags-btn-home').addEventListener('click', function () {
        homePage.style.display = 'none';
        navbar.style.display = 'flex';
        canvasContainer.style.display = 'none';
        relationshipFilter.style.display = 'none';
        additionalTagsContainer.style.display = 'block';
        updateBanner('/data/Additional_Tags_Overall.csv', 'overall');
        changeBackground('overall');
        bannerContainer.style.display = 'block';
    });

    homeLink.addEventListener('click', function (e) {
        e.preventDefault();
        homePage.style.display = 'block';
        navbar.style.display = 'none';
        canvasContainer.style.display = 'none';
        bannerContainer.style.display = 'none';
    });

    document.getElementById('toggle-relationship-type').addEventListener('click', function () {
        const currentType = document.getElementById('toggle-relationship-type').textContent;
        const newType = currentType === 'Romantic' ? 'Friendship' : 'Romantic';
        document.getElementById('toggle-relationship-type').textContent = newType;
        document.getElementById('relationship-select').value = newType.toLowerCase();
        document.getElementById('relationship-select').dispatchEvent(new Event('change'));
    });

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
            updateBanner(links[id].data, links[id].class);
            changeBannerColor(links[id].class);
        });
    });

    function loadSketch(scriptUrl) {
        let canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.remove();
        }

        let oldScript = document.getElementById('sketch-script');
        if (oldScript) {
            oldScript.remove();
        }

        if (window.p5 && window.p5.instance) {
            window.p5.instance.remove();
        }

        let script = document.createElement('script');
        script.src = scriptUrl;
        script.id = 'sketch-script';
        document.body.appendChild(script);

        canvasContainer.style.visibility = 'visible';
        relationshipFilter.style.visibility = 'visible';
        additionalTagsContainer.style.visibility = 'hidden';
    }

    function changeBackground(className) {
        document.body.className = className;
    }

    function changeBannerColor(className) {
        const bannerContainer = document.getElementById('banner-container');
        bannerContainer.className = '';
        bannerContainer.classList.add('overall', className);
    }

    function updateBanner(dataUrl, className) {
        const banner = document.getElementById('banner');
        banner.innerHTML = '';

        d3.csv(dataUrl).then(data => {
            data.forEach(tag => {
                if (tag.tag && tag.frequency && tag.category) {
                    const tagElement = document.createElement('span');
                    tagElement.classList.add('tag');
                    tagElement.style.fontVariationSettings = `'wght' ${mapFrequencyToWeight(tag.frequency)}`;
                    const categorySymbol = getCategorySymbol(tag.category);
                    tagElement.innerHTML = `<img src="${categorySymbol}" alt="${tag.category}" style="width: 2rem; height: 2rem;"> ${tag.tag}`;
                    banner.appendChild(tagElement);
                }
            });

            const bannerContent = banner.innerHTML;
            banner.innerHTML += bannerContent;

            const bannerWidth = banner.scrollWidth / 2;
            const containerWidth = document.getElementById('banner-container').offsetWidth;
            const totalDuration = Math.max((bannerWidth / containerWidth) * 10, 20);

            const styleElement = document.createElement('style');
            styleElement.innerHTML = `
                @keyframes marquee-${className} {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-${bannerWidth / 2}px); }
                }
                #banner {
                    animation: marquee-${className} ${totalDuration}s linear infinite;
                }
            `;
            document.head.appendChild(styleElement);
        }).catch(error => {
            console.error("Error loading CSV data:", error);
        });
    }

    function mapFrequencyToWeight(frequency) {
        const minWeight = 100;
        const maxWeight = 900;
        const minFrequency = 2;
        const maxFrequency = 183;

        return Math.round(((frequency - minFrequency) / (maxFrequency - minFrequency)) * (maxWeight - minWeight) + minWeight);
    }

    function getCategorySymbol(category) {
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

        return categorySymbols[category] || "/content/tags/fandom.png";
    }

    const defaultLink = 'overall-link';
    loadSketch(links[defaultLink].script);
    changeBackground(links[defaultLink].class);
    updateBanner(links[defaultLink].data, links[defaultLink].class);
    changeBannerColor(links[defaultLink].class);
});
