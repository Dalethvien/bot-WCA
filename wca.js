import Discord from 'discord.js';
import {requestWCA} from './requestWCA.js';
import {help} from './help.js';
import {events} from './help.js';
let Bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

Bot.on('ready', () => {

	console.log('Connected');
});

const prefix = "%";

Bot.on('message', msg  => {
	console.log('Bonjour');

	if (msg.author.bot) return;
	if (msg.content.startsWith(prefix)) {	
		let command = msg.content.substring(1)
		let msgSimple = command.split(" ")
		let cmd = msgSimple[0]
		let args = msgSimple.slice(1)

		if (cmd === 'wr'){
			requestWCA(cmd, args, msg);
		}

		else if (cmd === 'ranking'){
			msg.channel.send('Oups, cette commande est encore en développement');
			return;
			requestWCA(cmd, args, msg);

		}
		else if (cmd === 'help'){
			help(cmd, msg);
		}
		else if (cmd === 'events'){
			events(cmd, msg);
		}


	}

	if (msg.author.id === '664931482346717184' || msg.author.id === '230691286271655937'){
		if (msg.content.toLowerCase() === 'ping'){
			msg.reply('pong !');
		}
		else if (msg.content !== 'ping') return;
	}


});
Bot.login(process.env.TOKEN);