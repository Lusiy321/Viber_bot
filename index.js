"use strict";

require("dotenv").config();
const ViberBot = require("viber-bot").Bot;
const Keyboard = require("viber-bot").Keyboard;
const BotEvents = require("viber-bot").Events;
const TextMessage = require("viber-bot").Message.Text;
const UrlMessage = require("viber-bot").Message.Url;
const ContactMessage = require("viber-bot").Message.Contact;
const PictureMessage = require("viber-bot").Message.Picture;
const VideoMessage = require("viber-bot").Message.Video;
const LocationMessage = require("viber-bot").Message.Location;
const StickerMessage = require("viber-bot").Message.Sticker;
const FileMessage = require("viber-bot").Message.File;
const RichMediaMessage = require("viber-bot").Message.RichMedia;
const KeyboardMessage = require("viber-bot").Message.Keyboard;

const ngrok = require("ngrok");

function say(response, message) {
  response.send(new TextMessage(message));
}

async function checkUrlAvailability(botResponse, text_received) {
  console.log(botResponse);
  let sender_name = botResponse.userProfile.name;
  let sender_id = botResponse.userProfile.id;
  let message = "";
  try {
    if (text_received === "") {
      say(botResponse, "I need a Text to check");
      return;
    }

    if (text_received === "text") {
    } else if (text_received === "url") {
      let url = "https://google.com";
      message = new UrlMessage(url);
    } else if (text_received === "contact") {
      let contactName = "Ko Ko";
      let contactPhoneNumber = "09420084765";
      message = new ContactMessage(contactName, contactPhoneNumber);
    } else if (text_received === "picture") {
      let url =
        "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
      message = new PictureMessage(url);
    } else if (text_received === "video") {
      let url =
        "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4";
      let size = 1;
      message = new VideoMessage(url, size);
    } else if (text_received === "location") {
      let latitude = "16.7985897";
      let longitude = "96.1473162";
      message = new LocationMessage(latitude, longitude);
    } else if (text_received === "sticker") {
      let stickerId = "40133";
      message = new StickerMessage(stickerId);
    } else if (text_received === "file") {
      let url =
        "https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf";
      let sizeInBytes = "102400";
      let filename = "FileMessageTest.pdf";
      message = new FileMessage(url, sizeInBytes, filename);
    } else if (text_received === "Підписатися") {
      try {
        bot.on(BotEvents.MESSAGE_RECEIVED, (botResponse, response) => {
          if (botResponse.contact) {
            const { name, phone } = message.contact;
            // Вы можете сохранить эту информацию в базе данных или выполнить другие действия с ней.
            console.log(
              `Пользователь ${name} предоставил номер телефона: ${phone}` +
                response
            );
          }
        });
      } catch (e) {
        console.error("Error while processing user message:", e);
      }
    } else if (text_received === "keyboard") {
      const SAMPLE_KEYBOARD = {
        Type: "keyboard",
        Revision: 1,
        Buttons: [
          {
            Rows: 1,
            Columns: 2,
            BgColor: "#372e64",
            ActionType: "open-url",
            ActionBody: "https://www.example.com",
            Image: "https://www.example.com/button1.png",
            Text: "Посетить сайт",
            TextSize: "regular",
          },
          {
            Rows: 1,
            Columns: 2,
            BgColor: "#372e64",
            ActionType: "location-picker", // Действие для запроса номера телефона
            ActionBody: "Request Phone Number", // Уникальный идентификатор действия
            Text: "Поделиться номером", // Текст кнопки
            TextSize: "regular",
          },
          {
            Rows: 1,
            Columns: 2,
            BgColor: "#372e64",
            ActionType: "reply",
            ActionBody: "Button 3 clicked",
            Text: "Кнопка 3",
            TextSize: "regular",
          },
        ],
      };
      message = new KeyboardMessage(SAMPLE_KEYBOARD);
    } else {
      const SAMPLE_KEYBOARD = {
        Type: "keyboard",
        Revision: 1,
        Buttons: [
          {
            Rows: 1,
            Columns: 2,
            BgColor: "#372e64",
            ActionType: "open-url",
            ActionBody: "https://show-swart.vercel.app/",
            Image: "https://www.example.com/button1.png",
            Text: "Відкрити сайт",
            TextSize: "regular",
          },
          {
            Rows: 1,
            Columns: 2,
            BgColor: "#372e64",
            ActionType: "reply",
            ActionBody: "Підписатися",
            Text: "Підписатися",
            TextSize: "regular",
          },
          {
            Rows: 1,
            Columns: 2,
            BgColor: "#372e64",
            ActionType: "reply",
            ActionBody: "Button 3 clicked",
            Text: "Відмовитись",
            TextSize: "regular",
          },
        ],
      };
      message = new KeyboardMessage(SAMPLE_KEYBOARD);
    }
  } catch (error) {
    console.error("Error while processing user message:", error);
    say(botResponse, "Sorry, I encountered an error.");
    return;
  }

  await botResponse.send(message);

  console.log(text_received);
}

