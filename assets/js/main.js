// ============================================================
// 1. GLOBAL CONFIGURATIONS & UTILITIES
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('dark-mode-toggle');

    // Load saved preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
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
});

// --- Particles.js Configuration ---
const particleConfig = {
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
};

// Check if particlesJS is loaded before running
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', particleConfig);
}

// --- Generic Draggable Function (Used by File 2 logic) ---
function makeDraggable(win, handle) {
    let offsetX, offsetY, isDown = false;

    win.style.cursor = 'grab';

    handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDown = true;
        offsetX = e.clientX - win.getBoundingClientRect().left;
        offsetY = e.clientY - win.getBoundingClientRect().top;
        win.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
        if (isDown) win.style.cursor = 'grab';
        isDown = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDown) return;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Boundary checks
        newX = Math.max(0, Math.min(newX, window.innerWidth - win.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - win.offsetHeight));

        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;
    });
}

// ============================================================
// 2. MAIN EXECUTION (DOM CONTENT LOADED)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {


    // Attach cube canvas inside avatar-3d
    const avatar3D = document.getElementById("avatar-3d");
    if (avatar3D && typeof THREE !== 'undefined') {
        const cubeCanvas = document.createElement("canvas");
        cubeCanvas.id = "cubeCanvas";
        cubeCanvas.width = 300;
        cubeCanvas.height = 300;
        avatar3D.appendChild(cubeCanvas);
    
    }


    // --- Typewriter Effect (Targeting ID: "typewriter") ---
    const typewriterElement = document.getElementById("typewriter");
    if (typewriterElement) {
        const text = typewriterElement.textContent.trim();
        typewriterElement.textContent = "";
        let index = 0;

        function typeWriter() {
            if (index < text.length) {
                typewriterElement.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        }
        typeWriter();
    }

    // --- Scroll To Top Button (Targeting ID: "scrollTopBtn") ---
    const scrollBtnFile1 = document.getElementById("scrollTopBtn");
    if (scrollBtnFile1) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 200) {
                scrollBtnFile1.classList.add("show");
            } else {
                scrollBtnFile1.classList.remove("show");
            }
        });

        scrollBtnFile1.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // --- Fractal Window (Targeting Canvas ID: "fractalCanvas") ---
    let fractalCanvas = document.getElementById("fractalCanvas");
    if (fractalCanvas) {
        let fractalCtx = fractalCanvas.getContext("2d");

        function drawSimpleFractal() {
            let w = fractalCanvas.width;
            let h = fractalCanvas.height;
            let img = fractalCtx.createImageData(w, h);

            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    let a = (x - w / 2) * 4 / w;
                    let b = (y - h / 2) * 4 / h;
                    let ca = a, cb = b;
                    let n = 0;
                    const maxIter = 50;

                    while (n < maxIter) {
                        let aa = a * a - b * b;
                        let bb = 2 * a * b;
                        a = aa + ca;
                        b = bb + cb;
                        if (a * a + b * b > 16) break;
                        n++;
                    }

                    let pix = (x + y * w) * 4;
                    let brightness = n === maxIter ? 0 : (n * 255) / maxIter;

                    img.data[pix + 0] = brightness;
                    img.data[pix + 1] = brightness;
                    img.data[pix + 2] = brightness;
                    img.data[pix + 3] = 255;
                }
            }
            fractalCtx.putImageData(img, 0, 0);
        }
        drawSimpleFractal();
    }

    // --- Drag Function for File 1 Fractal Window ---
    const fractalWindowFile1 = document.getElementById("fractalWindow");
    const headerFile1 = document.getElementById("fractalHeader");

    if (fractalWindowFile1 && headerFile1) {
        let offsetX = 0, offsetY = 0, isDragging = false;

        headerFile1.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - fractalWindowFile1.offsetLeft;
            offsetY = e.clientY - fractalWindowFile1.offsetTop;
        });

        document.addEventListener("mouseup", () => isDragging = false);

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                fractalWindowFile1.style.left = (e.clientX - offsetX) + "px";
                fractalWindowFile1.style.top = (e.clientY - offsetY) + "px";
            }
        });
    }

// --- Three.js Spinning Cube ---
const container = document.querySelector('.three-d-container');
const cubeCanvas = document.getElementById("cubeCanvas");

