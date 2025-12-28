import express from "express";
import "dotenv/config"

const app = express();
const PORT = Number(process.env.PORT) || 3030;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});
