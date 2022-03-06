import Discord from 'discord.js';
import {requestWCA} from './requestWCA.js';
import {help} from './help.js';
import {events} from './help.js';
import {error} from './error.js'
let Bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

Bot.on('ready', () => {

	console.log('Connected');
});

const prefix = "%";

Bot.on('message', msg  => {

	if (msg.author.bot) return;
	if (msg.content.startsWith(prefix)) {	
		let command = msg.content.substring(1)
		let msgSimple = command.split(" ")
		let cmd = msgSimple[0]
		let args = msgSimple.slice(1)

		if (cmd !== 'wr' && cmd !== 'help' && cmd !== 'events'){
			error(cmd, msg);
			return;
		}

		else if (cmd === 'wr'){
			requestWCA(cmd, args, msg);
			if (args.length !==1){
				msg.channel.send("Donnez un seul paramètre avec la commande 'wr'. \n Pour la liste de paramètres '%events'");
				return;
			}
			else if (args.lenght === 1){
				requestWCA(cmd, args, msg);
			}
		}

		else if (cmd === 'ranking'){
			msg.channel.send('Oups, cette commande est encore en développement');
			return;
			if (args.lenght >3 || isNaN(args[1]) || isNaN(args[3])){
				msg.channel.send("Donnez trois paramètre avec la commande 'ranking'. \n Les paramètres doit être du style '%ranking [event] [single/average] [x]'. \n Pour la list d'events '%events'. \n x représente le top x que vous voulez");
				return;
			}
			else if ( args[2] !== 'single' && args[2] !== 'average'){
				msg.channel.send("Donnez trois paramètre avec la commande 'ranking'. \n Les paramètres doit être du style '%ranking [event] [single/average] [x]'. \n Pour la list d'events '%events'. \n x représente le top x que vous voulez");
				return;
			}
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
