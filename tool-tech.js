/**
 * TECH AUDIT (STACK SCANNER) LOGIC
 * Scans websites for technical footprints (Automatic or Manual)
 */

(function() {
    const scanBtn = document.getElementById('scanBtn');
    const manualBtn = document.getElementById('manualBtn');
    const urlInput = document.getElementById('urlInput');
    const sourceInput = document.getElementById('sourceInput');
    const resultsArea = document.getElementById('resultsArea');
    const loader = document.getElementById('loader');
    const errorMsg = document.getElementById('errorMsg');
    
    const detectedTech = document.getElementById('detectedTech');
    const techAdvice = document.getElementById('adviceText');

    // --- AUTOMATIC SCAN ---
    scanBtn.addEventListener('click', async () => {
        let url = urlInput.value.trim();
        if (!url) return;
        if (!url.startsWith('http')) url = 'https://' + url;

        resetUI();
        loader.style.display = 'block';
        scanBtn.disabled = true;

        try {
            const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error();
            const html = await response.text();
            analyzeStack(html);
        } catch (err) {
            console.error("Audit error:", err);
            errorMsg.style.display = 'block';
            errorMsg.innerText = "Lecture automatique bloquée. Utilisez le mode manuel ci-dessous (Ctrl+U sur le site).";
        } finally {
            loader.style.display = 'none';
            scanBtn.disabled = false;
        }
    });

    // --- MANUAL AUDIT (Source Code Paste) ---
    manualBtn.addEventListener('click', () => {
        const html = sourceInput.value.trim();
        if (!html) return;

        resetUI();
        analyzeStack(html);
    });

    function resetUI() {
        resultsArea.style.display = 'none';
        errorMsg.style.display = 'none';
    }

    function analyzeStack(html) {
        const sigs = [
            { name: "Next.js (React)", patterns: ['/_next/static', '__NEXT_DATA__', 'next-head-count'], advice: "Stack moderne et performante. Focus sur l'automatisation métier (API, CRM) ou le contenu." },
            { name: "WordPress", patterns: ['/wp-content/', '/wp-includes/', 'wp-json', 'wordpress'], advice: "Lourd et souvent mal sécurisé. Proposez un audit de performance (Core Web Vitals) ou une maintenance." },
            { name: "Shopify", patterns: ['cdn.shopify.com', 'shopify-section', 'Shopify.shop', 'shopify-theme'], advice: "E-commerce solide. Opportunité : intégration d'outils tiers ou optimisation du tunnel d'achat." },
            { name: "React / Vite", patterns: ['/assets/index-', 'id="root"', 'react-dom'], advice: "App moderne (SPA). Très bon signe technique. Proposez de l'extension de fonctionnalités complexes." },
            { name: "Wix / Squarespace", patterns: ['static.wixstatic.com', 'wix-ads', 'squarespace.com', 'sqsp.net'], advice: "Outil No-Code limité. Idéal pour une migration vers une solution sur mesure si le business grandit." },
            { name: "PHP (Vieux)", patterns: ['.php', 'PHPSESSID'], advice: "Probable dette technique. Idéal pour un refactoring moderne ou une refonte sécurisée." }
        ];

        let tech = "Stack Inconnue";
        let advice = "L'audit n'a pas trouvé de signature connue. Le site utilise peut-être une technologie custom ou un framework plus rare.";

        const lowHtml = html.toLowerCase();

        for (const s of sigs) {
            if (s.patterns.some(p => lowHtml.includes(p.toLowerCase()))) {
                tech = s.name;
                advice = s.advice;
                break;
            }
        }

        // Vanilla check
        if (tech === "Stack Inconnue" && (html.includes('<script') || html.includes('<html'))) {
            tech = "Vanilla HTML / JS";
            advice = "Site ultra-léger codé à la main. Vérifiez si les outils de conversion et de tracking sont présents.";
        }

        // Results Display
        detectedTech.innerText = tech;
        techAdvice.innerText = advice;
        resultsArea.style.display = 'block';
        
        // Update Hub Header
        document.getElementById('statValue').innerText = tech.split(' ')[0];
        document.getElementById('statusValue').innerText = "Vérifié";
    }
})();
