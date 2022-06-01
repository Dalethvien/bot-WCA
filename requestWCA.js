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
	let infos = [...new Set(liste)].join().replaceAll(',', ', ');
	return(infos);
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


const Embed = (timeSingle, timeAverage, nameSingle, nameAvg, flagSingle, flagAvg, WRS, WRA, msg, title, cmd) =>{
	let singleEmote = "<:Single:369420530098372608>";
	let avgEmote = '<:AVG:369418969351716864>';
	var color = cmd === 'wr' ? '#F44337' : cmd === 'cr' ?'#FFEC3C' : '#01E676';
	//var nameSingle = cmd === "wr" ?`${single} ${nameSingle} ${flagSingle}` :`${single} ${nameSingle} ${flagSingle} ${WRS}`;
	//var nameAvg = cmd === "wr" ?`${avg} ${nameAvg} ${flagAvg}` :`${avg} ${nameAvg} ${flagAvg}  ${WRA}`;
	let nameEmbedSingle =`${singleEmote} ${nameSingle} ${flagSingle}`;
	let nameEmbedAverage = `${avgEmote} ${nameAvg} ${flagAvg}`;
	const exampleEmbed = new MessageEmbed()
	.setColor(color)
	.setTitle(title)
	.addFields(
	{name: nameEmbedSingle, value : timeSingle},

	{name: nameEmbedAverage, value : timeAverage} 
	)

	msg.channel.send({ embeds: [exampleEmbed] });

}

const embedMbld = (timeSingle, nameSingle, flagSingle, WRS, WRA, title, msg, cmd) =>{
	var color = cmd === 'wr' ? '#F44337' : cmd === 'cr' ?'#FFEC3C' : '#01E676';
	let singleEmote = "<:Single:369420530098372608>";
	//var nameSingle = cmd === "wr" ?`${single} ${nameSingle} ${flagSingle}` :`${single} ${nameSingle} ${flagSingle} ${WRS}`;
	let nameEmbedSingle = `${singleEmote} ${nameSingle} ${flagSingle}`;
	let listeSingleSplit = timeSingle.split(" ");
	let time = listeSingleSplit[0] + " en " + listeSingleSplit[1];
	const exampleEmbedMbld = new MessageEmbed()
	 .setColor(color)
	 .setTitle(title)
	 .addFields(
	 	{name:nameEmbedSingle, value:time})
	 msg.channel.send({embeds: [exampleEmbedMbld]});
}


