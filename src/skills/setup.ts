/*
  This middleware handles interactions related to initial setup of the bot.
*/
import BotKit = require('botkit');

module.exports = function(controller: BotKit.BotFrameworkController) {
    
    controller.hears(['call me (.*)'], 'message_received', function(bot, message) {
        if (message.text && message.user) {
            var matches = message.text.match(/call me (.*)/i);
            if (matches) {
                var name = matches[1];
                controller.storage.users.get(message.user, function(err, user) {
                    if (user && user.name && user.name == name) {
                        bot.reply(message, 'I alrready know you are ' + user.name + '.');
                    } else {
                        console.log(user);
                        user.name = name;
                        controller.storage.users.save(user, function(err, id) {
                            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                        });
                    }
                });
            }
        }
    });
    
}
    