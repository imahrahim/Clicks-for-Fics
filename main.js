import { relationshipsSketch } from './relationships.js';
import { tagsSketch } from './tags.js';
import { relationshipLegendSketch } from './relationshipLegend.js';
import { legendSketch } from './legend.js';

let myp5;
let myp5_2;
window.popupLegendP5Relationships = null;
window.popupLegendP5Tags = null;

const fandomColors = {
    "Overall": { 
        relationship: "/content/background/Overall.png", 
        ordered: "/content/background/Overall_Tags.png", 
        unordered: "/content/background/Overall.png", 
        color: "rgba(225, 255, 0, 0.475)" 
    },
    "Marvel": { 
        relationship: "/content/background/Marvel.png", 
        ordered: "/content/background/Marvel_Ordered.png", 
        unordered: "/content/background/Marvel_Tags.png", 
        color: "rgba(255, 0, 0, 0.473)" 
    },
    "Harry Potter": { 
        relationship: "/content/background/HarryPotter.png", 
        ordered: "/content/background/Harry_Tags.png", 
        unordered: "/content/background/HarryPotter.png", 
        color: "rgba(0, 255, 0, 0.509)" 
    },
    "Boku No Hero": { 
        relationship: "/content/background/BokuNoHero.png", 
        ordered: "/content/background/Boku_Tags.png", 
        unordered: "/content/background/BokuNoHero.png", 
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
        if (id === 'popup-tags' && !window.popupLegendP5Tags) {
            // window.popupLegendP5Tags = new p5(legendSketch, 'popup-tags-legend');
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

    document.body.style.backgroundImage = `url("/content/background/Overall.png")`;
    
    const footerAuthor = document.querySelector('.footer-author');

    footerAuthor.innerHTML = `
    Author: Imah Leaf Rahim
    <br> 
    imah.rahim@me.com
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
    const footerAuthor = document.querySelector('.footer-author');
    
    if (page === 'relationships') {
        document.getElementById('relationships-visualization').style.display = 'block';
        loadSketch(relationshipsSketch, 'relationships-visualization');
        setActiveButton(document.getElementById('Overall-relationships'));
        loadData('/data/Overall.json', 'Overall');
        togglePopup('popup-relationships'); 

        footerAuthor.innerHTML = `
            Imah Leaf Rahim || BA Data Design + Art, Hochschule Luzern – Design Film Kunst © HSLU, 2024
        `;
    } else if (page === 'tags') {
        document.getElementById('tags-visualization').style.display = 'block';

        document.getElementById('banner-container-1').innerHTML = '';
        document.getElementById('banner-container-2').innerHTML = '';

        loadSketch(tagsSketch(false), 'banner-container-1', false);
        loadSketch(tagsSketch(true), 'banner-container-2', true);
        setActiveButton(document.getElementById('Overall-tags'));
        togglePopup('popup-tags'); 

        footerAuthor.innerHTML = `
        Imah Leaf Rahim || BA Data Design + Art, Hochschule Luzern – Design Film Kunst © HSLU, 2024
        `;
    } else {
        footerAuthor.innerHTML = `
            Author: Imah Leaf Rahim
            <br> 
            imah.rahim@me.com
            <br> 
            2024-06-10
            <br> 
            Mentor: Max Frischknecht
            <br> 
            BA Data Design + Art, Hochschule Luzern – Design Film Kunst © HSLU, 2024
        `;
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
    if (containerId === 'banner-container-2' && myp5_2) {
        myp5_2.remove();
        myp5_2 = null;  // Sicherstellen, dass das alte Canvas entfernt wird
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
    resetSelectedNode();  // Zurücksetzen des ausgewählten Knotens
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
    const order = document.getElementById('toggle-order-checkbox').checked ? 'unordered' : 'ordered';
    const backgroundImage = fandomColors[fandom][order];

    if (myp5 && myp5.loadTagData) {
        myp5.loadTagData(dataUrl, fandom, false);
    }
    if (myp5_2 && myp5_2.loadTagData) {
        myp5_2.loadTagData(dataUrl, fandom, true);
    }

    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
}

function updateRelationshipType(type) {
    if (myp5 && myp5.updateRelationshipType) {
        myp5.updateRelationshipType(type);
    }
    if (myp5_2 && myp5_2.updateRelationshipType) {
        myp5_2.updateRelationshipType(type);
    }
}

function updateTagOrder(order) {
    const title = document.getElementById('tags-visualization-title');
    title.textContent = order.toUpperCase();

    const currentFandomButton = document.querySelector('.active-button');
    if (!currentFandomButton) {
        console.error("No active fandom button found.");
        return;
    }
    const currentFandom = currentFandomButton.textContent.trim();
    const backgroundImage = fandomColors[currentFandom][order];

    if (!backgroundImage) {
        console.error(`Background image for order "${order}" not found in fandomColors for "${currentFandom}".`);
        return;
    }

    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';

    if (myp5 && myp5.updateTagOrder) {
        myp5.updateTagOrder(order);
    }
    if (myp5_2 && myp5_2.updateTagOrder) {
        myp5_2.updateTagOrder(order);
    }
}

function initializePage() {
    showHomePage();
    loadData('/data/Overall.json', 'Overall');
}

window.showHomePage = showHomePage;
window.showPage = showPage;
window.loadData = loadData;
window.loadTagData = loadTagData;
window.updateRelationshipType = updateRelationshipType;
window.updateTagOrder = updateTagOrder;
window.setActiveButton = setActiveButton;
window.onload = initializePage;
