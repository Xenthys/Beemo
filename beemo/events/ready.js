const fs = require('fs');
const path = require('path');
const lowerFirstLetter = require("../util/lowerFirstLetter.js");
const injectClient = require("../util/injectClient.js");

module.exports = async client => {
	//Load all the commands
	client.commands = {};

	const categories = fs.readdirSync(path.resolve('./beemo/commands'));
	for(const category of categories) {
		//Read the files inside it
		var files = fs.readdirSync(path.resolve(path.join('./', 'beemo', 'commands', category)));
		for(const file of files) {
			if(file.endsWith(".js")) {
				try {
					const command = client.commands[file.slice(0, -3)] = require(path.resolve(path.join('./', 'beemo', 'commands', category, file)));
					command.name = file.slice(0, -3);
					command.category = category;

					//Events
					for(var key in command) {
						if(key.startsWith("on")) {
							var event = lowerFirstLetter(key.slice(2));

							client.on(event, injectClient(client, command[key]));
						}
					}

					if(typeof command.onLoad != 'undefined') {
						try {
							command.onLoad(client);
						} catch (err) {
							client.error(`Error running onLoad for command ${command.name}: ${err}`);
						}
					}
				} catch (err) {
					client.log(`Error loading ${file}`, err);
				}
			}
		}
	}

	//Other stuff

	client.log(`Ready - ${client.guilds.size} Guilds`);
	client.user.setGame(`[${client.shard.id+1}] ${client.credentials.prefixes[0]}help | ${client.credentials.prefixes[0]}invite`);
};