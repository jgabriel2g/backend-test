import express from "express";
import { GithubController } from "../controllers/githubController";
import Github from "../repositories/githubRepository";
import { GithubUseCase } from "../../application/usecases/github";

const router = express.Router();

const repository = new Github();
const usecase = new GithubUseCase(repository);
const controller = new GithubController(usecase);

router.get("/google", (req, res) =>
  controller.getRepositoriesByGoogle(req, res)
);

export default router;
