(function(){

  function initStoreDetail(dataArray) {

    const listEl   = document.getElementById("storeList");

    const nameEl   = document.getElementById("storeName");
    const catEl    = document.getElementById("storeCategory");
    const areaEl   = document.getElementById("storeArea");
    const addrEl   = document.getElementById("storeAddress");
    const foodEl   = document.getElementById("storeFood");
    const priceEl  = document.getElementById("storePrice");
    const hoursEl  = document.getElementById("storeHours");
    const introEl  = document.getElementById("storeIntro");
    const mapFrame = document.getElementById("mapFrame");

    if (!listEl || !mapFrame || !Array.isArray(dataArray)) return;

    // 建立左側列表（僅建立一次）
    listEl.innerHTML = "";
    dataArray.forEach((store, idx) => {
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

    // 顯示店家資訊（只更新 table + map）
    function showStore(storeId){
      const store = dataArray.find(s => s.id === storeId);
      if (!store) return;

      nameEl.textContent  = store.name;
      catEl.textContent   = store.category;
      areaEl.textContent  = store.area;
      addrEl.textContent  = store.address;
      foodEl.textContent  = store.food;
      priceEl.textContent = store.price;
      hoursEl.textContent = store.businessHours || "—";
      introEl.textContent = store.intro;

      mapFrame.src = store.mapEmbed;
    }

    // 左側按鈕 → 切換地圖 + 更新表格資料
    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".store-btn");
      if (!btn) return;

      listEl.querySelectorAll(".store-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      showStore(btn.dataset.id);
    });

    // 預設顯示第一項
    if (dataArray.length > 0) {
      showStore(dataArray[0].id);
    }
  }

  window.initStoreDetail = initStoreDetail;

})();
