/**
 * Модуль отправки данных форм с валидацией комбинаций и прелоадером
 * Основная проверка заполнения форм выполнена в файле form-validator.js
 * ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ урока 27: Отправка данных форм с валидацией комбинаций полей
 * УСЛОЖНЕННОЕ ЗАДАНИЕ урока 27: Использование крутящегося прелоадера с анимацией
 */

class SendForm {
    constructor(formId, someElem = []) {
        this.form = document.getElementById(formId);
        this.statusBlock = document.createElement('div');
        this.someElem = someElem;
        this.loadText = 'Загрузка...';
        this.errorText = 'Ошибка...';
        this.successText = 'Спасибо! Наш менеджер с вами свяжется!';

        // Хранилище для таймеров скрытия ошибок
        this.errorTimers = new Map();

        this.init();
    }

    // Инициализация модуля
    init() {
        // УСЛОЖНЕННОЕ ЗАДАНИЕ: Создание и настройка прелоадера
        this.createPreloader();

        if (this.form) {
            this.form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.submitForm();
            });
        }
    }

    // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Проверка комбинаций полей
    validateFormCombinations(formElements) {
        const values = {};

        // Собираем значения полей
        formElements.forEach(input => {
            values[input.name] = input.value.trim();
        });

        // Определяем тип формы по ее id
        const formId = this.form.id;

        if (formId === 'form1') {
            // Главная форма: имя + email ИЛИ имя + телефон
            if (!values.user_name) {
                this.showError(this.form.querySelector('[name="user_name"]'), 'Пожалуйста, введите ваше имя');
                return false;
            }

            if (!values.user_email && !values.user_phone) {
                this.showError(this.form.querySelector('[name="user_email"]'), 'Заполните email или телефон');
                this.showError(this.form.querySelector('[name="user_phone"]'), 'Заполните телефон или email');
                return false;
            }

            // Проверяем заполненные поля
            if (values.user_email && !this.validateEmailField(values.user_email)) {
                return false;
            }

            if (values.user_phone && !this.validatePhoneField(values.user_phone)) {
                return false;
            }

        } else if (formId === 'form3') {
            // Модальное окно: имя + телефон ИЛИ имя + email
            if (!values.user_name) {
                this.showError(this.form.querySelector('[name="user_name"]'), 'Пожалуйста, введите ваше имя');
                return false;
            }

            if (!values.user_phone && !values.user_email) {
                this.showError(this.form.querySelector('[name="user_phone"]'), 'Заполните телефон или email');
                this.showError(this.form.querySelector('[name="user_email"]'), 'Заполните email или телефон');
                return false;
            }

            // Проверяем заполненные поля
            if (values.user_phone && !this.validatePhoneField(values.user_phone)) {
                return false;
            }

            if (values.user_email && !this.validateEmailField(values.user_email)) {
                return false;
            }

        } else if (formId === 'form2') {
            // Контактная форма: имя + сообщение + (email ИЛИ телефон)
            if (!values.user_name) {
                this.showError(this.form.querySelector('[name="user_name"]'), 'Пожалуйста, введите ваше имя');
                return false;
            }

            if (!values.user_message) {
                this.showError(this.form.querySelector('[name="user_message"]'), 'Пожалуйста, введите ваше сообщение');
                return false;
            }

            if (!values.user_email && !values.user_phone) {
                this.showError(this.form.querySelector('[name="user_email"]'), 'Заполните email или телефон');
                this.showError(this.form.querySelector('[name="user_phone"]'), 'Заполните телефон или email');
                return false;
            }

            // Проверяем заполненные поля
            if (values.user_email && !this.validateEmailField(values.user_email)) {
                return false;
            }

            if (values.user_phone && !this.validatePhoneField(values.user_phone)) {
                return false;
            }
        }

        return true;
    }

    // Валидация email поля
    validateEmailField(email) {
        const validationResult = this.validateEmail(email);
        if (!validationResult.isValid) {
            const emailField = this.form.querySelector('[type="email"]');
            if (emailField) {
                this.showError(emailField, validationResult.message);
            }
            return false;
        }
        return true;
    }

    // Валидация телефонного поля
    validatePhoneField(phone) {
        const digits = phone.match(/\d/g);
        const digitsCount = digits ? digits.length : 0;

        if (digitsCount < 11) {
            const needed = 11 - digitsCount;
            let errorMessage;

            if (needed === 1) {
                errorMessage = 'Не хватает одной цифры для полного номера';
            } else if (needed >= 2 && needed <= 4) {
                errorMessage = `Не хватает ${needed} цифры для полного номера`;
            } else {
                errorMessage = `Не хватает ${needed} цифр для полного номера`;
            }

            const phoneField = this.form.querySelector('[type="tel"]');
            if (phoneField) {
                this.showError(phoneField, errorMessage);
            }
            return false;
        }

        return true;
    }

    // Подробная валидация email с понятными сообщениями
    validateEmail(email) {
        // Список разрешенных доменных зон
        const validTlds = ['com', 'ru', 'net', 'by', 'kz'];

        // Проверка 1: есть ли @
        const atIndex = email.indexOf('@');
        if (atIndex === -1) {
            return {
                isValid: false,
                message: `Включите символ "@" в электронный адрес. В строке "${email}" отсутствует "@".`
            };
        }

        // Проверка 2: @ не должен быть первым
        if (atIndex === 0) {
            return {
                isValid: false,
                message: `Введите часть адреса до символа "@". Адрес "@${email.substring(1)}" - неполный.`
            };
        }

        // Проверка 3: после @ должна быть часть адреса
        const afterAt = email.substring(atIndex + 1);
        if (afterAt.length === 0) {
            return {
                isValid: false,
                message: `Введите часть адреса после символа "@". Адрес "${email}" - неполный.`
            };
        }

        // Проверка 4: должна быть хотя бы одна точка после @
        const lastDotIndex = email.lastIndexOf('.');
        if (lastDotIndex <= atIndex + 1) {
            // Нет точки после @, или точка сразу после @
            const domainPart = afterAt.split('.')[0];
            return {
                isValid: false,
                message: `Введите доменную часть после "@${domainPart}". Например: @${domainPart}.com`
            };
        }

        // Проверка 5: после последней точки должен быть текст
        const afterLastDot = email.substring(lastDotIndex + 1);
        if (afterLastDot.length === 0) {
            return {
                isValid: false,
                message: `Введите оставшуюся часть адреса после символа ".". Адрес "${email}" - неполный.`
            };
        }

        // Проверка 6: доменная зона должна быть из списка разрешенных
        const hasValidTld = validTlds.some(tld => {
            return email.toLowerCase().endsWith('.' + tld);
        });

        if (!hasValidTld) {
            // Проверяем похожие доменные зоны для подсказок
            const possibleTlds = [];

            // Если пользователь ввел .co, возможно он имел в виду .com
            if (afterLastDot === 'co') {
                return {
                    isValid: false,
                    message: `Доменная зона ".co" не поддерживается. Возможно, вы имели в виду ".com"?`
                };
            }

            // Если пользователь ввел .or, возможно он имел в виду .org (но мы его не поддерживаем)
            // Так как мы не поддерживаем .org, просто скажем использовать допустимые
            if (afterLastDot === 'or') {
                return {
                    isValid: false,
                    message: `Доменная зона ".or" не поддерживается. Используйте допустимые домены: .com, .ru, .net, .by, .kz`
                };
            }

            // Если доменная зона короткая (1-2 символа), даем подсказку
            if (afterLastDot.length < 3) {
                // Проверяем возможные совпадения с допустимыми TLD
                const similarTlds = validTlds.filter(tld =>
                    tld.startsWith(afterLastDot.toLowerCase())
                );

                if (similarTlds.length > 0) {
                    const suggestions = similarTlds.map(tld => `.${tld}`).join(', ');
                    return {
                        isValid: false,
                        message: `Доменная зона ".${afterLastDot}" слишком короткая. Возможно, вы имели в виду: ${suggestions}?`
                    };
                }
            }

            // Общее сообщение для неподдерживаемых доменов
            return {
                isValid: false,
                message: `Доменная зона ".${afterLastDot}" не поддерживается. Используйте только допустимые домены: .com, .ru, .net, .by, .kz`
            };
        }

        // Дополнительная проверка: доменная зона должна быть завершена
        if (afterLastDot.length < 2) {
            return {
                isValid: false,
                message: `Доменная зона слишком короткая. Введите полную доменную зону (например, .com, .ru, .net, .by, .kz)`
            };
        }

        return { isValid: true };
    }

    // Функция для правильного склонения слова "цифра"
    getNumberWord(number, words) {
        const cases = [2, 0, 1, 1, 1, 2];
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]];
    }

    // Показать ошибку
    showError(element, message) {
        if (!element) return;

        // Убираем стандартное сообщение браузера
        element.setCustomValidity('');

        // Добавляем красную рамку
        element.style.border = '2px solid #ff4444';
        element.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.1)';

        // Удаляем старые сообщения об ошибках
        const oldError = element.parentNode.querySelector('.field-error');
        if (oldError) {
            oldError.remove();
        }

        // Создаем новый элемент для сообщения
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;

        // Стили для сообщения
        errorElement.style.cssText = `
            color: #ff4444;
            font-size: 13px;
            margin-top: 8px;
            padding: 10px 14px;
            background: #fff5f5;
            border-radius: 6px;
            border: 1px solid #ffcccc;
            box-shadow: 0 4px 12px rgba(255, 68, 68, 0.15);
            position: relative;
            z-index: 1000;
            max-width: calc(100% - 28px);
            word-wrap: break-word;
            animation: slideIn 0.3s ease-out;
            transform-origin: top center;
        `;

        // Добавляем стрелочку к сообщению
        errorElement.innerHTML += `
            <div class="error-arrow"></div>
        `;

        // Вставляем сообщение после поля
        element.parentNode.insertBefore(errorElement, element.nextSibling);

        // Настраиваем поведение показа/скрытия ошибки
        this.setupErrorBehavior(element, errorElement);

        // Фокусируемся на поле с ошибкой
        element.focus();

        // Сохраняем таймер для скрытия
        const timerId = setTimeout(() => {
            if (document.activeElement !== element) {
                this.hideError(errorElement);
            }
        }, 5000);

        this.errorTimers.set(errorElement, timerId);
    }

    // Настройка поведения показа/скрытия ошибки
    setupErrorBehavior(element, errorElement) {
        // Показываем ошибку при фокусе на поле
        element.addEventListener('focus', () => {
            this.showErrorElement(errorElement);
        });

        // Скрываем ошибку при уходе с поля
        element.addEventListener('blur', (e) => {
            setTimeout(() => {
                if (document.activeElement !== element) {
                    this.hideError(errorElement);
                }
            }, 300);
        });

        // Скрываем ошибку при вводе в поле
        element.addEventListener('input', () => {
            const timerId = this.errorTimers.get(errorElement);
            if (timerId) {
                clearTimeout(timerId);
                this.errorTimers.delete(errorElement);
            }

            // Скрываем ошибку через 1 секунду после начала ввода
            const hideTimer = setTimeout(() => {
                this.hideError(errorElement);
            }, 1000);

            this.errorTimers.set(errorElement, hideTimer);
        });

        // Позволяем кликнуть на сообщение об ошибке
        errorElement.addEventListener('click', (e) => {
            e.stopPropagation();
            element.focus();
        });
    }

    // Показать элемент с ошибкой
    showErrorElement(errorElement) {
        if (!errorElement) return;
        errorElement.style.display = 'block';
        errorElement.style.opacity = '1';
        errorElement.style.transform = 'scaleY(1)';
    }

    // Скрыть ошибку с анимацией
    hideError(errorElement) {
        if (!errorElement || !errorElement.parentNode) return;

        errorElement.style.opacity = '0';
        errorElement.style.transform = 'scaleY(0)';

        setTimeout(() => {
            if (errorElement && errorElement.parentNode) {
                errorElement.remove();
            }

            // Удаляем таймер
            const timerId = this.errorTimers.get(errorElement);
            if (timerId) {
                clearTimeout(timerId);
                this.errorTimers.delete(errorElement);
            }
        }, 300);
    }

    // Сбросить ошибку
    resetError(element) {
        if (!element) return;

        element.style.border = '';
        element.style.boxShadow = '';

        const errorElement = element.parentNode.querySelector('.field-error');
        if (errorElement) {
            this.hideError(errorElement);
        }

        // Удаляем таймер
        const timerId = this.errorTimers.get(element);
        if (timerId) {
            clearTimeout(timerId);
            this.errorTimers.delete(element);
        }
    }

    // УСЛОЖНЕННОЕ ЗАДАНИЕ: Создание прелоадера с крутящейся анимацией
    createPreloader() {
        if (!document.querySelector('#sendform-styles')) {
            const style = document.createElement('style');
            style.id = 'sendform-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px) scaleY(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scaleY(1);
                    }
                }
                
                /* Крутящийся прелоадер с эффектом 3D */
                .loading-spinner {
                    width: 70px;
                    height: 70px;
                    margin: 20px auto;
                    position: relative;
                    perspective: 800px;
                }
                
                .spinner-orbit {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    border-top-color: #4a6cf7;
                    animation: orbit 2s linear infinite;
                }
                
                .spinner-orbit:nth-child(2) {
                    border-top-color: #7b90ff;
                    animation-delay: 0.2s;
                    width: 85%;
                    height: 85%;
                    top: 7.5%;
                    left: 7.5%;
                }
                
                .spinner-orbit:nth-child(3) {
                    border-top-color: #a3b1ff;
                    animation-delay: 0.4s;
                    width: 70%;
                    height: 70%;
                    top: 15%;
                    left: 15%;
                }
                
                .spinner-core {
                    position: absolute;
                    width: 40%;
                    height: 40%;
                    top: 30%;
                    left: 30%;
                    background: #4a6cf7;
                    border-radius: 50%;
                    animation: pulse 1.5s ease-in-out infinite;
                }
                
                .spinner-dot {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    margin-top: -4px;
                    margin-left: -4px;
                    animation: pulse 1s ease-in-out infinite;
                    animation-delay: 0.5s;
                }
                
                @keyframes orbit {
                    0% {
                        transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg);
                    }
                    100% {
                        transform: rotateX(60deg) rotateY(0deg) rotateZ(360deg);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 0.8;
                    }
                }
                
                .form-status {
                    text-align: center;
                    padding: 10px;
                    margin: 15px 0;
                    min-height: 140px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                
                .status-success {
                    color: #28a745;
                    background-color: rgba(40, 167, 69, 0.1);
                    border: 2px solid #28a745;
                    padding: 15px 25px;
                    border-radius: 10px;
                    font-weight: 500;
                    font-size: 16px;
                    animation: slideIn 0.3s ease-out;
                }
                
                .status-error {
                    color: #dc3545;
                    background-color: rgba(220, 53, 69, 0.1);
                    border: 2px solid #dc3545;
                    padding: 15px 25px;
                    border-radius: 10px;
                    font-weight: 500;
                    font-size: 16px;
                    animation: slideIn 0.3s ease-out;
                }
                
                .status-loading {
                    color: #4a6cf7;
                    font-weight: 500;
                    margin-top: 20px;
                    font-size: 16px;
                    text-shadow: 0 0 10px rgba(74, 108, 247, 0.3);
                }
                
                .field-error {
                    display: block;
                    opacity: 1;
                    transform: scaleY(1);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .error-arrow {
                    position: absolute;
                    top: -6px;
                    left: 20px;
                    width: 10px;
                    height: 10px;
                    background: #fff5f5;
                    border-left: 1px solid #ffcccc;
                    border-top: 1px solid #ffcccc;
                    transform: rotate(45deg);
                }
            `;
            document.head.appendChild(style);
        }

        this.statusBlock.className = 'form-status';
    }

    // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Основная функция отправки формы
    submitForm() {
        const formElements = this.form.querySelectorAll('input, textarea');

        // Сбрасываем все ошибки
        formElements.forEach(input => this.resetError(input));

        // УСЛОЖНЕННОЕ ЗАДАНИЕ: Показ прелоадера
        this.showPreloader();

        // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Проверка комбинаций полей
        if (this.validateFormCombinations(formElements)) {
            // Форма валидна, собираем данные
            const formData = new FormData(this.form);
            const formBody = {};

            // Сбор данных формы
            formData.forEach((val, key) => {
                formBody[key] = val;
            });

            // Обработка дополнительных элементов
            this.someElem.forEach(elem => {
                const element = document.getElementById(elem.id);
                if (element) {
                    if (elem.type === 'block') {
                        formBody[elem.id] = element.textContent;
                    } else if (elem.type === 'input') {
                        formBody[elem.id] = element.value;
                    }
                }
            });

            console.log('Отправка формы:', formBody);

            // Отправка данных
            this.sendData(formBody)
                .then(data => {
                    console.log('Форма успешно отправлена:', data);
                    this.showSuccess();

                    // Очищаем поля после успешной отправки
                    setTimeout(() => {
                        formElements.forEach(input => {
                            input.value = '';
                        });
                        this.hidePreloader();
                    }, 2000);
                })
                .catch(error => {
                    console.error('Ошибка отправки формы:', error);
                    this.showErrorStatus(this.errorText);
                });
        } else {
            console.log('Форма не прошла валидацию комбинаций');
            this.hidePreloader();
        }
    }

    // УСЛОЖНЕННОЕ ЗАДАНИЕ: Методы для работы с прелоадером
    showPreloader() {
        this.statusBlock.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-orbit"></div>
                <div class="spinner-orbit"></div>
                <div class="spinner-orbit"></div>
                <div class="spinner-core"></div>
                <div class="spinner-dot"></div>
            </div>
            <div class="status-loading">${this.loadText}</div>
        `;
        this.form.appendChild(this.statusBlock);
    }

    hidePreloader() {
        this.statusBlock.innerHTML = '';
    }

    showSuccess() {
        this.statusBlock.innerHTML = `<div class="status-success">${this.successText}</div>`;
    }

    showErrorStatus(message) {
        this.statusBlock.innerHTML = `<div class="status-error">${message}</div>`;
        setTimeout(() => {
            this.hidePreloader();
        }, 5000);
    }

    // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Отправка данных на сервер
    sendData(data) {
        return fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ошибка: ${res.status}`);
            }
            return res.json();
        });
    }
}

// ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Автоматическая инициализация для всех форм
document.addEventListener('DOMContentLoaded', () => {
    console.log('Инициализация модуля отправки форм...');

    // Отключаем стандартную валидацию браузера для всех форм
    document.querySelectorAll('form').forEach(form => {
        form.setAttribute('novalidate', 'novalidate');
    });

    // Форма в модальном окне (id="form3")
    const modalForm = document.getElementById('form3');
    if (modalForm) {
        new SendForm('form3');
    }

    // Контактная форма внизу страницы (id="form2")
    const contactForm = document.getElementById('form2');
    if (contactForm) {
        new SendForm('form2');
    }

    // Главная форма на странице (id="form1")
    const mainForm = document.getElementById('form1');
    if (mainForm) {
        new SendForm('form1');
    }

    console.log('Модуль отправки форм готов к работе');
});