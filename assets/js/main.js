// Dark mode toggle
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
};

// Optional: save preference in localStorage
const darkModeBtn = document.getElementById('dark-mode-toggle');
if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
        toggleDarkMode();
        // Save preference
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

// Load preference on page load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
