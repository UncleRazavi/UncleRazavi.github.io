// =============================
// PARTICLES CONFIG (No Change - works well)
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
// UTILITY: DRAG FUNCTION
// =============================
function makeDraggable(win, handle) {
    let offsetX, offsetY, isDown = false;
    // Set initial cursor style
    win.style.cursor = 'grab';

    handle.addEventListener('mousedown', (e) => {
        // Prevent accidental text selection while dragging
        e.preventDefault(); 
        isDown = true;
        // Calculate the offset from the click point to the window's top-left corner
        offsetX = e.clientX - win.getBoundingClientRect().left;
        offsetY = e.clientY - win.getBoundingClientRect().top;
        win.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => { 
        if (isDown) { // Only change cursor if it was dragging
             win.style.cursor = 'grab';
        }
        isDown = false; 
    });
    
    document.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        
        // Calculate new position
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Apply new position (prevent window from moving off-screen entirely)
        newX = Math.max(0, Math.min(newX, window.innerWidth - win.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - win.offsetHeight));
        
        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;
    });
}

// =============================
// WINDOW CREATION: FRACTAL
// =============================
const fractalWindow = document.createElement('div');
// Use a class to style the window as a win98-like component
fractalWindow.className = 'win98-window'; 
// Set initial position - check if user is on a small screen
const initialX = window.innerWidth > 768 ? '50px' : '5%';
const initialY = window.innerWidth > 768 ? '50px' : '50px';
fractalWindow.style.top = initialY;
fractalWindow.style.left = initialX;
fractalWindow.id = 'win-fractal';

// Title bar
const title = document.createElement('div');
title.className = 'win98-title';
title.textContent = 'Fractal (Mandelbrot) - Interactive';

const closeBtn = document.createElement('div');
closeBtn.className = 'win98-close';
closeBtn.textContent = 'X';
closeBtn.setAttribute('aria-label', 'Close Fractal Window'); // Accessibility
closeBtn.onclick = () => fractalWindow.style.display = 'none';

title.appendChild(closeBtn);
fractalWindow.appendChild(title);

// Content
const content = document.createElement('div');
content.className = 'win98-content';
fractalWindow.appendChild(content);

document.body.appendChild(fractalWindow);
// Make the window draggable by its title bar
makeDraggable(fractalWindow, title); 

// =============================
// ENHANCED MANDELBROT FRACTAL - Interactive
// =============================
function initFractal(container) {
    const canvas = document.createElement('canvas');
    // Ensure canvas size is based on the content container
    canvas.width = container.clientWidth; 
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let zoom = 1;
    let panX = -2.5;
    let panY = -1;
    const maxIter = 100;
    
    function drawMandelbrot() {
        const width = canvas.width;
        const height = canvas.height;
        
        const imgData = ctx.createImageData(width, height);
        const data = imgData.data;

        for(let px=0; px<width; px++) {
            for(let py=0; py<height; py++){
                // Map pixel coordinates to the complex plane with pan and zoom
                let x0 = panX + (px / width) * 3.5 * zoom; 
                let y0 = panY + (py / height) * 2.0 * zoom; 
                
                let x=0, y=0, iter=0;
                while(x*x + y*y < 4 && iter < maxIter){
                    let xt = x*x - y*y + x0;
                    y = 2*x*y + y0; 
                    x = xt;
                    iter++;
                }
                
                // Color based on iteration count with gradient
                let colorValue = iter === maxIter ? 0 : (iter * 255 / maxIter);
                
                const index = (py * width + px) * 4;
                data[index] = colorValue;     // Red
                data[index + 1] = colorValue * 0.7; // Green
                data[index + 2] = colorValue * 0.5; // Blue
                data[index + 3] = 255;        // Alpha
            }
        }
        
        ctx.putImageData(imgData, 0, 0);
    }
    
    drawMandelbrot();
    
    // Mouse wheel zoom
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 1.2 : 0.8;
        zoom *= zoomFactor;
        drawMandelbrot();
    });
    
    // Click to pan
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        panX += (x / canvas.width - 0.5) * 3.5 * zoom;
        panY += (y / canvas.height - 0.5) * 2.0 * zoom;
        zoom *= 0.5;
        
        drawMandelbrot();
    });
}

initFractal(content);

// =============================
// SCROLL-TO-TOP BUTTON
// =============================
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.id = 'scroll-to-top';
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// =============================
// TYPEWRITER EFFECT FOR HERO TITLE
// =============================
function initTypewriter() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.classList.add('typewriter');
    
    let index = 0;
    const speed = 60; // milliseconds per character
    
    function type() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing completes
            setTimeout(() => {
                heroTitle.classList.remove('typewriter');
            }, 1000);
        }
    }
    
    type();
}

// Initialize typewriter when page loads
document.addEventListener('DOMContentLoaded', initTypewriter);

