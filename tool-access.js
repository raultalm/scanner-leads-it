/**
 * ACCESSIBILITY AUDIT TOOL LOGIC
 * WCAG 2.1 compliance check and deep-linking
 */

(function() {
    const scanBtn = document.getElementById('accessScanBtn');
    const urlInput = document.getElementById('accessUrlInput');
    const sourceInput = document.getElementById('accessSourceInput');
    const loader = document.getElementById('accessLoader');
    const resultsArea = document.getElementById('accessResults');
    
    const checklistBox = document.getElementById('accessChecklist');
    const interBox = document.getElementById('accessInter');
    const adviceText = document.getElementById('accessAdvice');
    const repairsList = document.getElementById('accessRepairs');

    const btnWave = document.getElementById('linkWave');
    const btnContrast = document.getElementById('linkContrast');

    scanBtn.addEventListener('click', async () => {
        let url = urlInput.value.trim();
        const manualSource = sourceInput.value.trim();
        if (manualSource) { analyzeAccess(manualSource, url); return; }
        if (!url) return;
        if (!url.startsWith('http')) url = 'https://' + url;
        resultsArea.style.display = 'none';
        loader.style.display = 'block';
        try {
            const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error();
            const html = await response.text();
            analyzeAccess(html, url);
        } catch (err) {
            alert("Accès auto bloqué. Utilisez le mode manuel (Ctrl+U).");
        } finally { loader.style.display = 'none'; }
    });

    function analyzeAccess(html, url) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        checklistBox.innerHTML = '';
        interBox.innerHTML = '';
        repairsList.innerHTML = '';

        let repairs = [];

        // 1. Fundamentals (HTML markers)
        const htmlTag = doc.querySelector('html');
        const lang = htmlTag ? htmlTag.getAttribute('lang') : null;
        const main = doc.querySelector('main') || doc.querySelector('[role="main"]');
        
        addEntry(checklistBox, lang ? `✅ Langue définie (${lang})` : `❌ Langue NON définie`);
        if (!lang) repairs.push("Langue : Ajoutez l'attribut lang (ex: <html lang='fr'>) pour les lecteurs d'écran.");

        addEntry(checklistBox, main ? `✅ Structure <main> présente` : `⚠️ Structure <main> absente`);
        if (!main) repairs.push("Structure : Utilisez la balise <main> pour aider la navigation assistée.");

        // 2. Interactivity & Labels
        const buttons = doc.querySelectorAll('button');
        const emptyButtons = Array.from(buttons).filter(b => !b.innerText.trim() && !b.getAttribute('aria-label'));
        const inputs = doc.querySelectorAll('input:not([type="hidden"])');
        const inputsNoLabel = Array.from(inputs).filter(i => {
            const id = i.getAttribute('id');
            if (!id) return true;
            return !doc.querySelector(`label[for="${id}"]`);
        });

        addEntry(interBox, emptyButtons.length === 0 ? `✅ Boutons étiquetés` : `❌ ${emptyButtons.length} boutons sans texte`);
        if (emptyButtons.length > 0) repairs.push("Boutons : Ajoutez du texte ou un 'aria-label' sur les boutons icones.");

        addEntry(interBox, inputsNoLabel.length === 0 ? `✅ Champs avec labels` : `⚠️ ${inputsNoLabel.length} champs sans labels`);
        if (inputsNoLabel.length > 0) repairs.push("Formulaires : Liez chaque champ à une balise <label> via l'attribut 'id'.");

        // 3. Contrast & Advanced Links
        if (url) {
            btnWave.onclick = () => window.open(`https://wave.webaim.org/report#/${url}`, '_blank');
            btnContrast.onclick = () => window.open(`https://webaim.org/resources/contrastchecker/`, '_blank');
        }

        // 4. Verdict UI
        if (repairs.length === 0) {
            adviceText.innerText = "Conformité WCAG de base respectée.";
        } else {
            adviceText.innerText = `${repairs.length} obstacles majeurs détectés.`;
        }

        repairs.forEach(r => {
            const li = document.createElement('li');
            li.innerText = r;
            repairsList.appendChild(li);
        });

        resultsArea.style.display = 'block';
    }

    function addEntry(parent, text) {
        const div = document.createElement('div');
        div.innerText = text;
        parent.appendChild(div);
    }

    window.resetAccess = function() {
        document.getElementById('accessUrlInput').value = '';
        document.getElementById('accessSourceInput').value = '';
        resultsArea.style.display = 'none';
    };
})();
