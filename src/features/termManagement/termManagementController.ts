import { Request, Response } from "express";
import { z } from "zod";
import {
  TermManagementService,
  termManagementService,
} from "./termManagementService.js";
import { sendSuccess } from "../../shared/utils/responseUtils.js";
import { NewTermSchema } from "../../shared/types/termTypes.js";

export class TermManagementController {
  constructor(private readonly service: TermManagementService) {}

  getTermByText = async (req: Request, res: Response) => {
    const text = z.string().trim().min(1).max(128).parse(req.params.text);
    const term = await this.service.getTermByText(text);

    return sendSuccess(res, term, 200);
  };

  getTerms = async (req: Request, res: Response) => {
    const querySchema = z.object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(10),
    });
    const { page, limit } = querySchema.parse(req.query);
    const terms = await this.service.getTerms(page, limit);

    return sendSuccess(res, terms, 200);
  };

  insertTerm = async (req: Request, res: Response) => {
    const newTerm = NewTermSchema.parse(req.body);
    const term = await this.service.insertTerm(newTerm);

    return sendSuccess(res, term, 201);
  };
}

export const termManagementController = new TermManagementController(
  termManagementService
);