// =============================
// SMOOTH SCROLL BEHAVIOR
// =============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// =============================
// KEYBOARD SHORTCUTS
// =============================
document.addEventListener('keydown', (e) => {
    // Alt + D: Toggle dark mode
    if (e.altKey && e.key.toLowerCase() === 'd') {
        document.getElementById('dark-mode-toggle').click();
    }
    // Alt + T: Scroll to top
    if (e.altKey && e.key.toLowerCase() === 't') {
        scrollToTopBtn.click();
    }
    // Alt + H: Go home
    if (e.altKey && e.key.toLowerCase() === 'h') {
        window.location.href = '/';
    }
});

// =============================
// ENHANCED CARD ANIMATIONS
// =============================
function enhanceCardAnimations() {
    const cards = document.querySelectorAll('.project-card, .post-card');
    
    cards.forEach((card, index) => {
        // Add staggered fade-in animation
        card.style.opacity = '0';
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
        
        // Add scale effect on hover
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

// Add fadeInUp animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', enhanceCardAnimations);

// =============================
// VISIT COUNTER (Local Storage)
// =============================
function initVisitCounter() {
    let visitCount = localStorage.getItem('visitCount');
    visitCount = visitCount ? parseInt(visitCount) + 1 : 1;
    localStorage.setItem('visitCount', visitCount);
    
    // Optional: Display counter in console
    console.log(`%c👋 Welcome! You've visited ${visitCount} time(s)`, 'font-size: 14px; color: #000080; font-weight: bold;');
}

document.addEventListener('DOMContentLoaded', initVisitCounter);

// =============================
// PAGE VISIBILITY DETECTION
// =============================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = '👋 Come back!';
    } else {
        document.title = document.querySelector('title').getAttribute('data-original') || 'Hossein Razavi';
    }
});

// Store original title
if (document.querySelector('title')) {
    document.querySelector('title').setAttribute('data-original', document.title);
}

// =============================
// LAZY IMAGE LOADING
// =============================
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

document.addEventListener('DOMContentLoaded', initLazyLoading);

