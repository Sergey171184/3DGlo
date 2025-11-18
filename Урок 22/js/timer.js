/**
 * Таймер обратного отсчета для акции
 * Задание 1-5 урока 19
 */

class CountdownTimer {
    constructor() {
        this.deadline = new Date();
        this.deadline.setHours(this.deadline.getHours() + 24);
        this.intervalId = null;
    }

    // Добавление ведущего нуля
    addLeadingZero(num) {
        return num < 10 ? '0' + num : num;
    }

    // Обновление таймера
    update() {
        const hoursElement = document.getElementById('timer-hours');
        const minutesElement = document.getElementById('timer-minutes');
        const secondsElement = document.getElementById('timer-seconds');

        // Проверка элементов
        if (!hoursElement || !minutesElement || !secondsElement) {
            console.error('Элементы таймера не найдены');
            this.stop();
            return;
        }

        const now = new Date();
        const timeRemaining = this.deadline - now;

        // Если время вышло
        if (timeRemaining <= 0) {
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            console.log('Обратный отсчет: 00:00:00');
            this.stop();
            return;
        }

        // Расчет времени
        const totalHours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // Обновление элементов на странице
        hoursElement.textContent = this.addLeadingZero(totalHours);
        minutesElement.textContent = this.addLeadingZero(minutes);
        secondsElement.textContent = this.addLeadingZero(seconds);

        // Вывод в консоль
        console.log(`Обратный отсчет: ${this.addLeadingZero(totalHours)}:${this.addLeadingZero(minutes)}:${this.addLeadingZero(seconds)}`);
    }

    // Запуск таймера
    start() {
        this.update(); // Первое обновление
        this.intervalId = setInterval(() => this.update(), 1000);
    }

    // Остановка таймера
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    const timer = new CountdownTimer();
    timer.start();
});