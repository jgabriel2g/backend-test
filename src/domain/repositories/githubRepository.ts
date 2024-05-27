import { repositoryReponse } from "../entities/response";

export interface GithubRepository {
  getMostPopularRepositoriesByUsername(
    username: string,
    page: number,
    per_page: number
  ): Promise<repositoryReponse[]>;
}
