import {events} from './param.js';
import fetch from 'node-fetch';
import {single} from './param.js';
import {continents} from './param.js';
import {cmd_record} from './param.js';


const requestWCA = async(cmd, args, msg, avg, cont=1) => {
		let single = '<:Single:369420530098372608>';
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
    	const wrS = Number(wr['single'])/100;
    	const wrA = Number(wr['average'])/100;
    	console.log(wrS, wrA);

    	if (args[0] === 'fmc'){

    		const wrS = wr['single'];
    		const wrA = Number(wr['average'])/100;
    		msg.channel.send(`${single}${wrS} \n${avg}${wrA}`);

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

		}    	
    	var minuteS = Math.floor(wrS/60) === 0 ? '' : Math.floor(wrS/60).toString()+':';
    	console.log(Math.floor(wrS/60));
    	var secondS = Math.round(wrS-(Math.floor(wrS/60)*60));
    	var csS = Math.round((wrS- Math.floor(wrS))*100);
    	
    	if (secondS < 10 && secondS !== 0 && minuteS !== '' ){
    		secondS = `0${secondS}`;
    	}
    	if (csS <10 && csS !== 0){
    		csS = `0${csS}`;
    	}

    	var minuteA = Math.floor(wrA/60) === 0 ? '' : Math.floor(wrA/60).toString()+':';
    	var secondA = Math.floor(wrA-(Math.floor(wrA/60)*60));
    	var csA = Math.round((wrA - Math.floor(wrA))*100);
    
    	if (secondA < 10 && secondA !== 0 && minuteA !== ''){
    		secondA = `0${secondA}`;
    	}
    	if (csA <10 && csA !== 0){
    		csA = `0${csA}`;
    	}
    	msg.channel.send(`${single}${minuteS}${secondS}.${csS} \n${avg}${minuteA}${secondA}.${csA}`);

    	
    	
    if (cmd === 'ranking') return;
}

export {requestWCA};