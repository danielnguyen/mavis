/*
  This middleware handles interactions related to user help.
*/
import BotKit = require('botkit');

module.exports = function(controller: BotKit.BotFrameworkController) {
    
    controller.hears(['what can you do*'], 'message_received', function(bot, message) {
        bot.reply(message, 'Not much yet. I still need to learn a few new skills.');
    });
    
}
    