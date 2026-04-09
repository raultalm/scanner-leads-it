/**
 * TECH AUDIT (STACK SCANNER) LOGIC
 * Scans websites for technical footprints
 */

(function() {
    const scanBtn = document.getElementById('scanBtn');
    const urlInput = document.getElementById('urlInput');
    const resultsArea = document.getElementById('resultsArea');
    const loader = document.getElementById('loader');
    const errorMsg = document.getElementById('errorMsg');
    
    const detectedTech = document.getElementById('detectedTech');
    const techAdvice = document.getElementById('adviceText');

    // Run Scan
    scanBtn.addEventListener('click', async () => {
        let url = urlInput.value.trim();
        if (!url) return;
        if (!url.startsWith('http')) url = 'https://' + url;

        // Reset UI
        resultsArea.style.display = 'none';
        errorMsg.style.display = 'none';
        loader.style.display = 'block';
        scanBtn.disabled = true;

        try {
            // Using corsproxy.io for better results with Vercel/Cloudflare
            const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error();
            
            const html = await response.text();
            analyzeStack(html);
        } catch (err) {
            console.error("Audit error:", err);
            errorMsg.style.display = 'block';
        } finally {
            loader.style.display = 'none';
            scanBtn.disabled = false;
        }
    });

    function analyzeStack(html) {
        const sigs = [
            { name: "Next.js (React)", patterns: ['/_next/static', '__NEXT_DATA__', 'next-head-count'], advice: "Stack moderne et performante. Focus sur l'automatisation métier (API, CRM) ou le contenu." },
            { name: "WordPress", patterns: ['/wp-content/', '/wp-includes/', 'wp-json', 'wordpress'], advice: "Lourd et souvent mal sécurisé. Proposez un audit de performance (Core Web Vitals) ou une maintenance." },
            { name: "Shopify", patterns: ['cdn.shopify.com', 'shopify-section', 'Shopify.shop'], advice: "E-commerce solide. Opportunité : intégration d'outils tiers ou optimisation du tunnel d'achat." },
            { name: "React / Vite", patterns: ['/assets/index-', 'id="root"', 'react-dom'], advice: "App moderne (SPA). Très bon signe technique. Proposez de l'extension de fonctionnalités complexes." },
            { name: "Wix / Squarespace", patterns: ['static.wixstatic.com', 'wix-ads', 'squarespace.com'], advice: "Outil No-Code limité. Idéal pour une migration vers une solution sur mesure si le business grandit." },
            { name: "PHP (Vieux)", patterns: ['.php', 'PHPSESSID'], advice: "Probable dette technique. Idéal pour un refactoring moderne ou une refonte sécurisée." }
        ];

        let tech = "Stack Inconnue";
        let advice = "L'audit automatique n'a pas trouvé de signature connue. Demande un audit manuel approfondi.";

        for (const s of sigs) {
            if (s.patterns.some(p => html.toLowerCase().includes(p.toLowerCase()))) {
                tech = s.name;
                advice = s.advice;
                break;
            }
        }

        // Vanilla check
        if (tech === "Stack Inconnue" && html.includes('<script') && !html.includes('src="')) {
            tech = "Vanilla HTML / JS";
            advice = "Site ultra-léger codé à la main. Vérifiez si les outils de conversion et de tracking sont présents.";
        }

        // UI Update
        detectedTech.innerText = tech;
        techAdvice.innerText = advice;
        resultsArea.style.display = 'block';
        
        // Update Hub Stats
        const statValue = document.getElementById('statValue');
        const statusValue = document.getElementById('statusValue');
        statValue.innerText = tech.split(' ')[0];
        statusValue.innerText = "Détecté";
    }
})();
