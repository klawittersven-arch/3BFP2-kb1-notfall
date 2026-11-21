/* ==========================================================================
   EINSTELLUNGEN Woche 4 – optionale Lehreransicht
   ==========================================================================
   Nur die Werte rechts vom Doppelpunkt ändern.
   ========================================================================== */
var W4_CONFIG = {

  // Adresse des eigenen Cloudflare-Workers für die Lehreransicht (Projekt „kb1-notfall-w4“,
  // siehe README_W4.md). Leer ('') = Lehreransicht aus; die Übungen laufen dann ganz allein.
  // Die Übungen laufen auch ohne erreichbaren Worker vollständig – der Raumcode ist freiwillig.
  WORKER_URL: 'https://kb1-notfall-w4.klawittersven.workers.dev',

  // So viele Stunden merkt sich ein Handy Raumcode und Gruppennamen.
  RAUMCODE_GUELTIG_STUNDEN: 3,

  // So viele Sekunden wartet die Lehreransicht zwischen zwei Abfragen.
  ABFRAGE_SEKUNDEN: 4,

  // Gruppennamen: Enthält ein Name eines dieser Wörter (Groß-/Kleinschreibung egal), wird er abgelehnt.
  SPERRWOERTER: [
    'arsch', 'fick', 'fotze', 'hure', 'nutte', 'wichs', 'schlampe', 'bitch',
    'fuck', 'shit', 'scheis', 'kacke', 'pisse', 'penis', 'pimmel', 'schwanz',
    'muschi', 'vagina', 'titte', 'porn', 'sex', 'nazi', 'hitler',
    'neger', 'nigg', 'kanake', 'zigeuner', 'schwuchtel', 'spast', 'mongo',
    'behindert', 'missgeburt', 'bastard', 'wixer', 'wixxer', 'opfer',
    'dick', 'cock', 'pussy', 'slut', 'whore', 'cunt', 'kill'
  ]
};
