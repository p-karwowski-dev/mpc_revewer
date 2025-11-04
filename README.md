# MPC server code reviewer

MPC server linked with github, gitlab and AI agent performing code reviews.
This tool supports both webhooks and direct input of Pull Request (PR) or Merge Request (MR) URLs via the terminal, providing flexibility in how code reviews are initiated.

| Component       | Purpose                                  |
| --------------- | ---------------------------------------- |
| `server.ts`     | Receives MR events                       |
| `gitlab.ts`     | Fetches and processing MR via GitLab API |
| `github.ts`     | Fetches and processing PR via GitHub API |
| `reviewer.ts`   | Sends diff to AI for analysis            |
| `.env`          | Stores tokens and config                 |
| `manifest.json` | MCP integration for AI                   |

### Prerequisites to run locally

1. **Set up environment variables**:  
   Create a `.env` file in the root directory and populate it with the required tokens and configuration. You need provide at least one git token, second is optional.

   ```
   GITLAB_TOKEN=your_gitlab_token
   GITHUB_TOKEN=your_github_token
   AI_API_KEY=your_ai_api_key
   PORT=8080
   ```

2. **Install dependencies**:  
   Run the following command to install the required dependencies:

   ```bash
   npm install
   ```

3. **Expose your local server using localhost.run**:

   Use the following command to expose your local server to the internet:

   ```bash
   ssh -R 80:localhost:8080 nokey@localhost.run
   ```

   This command creates a reverse SSH tunnel, forwarding traffic from port 80 on the `localhost.run` server to port 8080 on your local machine.
   After running the command, you will receive a public URL (e.g., `https://<random-subdomain>.localhost.run`) that can be used to access your local server.

4. **Set up webhooks in GitLab or GitHub**:

   Add a new webhook to the git, replacing {your-tunnel-url} with your public url.

   ```bash
   https://your-tunnel-url.trycloudflare.com/webhook/gitlab
   https://your-tunnel-url.trycloudflare.com/webhook/github
   ```

5. **Start the server**:  
   Run the following command to start the server:

   ```bash
   npm run dev
   ```

   For development is suggested to use watch mode, however this mode does not support terminal inputs.

   ```bash
   npm run dev:watch
   ```

6. **Use it! 🚀**:

   Once the server is running, you can use it in two ways:

   - **Trigger via Webhooks**: Open a Pull Request (PR) or Merge Request (MR) in your GitHub or GitLab repository. The configured webhook will automatically send the event to your server for processing.
   - **Direct Input**: Copy the URL of a PR or MR and paste it into the terminal when prompted. The server will fetch and analyze the changes directly.

   The AI-powered reviewer will analyze the code changes and provide feedback.
