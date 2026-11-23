
const rewards = [
    {
      id: "gold",
      name: "Solid Gold Kasane Teto",
      type: "Week 4 Gold Outfit",
      odds: 1562500,
      color: "#f0c65e",
      mark: "GOLD"
    },
    {
      id: "token",
      name: "Pirate Shop Access",
      type: "Access Token",
      odds: 137500,
      color: "#f0c65e",
      mark: "TOKEN"
    },
    {
      id: "vehicle",
      name: "Weekly Vehicle & Decal",
      type: "Vehicle Reward",
      odds: 7813,
      color: "#e9a94e",
      mark: "VEHICLE"
    },
    {
      id: "pickaxe",
      name: "Weekly Pickaxe or Back Bling",
      type: "Cosmetic Reward",
      odds: 568,
      color: "#65baff",
      mark: "COSMETIC"
    },
    {
      id: "jam",
      name: "Weekly Jam Track",
      type: "Jam Track",
      odds: 391,
      color: "#bb91ff",
      mark: "JAM"
    },
    {
      id: "loading",
      name: "Weekly Loading Screen",
      type: "Loading Screen",
      odds: 272,
      color: "#65baff",
      mark: "ART"
    },
    {
      id: "gizmo",
      name: "Gizmo (Any)",
      type: "Gizmo",
      odds: 127,
      color: "#69d99a",
      mark: "GIZMO"
    }
  ];
  
  const $ = id => document.getElementById(id);
  
  let chestsOpened = 0;
  let treasuresFound = 0;
  let busy = false;
  
  function formatNumber(value) {
    return value.toLocaleString("en-US");
  }
  
  function geometricGap(probability) {
    return Math.floor(
      Math.log(1 - Math.random()) / Math.log(1 - probability)
    ) + 1;
  }
  
  function simulateReward(reward, chestCount) {
    const probability = 1 / reward.odds;
    let gap = geometricGap(probability);
    let count = 0;
  
    while (gap <= chestCount) {
      count++;
      gap += geometricGap(probability);
    }
  
    return count;
  }
  
  function makeCard(reward, count) {
    const card = document.createElement("article");
    card.className = "reward-card";
    card.style.setProperty("--reward-color", reward.color);
  
    const art = document.createElement("div");
    art.className = "reward-art";
    art.textContent = reward.mark;
  
    const name = document.createElement("div");
    name.className = "reward-name";
    name.textContent = reward.name;
  
    const type = document.createElement("div");
    type.className = "reward-type";
    type.textContent = reward.type;
  
    const amount = document.createElement("div");
    amount.className = "reward-count";
    amount.textContent =
      count > 1
        ? `FOUND ${formatNumber(count)} TIMES`
        : "TREASURE FOUND";
  
    card.append(art, name, type, amount);
  
    return card;
  }
  
  function showFinds(finds) {
    if (finds.length === 0) return;
  
    $("results").querySelector(".empty")?.remove();
  
    finds.forEach(({ reward, count }) => {
      $("results").prepend(makeCard(reward, count));
      treasuresFound += count;
    });
  
    $("treasuresFound").textContent = formatNumber(treasuresFound);
    $("resultLabel").textContent =
      `${formatNumber(treasuresFound)} TREASURES FOUND`;
  }
  
  function animateChest() {
    $("chest").classList.add("open");
  
    setTimeout(() => {
      $("chest").classList.remove("open");
    }, 190);
  }
  
  function setBusy(value) {
    busy = value;
  
    ["one", "hundred", "thousand", "untilButton", "reset"].forEach(id => {
      const button = $(id);
      if (button) button.disabled = value;
    });
  
    $("target").disabled = value;
  }
  
  function openBatch(count) {
    if (busy) return;
  
    setBusy(true);
    $("status").textContent =
      `OPENING ${formatNumber(count)} CHESTS...`;
  
    const finds = [];
  
    rewards.forEach(reward => {
      const found = simulateReward(reward, count);
  
      if (found > 0) {
        finds.push({ reward, count: found });
      }
    });
  
    chestsOpened += count;
  
    $("chestsOpened").textContent = formatNumber(chestsOpened);
  
    showFinds(finds);
    animateChest();
  
    $("status").textContent = finds.length
      ? `${finds.length} TREASURE TYPES FOUND`
      : "NO TREASURE FOUND THIS TIME";
  
    setBusy(false);
  }
  
  function openUntilFound() {
    if (busy) return;
  
    const reward = rewards.find(
      item => item.id === $("target").value
    );
  
    if (!reward) return;
  
    setBusy(true);
  
    $("status").textContent =
      `SEARCHING FOR ${reward.name.toUpperCase()}...`;
  
    const needed = geometricGap(1 / reward.odds);
    const finds = [];
  
    rewards.forEach(other => {
      if (other.id === reward.id) return;
  
      const found = simulateReward(other, needed);
  
      if (found > 0) {
        finds.push({ reward: other, count: found });
      }
    });
  
    finds.push({ reward, count: 1 });
  
    chestsOpened += needed;
  
    $("chestsOpened").textContent = formatNumber(chestsOpened);
  
    showFinds(finds);
    animateChest();
  
    $("status").textContent =
      `FOUND ${reward.name.toUpperCase()} AFTER ${formatNumber(needed)} CHESTS!`;
  
    setBusy(false);
  }
  
  function resetSimulator() {
    if (busy) return;
  
    const confirmed = confirm(
      "Are you sure you want to reset all your simulator stats?"
    );
  
    if (!confirmed) return;
  
    chestsOpened = 0;
    treasuresFound = 0;
  
    $("chestsOpened").textContent = "0";
    $("treasuresFound").textContent = "0";
    $("resultLabel").textContent = "0 TREASURES FOUND";
  
    $("results").innerHTML = `
      <div class="empty">
        No treasures found yet. Open a chest!
      </div>
    `;
  
    $("status").textContent = "SIMULATOR RESET";
  
    $("chest").classList.remove("open");
  }
  
  function renderOdds() {
    const list = $("oddsList");
    list.innerHTML = "";
  
    rewards.forEach(reward => {
      const item = document.createElement("div");
      item.className = "odds-item";
      item.style.setProperty("--reward-color", reward.color);
  
      const name = document.createElement("div");
      name.className = "odds-name";
      name.textContent = reward.name;
  
      const rate = document.createElement("div");
      rate.className = "odds-rate";
      rate.textContent = `1 in ${formatNumber(reward.odds)}`;
  
      item.append(name, rate);
      list.appendChild(item);
    });
  }
  
  function renderTargetOptions() {
    const select = $("target");
    select.innerHTML = "";
  
    rewards.forEach(reward => {
      const option = document.createElement("option");
      option.value = reward.id;
      option.textContent = reward.name;
      select.appendChild(option);
    });
  }
  
  $("one").addEventListener("click", () => openBatch(1));
  $("hundred").addEventListener("click", () => openBatch(100));
  $("thousand").addEventListener("click", () => openBatch(1000));
  $("untilButton").addEventListener("click", openUntilFound);
  $("reset").addEventListener("click", resetSimulator);
  
  renderOdds();
  renderTargetOptions();
  