const bot = new ViberBot({
  authToken: process.env.ACCESS_TOKEN,
  name: "Wechirka",
  avatar: "https://raw.githubusercontent.com/devrelv/drop/master/151-icon.png", // Здесь укажите URL вашего аватара
});

// The user will get those messages on first registration
bot.onSubscribe(async (response) => {
  say(
    response,
    `Привіт ${response.userProfile.name}. Я бот ресурсу ${bot.name}! Щоб отримувати сповіщеня, натисніть кнопку "відправити контакт" у меню з низу. Сюди будуть надходити сповіщеня про найм`
  );
});

bot.onSubscribe(async (response) =>
  bot
    .getUserDetails(response.userProfile)
    .then((userDetails) => console.log(userDetails))
);

// Perfect! Now here's the key part:
bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
  // This sample bot can answer only text messages, let's make sure the user is aware of that.
  if (!(message instanceof TextMessage)) {
    say(response, `Sorry. I can only understand text messages.`);

    if (message instanceof PictureMessage) {
      say(response, `You sent a picture message.`);
    }
  }
});

bot.onTextMessage(/./, async (message, response) => {
  try {
    console.log(message);
    say(response, `Натисніть "Підписатися" щоб отримувати сповіщення`);
    await checkUrlAvailability(response, message.text);
    const SAMPLE_KEYBOARD = {
      Type: "keyboard",
      Revision: 1,
      Buttons: [
        {
          Rows: 1,
          Columns: 2,
          BgColor: "#372e64",
          ActionType: "open-url",
          ActionBody: "https://show-swart.vercel.app/",
          Image: "https://www.example.com/button1.png",
          Text: "Відкрити сайт",
          TextSize: "regular",
        },
        {
          Rows: 1,
          Columns: 2,
          BgColor: "#372e64",
          ActionType: "reply",
          ActionBody: "Підписатися",
          Text: "Підписатися",
          TextSize: "regular",
        },
        {
          Rows: 1,
          Columns: 2,
          BgColor: "#372e64",
          ActionType: "reply",
          ActionBody: "Button 3 clicked",
          Text: "Відмовитись",
          TextSize: "regular",
        },
      ],
    };
    const msg = new KeyboardMessage(SAMPLE_KEYBOARD);
    response.send(msg);
  } catch (e) {
    console.error("Ошибка при обработке запроса номера телефона:", e);
  }
});

// bot.onTextMessage(/^запросить номер телефона$/i, (message, response) => {
//   const key = new Keyboard(false, true).addRequestPhoneNumberButton(
//     "Поделиться номером телефона",
//     "Запросить номер телефона",
//     6,
//     1
//   );

//   response.send("Нажмите кнопку, чтобы поделиться номером телефона", key);
// });

// bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
//   if (message instanceof ViberBot.Message.Contact) {
//     const phoneNumber = message.contact.phone_number;
//     response.send(`Вы поделились номером телефона: ${phoneNumber}`);
//   }
// });

bot.onTextMessage(/./, async (msg, res) => {
  if (msg.text === "Підписатися") {
    say(
      res,
      `${res.userProfile.name} введіть свій номер телефону у форматі 380981231122`
    );
    return;
  }
});

// bot.onTextMessage(/./, async (msg, res) => {
//   const phonePattern =
//     /^[+]?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
//   if (msg.text.match(phonePattern)) {
//     // "phone" является номером телефона, можно сохранить его или выполнить другие действия
//     console.log(
//       `Пользователь ${res.userProfile.name} предоставил номер телефона: ${msg.text}`
//     );
//   } else {
//     // "phone" не является номером телефона
//     console.log(
//       `Пользователь ${res.userProfile.name} предоставил некорректный номер телефона: ${msg.text}`
//     );
//   }
// });

bot
  .getBotProfile()
  .then((response) => console.log(`Bot Named: ${response.name}`))
  .catch((error) => {
    console.error("Error while getting bot profile:", error);
  });

// Server
if (process.env.NOW_URL || process.env.HEROKU_URL) {
  const http = require("http");
  const port = process.env.PORT || 5000;

  http
    .createServer(bot.middleware())
    .listen(port, () =>
      bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL)
    );
} else {
  return ngrok
    .connect({
      addr: 3000,
    })
    .then(async (publicUrl) => {
      const http = require("http");
      const port = process.env.PORT || 5000;

      console.log("publicUrl => ", publicUrl);

      await http
        .createServer(bot.middleware())
        .listen(port, () => bot.setWebhook(publicUrl));
    })
    .catch((error) => {
      console.log("Can not connect to ngrok server. Is it running?");
      console.error(error);
      process.exit(1);
    });
}
