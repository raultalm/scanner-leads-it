/**
 * TECH AUDIT (STACK SCANNER) LOGIC
 * Scans websites for technical footprints and business signals
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
    const marketingList = document.getElementById('marketingList');
    const techList = document.getElementById('techList');

    // --- SCAN HANDLERS ---
    scanBtn.addEventListener('click', async () => {
        let url = urlInput.value.trim();
        if (!url) return;
        if (!url.startsWith('http')) url = 'https://' + url;
        resetResults();
        loader.style.display = 'block';
        scanBtn.disabled = true;
        try {
            const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error();
            const html = await response.text();
            analyzeAll(html);
        } catch (err) {
            errorMsg.style.display = 'block';
        } finally {
            loader.style.display = 'none';
            scanBtn.disabled = false;
        }
    });

    manualBtn.addEventListener('click', () => {
        const html = sourceInput.value.trim();
        if (!html) return;
        resetResults();
        analyzeAll(html);
    });

    function resetResults() {
        resultsArea.style.display = 'none';
        errorMsg.style.display = 'none';
        marketingList.innerHTML = '';
        techList.innerHTML = '';
    }

    window.resetTech = function() {
        urlInput.value = '';
        sourceInput.value = '';
        resetResults();
    };

    function analyzeAll(html) {
        const lowHtml = html.toLowerCase();
        
        // 1. STACK DETECTION (Ordered from most specific to most general)
        const sigs = [
            { name: "Wix / Squarespace", patterns: ['static.wixstatic.com', 'wix-ads', 'wix-code', 'squarespace.com', 'sqsp.net'], advice: "Solution 'No-Code' propriétaire. Idéal pour une migration vers un site sur mesure si le business évolue." },
            { name: "Shopify", patterns: ['cdn.shopify.com', 'shopify-section', 'shopify-theme', 'shopify.shop'], advice: "E-commerce leader. Focus sur l'optimisation du tunnel d'achat ou l'automatisation des flux stocks/factures." },
            { name: "WordPress", patterns: ['/wp-content/', '/wp-includes/', 'wp-json', 'wordpress'], advice: "Lourd et souvent mal sécurisé. Proposez une maintenance de sécurité ou un audit de performance." },
            { name: "Next.js (React)", patterns: ['/_next/static', '__NEXT_DATA__', 'next-head-count'], advice: "Stack moderne et performante. Focus sur l'automatisation métier ou l'optimisation SEO avancée." },
            { name: "React / Vite", patterns: ['/assets/index-', 'vite-plugin-react', 'react-dom'], advice: "App moderne (SPA). Très bon signe technique. Proposez de l'extension de fonctionnalités complexes." },
            { name: "PHP (Vieux)", patterns: ['.php', 'PHPSESSID'], advice: "Technologie vieillissante. Risque de bugs et de failles. Proposez un refactoring moderne." }
        ];

        let tech = "Stack Inconnue";
        let advice = "Audit manuel requis pour identifier l'architecture.";
        for (const s of sigs) {
            if (s.patterns.some(p => lowHtml.includes(p.toLowerCase()))) {
                tech = s.name; advice = s.advice; break;
            }
        }
        if (tech === "Stack Inconnue" && (html.includes('<script') || html.includes('<html'))) {
            tech = "Vanilla HTML / JS"; advice = "Site ultra-léger. Vérifiez la présence d'outils de conversion.";
        }

        // 2. MARKETING SIGNALS
        const signals = [
            { label: "✅ Google Analytics", check: lowHtml.includes('gtag') || lowHtml.includes('google-analytics') },
            { label: "✅ Facebook Pixel", check: lowHtml.includes('fbq(') || lowHtml.includes('connect.facebook.net') },
            { label: "✅ TikTok Pixel", check: lowHtml.includes('ttq.load') },
            { label: "✅ WhatsApp Direct", check: lowHtml.includes('wa.me') || lowHtml.includes('api.whatsapp.com') },
            { label: "✅ Booking Widget", check: lowHtml.includes('calendly') || lowHtml.includes('reservio') || lowHtml.includes('doctolib') }
        ];

        // 3. TECH ALERTS (Refined)
        const hasLegacyImages = lowHtml.includes('.jpg') || lowHtml.includes('.png') || lowHtml.includes('.jpeg');
        const hasModernImages = lowHtml.includes('.webp') || lowHtml.includes('.avif');
        const hasLazyLoading = html.includes('loading="lazy"') || html.includes('data-src=');
        const hasImageOptimizer = lowHtml.includes('smush') || lowHtml.includes('imagify') || lowHtml.includes('shortpixel');

        const alerts = [
            { label: "❌ Email en clair (Spam)", check: html.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/)?.[0] && !lowHtml.includes('mailto:') },
            { label: "❌ Pas de Meta Description", check: !lowHtml.includes('name="description"') },
            { label: "❌ Pas de Viewport (Mobile)", check: !lowHtml.includes('name="viewport"') },
            { 
                label: "❌ Images non-optimisées", 
                check: hasLegacyImages && !hasModernImages && !hasImageOptimizer && !hasLazyLoading 
            },
            { label: "❌ Fuite de version (WP)", check: lowHtml.includes('name="generator" content="wordpress') }
        ];

        // RENDER
        detectedTech.innerText = tech;
        techAdvice.innerText = advice;
        
        signals.forEach(s => { if(s.check) addList(marketingList, s.label); });
        if (marketingList.children.length === 0) addList(marketingList, "Aucun signal détecté");

        alerts.forEach(a => { if(a.check) addList(techList, a.label); });
        if (techList.children.length === 0) addList(techList, "Aucune alerte majeure");

        resultsArea.style.display = 'block';
        
        const activeNav = document.querySelector('.nav-btn.active');
        if (activeNav && activeNav.innerText.includes('Tech')) {
            document.getElementById('statValue').innerText = tech.split(' ')[0];
            document.getElementById('statusValue').innerText = "Analysé";
        }
    }

    function addList(target, text) {
        const li = document.createElement('li');
        li.style.marginBottom = '0.3rem';
        li.innerText = text;
        target.appendChild(li);
    }
})();
