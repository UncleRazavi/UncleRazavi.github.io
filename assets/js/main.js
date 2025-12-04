// ============================================================
// 1. GLOBAL UTILITIES AND CONFIGURATIONS
// ============================================================

// --- Configuration Data ---
const CONFIG = {
    // Used for Particles.js (assuming it's loaded externally)
    PARTICLE_CONFIG: {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
            modes: { grab: { distance: 200, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    },
    SCROLL_THRESHOLD: 200,
    LAZY_LOADING_ROOT_MARGIN: '0px 0px 200px 0px', // Load images slightly before they enter viewport
    VISIBILITY_TITLE: 'Come back!',
};

// --- Core Utility Functions ---

/**
 * Makes an element draggable using its handle.
 * @param {HTMLElement} win - The element to move (e.g., the window).
 * @param {HTMLElement} handle - The element used to initiate the drag (e.g., the window title bar).
 */
function makeDraggable(win, handle) {
    let offsetX, offsetY, isDown = false;

    // Set initial cursor style on the handle
    handle.style.cursor = 'grab';

    handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDown = true;
        // Calculate the offset between mouse position and window corner
        const rect = win.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        win.style.cursor = 'grabbing';
        win.style.position = 'fixed'; // Ensure window is fixed for correct positioning
        win.style.zIndex = 1000; // Bring to front
    });

    document.addEventListener('mouseup', () => {
        if (isDown) win.style.cursor = 'grab';
        isDown = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDown) return;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Boundary checks to keep the window on screen
        newX = Math.max(0, Math.min(newX, window.innerWidth - win.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - win.offsetHeight));

        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;
    });
}

/**
 * Initializes the scroll-to-top button logic.
 * @param {HTMLElement} btn - The button element.
 * @param {number} threshold - Scroll position to show the button.
 */
function initScrollToTop(btn, threshold) {
    if (!btn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > threshold) {
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/**
 * Implements a simple typewriter effect.
 * @param {HTMLElement} element - The target element.
 * @param {number} speed - Typing speed in ms.
 * @param {boolean} addClass - If true, adds/removes 'typewriter' class for CSS animation.
 */
function initTypewriter(element, speed, addClass = false) {
    if (!element) return;
    const text = element.textContent.trim();
    element.textContent = "";
    let index = 0;

    if (addClass) element.classList.add('typewriter');

    function typeWriter() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        } else if (addClass) {
            // Remove class after completion + delay
            setTimeout(() => element.classList.remove('typewriter'), 1000);
        }
    }
    typeWriter();
}

// ============================================================
// 2. FEATURE INITIALIZATION FUNCTIONS
// ============================================================

function initDarkMode() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (!toggleBtn) return;

    // Load saved preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        toggleBtn.textContent = '☀️ Light Mode'; // Initialize button text
    } else {
        toggleBtn.textContent = '🌙 Dark Mode';
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            toggleBtn.textContent = '☀️ Light Mode';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            toggleBtn.textContent = '🌙 Dark Mode';
        }
    });
}

function initThreeJSCube() {
    const avatar3D = document.getElementById("avatar-3d");
    if (!avatar3D || typeof THREE === 'undefined') return;

    // 1. Create and attach canvas
    const cubeCanvas = document.createElement("canvas");
    cubeCanvas.id = "cubeCanvas";
    cubeCanvas.width = 300;
    cubeCanvas.height = 300;
    avatar3D.appendChild(cubeCanvas);

    const container = avatar3D; // Use avatar3D as the container reference

    // 2. Setup Three.js
    const renderer = new THREE.WebGLRenderer({ canvas: cubeCanvas, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 3);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color("hsl(0, 100%, 50%)") });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    const light = new THREE.PointLight(0xffffff, 2);
    light.position.set(2, 2, 3);
    scene.add(light);

    // 3. Animate
    let hue = 0;
    function animateCube() {
        requestAnimationFrame(animateCube);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.015;
        hue = (hue + 0.5) % 360;
        cube.material.color.setHSL(hue / 360, 1.0, 0.5);
        renderer.render(scene, camera);
    }
    animateCube();

    // 4. Handle Resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}

