import OpenAI from "openai";

let openai: OpenAI | null = null;

function createOpenAIClient(): OpenAI {
  const config: any = {};

  if (process?.env?.OPENAI_API_KEY) {
    config.apiKey = process.env.OPENAI_API_KEY;
  } else {
    throw new Error(
      "No OpenAI API key found in environment variables. Please set OPENAI_API_KEY."
    );
  }

  return new OpenAI(config);
}

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = createOpenAIClient();
  }
  return openai;
}

export async function reviewDiff(diff: string): Promise<string> {
  const truncated = diff.slice(0, 15000); // limit token usage

  const openaiClient = getOpenAIClient();

  const completion = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a senior code reviewer. Provide concise, high-quality feedback on the following Git diff. Focus on code quality, clarity, maintainability, and potential issues. Format your answer as markdown.",
      },
      { role: "user", content: truncated },
    ],
  });

  return completion.choices[0].message?.content ?? "No review generated.";
}
