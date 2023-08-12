import {events} from './param.js';
import fetch from 'node-fetch';
import {single} from './param.js';
import {continents} from './param.js';
import {cmd_record} from './param.js';
import {isoCountries} from './param.js';
import {MessageEmbed} from 'discord.js';
import cheerio from 'cheerio';
import {getRankRecord} from './getRank.js';

const getInfos = (data, ele)=>{
	let liste = [];
	data.forEach(element => liste.push(element[ele].trim()) );
	return(liste);
}
const getTime = (page) =>{
	const $ = cheerio.load(page);
	var tableau = [];
	$("#results-list > div >table >tbody >tr", page).each(function(){
    let type = $(this).find("td.type").text().trim();
    (tableau[type] = tableau[type] || []).push({
        'name':$(this).find("td.name > a").text().trim(),
        'time':$(this).find("td.result").text().trim(),
        'country':$(this).find("td.country").text().trim()
    })
});;
	return(tableau);

}
const getFlag = (data)=>{
	let country = Object.keys(isoCountries).find(key => isoCountries[key] === data).toLowerCase();
	let flag = `:flag_${country}:`;
	return(flag);
}


const Embed = (timeSingle, timeAverage, nameSingle, nameAvg, flag_single, flag_avg, WRS, WRA, msg, title, cmd, event) =>{
	let singleEmote = "<:Single:369420530098372608>";
	let avgEmote = '<:AVG:369418969351716864>';
	var color = cmd === 'wr' ? '#F44337' : cmd === 'cr' ?'#FFEC3C' : '#01E676';
	var NS = []
	var NA = []
	for (let i=0; i< flag_single.length; i++){
		if (cmd !== 'nr'){
			NS.push(nameSingle[i] + flag_single[i])
		}
		else if ((i+1) !== flag_single.length){
			NS.push(nameSingle[i])}
		else if ((i+1) === flag_single.length){
				NS.push(nameSingle[i] + flag_single[0])
			}
	}
	for (let i=0; i< flag_avg.length; i++){
		if (cmd !== 'nr'){
			NA.push(nameAvg[i] + flag_avg[i])
		}
		else if ((1+i) !== flag_avg.length){
			NA.push(nameAvg[i])}
		else if ((i+1) === flag_avg.length){
				NA.push(nameAvg[i] + flag_avg[0])
			}
	}
	
	let nameEmbedSingle = singleEmote +" " +NS.join().replaceAll(',', ', ');
	let nameEmbedAverage = avgEmote + " " + NA.join().replaceAll(',', ', ');

	if (event !== 'mbld'){
		const exampleEmbed = new MessageEmbed()
		.setColor(color)
		.setTitle(title)
		.addFields(
		{name: nameEmbedSingle, value : timeSingle[0]},

		{name: nameEmbedAverage, value : timeAverage[0]} 
		)

		msg.channel.send({ embeds: [exampleEmbed] });}

	else if (event === 'mbld'){
		const exampleEmbed = new MessageEmbed()
		.setColor(color)
		.setTitle(title)
		.addFields(
		{name: nameEmbedSingle, value : timeSingle[0]}) 
		msg.channel.send({ embeds: [exampleEmbed] });
	}


}


const requestWCA = async(cmd, args, msg) => {

		let list = Object.keys(events);
		let conts = Object.keys(continents);
		let countries = Object.keys(isoCountries);
		var i = list.includes(args[0]) === true ? 0 : list.includes(args[1]) === true ? 1: list.includes(args[2]) === true ? 2 : undefined ;

		var event = args[i];
		if (event !== undefined){
			args.splice(i, 1)};
		if (args.lenght !== 0 && (cmd === 'nr' || cmd === 'cr')){
			if (conts.includes(args[0]) === false && countries.includes(args[0].toUpperCase()) === false){
				if (cmd === 'nr'){
					msg.channel.send("Veuillez préciser un pays valides ! ")
				}else if(cmd === 'cr'){
					msg.channel.send("Veuillez préciser un continent valdie !")
				}
				return;
			}

		}


		const pageWcA = "https://www.worldcubeassociation.org/results/records?event_id=";
		var region = cmd === 'wr' ? '&region=world' : cmd === 'cr' ? '&region=_'+ continents[args[0]] : '&region='+ isoCountries[args[0].toUpperCase()];
		let pageWcaFinaL = pageWcA+ events[event] +region;
		let request = await fetch(pageWcaFinaL);
		let page = await request.text();
		const $ = cheerio.load(page)


		let data = getTime(page);
		if (Object.keys(data).length ===0){
			msg.channel.send("Il n'y a pas de record pour ce pays (ou tout du moins dans cet event) ! Ou alors la <:WCA:456059019677663233> ne le considère pas comme un territoire à part !");
    		return;
		}


		let nameSingle = getInfos(data['Single'], 'name');
		var nameAverage = data['Average'] === undefined ? '' : getInfos(data['Average'], 'name');
		var flagSingle = getInfos(data['Single'], 'country');
		var flagAverage = data['Average'] === undefined ?  '' :getInfos(data['Average'], 'country');
		var flag_single = []
		var flag_avg = []
		for (let i=0; i<flagSingle.length; i++){
			if (flagSingle[i] !== "United States" && flagSingle[i] !== "Republic of Korea"){
				flag_single.push(getFlag(flagSingle[i]))
			}
			else if (flagSingle[i] === "United States"){
				flag_single.push(getFlag('USA'))
			}
			else if (flagSingle[i] === 'Republic of Korea'){
				flag_single.push(getFlag("Korea"))
			}
		}
		for (let i=0; i<flagAverage.length; i++){
			if (flagAverage[i] !== "United States" && flagAverage[i] !=="Republic of Korea"){
				flag_avg.push(getFlag(flagAverage[i]))
			}
			else if (flagAverage[i] === "United States"){
				flag_avg.push(getFlag('USA'))
			}
			else if (flagAverage[i] === 'Republic of Korea'){
				flag_avg.push(getFlag("Korea"))
			}
		}
		let timeSingle = getInfos(data['Single'], 'time');
		var timeAverage = data['Average'] === undefined ? 'DNF' : getInfos(data['Average'], 'time');

		var  eventEmbed = event === "22" ? "2x2" : event === "33" ? "3x3" : event === "44" ? "4x4" : event=== "55" ? "5x5" : event === "66" ? "6x6" : event === "77" ? "7x7" : event === 'pyra' ? "pyraminx" : event === "mega" ? "megaminx" : event === "fmc" ? "FMC" : event === 'sq1' ? 'square-one' : event === 'mbld' ? 'multiblind' : event;
		var title = cmd === "cr"? cmd_record[cmd][args[0]] + " " + eventEmbed : cmd==="nr"? isoCountries[args[0]] + ' Record'+ " " + eventEmbed : cmd_record[cmd] +" " + eventEmbed;
		let WRS = '';
		let WRA = '';
   	

    	Embed(timeSingle, timeAverage, nameSingle, nameAverage, flag_single, flag_avg, WRS, WRA, msg, title, cmd, event);


    	
    	
    if (cmd === 'ranking') return;
}

export {requestWCA};
