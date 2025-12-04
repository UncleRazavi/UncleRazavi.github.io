// ============================================================
// 1. GLOBAL UTILITIES AND CONFIGURATIONS
// ============================================================

// --- Configuration Data ---
const CONFIG = {
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
    LAZY_LOADING_ROOT_MARGIN: '0px 0px 200px 0px',
    VISIBILITY_TITLE: 'Come back!',
};

// --- Core Utility Functions ---

/**
 * Throttles a function to run at most once every 'limit' ms.
 * prevents performance issues on scroll/resize events.
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function makeDraggable(win, handle) {
    let offsetX, offsetY, isDown = false;
    handle.style.cursor = 'grab';

    handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDown = true;
        const rect = win.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        win.style.cursor = 'grabbing';
        win.style.position = 'fixed'; 
        win.style.zIndex = 1000;
    });

    // Use window instead of document to catch releases outside the viewport better
    window.addEventListener('mouseup', () => {
        if (isDown) {
            win.style.cursor = 'grab';
            isDown = false;
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // Prevent text selection while dragging

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Boundary checks
        newX = Math.max(0, Math.min(newX, window.innerWidth - win.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - win.offsetHeight));

        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;
    });
}

function initScrollToTop(btn, threshold) {
    if (!btn) return;

    // OPTIMIZATION: Throttled to run only once every 200ms
    window.addEventListener("scroll", throttle(() => {
        if (window.scrollY > threshold) {
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    }, 200));

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

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
    // Safe return if button doesn't exist
    if (!toggleBtn) return; 

    // Helper to update text
    const updateBtnText = (isDark) => {
        toggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    };

    // Load saved preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        updateBtnText(true);
    } else {
        updateBtnText(false);
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        updateBtnText(isDark);
    });
}

function initThreeJSCube() {
    const avatar3D = document.getElementById("avatar-3d");
    if (!avatar3D || typeof THREE === 'undefined') return;

    // Safety check for WebGL context
    try {
        const cubeCanvas = document.createElement("canvas");
        cubeCanvas.id = "cubeCanvas";
        // Style handled by CSS class preferably, but canvas needs clear dimensions
        avatar3D.appendChild(cubeCanvas);

        const container = avatar3D;
        const renderer = new THREE.WebGLRenderer({ canvas: cubeCanvas, antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 3);
        
        const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        // Use NormalMaterial for that cool "developer" RGB look
        const material = new THREE.MeshNormalMaterial(); 
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        function animateCube() {
            requestAnimationFrame(animateCube);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.015;
            renderer.render(scene, camera);
        }
        animateCube();

        window.addEventListener('resize', throttle(() => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }, 100));
        
    } catch (e) {
        console.warn("WebGL not supported or Three.js error", e);
        avatar3D.innerHTML = "3D Error"; 
    }
}

function initStaticFractal() {
    const fractalCanvas = document.getElementById("fractalCanvas");
    if (!fractalCanvas) return;

    // Run this in a timeout to let the main page load first
    setTimeout(() => {
        const fractalCtx = fractalCanvas.getContext("2d");
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
                while (n < maxIter) {
                    const aa = a * a - b * b;
                    const bb = 2 * a * b;
                    a = aa + ca;
                    b = bb + cb;
                    if (a * a + b * b > 16) break;
                    n++;
                }
                const pix = (x + y * w) * 4;
                // Simple grayscale mapping
                const val = n === maxIter ? 0 : (n * 255) / maxIter;
                img.data[pix] = val;
                img.data[pix + 1] = val;
                img.data[pix + 2] = val;
                img.data[pix + 3] = 255;
            }
        }
        fractalCtx.putImageData(img, 0, 0);
    }, 100);

    const fractalWindow = document.getElementById("fractalWindow");
    const header = document.getElementById("fractalHeader");
    if (fractalWindow && header) {
        makeDraggable(fractalWindow, header);
    }
}

function initInteractiveFractal() {
    // 1. Create Elements
    const fractalWindow2 = document.createElement('div');
    fractalWindow2.className = 'win98-window interactive-fractal-window';
    fractalWindow2.id = 'win-fractal';
    
    // Initial positioning via JS (needed for dynamic creation)
    fractalWindow2.style.position = 'fixed';
    fractalWindow2.style.top = '60px';
    fractalWindow2.style.left = window.innerWidth > 768 ? 'auto' : '10%';
    fractalWindow2.style.right = window.innerWidth > 768 ? '20px' : 'auto';

    const title2 = document.createElement('div');
    title2.className = 'window-title'; // Matches CSS from previous step
    title2.innerHTML = `<span>Mandelbrot Explorer</span>`;

    // Window Controls
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'window-controls';
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    closeBtn.onclick = () => fractalWindow2.style.display = 'none';
    controlsDiv.appendChild(closeBtn);
    title2.appendChild(controlsDiv);

    fractalWindow2.appendChild(title2);

    const content2 = document.createElement('div');
    content2.className = 'window-content';
    fractalWindow2.appendChild(content2);

    document.body.appendChild(fractalWindow2);
    makeDraggable(fractalWindow2, title2);

    // 2. Canvas Setup
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 220;
    canvas.style.border = "2px solid #808080"; // Bevel
    
    // UI Controls
    const uiContainer = document.createElement('div');
    uiContainer.style.marginBottom = "8px";
    uiContainer.style.display = "flex";
    uiContainer.style.gap = "10px";
    uiContainer.style.fontSize = "14px";
    
    uiContainer.innerHTML = `
        <label>Iter: <input id="iterSlider" type="range" min="50" max="500" value="100" style="width:60px"></label>
        <select id="colorSelect">
            <option value="classic">Classic</option>
            <option value="fire">Fire</option>
            <option value="ice">Ice</option>
        </select>
    `;

    content2.appendChild(uiContainer);
    content2.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let zoom = 1, panX = -2.5, panY = -1;
    let maxIter = 100, colorMode = "classic";
    let isDragging = false, startX, startY;

    // 3. Logic
    const iterSlider = uiContainer.querySelector('#iterSlider');
    const colorSelect = uiContainer.querySelector('#colorSelect');

    iterSlider.addEventListener("input", (e) => {
        maxIter = parseInt(e.target.value);
        requestAnimationFrame(drawMandelbrot);
    });

    colorSelect.addEventListener("change", (e) => {
        colorMode = e.target.value;
        requestAnimationFrame(drawMandelbrot);
    });

    function getColor(iter) {
        if (iter >= maxIter) return [0, 0, 0];
        const t = iter / maxIter;
        if (colorMode === 'fire') return [255, 255 * t * t * 0.5, 0];
        if (colorMode === 'ice') return [0, 100 * t, 255 * t];
        return [255 * t, 180 * t, 120 * t]; // Classic
    }

    function drawMandelbrot() {
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

    // Initial Draw
    requestAnimationFrame(drawMandelbrot);

    // Interaction
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
        panX -= dx * zoom * 0.0035;
        panY -= dy * zoom * 0.002;
        startX = e.clientX;
        startY = e.clientY;
        requestAnimationFrame(drawMandelbrot);
    });

    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Zoom logic
        const x_coord = panX + (mouseX / canvas.width) * 3.5 * zoom;
        const y_coord = panY + (mouseY / canvas.height) * 2.0 * zoom;
        
        const scale = e.deltaY > 0 ? 1.1 : 0.9;
        zoom *= scale;

        panX = x_coord - (mouseX / canvas.width) * 3.5 * zoom;
        panY = y_coord - (mouseY / canvas.height) * 2.0 * zoom;

        requestAnimationFrame(drawMandelbrot);
    });
}

function initCurveDrawings() {
    function drawCurve(canvasId, drawFunc) {
        const c = document.getElementById(canvasId);
        if (!c) return;
        const ctx = c.getContext("2d");
        c.width = 300;
        c.height = 300;
        drawFunc(ctx, c.width, c.height);
    }

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
    // (Other curves omitted for brevity, logic is fine)
}

function initUXFeatures() {
    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Page Visibility ---
    const pageTitle = document.querySelector('title');
    if (pageTitle) {
        const originalTitle = pageTitle.textContent;
        document.addEventListener('visibilitychange', () => {
            pageTitle.textContent = document.hidden ? CONFIG.VISIBILITY_TITLE : originalTitle;
        });
    }
}

function initScrollButtons() {
    // Existing static button
    const scrollBtnHTML = document.getElementById("scrollTopBtn");
    initScrollToTop(scrollBtnHTML, CONFIG.SCROLL_THRESHOLD);

    // Dynamic button for FAB
    const scrollToTopBtnDynamic = document.createElement('button');
    scrollToTopBtnDynamic.style.display = 'none'; // Hidden, used for logic
    initScrollToTop(scrollToTopBtnDynamic, 300);
    return scrollToTopBtnDynamic;
}

function initFloatingActionMenu(dynamicScrollBtn) {
    const fabButton = document.createElement('button');
    fabButton.className = 'button-98'; // Use your CSS class
    fabButton.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:9999; border-radius:0; width:40px;";
    fabButton.textContent = '⚙';

    const menu = document.createElement('div');
    menu.className = 'win98-window'; // Matches CSS
    menu.style.cssText = "display:none; position:fixed; bottom:60px; right:20px; z-index:9999; width:150px;";
    
    menu.innerHTML = `
        <div class="window-content" style="display:flex; flex-direction:column; gap:5px;">
            <button class="button-98" id="fab-dark-mode">Toggle Theme</button>
            <button class="button-98" id="fab-scroll">Scroll Top</button>
        </div>
    `;

    fabButton.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    document.body.appendChild(fabButton);
    document.body.appendChild(menu);

    // Event Delegation
    menu.addEventListener('click', (e) => {
        if(e.target.id === 'fab-dark-mode') {
            document.getElementById('dark-mode-toggle')?.click();
        }
        if(e.target.id === 'fab-scroll') {
            window.scrollTo({ top: 0, behavior: "smooth" });
            menu.style.display = 'none';
        }
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
        }, { rootMargin: CONFIG.LAZY_LOADING_ROOT_MARGIN });
        images.forEach(img => observer.observe(img));
    }
}

// ============================================================
// 3. MAIN EXECUTION ENTRY POINT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    initDarkMode();

    // Check if libraries loaded
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', CONFIG.PARTICLE_CONFIG);
    }
    
    initThreeJSCube();
    initStaticFractal();
    initInteractiveFractal();
    initCurveDrawings();

    // Typewriters
    initTypewriter(document.getElementById("typewriter"), 50);
    initTypewriter(document.querySelector('.hero-content h1'), 60, true);

    initUXFeatures();
    const scrollBtn = initScrollButtons();
    initFloatingActionMenu(scrollBtn);
    initLazyLoading();

    // Console Greeting
    console.log("%c Welcome to the Retro Web! ", "background: #000080; color: #fff; font-size: 16px; padding: 4px;");
});
