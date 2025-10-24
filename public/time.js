function formatTime(date) {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatGregorian(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format Hijri date using Latin (English) month names when possible
function formatHijriLatin(date) {
  try {
    // Use English locale with Islamic calendar -- modern browsers should return Latin month names
    const fmt = new Intl.DateTimeFormat("en-US-u-ca-islamic", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return fmt.format(date);
  } catch (e) {
    // Fallback: try Arabic islamic calendar and transliterate common month names
    try {
      let arabic = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
      const mapping = {
        محرم: "Muharram",
        صفر: "Safar",
        "ربيع الأول": "Rabi al-Awwal",
        "ربيع الآخر": "Rabi al-Thani",
        "جمادى الأولى": "Jumada al-Ula",
        "جمادى الآخرة": "Jumada al-Akhirah",
        رجب: "Rajab",
        شعبان: "Sha'ban",
        رمضان: "Ramadan",
        شوال: "Shawwal",
        "ذو القعدة": "Dhu al-Qi'dah",
        "ذو الحجة": "Dhu al-Hijjah",
      };
      Object.keys(mapping).forEach(function (ar) {
        arabic = arabic.replace(new RegExp(ar, "g"), mapping[ar]);
      });
      // Replace Arabic-Indic digits with Latin digits if present
      arabic = arabic.replace(/[٠-٩]/g, function (d) {
        return "٠١٢٣٤٥٦٧٨٩".indexOf(d);
      });
      return arabic;
    } catch (e2) {
      return "Hijri date not supported";
    }
  }
}

function updateNow() {
  const now = new Date();
  const timeEl = document.getElementById("time");
  if (timeEl) {
    let hhmm = formatTime(now).substring(0, 5);
    let ampm = formatTime(now).substring(6);
    timeEl.innerHTML =
      hhmm + `<span class="text-7xl text-neutral-400">${ampm.toLowerCase()}</span>`;
  }
  const greg = document.getElementById("gregorian");
  if (greg) greg.textContent = formatGregorian(now);
  const hijriLatin = document.getElementById("hijri_latine");
  if (hijriLatin) hijriLatin.textContent = formatHijriLatin(now);
}

updateNow();
setInterval(updateNow, 1000);
