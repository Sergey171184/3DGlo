/**
 * Скрипт для меню, модального окна и плавной прокрутки
 * в рамках выполнения Урока 20
 */

class MenuManager {
    constructor() {
        const menu = document.querySelector('menu');
        const menuBtn = document.querySelector('.menu');
        const closeBtn = menu?.querySelector('.close-btn');

        if (menu && menuBtn && closeBtn) {
            // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Обработчики меню
            menuBtn.addEventListener('click', () => menu.classList.toggle('active-menu'));
            closeBtn.addEventListener('click', () => menu.classList.toggle('active-menu'));

            // УСЛОЖНЕННОЕ ЗАДАНИЕ: Плавная прокрутка по пунктам меню
            menu.querySelectorAll('ul>li>a').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.getElementById(item.getAttribute('href').substring(1));
                    if (target) {
                        menu.classList.toggle('active-menu');
                        SmoothScroll.toElement(target);
                    }
                });
            });
        }
    }
}

class ModalManager {
    constructor() {
        const modal = document.querySelector('.popup');
        const buttons = document.querySelectorAll('.popup-btn');
        const closeBtn = modal?.querySelector('.popup-close');

        if (modal && closeBtn) {
            // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Обработчики модального окна
            buttons.forEach(btn => btn.addEventListener('click', () => this.toggleModal(modal, true)));
            closeBtn.addEventListener('click', () => this.toggleModal(modal, false));
            modal.addEventListener('click', (e) => e.target === modal && this.toggleModal(modal, false));
        }
    }

    toggleModal(modal, show) {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            modal.style.display = show ? 'block' : 'none';
        } else {
            this.animateModal(modal, show);
        }
    }

    // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: JS-анимация модального окна
    animateModal(modal, show) {
        const start = performance.now();
        const duration = 300;

        const animate = (time) => {
            const progress = Math.min((time - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            if (show) {
                modal.style.display = 'block';
                modal.style.opacity = ease;
                modal.style.transform = `scale(${0.8 + ease * 0.2}) translateY(${(1 - ease) * 50}px)`;
            } else {
                modal.style.opacity = 1 - ease;
                modal.style.transform = `scale(${1 - ease * 0.2}) translateY(${ease * 50}px)`;
                if (progress === 1) modal.style.display = 'none';
            }

            progress < 1 && requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }
}

class SmoothScroll {
    static init() {
        // УСЛОЖНЕННОЕ ЗАДАНИЕ: Инициализация плавной прокрутки
        this.bindScrollButton();
        this.bindMenuLinks();
    }

    static bindScrollButton() {
        document.querySelector('main a[href="#service-block"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toElement(document.getElementById('service-block'));
        });
    }

    static bindMenuLinks() {
        document.querySelectorAll('menu a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (link.getAttribute('href') === '#close') return;
                this.toElement(document.getElementById(link.getAttribute('href').substring(1)));
            });
        });
    }

    static toElement(element) {
        if (!element) return;

        const start = window.pageYOffset;
        const target = element.getBoundingClientRect().top + start - 80;
        const duration = 1000;
        let startTime = null;

        const animate = (time) => {
            startTime = startTime || time;
            const progress = Math.min((time - startTime) / duration, 1);
            const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, start + (target - start) * ease);
            progress < 1 && requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }
}

// Автоматическая инициализация
new MenuManager();
new ModalManager();
SmoothScroll.init();