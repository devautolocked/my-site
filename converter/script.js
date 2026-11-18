document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amountInput');
    const resultOutput = document.getElementById('resultOutput');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const swapBtn = document.getElementById('swapBtn');
    const rateText = document.getElementById('rateText');
    const lastUpdated = document.getElementById('lastUpdated');
    const popularGrid = document.getElementById('popularGrid');

    // Список валют с названиями и флагами
    const currencies = [
        { code: 'USD', name: 'USD — Доллар США' },
        { code: 'EUR', name: 'EUR — Евро' },
        { code: 'BYN', name: 'BYN — Белорусский рубль' },
        { code: 'RUB', name: 'RUB — Российский рубль' },
        { code: 'PLN', name: 'PLN — Польский злотый' },
        { code: 'UAH', name: 'UAH — Украинская гривна' },
        { code: 'KZT', name: 'KZT — Казахстанский тенге' },
        { code: 'GBP', name: 'GBP — Фунт стерлингов' },
        { code: 'CNY', name: 'CNY — Китайский юань' },
        { code: 'TRY', name: 'TRY — Турецкая лира' }
    ];

    let cachedRates = null;

    // Заполнение селектов
    function populateSelects() {
        currencies.forEach(curr => {
            const opt1 = new Option(curr.name, curr.code);
            const opt2 = new Option(curr.name, curr.code);
            fromCurrency.add(opt1);
            toCurrency.add(opt2);
        });

        fromCurrency.value = 'USD';
        toCurrency.value = 'BYN';
    }

    // Запрос курсов через бесплатный API
    async function fetchRates() {
        try {
            rateText.textContent = 'Обновление курсов...';
            // Используем надежный открытый API
            const response = await fetch('https://open.er-api.com/v6/latest/USD');
            
            if (!response.ok) throw new Error('Ошибка сети');
            
            const data = await response.json();
            cachedRates = data.rates;

            const date = new Date(data.time_last_update_utc);
            lastUpdated.textContent = `Обновлено: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            
            convert();
            renderPopularRates();
        } catch (error) {
            console.error('Ошибка загрузки валют:', error);
            rateText.textContent = 'Не удалось загрузить курсы валют';
            resultOutput.value = 'Ошибка';
        }
    }

    // Расчет конвертации
    function convert() {
        if (!cachedRates) return;

        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount < 0) {
            resultOutput.value = '0.00';
            return;
        }

        const from = fromCurrency.value;
        const to = toCurrency.value;

        // Переводим через базовую валюту USD
        const rateFrom = cachedRates[from];
        const rateTo = cachedRates[to];

        if (rateFrom && rateTo) {
            const result = (amount / rateFrom) * rateTo;
            resultOutput.value = result.toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
            });

            const singleRate = (1 / rateFrom) * rateTo;
            rateText.textContent = `1 ${from} = ${singleRate.toFixed(4)} ${to}`;
        }
    }

    // Рендер популярного блока (к USD)
    function renderPopularRates() {
        if (!cachedRates) return;
        popularGrid.innerHTML = '';

        const popular = ['EUR', 'BYN', 'RUB', 'PLN'];
        popular.forEach(code => {
            if (cachedRates[code]) {
                const item = document.createElement('div');
                item.className = 'popular-item';
                item.innerHTML = `
                    <div class="code">USD / ${code}</div>
                    <div class="val">${cachedRates[code].toFixed(2)}</div>
                `;
                popularGrid.appendChild(item);
            }
        });
    }

    // Смена валют местами
    swapBtn.addEventListener('click', () => {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        convert();
    });

    amountInput.addEventListener('input', convert);
    fromCurrency.addEventListener('change', convert);
    toCurrency.addEventListener('change', convert);

    // Инициализация
    populateSelects();
    fetchRates();
});