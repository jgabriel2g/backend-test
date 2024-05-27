import { Request, Response } from "express";
import { Github } from "../../domain/usecases/github";

export class GithubController {
  constructor(private githubUseCase: Github) {}

  async getRepositoriesByGoogle(_req: Request, res: Response) {
    try {
      const result =
        await this.githubUseCase.getMostPopularRepositoriesByGoogle();
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
