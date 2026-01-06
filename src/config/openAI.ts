import OpenAI from "openai";
import { getEnvVarOrThrow } from "../shared/utils/envUtils.js";
import { logger } from "./logger.js";

export class OpenAIClient {
  constructor(private readonly openai: OpenAI) {}

  async getNonReasoningModelResponse<T = unknown>(options: {
    devPrompt: string;
    userInput: string;
    model: string;
    maxOutputTokens?: number;
    temperature?: number;
  }): Promise<T> {
    const response = await this.openai.responses.create({
      model: options.model,
      instructions: options.devPrompt,
      input: `Return the result as JSON.\n\n${options.userInput}`,
      text: {
        format: {
          type: "json_object",
        },
      },
      temperature: options.temperature ?? null,
      max_output_tokens: options.maxOutputTokens ?? null,
      store: false,
    });

    logger.info(
      {
        responseId: response.id,
        model: response.model,
        status: response.status,
        error: response.error,
        temperature: response.temperature,
        textFormat: response.text?.format?.type,
        inputTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens,
      },
      "OpenAI response generated"
    );
    return JSON.parse(response.output_text) as T;
  }
}

const openai = new OpenAI({
  apiKey: getEnvVarOrThrow("OPENAI_API_KEY"),
  timeout: 30 * 1000,
});

export const openaiClient = new OpenAIClient(openai);