const requestWCAFeet = async (cmd, args, msg, pays, cont=1) => {
	let single = "<:Single:369420530098372608>";
	let avg ='<:AVG:369418969351716864>';

	let pageWcaSingle = 'https://www.worldcubeassociation.org/results/rankings/333ft/single?show=by+region';
	const requestSingle = await fetch(pageWcaSingle);
	const requestSingleF = await requestSingle.text();
	let pageWcaAverage = 'https://www.worldcubeassociation.org/results/rankings/333ft/average?show=by+region';
	const requestAverage = await fetch(pageWcaAverage);
	const requestAverageF = await requestAverage.text();


	const pageWca = "https://www.worldcubeassociation.org/results/records?event_id=";
	var region = cmd === 'wr' ? '&region=world' : cmd === 'cr' ? '&region=_'+ continents[args[1]] : '&region='+ isoCountries[args[1].toUpperCase()];
	let pageWcaFinal = pageWca + events[args[0]] + region;
	let liste = await getRankRecord(pageWcaFinal, args);
	var WRS = liste[0] === '' ? '' :  `(WR ${liste[0]})`;
	var WRA = liste[1] === '' ? '' :  `(WR ${liste[1]})`;

	const timeNameAndFlagFeet =async (page) =>{

		var patternT = cmd === 'wr' ? /World <.+\n.+"> (.+) </gm : cmd === 'cr'? new RegExp(cont +' <.+\n.+"> (.+) <', 'gm') : new RegExp(pays+ ' <.+\n.+"> (.+) <', 'gm');
		var patternN = cmd === 'wr' ? /World <.+\n.+\n.+">(.+)<.a/gm : cmd === 'cr'? new RegExp(cont+' <.+\n.+\n.+">(.+)<.a', 'gm') : new RegExp(pays + ' <.+\n.+\n.+">(.+)<.a', 'gm');
		var patternID = cmd ==='wr' ? new RegExp('World .+\n.+\n.+"(.+)"', 'gm'): cmd === 'cr' ? new RegExp(cont + ' .+\n.+\n.+"(.+)"', 'gm') : new RegExp(pays + ' .+\n.+\n.+"(.+)"','gm');
		
		let time = patternT.exec(page);
		let timeF = time[1];
		let name = patternN.exec(page);
		let nameF = name[1];

		let wcaBase = 'https://www.worldcubeassociation.org';
		let wcaID = patternID.exec(page);
		let wcaIDF = wcaID[1];
		let pageWcaId = wcaBase+wcaIDF;
		let requestFlag = await fetch(pageWcaId);
		let requestFlagF = await requestFlag.text();
		let patternF = /fi fi-(.+)"/gm;
		let flag = patternF.exec(requestFlagF);
		let flagF = `:flag_${flag[1]}:`;


		return([timeF, nameF, flagF]);
	}
	let singleF = await(timeNameAndFlagFeet(requestSingleF));
	let averageF = await(timeNameAndFlagFeet(requestAverageF));

	var title = cmd === "cr"? cmd_record[cmd][args[1]] + " " + args[0] : cmd==="nr"? pays + ' Record'+ " " + args[0] : cmd_record[cmd] +" " + args[0];

	let test = Embed(single, avg, singleF[0], averageF[0], msg, title, singleF[1], averageF[1], singleF[2], averageF[2], WRS, WRA, cmd);
}

const requestWCA = async(cmd, args, msg, avg, pays, cont) => {

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


		const pageWcA = "https://www.worldcubeassociation.org/results/records?event_id=";
		var region = cmd === 'wr' ? '&region=world' : cmd === 'cr' ? '&region=_'+ continents[args[1]] : '&region='+ isoCountries[args[1].toUpperCase()];
		let pageWcaFinaL = pageWcA+ events[args[0]] +region;
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
		let flagSingle = getFlag(getInfos(data['Single'], 'country'));
		var flagAverage = data['Average'] === undefined ? '' : getFlag(getInfos(data['Average'], 'country'));
		let timeSingle = getInfos(data['Single'], 'time');
		var timeAverage = data['Average'] === undefined ? 'DNF' : getInfos(data['Average'], 'time');

		var  eventEmbed = args[0] === "22" ? "2x2" : args[0] === "33" ? "3x3" : args[0] === "44" ? "4x4" : args[0]=== "55" ? "5x5" : args[0] === "66" ? "6x6" : args[1] === "77" ? "7x7" : args[0] === 'pyra' ? "pyraminx" : args[0] === "mega" ? "megaminx" : args[0] === "fmc" ? "FMC" : args[0] === 'sq1' ? 'square-one' : args[0] === 'mbld' ? 'multiblind' : args[0];
				var title = cmd === "cr"? cmd_record[cmd][args[1]] + " " + eventEmbed : cmd==="nr"? pays + ' Record'+ " " + eventEmbed : cmd_record[cmd] +" " + eventEmbed;
		let WRS = '';
		let WRA = '';

    	if (args[0] === 'mbld'){
			let test = embedMbld(timeSingle, nameSingle, flagSingle, WRS, WRA, title, msg, cmd);
			return;

		}    	

    	Embed(timeSingle, timeAverage, nameSingle, nameAverage, flagSingle, flagAverage, WRS, WRA, msg, title, cmd);


    	
    	
    if (cmd === 'ranking') return;
}

export {requestWCA};
export {requestWCAFeet};