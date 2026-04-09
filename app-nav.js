/**
 * Hub Navigation Logic
 * Manages tool switching and shared UI elements
 */

function switchTool(tool) {
    if(tool === 'upcoming') return;
    
    // Toggle active views
    document.querySelectorAll('.tool-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    const targetView = document.getElementById(`view-${tool}`);
    if (targetView) targetView.classList.add('active');
    
    // Set active button
    if (window.event && window.event.currentTarget.classList.contains('nav-btn')) {
        window.event.currentTarget.classList.add('active');
    } else {
        const btn = document.querySelector(`.nav-btn[onclick*="${tool}"]`);
        if (btn) btn.classList.add('active');
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
    } else if(tool === 'seo') {
        title.innerText = "Audit SEO";
        tagline.innerText = "Analyse structurelle et visibilité sur les moteurs de recherche.";
        statLabel.innerText = "SEO Signal";
        statValue.innerText = "Analyse";
        statusValue.innerText = "Structure";
    } else if(tool === 'access') {
        title.innerText = "Accessibilité";
        tagline.innerText = "Conformité WCAG 2.1 et inclusion numérique.";
        statLabel.innerText = "Inclusion";
        statValue.innerText = "Audit";
        statusValue.innerText = "WCAG";
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
 */
function globalReset() {
    if (!confirm("Effacer toutes les données et réinitialiser l'analyse ?")) return;

    if (typeof window.resetDiag === 'function') window.resetDiag();
    if (typeof window.resetTech === 'function') window.resetTech();
    if (typeof window.resetSEO === 'function') window.resetSEO();
    if (typeof window.resetAccess === 'function') window.resetAccess();
    if (typeof window.resetReport === 'function') window.resetReport();

    switchTool('diag');
}
