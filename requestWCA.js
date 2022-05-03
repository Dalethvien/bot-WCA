import {events} from './param.js';
import fetch from 'node-fetch';
import {single} from './param.js';
import {continents} from './param.js';
import {cmd_record} from './param.js';

import {MessageEmbed} from 'discord.js';

// inside a command, event listener, etc.




const centisecondsToTime = (time) => {
	const t = time/100;
	const min = Math.floor(t / 60);
 	let s = (t - min * 60).toFixed(2);
 	if (min > 0 && s.length === 4) {
		s = "0" + s;
  	}

	return `${min ? min + ":" : ""}${s}`;
	};
const Embed = (single, avg, singleF, avgF, msg, cmd) =>{
	const exampleEmbed = new MessageEmbed()
	.setColor('#ffbf00')
	.setTitle(cmd)
	.addFields(
	{name:single, value: singleF},
	{name:avg, value:avgF })

	msg.channel.send({ embeds: [exampleEmbed] });

}

const requestWCA = async(cmd, args, msg, avg, cont=1) => {
	
		let single = "<:Single:369420530098372608>";
		let list = Object.keys(events);
		let conts = Object.keys(continents);
		if (!list.includes(args[0])){
			msg.channel.send("L'event doit faire partie de la liste d'events existant ! \nSi vous voulez accèder à la liste '%events'")
			return;
		}
		else if (cmd === 'cr'){
			 if (!conts.includes(args[1])){
				msg.channel.send("Le continent doit faire partie de la liste de continents existant ! \n Si vous voulez accèder à la liste '%continent'")
				return;
			}
		}
		

		let event = events[args[0]];
		let url = 'https://www.worldcubeassociation.org/api/v0/records';
    	const res = await fetch(url);
    	const json = await res.json();
    	var wr = await (cmd === "wr" ? json.world_records : cmd === "cr" ? json.continental_records[cont] : json.national_records[nat])[event];
    	const wrS = Number(wr['single']);
    	const wrA = Number(wr['average']);

    	if (args[0] === 'fmc'){

    		const wrS = wr['single'];
    		const wrA = Number(wr['average'])/100;
    		msg.channel.send(`${single}${wrS} \n${avg}${wrA}`);
    		return;

    	}
    	else if (args[0] === 'mbld'){
			let temps = ((Math.floor(Number(wr['single']) / 100) % 1e5) * 100)/100;
			let minutes = Math.floor(temps/60);
			let seconds = Math.round(((temps/60) - minutes)*60);
    		const value = wr['single'];
			const fail = value%100;
			const solved = 99 - (Math.floor(value/1e7)%100);
			const success = fail + solved;
			const totalCubes = fail + success;
			msg.channel.send(`${success}/${totalCubes} cubes en ${minutes}:${seconds}`);
			return;

		}    	
		
	var singleF = isNaN(wrS) === false ? centisecondsToTime(wrS) : 'DNF';
	var avgF = isNaN(wrA) === false ? centisecondsToTime(wrA) : 'DNF';
    let test = Embed(single, avg, singleF, avgF, msg, cmd);


    	
    	
    if (cmd === 'ranking') return;
}

export {requestWCA};