const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const express = require('express')
const expressApp = express()
const puppeteer = require('puppeteer');

var port = process.env.PORT || 3000;

const keyboard = Markup.inlineKeyboard([
  Markup.urlButton('❤️', 'http://telegraf.js.org'),
  Markup.callbackButton('Delete', 'delete')
])

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Hello'))
bot.help((ctx) => ctx.reply('Help message'))
bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.from.id, ctx.message, Extra.markup(keyboard)))
bot.action('delete', ({ deleteMessage }) => deleteMessage())
bot.startPolling()

expressApp.use(express.static('./'))
 
expressApp.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook('https://activity-bot-in.herokuapp.com/secret-path')

expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

expressApp.listen(port, () => {


	(async () => {
		try {
	  const browser = await puppeteer.launch();
	  const page = await browser.newPage();
	  await page.goto('https://google.com');
	  await page.screenshot({path: 'example.png'});

	  await browser.close();
	} catch(err) {
		console.log(err);
	}
	})();

  console.log('Example app listening on port 3000!')
})			