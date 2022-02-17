import Discord from 'discord.js';
import fetch from 'node-fetch';
import info from 'config.json' assert { type:`config.json`};
let Bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const requestWCA = async(cmd, args) => {
	if (cmd === 'wr'){
        url = 'https://www.worldcubeassociation.org/api/v0/records'
    }
    const res = await fetch(url);
    console.log(res);
    const json = await res.json();
    return {json};
}
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
	
	msg.channel.send('La commande est ' + cmd)
	msg.channel.send('Les arguments sont ' + args)

	if (cmd === 'wr'){
		if (args[0] === '33'){
			msg.channel.send('Les wr de 3x3 sont \n Single : 3.47 \n Ao5 : 5.07');
		}
		else if (args[0] !== '33') return;
		requestWCA(cmd, args);
	}

	else if (cmd === 'ranking'){
		let event = args[0]
		let single = args[1]
		let top = args[2]

		// partie à compléter par la requête wca
		msg.channel.send(`Vous voules le top ${top} ${single} de l'event : ${event}`);
	}


	}

	if (msg.author.id === '664931482346717184' || msg.author.id === '230691286271655937'){
		if (msg.content.toLowerCase() === 'ping'){
			msg.reply('pong !');
		}
		else if (msg.content !== 'ping') return;
	}


});
Bot.login(config.token);