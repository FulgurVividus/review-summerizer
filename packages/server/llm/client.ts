import OpenAI from "openai";

type GenerateTextOptions = {
  model?: string;
  prompt: string;
  instructions?: string;
  temperature?: number;
  maxTokens?: number;
  previousResponseId?: string;
};

type GenerateTextResult = {
  id: string;
  text: string;
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const llmClient = {
  async generateText({
    model = "gbt-4.1",
    prompt,
    instructions,
    temperature = 0.2,
    maxTokens = 300,
    previousResponseId,
  }: GenerateTextOptions): Promise<GenerateTextResult> {
    const response = await client.responses.create({
      model: model,
      input: prompt,
      instructions: instructions,
      temperature: temperature,
      max_output_tokens: maxTokens,
      previous_response_id: previousResponseId,
    });

    return {
      id: response.id,
      text: response.output_text,
    };
  },
};
