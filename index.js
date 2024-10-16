require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

// initialize client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// initialize Express server
const app = express();

// verifying GitHub webhook signature
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      const signature = req.header("X-Hub-Signature-256");

      const hmac = crypto.createHmac(
        "sha256",
        process.env.GITHUB_WEBHOOK_SECRET
      );

      hmac.update(buf, "utf-8");

      const digest = "sha256=" + hmac.digest("hex");

      if (signature !== digest) {
        throw new Error("Invalid signature");
      }
    },
  })
);

// store pull requests
let pullRequestMessages = {};

// client log in
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// handle incoming GitHub webhook events
app.post("/github-webhook", async (req, res) => {
  const event = req.header("X-GitHub-Event");
  const action = req.body.action;

  const pullRequest = req.body.pull_request;

  if (event === "pull_request") {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);

    if (action === "opened" || action === "reopened") {
      try {
        const message = await channel.send(pullRequest.html_url);
        console.log(`PR Opened: ${pullRequest.title}`);
        pullRequestMessages[pullRequest.id] = message.id;
      } catch (error) {
        console.error("Error sending message to Discord:", error);
      }
    } else if (action === "closed") {
      const messageId = pullRequestMessages[pullRequest.id];

      if (messageId) {
        try {
          const message = await channel.messages.fetch(messageId);
          await message.delete();
          console.log(`PR Closed: ${pullRequest.title}`);
          delete pullRequestMessages[pullRequest.id];
        } catch (error) {
          console.error("Failed to delete message:", error);
        }
      }
    }
  }

  // acknowledge receipt of event
  res.sendStatus(200);
});

// start Express server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// log in to Discord
client.login(process.env.DISCORD_TOKEN);
