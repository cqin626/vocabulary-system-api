import { Request, Response } from "express";
import {
  userTermManagementService,
  UserTermManagementService,
} from "./userTermManagementService.js";
import { z } from "zod";
import { sendSuccess } from "../../shared/utils/responseUtils.js";

export class UserTermManagementController {
  constructor(private readonly userTermService: UserTermManagementService) {}

  getTerm = async (req: Request, res: Response) => {
    const text = z.string().trim().min(1).max(128).parse(req.params.text);
    const term = await this.userTermService.getTerm(text);

    return sendSuccess(res, term, 200);
  };

  addUserTerm = async (req: Request, res: Response) => {
    const userTermSchema = z.object({
      userId: z.coerce.number().int(),
      termId: z.coerce.number().int(),
    });
    const { userId, termId } = userTermSchema.parse({
      userId: req.user?.id,
      termId: req.body?.termId,
    });

    const addedUserTerm = await this.userTermService.addUserTerm(userId, termId);

    return sendSuccess(res, addedUserTerm, 201)
  };
}

export const userTermManagementController = new UserTermManagementController(
  userTermManagementService
);
