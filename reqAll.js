import fetch from 'node-fetch';
import cheerio from 'cheerio';
import {MessageEmbed} from 'discord.js';
import {isoCountries} from './param.js'
import {continents} from './param.js';
import {cmd_record} from './param.js'

const getFlag = (data)=>{
	var country = data !== 'United States'? Object.keys(isoCountries).find(key => isoCountries[key] === data).toLowerCase() : Object.keys(isoCountries).find(key => isoCountries[key] === 'USA').toLowerCase() ;
	let flag = `:flag_${country}:`;
	return(flag);
}




const requestWCAAll = async(cmd, args, msg) =>{
	let event = ['33', '22', '44', '55', '66', '77', '3bld', 'fmc', 'oh', 'clock', 'mega', 'pyra', 'skewb', 'sq1', '4bld', '5bld', 'mbld']
	var tableau = [];
	var region = cmd === 'wr' ? '&region=world' : cmd === 'cr' ? '&region=_'+ continents[args[0]] : '&region='+ isoCountries[args[0].toUpperCase()];
	let pageWca =`https://worldcubeassociation.org/results/records?event_id=all+events${region}`
	let request = await fetch(pageWca)
	let page = await request.text();
	const $ = cheerio.load(page)
	var t = 2

	for (let i=0; i<event.length; i++){
			let categorie = event[i];
			(tableau[categorie] = tableau[categorie] || []).push()
			$(`#results-list > div:nth-child(${t}) > table > tbody > tr`, page).each(function(){
    		let type = $(this).find("td.type").text().trim();
    		(tableau[categorie][type] = tableau[categorie][type] || []).push({
        	'name':$(this).find("td.name > a").text().trim(),
        	'time':$(this).find("td.result").text().trim(),
        	'country':$(this).find("td.country").text().trim()
    	})
		})
		var t = t+2

	}

	let embedFields = [];
	var  eventEmbed ={
		"22": "2x2",
		"33": "3x3",
		"44": "4x4",
		"55": "5x5",
		"66": "6x6",
		"77": "7x7",
		"sq1": "square-one",
		"mega": "megaminx", 
		"pyra": "pyraminx",
		"skewb": "skewb",
		"clock": "clock",
		"oh": "one handed",
		"fmc": "fmc",
		"3bld": "3bld",
		"4bld": "4bld",
		"5bld": "5bld",
		"mbl": "multiblind",
		"multibld": "multiblind"
};
	
	for (let i = 0; (i+1)<event.length; i++){
		let single = []
		let average = []
		try{
		for (let j = 0; j < tableau[event[i]]['Single'].length; j++){
			single.push(tableau[event[i]]['Single'][j]['name'] + getFlag(tableau[event[i]]['Single'][j]['country']))
		}
	}catch (err){
		tableau.shift(event[i]['Single'])
	}
	try{
		for (let j = 0; j < tableau[event[i]]['Average'].length; j++){
			average.push(tableau[event[i]]['Average'][j]['name'] + getFlag(tableau[event[i]]['Average'][j]['country']))
		}
	}catch (err){
		tableau.shift(event[i]['Average'])
	}
	try{
		embedFields.push({
			name: eventEmbed[event[i]],
			value:`<:Single:369420530098372608> ${single.join().replaceAll(',', ', ')}: ${tableau[event[i]]['Single'][0]['time']}, \n <:AVG:369418969351716864> ${average.join().replaceAll(',', ', ')}: ${tableau[event[i]]['Average'][0]['time']}`
		})} catch(err) {}
		
}
	var title = cmd === 'wr' ? 'World records of all wca events' : cmd === 'cr' ? cmd_record[cmd][args[0]] +" of all wca events" : 'All wca records of '+ isoCountries[args[0].toUpperCase()];
	var color = cmd === 'wr' ? '#F44337' : cmd === 'cr' ?'#FFEC3C' : '#01E676'; 
	const exampleEmbed = new MessageEmbed()
	.setColor(color)
	.setTitle(title)
	.setURL('')
	.setFields(embedFields)
	msg.channel.send({ embeds: [exampleEmbed] });

	return;

}
export {requestWCAAll}