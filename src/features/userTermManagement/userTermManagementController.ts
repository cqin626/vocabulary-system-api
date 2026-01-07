import { Request, Response } from "express";
import {
  userTermManagementService,
  UserTermManagementService,
} from "./userTermManagementService.js";
import { z } from "zod";
import { UnauthorizedError } from "../../shared/errors/HTTPErrors.js";
import { sendSuccess } from "../../shared/utils/responseUtils.js";
import { UserTermFamiliarityEnumSchema } from "../../shared/types/userTermTypes.js";

const userTermSchema = z.object({
  userId: z.coerce.number().int(),
  termId: z.coerce.number().int(),
});
export class UserTermManagementController {
  constructor(private readonly userTermService: UserTermManagementService) {}

  getTermWithUserTermDetails = async (req: Request, res: Response) => {
    const text = z.string().trim().min(1).max(128).parse(req.params.text);
    const userId = req.user?.id;

    if (!userId)
      throw new UnauthorizedError("Authentication is required to proceed");

    const term = await this.userTermService.getTermWithUserTermDetails(
      text,
      userId
    );

    return sendSuccess(res, term, 200);
  };

  getUserTermsWithTermDetails = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId)
      throw new UnauthorizedError("Authentication is required to proceed");

    const sortableFields = z.enum(["createdAt", "familiarity", "text"]);
    const querySchema = z.object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(10),
      filter: UserTermFamiliarityEnumSchema.optional(),
      sort: z
        .string()
        .optional()
        .transform((orderyByString) => {
          const defaultOrderBy: Record<string, "asc" | "desc">[] = [
            { createdAt: "desc" },
          ];
          if (!orderyByString) return defaultOrderBy;
          const processedOrderBy = orderyByString
            .split(",")
            .map((orderByItem) => {
              const isDescending = orderByItem.startsWith("-");
              const field = isDescending
                ? orderByItem.substring(1)
                : orderByItem;
              const validatedField = sortableFields.parse(field);
              return {
                [validatedField]: isDescending ? "desc" : "asc",
              } as Record<string, "asc" | "desc">;
            })
            .filter((x): x is Record<string, "asc" | "desc"> => x !== null);
          return processedOrderBy.length > 0
            ? processedOrderBy
            : defaultOrderBy;
        }),
    });
    const { page, limit, sort, filter } = querySchema.parse(req.query);
    const userTermsWithTermDetails =
      await this.userTermService.getUserTermsWithTermDetails(userId, {
        page,
        limit,
        sort,
        filter,
      });

    return sendSuccess(res, userTermsWithTermDetails, 200);
  };

  addUserTerm = async (req: Request, res: Response) => {
    const { userId, termId } = userTermSchema.parse({
      userId: req.user?.id,
      termId: req.body?.termId,
    });

    const addedUserTerm = await this.userTermService.addUserTerm(
      userId,
      termId
    );

    return sendSuccess(res, addedUserTerm, 201);
  };

  deleteUserTerm = async (req: Request, res: Response) => {
    const { userId, termId } = userTermSchema.parse({
      userId: req.user?.id,
      termId: req.body?.termId,
    });

    const deletedTerm = await this.userTermService.deleteUserTerm(
      userId,
      termId
    );

    return sendSuccess(res, deletedTerm, 200);
  };

  updateUserTermFamiliarity = async (req: Request, res: Response) => {
    const { userId, termId } = userTermSchema.parse({
      userId: req.user?.id,
      termId: req.body?.termId,
    });

    const familiarity = UserTermFamiliarityEnumSchema.parse(
      req.body?.familiarity
    );

    const updatedTerm = await this.userTermService.updateUserTermFamiliarity(
      userId,
      termId,
      familiarity
    );

    return sendSuccess(res, updatedTerm, 200);
  };
}

export const userTermManagementController = new UserTermManagementController(
  userTermManagementService
);
