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

export class UserTermManagementService {
  constructor(
    private readonly generationService: AITermGenerationService,
    private readonly termService: TermManagementService,
    private readonly userTermRepo: UserTermManagementRepository
  ) {}

  async getTerm(text: string) {
    const [foundTerm, err] = await safePromise(
      this.termService.getTermByText(text)
    );

    if (err instanceof ResourceNotFoundError) {
      const aiGeneratedTerm = await this.generationService.generateTerm(text);

      if (aiGeneratedTerm) {
        const newTerm = await this.termService.insertTerm(aiGeneratedTerm);
        return newTerm;
      } else {
        throw new ResourceNotFoundError("Invalid term");
      }
    }

    if (err) throw err;

    return foundTerm;
  }
}

export const userTermManagementService = new UserTermManagementService(
  aiTermGenerationService,
  termManagementService,
  userTermManagementRepo
);
