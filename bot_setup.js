const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const content = require("./content");

var fs = require('fs'),
    path = require('path');



module.exports = (expressApp) => {

	const bot = new Telegraf(process.env.BOT_TOKEN)
	// expressApp.use(bot.webhookCallback('/secret-path'))
	// bot.telegram.setWebhook(`${expressApp.domain}/secret-path`);


	const keyboard = Markup.inlineKeyboard([
	  Markup.urlButton('❤️', 'http://telegraf.js.org'),
	  Markup.callbackButton('Delete', 'delete')
	])

	const rulesFilePath = path.join("static", content.bot.rules.file);

	bot.start((ctx) =>  {
		ctx.reply(content.bot.rules.text);



    ctx.telegram.sendDocument(ctx.from.id, {
       source: rulesFilePath,
       filename: content.bot.rules.file
    }).catch(function(error){ console.log(error); })



	})
	bot.help((ctx) => ctx.reply('Help message'))
	bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.from.id, ctx.message, Extra.markup(keyboard)))
	bot.action('delete', ({ deleteMessage }) => deleteMessage())
	bot.startPolling()

	return {
		bot: bot
	}
};





