# MPC server code reviewer

MPC server linked with github or gitlab and AI agent, performing code review.

| Component       | Purpose                        |
| --------------- | ------------------------------ |
| `server.ts`     | Receives MR events             |
| `gitlab.ts`     | Fetches MR diff via GitLab API |
| `reviewer.ts`   | Sends diff to AI for analysis  |
| `.env`          | Stores tokens and config       |
| `manifest.json` | MCP integration for AI         |
