/* ==========================================================================
   EINSTELLUNGEN Woche 4 – freiwillige Lehreransicht
   ==========================================================================
   Nur die Werte rechts vom Doppelpunkt ändern.
   ========================================================================== */
var W4_CONFIG = {

  // Adresse des eigenen Cloudflare-Workers für die Lehreransicht (Projekt „kb1-notfall-w4“,
  // siehe README_W4.md). Leer ('') = keine Meldungen; die Übungen laufen dann ganz allein.
  // Die Handys melden nur anonym ihren Fortschritt (Schritt x von n, fertig) – ohne Raumcode, ohne Namen.
  WORKER_URL: 'https://kb1-notfall-w4.klawittersven.workers.dev',

  // Die Lehreransicht zeigt die Handys, die sich in den letzten so vielen Minuten gemeldet haben (höchstens 60).
  FORTSCHRITT_MINUTEN: 45,

  // So viele Sekunden wartet die Lehreransicht zwischen zwei Abfragen.
  ABFRAGE_SEKUNDEN: 10
};
