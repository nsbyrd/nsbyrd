// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });

    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Back to Top Button
const nsbTop = document.getElementById('nsb-top');
if (nsbTop) {
    window.addEventListener('scroll', () => {
        nsbTop.classList.toggle('show', window.pageYOffset > 600);
    });
}

// Show / hide abstract
document.querySelectorAll('.pub-abstract-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.publication-card');
        const box = card && card.querySelector('.pub-abstract');
        if (!box) return;
        const willOpen = box.hasAttribute('hidden');
        box.toggleAttribute('hidden', !willOpen);
        btn.textContent = willOpen ? 'Hide abstract' : 'Show abstract';
        btn.setAttribute('aria-expanded', String(willOpen));
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
