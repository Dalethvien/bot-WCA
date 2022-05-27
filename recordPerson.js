import {events} from './param.js';
import fetch from 'node-fetch';
import {single} from './param.js';
import {continents} from './param.js';
import {cmd_record} from './param.js';
import {isoCountries} from './param.js';
import {MessageEmbed} from 'discord.js';
import {centisecondsToTime} from './requestWCA.js';
import {mbldToResult} from './requestWCA.js';
import cheerio from 'cheerio';
import {getRankId} from './getRank.js';


const embedId = (singleF, averageF, name, flag, WRS, WRA, msg, args)=>{
	let single = "<:Single:369420530098372608>";
	let avg = '<:AVG:369418969351716864>';
	var  eventEmbed = args[0] === "22" ? "2x2" : args[0] === "33" ? "3x3" : args[0] === "44" ? "4x4" : args[0]=== "55" ? "5x5" : args[0] === "66" ? "6x6" : args[1] === "77" ? "7x7" : args[0] === 'pyra' ? "pyraminx" : args[0] === "mega" ? "megaminx" : args[0] === "fmc" ? "FMC" : args[0] === 'sq1' ? 'square-one' : args[0] === 'mbld' ? 'multiblind' : args[0];

	if (args[0]!=='mbld'){
		const exampleEmbed = new MessageEmbed()
		.setColor('#000000')
		.setTitle(eventEmbed + ' record of ' + name+' '+flag)
		.setFields(
			{name:single, value:singleF+'(WR'+WRS+')'},
			{name:avg, value:averageF+'(WR'+WRA+')'})
		msg.channel.send({ embeds: [exampleEmbed] });
	}

	else if (args[0]==='mbld'){

		const exampleEmbed = new MessageEmbed()
		.setColor('#ffbf00')
		.setTitle(eventEmbed + ' record of ' + name+' '+flag)
		.setFields(
			{name:single, value:singleF})
		msg.channel.send({ embeds: [exampleEmbed] });		
	}
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
	let res = await fetch(urlF);
	
	try{
	let liste = await getRankId(id);
	let WRS = liste[event]['single'];
	let WRA = liste[event]['average'];
	
	const json = await res.json();
	let name = json.person.name;
	let record = json.personal_records[event];
	if (record === undefined){
		msg.channel.send("Cette personne n'a pas de record dans cet event !");
		return;
	}

	var single = args[0] === 'mbld'? mbldToResult(record.single.best) : centisecondsToTime(record.single.best);
	var average = record.average === undefined ? 'N/A' : centisecondsToTime(record.average.best);

	let flag = ':flag_'+json.person.country_iso2.toLowerCase()+':';

	let test = embedId(single, average, name, flag, WRS, WRA, msg, args);





	}
	catch (err){
		msg.channel.send("Cet id wca n'existe pas !");
		return;
	}
	 

}
export{recordPerson};