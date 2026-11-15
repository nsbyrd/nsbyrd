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

// Footer year
document.querySelectorAll('.footer-year').forEach(el => { el.textContent = new Date().getFullYear(); });

// Photo album: click to enlarge
(() => {
    const photos = [...document.querySelectorAll('.photo-album .photo img')];
    if (!photos.length) return;

    const box = document.createElement('div');
    box.className = 'lightbox';
    box.hidden = true;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Enlarged photo');
    box.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<button class="lightbox-nav lightbox-prev" aria-label="Previous photo">&#8592;</button>' +
        '<figure class="lightbox-figure"><img alt=""><figcaption></figcaption></figure>' +
        '<button class="lightbox-nav lightbox-next" aria-label="Next photo">&#8594;</button>';
    document.body.appendChild(box);

    const img = box.querySelector('img');
    const cap = box.querySelector('figcaption');
    let index = 0, lastFocus = null;

    const show = (i) => {
        index = (i + photos.length) % photos.length;
        const src = photos[index];
        img.src = src.currentSrc || src.src;
        img.alt = src.alt;
        const fc = src.closest('figure').querySelector('figcaption');
        cap.textContent = fc ? fc.textContent : '';
    };
    const open = (i) => {
        lastFocus = document.activeElement;
        show(i);
        box.hidden = false;
        document.body.style.overflow = 'hidden';
        box.querySelector('.lightbox-close').focus();
    };
    const close = () => {
        box.hidden = true;
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    };

    photos.forEach((p, i) => {
        p.tabIndex = 0;
        p.setAttribute('role', 'button');
        p.setAttribute('aria-label', 'Enlarge photo: ' + p.alt);
        p.addEventListener('click', () => open(i));
        p.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
        });
    });

    box.addEventListener('click', (e) => {
        if (e.target.closest('.lightbox-prev')) show(index - 1);
        else if (e.target.closest('.lightbox-next')) show(index + 1);
        else if (!e.target.closest('.lightbox-figure img')) close();
    });
    document.addEventListener('keydown', (e) => {
        if (box.hidden) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(index - 1);
        else if (e.key === 'ArrowRight') show(index + 1);
    });
})();
