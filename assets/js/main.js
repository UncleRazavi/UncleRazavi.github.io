document.addEventListener("DOMContentLoaded", () => {

initDarkMode()
initClock()
initTypewriter()
initThreeAvatar()
initSignal()
initLorenz()
initWindows()

})

function initDarkMode() {

const btn = document.getElementById("dark-mode-toggle")
if(!btn) return

btn.addEventListener("click", () => {

document.body.classList.toggle("dark")

btn.textContent =
document.body.classList.contains("dark")
? "☀ Light Mode"
: "🌙 Dark Mode"

})

}

function initClock(){

const el = document.getElementById("clock")
if(!el) return

setInterval(()=>{

const now = new Date()
el.textContent = now.toLocaleTimeString()

},1000)

}

function initTypewriter(){

const el = document.getElementById("typewriter")
if(!el) return

const text = "Electrical Engineer | Signal Processing | RF"
let i = 0

function type(){

if(i < text.length){

el.textContent += text[i]
i++
setTimeout(type,60)

}

}

type()

}

function initThreeAvatar(){

const container = document.getElementById("avatar-3d")

if(!container || typeof THREE === "undefined") return

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
1,
0.1,
1000
)

const renderer = new THREE.WebGLRenderer({alpha:true})

renderer.setSize(200,200)
container.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry()

const material = new THREE.MeshNormalMaterial()

const cube = new THREE.Mesh(geometry,material)

scene.add(cube)

camera.position.z = 2

function animate(){

requestAnimationFrame(animate)

cube.rotation.x += 0.01
cube.rotation.y += 0.01

renderer.render(scene,camera)

}

animate()

}

function initSignal(){

const canvas = document.getElementById("signalCanvas")
if(!canvas) return

const ctx = canvas.getContext("2d")

let t = 0

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.beginPath()

for(let x=0;x<canvas.width;x++){

const y = 100 + 50*Math.sin((x+t)*0.05)

if(x===0) ctx.moveTo(x,y)
else ctx.lineTo(x,y)

}

ctx.stroke()

t += 2

requestAnimationFrame(draw)

}

draw()

}

function initLorenz(){

const canvas = document.getElementById("lorenzCanvas")
if(!canvas) return

const ctx = canvas.getContext("2d")

let x=0.1
let y=0
let z=0

const a=10
const b=28
const c=8/3

function step(){

let dt=0.01

let dx=a*(y-x)*dt
let dy=(x*(b-z)-y)*dt
let dz=(x*y-c*z)*dt

x+=dx
y+=dy
z+=dz

ctx.fillRect(
canvas.width/2 + x*5,
canvas.height/2 + y*5,
1,
1
)

requestAnimationFrame(step)

}

step()

}

function initWindows(){

document.querySelectorAll(".window-title")
.forEach(title => {

let win = title.parentElement

title.onmousedown = function(e){

let shiftX = e.clientX - win.getBoundingClientRect().left
let shiftY = e.clientY - win.getBoundingClientRect().top

function moveAt(pageX,pageY){

win.style.left = pageX - shiftX + 'px'
win.style.top = pageY - shiftY + 'px'

}

function onMouseMove(e){

moveAt(e.pageX,e.pageY)

}

document.addEventListener('mousemove',onMouseMove)

title.onmouseup = function(){

document.removeEventListener('mousemove',onMouseMove)
title.onmouseup = null

}

}

title.ondragstart = ()=>false

})

}
