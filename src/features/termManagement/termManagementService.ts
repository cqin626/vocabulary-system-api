import {
  TermManagementRepository,
  termManagementRepo,
} from "./termManagementRepository.js";
import {
  TermNotFoundError,
  InvalidNewTermError,
} from "../../shared/errors/termErrors.js";
import { NewTerm } from "../../shared/types/termTypes.js";

export class TermManagementService {
  constructor(private readonly repo: TermManagementRepository) {}

  async getTermByText(text: string) {
    const term = await this.repo.getTermByText(text);

    if (!term) throw new TermNotFoundError("Term not found");

    return term;
  }

  async getTerms(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await this.repo.getTerms(skip, limit);
  }

  async insertTerm(newTerm: NewTerm) {
    const termExists = await this.repo.termExists(newTerm.text);

    if (termExists) throw new InvalidNewTermError("Term already exists");

    const term = await this.repo.insertTerm(newTerm);

    return term;
  }
}

export const termManagementService = new TermManagementService(
  termManagementRepo
);
