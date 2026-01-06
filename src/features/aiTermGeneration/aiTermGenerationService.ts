import { openaiClient, OpenAIClient } from "../../config/openAI.js";
import { termGenerationPrompt } from "./aiTermGenerationPrompts.js";
import { SenseType, TermType } from "../../shared/types/termTypes.js";

type ValidTerm = {
  isValidTerm: true;
  term: string;
  senses: SenseType[];
};

type InvalidTerm = {
  isValidTerm: false;
  term: string;
  senses: [];
};

type GeneratedTerm = ValidTerm | InvalidTerm;

export class AITermGenerationService {
  constructor(private readonly openaiClient: OpenAIClient) {}

  async generateTerm(text: string): Promise<TermType | null> {
    const generatedTerm =
      await this.openaiClient.getNonReasoningModelResponse<GeneratedTerm>({
        devPrompt: termGenerationPrompt(3),
        userInput: text,
        model: "gpt-4.1-mini",
        maxOutputTokens: 32768,
        temperature: 0,
      });

    return generatedTerm?.isValidTerm
      ? {
          text: generatedTerm.term,
          senses: generatedTerm.senses.map((sense) => ({
            type: sense.type,
            definition: sense.definition,
            examples: sense.examples,
          })),
        }
      : null;
  }
}

export const aiTermGenerationService = new AITermGenerationService(
  openaiClient
);
