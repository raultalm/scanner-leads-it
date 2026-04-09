/**
 * PROSPECT REPORT GENERATOR
 * Compiles all data for AI-assisted outreach
 */

(function() {
    /**
     * GENERATE REPORT
     * Compiles data from all tools
     */
    window.generateReport = function() {
        const reportBox = document.getElementById('reportBox');
        
        // 1. Gather Diag Data
        const reviews = document.getElementById('reviewsInput').value;
        const rating = document.getElementById('ratingInput').value;
        const score = document.getElementById('statValue').innerText;
        const status = document.getElementById('statusValue').innerText;
        
        const hasNoWebsite = document.getElementById('flag-website').checked;
        const isNotMobile = document.getElementById('flag-mobile').checked;
        const isManualBooking = document.getElementById('flag-booking').checked;
        const hasCommFriction = document.getElementById('flag-comm').checked;

        // 2. Gather Tech Data
        const tech = document.getElementById('detectedTech').innerText;
        const marketingSignals = Array.from(document.getElementById('marketingList').children).map(li => li.innerText);
        const techAlerts = Array.from(document.getElementById('techList').children).map(li => li.innerText);

        // 3. Construct the Prompt/Report
        let report = `CONTEXTE DE PROSPECTION (Brief pour IA)\n`;
        report += `========================================\n\n`;
        
        report += `[SANTÉ BUSINESS]\n`;
        report += `- Avis Google : ${reviews}\n`;
        report += `- Note Moyenne : ${rating}/5\n`;
        report += `- Score d'opportunité : ${score} (${status})\n\n`;

        report += `[AUDIT TECHNIQUE]\n`;
        report += `- Stack détectée : ${tech}\n`;
        report += `- Signaux Marketing : ${marketingSignals.join(', ') || 'Aucun'}\n`;
        report += `- Alertes Critiques : ${techAlerts.join(', ') || 'Aucune'}\n\n`;

        report += `[POINTS DE DOULEUR DÉTECTÉS]\n`;
        if (hasNoWebsite) report += `- Absence de site web professionnel (utilise Facebook/Linktree).\n`;
        if (isNotMobile) report += `- Site actuel non-adapté aux smartphones.\n`;
        if (isManualBooking) report += `- Processus de réservation manuel (perte de conversion).\n`;
        if (hasCommFriction) report += `- Avis clients signalant des difficultés de contact.\n\n`;

        report += `[MISSION DE L'IA]\n`;
        report += `Agis en tant qu'expert en closing B2B. Rédige un email d'approche court, pragmatique et personnalisé pour ce prospect. \n`;
        report += `Ton ton doit être celui d'un "IT Mechanic" : direct, sans jargon marketing, axé sur la réparation des processus cassés pour augmenter le CA. \n`;
        report += `Ne sois pas vendeur, sois diagnostiqueur.`;

        reportBox.innerText = report;
    };

    /**
     * COPY REPORT
     * Copies content to clipboard
     */
    window.copyReport = function() {
        const reportBox = document.getElementById('reportBox');
        const text = reportBox.innerText;
        if (text.includes('Cliquez sur')) return;

        navigator.clipboard.writeText(text).then(() => {
            const btn = event.currentTarget;
            const originalText = btn.innerText;
            btn.innerText = "✅ Copié !";
            setTimeout(() => btn.innerText = originalText, 2000);
        });
    };

    /**
     * RESET REPORT
     * Clears the report view
     */
    window.resetReport = function() {
        const reportBox = document.getElementById('reportBox');
        if (reportBox) {
            reportBox.innerText = 'Cliquez sur "Générer la Synthèse" pour compiler les données...';
        }
    };
})();
