import fetch from "node-fetch";

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
