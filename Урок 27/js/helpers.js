// Функции-помощники для анимации - Урок 25

// Универсальная функция анимации с callback
// Принимает: длительность, функция обновления, функция плавности, функция завершения
function animate(duration, update, easing = t => t, onComplete = null) {
    const start = performance.now();

    function animateFrame(time) {
        const progress = Math.min((time - start) / duration, 1);
        const easedProgress = easing(progress);

        update(easedProgress);

        if (progress < 1) {
            requestAnimationFrame(animateFrame);
        } else if (onComplete) {
            onComplete();
        }
    }

    requestAnimationFrame(animateFrame);
}

// Универсальная функция анимации с Promise
// Возвращает Promise который выполняется после завершения анимации
function animatePromise(duration, update, easing = t => t) {
    return new Promise((resolve) => {
        animate(duration, update, easing, resolve);
    });
}

// Функция плавности - замедление в конце
function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// Функция плавности - bounce эффект
function easeOutBounce(t) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
        return n1 * t * t;
    } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
}

// Экспортируем функции для использования в других модулях
export { animate, animatePromise, easeOutQuart, easeOutBounce };