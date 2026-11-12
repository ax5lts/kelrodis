CREATE TABLE IF NOT EXISTS entrance_reports (id INTEGER PRIMARY KEY AUTOINCREMENT, entrance_id INTEGER NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS entrance_reports_lookup ON entrance_reports (entrance_id, reason, created_at);
