from pathlib import Path

js = r"""
// ============================================================
// Hossein Razavi Portfolio - Complete main.js
// ============================================================

const CONFIG = {
    MAX_FPS: 60
};

let animationEnabled = true;

// ------------------------------------------------------------
// Utilities
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// Clock
// ------------------------------------------------------------

function updateClock() {
    const el = document.getElementById("clock");
    if (!el) return;

    const tick = () => {
        const d = new Date();
        el.textContent =
            String(d.getHours()).padStart(2, "0") +
            ":" +
            String(d.getMinutes()).padStart(2, "0");
    };

    tick();
    setInterval(tick, 1000);
}

// ------------------------------------------------------------
// Typewriter
// ------------------------------------------------------------

function initTypewriter() {
    const el = document.getElementById("typewriter");
    if (!el) return;

    const text = el.textContent;
    el.textContent = "";

    let i = 0;

    function type() {
        if (i < text.length) {
            el.textContent += text[i++];
            setTimeout(type, 60);
        }
    }

    type();
}

// ------------------------------------------------------------
// Dark Mode
// ------------------------------------------------------------

function initDarkMode() {
    const btn = document.getElementById("dark-mode-toggle");
    if (!btn) return;

    const saved = localStorage.getItem("darkMode");

    if (saved === "enabled") {
        document.body.classList.add("dark-mode");
    }

    btn.style.display = "block";

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

// ------------------------------------------------------------
// ThreeJS Avatar
// ------------------------------------------------------------

function initThreeJSCube() {
    const avatar = document.getElementById("avatar-3d");

    if (!avatar || typeof THREE === "undefined") return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        70,
        avatar.clientWidth / avatar.clientHeight,
        0.1,
        1000
    );

    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(
        avatar.clientWidth,
        avatar.clientHeight
    );

    avatar.appendChild(renderer.domElement);

    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshNormalMaterial()
    );

    scene.add(cube);

    limitFPS(() => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.015;
        renderer.render(scene, camera);
    });
}

// ------------------------------------------------------------
// Oscilloscope
// ------------------------------------------------------------

function initOscilloscope() {
    const canvas = document.getElementById("signalCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let t = 0;

    function draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.strokeStyle = "#00ff00";
        ctx.beginPath();

        for(let x=0;x<canvas.width;x++) {
            const v =
                Math.sin(t+x*0.03)+
                0.5*Math.sin(3*(t+x*0.03));

            const y = canvas.height/2 + v*30;

            if(x===0) ctx.moveTo(x,y);
            else ctx.lineTo(x,y);
        }

        ctx.stroke();
        t += 0.05;
    }

    limitFPS(draw);
}

// ------------------------------------------------------------
// Lorenz
// ------------------------------------------------------------

function initLorenzAttractor() {
    const canvas = document.getElementById("lorenzCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let x=0.1,y=0,z=0;

    const sigma=10,rho=28,beta=8/3;
    const pts=[];

    function step(){
        const dt=0.01;

        const dx=sigma*(y-x);
        const dy=x*(rho-z)-y;
        const dz=x*y-beta*z;

        x+=dx*dt;
        y+=dy*dt;
        z+=dz*dt;

        pts.push([x,z]);

        if(pts.length>3000) pts.shift();
    }

    function draw(){
        step();

        ctx.fillStyle="#c0c0c0";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.beginPath();

        pts.forEach((p,i)=>{
            const px=canvas.width/2+p[0]*6;
            const py=canvas.height/2-p[1]*4;

            if(i===0) ctx.moveTo(px,py);
            else ctx.lineTo(px,py);
        });

        ctx.strokeStyle="#000080";
        ctx.stroke();
    }

    limitFPS(draw);
}

// ------------------------------------------------------------
// DSP LAB
// ------------------------------------------------------------

function initDSPLab() {
    const scope=document.getElementById("scopeCanvas");
    const fft=document.getElementById("fftCanvas");

    if(!scope || !fft) return;

    const sctx=scope.getContext("2d");
    const fctx=fft.getContext("2d");

    const freqSlider=document.getElementById("freqSlider");
    const noiseSlider=document.getElementById("noiseSlider");

    let t=0;

    function draw(){

        const freq=+freqSlider.value;
        const noise=+noiseSlider.value;

        sctx.clearRect(0,0,scope.width,scope.height);

        const samples=[];

        sctx.beginPath();

        for(let i=0;i<scope.width;i++){

            const v=
                Math.sin(freq*(i/50+t))
                +(Math.random()-0.5)*noise;

            samples.push(v);

            const y=scope.height/2+v*40;

            if(i===0) sctx.moveTo(i,y);
            else sctx.lineTo(i,y);
        }

        sctx.stroke();

        fctx.clearRect(0,0,fft.width,fft.height);

        for(let k=0;k<50;k++){

            let re=0,im=0;

            for(let n=0;n<samples.length;n++){
                const angle=(2*Math.PI*k*n)/samples.length;
                re+=samples[n]*Math.cos(angle);
                im-=samples[n]*Math.sin(angle);
            }

            const mag=Math.sqrt(re*re+im*im)/50;

            fctx.fillRect(
                k*6,
                fft.height-mag,
                4,
                mag
            );
        }

        t+=0.02;
    }

    limitFPS(draw);
}

// ------------------------------------------------------------
// Mic FFT
// ------------------------------------------------------------

async function initMicFFT() {
    const canvas=document.getElementById("micFFT");
    if(!canvas) return;

    try{

        const stream=await navigator.mediaDevices.getUserMedia({audio:true});

        const audioCtx=new AudioContext();
        const analyser=audioCtx.createAnalyser();

        const source=audioCtx.createMediaStreamSource(stream);

        source.connect(analyser);

        analyser.fftSize=256;

        const data=new Uint8Array(analyser.frequencyBinCount);

        const ctx=canvas.getContext("2d");

        function draw(){

            analyser.getByteFrequencyData(data);

            ctx.clearRect(0,0,canvas.width,canvas.height);

            data.forEach((v,i)=>{
                ctx.fillRect(
                    i*3,
                    canvas.height-v/2,
                    2,
                    v/2
                );
            });

            requestAnimationFrame(draw);
        }

        draw();

    }catch(e){
        console.log("Mic permission denied");
    }
}

// ------------------------------------------------------------
// Spectrogram
// ------------------------------------------------------------

function initSpectrogram(){
    const canvas=document.getElementById("spectrogram");
    if(!canvas) return;

    const ctx=canvas.getContext("2d");

    let x=0;

    limitFPS(()=>{

        const img=ctx.getImageData(1,0,canvas.width-1,canvas.height);

        ctx.putImageData(img,0,0);

        for(let y=0;y<canvas.height;y++){

            const v=Math.floor(
                255*Math.abs(
                    Math.sin(Date.now()/1000+y/30)
                )
            );

            ctx.fillStyle=`rgb(${v},${v},0)`;
            ctx.fillRect(canvas.width-1,y,1,1);
        }

        x++;
    });
}

// ------------------------------------------------------------
// Bode Plot
// ------------------------------------------------------------

function drawBode(){

    const canvas=document.getElementById("bodeCanvas");
    if(!canvas) return;

    const ctx=canvas.getContext("2d");

    const slider=document.getElementById("cutoffSlider");
    const type=document.getElementById("filterType");

    function render(){

        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.beginPath();

        for(let i=0;i<canvas.width;i++){

            const f=i+1;
            const fc=+slider.value;

            let gain;

            if(type.value==="lowpass"){
                gain=1/Math.sqrt(1+(f/fc)**2);
            }else{
                gain=(f/fc)/Math.sqrt(1+(f/fc)**2);
            }

            const y=canvas.height-gain*150;

            if(i===0) ctx.moveTo(i,y);
            else ctx.lineTo(i,y);
        }

        ctx.stroke();
    }

    slider.addEventListener("input",render);
    type.addEventListener("change",render);

    render();
}

// ------------------------------------------------------------
// Curves
// ------------------------------------------------------------

function curve(canvasId, fn){

    const c=document.getElementById(canvasId);
    if(!c) return;

    c.width=250;
    c.height=250;

    const ctx=c.getContext("2d");

    let t=0;

    limitFPS(()=>{

        ctx.clearRect(0,0,c.width,c.height);

        ctx.beginPath();

        for(let a=0;a<Math.PI*20;a+=0.05){

            const p=fn(a,t);

            const x=c.width/2+p.x;
            const y=c.height/2+p.y;

            if(a===0) ctx.moveTo(x,y);
            else ctx.lineTo(x,y);
        }

        ctx.stroke();

        t+=0.01;
    });
}

function initCurves(){

    curve("lissajous-canvas",(a,t)=>({
        x:90*Math.sin(3*a+t),
        y:90*Math.sin(4*a)
    }));

    curve("rose-canvas",(a,t)=>({
        x:80*Math.cos(4*a+t)*Math.cos(a),
        y:80*Math.cos(4*a+t)*Math.sin(a)
    }));

    curve("butterfly-canvas",(a)=>({
        x:30*Math.sin(a)*(Math.exp(Math.cos(a))-2*Math.cos(4*a)),
        y:30*Math.cos(a)*(Math.exp(Math.cos(a))-2*Math.cos(4*a))
    }));

    curve("spirograph-canvas",(a,t)=>({
        x:80*Math.cos(a+t)+30*Math.cos(4*a),
        y:80*Math.sin(a+t)+30*Math.sin(4*a)
    }));
}

// ------------------------------------------------------------
// Mandelbrot
// ------------------------------------------------------------

function initMandelbrot(){

    const canvas=document.getElementById("fractalCanvas");
    if(!canvas) return;

    const ctx=canvas.getContext("2d");

    const img=ctx.createImageData(canvas.width,canvas.height);

    for(let px=0;px<canvas.width;px++){

        for(let py=0;py<canvas.height;py++){

            let x0=(px/canvas.width)*3.5-2.5;
            let y0=(py/canvas.height)*2-1;

            let x=0,y=0,iter=0;

            while(x*x+y*y<=4 && iter<80){

                const xt=x*x-y*y+x0;
                y=2*x*y+y0;
                x=xt;

                iter++;
            }

            const i=(py*canvas.width+px)*4;

            img.data[i]=iter*3;
            img.data[i+1]=iter*2;
            img.data[i+2]=iter*4;
            img.data[i+3]=255;
        }
    }

    ctx.putImageData(img,0,0);
}

// ------------------------------------------------------------
// Scroll
// ------------------------------------------------------------

function initScrollTop(){

    const btn=document.getElementById("scrollTopBtn");
    if(!btn) return;

    window.addEventListener("scroll",()=>{
        btn.style.display=window.scrollY>300?"block":"none";
    });

    btn.onclick=()=>window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

// ------------------------------------------------------------
// Init
// ------------------------------------------------------------

document.addEventListener("DOMContentLoaded",()=>{

    updateClock();
    initTypewriter();
    initDarkMode();

    initThreeJSCube();

    initOscilloscope();
    initLorenzAttractor();

    initDSPLab();
    initMicFFT();
    initSpectrogram();
    drawBode();

    initCurves();
    initMandelbrot();

    initScrollTop();

    console.log("Retro Engineering Portfolio Loaded");
});
"""

path = "/mnt/data/main.js"
Path(path).write_text(js, encoding="utf-8")

print(path)
