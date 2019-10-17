const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '709253254:AAF2wXSv_gLq4Vch8cUrOugvp0wisuLqrsM';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"

bot.onText(/\/echo (.+)/, (msg, match) => {
//     // 'msg' is the received Message from Telegram
//     // 'match' is the result of executing the regexp above on the text content of the message
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
//     // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

// bot.onText(/\*/, function (msg, match) {
//     let options = {
//         // reply_to_message_id: msg.message_id,
//         reply_markup: JSON.stringify({
//             keyboard: [
//                 [{ text: 'Кнопка 1', callback_data: '1' }],
//                 [{ text: 'Кнопка 2', callback_data: 'data 2' }],
//                 [{ text: 'Кнопка 3', callback_data: 'text 3' }]
//             ]
//         })
//     };
//
//     bot.sendMessage(msg.chat.id, 'Выберите любую кнопку:', options);
// });

// Listen for any kind of message. There are different kinds of messages.

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // const json = JSON.stringify(msg)
    // const nameUser = json.split(',')[3]
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, msg.chat.first_name);
});

// JSON.stringify(msg).from.first_name









//
// Matches /photo


// keyboard: [
//     ['Узнай своё имя'],
// ]


// /^$/
bot.onText(/f/, function onLoveText(msg) {
    const opts = {
         // reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Кнопка 1', callback_data: '1' }],
                [{ text: 'Кнопка 2', callback_data: 'data 2' }],
                [{ text: 'Кнопка 3', callback_data: 'text 3' }]
            ]
        })
    };
    // let text = msg.chat.first_name;
    bot.sendMessage(msg.chat.id, 'Выберите любую кнопку:', opts);
});

bot.onText(/Узнай своё имя/, function (msg, match) {
    bot.sendMessage(msg.chat.id, msg.chat.first_name);
});

bot.onText(/Узнай свою фамилию/, function (msg, match) {
    bot.sendMessage(msg.chat.id, msg.chat.last_name);
});


// KeyboardButton


// keyboard: [
//     [{ text: 'Кнопка 1', callback_data: '1' }],
//     ['Узнай своё имя'],
//     ['Узнай свою фамилию']
// ]

// bot.onText(/\/*/, function onLoveText(msg) {
//     const opts = {
//         reply_to_message_id: msg.message_id,
//         reply_markup: JSON.stringify({
//             inline_keyboard: [
//                 [{ text: 'Узнай своё имя', callback_data: '2'}]
//             ]
//         })
//     };
//     let textSend = msg.chat.first_name;
//     bot.sendMessage(msg.chat.id, textSend, opts);
// });








//
// bot.onText(/\/photo/, function onPhotoText(msg) {
//     // From file path
//     const photo = `${__dirname}/../test/data/photo.gif`;
//     bot.sendPhoto(msg.chat.id, photo, {
//         caption: "I'm a bot!"
//     });
// });
//
//
// // Matches /audio
// bot.onText(/\/audio/, function onAudioText(msg) {
//     // From HTTP request
//     const url = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';
//     const audio = request(url);
//     bot.sendAudio(msg.chat.id, audio);
// });
//
//
// // Matches /love
// bot.onText(/\/love/, function onLoveText(msg) {
//     const opts = {
//         reply_to_message_id: msg.message_id,
//         reply_markup: JSON.stringify({
//             keyboard: [
//                 ['Yes, you are the bot of my life ❤'],
//                 ['No, sorry there is another one...']
//             ]
//         })
//     };
//     bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
// });
//
//
// // Matches /editable
// bot.onText(/\/editable/, function onEditableText(msg) {
//     const opts = {
//         reply_markup: {
//             inline_keyboard: [
//                 [
//                     {
//                         text: 'Edit Text',
//                         // we shall check for this value when we listen
//                         // for "callback_query"
//                         callback_data: 'edit'
//                     }
//                 ]
//             ]
//         }
//     };
//     bot.sendMessage(msg.from.id, 'Original Text', opts);
// });
//
//
// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };
    let text;

    if (action === 'edit') {
        text = 'Edited Text';
    }

    bot.editMessageText(text, opts);
});