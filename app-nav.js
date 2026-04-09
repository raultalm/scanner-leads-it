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
    if (window.event && window.event.currentTarget.classList.contains('nav-btn')) {
        window.event.currentTarget.classList.add('active');
    } else {
        // Fallback for direct calls
        document.querySelector(`.nav-btn[onclick*="${tool}"]`).classList.add('active');
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
        if (typeof window.calculateDiag === 'function') window.calculateDiag();
    } else if(tool === 'tech') {
        title.innerText = "Tech Audit";
        tagline.innerText = "Découvrez les technologies utilisées sous le capot du site web.";
        statLabel.innerText = "Stack Info";
        statValue.innerText = "Standby";
        statusValue.innerText = "Scanner";
    } else if(tool === 'report') {
        title.innerText = "Rapport";
        tagline.innerText = "Brief de prospection complet pour votre IA.";
        statLabel.innerText = "Briefing";
        statValue.innerText = "Prêt";
        statusValue.innerText = "Synthèse";
    }
}

/**
 * GLOBAL RESET
 * Clears all tools and returns to initial state
 */
function globalReset() {
    if (!confirm("Effacer toutes les données et réinitialiser l'analyse ?")) return;

    // Reset Diag
    if (typeof window.resetDiag === 'function') window.resetDiag();
    
    // Reset Tech Audit
    if (typeof window.resetTech === 'function') window.resetTech();
    
    // Reset Report
    if (typeof window.resetReport === 'function') window.resetReport();

    // Return to Diag View
    switchTool('diag');
}
