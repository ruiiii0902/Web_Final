(function initInfiniteSliders(){
  const sliders = document.querySelectorAll(".slider");
  if (!sliders.length) return;

  sliders.forEach(setup);

  function setup(root){
    const viewport = root.querySelector(".slider-viewport");
    const track = root.querySelector(".slider-track");
    const prevBtn = root.querySelector(".slider-btn.prev");
    const nextBtn = root.querySelector(".slider-btn.next");

    if (!track) return;

    const originals = Array.from(track.querySelectorAll(".slide")); // 原始 slide（不要手動複製）
    if (originals.length <= 1) return;

    let pos = 0;                 // track 目前所在的「slide索引」（包含clone）
    let cloneCount = 1;          // 依可視張數決定要複製幾張
    let isAnimating = false;
    let timer = null;
    let lastVisible = null;

    const autoplay = root.dataset.autoplay === "true";
    const interval = Number(root.dataset.interval || 4000);

    function visibleCount(){
      const v = getComputedStyle(root).getPropertyValue("--visible").trim();
      return Math.max(1, parseInt(v, 10) || 1);
    }

    function gapSize(){
      return parseFloat(getComputedStyle(track).gap) || 0;
    }

    function slideSize(){
      // 用 track 內第一張 slide 的寬度 + gap 當作每次位移距離
      const first = track.querySelector(".slide");
      const w = first ? first.getBoundingClientRect().width : 0;
      return w + gapSize();
    }

    function setTransform(noAnim){
      if (noAnim) track.style.transition = "none";
      const x = slideSize() * pos;
      track.style.transform = `translateX(${-x}px)`;
      if (noAnim) {
        // 強迫 reflow，確保 transition:none 生效
        track.offsetHeight; 
        track.style.transition = "";
      }
    }

    function removeClones(){
      track.querySelectorAll('[data-clone="1"]').forEach(n => n.remove());
    }

    function makeClone(node){
      const c = node.cloneNode(true);
      c.dataset.clone = "1";
      c.setAttribute("aria-hidden", "true");
      return c;
    }

    function build(){
      // 依目前裝置寬度決定可視張數 -> 決定 cloneCount
      const v = visibleCount();
      if (v === lastVisible && track.querySelector('[data-clone="1"]')) {
        // 仍建議更新一次位移（避免寬度改變）
        setTransform(true);
        return;
      }
      lastVisible = v;

      stop();

      removeClones();

      cloneCount = Math.min(v, originals.length);

      // 頭部放「最後 cloneCount 張」的 clone
      const head = originals.slice(-cloneCount).map(makeClone);
      head.forEach(c => track.insertBefore(c, track.firstChild));

      // 尾部放「前 cloneCount 張」的 clone
      const tail = originals.slice(0, cloneCount).map(makeClone);
      tail.forEach(c => track.appendChild(c));

      // 起始位置：跳到第一張「真正的原圖」(前面有 cloneCount 張 clone)
      pos = cloneCount;

      setTransform(true);
      start();
    }

    function go(delta){
      if (isAnimating) return;
      isAnimating = true;

      pos += delta;
      track.style.transition = "transform .4s ease";
      setTransform(false);
    }

    track.addEventListener("transitionend", () => {
      const n = originals.length;

      // 右邊超過尾端 clone 區：瞬間跳回原始區
      if (pos >= n + cloneCount) {
        pos = cloneCount + (pos - (n + cloneCount));
        setTransform(true);
      }

      // 左邊超過頭端 clone 區：瞬間跳到原始區尾端
      if (pos < cloneCount) {
        pos = n + pos; // 把 pos 拉回到原始區尾端對應位置
        setTransform(true);
      }

      isAnimating = false;
    });

    if (prevBtn) prevBtn.addEventListener("click", () => { go(-1); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { go(1);  restart(); });

    // 自動輪播（滑入停止，滑出繼續）
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);

    function start(){
      if (!autoplay) return;
      stop();
      timer = setInterval(() => go(1), interval);
    }
    function stop(){
      if (timer) clearInterval(timer);
      timer = null;
    }
    function restart(){
      if (!autoplay) return;
      stop();
      start();
    }

    // 重新計算：裝置寬度變化（可視張數可能改變）
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 120);
    });

    // 初始化
    build();
  }
})();
