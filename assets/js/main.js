const particleConfig = {
    "particles": {
      "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
      "color": { "value": "#ffffff" }, // White particles contrast well with the grey/dark theme
      "shape": { "type": "circle" },
      "opacity": { "value": 0.5, "random": false },
      "size": { "value": 3, "random": true },
      "line_linked": { 
        "enable": true, 
        "distance": 150, 
        "color": "#ffffff", 
        "opacity": 0.4, 
        "width": 1 
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": { "enable": true, "mode": "grab" },
        "onclick": { "enable": true, "mode": "push" },
        "resize": true
      },
      "modes": {
        "grab": { "distance": 200, "line_linked": { "opacity": 1 } },
        "push": { "particles_nb": 4 }
      }
    },
    "retina_detect": true
};

// Initialize the particles background
particlesJS('particles-js', particleConfig);


// ==========================================
// 1. DARK MODE & 3D AVATAR THEME SWITCHER (NEW/REVISED)
// ==========================================
let bodyModel = null;
let scene = null;

// Color definitions based on your CSS variables
const THEME_COLORS = {
    light: {
        bg: 0xc0c0c0,      // var(--bg-color)
        model: 0x000080,   // var(--primary-color) - Deep Blue
        particles: "#ffffff"
    },
    dark: {
        bg: 0x000000,      // var(--bg-color) - Black
        model: 0x00c000,   // var(--primary-color) - Green
        particles: "#00ff00"
    }
};

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('theme', theme);

    // Update 3D Avatar colors (if the model has been initialized)
    if (bodyModel && scene) {
        const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
        
        // 1. Change the scene background color
        scene.background.setHex(colors.bg);
        
        // 2. Change the 3D model's material color
        bodyModel.material.color.setHex(colors.model);
        
        // 3. Change particle colors (requires re-initialization of particles.js)
        // Since re-initialization can be costly, a simpler way is often used,
        // but for a full swap, you must update the config and restart particlesJS.
        const updatedParticleConfig = JSON.parse(JSON.stringify(particleConfig));
        updatedParticleConfig.particles.color.value = colors.particles;
        updatedParticleConfig.particles.line_linked.color = colors.particles;
        particlesJS('particles-js', updatedParticleConfig);
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    // Check if a theme is saved, otherwise check system preference, default to light
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

// Attach theme toggle listener (assuming you have a button with this ID)
const toggleButton = document.getElementById('dark-mode-toggle');
if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });
}
// Run on load
initTheme();

// ==========================================
// 2. HIGHLIGHT CURRENT NAV LINK (Retro Navigation)
// (Code remains unchanged)
// ==========================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        if (!section.getAttribute('id')) return;
        
        const sectionTop = section.offsetTop - 100; 
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});


// ==========================================
// 3. BACK-TO-TOP BUTTON (Retro Style)
// (Code remains unchanged, only removing redundant definitions for brevity)
// ==========================================
const backToTopBtn = document.createElement('button');
backToTopBtn.id = 'back-to-top';
backToTopBtn.textContent = '▲'; 

document.body.appendChild(backToTopBtn);

backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 40px; 
    height: 40px;
    padding: 0;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    display: none;
    cursor: pointer;
    z-index: 1000;
    
    background-color: #c0c0c0;
    color: #000000;           
    border: 2px outset #ffffff;
    border-right-color: #000000;
    border-bottom-color: #000000;
    box-shadow: 1px 1px 0 #000000;
    font-weight: bold;
`;

// Add hover effect via JavaScript to simulate the 'pressed' look
backToTopBtn.addEventListener('mouseover', () => {
    backToTopBtn.style.border = '2px inset #000000';
    backToTopBtn.style.borderRightColor = '#ffffff';
    backToTopBtn.style.borderBottomColor = '#ffffff';
    backToTopBtn.style.boxShadow = 'none';
});

backToTopBtn.addEventListener('mouseout', () => {
    backToTopBtn.style.border = '2px outset #ffffff';
    backToTopBtn.style.borderRightColor = '#000000';
    backToTopBtn.style.borderBottomColor = '#000000';
    backToTopBtn.style.boxShadow = '1px 1px 0 #000000';
});

// Logic to show/hide button on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'auto' }); 
});


// ==========================================
// 4. 3D BODY AVATAR IMPLEMENTATION (REVISED)
// ==========================================
function init3DAvatar() {
    const container = document.getElementById('avatar-3d-canvas');
    if (!container) return; 

    scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 2.5; 

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ canvas: container, antialias: false });
    renderer.setSize(120, 120); 

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 5. Create 3D shape (Dodecahedron)
    const geometry = new THREE.DodecahedronGeometry(1);
    const material = new THREE.MeshPhongMaterial();
    // Use the global 'bodyModel' variable
    bodyModel = new THREE.Mesh(geometry, material); 
    scene.add(bodyModel);

    // Apply the initial theme immediately after creating the model
    // This ensures the model and scene get the correct initial colors (light or dark)
    const initialTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    applyTheme(initialTheme);


    // 6. Animation Loop (Rotation)
    function animate() {
        requestAnimationFrame(animate);
        
        bodyModel.rotation.y += 0.005; 
        
        renderer.render(scene, camera);
    }

    // Handle Resize 
    function onWindowResize() {
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);

    animate();
}

// Call the initialization function when the window loads
window.addEventListener('load', init3DAvatar);
