const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '709253254:AAF2wXSv_gLq4Vch8cUrOugvp0wisuLqrsM';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


bot.sendMessage(-276583637, "Бот Indy заработал!");

// var questions = [{
//     title: 'Кто нажал на эту кнопку?',
//     buttons: [
//         [{
//             text: 'Узнай, кто кликнул',
//             callback_data: '1'
//         }]
//     ]
// }];
//
// function newQuestion() {
//     var arr = questions[0];
//     var text = arr.title;   //вопрос над кнопкой
//     var options = {
//         reply_markup: JSON.stringify({
//             inline_keyboard: arr.buttons
//         })
//     };
//     // bot.sendMessage(375240230, text, options);   //мой ID
//     bot.sendMessage(-276583637, text, options);
//
//     bot.on('callback_query', msg => {
//         // console.log(msg);
//         bot.editMessageText(msg.message.text + '\n' + msg.from.first_name,  {
//             chat_id: msg.message.chat.id,    //или -276583637
//             message_id: msg.message.message_id
//         })
//     });
//     // })
// }
//
// newQuestion();

// .+
// bot.onText(/^ $/, (msg, match) => {
//     // 'msg' is the received Message from Telegram
//     // 'match' is the result of executing the regexp above on the text content
//     // of the message
//     console.log(match)
//     const chatId = msg.chat.id;
//     const resp = match[1]; // the captured "whatever"
//
//     // send back the matched "whatever" to the chat
//     bot.sendMessage(chatId, resp);
// });




bot.onText(/.+/, function(msg, match) {
     // console.log(msg)
    pushInArray(msg)
});


let positiveRating = [ ];
let negativeRating = [ ];
let rightConditions = [ "+", "спасибо", "спс", "👍", "👌", "ок", "ok" ];
let wrongConditions = [ "-", "нет", "неправильно", "👎", "✖️", "не", "✖", "не помогло" ];

let usersCantVote = [ ];

function setTime(user) {
    usersCantVote.push(user);
    function change(user) {
        return user
    }
   setTimeout(change, 5000);
}


function pushInArray(msg) {
     // console.log( msg.from.first_name + " и " + msg.reply_to_message.from.first_name )
    if (
        msg.reply_to_message &&
        ( msg.from.id !== msg.reply_to_message.from.id ) &&
        msg.reply_to_message.from.is_bot === false
    ) {
         if (rightConditions.includes(msg.text.trim().toLowerCase())) {
             console.log("Добавлен в +", msg.reply_to_message.from.first_name);
             positiveRating.push(msg.reply_to_message.from.first_name)
         } else if (wrongConditions.includes(msg.text.trim().toLowerCase())) {
             console.log("Добавлен в -", msg.reply_to_message.from.first_name);
             negativeRating.push(msg.reply_to_message.from.first_name)
         }
    }
}




function countPlus(positiveRating, negativeRating) {
    // console.log("mass",preRating)
    let finalRating = {};
    for (let i = 0; i < positiveRating.length; i++) {
        if (finalRating[positiveRating[i]] === undefined) {
            finalRating[positiveRating[i]] = 1;
        } else {
            finalRating[positiveRating[i]]++;
        }
    }
    for (let j = 0; j < negativeRating.length; j++) {
        if (finalRating[negativeRating[j]] === undefined) {
            finalRating[negativeRating[j]] = -1;
        } else {
            finalRating[negativeRating[j]]--;
        }
    }
     console.log("Сумма",finalRating)
    return finalRating
}


bot.onText(/\/start/, function ratingShow(msg) {
    // console.log("Команда старт сработала")
    let object =countPlus(positiveRating, negativeRating);
    let result = [];
    for (let name in object) {
        result.push([name, object[name]]);
    }
    result.sort(function(a, b) {
        return b[1] - a[1];
    });
    console.log("Конечный результат", result);
    let message ="";
    for (let i = 0; i < result.length; i++) {
        message += i+1 +' место '+ result[i][0] + ":  " + result[i][1] +  " голоса \n";
    }
    bot.sendMessage(msg.chat.id, message)
});






//
// { id: '1611644517598929834',
//     from: {
//         id: 375240230,
//         is_bot: false,
//         first_name: 'Дмитрий',
//         last_name: 'Кузнецов',
//         language_code: 'ru' },
//     message: {
//         message_id: 942,
//         from:
//         {   id: 709253254,
//             is_bot: true,
//             first_name: 'Indy',
//             username: 'indys_bot' },
//         chat: {
//             id: -276583637,
//             title: '�рейтинг',
//             type: 'group',
//             all_members_are_administrators: true },
//         date: 1571308823,
//         text: 'Кто нажал на эту кнопку?',
//         reply_markup: {
//             inline_keyboard: [Array] } },
//     chat_instance: '4917794781285603955',
//         data: '1' }


