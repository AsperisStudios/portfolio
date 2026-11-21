const menuToggle = document.querySelector('.toggle');
const showcase = document.querySelector('.showcase');
const menu = document.querySelector('.menu');

if (menuToggle && showcase && menu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        showcase.classList.toggle('active');
        menu.classList.toggle('active');
    });
}

const projectBackground = document.querySelector('.project-background');
if (projectBackground && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let scrollFrame = 0;
    window.addEventListener('scroll', () => {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(() => {
            projectBackground.style.transform = `translate3d(0, ${-window.scrollY * 0.12}px, 0)`;
            scrollFrame = 0;
        });
    }, { passive: true });
}

const projectGridItems = document.querySelectorAll('.project-page--msg .project-grid > *');
if (
    projectGridItems.length &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    'IntersectionObserver' in window
) {
    const projectGridObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    projectGridItems.forEach((item) => {
        item.classList.add('project-grid__item--reveal');
        projectGridObserver.observe(item);
    });
}

document.querySelectorAll('.project-fullscreen').forEach((button) => {
    button.addEventListener('click', async () => {
        const card = button.closest('.project-card');
        const video = card.querySelector('video');
        const status = card.querySelector('.project-fullscreen-status');
        status.textContent = '';
        video.controls = true;

        try {
            if (typeof video.requestFullscreen === 'function') {
                await video.requestFullscreen();
            } else if (typeof video.webkitEnterFullscreen === 'function') {
                video.webkitEnterFullscreen();
            } else {
                throw new Error('Fullscreen playback is not supported by this browser.');
            }
        } catch (error) {
            video.controls = card.classList.contains('project-card--featured');
            status.textContent = 'Fullscreen playback could not be started.';
            console.error('Unable to enter fullscreen playback:', error);
        }
    });
});

document.addEventListener('fullscreenchange', () => {
    document.querySelectorAll('.project-card').forEach((card) => {
        const video = card.querySelector('video');
        video.controls = document.fullscreenElement === video || card.classList.contains('project-card--featured');
    });
});

document.querySelectorAll('.project-card__video').forEach((video) => {
    video.addEventListener('webkitendfullscreen', () => {
        video.controls = video.closest('.project-card').classList.contains('project-card--featured');
    });
});
