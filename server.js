const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const fs = require('fs-extra');
const download = require('download-file');

// replace the value below with the Telegram token you receive from @BotFather
const token = '709253254:AAF2wXSv_gLq4Vch8cUrOugvp0wisuLqrsM';



// 709253254:AAF2wXSv_gLq4Vch8cUrOugvp0wisuLqrsM

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true,});
// filepath: false,
bot.sendMessage(-276583637, "Бот Indy заработал!");
let positiveRating = [ ];
let negativeRating = [ ];
let rightConditions = [ "+", "спасибо", "спс", "👍", "👌", "ок", "ok" ];
let wrongConditions = [ "-", "нет", "неправильно", "👎", "✖️", "не", "✖", "не помогло" ];





// const token = '725276890:AAFZsqsDgLvLfhgY8t-9lhjhCN-ZwAazqUM';
// bot.sendMessage(-276583637, "Кто ещё кого взламает, пидрила!");

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
     // console.log(msg)
    pushInArray(msg);

});


function canUserVote (user, date) {
    if (!usersVoted[user]) {
            console.log("Этот пользователь ещё не голосовал");
            return true
    } else {
        if (usersVoted[user].lastMessage + 1 < date) {
            console.log("Вы смогли еще раз проголосовать");
            return true
        } else {
            console.log("Вы не можете ещё голосовать", usersVoted[user].lastMessage + 1 - date, "секунд");
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
        const msgLowerText = msg.text.trim().toLowerCase();
        let message = {
            userName : msg.from.first_name,
            userFamily : msg.from.last_name,
            userId : userId,
            replyUser : msg.reply_to_message.from.id,
            replyUserName: msg.reply_to_message.from.first_name,
            comment : msg.reply_to_message.text,
            time : msg.date,
            textMessage : msg.text
        };
         if (rightConditions.includes(msgLowerText)) {
             message.review = "Положительный";
             message.raiting = "+";
             historyOpinions.push(message);
             console.log(historyOpinions);
             console.log("Добавлен в +", msg.reply_to_message.from.first_name);
             positiveRating.push(message.replyUser); // было msg.reply_to_message.from.first_name
             usersVoted[userId] = {
                 lastMessage : msg.date
             };
              console.log(usersVoted);
         } else if (wrongConditions.includes(msgLowerText)) {
             message.review = "Отрицательный";
             message.raiting = "-";
             historyOpinions.push(message);
             console.log(historyOpinions);
             console.log("Добавлен в -", msg.reply_to_message.from.first_name);
             negativeRating.push(message.replyUser);  // было msg.reply_to_message.from.first_name
             usersVoted[userId] = {
                 lastMessage : msg.date
             };
             console.log(usersVoted);
         }
    }
}


// negativeRating.push(msg.reply_to_message.from.id);  // было first_name

function countPlus(positiveRating, negativeRating) {
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
     // console.log("Сумма",finalRating);
    return finalRating
}

function seekNameByID(id) {
    for (let i = 0; i < historyOpinions.length; i++) {
        if (historyOpinions[i].replyUser == id) {
            return historyOpinions[i].replyUserName
        }
    }
    return  null
}




bot.onText(/\/start/, function ratingShow(msg) {
    // console.log("Команда старт сработала")
    let sumObject =countPlus(positiveRating, negativeRating);   // получается { '311805730': 1, '375240230': -1 }
    let result = [];
    for (let id in sumObject) {
        result.push({
            id: id,
            sum: sumObject[id]
        });
    }                                           // получается  [ { id: '311805730', sum: 1 }, { id: '375240230', sum: -1 } ]
    result.sort(function(a, b) {
        return b.sum - a.sum;
    });
    // console.log("Конечный результат", result);
    let message ="";
    //console.log('historyOpinions',historyOpinions)
    for (let i = 0; i < result.length; i++) {
        const id = result[i].id;
        const userName = seekNameByID(id);
        message += i+1 +' место '+ userName + ":  " + result[i].sum +  " голоса \n";
    }
    // console.log( message);
    bot.sendMessage(msg.chat.id, message)
});


bot.onText(/\/history/, function ratingShow(msg) {
    let dateSeconds = new Date().getTime()/1000;
    let message ="Мнение пользователей о вас: \n";
    for (let i = 0; i < historyOpinions.length; i++) {
        if (historyOpinions[i].userId !== msg.from.id) {
            let time = Math.round(dateSeconds - historyOpinions[i].time);
            if (time>60)  time = Math.floor((dateSeconds - historyOpinions[i].time)/60) + " минуты и " + Math.round(dateSeconds - historyOpinions[i].time-60*Math.floor((dateSeconds - historyOpinions[i].time)/60))
            message +=
                // i+1 +' мнение ' +'\n'+
                historyOpinions[i].review + " отзыв оставил пользователь " + historyOpinions[i].userName + " " +historyOpinions[i].userFamily + "" +
                " под вашим комментарием '" + historyOpinions[i].comment + "'" + " " + time + " секунд назад \n";
        }
    }
    if (message ==="Мнение пользователей о вас: \n") message += "Вас нигде не упомянали.";
    // console.log( message);
    bot.sendMessage(msg.chat.id, message)
});


bot.onText(/\/status/, function ratingShow(msg) {
    let message ="Ваш статус: \n";
    let status = 0;
    for (let i = 0; i < historyOpinions.length; i++) {
        if (historyOpinions[i].replyUser === msg.from.id )
            if (historyOpinions[i].raiting === "+")
                status ++;
        else status --;
    }
    message = checkStatus(status);
    // console.log( message);
    bot.sendMessage(msg.chat.id, message)
});

const arrayStatus = [
    {
        lt: -1,
        value: 'В шаге от бана ' + " меньше -1 голоса"
    }, {
        eq: -1,
        value: 'Ты не интересен? ' + "-1 голос"
    }, {
        eq: 0,
        value: 'Ты кто такой? ' + "0 голосов"
    }, {
        eq: 1,
        value: 'Кто-то по ошибке нажал и проголосовал за тебя ' + "1 голос"
    }, {
        eq: 2,
        value: 'Два человека проголосовало за тебя \n наверно, помешательство ' + "2 голоса"
    }, {
        eq: 3,
        value:  "Норм " + "3 голоса"
    }, {
        gt: 3,
        value: "Вы популярны, админ доволен вами" + " более 3 голосов "
    },
];


function checkStatus(raiting){
    for(let item of arrayStatus){
        if(item.hasOwnProperty('eq') && item.eq === raiting){
            return item.value
        }
        if (item.hasOwnProperty('lt') && raiting < item.lt){
            return item.value
        }
        if (item.hasOwnProperty('gt') && raiting > item.gt){
            return item.value
        }

    }
    return 'Как ты сломал здесь все!?'
}


bot.onText(/\/download (.+)/, function ratingShow(msg, match) {
     const chatId = msg.chat.id;
    const urlDownload = match[1];
    const folder = "C:\\Users\\User\\Desktop\\Работа\\telegram_bot vers 4\\downloaded files"
    console.log(1)
   downloadFile(urlDownload, folder, chatId)
       .then(()=>{
            console.log('Файл отправлся')
        })


});

// async
function downloadFile(linkDownload, linkStored, chat) {
    let lengthPath = fs.readdirSync(linkStored).length;
    console.log("Файлов в папке", lengthPath);
    const url = linkDownload;
    let options = {
        directory: linkStored,
        // filename: "Файл " + Number(lengthPath + 1)
        filename: "Ваш скачанный файл"
    };
    return downloadPromise(url, options).then(fullPath=> {
        console.log("Здесь уже файл должен быть скачан");
        // let fullPath = linkStored + "\\Ваш скачанный файл";
        console.log(fullPath);
        return bot.sendDocument(chat, fullPath);
    })
}



function downloadPromise(directory, options, chat) {
  return new Promise(function(resolve, reject) {
      download(directory, options, function(err, data ) {
      if (err) reject(err);
      else {
        console.log("Скачан файл");
          console.log("Путь", data);
         resolve(data);
      }
    });
  });
}

// 1 ое название htttp заголовка
// 2- ое reply + file


// http express
// json массива