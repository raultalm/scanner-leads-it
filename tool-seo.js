/**
 * SEO AUDIT TOOL LOGIC
 * Structural analysis and detailed repairs
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
    const repairsList = document.getElementById('seoRepairs');

    const btnPageSpeed = document.getElementById('linkGoogleSpeed');
    const btnRichResults = document.getElementById('linkGoogleRich');
    const btnYellowLab = document.getElementById('linkYellowLab');

    scanBtn.addEventListener('click', async () => {
        let url = urlInput.value.trim();
        const manualSource = sourceInput.value.trim();
        if (manualSource) { analyzeSEO(manualSource, url); return; }
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
            alert("Accès auto bloqué. Utilisez le mode manuel (Ctrl+U).");
        } finally { loader.style.display = 'none'; }
    });

    function analyzeSEO(html, url) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const lowHtml = html.toLowerCase();

        structureBox.innerHTML = '';
        metaBox.innerHTML = '';
        repairsList.innerHTML = '';

        let repairs = [];

        // 1. Structure Analysis
        const h1s = doc.querySelectorAll('h1');
        const h2s = doc.querySelectorAll('h2');
        const imgs = doc.querySelectorAll('img');
        const imgsNoAlt = Array.from(imgs).filter(img => !img.getAttribute('alt'));

        addEntry(structureBox, h1s.length === 1 ? `✅ 1 Balise H1` : `❌ ${h1s.length} Balises H1`);
        if (h1s.length === 0) repairs.push("H1 : Ajoutez une balise <h1> unique contenant votre mot-clé principal.");
        if (h1s.length > 1) repairs.push("H1 : Supprimez les H1 en trop pour n'en garder qu'un seul (hiérarchie Google).");

        addEntry(structureBox, h2s.length > 0 ? `✅ ${h2s.length} Balises H2` : `❌ Aucune balise H2`);
        if (h2s.length === 0) repairs.push("H2 : Utilisez des balises <h2> pour structurer vos sections et aider Google à lire le site.");

        addEntry(structureBox, imgsNoAlt.length === 0 ? `✅ Images ALT OK` : `⚠️ ${imgsNoAlt.length} images sans ALT`);
        if (imgsNoAlt.length > 0) repairs.push("Images : Ajoutez un attribut 'alt' descriptif sur chaque image (accessibilité et SEO Images).");

        // 2. Meta & Social Analysis
        const titleTag = doc.querySelector('title');
        const title = titleTag ? titleTag.innerText : "";
        const metaDescTag = doc.querySelector('meta[name="description"]');
        const desc = metaDescTag ? metaDescTag.getAttribute('content') : "";
        const hasOG = lowHtml.includes('property="og:');

        addEntry(metaBox, title.length >= 30 && title.length <= 65 ? `✅ Titre OK` : `⚠️ Titre non-optimal`);
        if (title.length < 30) repairs.push("Titre : Allongez votre balise <title> (30-65 car.) pour inclure votre service et ville.");
        if (title.length > 65) repairs.push("Titre : Raccourcissez votre titre (max 65 car.) pour éviter qu'il soit coupé sur Google.");

        addEntry(metaBox, desc.length > 70 ? `✅ Meta Desc OK` : `❌ Meta Desc absente/courte`);
        if (desc.length < 70) repairs.push("Meta Description : Rédigez un résumé captivant de 140-160 caractères pour booster le clic.");

        addEntry(metaBox, hasOG ? `✅ Open Graph OK` : `⚠️ Pas de balises OG`);
        if (!hasOG) repairs.push("Réseaux Sociaux : Installez les balises Open Graph (og:title, og:image) pour un partage pro sur Facebook/LinkedIn.");

        // 3. Verdict UI
        if (repairs.length === 0) {
            adviceText.innerText = "Moteur parfaitement réglé. Focus sur le contenu et l'autorité.";
        } else if (repairs.length <= 2) {
            adviceText.innerText = "Quelques vis à resserrer pour optimiser la visibilité.";
        } else {
            adviceText.innerText = "Structure défaillante : le site est freiné techniquement.";
        }

        repairs.forEach(r => {
            const li = document.createElement('li');
            li.innerText = r;
            repairsList.appendChild(li);
        });

        // 4. External Links
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

    window.resetSEO = function() {
        document.getElementById('seoUrlInput').value = '';
        document.getElementById('seoSourceInput').value = '';
        resultsArea.style.display = 'none';
    };
})();
