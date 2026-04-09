/**
 * LE DIAG (LEAD SCORER) LOGIC
 * Calculates "The IT Mechanic" Opportunity Score
 */

(function() {
    // Elements
    const reviewsInput = document.getElementById('reviewsInput');
    const reviewsVal = document.getElementById('reviewsVal');
    const ratingInput = document.getElementById('ratingInput');
    const ratingVal = document.getElementById('ratingVal');
    
    const websiteFlag = document.getElementById('flag-website');
    const mobileFlag = document.getElementById('flag-mobile');
    const bookingFlag = document.getElementById('flag-booking');
    const commFlag = document.getElementById('flag-comm');
    
    const needle = document.getElementById('needle');
    const needleScore = document.getElementById('needleScore');
    const statValue = document.getElementById('statValue');
    const statusValue = document.getElementById('statusValue');
    const oppText = document.getElementById('opportunityText');
    const hubTagline = document.getElementById('hubTagline');
    
    const ratingRow = document.getElementById('ratingRow');
    const mobileRow = document.getElementById('mobileRow');
    const labelStable = document.getElementById('label-stable');
    const labelOpp = document.getElementById('label-opp');

    // Global Access (for Hub)
    window.calculateDiag = function() {
        const reviews = parseInt(reviewsVal.value) || 0;
        const rating = parseFloat(ratingVal.value) || 1.0;
        
        // Handle no reviews state
        if (reviews === 0) ratingRow.classList.add('disabled');
        else ratingRow.classList.remove('disabled');

        // Success Factor (0.0 - 1.0)
        let successPct = 0;
        if (reviews > 0) {
            const volumeScore = Math.min(50, (Math.log10(reviews + 1) / Math.log10(100)) * 50);
            const qualityScore = (rating / 5) * 50;
            successPct = (volumeScore + qualityScore) / 100;
        }

        // Debt Factor (0.0 - 1.0)
        let debtPoints = 0;
        if (websiteFlag.checked) debtPoints += 40;
        if (mobileFlag.checked) debtPoints += 20;
        if (bookingFlag.checked) debtPoints += 30;
        if (commFlag.checked) debtPoints += 10;
        
        let debtPct = debtPoints / 100;

        // Opportunity Score (Multiplicative)
        const finalScore = Math.round((successPct * debtPct) * 100);

        updateDiagUI(finalScore);
    };

    /**
     * RESET DIAG
     * Resets all diag inputs to default
     */
    window.resetDiag = function() {
        reviewsInput.value = 0;
        reviewsVal.value = 0;
        ratingInput.value = 1.0;
        ratingVal.value = 1.0;
        websiteFlag.checked = false;
        mobileFlag.checked = false;
        bookingFlag.checked = false;
        commFlag.checked = false;
        
        mobileRow.classList.remove('disabled');
        ratingRow.classList.add('disabled');
        
        window.calculateDiag();
    };

    function updateDiagUI(score) {
        // Rotate needle
        const rotation = (score / 100) * 180 - 90;
        needle.style.transform = `rotate(${rotation}deg)`;
        
        // Update values
        needleScore.innerText = score;
        
        // Only update hub stat if we are on Diag view
        const activeNav = document.querySelector('.nav-btn.active');
        if (activeNav && activeNav.innerText.includes('Diag')) {
            statValue.innerText = `${score}/100`;
        }

        let level = "";
        let desc = "";
        let color = "";

        // Status definitions
        if (score >= 70) { 
            level = "Cible Or"; 
            desc = "Cible Idéale : Un moteur de course freiné par ses outils. Pitcher l'automatisation."; 
            color = "var(--gauge-red)"; 
        } else if (score >= 40) { 
            level = "Opportunité Moyenne"; 
            desc = "Potentiel Intéressant : Client établi avec des manques techniques."; 
            color = "var(--gauge-orange)"; 
        } else if (score >= 10) { 
            level = "Optimisé / Stable"; 
            desc = "Peu d'intérêt : Soit la technique est déjà excellente, soit le business n'est pas mûr."; 
            color = "var(--gauge-yellow)"; 
        } else { 
            level = "Skip (Passez)"; 
            desc = "Aucun besoin ou pas de budget : Ne perdez pas votre temps ici."; 
            color = "var(--gauge-green)"; 
        }

        statusValue.innerText = level;
        oppText.innerText = level;
        oppText.style.color = color;
        
        // Only update hub tagline if we are on Diag view
        if (activeNav && activeNav.innerText.includes('Diag')) {
            hubTagline.innerText = desc;
        }
        
        // Glow indicators
        labelOpp.classList.toggle('active', score >= 40);
        labelStable.classList.toggle('active', score < 40);
    }

    // --- SYNC SLIDERS & INPUTS ---
    
    // Reviews Sync
    reviewsInput.addEventListener('input', () => {
        reviewsVal.value = reviewsInput.value;
        window.calculateDiag();
    });
    reviewsVal.addEventListener('input', () => {
        reviewsInput.value = reviewsVal.value;
        window.calculateDiag();
    });

    // Rating Sync
    ratingInput.addEventListener('input', () => {
        ratingVal.value = ratingInput.value;
        window.calculateDiag();
    });
    ratingVal.addEventListener('input', () => {
        ratingInput.value = ratingVal.value;
        window.calculateDiag();
    });

    // Toggle Listeners
    [websiteFlag, mobileFlag, bookingFlag, commFlag].forEach(el => {
        el.addEventListener('change', window.calculateDiag);
    });

    // Website-Mobile Dependency Logic
    websiteFlag.addEventListener('change', () => {
        if (websiteFlag.checked) {
            mobileFlag.checked = true;
            mobileRow.classList.add('disabled');
        } else {
            mobileRow.classList.remove('disabled');
        }
        window.calculateDiag();
    });

    // Initialize
    window.calculateDiag();
})();
