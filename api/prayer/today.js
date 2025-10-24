// api/prayer/today.js
import { supabase } from "../../lib/supabase.js";

export default async function handler(req, res) {
  try {
    // Opsiyonel: şehir veya tarih parametreleri

    let query = await supabase
      .from("prayer_cache")
      .select("*")
      .limit(1)
      .order("date", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("[today] supabase error:", error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-store, max-age=0");
      return res.end(JSON.stringify({ error: "db_error" }));
    }

    const row = data?.[0];
    if (!row) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-store, max-age=0");
      return res.end(JSON.stringify({ error: "not_found" }));
    }

    console.log(data);
    const payload = {
      date: row.date, // ör: "2025-10-23"
      dailyPrayerTimes: row.payload.dailyPrayerTimes,
      jumaahTime: row.payload.jumaaPrayerTime,
      updatedAt: row.fetched_at, // ISO string
      notices: row.payload?.notices || [],
    };

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.end(JSON.stringify(payload));
  } catch (e) {
    console.error("[today] unexpected:", e);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.end(JSON.stringify({ error: "server_error" }));
  }
}
