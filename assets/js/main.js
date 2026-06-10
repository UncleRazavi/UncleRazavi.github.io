// ============================================================
// GLOBAL CONFIG
// ============================================================

const CONFIG = {
    SCROLL_THRESHOLD: 200,
    LAZY_LOADING_ROOT_MARGIN: "0px 0px 200px 0px",
    VISIBILITY_TITLE: "Come back!",
    MAX_FPS: 60
};

// ============================================================
// GLOBAL STATE
// ============================================================

let animationEnabled = true;
let globalZIndex = 1000;

// ============================================================
// UTILITIES
// ============================================================

function throttle(func, limit) {
    let inThrottle = false;

    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

function limitFPS(callback) {
    const interval = 1000 / CONFIG.MAX_FPS;
    let then = performance.now();

    function loop(now) {
        requestAnimationFrame(loop);
        if (!animationEnabled) return;

        const delta = now - then;

        if (delta > interval) {
            then = now - (delta % interval);
            callback();
        }
    }

    requestAnimationFrame(loop);
}

// ============================================================
// WINDOW MANAGEMENT
// ============================================================

function bringToFront(win) {
    globalZIndex++;
    win.style.zIndex = globalZIndex;
}

function makeDraggable(win, handle = null) {
    const title = handle || win.querySelector(".window-title");
    if (!title) return;

    let isDown = false;
    let offsetX = 0;
    let offsetY = 0;

    title.style.cursor = "grab";

    title.addEventListener("mousedown", (e) => {
        isDown = true;

        bringToFront(win);

        const rect = win.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        win.style.position = "fixed";
        title.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
        isDown = false;
        title.style.cursor = "grab";
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDown) return;

        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        x = Math.max(0, Math.min(window.innerWidth - win.offsetWidth, x));
        y = Math.max(0, Math.min(window.innerHeight - win.offsetHeight, y));

        win.style.left = `${x}px`;
        win.style.top = `${y}px`;
    });
}

// ============================================================
// DARK MODE
// ============================================================

function initDarkMode() {
    const btn = document.getElementById("dark-mode-toggle");
    if (!btn) return;

    const root = document.documentElement;

    function update() {
        const dark = root.classList.contains("dark-mode");
        btn.textContent = dark ? "☀ Light Mode" : "🌙 Dark Mode";
        btn.setAttribute("aria-pressed", dark);
    }

    btn.addEventListener("click", () => {
        root.classList.toggle("dark-mode");
        localStorage.setItem(
            "darkMode",
            root.classList.contains("dark-mode") ? "enabled" : "disabled"
        );
        update();
    });

    update();
}

// ============================================================
// THREE JS CUBE
// ============================================================

function initThreeJSCube() {
    const avatar = document.getElementById("avatar-3d");
    if (!avatar || typeof THREE === "undefined") return;

    const canvas = document.createElement("canvas");
    avatar.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        70,
        avatar.clientWidth / avatar.clientHeight,
        0.1,
        1000
    );

    camera.position.z = 3;

    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.2, 1.2),
        new THREE.MeshNormalMaterial()
    );

    scene.add(cube);

    function render() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.015;

        renderer.setSize(avatar.clientWidth, avatar.clientHeight);
        renderer.render(scene, camera);
    }

    limitFPS(render);
}

// ============================================================
// MANDELBROT EXPLORER
// ============================================================

function initInteractiveFractal() {
    const win = document.createElement("div");
    win.className = "win98-window";

    win.style.position = "fixed";
    win.style.right = "20px";
    win.style.top = "60px";

    const title = document.createElement("div");
    title.className = "window-title";
    title.textContent = "Mandelbrot Explorer";

    const content = document.createElement("div");
    content.className = "window-content";

    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 220;

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save PNG";

    content.append(canvas, resetBtn, saveBtn);
    win.append(title, content);

    document.body.appendChild(win);

    makeDraggable(win, title);

    const ctx = canvas.getContext("2d");

    let zoom = 1;
    let panX = -2.5;
    let panY = -1;
    let maxIter = 100;

    function draw() {
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
                const val = iter === maxIter ? 0 : (iter * 255) / maxIter;

                data[idx] = val;
                data[idx + 1] = val;
                data[idx + 2] = val;
                data[idx + 3] = 255;
            }
        }

        ctx.putImageData(img, 0, 0);
    }

    draw();

    resetBtn.onclick = () => {
        zoom = 1;
        panX = -2.5;
        panY = -1;
        draw();
    };

    saveBtn.onclick = () => {
        const a = document.createElement("a");
        a.download = "mandelbrot.png";
        a.href = canvas.toDataURL();
        a.click();
    };

    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();

        // smoother zoom control
        const factor = e.deltaY > 0 ? 1.08 : 0.92;
        zoom *= factor;

        draw();
    }, { passive: false });
}

// ============================================================
// LORENZ ATTRACTOR (ONLY ONE VERSION)
// ============================================================

function initLorenzAttractor() {
    const canvas = document.getElementById("lorenzCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const w = canvas.width;
    const h = canvas.height;

    let sigma = 10, rho = 28, beta = 8 / 3;
    let x = 0.1, y = 0, z = 0;

    const dt = 0.01;
    let points = [];

    function step() {
        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;

        x += dx * dt;
        y += dy * dt;
        z += dz * dt;

        points.push([x, y, z]);
        if (points.length > 4000) points.shift();
    }

    function draw() {
        ctx.fillStyle = "#C0C0C0";
        ctx.fillRect(0, 0, w, h);

        ctx.beginPath();

        for (let i = 0; i < points.length; i++) {
            const px = w / 2 + points[i][0] * 6;
            const py = h / 2 - points[i][2] * 4;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }

        ctx.strokeStyle = "#000080";
        ctx.stroke();
    }

    function animate() {
        step();
        draw();
        requestAnimationFrame(animate);
    }

    animate();
}

// ============================================================
// OSCILLOSCOPE
// ============================================================

function initOscilloscope() {
    const canvas = document.getElementById("signalCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const w = canvas.width;
    const h = canvas.height;

    let t = 0;

    function draw() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "#00FF00";
        ctx.beginPath();

        for (let x = 0; x < w; x++) {
            const time = t + x * 0.02;

            const signal =
                Math.sin(time) +
                0.5 * Math.sin(3 * time) +
                0.2 * Math.sin(7 * time);

            const y = h / 2 + signal * 40;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.stroke();
        t += 0.05;

        requestAnimationFrame(draw);
    }

    draw();
}

// ============================================================
// MAIN INIT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    initDarkMode();
    initThreeJSCube();

    initLorenzAttractor();
    initOscilloscope();

    initInteractiveFractal();

    console.log(
        "%cRetro Lab Loaded",
        "background:#000080;color:#fff;padding:4px;"
    );
});