if (cubeCanvas && typeof THREE !== 'undefined') {
    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: cubeCanvas, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color("hsl(0, 100%, 50%)") });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Light
    const light = new THREE.PointLight(0xffffff, 2);
    light.position.set(2, 2, 3);
    scene.add(light);

    // Animate Cube
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

    // Responsive: Adjust on window resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}


    // --- Dynamic Fractal Window Creation ---
    const fractalWindow2 = document.createElement('div');
    fractalWindow2.className = 'win98-window';
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
    content2.className = 'win98-content';
    fractalWindow2.appendChild(content2);

    document.body.appendChild(fractalWindow2);
    makeDraggable(fractalWindow2, title2);

    // --- Advanced Mandelbrot Viewer Logic ---
    function initFractalViewer(container) {
        const canvas = document.createElement('canvas');
        canvas.width = container.clientWidth || 300;
        canvas.height = container.clientHeight || 200;
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        let zoom = 1;
        let panX = -2.5;
        let panY = -1;
        let targetZoom = zoom;
        let isDragging = false;
        let startX, startY;
        let maxIter = 100;
        let colorMode = "classic";

        const controls = document.createElement('div');
        controls.style.cssText = `
            font-family: monospace;
            font-size: 14px;
            background:#dcdcdc;
            padding:6px;
            border:2px outset #fff;
            margin-bottom:6px;
        `;
        controls.innerHTML = `
            Iterations: <input id="iterSlider" type="range" min="50" max="1000" value="${maxIter}">
            <span id="iterVal">${maxIter}</span>
            <br>
            Colors:
            <select id="colorSelect">
                <option value="classic">Classic</option>
                <option value="fire">Fire</option>
                <option value="ice">Ice</option>
            </select>
        `;
        container.insertBefore(controls, canvas);

        // Event listeners for controls
        const iterSlider = document.getElementById("iterSlider");
        if(iterSlider) {
             iterSlider.addEventListener("input", (e) => {
                maxIter = parseInt(e.target.value);
                document.getElementById("iterVal").textContent = maxIter;
                drawMandelbrot();
            });
        }

        const colorSelect = document.getElementById("colorSelect");
        if(colorSelect) {
            colorSelect.addEventListener("change", (e) => {
                colorMode = e.target.value;
                drawMandelbrot();
            });
        }

        function getColor(iter) {
            if (iter >= maxIter) return [0, 0, 0];
            const t = iter / maxIter;
            switch (colorMode) {
                case "fire": return [255 * t, 80 * t, 0];
                case "ice": return [0, 180 * t, 255 * t];
                default: return [255 * t, 180 * t, 120 * t];
            }
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

        drawMandelbrot();

        canvas.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
        });

        window.addEventListener("mouseup", () => isDragging = false);

        canvas.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            panX -= dx * zoom * 0.0035;
            panY -= dy * zoom * 0.002;
            startX = e.clientX;
            startY = e.clientY;
            drawMandelbrot();
        });

        canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            const scale = e.deltaY > 0 ? 1.2 : 0.8;
            targetZoom *= scale;
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
    
    // Initialize the viewer inside the dynamically created window
    initFractalViewer(content2);


    // --- Dynamic Scroll To Top Button ---
    const scrollToTopBtnDynamic = document.createElement('button');
    scrollToTopBtnDynamic.id = 'scroll-to-top';
    scrollToTopBtnDynamic.innerHTML = '↑';
    document.body.appendChild(scrollToTopBtnDynamic);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) scrollToTopBtnDynamic.classList.add('show');
        else scrollToTopBtnDynamic.classList.remove('show');
    });

    scrollToTopBtnDynamic.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // --- Typewriter Effect 2 (Targeting .hero-content h1) ---
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.classList.add('typewriter');
        let index = 0;
        const speed = 60;

        function typeHero() {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeHero, speed);
            } else {
                setTimeout(() => heroTitle.classList.remove('typewriter'), 1000);
            }
        }
        typeHero();
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


    // --- Keyboard Shortcuts ---
    document.addEventListener('keydown', (e) => {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (e.altKey && e.key.toLowerCase() === 'd' && darkModeToggle)
            darkModeToggle.click();
        
        if (e.altKey && e.key.toLowerCase() === 't')
            scrollToTopBtnDynamic.click(); // Using the dynamic button
        
        if (e.altKey && e.key.toLowerCase() === 'h')
            window.location.href = '/';
    });


    // --- Card Animations ---
    const cards = document.querySelectorAll('.project-card, .post-card');
    if (cards.length > 0) {
        // Inject keyframes if not present
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
            card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.02)');
            card.addEventListener('mouseleave', () => card.style.transform = 'scale(1)');
        });
    }


    // --- Visit Counter ---
    let visitCount = localStorage.getItem('visitCount');
    visitCount = visitCount ? parseInt(visitCount) + 1 : 1;
    localStorage.setItem('visitCount', visitCount);
    console.log(`Visited ${visitCount} time(s)`);


    // --- Page Visibility Title Change ---
    if (document.querySelector('title'))
        document.querySelector('title').setAttribute('data-original', document.title);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) document.title = 'Come back!';
        else document.title = document.querySelector('title')?.getAttribute('data-original') || 'Hossein Razavi';
    });


    // --- Lazy Loading Images ---
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
        });
        images.forEach(img => observer.observe(img));
    }


    // --- Floating Action Menu ---
    const fabButton = document.createElement('button');
    fabButton.id = 'fab-menu-toggle';
    fabButton.textContent = '⚙';

    fabButton.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color, #333);
        color: var(--border-light, #fff);
        border: 2px outset #fff;
        cursor: pointer;
        z-index: 998;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const menu = document.createElement('div');
    menu.id = 'fab-menu';
    menu.style.cssText = `
        position: fixed;
        bottom: 140px;
        right: 20px;
        padding: 10px;
        background: var(--window-bg, #fff);
        border: 2px outset #fff;
        display: none;
        z-index: 999;
    `;

    menu.innerHTML = `
        <button onclick="document.getElementById('dark-mode-toggle') && document.getElementById('dark-mode-toggle').click()">Toggle Dark Mode</button><br>
        <button id="fab-scroll-btn">Scroll Top</button>
    `;

    fabButton.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    document.body.appendChild(fabButton);
    document.body.appendChild(menu);
    
    // Bind scroll click in the generated menu
    const fabScroll = document.getElementById("fab-scroll-btn");
    if(fabScroll) {
        fabScroll.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
function drawCurve(canvasId, drawFunc) {
    const c = document.getElementById(canvasId);
    if (!c) return;
    const ctx = c.getContext("2d");
    c.width = 300;
    c.height = 300;
    drawFunc(ctx, c.width, c.height);
}

// Lissajous
drawCurve("lissajous-canvas", (ctx, w, h) => {
    ctx.strokeStyle = "#ff66ff";
    ctx.beginPath();
    for (let t = 0; t < 2 * Math.PI; t += 0.01) {
        let x = w/2 + Math.sin(3*t + Math.PI/2) * 120;
        let y = h/2 + Math.sin(4*t) * 120;
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
        let x = w/2 + r * Math.cos(t);
        let y = h/2 + r * Math.sin(t);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
});

// Butterfly
drawCurve("butterfly-canvas", (ctx, w, h) => {
    ctx.strokeStyle = "#ff8844";
    ctx.beginPath();
    for (let t = 0; t < 2*Math.PI*10; t += 0.01) {
        let r = Math.exp(Math.sin(t)) - 2*Math.cos(4*t) + Math.pow(Math.sin((2*t- Math.PI)/24), 5);
        let x = w/2 + 30 * r * Math.cos(t);
        let y = h/2 + 30 * r * Math.sin(t);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
});

// Spirograph
drawCurve("spirograph-canvas", (ctx, w, h) => {
    ctx.strokeStyle = "#44ff99";
    ctx.beginPath();
    let R = 120, r = 60, d = 90;
    for (let t = 0; t < Math.PI*20; t += 0.01) {
        let x = (R-r)*Math.cos(t) + d*Math.cos(((R-r)/r)*t);
        let y = (R-r)*Math.sin(t) - d*Math.sin(((R-r)/r)*t);
        ctx.lineTo(w/2 + x, h/2 + y);
    }
    ctx.stroke();
});



