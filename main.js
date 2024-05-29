let myp5;

function showHomePage() {
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('relationships-visualization').style.display = 'none';
    document.getElementById('tags-visualization').style.display = 'none';
}

function showPage(page) {
    document.getElementById('home-page').style.display = 'none';
    if (page === 'relationships') {
        document.getElementById('relationships-visualization').style.display = 'block';
        document.getElementById('tags-visualization').style.display = 'none';
        loadSketch(relationshipsSketch, 'relationships-visualization');
    } else if (page === 'tags') {
        document.getElementById('relationships-visualization').style.display = 'none';
        document.getElementById('tags-visualization').style.display = 'block';
        loadSketch(tagsSketch, 'tags-visualization');
    }
}

function loadSketch(sketch, containerId) {
    if (myp5) {
        myp5.remove();
    }
    myp5 = new p5(sketch, document.getElementById(containerId));
}

function loadData(dataUrl) {
    if (myp5 && myp5.loadData) {
        myp5.loadData(dataUrl);
    } else {
        console.error('p5 instance or loadData function not available');
    }
}

function loadTagData(dataUrl) {
    if (myp5 && myp5.loadTagData) {
        myp5.loadTagData(dataUrl);
    } else {
        console.error('p5 instance or loadTagData function not available');
    }
}

function updateRelationshipType(type) {
    if (myp5 && myp5.updateRelationshipType) {
        myp5.updateRelationshipType(type);
    } else {
        console.error('p5 instance or updateRelationshipType function not available');
    }
}

window.showHomePage = showHomePage;
window.showPage = showPage;
window.loadData = loadData;
window.loadTagData = loadTagData;
window.updateRelationshipType = updateRelationshipType;
