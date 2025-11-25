import { animate, easeOutBounce } from './helpers.js';

/**
 * Скрипт для меню, модального окна, плавной прокрутки и табов
 */

class MenuManager {
    constructor() {
        this.menu = document.querySelector('menu');
        this.menuBtn = document.querySelector('.menu');

        this.menu && this.menuBtn && this.init();
    }

    init() {
        // Делегирование событий
        document.addEventListener('click', (e) => this.handleClick(e));
    }

    handleClick(e) {
        const target = e.target;
        const isMenuOpen = this.menu.classList.contains('active-menu');

        // Обработка кликов по кнопке меню и кнопке закрытия
        if (target.closest('.menu') || target.closest('.close-btn')) {
            this.toggleMenu();
            return;
        }

        // Обработка кликов по пунктам меню для плавной прокрутки
        if (target.closest('menu a[href^="#"]') && target.getAttribute('href') !== '#close') {
            e.preventDefault();
            const targetSection = document.getElementById(target.getAttribute('href').substring(1));
            targetSection && (this.toggleMenu(), SmoothScroll.toElement(targetSection));
            return;
        }

        // Закрытие меню при клике вне его области
        isMenuOpen && !target.closest('menu') && !target.closest('.menu') && this.toggleMenu();
    }

    toggleMenu() {
        this.menu.classList.toggle('active-menu');
    }
}

class TabsManager {
    constructor() {
        this.tabsContainer = document.querySelector('.service-header');
        this.tabContents = document.querySelectorAll('.service-tab');

        this.tabsContainer && this.init();
    }

    init() {
        // Делегирование событий для табов
        this.tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.service-header-tab');
            tab && this.switchTab([...this.tabsContainer.children].indexOf(tab));
        });

        // Активация первого таба по умолчанию
        this.switchTab(0);
    }

    switchTab(activeIndex) {
        // Переключение активного таба и соответствующего контента
        this.tabsContainer.querySelector('.active')?.classList.remove('active');
        this.tabsContainer.children[activeIndex]?.classList.add('active');

        this.tabContents.forEach((content, index) => {
            content.style.display = index === activeIndex ? 'flex' : 'none';
        });
    }
}

class ModalManager {
    constructor() {
        this.modal = document.querySelector('.popup');
        this.buttons = document.querySelectorAll('.popup-btn');
        this.closeBtn = this.modal?.querySelector('.popup-close');

        this.modal && this.closeBtn && this.init();
    }

    init() {
        // Обработчики модального окна
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => this.open());
        });

        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            e.target === this.modal && this.close();
        });
    }

    open() {
        window.innerWidth < 768 ? this.show() : this.animate(true);
    }

    close() {
        window.innerWidth < 768 ? this.hide() : this.animate(false);
    }

    show() {
        this.modal.style.display = 'block';
    }

    hide() {
        this.modal.style.display = 'none';
    }

    // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ УРОК 25: Анимация модального окна через функцию-помощник
    animate(show) {
        if (show) {
            this.show();

            animate(300, (progress) => {
                const ease = 1 - Math.pow(1 - progress, 3);
                this.modal.style.opacity = ease;
                this.modal.style.transform = `scale(${0.8 + ease * 0.2}) translateY(${(1 - ease) * 50}px)`;
            });
        } else {
            animate(300, (progress) => {
                const ease = 1 - Math.pow(1 - progress, 3);
                this.modal.style.opacity = 1 - ease;
                this.modal.style.transform = `scale(${1 - ease * 0.2}) translateY(${ease * 50}px)`;
            }, t => t, () => {
                this.hide();
            });
        }
    }
}

class SmoothScroll {
    static init() {
        // Инициализация плавной прокрутки
        document.addEventListener('click', (e) => {
            const target = e.target;

            if (target.closest('main a[href="#service-block"]')) {
                e.preventDefault();
                this.toElement(document.getElementById('service-block'));
                return;
            }

            if (target.closest('menu a[href^="#"]') && target.getAttribute('href') !== '#close') {
                e.preventDefault();
                this.toElement(document.getElementById(target.getAttribute('href').substring(1)));
            }
        });
    }

    static toElement(element) {
        if (!element) return;

        const start = window.pageYOffset;
        const target = element.getBoundingClientRect().top + start - 80;
        const duration = 1000;

        // Использование функции-помощника для плавной прокрутки
        animate(duration, (progress) => {
            const ease = progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            window.scrollTo(0, start + (target - start) * ease);
        });
    }
}

// Автоматическая инициализация всех компонентов
new MenuManager();
new TabsManager();
new ModalManager();
SmoothScroll.init();