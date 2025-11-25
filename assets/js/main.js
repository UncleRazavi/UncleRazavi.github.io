// =============================
// PARTICLES CONFIG
// =============================
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
particlesJS('particles-js', particleConfig);

// =============================
// CREATE FRACTAL WINDOW
// =============================
const fractalWindow = document.createElement('div');
fractalWindow.className = 'win98-window';
fractalWindow.style.top = '50px';
fractalWindow.style.left = '50px';
fractalWindow.id = 'win-fractal';

// Title bar
const title = document.createElement('div');
title.className = 'win98-title';
title.textContent = 'Fractal (Mandelbrot)';

const closeBtn = document.createElement('div');
closeBtn.className = 'win98-close';
closeBtn.textContent = 'X';
closeBtn.onclick = () => fractalWindow.style.display = 'none';
title.appendChild(closeBtn);
fractalWindow.appendChild(title);

// Content
const content = document.createElement('div');
content.className = 'win98-content';
fractalWindow.appendChild(content);

document.body.appendChild(fractalWindow);
makeDraggable(fractalWindow, title);

// =============================
// DRAG FUNCTION
// =============================
function makeDraggable(win, handle) {
    let offsetX, offsetY, isDown = false;

    handle.addEventListener('mousedown', (e) => {
        isDown = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        win.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => { isDown = false; win.style.cursor = 'grab'; });
    document.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        win.style.left = `${e.clientX - offsetX}px`;
        win.style.top = `${e.clientY - offsetY}px`;
    });
}

// =============================
// FRACTAL (Mandelbrot)
// =============================
function initFractal(container) {
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    const maxIter = 50;

    for(let px=0; px<width; px++) {
        for(let py=0; py<height; py++){
            let x0 = (px-width/2)*4/width;
            let y0 = (py-height/2)*4/height;
            let x=0, y=0, iter=0;
            while(x*x+y*y<4 && iter<maxIter){
                let xt=x*x-y*y+x0;
                y=2*x*y+y0; x=xt;
                iter++;
            }
            const color = iter===maxIter?0:255-iter*5;
            ctx.fillStyle=`rgb(${color},${color},${color})`;
            ctx.fillRect(px,py,1,1);
        }
    }
}

initFractal(content);
