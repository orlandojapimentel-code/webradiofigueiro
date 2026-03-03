import express from "express";
import path from "path";

const app = express();
app.use(express.json());

let db: any = null;
let memoryVisits = 10160;

// Initialize Database only if NOT on Vercel and in Dev
async function initDatabase() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    try {
      // Dynamic import to prevent crash on serverless environments
      const Database = (await import("better-sqlite3")).default;
      db = new Database("radio.db");
      db.exec(`
        CREATE TABLE IF NOT EXISTS stats (
          id TEXT PRIMARY KEY,
          value INTEGER
        )
      `);
      const initStats = db.prepare("INSERT OR IGNORE INTO stats (id, value) VALUES (?, ?)");
      initStats.run("visits", 10160);
      console.log("SQLite database initialized.");
    } catch (e) {
      console.warn("Database initialization failed, using memory fallback.");
    }
  }
}

// API Routes
app.get("/api/visits", (req, res) => {
  try {
    if (db) {
      const row = db.prepare("SELECT value FROM stats WHERE id = ?").get("visits") as { value: number };
      res.json({ count: row.value });
    } else {
      res.json({ count: memoryVisits });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch visits" });
  }
});

app.post("/api/visits/increment", (req, res) => {
  try {
    if (db) {
      db.prepare("UPDATE stats SET value = value + 1 WHERE id = ?").run("visits");
      const row = db.prepare("SELECT value FROM stats WHERE id = ?").get("visits") as { value: number };
      res.json({ count: row.value });
    } else {
      memoryVisits++;
      res.json({ count: memoryVisits });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to increment visits" });
  }
});

async function setupApp() {
  await initDatabase();

  if (process.env.NODE_ENV !== "production") {
    // Dynamic import for Vite (only in dev)
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

// Start server if not running as a Vercel function
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  setupApp().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else {
  // On Vercel, we just need to ensure the app is ready for the handler
  setupApp();
}

export default app;
