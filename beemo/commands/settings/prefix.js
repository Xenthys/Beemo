module.exports = {
    main: async (bot, message, ...args) => {
    	var redisKey = `server:${message.guild.id}:prefix`;
    	if(message.content == "") {
    		//Delete the key
    		await bot.redis.delAsync(redisKey);
    		message.reply("I've reset the command prefix.");
    	} else {
    		await bot.redis.setAsync(redisKey, message.content);
    		message.reply(`I've set the command prefix to \`${message.content}\`.`);
    	}
    },
    help: 'Set the bot\'s prefix for this server',
    guildOnly: true,
    permissionRequired: 'MANAGE_GUILD',
    args: '<prefix>'
};