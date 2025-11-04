import readline from "node:readline";
import { processMR } from "./gitlab";
import { processPR } from "./github";

const inputReader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function listenTerminal() {
  const answer = await new Promise<string>((resolve) => {
    inputReader.question(
      "What's the Merge Request or Pull Request url?\n",
      (input) => {
        resolve(input);
      }
    );
  });

  switch (true) {
    case answer.includes("gitlab.com"): {
      console.log("=================================");
      console.log("🔍 Detected GitLab Merge Request...");
      const parts = answer.split("/");
      const projectId = parseInt(parts[7]);
      const mrIid = parseInt(parts[10]);

      await processMR(projectId, mrIid);
      break;
    }
    case answer.includes("github.com"): {
      console.log("=================================");
      console.log("🔍 Detected GitHub pull request...");
      const parts = answer.split("/");
      const owner = parts[3];
      const repo = parts[4];
      const prNumber = parseInt(parts[6]);

      await processPR(owner, repo, prNumber);
      break;
    }
    default: {
      console.log("❌ Unsupported URL format.");
    }
  }

  listenTerminal();
}

inputReader.on("close", () => {
  console.log("Terminal input closed.");
});
