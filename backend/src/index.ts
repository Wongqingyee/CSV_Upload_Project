import express from "express";
import cors from "cors";
import uploadRouter from "./upload";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/", uploadRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
