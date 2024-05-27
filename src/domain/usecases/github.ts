import { repositoryReponse } from "../../domain/entities/response";

export interface Github {
  getMostPopularRepositoriesByGoogle(): Promise<repositoryReponse[]>;
}
