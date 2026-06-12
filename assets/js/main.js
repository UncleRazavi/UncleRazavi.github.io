// ============================================================
// Hossein Razavi Portfolio
// Main JavaScript
// ============================================================

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
// Dark Mode
// ============================================================

function initDarkMode() {
    const btn = document.getElementById("dark-mode-toggle");

    if (!btn) return;

    const savedMode = localStorage.getItem("darkMode");

    if (savedMode === "enabled") {
        document.body.classList.add("dark-mode");
    }

    btn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        localStorage.setItem(
            "darkMode",
            document.body.classList.contains("dark-mode")
                ? "enabled"
                : "disabled"
        );
    });
}

// ============================================================
// Three.js Avatar Cube
// ============================================================

function initThreeJSCube() {
    const container = document.getElementById("avatar-3d");

    if (!container) return;
    if (typeof THREE === "undefined") return;

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

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();

    const material = new THREE.MeshNormalMaterial();

    const cube = new THREE.Mesh(
        geometry,
        material
    );

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
// Signal Oscilloscope
// ============================================================

function initOscilloscope() {
    const canvas = document.getElementById("signalCanvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let t = 0;

    function draw() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x++) {
            const signal =
                Math.sin(t + x * 0.03) +
                0.5 * Math.sin(3 * (t + x * 0.03));

            const y =
                canvas.height / 2 +
                signal * 35;

            if (x === 0)
                ctx.moveTo(x, y);
            else
                ctx.lineTo(x, y);
        }

        ctx.stroke();

        t += 0.05;
    }

    limitFPS(draw);
}

// ============================================================
// Lorenz Attractor
// ============================================================

