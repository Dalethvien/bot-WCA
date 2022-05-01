function help (cmd, msg){
	msg.channel.send("Ce bot vous permets d'obtenir les wr des events wca avec la commande '%wr'. \n pour la liste des events '%events' \n pour la liste des continents disponibles '%continent' ");
	
}


function events (cmd, msg){
	msg.channel.send("Liste des events: '22', '33', '44', '55', '66', '77', 'oh', '3bld', 'fmc', '4bld', '5bld', 'mega', 'pyra', 'feet', 'clock', 'skewb', 'sq1', 'mbld'.")
}
function continent (cmd, msg){
	msg.channel.send("Liste des continents : 'eu'(Europe), 'as'(Asie), 'af'(Afrique), 'oc'(Océanie), 'na'(Amérique du Nord), 'sa'(Amérique du Sud)");
}
export {events};
export {help};
export {continent};
