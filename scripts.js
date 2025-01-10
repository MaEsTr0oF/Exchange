document.addEventListener("DOMContentLoaded", function () {
  const apiKey = 'a3da5983d9a3a5ff55ab2eba7e917147';
  const currencyAPI = `https://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}`;
  const amountInput = document.getElementById('amount');
  const fromCurrencySelect = document.getElementById('fromCurrency');
  const toCurrencySelect = document.getElementById('toCurrency');
  const convertButton = document.getElementById('convert');
  const convertedAmountSpan = document.getElementById('convertedAmount');
  const allowedCurrencies = ['RUB', 'USD', 'EUR', 'THB', 'TRY', 'KZT'];

  // Получение данных через API
  async function fetchCurrencies() {
    try {
      const response = await fetch(currencyAPI);
      const data = await response.json();

      if (data.success) {
        const currencies = Object.keys(data.rates);

        // Заполняем выпадающие списки только разрешёнными валютами
        currencies.forEach((currency) => {
          if (allowedCurrencies.includes(currency)) {
            const optionFrom = document.createElement('option');
            optionFrom.value = currency;
            optionFrom.textContent = currency;
            fromCurrencySelect.appendChild(optionFrom);

            const optionTo = document.createElement('option');
            optionTo.value = currency;
            optionTo.textContent = currency;
            toCurrencySelect.appendChild(optionTo);
          }
        });
      } else {
        console.error('Ошибка при получении данных: ', data.error);
        convertedAmountSpan.textContent = "Ошибка загрузки валют.";
      }
    } catch (error) {
      console.error('Ошибка при получении данных', error);
      convertedAmountSpan.textContent = "Ошибка загрузки валют.";
    }
  }

  // Функция для конвертации валют
  async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (!fromCurrency || !toCurrency) {
      convertedAmountSpan.textContent = "Выберите валюты для конвертации.";
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      convertedAmountSpan.textContent = "Введите корректную сумму.";
      return;
    }

    try {
      // Получаем данные о курсах валют
      const response = await fetch(`${currencyAPI}`);
      const data = await response.json();

      if (data.success) {
        let convertedAmount;

        if (fromCurrency === "EUR") {
          // Прямая конвертация из EUR
          const conversionRate = data.rates[toCurrency];
          convertedAmount = amount * conversionRate;
        } else if (toCurrency === "EUR") {
          // Прямая конвертация в EUR
          const conversionRate = 1 / data.rates[fromCurrency];
          convertedAmount = amount * conversionRate;
        } else {
          // Двойная конвертация через EUR
          const rateToEUR = 1 / data.rates[fromCurrency];
          const rateFromEUR = data.rates[toCurrency];
          convertedAmount = amount * rateToEUR * rateFromEUR;
          convertedAmount *= 1.03;
        }

        convertedAmountSpan.textContent = convertedAmount.toFixed(2);
      } else {
        console.error('Ошибка при конвертации валют: ', data.error);
        convertedAmountSpan.textContent = "Ошибка при конвертации.";
      }
    } catch (error) {
      console.error('Ошибка при конвертации валют', error);
      convertedAmountSpan.textContent = "Ошибка при конвертации.";
    }
  }

  // Событие нажатия кнопки конвертации
  convertButton.addEventListener('click', convertCurrency);

  // Инициализация данных
  fetchCurrencies();
});
