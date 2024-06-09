import { relationshipsSketch } from './relationships.js';
import { tagsSketch } from './tags.js';
import { relationshipLegendSketch } from './relationshipLegend.js';

let myp5;
let myp5_2;
window.popupLegendP5Relationships = null;
window.popupLegendP5Tags = null;

const fandomColors = {
    "Overall": { 
        relationship: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/Overall.png", 
        overlay: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/OverallT.png",
        color: "rgba(225, 255, 0, 0.475)" 
    },
    "Marvel": { 
        relationship: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/marvel.png", 
        overlay: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/MarvelT.png",
        color: "rgba(255, 0, 0, 0.473)" 
    },
    "Harry Potter": { 
        relationship: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/HarryPotter.png", 
        overlay: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/HarryT.png",
        color: "rgba(0, 255, 0, 0.509)" 
    },
    "Boku No Hero": { 
        relationship: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/BokuNoHero.png", 
        overlay: "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/BokuT.png",
        color: "rgba(0, 0, 255, 0.465)" 
    }
};

function togglePopup(id) {
    const popup = document.getElementById(id);
    if (popup.style.display === "none" || popup.style.display === "") {
        popup.style.display = "flex";
        if (id === 'popup-relationships' && !window.popupLegendP5Relationships) {
            window.popupLegendP5Relationships = new p5(relationshipLegendSketch, 'popup-relationships-legend');
        }
    } else {
        popup.style.display = "none";
    }
}

function showHomePage() {
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('relationships-visualization').style.display = 'none';
    document.getElementById('tags-visualization').style.display = 'none';

    document.getElementById('relationship-btn').classList.remove('active');
    document.getElementById('tag-btn').classList.remove('active');
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('title').style.display = 'block';

    document.body.style.backgroundImage = `url("https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/Overall.png")`;
    
    const footerAuthor = document.querySelector('.footer-author');

    footerAuthor.innerHTML = `
    Imah Leaf Rahim
    <br> 
    2024-06-10
    <br> 
    Mentor: Max Frischknecht
    <br> 
    BA Data Design + Art, Hochschule Luzern – Design Film Kunst © HSLU, 2024
`;
}

function showPage(page) {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('relationships-visualization').style.display = 'none';
    document.getElementById('tags-visualization').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('title').style.display = 'none';
    const footerAuthor = document.querySelector('.footer-author');
    footerAuthor.innerHTML = `
    Imah Leaf Rahim || BA Data Design + Art, Hochschule Luzern – Design Film Kunst © HSLU, 2024
`;

    if (page === 'relationships') {
        document.getElementById('relationships-visualization').style.display = 'block';
        loadSketch(relationshipsSketch, 'relationships-visualization');
        setActiveButton(document.getElementById('Overall-relationships'));
        togglePopup('popup-relationships');
    } else if (page === 'tags') {
        document.getElementById('tags-visualization').style.display = 'block';
        loadSketch(tagsSketch(false), 'banner-container-1', false);
        setActiveButton(document.getElementById('Overall-tags'));
        document.getElementById('tags-overlay').style.backgroundImage = `url( "https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/content/background/OverallT.png")`;
        document.getElementById('tags-overlay').style.backgroundSize = 'scalw-down';
        document.getElementById('tags-overlay').style.backgroundRepeat = 'no-repeat';
        document.getElementById('tags-overlay').style.backgroundAttachment = 'fixed';
        togglePopup('popup-tags');
    
    }
}

function setActiveButton(button) {
    const buttons = document.querySelectorAll('#fandom-buttons button, #tag-buttons button');
    buttons.forEach(btn => btn.classList.remove('active-button'));
    button.classList.add('active-button');
}

function loadSketch(sketch, containerId, isReverse = false) {
    if (containerId === 'relationships-visualization' && myp5) {
        myp5.remove();
        myp5 = null;  // Sicherstellen, dass das alte Canvas entfernt wird
    }
    if (containerId === 'banner-container-1' && myp5) {
        myp5.remove();
        myp5 = null;  // Sicherstellen, dass das alte Canvas entfernt wird
    }
    if (isReverse) {
        myp5_2 = new p5(sketch, document.getElementById(containerId));
    } else {
        myp5 = new p5(sketch, document.getElementById(containerId));
    }
}

function resetSelectedNode() {
    if (myp5 && myp5.resetSelectedNode) {
        myp5.resetSelectedNode();
    }
    if (myp5_2 && myp5_2.resetSelectedNode) {
        myp5_2.resetSelectedNode();
    }
}

function loadData(dataUrl, fandom) {
    resetSelectedNode(); 
    if (myp5 && myp5.loadData) {
        myp5.loadData(dataUrl, fandom);
    }
    if (myp5_2 && myp5_2.loadData) {
        myp5_2.loadData(dataUrl, fandom);
    }
    document.body.style.backgroundImage = `url(${fandomColors[fandom].relationship})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
}

function loadTagData(dataUrl, fandom) {
    if (myp5 && myp5.loadTagData) {
        myp5.loadTagData(dataUrl, fandom, false);
    }
    if (myp5_2 && myp5_2.loadTagData) {
        myp5_2.loadTagData(dataUrl, fandom, true);
    }

    document.body.style.backgroundImage = `url(${fandomColors[fandom].relationship})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';

    const overlayImage = fandomColors[fandom].overlay;
    if (overlayImage) {
        document.getElementById('tags-overlay').style.backgroundImage = `url(${overlayImage})`;
        document.getElementById('tags-overlay').style.backgroundSize = 'contain';
        document.getElementById('tags-overlay').style.backgroundRepeat = 'no-repeat';
        document.getElementById('tags-overlay').style.backgroundAttachment = 'fixed';
    } else {
        console.error(`Overlay image for ${fandom} not found.`);
    }
}

function updateRelationshipType(type) {
    if (myp5 && myp5.updateRelationshipType) {
        myp5.updateRelationshipType(type);
    }
    if (myp5_2 && myp5_2.updateRelationshipType) {
        myp5_2.updateRelationshipType(type);
    }
}

function initializePage() {
    showHomePage();
    loadData('https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/data/Overall.json', 'Overall');

        loadTagData('https://raw.githubusercontent.com/imahrahim/Clicks-for-Fics/links/data/Additional_Tags_Overall.csv', 'Overall');
}

window.showHomePage = showHomePage;
window.showPage = showPage;
window.loadData = loadData;
window.loadTagData = loadTagData;
window.updateRelationshipType = updateRelationshipType;
window.setActiveButton = setActiveButton;
window.onload = initializePage;
