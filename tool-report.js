/**
 * PROSPECT REPORT GENERATOR
 * Compiles all data for AI-assisted outreach
 */

(function() {
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

        // 3. Gather SEO Data
        const seoStructure = Array.from(document.getElementById('seoStructure').children).map(div => div.innerText);
        const seoMeta = Array.from(document.getElementById('seoMeta').children).map(div => div.innerText);

        // 4. Construct the Prompt/Report
        let report = `CONTEXTE DE PROSPECTION (Brief pour IA)\n`;
        report += `========================================\n\n`;
        
        report += `[SANTÉ BUSINESS]\n`;
        report += `- Avis Google : ${reviews}\n`;
        report += `- Note Moyenne : ${rating}/5\n`;
        report += `- Score d'opportunité : ${score} (${status})\n\n`;

        report += `[AUDIT TECHNIQUE & SEO]\n`;
        report += `- Stack : ${tech}\n`;
        report += `- Signaux Mkt : ${marketingSignals.join(', ') || 'Aucun'}\n`;
        report += `- SEO Structure : ${seoStructure.join(', ') || 'Non analysé'}\n`;
        report += `- SEO Meta : ${seoMeta.join(', ') || 'Non analysé'}\n`;
        report += `- Alertes : ${techAlerts.join(', ') || 'Aucune'}\n\n`;

        report += `[POINTS DE DOULEUR DÉTECTÉS]\n`;
        if (hasNoWebsite) report += `- Pas de site pro.\n`;
        if (isNotMobile) report += `- Pas responsive.\n`;
        if (isManualBooking) report += `- Réservation manuelle.\n`;
        if (hasCommFriction) report += `- Problèmes de contact.\n\n`;

        report += `[MISSION DE L'IA]\n`;
        report += `Rédige un email d'approche court et pragmatique. Ton : "IT Mechanic" (direct, réparateur, pas vendeur). \n`;
        report += `Focus sur la réparation des points de douleur détectés pour augmenter leur CA.`;

        reportBox.innerText = report;
    };

    window.copyReport = function() {
        const reportBox = document.getElementById('reportBox');
        const text = reportBox.innerText;
        if (text.includes('Compilez')) return;
        navigator.clipboard.writeText(text).then(() => {
            const btn = event.currentTarget;
            const originalText = btn.innerText;
            btn.innerText = "✅ Copié !";
            setTimeout(() => btn.innerText = originalText, 2000);
        });
    };

    window.resetReport = function() {
        const reportBox = document.getElementById('reportBox');
        if (reportBox) reportBox.innerText = 'Compilez les données pour votre brief IA...';
    };
})();
