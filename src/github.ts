import fetch from "node-fetch";
import { reviewDiff } from "./reviewer";

export async function fetchPullRequestDiff(
  owner: string,
  repo: string,
  prNumber: number,
  token: string
) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3.diff",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch PR diff from GitHub: ${res.statusText}`);
  }

  return await res.text();
}

export async function processPR(owner: string, repo: string, prNumber: number) {
  console.log(
    `Processing PR, owner: ${owner}, repo: ${repo}, id: ${prNumber}... `
  );

  try {
    console.log("Fetching diff... ");

    const diff = await fetchPullRequestDiff(
      owner,
      repo,
      prNumber,
      process.env.GITHUB_PERSONAL_ACCESS_TOKEN!
    );

    console.log("Reviewing... ");

    const review = await reviewDiff(diff);
    console.log("\n🧠 --- AI Review for PR #" + prNumber + " ---\n");
    console.log(review);
  } catch (err) {
    console.error("❌ Processing PR failed", err);
  }
}
