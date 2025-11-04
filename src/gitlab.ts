import fetch from "node-fetch";
import { reviewDiff } from "./reviewer";

export async function fetchMergeRequestDiff(
  projectId: number,
  mrIid: number,
  token: string
) {
  const res = await fetch(
    `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${mrIid}/changes`,
    {
      headers: {
        "PRIVATE-TOKEN": token,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch MR diff from GitLab: ${res.statusText}`);
  }

  const data = (await res.json()) as any;
  return data.changes.map((c: any) => c.diff).join("\n");
}

export async function processMR(projectId: number, mrIid: number) {
  console.log(`Process MR, project: ${projectId}, id: ${mrIid}... `);

  try {
    console.log("Fetching diff... ");

    const diff = await fetchMergeRequestDiff(
      projectId,
      mrIid,
      process.env.GITLAB_PERSONAL_ACCESS_TOKEN!
    );

    console.log("Reviewing MR... ");

    const review = await reviewDiff(diff);
    console.log("\n🧠 --- AI Review for MR #" + mrIid + " ---\n");
    console.log(review);
  } catch (err) {
    console.error("❌ Processing MR failed", err);
  }
}
