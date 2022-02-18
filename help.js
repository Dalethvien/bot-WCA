function help (cmd, msg){
	msg.channel.send("Ce bot vous permets d'obtenir les wr des events wca avec la commande '%wr'. \n pour la liste des events '%events' ");
	
}


function events (cmd, msg){
	msg.channel.send("Liste des events: '22', '33', '44', '55', '66', '77', 'oh', '3bld', 'fmc', '4bld', '5bld', 'mega', 'pyra', 'feet', 'clock', 'skweb', 'sq1', 'mbld'.")
}
export {events}
export {help};
