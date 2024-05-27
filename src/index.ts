import express from "express";
import config from "./infrastructure/config/config";
import githubRouter from "./infrastructure/routes/githubRoutes";

const PORT = config.port;
const app = express();

app.use(express.json());

app.get("/ping", async (_, res) => {
  res.send("pong!!!");
});
app.use("/api", githubRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
