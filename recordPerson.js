import {events} from './param.js';
import fetch from 'node-fetch';
import {single} from './param.js';
import {continents} from './param.js';
import {cmd_record} from './param.js';
import {isoCountries} from './param.js';
import {MessageEmbed} from 'discord.js';
import {centisecondsToTime} from './requestWCA.js';


const embedId = (event, singleF, averageF, name, flag, msg)=>{
	let single = "<:Single:369420530098372608>";
	let avg = '<:AVG:369418969351716864>';

	const exampleEmbed = new MessageEmbed()
	.setColor('#ffbf00')
	.setTitle(event + ' record of ' + name+' '+flag)
	.setFields(
		{name:single, value:singleF},
		{name:avg, value:averageF})
	msg.channel.send({ embeds: [exampleEmbed] });
}




const recordPerson = async(cmd, args, msg) =>{

	let list = Object.keys(events);
	if (!list.includes(args[0])){
		msg.channel.send("L'event doit faire partie de la liste d'events existant ! \nSi vous voulez accèder à la liste '%events'")
		return;
	}

	let url = 'https://www.worldcubeassociation.org/api/v0/persons/';
	let event = events[args[0]];
	let id = args[1];
	let urlF = url+id;
	const res = await fetch(urlF);

	try{

	const json = await res.json();
	let name = json.person.name;
	let record = json.personal_records[event];
	if (record === undefined){
		msg.channel.send("Cette personne n'a pas de record dans cet event !");
		return;
	}
	let single = centisecondsToTime(record.single.best);
	var average = record.average === undefined ? 'N/A' : centisecondsToTime(record.average.best);
	//let singleF = centisecondsToTime(single);
	//let averageF = centisecondsToTime(average);

	let flag = ':flag_'+json.person.country_iso2.toLowerCase()+':';

	let test = embedId(event, single, average, name, flag, msg);

	}
	catch (err){
		msg.channel.send("Cette id wca n'existe pas !");
		return;
	}
	

}
export{recordPerson};