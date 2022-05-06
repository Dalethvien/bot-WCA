import {events} from './param.js';
import fetch from 'node-fetch';
import {single} from './param.js';
import {continents} from './param.js';
import {cmd_record} from './param.js';
import {isoCountries} from './param.js';
import {MessageEmbed} from 'discord.js';

// inside a command, event listener, etc.

const nameAndFlag = async(patternName, patternFlag, args, cmd, average='False') =>{
		const pageWca = "https://www.worldcubeassociation.org/results/records?event_id=";
		var region = cmd === 'wr' ? '&region=world' : cmd === 'cr' ? '&region='+ continents[args[1]] : '&region='+ isoCountries[args[1].toUpperCase()];
		let pageWcaFinal = pageWca + events[args[0]] + region;

		const request = await fetch(pageWcaFinal);
		const requestF = await request.text();

		let name = requestF.match(patternName);
		var nameF = name === null ? 'N/A' : name[1];

		let flag= requestF.match(patternFlag);
		var num = average === 'True' ? 1 : 0
		let flagF = flag[num] === undefined ? 'N/A' :flag[num].toString().match(/(?<=flag-icon-|fi-)[a-z]{2}/g)[0];

		return([nameF, flagF]);
}



const centisecondsToTime = (time) => {
	const t = time/100;
	const min = Math.floor(t / 60);
 	let s = (t - min * 60).toFixed(2);
 	if (min > 0 && s.length === 4) {
		s = "0" + s;
  	}

	return `${min ? min + ":" : ""}${s}`;
	};

const Embed = (single, avg, singleF, avgF, msg, title, nameSingle, nameAvg, flagSingle, flagAvg) =>{

	const exampleEmbed = new MessageEmbed()
	.setColor('#ffbf00')
	.setTitle(title)
	.addFields(
	{name:`${single} ${nameSingle} ${flagSingle}`, value : singleF},

	{name: `${avg} ${nameAvg} ${flagAvg}`, value : avgF} //឵឵឵ is a special character for a false space in discord
	)

	msg.channel.send({ embeds: [exampleEmbed] });

}

const embedMbld = (title, msg, result, single, nameSingle, flagSingle) =>{
	const exampleEmbedMbld = new MessageEmbed()
	 .setColor('#ffbf00')
	 .setTitle(title)
	 .addFields(
	 	{name:`${single} ${nameSingle} ${flagSingle}`, value:result})
	 msg.channel.send({embeds: [exampleEmbedMbld]});
}

const requestWCA = async(cmd, args, msg, avg, pays, cont=1,) => {

		let patternNameSingle = /Single.+\n.+">(.+)<.a/;
		let patternNameAvg = `Average.+\n.+">(.+)</a`;

		let patternFlag = /country.+-(.+)"/g;

		
		let singleEmbed = await(nameAndFlag(patternNameSingle, patternFlag, args, cmd));
		let nameSingle = singleEmbed[0];
		let flagSingle = ':flag_' + singleEmbed[1].toString() + ':';
		let average = 'True';
		let avgEmbed = await(nameAndFlag(patternNameAvg, patternFlag, args, cmd, average));
		let nameAvg = avgEmbed[0];
		var flagAvg = avgEmbed[1] ==='N/A'? '' :':flag_' + avgEmbed[1].toString() + ':';
		
		var  eventEmbed = args[0] === "22" ? "2x2" : args[0] === "33" ? "3x3" : args[0] === "44" ? "4x4" : args[0]=== "55" ? "5x5" : args[0] === "66" ? "6x6" : args[1] === "77" ? "7x7" : args[0] === 'pyra' ? "pyraminx" : args[0] === "mega" ? "megaminx" : args[0] === "fmc" ? "FMC" : args[0] === 'sq1' ? 'square-one' : args[0] === 'mbld' ? 'multiblind' : args[0];
		var title = cmd === "cr"? cmd_record[cmd][args[1]] + " " + eventEmbed : cmd==="nr"? pays + ' Record'+ " " + eventEmbed : cmd_record[cmd] +" " + eventEmbed;
		let single = "<:Single:369420530098372608>";
		let list = Object.keys(events);
		let conts = Object.keys(continents);
		let countries = Object.keys(isoCountries);
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
		else if (cmd === 'nr'){
			if (!countries.includes(args[1].toUpperCase())){
				msg.channel.send("Le pays doit faire partie de la liste de pays disponible ! \n Si vous voulez accéder à la liste des pays '%countries'")
				return;
			}
		}
		

		let event = events[args[0]];
		let url = 'https://www.worldcubeassociation.org/api/v0/records';
    	const res = await fetch(url);
    	const json = await res.json();
    	var wr = await (cmd === "wr" ? json.world_records : cmd === "cr" ? json.continental_records[cont] : json.national_records[pays]);
    	var wr = wr === undefined ? wr : wr[event];
   		if (wr === undefined){
    		msg.channel.send("Il n'y a pas de record pour ce pays (ou tout du moins dans cet event) ! Ou alors la <:WCA:456059019677663233> ne le considère pas comme un territoire à part !");
    		return;
    	}
    	const wrS = Number(wr['single']);
    	const wrA = Number(wr['average']);

    	if (args[0] === 'fmc'){

    		const singleF = wr['single'].toString();
    		const avgF = (Number(wr['average'])/100).toString();
    		let test = Embed(single, avg, singleF, avgF, msg, title, nameSingle, nameAvg, flagSingle, flagAvg)
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
			let result = (`${success}/${totalCubes} cubes en ${minutes}:${seconds}`).toString();
			let test = embedMbld(title, msg, result, single, nameSingle, flagSingle);
			return;

		}    	
		
	var singleF = isNaN(wrS) === false ? centisecondsToTime(wrS) : 'DNF';
	var avgF = isNaN(wrA) === false ? centisecondsToTime(wrA) : 'DNF';
    let test = Embed(single, avg, singleF, avgF, msg, title, nameSingle, nameAvg, flagSingle, flagAvg);


    	
    	
    if (cmd === 'ranking') return;
}

export {requestWCA};
