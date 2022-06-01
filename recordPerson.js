import {events} from './param.js';
import fetch from 'node-fetch';
import {single} from './param.js';
import {continents} from './param.js';
import {cmd_record} from './param.js';
import {isoCountries} from './param.js';
import {MessageEmbed} from 'discord.js';
import cheerio from 'cheerio';
import {getRankId} from './getRank.js';

const getTime = (page, $)=>{
	var times = {};
	$(".personal-records > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr", page).each(function() {
    times[$(this).find("td.event").data("event")] = {
        'single': $(this).find("td.single > a").first().text().trim(),
        'average': $(this).find("td.average > a").last().text().trim()
    }
	});
	return(times);

}

const getCountry = (page, $)=>{
	let cheerioCountry = $(".country", page).text().trim();
	let country = Object.keys(isoCountries).find(key => isoCountries[key] === cheerioCountry).toLowerCase();
	let flag = `:flag_${country}:`;
	return(flag);
}

const embedId = (singleF, averageF, name, flag, WRS, WRA, CRS, CRA, NRS, NRA, msg, args)=>{
	let single = "<:Single:369420530098372608>";
	let avg = '<:AVG:369418969351716864>';
	var  eventEmbed = args[0] === "22" ? "2x2" : args[0] === "33" ? "3x3" : args[0] === "44" ? "4x4" : args[0]=== "55" ? "5x5" : args[0] === "66" ? "6x6" : args[1] === "77" ? "7x7" : args[0] === 'pyra' ? "pyraminx" : args[0] === "mega" ? "megaminx" : args[0] === "fmc" ? "FMC" : args[0] === 'sq1' ? 'square-one' : args[0] === 'mbld' ? 'multiblind' : args[0];

	if (args[0]!=='mbld'){
		const exampleEmbed = new MessageEmbed()
		.setColor('#000000')
		.setTitle(eventEmbed + ' record of ' + name+' '+flag)
		.setFields(
			{name:single, value:`${singleF} (WR${WRS}) (CR${CRS}) (NR${NRS})`},
			{name:avg, value:`${averageF} (WR${WRA}) (CR${CRA}) (NR${NRA})`})
		msg.channel.send({ embeds: [exampleEmbed] });
	}

	else if (args[0]==='mbld'){
		let listeSingleSplit = singleF.split(" ");
		let time = listeSingleSplit[0] + " en " + listeSingleSplit[1];
		const exampleEmbed = new MessageEmbed()
		.setColor('#00000')
		.setTitle(`${eventEmbed} record of ${name} ${flag}`)
		.setFields(
			{name:single, value:`${time} (WR${WRS}) (CR${CRS}) (NR${NRS})`})
		msg.channel.send({ embeds: [exampleEmbed] });		
	}
}




const recordPerson = async(cmd, args, msg) =>{

	let list = Object.keys(events);
	if (!list.includes(args[0])){
		msg.channel.send("L'event doit faire partie de la liste d'events existant ! \nSi vous voulez accèder à la liste '%events'")
		return;
	}


	let link = await fetch("https://www.worldcubeassociation.org/persons/"+args[1]);
	let page = await link.text();
	const $ = cheerio.load(page);
	let testid = $("div > div > h1", page).text();
	if (testid === "The page you were looking for doesn't exist."){
		msg.channel.send("Cette id wca n'existe pas !")
		return;
	}
	try {
		let times = getTime(page, $);
		let singlE = times[events[args[0]]]['single'];
		var averagE = times[events[args[0]]]['average'] === '' ? 'DNF' : times[events[args[0]]]['average'];
		
		let event =events[args[0]];
		let ranks = getRankId(page, $, event);
		let wrRankSingle = ranks[events[args[0]]]['single']['WR'];
		let wrRankAverage = ranks[events[args[0]]]['average']['WR'];
		let crRankSingle = ranks[events[args[0]]]['single']['CR'];
		let crRankAverage = ranks[events[args[0]]]['average']['CR'];
		let nrRankSingle = ranks[events[args[0]]]['single']['NR'];
		let nrRankAverage = ranks[events[args[0]]]['average']['NR'];
		
		let flag = getCountry(page, $);

		let name = $("#person > div:nth-child(1) > div.text-center > h2", page).text().trim();
		embedId(singlE, averagE, name, flag, wrRankSingle, wrRankAverage, crRankSingle, crRankAverage, nrRankSingle, crRankAverage, msg, args);

		
	}
	catch (err){
		msg.channel.send("Cette personne n'a pas de temps dans cet event !")
	}

}
export{recordPerson};