import app from "./app";
import db from "./config/db";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Check if database configuration is provided
    const hasDbConfig = Boolean(
      process.env.DB_HOST &&
      process.env.DB_USER &&
      process.env.DB_PASSWORD &&
      process.env.DB_NAME,
    );

    if (hasDbConfig) {
      await db.raw("SELECT 1"); // Test database connection
      console.log("Database connected successfully");
    } else {
      console.log("Database config missing");
    }

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