function initStaticFractal() {
    const fractalCanvas = document.getElementById("fractalCanvas");
    if (!fractalCanvas) return;

    const fractalCtx = fractalCanvas.getContext("2d");

    function drawSimpleFractal() {
        const w = fractalCanvas.width;
        const h = fractalCanvas.height;
        const img = fractalCtx.createImageData(w, h);
        const maxIter = 50;

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                let a = (x - w / 2) * 4 / w;
                let b = (y - h / 2) * 4 / h;
                const ca = a, cb = b;
                let n = 0;

                // Mandelbrot iteration
                while (n < maxIter) {
                    const aa = a * a - b * b;
                    const bb = 2 * a * b;
                    a = aa + ca;
                    b = bb + cb;
                    if (a * a + b * b > 16) break;
                    n++;
                }

                const pix = (x + y * w) * 4;
                const brightness = n === maxIter ? 0 : (n * 255) / maxIter;

                img.data[pix + 0] = brightness;
                img.data[pix + 1] = brightness;
                img.data[pix + 2] = brightness;
                img.data[pix + 3] = 255;
            }
        }
        fractalCtx.putImageData(img, 0, 0);
    }
    drawSimpleFractal();

    // Fix: Consolidate Drag Logic
    const fractalWindow = document.getElementById("fractalWindow");
    const header = document.getElementById("fractalHeader");
    if (fractalWindow && header) {
        makeDraggable(fractalWindow, header);
    }
}


function initInteractiveFractal() {
    // --- Dynamic Fractal Window Creation ---
    const fractalWindow2 = document.createElement('div');
    fractalWindow2.className = 'win98-window interactive-fractal-window'; // Added class for CSS styling
    fractalWindow2.style.top = window.innerWidth > 768 ? '50px' : '50px';
    fractalWindow2.style.left = window.innerWidth > 768 ? '50px' : '5%';
    fractalWindow2.id = 'win-fractal';

    const title2 = document.createElement('div');
    title2.className = 'win98-title';
    title2.textContent = 'Fractal (Mandelbrot) - Interactive';

    const closeBtn2 = document.createElement('div');
    closeBtn2.className = 'win98-close';
    closeBtn2.textContent = 'X';
    closeBtn2.onclick = () => fractalWindow2.style.display = 'none';

    title2.appendChild(closeBtn2);
    fractalWindow2.appendChild(title2);

    const content2 = document.createElement('div');
    content2.className = 'win98-content interactive-fractal-content';
    fractalWindow2.appendChild(content2);

    document.body.appendChild(fractalWindow2);
    makeDraggable(fractalWindow2, title2);

    // --- Advanced Mandelbrot Viewer Logic ---
    const canvas = document.createElement('canvas');
    // Ensure canvas is placed inside the window content
    canvas.width = content2.clientWidth || 300;
    canvas.height = content2.clientHeight || 200;
    content2.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    let zoom = 1;
    let panX = -2.5;
    let panY = -1;
    let targetZoom = zoom;
    let isDragging = false;
    let startX, startY;
    let maxIter = 100;
    let colorMode = "classic";

    // Use classes instead of inline styles for controls
    const controls = document.createElement('div');
    controls.className = 'fractal-controls';
    
    // Using variable references instead of re-querying DOM after creation
    const iterSlider = document.createElement('input');
    iterSlider.id = "iterSlider";
    iterSlider.type = "range";
    iterSlider.min = "50";
    iterSlider.max = "1000";
    iterSlider.value = maxIter;

    const iterVal = document.createElement('span');
    iterVal.id = "iterVal";
    iterVal.textContent = maxIter;

    const colorSelect = document.createElement('select');
    colorSelect.id = "colorSelect";
    colorSelect.innerHTML = `
        <option value="classic">Classic</option>
        <option value="fire">Fire</option>
        <option value="ice">Ice</option>
    `;

    controls.innerHTML = `Iterations: `;
    controls.appendChild(iterSlider);
    controls.appendChild(iterVal);
    controls.innerHTML += `<br>Colors: `;
    controls.appendChild(colorSelect);

    content2.insertBefore(controls, canvas);

    // Event listeners for controls
    iterSlider.addEventListener("input", (e) => {
        maxIter = parseInt(e.target.value);
        iterVal.textContent = maxIter;
        drawMandelbrot();
    });

    colorSelect.addEventListener("change", (e) => {
        colorMode = e.target.value;
        drawMandelbrot();
    });

    function getColor(iter) {
        if (iter >= maxIter) return [0, 0, 0];
        // Use more vibrant color mapping for better detail
        const t = iter / maxIter;
        switch (colorMode) {
            case "fire": return [255, 255 * t * t * 0.5, 0];
            case "ice": return [0, 100 * t, 255 * t];
            default: return [255 * t, 180 * t, 120 * t];
        }
    }

    function drawMandelbrot() {
        // Drawing logic remains the same (correct)
        const w = canvas.width;
        const h = canvas.height;
        const img = ctx.createImageData(w, h);
        const data = img.data;

        for (let px = 0; px < w; px++) {
            for (let py = 0; py < h; py++) {
                let x0 = panX + (px / w) * 3.5 * zoom;
                let y0 = panY + (py / h) * 2.0 * zoom;
                let x = 0, y = 0, iter = 0;

                while (x * x + y * y <= 4 && iter < maxIter) {
                    const xt = x * x - y * y + x0;
                    y = 2 * x * y + y0;
                    x = xt;
                    iter++;
                }

                const idx = (py * w + px) * 4;
                const [r, g, b] = getColor(iter);
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = 255;
            }
        }
        ctx.putImageData(img, 0, 0);
    }

    drawMandelbrot();

    // Mouse Interaction for Pan/Zoom
    canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        canvas.style.cursor = 'grabbing';
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
        canvas.style.cursor = 'grab';
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        // Adjusted coefficients for smoother pan based on zoom level
        panX -= dx * zoom * 0.0035;
        panY -= dy * zoom * 0.002;
        startX = e.clientX;
        startY = e.clientY;
        drawMandelbrot();
    });

    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        // Calculate point under cursor
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Convert mouse position to complex coordinates
        const x_coord = panX + (mouseX / canvas.width) * 3.5 * targetZoom;
        const y_coord = panY + (mouseY / canvas.height) * 2.0 * targetZoom;

        const scale = e.deltaY > 0 ? 1.2 : 0.8;
        targetZoom *= scale;

        // Re-calculate pan to keep the point under the cursor centered during zoom
        panX = x_coord - (mouseX / canvas.width) * 3.5 * targetZoom;
        panY = y_coord - (mouseY / canvas.height) * 2.0 * targetZoom;

        animateZoom();
    });

    function animateZoom() {
        const diff = targetZoom - zoom;
        if (Math.abs(diff) < 0.0001) {
            zoom = targetZoom;
            drawMandelbrot();
            return;
        }
        zoom += diff * 0.15;
        drawMandelbrot();
        requestAnimationFrame(animateZoom);
    }
}


