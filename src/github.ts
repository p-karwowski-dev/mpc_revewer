import fetch from "node-fetch";

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
