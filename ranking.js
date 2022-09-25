import {continents} from './param.js';
import {cmd_record} from './param.js';
import {isoCountries} from './param.js';
import {MessageEmbed} from 'discord.js';
import cheerio from 'cheerio';
import {events} from './param.js';
import fetch from 'node-fetch';


const embedRanking = (url, title, embedFields, msg) =>{
	const exampleEmbed = new MessageEmbed()
	.setColor("#ffbf00")
	.setTitle(title)
	.setURL(url)
	.setFields(embedFields)
	msg.channel.send({ embeds: [exampleEmbed] });

}

const ranking = async (cmd, args, msg)=>{
	let list = Object.keys(events);
	var i = list.includes(args[0]) === true ? 0 : list.includes(args[1]) === true ? 1: list.includes(args[2]) === true ? 2 : undefined ;
	if (i === undefined){
		msg.channel.send("Précisez un event valide ! ")
		return;
	}
	let event = args[i];
	args.splice(i, 1);
	var rank =  isNaN(args[0]) === false ? args[0] : isNaN(args[1]) === false ? args[1] : 100;
	var regArg = isNaN(args[0]) === true ? args[0] : isNaN(args[1]) === true ? args[1] : args[1];
	let conts = Object.keys(continents);
	let pays = Object.keys(isoCountries);
	var region = regArg === undefined ? "" : conts.includes(regArg) === true ? "?region=_"+continents[regArg] : "?region="+isoCountries[regArg.toUpperCase()];
	var eventEmbed = event === "22" ? "2x2" : event === "33" ? "3x3" : event === "44" ? "4x4" : event=== "55" ? "5x5" : event === "66" ? "6x6" : event === "77" ? "7x7" : event === 'pyra' ? "pyraminx" : event === "mega" ? "megaminx" : event === "fmc" ? "FMC" : event === 'sq1' ? 'square-one' : event === 'mbld' ? 'multiblind' : event;
	let wca = await fetch('https://www.worldcubeassociation.org/results/rankings/' + events[event] + '/single' + region);
	let page = await wca.text();
	const $ = cheerio.load(page);
	var names = [];
	var times = [];
	let n = 1;
	while (n <= rank && $(`#results-list > div > table > tbody > tr:nth-child(${n}) > td.name > a`, page).text() !== ''){
			names.push($(`#results-list > div > table > tbody > tr:nth-child(${n}) > td.name > a`, page).text());
			times.push($(`#results-list > div > table > tbody > tr:nth-child(${n}) > td.result`, page).text());
			n++;	
		}
	let url = 'https://www.worldcubeassociation.org/results/rankings/' + events[args[0]] + '/single' + region;
	var title = region === "" ? `Top ${rank} ${eventEmbed} world` : `Top ${rank} ${eventEmbed} ${region}`.replace("?region=", "").replace("_", "");

	let embedFields = [];
	for (let groupsOfTen = 0; groupsOfTen < names.length+10 && groupsOfTen >= 0; groupsOfTen += 10) {
		let currentField = {
			name: `${groupsOfTen + 1}-${groupsOfTen + 10}`,
			value: "",
			inline: true
		};
		for (var unit = names.length-groupsOfTen <10 ? names.length-groupsOfTen-1 : 9; unit >=0; unit -= 1) {
			let number = groupsOfTen + unit;
			if (names[number] !== undefined) {
				currentField.value = `${number+1} - ${names[number]} (${times[number]})\n${currentField.value}`;
			} else {
				unit = 0;
				groupsOfTen = -11;
			}
		}
		if (currentField.value !== "") {
			currentField.value += "\n\u200b";
			embedFields.push(currentField);
			if (groupsOfTen % 20 === 0) { // add an empty field every two fields to keep only 2 columns
				embedFields.push({
					name: "\u200b",
					value: "\u200b",
					inline: true
				})
			}
		}
	}
	embedRanking(url, title, embedFields, msg)
	//console.log(names, "\n", times);



}
export {ranking};