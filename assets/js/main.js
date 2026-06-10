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

    const btn = document.getElementById("dark-mode-toggle");
    if (!btn) return;

    const root = document.documentElement;

    const update = () => {
        const dark = root.classList.contains("dark-mode");
        btn.textContent = dark ? "☀ Light Mode" : "🌙 Dark Mode";
        btn.setAttribute("aria-pressed", dark);
    };

    update();

    btn.addEventListener("click", () => {

        root.classList.toggle("dark-mode");

        const dark = root.classList.contains("dark-mode");

        localStorage.setItem("darkMode", dark ? "enabled" : "disabled");

        update();
    });
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
function initLorenzAttractor(){

const canvas = document.getElementById("lorenzCanvas");
if(!canvas) return;

const ctx = canvas.getContext("2d");

const w = canvas.width;
const h = canvas.height;

let sigma = 10;
let rho = 28;
let beta = 8/3;

let x = 0.1;
let y = 0;
let z = 0;

const dt = 0.01;

let points = [];

function step(){

const dx = sigma * (y - x);
const dy = x * (rho - z) - y;
const dz = x * y - beta * z;

x += dx * dt;
y += dy * dt;
z += dz * dt;

points.push([x,y,z]);

if(points.length > 5000)
points.shift();

}

function draw(){

ctx.fillStyle = "#C0C0C0";
ctx.fillRect(0,0,w,h);

ctx.beginPath();

for(let i=0;i<points.length;i++){

const px = w/2 + points[i][0]*6;
const py = h/2 - points[i][2]*4;

if(i===0)
ctx.moveTo(px,py);
else
ctx.lineTo(px,py);

}

ctx.strokeStyle = "#000080";
ctx.lineWidth = 1.2;

ctx.stroke();

}

function animate(){

step();
draw();

requestAnimationFrame(animate);

}

animate();

}
function initOscilloscope(){

const canvas = document.getElementById("signalCanvas");
if(!canvas) return;

const ctx = canvas.getContext("2d");

const w = canvas.width;
const h = canvas.height;

let t = 0;

function draw(){

ctx.fillStyle = "#000";
ctx.fillRect(0,0,w,h);

ctx.strokeStyle = "#00FF00";
ctx.lineWidth = 2;

ctx.beginPath();

for(let x=0; x<w; x++){

const time = t + x * 0.02;

const signal =
Math.sin(time) +
0.5*Math.sin(3*time) +
0.2*Math.sin(7*time);

const y = h/2 + signal*40;

if(x===0)
ctx.moveTo(x,y);
else
ctx.lineTo(x,y);

}

ctx.stroke();

t += 0.05;

requestAnimationFrame(draw);

}

draw();

}
function initDSPLab(){

const scope = document.getElementById("scopeCanvas");
const fftCanvas = document.getElementById("fftCanvas");

if(!scope || !fftCanvas) return;

const sctx = scope.getContext("2d");
const fctx = fftCanvas.getContext("2d");

const w = scope.width;
const h = scope.height;

let t = 0;

const N = 256;

const freqSlider = document.getElementById("freqSlider");
const noiseSlider = document.getElementById("noiseSlider");
const filterSlider = document.getElementById("filterSlider");


function bandpass(signal, center){

let out = [];

for(let i=0;i<signal.length;i++){

const w = Math.sin(i*0.1*center);

out[i] = signal[i]*w;

}

return out;

}


function fft(signal){

const N = signal.length;

let re = new Array(N).fill(0);
let im = new Array(N).fill(0);

for(let k=0;k<N;k++){

for(let n=0;n<N;n++){

const angle = (2*Math.PI*k*n)/N;

re[k] += signal[n]*Math.cos(angle);
im[k] -= signal[n]*Math.sin(angle);

}

}

let mag = [];

for(let i=0;i<N/2;i++){

mag[i] = Math.sqrt(re[i]*re[i]+im[i]*im[i]);

}

return mag;

}


function draw(){

let signal = [];

const freq = parseFloat(freqSlider.value);
const noiseLevel = parseFloat(noiseSlider.value);
const filterCenter = parseFloat(filterSlider.value);

for(let i=0;i<N;i++){

const time = (i/N)*Math.PI*4 + t;

let s = Math.sin(freq*time);

s += noiseLevel*(Math.random()*2-1);

signal.push(s);

}

signal = bandpass(signal,filterCenter);


sctx.fillStyle="black";
sctx.fillRect(0,0,w,h);

sctx.strokeStyle="#00FF00";
sctx.beginPath();

for(let i=0;i<N;i++){

const x = (i/N)*w;
const y = h/2 + signal[i]*40;

if(i===0) sctx.moveTo(x,y);
else sctx.lineTo(x,y);

}

sctx.stroke();


const spectrum = fft(signal);

fctx.fillStyle="black";
fctx.fillRect(0,0,w,h);

fctx.fillStyle="#00FFFF";

for(let i=0;i<spectrum.length;i++){

const x = (i/spectrum.length)*w;
const y = spectrum[i]*0.1;

fctx.fillRect(x,h-y,2,y);

}

t += 0.05;

requestAnimationFrame(draw);

}

draw();

}
function fft(signal){

const N = signal.length;

if(N<=1) return signal;

const even = fft(signal.filter((_,i)=>i%2===0));
const odd = fft(signal.filter((_,i)=>i%2===1));

const T = [];

for(let k=0;k<N/2;k++){

const angle = -2*Math.PI*k/N;

const exp = {
re:Math.cos(angle),
im:Math.sin(angle)
};

T[k]={
re:exp.re*odd[k].re-exp.im*odd[k].im,
im:exp.re*odd[k].im+exp.im*odd[k].re
};

}

let out = new Array(N);

for(let k=0;k<N/2;k++){

out[k]={
re:even[k].re+T[k].re,
im:even[k].im+T[k].im
};

out[k+N/2]={
re:even[k].re-T[k].re,
im:even[k].im-T[k].im
};

}

return out;

}
async function initMicFFT(){

const canvas=document.getElementById("micFFT");
if(!canvas) return;

const ctx=canvas.getContext("2d");

const stream = await navigator.mediaDevices.getUserMedia({audio:true});

const audioCtx = new AudioContext();

const source = audioCtx.createMediaStreamSource(stream);

const analyser = audioCtx.createAnalyser();

analyser.fftSize=1024;

source.connect(analyser);

const data = new Uint8Array(analyser.frequencyBinCount);

function draw(){

analyser.getByteFrequencyData(data);

ctx.fillStyle="black";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="#00ffcc";

for(let i=0;i<data.length;i++){

const x=i*2;
const y=data[i];

ctx.fillRect(x,canvas.height-y,2,y);

}

requestAnimationFrame(draw);

}

draw();

}
function initSpectrogram(){

const canvas=document.getElementById("spectrogram");
if(!canvas) return;

const ctx=canvas.getContext("2d");

let x=0;

return function update(data){

ctx.drawImage(canvas,-1,0);

for(let i=0;i<data.length;i++){

const value=data[i];

ctx.fillStyle=`hsl(${value},100%,50%)`;

ctx.fillRect(canvas.width-1,canvas.height-i,1,1);

}

}

}
function drawBode(){

const canvas=document.getElementById("bodeCanvas");
if(!canvas) return;

const ctx=canvas.getContext("2d");

const cutoff=document.getElementById("cutoffSlider").value;
const type=document.getElementById("filterType").value;

ctx.fillStyle="#000";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.strokeStyle="#00ffff";
ctx.beginPath();

for(let i=1;i<200;i++){

const w=i/10;

let mag;

if(type==="lowpass")
mag=1/Math.sqrt(1+(w/cutoff)**2);
else
mag=(w/cutoff)/Math.sqrt(1+(w/cutoff)**2);

const x=i*2;
const y=canvas.height-(mag*150);

if(i===1) ctx.moveTo(x,y);
else ctx.lineTo(x,y);

}

ctx.stroke();

}

document.getElementById("cutoffSlider").oninput = drawBode;
document.getElementById("filterType").onchange = drawBode;


// ============================================================
// MAIN
// ============================================================

document.addEventListener("DOMContentLoaded",()=>{

    initDSPLab();
    initMicFFT();
    initSpectrogram();
    drawBode();

    initLorenzAttractor();
    initOscilloscope();

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
