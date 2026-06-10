// ============================================================
// GLOBAL CONFIG
// ============================================================

const CONFIG = {
    SCROLL_THRESHOLD: 200,
    LAZY_LOADING_ROOT_MARGIN: '0px 0px 200px 0px',
    VISIBILITY_TITLE: 'Come back!',
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

function makeDraggable(win, handle) {

    let offsetX, offsetY, isDown = false;

    handle.style.cursor = 'grab';

    handle.addEventListener('mousedown', (e) => {

        bringToFront(win);

        isDown = true;

        const rect = win.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        win.style.position = 'fixed';
        win.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
        isDown = false;
        win.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', (e) => {

        if (!isDown) return;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        newX = Math.max(0, Math.min(newX, window.innerWidth - win.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - win.offsetHeight));

        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;

    });
}

// ============================================================
// DARK MODE
// ============================================================

function initDarkMode() {

    const btn = document.getElementById('dark-mode-toggle');

    if (!btn) return;

    const update = (dark) => {
        btn.textContent = dark ? "☀ Light Mode" : "🌙 Dark Mode";
    }

    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        update(true);
    }

    btn.onclick = () => {

        document.body.classList.toggle('dark-mode');

        const dark = document.body.classList.contains('dark-mode');

        localStorage.setItem('darkMode', dark ? 'enabled' : 'disabled');

        update(dark);
    }
}

// ============================================================
// THREE JS CUBE
// ============================================================

function initThreeJSCube() {

    const avatar = document.getElementById("avatar-3d");
    if (!avatar || typeof THREE === 'undefined') return;

    const canvas = document.createElement("canvas");
    avatar.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha:true,
        antialias:true
    });

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        70,
        avatar.clientWidth / avatar.clientHeight,
        0.1,
        1000
    );

    camera.position.z = 3;

    const geometry = new THREE.BoxGeometry(1.2,1.2,1.2);
    const material = new THREE.MeshNormalMaterial();

    const cube = new THREE.Mesh(geometry,material);

    scene.add(cube);

    function render() {

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.015;

        renderer.setSize(
            avatar.clientWidth,
            avatar.clientHeight
        );

        renderer.render(scene,camera);
    }

    limitFPS(render);

}

// ============================================================
// MANDELBROT EXPLORER
// ============================================================

function initInteractiveFractal() {

    const win = document.createElement("div");
    win.className = "win98-window";

    win.style.position="fixed";
    win.style.right="20px";
    win.style.top="60px";

    const title = document.createElement("div");
    title.className="window-title";
    title.innerHTML="Mandelbrot Explorer";

    const content = document.createElement("div");
    content.className="window-content";

    const canvas = document.createElement("canvas");
    canvas.width=320;
    canvas.height=220;

    content.appendChild(canvas);

    const resetBtn = document.createElement("button");
    resetBtn.textContent="Reset";

    const saveBtn = document.createElement("button");
    saveBtn.textContent="Save PNG";

    content.appendChild(resetBtn);
    content.appendChild(saveBtn);

    win.appendChild(title);
    win.appendChild(content);

    document.body.appendChild(win);

    makeDraggable(win,title);

    const ctx = canvas.getContext("2d");

    let zoom=1;
    let panX=-2.5;
    let panY=-1;
    let maxIter=100;

    function draw(){

        const w=canvas.width;
        const h=canvas.height;

        const img=ctx.createImageData(w,h);
        const data=img.data;

        for(let px=0;px<w;px++){

            for(let py=0;py<h;py++){

                let x0 = panX + (px/w)*3.5*zoom;
                let y0 = panY + (py/h)*2.0*zoom;

                let x=0,y=0,iter=0;

                while(x*x+y*y<=4 && iter<maxIter){

                    const xt = x*x-y*y+x0;
                    y = 2*x*y+y0;
                    x = xt;

                    iter++;
                }

                const idx=(py*w+px)*4;

                const val=iter===maxIter?0:(iter*255/maxIter);

                data[idx]=val;
                data[idx+1]=val;
                data[idx+2]=val;
                data[idx+3]=255;
            }
        }

        ctx.putImageData(img,0,0);
    }

    draw();

    resetBtn.onclick=()=>{
        zoom=1;
        panX=-2.5;
        panY=-1;
        draw();
    }

    saveBtn.onclick=()=>{
        const link=document.createElement("a");
        link.download="mandelbrot.png";
        link.href=canvas.toDataURL();
        link.click();
    }

    canvas.addEventListener("wheel",(e)=>{

        e.preventDefault();

        const scale = e.deltaY>0 ? 1.1 : 0.9;

        zoom*=scale;

        draw();

    });

}

// ============================================================
// CURVE ANIMATIONS
// ============================================================

function drawCurveAnimated(canvasId, drawFunc) {

    const c=document.getElementById(canvasId);
    if(!c) return;

    const ctx=c.getContext("2d");

    const w=300;
    const h=240;

    c.width=w;
    c.height=h;

    let t=0;

    function render(){

        ctx.fillStyle="#C0C0C0";
        ctx.fillRect(0,0,w,h);

        drawFunc(ctx,w,h,t);

        t+=0.05;
    }

    limitFPS(render);

}

// Lissajous

function drawLissajous(ctx,w,h,t){

    ctx.strokeStyle="#000080";
    ctx.beginPath();

    const A=3;
    const B=4;

    for(let a=0;a<Math.PI*2;a+=0.01){

        const x=w/2+Math.sin(A*a+t)*100;
        const y=h/2+Math.sin(B*a)*100;

        ctx.lineTo(x,y);
    }

    ctx.stroke();
}

// Rose

function drawRose(ctx,w,h,t){

    ctx.strokeStyle="purple";
    ctx.beginPath();

    const k=5;

    for(let a=0;a<Math.PI*2;a+=0.01){

        const r=100*Math.cos(k*a);

        const x=w/2+r*Math.cos(a+t*0.2);
        const y=h/2+r*Math.sin(a+t*0.2);

        ctx.lineTo(x,y);
    }

    ctx.stroke();
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

function initKeyboardShortcuts(){

    window.addEventListener("keydown",(e)=>{

        if(e.key==="t"){
            document.getElementById("dark-mode-toggle")?.click();
        }

        if(e.key==="p"){
            animationEnabled=!animationEnabled;
        }

        if(e.key==="s"){
            window.scrollTo({top:0,behavior:"smooth"});
        }

    });
}

// ============================================================
// UX
// ============================================================

function initVisibility(){

    const title=document.querySelector("title");

    if(!title) return;

    const original=title.textContent;

    document.addEventListener("visibilitychange",()=>{

        if(document.hidden){

            animationEnabled=false;
            title.textContent=CONFIG.VISIBILITY_TITLE;

        }else{

            animationEnabled=true;
            title.textContent=original;

        }

    });
}

// ============================================================
// MAIN
// ============================================================

document.addEventListener("DOMContentLoaded",()=>{

    initDarkMode();

    initThreeJSCube();

    initInteractiveFractal();

    drawCurveAnimated("lissajous-canvas",drawLissajous);
    drawCurveAnimated("rose-canvas",drawRose);

    initKeyboardShortcuts();

    initVisibility();

    console.log(
        "%cRetro Math Lab Loaded",
        "background:#000080;color:#fff;padding:4px;font-size:14px"
    );

});
