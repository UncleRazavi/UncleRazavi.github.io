// ============================================================
// Hossein Razavi Portfolio


const CONFIG = {
    MAX_FPS: 60
};

let animationEnabled = true;

// ============================================================
// FPS Limiter
// ============================================================

function limitFPS(callback) {
    const interval = 1000 / CONFIG.MAX_FPS;
    let then = performance.now();

    function loop(now) {
        requestAnimationFrame(loop);

        if (!animationEnabled) return;

        const delta = now - then;

        if (delta > interval) {
            then = now - (delta % interval);
            callback(now);
        }
    }

    requestAnimationFrame(loop);
}

// ============================================================
// Clock
// ============================================================

function updateClock() {
    const clock = document.getElementById("clock");

    if (!clock) return;

    function tick() {
        const d = new Date();

        const h = String(d.getHours()).padStart(2, "0");
        const m = String(d.getMinutes()).padStart(2, "0");

        clock.textContent = `${h}:${m}`;
    }

    tick();
    setInterval(tick, 1000);
}

// ============================================================
// Typewriter
// ============================================================

function initTypewriter() {
    const el = document.getElementById("typewriter");

    if (!el) return;

    const text = el.textContent.trim();
    el.textContent = "";

    let i = 0;

    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, 70);
        }
    }

    type();
}

// ============================================================
// Three.js Avatar Cube
// ============================================================

function initThreeJSCube() {
    const container = document.getElementById("avatar-3d");

    if (!container || typeof THREE === "undefined") return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    function resizeRenderer() {
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    window.addEventListener("resize", resizeRenderer);

    limitFPS(() => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.015;
        renderer.render(scene, camera);
    });
}

// ============================================================
// Scroll Top
// ============================================================

function initScrollTop() {
    const btn = document.getElementById("scrollTopBtn");

    if (!btn) return;

    window.addEventListener("scroll", () => {
        btn.style.display = window.scrollY > 300 ? "block" : "none";
    });

    btn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ============================================================
// Particles.js
// ============================================================

function initParticles() {
    if (typeof particlesJS === "undefined") return;

    particlesJS("particles-js", {
        particles: {
            number: { value: 60 },
            color: { value: "#0080ff" },
            line_linked: { enable: true, opacity: 0.3 },
            move: { speed: 1.5 }
        }
    });
}

// ============================================================
// Basic Filter Functionality (Useful for Projects/Blog)
// ============================================================

function setupFilter(inputId, itemSelector) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('input', () => {
        const value = input.value.toLowerCase();
        document.querySelectorAll(itemSelector).forEach(el => {
            el.style.display = el.textContent.toLowerCase().includes(value) ? '' : 'none';
        });
    });
}

// ============================================================
// Initialize Everything
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    initTypewriter();
    initParticles();
    initThreeJSCube();
    initScrollTop();

    // Filters for other pages
    setupFilter('projectFilter', '.project-card');
    setupFilter('blogFilter', 'article');

    console.log("Hossein Razavi Portfolio Loaded - Lightweight Edition! 🚀");
});
