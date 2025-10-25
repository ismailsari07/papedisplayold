// public/active-highlighter.js
(function () {
  function timeToTodayDate(hhmm, key) {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date();
    d.setHours(
      key == "fajr" || key == "sunrise" || h == 12 ? h : h + 12,
      m,
      0,
      0,
    );
    return d;
  }

  function getOrderFromTimes(times) {
    return [
      { key: "fajr", at: timeToTodayDate(times.fajr, "fajr") },
      { key: "sunrise", at: timeToTodayDate(times.sunrise, "sunrise") },
      { key: "dhuhr", at: timeToTodayDate(times.dhuhr, "dhuhr") },
      { key: "asr", at: timeToTodayDate(times.asr, "asr") },
      { key: "maghrib", at: timeToTodayDate(times.maghrib, "maghrib") },
      { key: "isha", at: timeToTodayDate(times.isha, "isha") },
    ];
  }

  function getEndOfDay() {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }

  function setActivePrayerCard(key) {
    const ids = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
    ids.forEach((k) => {
      const el = document.getElementById(`card-${k}`);
      if (!el) return;
      el.classList.toggle("active", k === key);
    });
  }

  function computeCurrentPrayerKey(times) {
    const order = getOrderFromTimes(times);
    const now = new Date();

    for (let i = 0; i < order.length; i++) {
      const start = order[i].at;
      const next = i < order.length - 1 ? order[i + 1].at : getEndOfDay();
      if (now >= start && now < next) return order[i].key;
    }
    if (now < order[0].at) return "isha";
    return null;
  }

  let activeTickerId = null;
  function startActivePrayerTicker(times) {
    const first = computeCurrentPrayerKey(times);
    setActivePrayerCard(first);

    if (activeTickerId) clearInterval(activeTickerId);

    activeTickerId = setInterval(() => {
      const key = computeCurrentPrayerKey(times);
      setActivePrayerCard(key);
    }, 30 * 1000);
  }

  // global export
  window.ActiveHighlighter = { startActivePrayerTicker };
})();
