import app from "./app";
import db from "./config/db";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (
      process.env.DB_HOST &&
      process.env.DB_USER &&
      process.env.DB_PASSWORD &&
      process.env.DB_NAME
    ) {
      await db.raw("SELECT 1");
      console.log("Database connected successfully");
    } else {
      console.log("Database config missing");
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
}

startServer();
