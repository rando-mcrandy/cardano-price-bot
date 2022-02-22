const express = require('express');
const app = express();
const port = 3003;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

// ================= API Code ===================
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

// fetch cardano price from coingecko
var fetchCardanoPrice = async() => {
  let data = await CoinGeckoClient.coins.fetch('cardano', {});
  return data["data"]["market_data"]["current_price"]["usd"];
};

// ================= START BOT CODE ===================
const Discord = require('discord.js');

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var doOnce = true; 
client.on('message', msg => {
  // on first message only,
  // update nickname of bot with cardano price every 30 sec
  if (doOnce) {
    doOnce = false;
    var interval = setInterval (async() => {
      var price = await fetchCardanoPrice();
      msg.guild.me.setNickname("$" + price);
      // msg.channel.send("ADA Price: $" + price);
    }, 30 * 1000);
  }
});

client.login(process.env['DISCORD_TOKEN']);



