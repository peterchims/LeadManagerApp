import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { leadsRouter } from "./routes/leads";

const app = express();
const PORT = process.env.PORT ?? 4000;
const ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";

app.use(cors({ origin: ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/leads", leadsRouter);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Lead Manager API listening on http://localhost:${PORT}`);
});
