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
	
	var i = list.includes(args[0]) === true ? 0 : list.includes(args[1]) === true ? 1: list.includes(args[2]) === true ? 2 : list.includes(args[3]) === true ? 3 : undefined;
	if (i === undefined){
		msg.channel.send("Précisez un event valide ! ")
		return;
	}
	let event = args[i];
	args.splice(i, 1);

	var i =  isNaN(args[0]) === false ? 0 : isNaN(args[1]) === false ? 1 : isNaN(args[2]) === false ? 2 :  100;
	var rank = args[i] !== undefined ? args[i] : 100;
	args.splice(i, 1);

	var i = isNaN(args[0]) === true && args[0] !== "average" ? 0 : isNaN(args[1]) === true && args[1] !== "average" ? 1 : isNaN(args[2]) === true && args[2] !== "average" ? 2 :  undefined;
	let regArg = args[i]
	args.splice(i, 1);
	var average = args[0] === "average" ? "average" : undefined;	

	
	let conts = Object.keys(continents);
	let pays = Object.keys(isoCountries);
	var region = regArg === undefined ? "" : conts.includes(regArg) === true ? "?region=_"+continents[regArg] : "?region="+isoCountries[regArg.toUpperCase()];
	var eventEmbed = event === "22" ? "2x2" : event === "33" ? "3x3" : event === "44" ? "4x4" : event=== "55" ? "5x5" : event === "66" ? "6x6" : event === "77" ? "7x7" : event === 'pyra' ? "pyraminx" : event === "mega" ? "megaminx" : event === "fmc" ? "FMC" : event === 'sq1' ? 'square-one' : event === 'mbld' ? 'multiblind' : event;
	var wca = average === "average" ? await fetch('https://www.worldcubeassociation.org/results/rankings/' + events[event] + '/average' + region) : await fetch('https://www.worldcubeassociation.org/results/rankings/' + events[event] + '/single' + region);
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
	var url = average === undefined ? 'https://www.worldcubeassociation.org/results/rankings/' + events[event] + '/single' + region : 'https://www.worldcubeassociation.org/results/rankings/' + events[event] + '/average' + region;
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