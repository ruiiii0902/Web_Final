
(function(){

  // 專門初始化店家介紹頁
  function initStoreDetail(dataArray) {

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

    if (!listEl || !mapFrame || !Array.isArray(dataArray)) return;

    // 左側店家列表產生
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

    // 顯示資料
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

    // 點左側切換資料
    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".store-btn");
      if (!btn) return;

      listEl.querySelectorAll(".store-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      showStore(btn.dataset.id);
    });

    // 預設顯示第一間
    if (dataArray.length > 0) {
      showStore(dataArray[0].id);
    }
  }

  // 暴露到全域，以便各個頁面呼叫
  window.initStoreDetail = initStoreDetail;

})();
