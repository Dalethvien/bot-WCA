import cheerio from 'cheerio';
import fetch from 'node-fetch';
import {events} from './param.js';



const getRankId = (page) =>{
	const $ = cheerio.load(page);
	var ranks = {};
	$(".personal-records > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr", page).each(function() {
    ranks[$(this).find("td.event").data("event")] = {
        'single':{'WR':$(this).find("td.world-rank").first().text(),
        	'CR':$(this).find(" td:nth-child(3)").text(),
        	'NR':$(this).find(" td:nth-child(2)").first().text()
    	}, 

        'average': {'WR':$(this).find("td.world-rank").last().text(),
        	'CR':$(this).find(" td:nth-child(8)").text(),
        	'NR':$(this).find(" td:nth-child(9)").text()
    	},
    }
	});
	return(ranks);
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