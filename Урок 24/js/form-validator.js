/**
 * Валидация форм для калькулятора и контактных данных
 * в рамках выполнения Урока 21
 */

class FormValidator {
    constructor() {
        this.init();
    }

    init() {
        // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Валидация калькулятора (только цифры)
        this.initCalculatorValidation();

        // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Валидация всех форм
        this.initFormsValidation();

        // УСЛОЖНЕННОЕ ЗАДАНИЕ: Обработка blur событий
        this.initBlurValidation();
    }

    // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Валидация полей калькулятора (только цифры)
    initCalculatorValidation() {
        const calcFields = document.querySelectorAll('.calc-square, .calc-count, .calc-day');

        calcFields.forEach(field => {
            field.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        });
    }

    // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Валидация всех форм на странице
    initFormsValidation() {
        // Все текстовые поля (имена)
        const nameFields = document.querySelectorAll('input[type="text"][name*="name"]');
        nameFields.forEach(field => {
            field.addEventListener('input', (e) => {
                // Только кириллица, пробел и дефис
                e.target.value = e.target.value.replace(/[^а-яёА-ЯЁ\s\-]/g, '');
            });
        });

        // Поля сообщений - разрешаем кириллицу, пробелы, дефисы и знаки препинания
        const messageFields = document.querySelectorAll('textarea[name*="message"], textarea[placeholder="Ваше сообщение"], input[placeholder="Ваше сообщение"]');
        messageFields.forEach(field => {
            field.addEventListener('input', (e) => {
                // Кириллица, пробел, дефис и основные знаки препинания
                e.target.value = e.target.value.replace(/[^а-яёА-ЯЁ\s\-\.,:;!?]/g, '');
            });
        });

        // Email поля
        const emailFields = document.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            field.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z0-9@_\-\.!~*']/g, '');
            });
        });

        // Телефонные поля
        const phoneFields = document.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            field.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9()\-]/g, '');
            });
        });
    }

    // УСЛОЖНЕННОЕ ЗАДАНИЕ: Обработка blur событий с корректировкой данных
    initBlurValidation() {
        const allFields = document.querySelectorAll(`
            input[type="text"][name*="name"], 
            textarea[name*="message"],
            textarea[placeholder="Ваше сообщение"],
            input[placeholder="Ваше сообщение"],
            input[type="email"],
            input[type="tel"]
        `);

        allFields.forEach(field => {
            field.addEventListener('blur', (e) => {
                this.processFieldValidation(e.target);
            });
        });
    }

    // УСЛОЖНЕННОЕ ЗАДАНИЕ: Основная логика обработки поля при потере фокуса
    processFieldValidation(field) {
        let value = field.value;

        // Если поле пустое, выходим
        if (!value.trim()) return;

        // 1. Удаляем все символы, кроме допустимых
        value = this.removeInvalidChars(field, value);

        // 2. Заменяем несколько пробелов/дефисов подряд на один
        value = this.normalizeSpacesAndDashes(value);

        // 3. Убираем пробелы и дефисы в начале и конце
        value = value.trim().replace(/^[\s\-]+|[\s\-]+$/g, '');

        // 4. Применяем соответствующее форматирование регистра
        if (this.isNameField(field)) {
            // Для полей имен - Capitalize каждое слово
            value = this.capitalizeWords(value);
        } else if (this.isMessageField(field)) {
            // Для полей сообщений - первая буква каждого предложения заглавная
            value = this.capitalizeSentences(value);
        }

        // Устанавливаем новое значение
        field.value = value;
    }

    // Проверка, является ли поле полем имени
    isNameField(field) {
        return field.type === 'text' && field.name.includes('name');
    }

    // Проверка, является ли поле полем сообщения
    isMessageField(field) {
        return field.tagName === 'TEXTAREA' ||
            field.getAttribute('placeholder') === 'Ваше сообщение' ||
            field.name.includes('message');
    }

    // УСЛОЖНЕННОЕ ЗАДАНИЕ: Удаление недопустимых символов
    removeInvalidChars(field, value) {
        // Для полей имен
        if (this.isNameField(field)) {
            return value.replace(/[^а-яёА-ЯЁ\s\-]/g, '');
        }

        // Для полей сообщений
        if (this.isMessageField(field)) {
            return value.replace(/[^а-яёА-ЯЁ\s\-\.,:;!?]/g, '');
        }

        // Для email полей
        if (field.type === 'email') {
            return value.replace(/[^a-zA-Z0-9@_\-\.!~*']/g, '');
        }

        // Для телефонных полей
        if (field.type === 'tel') {
            return value.replace(/[^0-9()\-]/g, '');
        }

        return value;
    }

    // УСЛОЖНЕННОЕ ЗАДАНИЕ: Нормализация пробелов и дефисов
    normalizeSpacesAndDashes(value) {
        return value.replace(/\s+/g, ' ').replace(/\-+/g, '-');
    }

    // УСЛОЖНЕННОЕ ЗАДАНИЕ: Capitalize каждое слово (для полей имен)
    capitalizeWords(value) {
        return value.toLowerCase().replace(/(^|\s)([а-яё])/g, (match, p1, p2) => {
            return p1 + p2.toUpperCase();
        });
    }

    // Capitalize первая буква каждого предложения (для полей сообщений)
    capitalizeSentences(value) {
        // Сначала приводим весь текст к нижнему регистру
        value = value.toLowerCase();

        // Разбиваем на предложения по знакам препинания
        const sentences = value.split(/([.!?]+\s*)/);

        // Обрабатываем каждое предложение
        for (let i = 0; i < sentences.length; i++) {
            // Если это начало предложения (нечетный индекс после разбиения)
            if (i % 2 === 0 && sentences[i].trim()) {
                // Находим первую букву в предложении
                const firstLetterIndex = sentences[i].search(/[а-яё]/);
                if (firstLetterIndex !== -1) {
                    // Заменяем первую букву на заглавную
                    const before = sentences[i].substring(0, firstLetterIndex);
                    const firstLetter = sentences[i].substring(firstLetterIndex, firstLetterIndex + 1);
                    const after = sentences[i].substring(firstLetterIndex + 1);
                    sentences[i] = before + firstLetter.toUpperCase() + after;
                }
            }
        }

        // Собираем предложения обратно
        return sentences.join('');
    }
}

// Автоматическая инициализация
new FormValidator();