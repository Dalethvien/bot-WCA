import Discord from 'discord.js';
import fetch from 'node-fetch';
import {events} from './param.js';
import {single} from './param.js';
let Bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const requestWCA = async(cmd, args, msg) => {
	if (cmd === 'wr'){
		let event = events[args[0]];
		let url = 'https://www.worldcubeassociation.org/api/v0/records';
    	const res = await fetch(url);
    	const json = await res.json();
    	const wr = await json.world_records[event];
    	const wrS = Number(wr['single'])/100;
    	const wrA = Number(wr['average'])/100;
    	if (wrS > 60){
    		let minutesS = Math.floor(wrS/60);
    		let secondsS = wrS%60;

    		let minutesA = Math.floor(wrA/60);
    		let secondsA = wrA%60;

    		msg.channel.send(`Le wr single de ${args[0]} est ${minutesS}:${secondsS} et le record Ao5 est ${minutesA}:${secondsA}.`);
    	}
    	else if (wrS < 60){
    		msg.channel.send(`Le wr single de ${args[0]} est ${wrS} et le record Ao5 est ${wrA}.`);
    	}
    	
    }
    else if (cmd === 'ranking') return;
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

	if (cmd === 'wr'){
			requestWCA(cmd, args, msg);
	}

	else if (cmd === 'ranking'){
		let event = args[0]
		let single = args[1]
		let top = args[2]

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
Bot.login(process.env.TOKEN);