/**
 * Hub Navigation Logic
 * Manages tool switching and shared UI elements
 */

function switchTool(tool) {
    if(tool === 'upcoming') return;
    
    // Toggle active views
    document.querySelectorAll('.tool-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`view-${tool}`).classList.add('active');
    
    // Set active button (from event)
    if (window.event) {
        window.event.currentTarget.classList.add('active');
    }

    // Shared UI Elements
    const title = document.getElementById('hubTitle');
    const tagline = document.getElementById('hubTagline');
    const statLabel = document.getElementById('statLabel');
    const statValue = document.getElementById('statValue');
    const statusValue = document.getElementById('statusValue');
    
    if(tool === 'diag') {
        title.innerText = "Le Diag";
        tagline.innerText = "Analysez le potentiel commercial et la dette technique de vos leads.";
        statLabel.innerText = "Opportunity";
        // Trigger diag calculation to refresh header
        if (typeof calculateDiag === 'function') calculateDiag();
    } else if(tool === 'tech') {
        title.innerText = "Tech Audit";
        tagline.innerText = "Découvrez les technologies utilisées sous le capot du site web.";
        statLabel.innerText = "Stack Info";
        statValue.innerText = "Standby";
        statusValue.innerText = "Scanner";
    }
}
