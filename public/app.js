async function fetchAndRender() {
  try {
    const response = await fetch("http://localhost:3000/api/prayer/today", { cache: "no-store" });
    if (!response.ok) throw new Error(`Http error ${response.status}`);
    const data = await response.json();

    // put the data into the DOM
    document.getElementById("fajr-adhan-time").textContent = data.dailyPrayerTimes[0].time;
    document.getElementById("fajr-iqama-time").textContent = data.dailyPrayerTimes[0].iqamah;
    document.getElementById("dhuhr-adhan-time").textContent = data.dailyPrayerTimes[2].time;
    document.getElementById("dhuhr-iqama-time").textContent = data.dailyPrayerTimes[2].iqamah;
    document.getElementById("asr-adhan-time").textContent = data.dailyPrayerTimes[3].time;
    document.getElementById("asr-iqama-time").textContent = data.dailyPrayerTimes[3].iqamah;
    document.getElementById("maghrib-adhan-time").textContent = data.dailyPrayerTimes[4].time;
    document.getElementById("maghrib-iqama-time").textContent = data.dailyPrayerTimes[4].iqamah;
    document.getElementById("isha-adhan-time").textContent = data.dailyPrayerTimes[5].time;
    document.getElementById("isha-iqama-time").textContent = data.dailyPrayerTimes[5].iqamah;
    document.getElementById("sunrise-time").textContent = data.dailyPrayerTimes[1].time;
    document.getElementById("jumuah-time").textContent = data.jumaahTime;

    const noticesBox = document.getElementById("notices");
    noticesBox.style.display = 'none';
    noticesBox.textContent = '';
    noticesBox.innerHTML = '';  

    for (const notice of data.notices) {
      const p = document.createElement('p');
      p.textContent = "* " + notice + " *";
      noticesBox.appendChild(p);
      noticesBox.style.display = 'block';
    }

  } catch (error) {
    console.error("Error fetching error:", error);
  }
}

function getDelayToNext(hour, minute) {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);

  if (target <= now) target.setDate(target.getDate() + 1);

  return target.getTime() - now.getTime();
}

function scheduleNextRefresh() {
  const delay = getDelayToNext(3, 5); // 3:05 AM
  const hours = Math.floor(delay / (1000 * 60 * 60));
  const minutes = Math.floor((delay % (1000 * 60 * 60)) / (1000 * 60));

  setTimeout(async () => {
    console.log("[TV] Refresh tick at", new Date().toLocaleString());
    await fetchAndRender();
    scheduleNextRefresh();
  }, delay);
}

fetchAndRender();
scheduleNextRefresh();
