import app from "./app";
import db from "./config/db";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // check DB connection
    await db.raw("SELECT 1");
    console.log("Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    server.on("error", (err) => {
      console.error("Server error", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
}

startServer();
