/**
 * Отображение текущего времени, приветствия и отсчета до Нового года
 * Задание 6 урока 19
 */

class TimeDisplay {
    constructor() {
        this.days = [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота'
        ];

        this.months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];

        this.init();
    }

    // Инициализация класса
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM загружен, запускаем таймер...');
            this.updateTimeInfo();
            setInterval(() => this.updateTimeInfo(), 1000);
            console.log('Таймер запущен, обновление каждую секунду');
        });
    }

    // Получение приветствия в зависимости от времени суток
    getGreeting() {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) return 'Доброе утро';
        if (hour >= 12 && hour < 18) return 'Добрый день';
        if (hour >= 18 && hour < 23) return 'Добрый вечер';
        return 'Доброй ночи';
    }

    // Форматирование времени с ведущими нулями
    formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return `${hours}:${minutes}:${seconds}`;
    }

    // Получение названия дня недели
    getDayName(dayIndex) {
        return this.days[dayIndex];
    }

    // Получение названия месяца
    getMonthName(monthIndex) {
        return this.months[monthIndex];
    }

    // Расчет времени до Нового года
    getTimeToNewYear() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const nextYear = currentYear + 1;
        const newYear = new Date(nextYear, 0, 1, 0, 0, 0);
        const diffTime = newYear - now;

        if (diffTime <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }

        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

        return {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    }

    // Склонение слова "день"
    getDaysWord(days) {
        if (days % 10 === 1 && days % 100 !== 11) return 'день';
        if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня';
        return 'дней';
    }

    // Склонение слова "час"
    getHoursWord(hours) {
        if (hours % 10 === 1 && hours % 100 !== 11) return 'час';
        if ([2, 3, 4].includes(hours % 10) && ![12, 13, 14].includes(hours % 100)) return 'часа';
        return 'часов';
    }

    // Склонение слова "минута"
    getMinutesWord(minutes) {
        if (minutes % 10 === 1 && minutes % 100 !== 11) return 'минута';
        if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) return 'минуты';
        return 'минут';
    }

    // Склонение слова "секунда"
    getSecondsWord(seconds) {
        if (seconds % 10 === 1 && seconds % 100 !== 11) return 'секунда';
        if ([2, 3, 4].includes(seconds % 10) && ![12, 13, 14].includes(seconds % 100)) return 'секунды';
        return 'секунд';
    }

    // Полная дата
    getFullDate() {
        const now = new Date();
        const day = now.getDate();
        const month = this.getMonthName(now.getMonth());
        const year = now.getFullYear();

        return `${day} ${month} ${year} года`;
    }

    // Добавление ведущего нуля
    addLeadingZero(num) {
        return num < 10 ? '0' + num : num;
    }

    // Информация о часовом поясе
    getTimezoneInfo() {
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
        const offsetMinutes = Math.abs(timezoneOffset % 60);
        const offsetSign = timezoneOffset > 0 ? '-' : '+';

        return {
            timezone: timezone,
            offset: `${offsetSign}${this.addLeadingZero(offsetHours)}:${this.addLeadingZero(offsetMinutes)}`
        };
    }

    // Основной метод обновления информации
    updateTimeInfo() {
        try {
            const now = new Date();
            const timezoneInfo = this.getTimezoneInfo();
            const timeToNewYear = this.getTimeToNewYear();

            // Обновляем DOM элементы
            this.updateElement('greeting', this.getGreeting());
            this.updateElement('current-day', this.getDayName(now.getDay()));
            this.updateElement('current-time', this.formatTime(now));
            this.updateElement('timezone-info', `Часовой пояс: ${timezoneInfo.timezone} (UTC${timezoneInfo.offset})`);
            this.updateElement('full-date', this.getFullDate());

            // Обновляем отсчет до Нового года
            this.updateElement('new-year-days', timeToNewYear.days);
            this.updateElement('new-year-days-label', this.getDaysWord(timeToNewYear.days));
            this.updateElement('new-year-hours', this.addLeadingZero(timeToNewYear.hours));
            this.updateElement('new-year-hours-label', this.getHoursWord(timeToNewYear.hours));
            this.updateElement('new-year-minutes', this.addLeadingZero(timeToNewYear.minutes));
            this.updateElement('new-year-minutes-label', this.getMinutesWord(timeToNewYear.minutes));
            this.updateElement('new-year-seconds', this.addLeadingZero(timeToNewYear.seconds));
            this.updateElement('new-year-seconds-label', this.getSecondsWord(timeToNewYear.seconds));

            // Вывод в консоль
            console.log('Время обновлено:', now.toLocaleString(),
                'Часовой пояс:', timezoneInfo.timezone,
                'До Нового года:',
                timeToNewYear.days + 'д ' +
                this.addLeadingZero(timeToNewYear.hours) + ':' +
                this.addLeadingZero(timeToNewYear.minutes) + ':' +
                this.addLeadingZero(timeToNewYear.seconds));
        } catch (error) {
            console.error('Ошибка при обновлении времени:', error);
        }
    }

    // Вспомогательный метод для обновления DOM элементов
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }
}

// Создаем экземпляр класса
new TimeDisplay();