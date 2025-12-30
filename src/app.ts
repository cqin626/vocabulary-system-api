import express from "express";
import routerV1 from "./routes/routeV1.js";

const app = express();

app.use("/api/v1", routerV1);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Endpoint not found",
    },
  });
});

export default app;
