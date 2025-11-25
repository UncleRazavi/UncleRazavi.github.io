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
title.textContent = 'Fractal (Mandelbrot)';

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
// FRACTAL (Mandelbrot) - Performance Improved
// =============================
function initFractal(container) {
    const canvas = document.createElement('canvas');
    // Ensure canvas size is based on the content container
    canvas.width = container.clientWidth; 
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    const maxIter = 50;
    
    // Use ImageData for much better drawing performance (less calls to fillRect)
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for(let px=0; px<width; px++) {
        for(let py=0; py<height; py++){
            // Map pixel coordinates to the complex plane (-2.0 to 2.0)
            let x0 = (px / width) * 3.5 - 2.5; 
            let y0 = (py / height) * 2.0 - 1.0; 
            
            let x=0, y=0, iter=0;
            while(x*x + y*y < 4 && iter < maxIter){
                let xt = x*x - y*y + x0;
                y = 2*x*y + y0; 
                x = xt;
                iter++;
            }
            
            // Color based on iteration count
            const colorValue = iter === maxIter ? 0 : 255 - iter * 5;
            
            // Calculate index in the ImageData array
            const index = (py * width + px) * 4;
            
            // Set R, G, B channels (Greyscale for the retro look)
            data[index] = colorValue;     // Red
            data[index + 1] = colorValue; // Green
            data[index + 2] = colorValue; // Blue
            data[index + 3] = 255;        // Alpha (fully opaque)
        }
    }
    
    // Put the calculated image data onto the canvas
    ctx.putImageData(imgData, 0, 0);
}

initFractal(content);

// =============================
// DARK MODE TOGGLE (New Functionality)
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
