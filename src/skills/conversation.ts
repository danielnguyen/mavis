/*
  This middleware handles interactions related to .
*/
import BotKit = require('botkit');

module.exports = function(controller: BotKit.BotFrameworkController) {
    
    controller.hears(['hello', 'hi'], 'message_received', function(bot, message) {
        
        controller.storage.users.get(message.user, function(err, user) {
            if (user && user.name) {
                bot.reply(message, 'Hello ' + user.name + '!!');
            } else {
                bot.reply(message, 'Hello.', function(err) {
    
                    console.error(err);
                });
            }
        });
    });
    
}
    


