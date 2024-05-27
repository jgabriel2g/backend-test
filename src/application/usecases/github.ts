import { repositoryReponse } from "../../domain/entities/response";
import { GithubRepository } from "../../domain/repositories/githubRepository";
import { Github } from "../../domain/usecases/github";

export class GithubUseCase implements Github {
  constructor(private repository: GithubRepository) {}

  async getMostPopularRepositoriesByGoogle(): Promise<repositoryReponse[]> {
    return await this.repository.getMostPopularRepositoriesByUsername(
      "google",
      1,
      10
    );
  }
}
