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
        "onhover": { "enable": true, "mode": "grab" }, // Interactivity on hover
        "onclick": { "enable": true, "mode": "push" },  // Interactivity on click
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
// 2. HIGHLIGHT CURRENT NAV LINK (Retro Navigation)
// ==========================================
// Keeping this feature but removing smooth scrolling to match the instant retro feel.
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
    let current = '';
    
    // Check if the page has the "id" attribute, otherwise assume no scrolling section logic needed
    sections.forEach(section => {
        if (!section.getAttribute('id')) return;
        
        // Offset adjusted to account for sticky header height
        const sectionTop = section.offsetTop - 100; 
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        // Check if the link href matches the current section ID
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});


// ==========================================
// 3. BACK-TO-TOP BUTTON (Retro Style)
// ==========================================
const backToTopBtn = document.createElement('button');
backToTopBtn.id = 'back-to-top';
backToTopBtn.textContent = '▲'; // Using a simple triangle icon

// Append the button to the body
document.body.appendChild(backToTopBtn);

// Style the button using the 3D Windows 98 aesthetic
backToTopBtn.style.cssText = `
    /* Position and Layout */
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 40px; /* fixed width/height for classic button feel */
    height: 40px;
    padding: 0;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    display: none;
    cursor: pointer;
    z-index: 1000;
    
    /* Windows 98 3D Button Style */
    background-color: #c0c0c0; /* var(--bg-color) */
    color: #000000;           /* var(--text-color) */
    border: 2px outset #ffffff; /* var(--border-light) */
    border-right-color: #000000; /* var(--border-dark) */
    border-bottom-color: #000000; /* var(--border-dark) */
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
    // Revert to raised look
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

// Scroll to top with instant behavior (removes 'smooth' for retro feel)
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'auto' }); 
});



/* // *** REMOVED: Smooth Scrolling ***
// Retro design favors instant navigation.

// *** REMOVED: Fade-in Sections on Scroll (Intersection Observer) ***
// Animations conflict with the stark, blocky retro aesthetic. 

// *** REMOVED: Typing Effect for Hero Title ***
// Animations conflict with the stark, blocky retro aesthetic. 

// *** REMOVED: Skill Bar Animation ***
// Animations conflict with the stark, blocky retro aesthetic. 
*/
