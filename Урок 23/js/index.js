/**
 * Точка входа для инициализации слайдера
 * Урок 23 - Усложненное задание: передача конфигурации и проверки
 */

// УСЛОЖНЕННОЕ ЗАДАНИЕ пункт 1: Передача классов для работы слайдера из точки входа
const sliderConfig = {
    sliderSelector: '.portfolio-content',
    slideSelector: '.portfolio-item',
    dotsContainerSelector: '.portfolio-dots',
    prevArrowSelector: '#arrow-left',
    nextArrowSelector: '#arrow-right',
    dotActiveClass: 'dot-active',
    slideActiveClass: 'portfolio-item-active',
    interval: 2000
};

// УСЛОЖНЕННОЕ ЗАДАНИЕ пункт 2: Проверка элемента слайдера
const sliderElement = document.querySelector(sliderConfig.sliderSelector);
if (!sliderElement) {
    console.warn('Элемент слайдера не найден. Работа слайдера прекращена.');
    // Завершаем работу программы если элемент не найден
}

// УСЛОЖНЕННОЕ ЗАДАНИЕ пункт 3: Проверка элементов слайдов
const slideElements = document.querySelectorAll(sliderConfig.slideSelector);
if (!slideElements.length) {
    console.warn('Элементы слайдов не найдены. Работа слайдера прекращена.');
    // Завершаем работу программы если элементы не найдены
}

// УСЛОЖНЕННОЕ ЗАДАНИЕ пункт 4: Создание слайдера с переданной конфигурацией
// Классы активности используют значения по умолчанию из slider.js
if (sliderElement && slideElements.length) {
    new window.Slider(sliderConfig);
}