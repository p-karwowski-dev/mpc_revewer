import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { fetchPullRequestDiff } from "./github";
import { fetchMergeRequestDiff } from "./gitlab";
import { reviewDiff } from "./reviewer";

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.post("/webhook/github", async (req, res) => {
  const event = req.body;

  // GitHub sends pull request events with action "opened", "synchronize", etc.
  if (event.action === "opened" || event.action === "synchronize") {
    const { pull_request, repository } = event;
    const owner = repository.owner.login;
    const repo = repository.name;
    const prNumber = pull_request.number;

    console.log(
      `🔔 Received PR #${prNumber} event from ${repository.full_name}`
    );

    try {
      const diff = await fetchPullRequestDiff(
        owner,
        repo,
        prNumber,
        process.env.GITHUB_PERSONAL_ACCESS_TOKEN!
      );
      console.log("📦 Fetched diff, generating review...");

      // Generate review using AI
      const review = await reviewDiff(diff);
      console.log("\n🧠 --- AI Review for PR #" + prNumber + " ---\n");
      console.log(review);
    } catch (err) {
      console.error("❌ Review failed:", err);
    }
  }

  res.sendStatus(200);
});

app.post("/webhook/gitlab", async (req, res) => {
  const event = req.body;

  // GitLab sends merge request events with object_kind "merge_request"
  if (
    event.object_kind === "merge_request" &&
    event.object_attributes.action === "open"
  ) {
    const { project, object_attributes } = event;
    const projectId = project.id;
    const mrIid = object_attributes.iid;

    console.log(
      `🔔 Received MR #${mrIid} event from ${project.path_with_namespace}`
    );

    try {
      const diff = await fetchMergeRequestDiff(
        projectId,
        mrIid,
        process.env.GITLAB_PERSONAL_ACCESS_TOKEN!
      );
      console.log("📦 Fetched diff, generating review...");

      // Generate review using AI
      const review = await reviewDiff(diff);
      console.log("\n🧠 --- AI Review for MR #" + mrIid + " ---\n");
      console.log(review);
    } catch (err) {
      console.error("❌ Review failed:", err);
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`✅ MCP Review Server running on port ${PORT}`)
);
