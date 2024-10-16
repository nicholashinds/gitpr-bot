# Discord Bot with GitHub Webhook Integration

A small Discord bot that listens for GitHub pull request events via a webhook and notifies a specified Discord channel when a pull request is opened, reopened, or closed.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/package-manager) (version 16 or later)
- A Discord bot token
- A Discord channel ID
- A GitHub repository for testing the webhook
- `ngrok` for exposing the local server to the internet

## Getting Started

### 1. Clone the Repository

- Clone this repository to your local machine:

```
git clone https://github.com/nicholashinds/gitpr-bot.git
cd gitpr-bot
```

### 2. Install Dependencies

- Install the required Node.js packages:

```
npm install
```

### 3. Create a `.env` File

- Create a `.env` file in the root of your project with the following content:

```
DISCORD_TOKEN=your_discord_bot_token
CHANNEL_ID=your_discord_channel_id
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret
PORT=3000
```

### 4. Get Your Discord Bot Token

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Under **Bot** settings, generate and copy the **Token** inside the `.env` file as `DISCORD_TOKEN`
3. Create a new application and under **OAuth2** > **OAuth2 URL Generator** settings, select the `bot` scope and then the `Send Messages` and `Manage Messages` permissions. Then, copy and paste the provided URL into a browser to invite the bot to your server.

### 5. Get the Discord Channel ID

1. Right-click the channel where you want notifications and select **Copy ID**.
   - Note: If you don't see **Copy ID**, go to **User Settings** > **Advanced** and enable **Developer Mode**.
2. Paste the copied ID inside the `.env` file as `CHANNEL_ID`.

### 6. Generate a GitHub Webhook Secret

1. Create and run a Python file called `secret.py` with the content:

```python
import secrets
print(secrets.token_hex(32))
```

2. Copy this Secret Key and paste it inside the `.env` file as `GITHUB_WEBHOOK_SECRET`.

### 7. Set Up `ngrok` for Local Testing

1. Download and install [`ngrok`](https://ngrok.com/).
2. Open a Terminal and run:

```
ngrok http 3000
```

3. `ngrok` will generate a URL like `http://1234abcd.ngrok.io`. Save this URL for creating the GitHub webhook.

### 8. Generate a GitHub Webhook

1. Go to the GitHub repository you want monitored.
2. Click on **Settings** > **Webhooks** > **Add webhook**
3. In the **Payload URL**, paste the `ngrok` url + `/github-webhook` (e.g., `http://1234abcd.ngrok.io/github-webhook`).
4. Set the **Content type** to `application/json`.
5. Set the **Secret** to the same value as `GITHUB_WEBHOOK_SECRET`.
6. Under the **Events** section, select **Let me select individual events** and **Pull requests**.
7. Finally, click **Add webhook**

### 9. Start the Server

- To start the server, open a Terminal window in your project directory and run:

```
node index.js
```

## Troubleshooting

- **Invalid Signature Error**: Ensure the **Secret** in your GitHub webhook matches `GITHUB_WEBHOOK_SECRET` in the `.env` file.
- **Bot Not Responding**: Ensure the bot has the correct permissiosn to post and manage messages.
- **Ngrok Connection Issues** If `ngrok` is disconnecting, try using the `ngrok` authtoken (create an account and select **Your Authtoken**) to keep it stable:

```
ngrok authtoken YOUR_AUTH_TOKEN
```
