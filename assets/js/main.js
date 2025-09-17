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

const appearOnScroll = new IntersectionObserver((entries, observer) => {
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

// ==========================
// Typing Effect for Hero Title
// ==========================
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

// ==========================
// Back-to-Top Button
// ==========================
const backToTopBtn = document.createElement('button');
backToTopBtn.id = 'back-to-top';
backToTopBtn.textContent = '⬆';
document.body.appendChild(backToTopBtn);

backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 40px;
    right: 40px;
    padding: 12px 16px;
    font-size: 18px;
    display: none;
    border: none;
    border-radius: 6px;
    background-color: #007acc;
    color: #fff;
    cursor: pointer;
    z-index: 1000;
`;

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backToTopBtn.style.display = 'block';
    else backToTopBtn.style.display = 'none';
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================
// Optional: Skill Bar Animation
// ==========================
const skillBars = document.querySelectorAll('.skill-bar');
skillBars.forEach(bar => {
    const progress = bar.querySelector('.progress');
    const value = progress.dataset.progress;
    progress.style.width = '0%';
    setTimeout(() => {
        progress.style.width = value;
        progress.style.transition = 'width 2s ease-in-out';
    }, 500);
});
