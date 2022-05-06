import Discord from 'discord.js';
import {requestWCA} from './requestWCA.js';
import {help} from './help.js';
import {events} from './help.js';
import {error} from './error.js'
import {continent} from './help.js';
let Bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
import {continents} from './param.js';
import {isoCountries} from './param.js';
import {recordPerson} from './recordPerson.js';

Bot.on('ready', () => {

	console.log('Connected');
});

const prefix = "%";

Bot.on('messageCreate', msg  => {

	if (msg.author.bot) return;
	if (msg.content.startsWith(prefix)) {	
		let command = msg.content.substring(1).toLowerCase()
		let msgSimple = command.split(" ")
		let cmd = msgSimple[0]
		let args = msgSimple.slice(1)

		if (cmd !== 'wr' && cmd !== 'help' && cmd !== 'events' && cmd !== 'cr' && cmd !== 'nr' && cmd !== 'countries' && cmd !=='id'){
			error(cmd, msg);
			return;
		}

		else if (cmd === 'id'){
			if (args.length !== 2){
				msg.channel.send("Donnez deux paramètres avec la commande 'id' ! L'event puis l'id wca de la personne. \n Pour la liste d'events' '%events'. ")
			}
			recordPerson(cmd, args, msg, avg);
		}

		else if (cmd === 'wr'){
			let pays = 1;
			let event = events[args[0]]
			if (args.length !==1){
				msg.channel.send("Donnez un seul paramètre avec la commande 'wr'. \n Pour la liste d'events' '%events'");
				return;
			}
			else  if (event === '3bld' || event === '4bld' || event === '5bld' || event === 'fmc' || event === '66' || event === '77'){
    		let avg = 'Mo3';
    		requestWCA(cmd, args, msg, avg);
    		
    	}
    		else if (event !== '3bld' && event !== '4bld' && event !== '5bld' && event !== 'fmc' && event !== '66' && event !== '77'){
    			let avg = '<:AVG:369418969351716864>';
    			requestWCA(cmd, args, msg, avg, pays);
    		}
		}
		else if (cmd === 'cr'){
			let pays = 1;
    		let event = events[args[0]]
    		let cont = continents[args[1]];
    			if (args.length !== 2){
    				msg.channel.send("Donnez deux paramètre avec la commande 'cr' ( 1) l'event, 2) le continent). \n Pour la liste des events '%events'. \n Pour la liste des continents '%continent'.");
    				return;
    			}
    		else if (event === '3bld' || event === '4bld' || event === '5bld' || event === 'fmc' || event === '66' || event === '77'){
    		let avg = 'Mo3';
    		requestWCA(cmd, args, msg, avg, pays,  cont);
    	}

    		else if (event !== '3bld' && event !== '4bld' && event !== '5bld' && event !== 'fmc' && event !== '66' && event !== '77'){
    		let avg = '<:AVG:369418969351716864>';
    		requestWCA(cmd, args, msg, avg, pays, cont);
    		}
    	}

    	else if  (cmd === 'nr'){;
    		let event = events[args[0]];
    		let pays = isoCountries[args[1].toUpperCase()];
    		if (args.length !== 2){
    			msg.channel.send("Donnez deux paramètres avec la commande 'nr' ( 1) l'event, 2) le pays). \n Pour la liste des events '%events'. \n Pour la liste des pays '%countries'.");
    			return;
    		}
    		else if (event === '3bld' || event === '4bld' || event === '5bld' || event === 'fmc' || event === '66' || event === '77'){
    		let avg = 'Mo3';
    		requestWCA(cmd, args, msg, avg, pays);
    	}

    		else if (event !== '3bld' && event !== '4bld' && event !== '5bld' && event !== 'fmc' && event !== '66' && event !== '77'){
    		let avg = '<:AVG:369418969351716864>';
    		requestWCA(cmd, args, msg, avg, pays);
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
		else if (cmd ==='continent'){
			continent(cmd, msg);
		}
		else if (cmd ==='countries'){
			msg.channel.send("Cette commande est en développement ! Pour le moment référez-vous aux codes iso2. ")
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