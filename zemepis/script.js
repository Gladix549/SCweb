function vyhodnotit() {
  let score = 0;
  let total = 0;

  // === ANO / NE ===
  document.querySelectorAll(".question").forEach(q => {
    total++;
    const correct = q.dataset.correct;
    const checked = q.querySelector("input:checked");

    q.classList.remove("correct", "wrong");

    let info = q.querySelector(".correct-answer");
    if (!info) {
      info = document.createElement("div");
      info.className = "correct-answer";
      q.appendChild(info);
    }

    if (checked && checked.value === correct) {
      score++;
      q.classList.add("correct");
      info.textContent = "";
    } else {
      q.classList.add("wrong");
      info.textContent = `Správná odpověď: ${correct.toUpperCase()}`;
    }
  });

  // === DOPLŇOVAČKY ===
  document.querySelectorAll("input[type='text']").forEach(input => {
    total++;
    const user = input.value.trim().toLowerCase();
    const correct = input.dataset.answer.toLowerCase();

    let info = input.nextElementSibling;
    if (!info || !info.classList.contains("correct-answer")) {
      info = document.createElement("span");
      info.className = "correct-answer";
      input.after(info);
    }

    input.classList.remove("correct", "wrong");

    if (user === correct) {
      score++;
      input.classList.add("correct");
      info.textContent = "";
    } else {
      input.classList.add("wrong");
      info.textContent = ` ← správně: ${correct}`;
    }
  });

  // === ABCD (checkboxy) ===
  document.querySelectorAll(".mc").forEach(mc => {
    total++;
    const correct = mc.dataset.correct;
    const checked = [...mc.querySelectorAll("input:checked")].map(i => i.value);

    mc.classList.remove("correct", "wrong");

    let info = mc.querySelector(".correct-answer");
    if (!info) {
      info = document.createElement("div");
      info.className = "correct-answer";
      mc.appendChild(info);
    }

    // správně je POUZE jedna možnost a nesmí být vybráno nic navíc
    if (checked.length === 1 && checked[0] === correct) {
      score++;
      mc.classList.add("correct");
      info.textContent = "";
    } else {
      mc.classList.add("wrong");
      info.textContent = `Správná odpověď: ${correct})`;
    }
  });

  const procenta = Math.round((score / total) * 100);
  const znamka = vypocetZnamky(score, total);

  document.getElementById("vysledek").innerHTML =
    `Skóre: ${score} / ${total} (${procenta} %)<br>Známka: <strong>${znamka}</strong>`;
}

function vypocetZnamky(score, total) {
  const procenta = (score / total) * 100;

  if (procenta >= 90) return 1;
  if (procenta >= 75) return 2;
  if (procenta >= 60) return 3;
  if (procenta >= 50) return 4;
  return 5;
}

function resetTest() {
  document.querySelectorAll("input").forEach(i => {
    i.checked = false;
    i.value = "";
    i.classList.remove("correct", "wrong");
  });

  document.querySelectorAll(".question, .mc").forEach(el => {
    el.classList.remove("correct", "wrong");
  });

  document.querySelectorAll(".correct-answer").forEach(el => {
    el.textContent = "";
  });

  document.getElementById("vysledek").textContent = "";
}

window.addEventListener("load", () => {
  resetTest();
});