function initLorenzAttractor() {
    const canvas = document.getElementById("lorenzCanvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let x = 0.1;
    let y = 0;
    let z = 0;

    const sigma = 10;
    const rho = 28;
    const beta = 8 / 3;

    const points = [];

    function step() {
        const dt = 0.01;

        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;

        x += dx * dt;
        y += dy * dt;
        z += dz * dt;

        points.push([x, z]);

        if (points.length > 2500) {
            points.shift();
        }
    }

    function draw() {
        step();

        ctx.fillStyle = "#d0d0d0";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.beginPath();

        points.forEach((p, i) => {
            const px =
                canvas.width / 2 + p[0] * 6;

            const py =
                canvas.height / 2 - p[1] * 4;

            if (i === 0)
                ctx.moveTo(px, py);
            else
                ctx.lineTo(px, py);
        });

        ctx.strokeStyle = "#000080";
        ctx.stroke();
    }

    limitFPS(draw);
}

// ============================================================
// DSP LAB
// ============================================================

function initDSPLab() {
    const scopeCanvas =
        document.getElementById("scopeCanvas");

    const fftCanvas =
        document.getElementById("fftCanvas");

    const freqSlider =
        document.getElementById("freqSlider");

    const noiseSlider =
        document.getElementById("noiseSlider");

    if (
        !scopeCanvas ||
        !fftCanvas ||
        !freqSlider ||
        !noiseSlider
    )
        return;

    const sctx =
        scopeCanvas.getContext("2d");

    const fctx =
        fftCanvas.getContext("2d");

    let t = 0;

    function draw() {
        const freq =
            Number(freqSlider.value);

        const noise =
            Number(noiseSlider.value) / 100;

        sctx.clearRect(
            0,
            0,
            scopeCanvas.width,
            scopeCanvas.height
        );

        const samples = [];

        sctx.beginPath();

        for (
            let i = 0;
            i < scopeCanvas.width;
            i++
        ) {
            const value =
                Math.sin(
                    freq * (i / 100 + t)
                ) +
                (Math.random() - 0.5) *
                    noise;

            samples.push(value);

            const y =
                scopeCanvas.height / 2 +
                value * 40;

            if (i === 0)
                sctx.moveTo(i, y);
            else
                sctx.lineTo(i, y);
        }

        sctx.stroke();

        fctx.clearRect(
            0,
            0,
            fftCanvas.width,
            fftCanvas.height
        );

        for (let k = 0; k < 60; k++) {
            let re = 0;
            let im = 0;

            for (
                let n = 0;
                n < samples.length;
                n++
            ) {
                const angle =
                    (2 *
                        Math.PI *
                        k *
                        n) /
                    samples.length;

                re +=
                    samples[n] *
                    Math.cos(angle);

                im -=
                    samples[n] *
                    Math.sin(angle);
            }

            const magnitude =
                Math.sqrt(
                    re * re + im * im
                ) / 50;

            fctx.fillRect(
                k * 8,
                fftCanvas.height -
                    magnitude,
                6,
                magnitude
            );
        }

        t += 0.01;
    }

    limitFPS(draw);
}

// ============================================================
// Microphone FFT
// ============================================================

async function initMicFFT() {
    const canvas =
        document.getElementById("micFFT");

    if (!canvas) return;

    try {
        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        const audioCtx =
            new AudioContext();

        const analyser =
            audioCtx.createAnalyser();

        analyser.fftSize = 256;

        const source =
            audioCtx.createMediaStreamSource(
                stream
            );

        source.connect(analyser);

        const buffer =
            new Uint8Array(
                analyser.frequencyBinCount
            );

        const ctx =
            canvas.getContext("2d");

        function draw() {
            analyser.getByteFrequencyData(
                buffer
            );

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            buffer.forEach((v, i) => {
                ctx.fillRect(
                    i * 4,
                    canvas.height - v / 2,
                    3,
                    v / 2
                );
            });

            requestAnimationFrame(draw);
        }

        draw();
    } catch (err) {
        console.log(
            "Microphone permission denied."
        );
    }
}

// ============================================================
// Spectrogram
// ============================================================

function initSpectrogram() {
    const canvas =
        document.getElementById(
            "spectrogram"
        );

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    limitFPS(() => {
        const image =
            ctx.getImageData(
                1,
                0,
                canvas.width - 1,
                canvas.height
            );

        ctx.putImageData(image, 0, 0);

        for (
            let y = 0;
            y < canvas.height;
            y++
        ) {
            const value = Math.floor(
                255 *
                    Math.abs(
                        Math.sin(
                            Date.now() /
                                1000 +
                                y / 30
                        )
                    )
            );

            ctx.fillStyle =
                `rgb(${value},${value},0)`;

            ctx.fillRect(
                canvas.width - 1,
                y,
                1,
                1
            );
        }
    });
}

// ============================================================
// Scroll Top
// ============================================================

function initScrollTop() {
    const btn =
        document.getElementById(
            "scrollTopBtn"
        );

    if (!btn) return;

    window.addEventListener(
        "scroll",
        () => {
            btn.style.display =
                window.scrollY > 300
                    ? "block"
                    : "none";
        }
    );

    btn.addEventListener(
        "click",
        () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}

// ============================================================
// Particles.js
// ============================================================

function initParticles() {
    if (
        typeof particlesJS === "undefined"
    )
        return;

    particlesJS("particles-js", {
        particles: {
            number: {
                value: 60
            },
            color: {
                value: "#0080ff"
            },
            line_linked: {
                enable: true,
                opacity: 0.3
            },
            move: {
                speed: 1.5
            }
        }
    });
}

// ============================================================
// Initialize Everything
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {
        updateClock();
        initTypewriter();
        initDarkMode();

        initParticles();

        initThreeJSCube();

        initOscilloscope();
        initLorenzAttractor();

        initDSPLab();

        initMicFFT();
        initSpectrogram();

        initScrollTop();

        console.log(
            "Hossein Razavi Portfolio Loaded"
        );
    }
);


// Accessibility improvement for dark mode toggle
const darkToggle = document.getElementById('dark-mode-toggle');
if (darkToggle) {
  darkToggle.setAttribute('aria-pressed', document.body.classList.contains('dark-mode'));
  darkToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    darkToggle.setAttribute('aria-pressed', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}


// Basic filter functionality
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

document.addEventListener('DOMContentLoaded', () => {
  setupFilter('projectFilter', '.project-card');
  setupFilter('blogFilter', 'article');
});
