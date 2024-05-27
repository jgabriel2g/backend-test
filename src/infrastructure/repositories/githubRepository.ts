import axios from "axios";
import { GithubRepository } from "../../domain/repositories/githubRepository";
import { repositoryReponse } from "../../domain/entities/response";

export default class Github implements GithubRepository {
  async getMostPopularRepositoriesByUsername(
    username: string,
    page: number,
    per_page: number
  ): Promise<repositoryReponse[]> {
    try {
      const url = `https://api.github.com/users/${username}/repos`;
      const params = {
        type: "owner",
        sort: "stargazers",
        direction: "desc",
        page: page,
        per_page: per_page,
      };

      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching repositories:", error);
      throw new Error("Failed to fetch repositories");
    }
  }
}
