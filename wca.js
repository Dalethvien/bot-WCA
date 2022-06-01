import Discord from 'discord.js';
import {requestWCA} from './requestWCA.js';
import {help} from './help.js';
import {events} from './help.js';
import {error} from './error.js'
import {continent} from './help.js';
import {continents} from './param.js';
import {isoCountries} from './param.js';
import {recordPerson} from './recordPerson.js';
import {requestWCAFeet} from './requestWCA.js';

let Bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

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
		var pays = 1;

		if (!['wr', 'cr', 'nr', 'id', 'help', 'events', 'continents', 'countries', 'ranking'].includes(cmd)){
			error(cmd, msg);
			return;
		}

		else if (cmd === 'id'){
			if (args.length !== 2){
				if (args.length === 1 ){
					if (args[0].length !==10){
						msg.channel.send("Veuillez préciser l'id de la personne ou bien donner un id valide !");
						return;
					}
					msg.channel.send("https://www.worldcubeassociation.org/persons/" + args[0]);
					return;
				}
				else if (args.length !== 1)
				{msg.channel.send("Donnez un ou deux paramètres avec la commande 'id' ! L'event puis l'id wca de la personne, ou bien seulement l'id de la personne pour accéder à sa page wca ! \nPour la liste d'events' '%events'. ");
				return;}
			}
			recordPerson(cmd, args, msg);
		}
		else if (args[0] ==='feet'){
			var pays = cmd === 'nr' ? isoCountries[args[1].toUpperCase()] : 1;
			var cont = cmd ==='cr' ? continents[args[1]] : 1;
			requestWCAFeet(cmd, args, msg, pays, cont);
		}

		else if (cmd === 'wr'){
			let event = events[args[0]]
			if (args.length !==1){
				msg.channel.send("Donnez un seul paramètre avec la commande 'wr'. \n Pour la liste d'events' '%events'");
				return;
			}
    		requestWCA(cmd, args, msg, pays);
    	}
		else if (cmd === 'cr'){
    		let event = events[args[0]]
    		let cont = '_'+continents[args[1]];
    			if (args.length !== 2){
    				msg.channel.send("Donnez deux paramètre avec la commande 'cr' ( 1) l'event, 2) le continent). \n Pour la liste des events '%events'. \n Pour la liste des continents '%continent'.");
    				return;
    			}

    		requestWCA(cmd, args, msg, pays,  cont);
    	}

    	else if  (cmd === 'nr'){;
    		let event = events[args[0]];
    		pays = isoCountries[args[1].toUpperCase()];
    		if (args.length !== 2){
    			msg.channel.send("Donnez deux paramètres avec la commande 'nr' ( 1) l'event, 2) le pays). \n Pour la liste des events '%events'. \n Pour la liste des pays '%countries'.");
    			return;
    		}
    		requestWCA(cmd, args, msg, pays);
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
		else if (cmd ==='continents'){
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