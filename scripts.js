document.addEventListener("DOMContentLoaded", function () {
  const apiKey = '41fcc38f282000fed686b801740f35f1';
  const currencyAPI = `https://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}`;
  const amountInput = document.getElementById('amount');
  const fromCurrencySelect = document.getElementById('fromCurrency');
  const toCurrencySelect = document.getElementById('toCurrency');
  const convertedAmountSpan = document.getElementById('convertedAmount');
  const allowedCurrencies = ['RUB', 'USD', 'EUR', 'THB'];
  const flagTake = document.getElementById('flagtake');
  const flagGet = document.getElementById('flagget');

  const startMoneyTake = document.getElementById('startmoneytake');
  const endMoneyTake = document.getElementById('endmoneytake');
  const startMoneyGet = document.getElementById('startmoneyget');
  const endMoneyGet = document.getElementById('endmoneyget');

  // Функция для обновления пути до флага
  function updateFlag(selectElement, imgElement) {
    const selectedCurrency = selectElement.value;
    if (selectedCurrency) {
      imgElement.src = `./img/flags/${selectedCurrency}.png`;
    } else {
      imgElement.src = ''; // Если валюта не выбрана
    }
  }

  // Функция для обновления курсов валют в спанах
  function updateExchangeRateSpans(data, fromCurrency, toCurrency) {
    let rateFromTo, rateToFrom;

    if (fromCurrency === "EUR") {
      rateFromTo = data.rates[toCurrency];
      rateToFrom = 1 / data.rates[toCurrency];
    } else if (toCurrency === "EUR") {
      rateFromTo = 1 / data.rates[fromCurrency];
      rateToFrom = data.rates[fromCurrency];
    } else {
      const rateToEUR = 1 / data.rates[fromCurrency];
      const rateFromEUR = data.rates[toCurrency];
      rateFromTo = rateToEUR * rateFromEUR;
      rateToFrom = 1 / rateFromTo;
    }

    startMoneyTake.textContent = `1 ${fromCurrency}`;
    endMoneyTake.textContent = `${rateFromTo.toFixed(4)} ${toCurrency}`;
    startMoneyGet.textContent = `1 ${toCurrency}`;
    endMoneyGet.textContent = `${rateToFrom.toFixed(4)} ${fromCurrency}`;
  }

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

        // Устанавливаем начальные значения флагов
        updateFlag(fromCurrencySelect, flagTake);
        updateFlag(toCurrencySelect, flagGet);
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
          const conversionRate = data.rates[toCurrency];
          convertedAmount = amount * conversionRate;
        } else if (toCurrency === "EUR") {
          const conversionRate = 1 / data.rates[fromCurrency];
          convertedAmount = amount * conversionRate;
        } else {
          const rateToEUR = 1 / data.rates[fromCurrency];
          const rateFromEUR = data.rates[toCurrency];
          convertedAmount = amount * rateToEUR * rateFromEUR;
        }

        convertedAmountSpan.textContent = convertedAmount.toFixed(2);

        // Обновляем спаны с курсами
        updateExchangeRateSpans(data, fromCurrency, toCurrency);
      } else {
        console.error('Ошибка при конвертации валют: ', data.error);
        convertedAmountSpan.textContent = "Ошибка при конвертации.";
      }
    } catch (error) {
      console.error('Ошибка при конвертации валют', error);
      convertedAmountSpan.textContent = "Ошибка при конвертации.";
    }
  }

  // Добавляем обработчик для ввода значения в поле ввода
  amountInput.addEventListener('input', convertCurrency);

  // Обновление флагов при изменении выбранной валюты
  fromCurrencySelect.addEventListener('change', () => updateFlag(fromCurrencySelect, flagTake));
  toCurrencySelect.addEventListener('change', () => updateFlag(toCurrencySelect, flagGet));

  // Инициализация данных
  fetchCurrencies();

  // Бургер-меню с затемнением
  const burger = document.querySelector('.burger');
  const burgerMenu = document.querySelector('.burger_menu');
  const navigation = document.querySelector('.menu_navigation');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  const items = {
    1400: document.querySelector('.navigation_curse'),
    1100: document.querySelector('.navigation_uslug'),
    1000: document.querySelector('.navigation_information'),
    900: document.querySelector('.information_btn'),
    800: document.querySelector('.information_phone'),
  };

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    burgerMenu.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      burger.classList.remove('open');
      burgerMenu.classList.remove('open');
      overlay.classList.remove('active');
    }
  });

  const moveToBurger = () => {
    const width = window.innerWidth;

    for (const breakpoint in items) {
      const item = items[breakpoint];
      if (width <= breakpoint) {
        if (item && !burgerMenu.contains(item)) {
          burgerMenu.appendChild(item);
        }
      } else {
        if (item && !navigation.contains(item)) {
          navigation.appendChild(item);
        }
      }
    }
  };

  window.addEventListener('resize', moveToBurger);
  moveToBurger();
});
