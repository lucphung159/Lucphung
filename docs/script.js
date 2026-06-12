// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');

menuBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

// Close mobile nav when a link is clicked
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
  });
});

// Navbar shadow on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 1px 8px rgba(0,0,0,0.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});
