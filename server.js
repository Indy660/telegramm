const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '709253254:AAF2wXSv_gLq4Vch8cUrOugvp0wisuLqrsM';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


var questions = [{
    title: 'Кто нажал на эту кнопку?',
    buttons: [
        [{
            text: 'Узнай, кто кликнул',
            callback_data: '1'
        }]
    ]
}];




function newQuestion() {
    var arr = questions[0];
    var text = arr.title;   //вопрос над кнопкой
    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: arr.buttons
        })
    };
    bot.sendMessage(375240230, text, options);

    bot.on('callback_query', msg => {
        bot.editMessageText(msg.message.text + '\n ' + msg.from.first_name,  {
            chat_id: msg.from.id,
            message_id: msg.message.message_id
        })
    });
    // })
}

newQuestion()





