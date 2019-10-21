const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '709253254:AAF2wXSv_gLq4Vch8cUrOugvp0wisuLqrsM';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


let positiveRating = [ ];
let negativeRating = [ ];
let rightConditions = [ "+", "спасибо", "спс", "👍", "👌", "ок", "ok" ];
let wrongConditions = [ "-", "нет", "неправильно", "👎", "✖️", "не", "✖", "не помогло" ];




bot.sendMessage(-276583637, "Бот Indy заработал!");



const usersVoted = { };

const historyOpinions = [ ];
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





bot.onText(/.+/, function(msg, match) {
    // console.log('msg')
    pushInArray(msg);
    saveRaiting(msg)
});


function canUserVote (user, date) {
    if (!usersVoted[user]) {
            console.log("Этот пользователь ещё не голосовал");
            return true
    } else {
        if (usersVoted[user].lastMessage + 10 < date) {
            console.log("Вы смогли еще раз проголосовать");
            return true
        } else {
            console.log("Вы не можете ещё голосовать", usersVoted[user].lastMessage + 10 - date, "секунд");
            return false
        }
    }
}


function pushInArray(msg) {
    const userId = msg.from.id;
    if (
        msg.reply_to_message &&
        ( userId !== msg.reply_to_message.from.id ) &&
        msg.reply_to_message.from.is_bot === false &&
        canUserVote (userId, msg.date)
    ) {
         if (rightConditions.includes(msg.text.trim().toLowerCase())) {
             // let i=0;
             // historyOpinions[i++] =
             let
             let message = "Пользователь " + msg.from.first_name + " положительно оценил ваш " +
                            "комментарий '" + msg.reply_to_message.text + "' в " + msg.date;
             historyOpinions.push(message)
             console.log(historyOpinions);
             console.log("Добавлен в +", msg.reply_to_message.from.first_name);
             positiveRating.push(msg.reply_to_message.from.first_name);
             usersVoted[userId] = {
                 lastMessage : msg.date
             };
              console.log(usersVoted);
         } else if (wrongConditions.includes(msg.text.trim().toLowerCase())) {
             let message = "Пользователь " + msg.from.first_name + " негативно оценил ваш " +
                            "комментарий '" + msg.reply_to_message.text + "' в " + msg.date;
             historyOpinions.push(message)
             console.log(historyOpinions);
             console.log("Добавлен в -", msg.reply_to_message.from.first_name);
             negativeRating.push(msg.reply_to_message.from.first_name);
             usersVoted[userId] = {
                 lastMessage : msg.date
             };
             console.log(usersVoted);
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



function saveRaiting(msg) {

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
    // console.log( message);
    bot.sendMessage(msg.chat.id, message)
});


bot.onText(/\/history/, function ratingShow(msg) {
    let message ="";
    for (let i = 0; i < historyOpinions.length; i++) {
        message += i+1 +' мнение \n'+ historyOpinions[i] +  "\n";
    }
    // console.log( message);
    bot.sendMessage(msg.chat.id, message)
});



