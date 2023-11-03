"use strict";

const ViberBot = require("viber-bot").Bot;
const BotEvents = require("viber-bot").Events;
const TextMessage = require("viber-bot").Message.Text;
const axios = require("axios");
require("dotenv").config();

const bot = new ViberBot({
  authToken: process.env.VIBER_AUTH_TOKEN,
  name: "Wechirka",
  avatar: "https://raw.githubusercontent.com/devrelv/drop/master/151-icon.png", // Здесь укажите URL вашего аватара
});

bot.on(BotEvents.SUBSCRIBED, (userProfile, isSubscribed, context, onFinish) => {
  bot.sendMessage({
    id: userProfile.id,
    text: "Привет, я ваш Viber-бот! Отправьте мне 'hi' для приветствия.",
  });
  onFinish();
});

bot.onSubscribe((response) => {
  say(
    response,
    `Hi there ${response.userProfile.name}. I am ${bot.name}! Feel free to ask me if a web site is down for everyone or just you. Just send me a name of a website and I'll do the rest!`
  );
});

bot.onTextMessage("hi", (message, response) => {
  response.send(new TextMessage("Привет! Как я могу помочь вам?"));
});

bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
  if (message.text === "hi") {
    response.send(new TextMessage("Привет! Как я могу помочь вам?"));
  }
});

bot.getBotProfile().then((profile) => {
  console.log(`Bot ${profile.name} is running on ${profile.apiVersion}`);
});

const port = 3000;

const express = require("express");
const app = express();

const ngrok = require("ngrok");

async function getPublicUrl() {
  try {
    const url = await ngrok.connect({
      addr: 3000,
    });

    return url;
  } catch (error) {
    console.error("Ошибка при создании публичного URL:", error);
    throw error;
  }
}
bot.middleware();
app
  .listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
  .on("error", (error) => {
    console.error("Server error:", error);
  });

const data = {
  url: "https://events-4qv2.onrender.com/",
  event_types: ["message", "subscribed"],
};

const config = {
  headers: {
    "X-Viber-Auth-Token": process.env.VIBER_AUTH_TOKEN,
  },
};

axios
  .post("https://chatapi.viber.com/pa/set_webhook", data, config)
  .then((response) => {
    console.log("Webhook установлен успешно.");
  })
  .catch((error) => {
    console.error("Ошибка при получении публичного URL:", error);
  });

app.use("https://events-4qv2.onrender.com/", (req, res, next) => {
  console.log("Received Viber Webhook Request:");
  console.log(req.body);
  next();
});