function initCurveDrawings() {
    function drawCurve(canvasId, drawFunc) {
        const c = document.getElementById(canvasId);
        if (!c) return;
        const ctx = c.getContext("2d");
        // Ensure canvas size is set before drawing
        c.width = 300;
        c.height = 300;
        drawFunc(ctx, c.width, c.height);
    }

    // Lissajous
    drawCurve("lissajous-canvas", (ctx, w, h) => {
        ctx.strokeStyle = "#ff66ff";
        ctx.beginPath();
        for (let t = 0; t < 2 * Math.PI; t += 0.01) {
            let x = w / 2 + Math.sin(3 * t + Math.PI / 2) * 120;
            let y = h / 2 + Math.sin(4 * t) * 120;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    });

    // Rose curve
    drawCurve("rose-canvas", (ctx, w, h) => {
        ctx.strokeStyle = "#66ccff";
        ctx.beginPath();
        for (let t = 0; t < Math.PI * 12; t += 0.01) {
            let r = 150 * Math.sin(4 * t);
            let x = w / 2 + r * Math.cos(t);
            let y = h / 2 + r * Math.sin(t);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    });

    // Butterfly
    drawCurve("butterfly-canvas", (ctx, w, h) => {
        ctx.strokeStyle = "#ff8844";
        ctx.beginPath();
        for (let t = 0; t < 2 * Math.PI * 10; t += 0.01) {
            let r = Math.exp(Math.sin(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin((2 * t - Math.PI) / 24), 5);
            let x = w / 2 + 30 * r * Math.cos(t);
            let y = h / 2 + 30 * r * Math.sin(t);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    });

    // Spirograph
    drawCurve("spirograph-canvas", (ctx, w, h) => {
        ctx.strokeStyle = "#44ff99";
        ctx.beginPath();
        let R = 120, r = 60, d = 90;
        for (let t = 0; t < Math.PI * 20; t += 0.01) {
            let x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
            let y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
            ctx.lineTo(w / 2 + x, h / 2 + y);
        }
        ctx.stroke();
    });
}

function initUXFeatures() {
    // --- Card Animations ---
    const cards = document.querySelectorAll('.project-card, .post-card');
    if (cards.length > 0) {
        // Inject keyframes (moved from main DCL block)
        if (!document.querySelector('style[data-name="fadeInUp"]')) {
            const style = document.createElement('style');
            style.setAttribute('data-name', 'fadeInUp');
            style.textContent = `@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
            document.head.appendChild(style);
        }

        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
            card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.02)');
            card.addEventListener('mouseleave', () => card.style.transform = 'scale(1)');
        });
    }

    // --- Smooth Scroll For Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Page Visibility Title Change ---
    const pageTitleElement = document.querySelector('title');
    if (pageTitleElement) {
        pageTitleElement.setAttribute('data-original', pageTitleElement.textContent);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) pageTitleElement.textContent = CONFIG.VISIBILITY_TITLE;
        else pageTitleElement.textContent = pageTitleElement.getAttribute('data-original') || 'Hossein Razavi';
    });
}

function initScrollButtons() {
    // 1. Scroll-To-Top (Pre-existing HTML button logic)
    const scrollBtnHTML = document.getElementById("scrollTopBtn");
    initScrollToTop(scrollBtnHTML, CONFIG.SCROLL_THRESHOLD);

    // 2. Dynamic Scroll-To-Top Button (Created below for the FAB menu shortcut)
    const scrollToTopBtnDynamic = document.createElement('button');
    scrollToTopBtnDynamic.id = 'scroll-to-top';
    scrollToTopBtnDynamic.innerHTML = '↑';
    document.body.appendChild(scrollToTopBtnDynamic);
    initScrollToTop(scrollToTopBtnDynamic, 300); // Use a slightly higher threshold

    return scrollToTopBtnDynamic; // Return the reference for use in keyboard shortcuts
}

function initFloatingActionMenu(scrollToTopBtnDynamic) {
    // --- Floating Action Menu ---
    // Use classes for styling instead of inline CSS
    const fabButton = document.createElement('button');
    fabButton.id = 'fab-menu-toggle';
    fabButton.className = 'fab-button';
    fabButton.textContent = '⚙';

    const menu = document.createElement('div');
    menu.id = 'fab-menu';
    menu.className = 'fab-menu';

    menu.innerHTML = `
        <button id="fab-dark-mode-toggle">Toggle Dark Mode</button><br>
        <button id="fab-scroll-btn">Scroll Top</button>
    `;

    fabButton.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    document.body.appendChild(fabButton);
    document.body.appendChild(menu);

    // Bind actions
    document.getElementById("fab-dark-mode-toggle")?.addEventListener('click', () => {
        document.getElementById('dark-mode-toggle')?.click();
    });

    // Bind scroll click to the dynamic button's click handler
    document.getElementById("fab-scroll-btn")?.addEventListener("click", () => {
        scrollToTopBtnDynamic.click();
        menu.style.display = 'none';
    });
}

function initKeyboardShortcuts(scrollToTopBtnDynamic) {
    document.addEventListener('keydown', (e) => {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (e.altKey && e.key.toLowerCase() === 'd' && darkModeToggle)
            darkModeToggle.click();

        if (e.altKey && e.key.toLowerCase() === 't')
            scrollToTopBtnDynamic.click();

        if (e.altKey && e.key.toLowerCase() === 'h')
            window.location.href = '/';
    });
}

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                obs.unobserve(img);
            });
        }, {
             rootMargin: CONFIG.LAZY_LOADING_ROOT_MARGIN
        });
        images.forEach(img => observer.observe(img));
    }
}

// ============================================================
// 3. MAIN EXECUTION ENTRY POINT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Utilities & Vendor Loads
    initDarkMode();

    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', CONFIG.PARTICLE_CONFIG);
    }
    
    // 2. Complex Visual Elements
    initThreeJSCube();
    initStaticFractal();
    initInteractiveFractal();
    initCurveDrawings(); // The original script executed this outside DCL, but it requires elements, so move it here.

    // 3. Typewriter Effects
    initTypewriter(document.getElementById("typewriter"), 50);
    initTypewriter(document.querySelector('.hero-content h1'), 60, true);

    // 4. UX and Navigation
    initUXFeatures();
    const dynamicScrollButton = initScrollButtons();
    initFloatingActionMenu(dynamicScrollButton); // Pass the dynamic button reference
    initKeyboardShortcuts(dynamicScrollButton);
    initLazyLoading();

    // 5. Diagnostics
    let visitCount = localStorage.getItem('visitCount');
    visitCount = visitCount ? parseInt(visitCount) + 1 : 1;
    localStorage.setItem('visitCount', visitCount);
    console.log(`Visited ${visitCount} time(s)`);
});
