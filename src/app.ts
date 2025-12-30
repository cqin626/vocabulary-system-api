import express from "express";

const app = express();

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Endpoint not found",
    },
  });
});

export default app;
