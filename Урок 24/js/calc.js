// Класс калькулятора стоимости для всех типов объектов
class Calculator {
    constructor() {
        // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Инициализация базовых параметров
        this.basePrices = {
            '1': 100,    // Интерьер Квартиры
            '1.4': 120,  // Интерьер Частного дома  
            '2': 110     // Интерьер Офиса
        };

        this.totalValue = 0;

        // Получаем элементы DOM
        this.calcBlock = document.querySelector('.calc-block');
        this.calcType = document.querySelector('.calc-type');
        this.calcSquare = document.querySelector('.calc-square');
        this.calcCount = document.querySelector('.calc-count');
        this.calcDay = document.querySelector('.calc-day');
        this.totalElement = document.getElementById('total');

        this.init();
    }

    // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Инициализация обработчиков событий
    init() {
        this.calcBlock.addEventListener('input', (e) => {
            if (e.target === this.calcType || e.target === this.calcSquare ||
                e.target === this.calcCount || e.target === this.calcDay) {
                this.calculateTotal();
            }
        });
    }

    // ОБЯЗАТЕЛЬНОЕ ЗАДАНИЕ: Расчет общей стоимости
    calculateTotal() {
        const calcTypeValue = parseFloat(this.calcType.value) || 0;
        const calcSquareValue = parseFloat(this.calcSquare.value) || 0;

        let calcCountValue = 1;
        let calcDayValue = 1;

        // Расчет коэффициента количества помещений
        if (this.calcCount.value && this.calcCount.value > 1) {
            calcCountValue = 1 + (parseFloat(this.calcCount.value) / 10);
        }

        // Расчет коэффициента срока исполнения
        if (this.calcDay.value) {
            const days = parseFloat(this.calcDay.value);
            if (days < 5) {
                calcDayValue = 2;
            } else if (days < 10) {
                calcDayValue = 1.5;
            } else {
                calcDayValue = 1;
            }
        }

        // Вычисление итоговой стоимости
        if (calcTypeValue && calcSquareValue) {
            const basePrice = this.basePrices[this.calcType.value] || 100;
            this.totalValue = basePrice * calcTypeValue * calcSquareValue * calcCountValue * calcDayValue;
        } else {
            this.totalValue = 0;
        }

        this.totalValue = Math.round(this.totalValue);

        // УСЛОЖНЕННОЕ ЗАДАНИЕ: Запуск анимации изменения суммы
        this.animateTotal();
    }

    // УСЛОЖНЕННОЕ ЗАДАНИЕ: Анимация изменения общей стоимости
    animateTotal() {
        const targetValue = this.totalValue;
        const currentValue = +this.totalElement.textContent;

        if (currentValue === targetValue) return;

        const duration = 1000;
        const startTime = performance.now();
        const startValue = currentValue;

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutQuart);

            this.totalElement.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.totalElement.textContent = targetValue;
            }
        };

        requestAnimationFrame(animate);
    }
}

// Автоматическая инициализация калькулятора
new Calculator(); 