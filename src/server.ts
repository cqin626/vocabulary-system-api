import "dotenv/config";
import app from "./app.js";
import { logger } from "./config/logger.js";

const PORT = Number(process.env.PORT) || 3030;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT} `);
});
