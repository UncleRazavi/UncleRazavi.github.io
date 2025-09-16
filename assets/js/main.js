// ==========================
// Dark Mode Toggle with Icon
// ==========================
const darkModeBtn = document.getElementById('dark-mode-toggle');

const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    if (darkModeBtn) {
        darkModeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

// Load preference on page load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeBtn) darkModeBtn.textContent = '☀️';
    } else if (darkModeBtn) {
        darkModeBtn.textContent = '🌙';
    }
});

// Toggle dark mode on button click
if (darkModeBtn) {
    darkModeBtn.addEventListener('click', toggleDarkMode);
}

// ==========================
// Smooth Scrolling for Internal Links
// ==========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==========================
// Highlight Current Nav Link on Scroll
// ==========================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (pageYOffset >= sectionTop) current = section.getAttribute('id');
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
});

// ==========================
// Fade-in Sections on Scroll
// ==========================
const faders = document.querySelectorAll('.fade-in');
const appearOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    fader.classList.add('fade-in'); // ensure class exists
    appearOnScroll.observe(fader);
});


const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    const typingSpeed = 80;

    const type = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, typingSpeed);
        }
    };
    type();
}
