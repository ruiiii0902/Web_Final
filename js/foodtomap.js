
(function(){
  if (typeof food_tainan === "undefined") return;

  const listEl   = document.getElementById("storeList");

  const nameEl   = document.getElementById("storeName");
  const catEl    = document.getElementById("storeCategory");
  const areaEl   = document.getElementById("storeArea");
  const addrEl   = document.getElementById("storeAddress");
  const foodEl   = document.getElementById("storeFood");
  const priceEl  = document.getElementById("storePrice");
  const introEl  = document.getElementById("storeIntro");
  const hoursEl  = document.getElementById("storeHours");
  const mapFrame = document.getElementById("mapFrame");

  if (!listEl || !mapFrame) return;

  // 左側列表產生
  food_tainan.forEach((store, idx) => {
    const li = document.createElement("li");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "store-btn";
    btn.dataset.id = store.id;
    btn.textContent = store.name;

    if (idx === 0) btn.classList.add("active");

    li.appendChild(btn);
    listEl.appendChild(li);
  });

  // 顯示資料
  function showStore(storeId){
    const store = food_tainan.find(s => s.id === storeId);
    if (!store) return;

    nameEl.textContent  = store.name;
    catEl.textContent   = store.category;
    areaEl.textContent  = store.area;
    addrEl.textContent  = store.address;
    foodEl.textContent  = store.food;
    priceEl.textContent = store.price;
    introEl.textContent = store.intro;
    hoursEl.textContent  = store.businessHours || "—";
    mapFrame.src = store.mapEmbed;
  }

  // 點左側切換資料 + 地圖
  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".store-btn");
    if (!btn) return;

    listEl.querySelectorAll(".store-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    showStore(btn.dataset.id);
  });

  // 預設載入第一間
  if (food_tainan.length > 0) {
    showStore(food_tainan[0].id);
  }
})();
