document.addEventListener('DOMContentLoaded', () => {
  const passwordOutput = document.getElementById('passwordOutput');
  const copyBtn = document.getElementById('copyBtn');
  const lengthSlider = document.getElementById('lengthSlider');
  const lengthValue = document.getElementById('lengthValue');
  const uppercaseCheck = document.getElementById('uppercase');
  const lowercaseCheck = document.getElementById('lowercase');
  const numbersCheck = document.getElementById('numbers');
  const symbolsCheck = document.getElementById('symbols');
  const generateBtn = document.getElementById('generateBtn');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const toast = document.getElementById('toast');

  const chars = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  // Обновление цифры длины
  lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
    generatePassword();
  });

  // Генерация пароля
  function generatePassword() {
    let allowedChars = '';
    let password = '';

    if (uppercaseCheck.checked) allowedChars += chars.uppercase;
    if (lowercaseCheck.checked) allowedChars += chars.lowercase;
    if (numbersCheck.checked) allowedChars += chars.numbers;
    if (symbolsCheck.checked) allowedChars += chars.symbols;

    if (allowedChars === '') {
      passwordOutput.value = 'Выберите хотя бы 1 пункт';
      updateStrength(0);
      return;
    }

    const length = parseInt(lengthSlider.value, 10);
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      password += allowedChars[randomIndex];
    }

    passwordOutput.value = password;
    calculateStrength(password);
  }

  // Расчет надежности
  function calculateStrength(password) {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 14) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    updateStrength(score);
  }

  // Обновление полоски надежности
  function updateStrength(score) {
    if (score === 0) {
      strengthBar.style.width = '0%';
      strengthText.textContent = 'Сложность: —';
    } else if (score <= 2) {
      strengthBar.style.width = '33%';
      strengthBar.style.backgroundColor = '#ff4757'; // Красный
      strengthText.textContent = 'Сложность: Слабый';
    } else if (score <= 4) {
      strengthBar.style.width = '66%';
      strengthBar.style.backgroundColor = '#ffa502'; // Оранжевый
      strengthText.textContent = 'Сложность: Средний';
    } else {
      strengthBar.style.width = '100%';
      strengthBar.style.backgroundColor = '#2ed573'; // Зеленый
      strengthText.textContent = 'Сложность: Отличный';
    }
  }

  // Копирование в буфер обмена
  copyBtn.addEventListener('click', () => {
    const password = passwordOutput.value;
    if (!password || password.startsWith('Выберите')) return;

    navigator.clipboard.writeText(password).then(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    });
  });

  // Слушатели событий
  generateBtn.addEventListener('click', generatePassword);
  [uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(box => {
    box.addEventListener('change', generatePassword);
  });

  // Автогенерация при загрузке страницы
  generatePassword();
});