import {
  aiTermGenerationService,
  AITermGenerationService,
} from "../aiTermGeneration/aiTermGenerationService.js";
import {
  termManagementService,
  TermManagementService,
} from "../termManagement/termManagementService.js";
import {
  userTermManagementRepo,
  UserTermManagementRepository,
} from "./userTermManagementRepository.js";
import {
  ResourceNotFoundError,
  ConflictError,
} from "../../shared/errors/HTTPErrors.js";
import { safePromise } from "../../shared/utils/promiseUtils.js";
import { Prisma } from "../../generated/prisma/client.js";
import { UserTermFamiliarityEnum } from "../../shared/types/userTermTypes.js";

const userTermSelect = {
  userId: true,
  termId: true,
  familiarity: true,
  createdAt: true,
};

export class UserTermManagementService {
  constructor(
    private readonly generationService: AITermGenerationService,
    private readonly termService: TermManagementService,
    private readonly userTermRepo: UserTermManagementRepository
  ) {}

  private async getTerm(text: string) {
    const [foundTerm, err] = await safePromise(
      this.termService.getTermByText(text)
    );

    if (foundTerm) return foundTerm;

    if (!(err instanceof ResourceNotFoundError)) {
      throw err;
    }

    const aiGeneratedTerm = await this.generationService.generateTerm(text);

    if (!aiGeneratedTerm) {
      throw new ResourceNotFoundError("Invalid term");
    }

    // User may enter misspelled word, and the corrected word by ai during term generation may already exists in the database
    const [correctedTerm, correctedErr] = await safePromise(
      this.termService.getTermByText(aiGeneratedTerm.text)
    );

    if (correctedTerm) return correctedTerm;

    // Insert only if truly new
    return this.termService.insertTerm(aiGeneratedTerm);
  }

  async getTermWithUserTermDetails(text: string, userId: number) {
    const term = await this.getTerm(text);
    const userTerm = await this.userTermRepo.getUserTermDetails(
      term.id,
      userId,
      userTermSelect
    );
    return { ...term, userTerm: userTerm };
  }

  async getUserTermsWithTermDetails(
    userId: number,
    options: {
      page: number;
      limit: number;
      sort: Record<string, "asc" | "desc">[];
    }
  ) {
    return await this.userTermRepo.getUserTermsWithTermDetails(userId, {
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      orderBy: options.sort,
    });
  }

  async addUserTerm(userId: number, termId: number) {
    const userTermExists = await this.userTermRepo.userTermExists(
      userId,
      termId
    );

    if (userTermExists)
      throw new ConflictError("Term already added by the user");

    return await this.userTermRepo.insertUserTerm(
      userId,
      termId,
      userTermSelect
    );
  }

  async deleteUserTerm(userId: number, termId: number) {
    const userTermExists = await this.userTermRepo.userTermExists(
      userId,
      termId
    );

    if (userTermExists) {
      return await this.userTermRepo.deleteUserTerm(userId, termId);
    } else throw new ResourceNotFoundError("UserTerm does not exist");
  }

  async updateUserTermFamiliarity(
    userId: number,
    termId: number,
    familiarity: UserTermFamiliarityEnum
  ) {
    const userTermExists = await this.userTermRepo.userTermExists(
      userId,
      termId
    );

    if (userTermExists) {
      return await this.userTermRepo.updateUserTermFamiliarity(
        userId,
        termId,
        familiarity
      );
    } else throw new ResourceNotFoundError("UserTerm does not exist");
  }
}

export const userTermManagementService = new UserTermManagementService(
  aiTermGenerationService,
  termManagementService,
  userTermManagementRepo
);
