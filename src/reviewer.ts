import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function reviewDiff(diff: string): Promise<string> {
  const truncated = diff.slice(0, 15000); // limit token usage

  const completion = await openai.chat.completions.create({
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
