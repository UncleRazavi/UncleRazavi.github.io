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
// CREATE DRAGGABLE WINDOWS
// =============================
const windowsData = [
    { id: 'avatar', title: '3D Avatar' },
    { id: 'fractal', title: 'Fractal (Mandelbrot)' },
    { id: 'fourier', title: 'Fourier Series' },
    { id: 'vector', title: 'Vector Field' }
];

windowsData.forEach((win, i) => {
    const w = document.createElement('div');
    w.className = 'win98-window';
    w.style.top = `${50 + i*30}px`;
    w.style.left = `${50 + i*30}px`;
    w.id = `win-${win.id}`;

    // Title bar
    const title = document.createElement('div');
    title.className = 'win98-title';
    title.textContent = win.title;

    const closeBtn = document.createElement('div');
    closeBtn.className = 'win98-close';
    closeBtn.textContent = 'X';
    closeBtn.onclick = () => w.style.display = 'none';
    title.appendChild(closeBtn);

    w.appendChild(title);

    // Content
    const content = document.createElement('div');
    content.className = 'win98-content';
    w.appendChild(content);

    document.body.appendChild(w);

    // Make window draggable
    makeDraggable(w, title);

    // Initialize each window content
    if(win.id === 'avatar') init3DAvatar(content);
    if(win.id === 'fractal') initFractal(content);
    if(win.id === 'fourier') initFourier(content);
    if(win.id === 'vector') initVectorField(content);
});

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
// 3D AVATAR
// =============================
let avatarModel, avatarScene;
function init3DAvatar(container) {
    avatarScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 1000);
    camera.position.z = 2.5;
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
    const pointLight = new THREE.PointLight(0xffffff,1.5); pointLight.position.set(5,5,5);
    avatarScene.add(ambientLight, pointLight);

    const geo = new THREE.DodecahedronGeometry(1);
    const mat = new THREE.MeshPhongMaterial({ color: 0x000080 });
    avatarModel = new THREE.Mesh(geo, mat);
    avatarScene.add(avatarModel);

    function animate() { requestAnimationFrame(animate); avatarModel.rotation.y+=0.005; renderer.render(avatarScene,camera);}
    animate();

    window.addEventListener('resize', ()=>{ camera.aspect=container.clientWidth/container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth,container.clientHeight); });
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

    function drawMandelbrot() {
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
    drawMandelbrot();
}

// =============================
// FOURIER SERIES PLOT
// =============================
function initFourier(container) {
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle='#0000FF';
        ctx.beginPath();
        const N=50;
        for(let i=0;i<canvas.width;i++){
            let x=i/canvas.width*2*Math.PI*2;
            let y=0;
            for(let k=1;k<=N;k+=2) y += (4/Math.PI)*(1/k)*Math.sin(k*x);
            y = canvas.height/2 - y*20;
            if(i===0) ctx.moveTo(i,y); else ctx.lineTo(i,y);
        }
        ctx.stroke();
        requestAnimationFrame(draw);
    }
    draw();
}

// =============================
// VECTOR FIELD
// =============================
function initVectorField(container) {
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function drawField() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle='#000000';
        for(let x=0;x<canvas.width;x+=20){
            for(let y=0;y<canvas.height;y+=20){
                const dx = Math.sin(y/20)*10;
                const dy = Math.cos(x/20)*10;
                ctx.beginPath();
                ctx.moveTo(x,y);
                ctx.lineTo(x+dx, y+dy);
                ctx.stroke();
            }
        }
        requestAnimationFrame(drawField);
    }
    drawField();
}