// =============================
// FLOATING ACTION MENU
// =============================
function initFloatingMenu() {
    const fabButton = document.createElement('button');
    fabButton.id = 'fab-menu-toggle';
    fabButton.textContent = '⚙';
    fabButton.setAttribute('aria-label', 'Settings Menu');
    fabButton.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: var(--border-light);
        border: 2px outset var(--border-light);
        border-right-color: var(--border-dark);
        border-bottom-color: var(--border-dark);
        cursor: pointer;
        z-index: 998;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    `;
    
    fabButton.addEventListener('click', () => {
        alert('⚙️ Settings:\n\n• Alt + D: Toggle Dark Mode\n• Alt + T: Scroll to Top\n• Alt + H: Go Home\n\n💡 You can also drag the Fractal window!');
    });
    
    fabButton.addEventListener('mouseover', () => {
        fabButton.style.transform = 'scale(1.1)';
    });
    
    fabButton.addEventListener('mouseout', () => {
        fabButton.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(fabButton);
}

document.addEventListener('DOMContentLoaded', initFloatingMenu);

// =============================
// DARK MODE TOGGLE (Enhanced)
// =============================
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

function updateDarkMode(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        // Update particles color in dark mode
        particlesJS('particles-js', {
            ...particleConfig, 
            particles: {
                ...particleConfig.particles, 
                color: { value: "#00ff00" }, // Neon Green
                line_linked: { ...particleConfig.particles.line_linked, color: "#00ff00" }
            }
        });
        darkModeToggle.textContent = '☀'; // Sun icon
        localStorage.setItem('darkMode', 'true');
    } else {
        body.classList.remove('dark-mode');
        // Reset particles color to light mode (white)
        particlesJS('particles-js', {
            ...particleConfig, 
            particles: {
                ...particleConfig.particles, 
                color: { value: "#ffffff" },
                line_linked: { ...particleConfig.particles.line_linked, color: "#ffffff" }
            }
        });
        darkModeToggle.textContent = '☾'; // Moon icon
        localStorage.setItem('darkMode', 'false');
    }
}

// Initial check based on saved preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
    updateDarkMode(true);
} else {
    updateDarkMode(false);
}

// Event listener for toggle button
darkModeToggle.addEventListener('click', () => {
    updateDarkMode(!body.classList.contains('dark-mode'));
});

// =============================
// 3D OBJECTS WITH THREE.JS
// =============================
function init3DObject(containerId, objectType = 'cube') {
    const container = document.getElementById(containerId);
    if (!container || !window.THREE) return;
    
    // Remove any existing content
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    const width = container.clientWidth;
    const height = container.clientHeight || 400;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xc0c0c0, 1);
    container.appendChild(renderer.domElement);
    
    // Handle dark mode
    if (document.body.classList.contains('dark-mode')) {
        renderer.setClearColor(0x111111, 1);
    }
    
    // Create geometry based on type
    let geometry, material, mesh;
    
    switch(objectType) {
        case 'cube':
            geometry = new THREE.BoxGeometry(2, 2, 2);
            material = new THREE.MeshPhongMaterial({ color: 0x000080 });
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(1.5, 32, 32);
            material = new THREE.MeshPhongMaterial({ color: 0x1084d0 });
            break;
        case 'torus':
            geometry = new THREE.TorusGeometry(1, 0.4, 16, 32);
            material = new THREE.MeshPhongMaterial({ color: 0x00c000 });
            break;
        case 'octahedron':
            geometry = new THREE.OctahedronGeometry(1.5);
            material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
            break;
        case 'tetrahedron':
            geometry = new THREE.TetrahedronGeometry(2);
            material = new THREE.MeshPhongMaterial({ color: 0xff6600 });
            break;
        default:
            geometry = new THREE.BoxGeometry(2, 2, 2);
            material = new THREE.MeshPhongMaterial({ color: 0x000080 });
    }
    
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0xffffff, 0.4);
    light2.position.set(-5, -5, 5);
    scene.add(light2);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    camera.position.z = 5;
    
    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate based on mouse position
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.008;
        
        // Respond to mouse movement (subtle effect)
        mesh.rotation.y += mouseX * 0.01;
        mesh.rotation.x += mouseY * 0.01;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    const resizeHandler = () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight || 400;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', resizeHandler);
}

// =============================
// INTERACTIVE MATHEMATICAL OBJECTS
// =============================

// Lissajous Curve
function drawLissajousCurve(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#111111' : '#c0c0c0';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = document.body.classList.contains('dark-mode') ? '#00ff00' : '#000080';
    ctx.lineWidth = 2;
    
    const a = 3, b = 2, delta = Math.PI / 2;
    const points = [];
    
    for (let t = 0; t < 2 * Math.PI; t += 0.01) {
        const x = Math.sin(a * t + delta);
        const y = Math.sin(b * t);
        points.push({
            x: (x + 1) * width / 2,
            y: (y + 1) * height / 2
        });
    }
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
}

// Butterfly Curve
function drawButterflyCurve(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#111111' : '#c0c0c0';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = document.body.classList.contains('dark-mode') ? '#ff00ff' : '#000080';
    ctx.lineWidth = 1;
    
    const points = [];
    
    for (let t = 0; t < 12 * Math.PI; t += 0.01) {
        const r = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t);
        const x = Math.sin(t) * r;
        const y = Math.cos(t) * r;
        
        points.push({
            x: width / 2 + x * width / 20,
            y: height / 2 + y * height / 20
        });
    }
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
}

// Rose Curve
function drawRoseCurve(canvasId, k = 5) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#111111' : '#c0c0c0';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = document.body.classList.contains('dark-mode') ? '#00ff00' : '#1084d0';
    ctx.lineWidth = 2;
    
    const points = [];
    
    for (let theta = 0; theta < 2 * Math.PI; theta += 0.01) {
        const r = Math.cos(k * theta);
        if (r >= 0) {
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            points.push({
                x: width / 2 + x * width / 4,
                y: height / 2 + y * height / 4
            });
        }
    }
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
}

// Spirograph
function drawSpirograph(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#111111' : '#c0c0c0';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = document.body.classList.contains('dark-mode') ? '#00ff00' : '#ff6600';
    ctx.lineWidth = 1.5;
    
    const R = 80, r = 40, d = 50;
    const points = [];
    
    for (let theta = 0; theta < 2 * Math.PI * 5; theta += 0.01) {
        const x = (R + r) * Math.cos(theta) - d * Math.cos((R + r) / r * theta);
        const y = (R + r) * Math.sin(theta) - d * Math.sin((R + r) / r * theta);
        
        points.push({
            x: width / 2 + x,
            y: height / 2 + y
        });
    }
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
}

// Initialize all canvases on load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all mathematical objects
    const canvases = document.querySelectorAll('[data-math-object]');
    canvases.forEach(canvas => {
        const type = canvas.getAttribute('data-math-object');
        switch(type) {
            case 'lissajous':
                drawLissajousCurve(canvas.id);
                break;
            case 'butterfly':
                drawButterflyCurve(canvas.id);
                break;
            case 'rose':
                drawRoseCurve(canvas.id);
                break;
            case 'spirograph':
                drawSpirograph(canvas.id);
                break;
        }
    });
    
    // Initialize all 3D objects
    const containers = document.querySelectorAll('[data-3d-object]');
    containers.forEach(container => {
        const type = container.getAttribute('data-3d-object');
        init3DObject(container.id, type);
    });
});

// Redraw mathematical objects when dark mode changes
const observer = new MutationObserver(() => {
    const canvases = document.querySelectorAll('[data-math-object]');
    canvases.forEach(canvas => {
        const type = canvas.getAttribute('data-math-object');
        switch(type) {
            case 'lissajous':
                drawLissajousCurve(canvas.id);
                break;
            case 'butterfly':
                drawButterflyCurve(canvas.id);
                break;
            case 'rose':
                drawRoseCurve(canvas.id);
                break;
            case 'spirograph':
                drawSpirograph(canvas.id);
                break;
        }
    });
});

observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
