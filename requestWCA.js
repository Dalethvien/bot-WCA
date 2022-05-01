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
				msg.channel.send("Le continent doit faire partie de la liste de continents existant ! \n Si vous voulez accèder à la liste '%continents'")
				return;
			}
		}
		

		let event = events[args[0]];
		let url = 'https://www.worldcubeassociation.org/api/v0/records';
    	const res = await fetch(url);
    	const json = await res.json();
    	var wr = await (cmd === "wr" ? json.world_records : cmd === "cr" ? json.continental_records[cont] : json.national_records[nat])[event];
    	console.log(wr);
    	const wrS = Number(wr['single'])/100;
    	const wrA = Number(wr['average'])/100;

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
    	else if (wrS > 60 || wrA >60){
    		let minutesS = Math.floor(wrS/60);
    		let secondsS = Math.round((wrS%60)*100);
    		let secondsSF = (secondsS/100).toFixed(2);
    		console.log(secondsSF);

    		var minutesA = isNaN(wrA) === true ? "" : Math.floor(wrA/60);
    		let secondsA = Math.round((wrA%60)*100);
    		var secondsAF = isNaN(wrA)=== true ? "DNF" : secondsA/100;
    		console.log(minutesA, secondsAF);

    		if (secondsSF < 10){
    			if (secondsA < 1000){
    				msg.channel.send(`${single}${minutesS}:0${secondsSF} \n${avg}${minutesA}:0${secondsAF}`);
    			}
    			else if (secondsA > 1000){
    				msg.channel.send(`${single}${minutesS}:0${secondsSF} \n${avg}${minutesA}:${secondsAF}`);
    			}
    		}
    		else if (secondsSF >10 && secondsA<1000){
    			msg.channel.send(`${single}${minutesS}:${secondsSF} \n${avg}${minutesA}:0${secondsAF}`);
    		}
    		else if (secondsSF>10 && secondsA>1000){
    			msg.channel.send(` ${single}${minutesS}:${secondsSF} \n${avg}${minutesA}:${secondsAF}`);
    		}
    		else if (secondsAF === "DNF"){
    			msg.channel.send(`${single}${minutesS}:${secondsSF} \n${avg}${secondsAF}`);
    		}
    	}
    	else if (wrS < 60){
    		console.log(wrS);
    		msg.channel.send(`${single}${wrS} \n${avg}${wrA}`);
    	}
    	
    else if (cmd === 'ranking') return;
}

export {requestWCA};