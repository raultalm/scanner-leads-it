/**
 * SEO AUDIT TOOL LOGIC
 * Structural analysis and external deep-linking
 */

(function() {
    const scanBtn = document.getElementById('seoScanBtn');
    const urlInput = document.getElementById('seoUrlInput');
    const sourceInput = document.getElementById('seoSourceInput');
    const loader = document.getElementById('seoLoader');
    const resultsArea = document.getElementById('seoResults');
    
    const structureBox = document.getElementById('seoStructure');
    const metaBox = document.getElementById('seoMeta');
    const adviceText = document.getElementById('seoAdvice');

    // External Link Buttons
    const btnPageSpeed = document.getElementById('linkGoogleSpeed');
    const btnRichResults = document.getElementById('linkGoogleRich');
    const btnYellowLab = document.getElementById('linkYellowLab');

    // --- HANDLERS ---
    scanBtn.addEventListener('click', async () => {
        let url = urlInput.value.trim();
        const manualSource = sourceInput.value.trim();

        if (manualSource) {
            analyzeSEO(manualSource, url);
            return;
        }

        if (!url) return;
        if (!url.startsWith('http')) url = 'https://' + url;

        resultsArea.style.display = 'none';
        loader.style.display = 'block';

        try {
            const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error();
            const html = await response.text();
            analyzeSEO(html, url);
        } catch (err) {
            alert("Accès auto bloqué. Veuillez copier-coller le code source (Ctrl+U) dans la zone dédiée.");
        } finally {
            loader.style.display = 'none';
        }
    });

    /**
     * ANALYZE SEO
     * Scans HTML for structural markers
     */
    function analyzeSEO(html, url) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const lowHtml = html.toLowerCase();

        structureBox.innerHTML = '';
        metaBox.innerHTML = '';

        // 1. Structure Analysis
        const h1s = doc.querySelectorAll('h1');
        const h2s = doc.querySelectorAll('h2');
        const imgs = doc.querySelectorAll('img');
        const imgsNoAlt = Array.from(imgs).filter(img => !img.getAttribute('alt'));

        addEntry(structureBox, h1s.length === 1 ? `✅ 1 Balise H1` : `❌ ${h1s.length} Balises H1 (Recommandé: 1)`);
        addEntry(structureBox, h2s.length > 0 ? `✅ ${h2s.length} Balises H2` : `❌ Aucune balise H2 détectée`);
        addEntry(structureBox, imgsNoAlt.length === 0 ? `✅ Toutes les images ont un ALT` : `⚠️ ${imgsNoAlt.length} images sans description (ALT)`);

        // 2. Meta & Social Analysis
        const title = doc.querySelector('title')?.innerText || "";
        const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || "";
        const hasOG = lowHtml.includes('property="og:');

        addEntry(metaBox, title.length >= 30 && title.length <= 65 ? `✅ Titre optimisé (${title.length} car.)` : `⚠️ Titre à revoir (${title.length} car.)`);
        addEntry(metaBox, desc.length > 70 ? `✅ Meta Description présente` : `❌ Meta Description absente ou trop courte`);
        addEntry(metaBox, hasOG ? `✅ Balises Open Graph détectées` : `⚠️ Pas de balises réseaux sociaux (OG)`);

        // 3. Verdict
        let score = 0;
        if (h1s.length === 1) score++;
        if (h2s.length > 0) score++;
        if (imgsNoAlt.length === 0) score++;
        if (desc.length > 70) score++;

        if (score >= 4) {
            adviceText.innerText = "Base technique solide. Focus sur le contenu et les backlinks.";
        } else if (score >= 2) {
            adviceText.innerText = "Des erreurs structurelles freinent la visibilité. Correction des titres et des metas nécessaire.";
        } else {
            adviceText.innerText = "SEO critique. Le site est quasi-invisible techniquement. Refonte structurelle prioritaire.";
        }

        // 4. Update External Links
        if (url) {
            btnPageSpeed.onclick = () => window.open(`https://pagespeed.web.dev/report?url=${encodeURIComponent(url)}`, '_blank');
            btnRichResults.onclick = () => window.open(`https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`, '_blank');
            btnYellowLab.onclick = () => window.open(`https://yellowlab.tools/`, '_blank');
        }

        resultsArea.style.display = 'block';
    }

    function addEntry(parent, text) {
        const div = document.createElement('div');
        div.innerText = text;
        parent.appendChild(div);
    }

    /**
     * RESET SEO
     */
    window.resetSEO = function() {
        urlInput.value = '';
        sourceInput.value = '';
        resultsArea.style.display = 'none';
    };

})();
