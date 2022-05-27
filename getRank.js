import cheerio from 'cheerio';
import fetch from 'node-fetch';
import {events} from './param.js';



const getRankId = async (id) =>{
	let url = "https://www.worldcubeassociation.org/persons/"+id;
	let res = await fetch(url);
	let html = await res.text();
	const $ = cheerio.load(html);
	var liste = {};
	$(".personal-records > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr", html).each(function() {
    liste[$(this).find("td.event").data("event")] = {
        'single': $(this).find("td.world-rank").first().text(),
        'average': $(this).find("td.world-rank").last().text()
    }
	});
	return(liste);
}

const getRankRecord = async (page, args) =>{
	
	let event = events[args[0]];

	let request= await fetch(page);
	let html = await request.text();
	const $ = cheerio.load(html);
	var liste = [];
	$("#results-list > div > table > tbody > tr > td.name > a", html).each(function(){
		liste.push($(this).attr("href"));
	});
	var idSingle = liste[0] === undefined ? '' : liste[0].substr(9);
	var idAverage = liste[1] === undefined ? '' : liste[1].substr(9);

	var listeWRS = idSingle === '' ? '' :await getRankId(idSingle);
	var listeWRA =  idAverage === '' ? '' :await getRankId(idAverage);
	var WRS = listeWRS === '' ? '' : listeWRS[event]['single'];
	var WRA = listeWRA === '' ? '' :  listeWRA[event]['average'];
	return([WRS, WRA]);
}

export {getRankId};
export {getRankRecord};