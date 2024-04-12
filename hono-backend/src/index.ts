import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { MazeInputValidationFunction } from "../../Maze/backend/src/validations/MazeInputValidation";
import { GenerateMaze } from "../../Maze/backend/src/Maze/GenerateMaze";
import { env } from "hono/adapter";

const app = new Hono();

app.use(logger());
app.use(
  "/api/*",
  cors({
    origin: ["https://maze-game-teal.vercel.app", "http://localhost:5173"],
  })
);

app.use("/api/generate", async (c, next) => {
  const body = await c.req.json();
  const validate = MazeInputValidationFunction(body);
  if (!validate.success) {
    c.json({ success: false, message: validate });
  }
  next();
});

app.post("/api/generate", async (c) => {
  // data validation
  const body = await c.req.json();
  const { rows, columns, algorithmName, animation } = body;
  const MazeObj = new GenerateMaze(rows, columns);
  const MazeGrid = MazeObj.generateNewMaze(
    algorithmName.toLowerCase().split(" ").join(""),
    animation
  );
  return c.json({ success: true, data: MazeGrid });
});

export default app;
