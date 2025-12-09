(() => {
let timer; //計時器
  let isSpinning = false; // 判斷目前是否正在抽籤中
  let baseFoodNames = []; // 存放從外部資料載入的餐廳清單
  let customFoodNames = []; // 存放使用者手動新增的餐廳清單

  function collectFoodData() {
    // 定義資料來源，使用 typeof 檢查變數是否存在，避免報錯
    const sources = [
      typeof food_tainan !== 'undefined' ? food_tainan : [],
      typeof food_ramen !== 'undefined' ? food_ramen : [],
      typeof food_japaness !== 'undefined' ? food_japaness : [],
      typeof food_noodles !== 'undefined' ? food_noodles : [],
      typeof food_beef !== 'undefined' ? food_beef : [],
      typeof food_midnight !== 'undefined' ? food_midnight : []
    ];

    const names = [];
    const seen = new Set();
    sources.forEach(list => {
      if (!Array.isArray(list)) return;
      list.forEach(item => {
        if (!item || !item.name) return;
        const name = String(item.name).trim();
        if (!name || seen.has(name)) return;  // 如果名字是空的或已經出現過，就跳過
        seen.add(name);
        names.push(name);
      });
    });
    return names;
  }

  function getFoodNames() {
    return [...baseFoodNames, ...customFoodNames];
  }

  function renderTable() {
    const tbody = document.querySelector('#food-table tbody');
    if (!tbody) return;

    const foods = getFoodNames();

    if (!foods.length) {
      tbody.innerHTML = '<tr><td colspan="2">目前沒有資料</td></tr>';
      return;
    }

    tbody.innerHTML = foods
      .map((name, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${name}</td>
        </tr>
      `)
      .join('');
  }

  function startSpin() {
    const btn = document.getElementById('spin-btn');
    const resultText = document.getElementById('result-text');
    if (!btn || !resultText) return;

    const foods = getFoodNames();
    if (!foods.length) {
      resultText.innerText = '沒有可抽的餐廳';
      return;
    }

    if (isSpinning) return;
    isSpinning = true;
    btn.innerText = '選取中...';
    btn.style.backgroundColor = '#95a5a6';

    let counter = 0;
    const speed = 50;

    // 設定計時器，快速隨機切換顯示文字
    timer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * foods.length);
      resultText.innerText = foods[randomIndex];
      counter++;

      // 跑30 次後停止
      if (counter > 30) {
        clearInterval(timer);
        showResult(foods);
      }
    }, speed);
  }

  function showResult(foods) {
    const resultText = document.getElementById('result-text');
    const btn = document.getElementById('spin-btn');
    if (!resultText || !btn) return;

    const finalChoice = foods[Math.floor(Math.random() * foods.length)];

    resultText.innerText = finalChoice;
    isSpinning = false;
    btn.innerText = '再抽一次';
    btn.style.backgroundColor = '#e74c3c';
  }

  function addNewOption() {
    const input = document.getElementById('new-name');
    if (!input) return;

    const name = input.value.trim();
    if (!name) {
      alert('請輸入餐廳名稱');
      return;
    }

    customFoodNames.push(name);
    input.value = '';

    renderTable();

    const resultText = document.getElementById('result-text');
    if (resultText && getFoodNames().length) {
      resultText.innerText = 'Ready?';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    baseFoodNames = collectFoodData();
    const resultText = document.getElementById('result-text');
    if (resultText) {
      resultText.innerText = getFoodNames().length ? 'Ready?' : '沒有可抽的餐廳';
    }
    renderTable();
    const addBtn = document.getElementById('add-btn');
    if (addBtn) addBtn.addEventListener('click', addNewOption);
  });

  window.startSpin = startSpin;
})();
