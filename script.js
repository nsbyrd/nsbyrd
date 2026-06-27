// Set copyright year
const yearEl = document.getElementById('copyright-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Smooth scroll for internal anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Relative time for news dates
function relativeTime(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7)  return `${diff} days ago`;
    if (diff < 14) return '1 week ago';
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    if (diff < 60) return '1 month ago';
    if (diff < 365) return `${Math.floor(diff / 30)} months ago`;
    if (diff < 730) return '1 year ago';
    return `${Math.floor(diff / 365)} years ago`;
}

document.querySelectorAll('.news-date[data-date]').forEach(el => {
    el.textContent = relativeTime(el.dataset.date);
});

// Animated count-up for publication stats
function countUp(el, target, duration) {
    const start = performance.now();
    const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    };
    requestAnimationFrame(update);
}

// Copy email button
const copyEmailBtn = document.getElementById('copyEmail');
if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('nsb5522@psu.edu').then(() => {
            copyEmailBtn.textContent = 'Copied!';
            copyEmailBtn.classList.add('copied');
            setTimeout(() => {
                copyEmailBtn.textContent = 'Copy';
                copyEmailBtn.classList.remove('copied');
            }, 2000);
        });
    });
}

// Load scholar stats from assets/scholar-stats.json
fetch('assets/scholar-stats.json')
    .then(r => r.json())
    .then(data => {
        const pubEl  = document.getElementById('stat-publications');
        const citEl  = document.getElementById('stat-citations');
        if (pubEl) countUp(pubEl, data.publications ?? 0, 800);
        if (citEl) countUp(citEl, data.citations    ?? 0, 800);
    })
    .catch(() => {
        const pubEl = document.getElementById('stat-publications');
        const citEl = document.getElementById('stat-citations');
        if (pubEl) countUp(pubEl, 5, 800);
        if (citEl) countUp(citEl, 1, 800);
    });

// Abstract toggle buttons
document.querySelectorAll('.pub-toggle-abstract').forEach(btn => {
    btn.addEventListener('click', () => {
        const abstract = btn.closest('.publication-card').querySelector('.pub-abstract');
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        abstract.hidden = expanded;
        btn.setAttribute('aria-expanded', !expanded);
        btn.textContent = expanded ? 'Show abstract' : 'Hide abstract';
    });
});

// Copy citation buttons
document.querySelectorAll('.pub-copy-citation').forEach(btn => {
    btn.addEventListener('click', () => {
        const citation = (btn.dataset.citation || '').replace(/&amp;/g, '&');
        navigator.clipboard.writeText(citation).then(() => {
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = original;
                btn.classList.remove('copied');
            }, 2000);
        });
    });
});

// Publication filter (year buttons + text search)
const pubSearch  = document.getElementById('pubSearch');
const yearBtns   = document.querySelectorAll('.filter-btn[data-year]');
const pubCards   = document.querySelectorAll('.publication-card');
const noResults  = document.getElementById('pubNoResults');

let activeYear = 'all';

function filterPublications() {
    const query = pubSearch ? pubSearch.value.toLowerCase().trim() : '';
    let visible = 0;

    pubCards.forEach(card => {
        const yearMatch = activeYear === 'all' || card.dataset.year === activeYear;
        const textMatch = !query ||
            (card.dataset.text || '').includes(query) ||
            card.textContent.toLowerCase().includes(query);

        if (yearMatch && textMatch) {
            card.style.display = '';
            visible++;
        } else {
            card.style.display = 'none';
        }
    });

    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
}

yearBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        yearBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeYear = btn.dataset.year;
        filterPublications();
    });
});

if (pubSearch) pubSearch.addEventListener('input', filterPublications);
