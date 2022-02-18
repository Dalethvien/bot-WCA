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
    	
    	if (args[0] === 'fmc'){
    		const wrS = wr['single'];
    		const wrA = Number(wr['average'])/100;
    		msg.channel.send(`Le wr single de ${args[0]} est ${wrS} et le wr average est ${wrA}`);

    	}
    	else if (args[0] === 'mbld'){
			let temps = ((Math.floor(Number(wr['single']) / 100) % 1e5) * 100)/100;
			let minutes = Math.floor(temps/60);
			let seconds = Math.round(((temps/60) - minutes)*60);
			let cubes =(Math.floor(Number(wr['single']))%1e5);
			let totalCubes = Math.floor((cubes%1e3)/10);
			let fail = (Number(wr['single']))%10;
			let success = totalCubes - fail;
			msg.channel.send(`le wr de ${args[0]} est de ${success}/${totalCubes} cubes en ${minutes}:${seconds}.`)
			console.log(success, totalCubes, fail);

		}    	
    	else if (wrS > 60 || wrA >60){
    		let minutesS = Math.floor(wrS/60);
    		let secondsS = Math.round((wrS%60)*100);
    		let secondsSF = secondsS/100;

    		let minutesA = Math.floor(wrA/60);
    		let secondsA = Math.round((wrA%60)*100);
    		let secondsAF = secondsA/100;

    		if (secondsSF < 10){
    			if (secondsAF < 10){
    				msg.channel.send(`Le wr single de ${args[0]} est ${minutesS}:0${secondsSF} et le record Ao5 est ${minutesA}:0${secondsAF}.`);
    			}
    			else if (secondsAF > 10){
    				msg.channel.send(`Le wr single de ${args[0]} est ${minutesS}:0${secondsSF} et le record Ao5 est ${minutesA}:${secondsAF}.`);
    			}
    		}
    		else if (secondsSF >10 && secondsAF<10){
    			msg.channel.send(`Le wr single de ${args[0]} est ${minutesS}:${secondsSF} et le record Ao5 est ${minutesA}:0${secondsAF}.`);
    		}
    		else if (secondsSF>10 && secondsAF>10){
    			msg.channel.send(`Le wr single de ${args[0]} est ${minutesS}:${secondsSF} et le record Ao5 est ${minutesA}:${secondsAF}.`);
    		}
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
			msg.channel.send('Oups, cette commande est encore en développement');
			return;
			requestWCA(cmd, args, msg);

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