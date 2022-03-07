import {events} from './param.js';
import fetch from 'node-fetch';
import {single} from './param.js';

const requestWCA = async(cmd, args, msg, avg) => {
	if (cmd === 'wr'){
		let single = '<:Single:369420530098372608>';
		let list = Object.keys(events);
		if (!list.includes(args[0])){
			msg.channel.send("L'event doit faire partie de la liste d'events existant ! \nSi vous voulez accèder à la liste '%events'")
			return;
		}

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
    		msg.channel.send(`${single}${wrS} \n${avg}${wrA}`);

    	}
    	else if (args[0] === 'mbld'){
			let temps = ((Math.floor(Number(wr['single']) / 100) % 1e5) * 100)/100;
			let minutes = Math.floor(temps/60);
			let seconds = Math.round(((temps/60) - minutes)*60);
			let cubes =(Math.floor(Number(wr['single']))%1e5);
			let totalCubes = Math.floor((cubes%1e3)/10);
			let fail = (Number(wr['single']))%10;
			let success = totalCubes - fail;
			msg.channel.send(`${success}/${totalCubes} cubes en ${minutes}:${seconds}`);

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
    				msg.channel.send(`${single}${minutesS}:0${secondsSF} \n${avg}${minutesA}:0${secondsAF}`);
    			}
    			else if (secondsAF > 10){
    				msg.channel.send(`${single}${minutesS}:0${secondsSF} \n${avg}${minutesA}:${secondsAF}`);
    			}
    		}
    		else if (secondsSF >10 && secondsAF<10){
    			msg.channel.send(`${single}${minutesS}:${secondsSF} \n${avg}${minutesA}:0${secondsAF}`);
    		}
    		else if (secondsSF>10 && secondsAF>10){
    			msg.channel.send(` ${single}${minutesS}:${secondsSF} \n${avg}${minutesA}:${secondsAF}`);
    		}
    	}
    	else if (wrS < 60){
    		msg.channel.send(`${single}${wrS} \n${avg}${wrA}`);
    	}
    	
    }
    else if (cmd === 'ranking') return;
}

export {requestWCA};