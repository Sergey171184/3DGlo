/**
 * Класс слайдера для портфолио
 * Урок 23 - Обязательное задание: базовый функционал слайдера
 */

class Slider {
    constructor(config = {}) {
        // Конфигурация с значениями по умолчанию
        this.config = {
            sliderSelector: config.sliderSelector,
            slideSelector: config.slideSelector,
            dotsContainerSelector: config.dotsContainerSelector,
            prevArrowSelector: config.prevArrowSelector,
            nextArrowSelector: config.nextArrowSelector,
            dotActiveClass: config.dotActiveClass || 'dot-active',
            slideActiveClass: config.slideActiveClass || 'portfolio-item-active',
            interval: config.interval || 2000
        };

        // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Основные элементы слайдера
        this.sliderBlock = document.querySelector(this.config.sliderSelector);
        this.slides = document.querySelectorAll(this.config.slideSelector);
        this.dotsContainer = document.querySelector(this.config.dotsContainerSelector);

        this.currentSlide = 0;
        this.interval = null;
        this.dots = [];

        this.init();
    }

    init() {
        // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Удаляем существующие точки и создаем новые
        this.removeExistingDots();
        this.createDots();
        this.setupEventListeners();
        this.startAutoSlide();
    }

    // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Удаление существующих точек из HTML
    removeExistingDots() {
        const existingDots = this.dotsContainer.querySelectorAll('.dot');
        existingDots.forEach(dot => dot.remove());
    }

    // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Создание точек по количеству слайдов
    createDots() {
        for (let i = 0; i < this.slides.length; i++) {
            const dot = document.createElement('li');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add(this.config.dotActiveClass);

            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        }
    }

    setupEventListeners() {
        // Обработчики для стрелок
        document.querySelector(this.config.prevArrowSelector)?.addEventListener('click', (e) => {
            e.preventDefault();
            this.prevSlide();
        });

        document.querySelector(this.config.nextArrowSelector)?.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextSlide();
        });

        // Пауза при наведении
        this.sliderBlock.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.sliderBlock.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    goToSlide(index) {
        this.removeActiveClasses();
        this.currentSlide = index;
        if (this.currentSlide >= this.slides.length) this.currentSlide = 0;
        if (this.currentSlide < 0) this.currentSlide = this.slides.length - 1;
        this.addActiveClasses();
    }

    nextSlide() {
        this.removeActiveClasses();
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.addActiveClasses();
    }

    prevSlide() {
        this.removeActiveClasses();
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.addActiveClasses();
    }

    removeActiveClasses() {
        this.slides[this.currentSlide]?.classList.remove(this.config.slideActiveClass);
        this.dots[this.currentSlide]?.classList.remove(this.config.dotActiveClass);
    }

    addActiveClasses() {
        this.slides[this.currentSlide]?.classList.add(this.config.slideActiveClass);
        this.dots[this.currentSlide]?.classList.add(this.config.dotActiveClass);
    }

    autoSlide() {
        this.nextSlide();
    }

    startAutoSlide() {
        this.interval = setInterval(() => this.autoSlide(), this.config.interval);
    }

    stopAutoSlide() {
        clearInterval(this.interval);
    }
}

// Экспорт класса для использования в index.js
window.Slider = Slider;