// public/active-highlighter.js
(function () {
  function timeToTodayDate(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }

  function setActivePrayerCard(key) {
    const ids = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
    ids.forEach((k) => {
      const el = document.getElementById(`card-${k}`);
      if (el) el.classList.toggle("prayer-card--active", k === key);
    });
  }

  function computeCurrentPrayerKey(times) {
    const order = [
      { key: "fajr", at: timeToTodayDate(times.fajr) },
      { key: "sunrise", at: timeToTodayDate(times.sunrise) },
      { key: "dhuhr", at: timeToTodayDate(times.dhuhr) },
      { key: "asr", at: timeToTodayDate(times.asr) },
      { key: "maghrib", at: timeToTodayDate(times.maghrib) },
      { key: "isha", at: timeToTodayDate(times.isha) },
    ];
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const now = new Date();

    for (let i = 0; i < order.length; i++) {
      const start = order[i].at;
      const next = i < order.length - 1 ? order[i + 1].at : endOfDay;
      if (now >= start && now < next) return order[i].key;
    }
    if (now < order[0].at) return "isha";
    return null;
  }

  let activeTickerId = null;
  function startActivePrayerTicker(times) {
    const first = computeCurrentPrayerKey(times);
    if (first) setActivePrayerCard(first);
    if (activeTickerId) clearInterval(activeTickerId);
    activeTickerId = setInterval(() => {
      const key = computeCurrentPrayerKey(times);
      if (key) setActivePrayerCard(key);
    }, 30 * 1000);
  }

  // global export
  window.ActiveHighlighter = { startActivePrayerTicker };
})();
