import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { processPR } from "./github";
import { processMR } from "./gitlab";
import { listenTerminal } from "./inputReader";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Basic validation for required environment variables
if (
  !process.env.GITHUB_PERSONAL_ACCESS_TOKEN &&
  !process.env.GITLAB_PERSONAL_ACCESS_TOKEN
) {
  console.error(
    "❌ Error: At least one of GITHUB_PERSONAL_ACCESS_TOKEN or GITLAB_PERSONAL_ACCESS_TOKEN must be set."
  );
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Error: OPENAI_API_KEY must be set.");
  process.exit(1);
}

app.post("/webhook/github", async (req, res) => {
  console.log("=================================");
  console.log("🔔 Received GitHub webhook event!", req);
  const event = req.body;
  let review = "";

  if (
    event.action === "opened" ||
    event.action === "edited" ||
    event.action === "reopened" ||
    event.action === "synchronize"
  ) {
    const { pull_request, repository } = event;
    const owner = repository.owner.login;
    const repo = repository.name;
    const prNumber = pull_request.number;

    await processPR(owner, repo, prNumber);
  }

  res.status(200).json({ review });
});

app.post("/webhook/gitlab", async (req, res) => {
  console.log("=================================");
  console.log("🔔 Received GitLab webhook event!", req);
  const event = req.body;

  if (
    event.object_kind === "merge_request" &&
    event.object_attributes.action === "open"
  ) {
    const { project, object_attributes } = event;
    const projectId = project.id;
    const mrIid = object_attributes.iid;

    await processMR(projectId, mrIid);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ MCP Review Server running on port ${PORT}`);

  listenTerminal();
});
