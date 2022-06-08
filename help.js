function help (cmd, msg){
	msg.channel.send("Ce bot vous permet d'obtenir les WR, CR et NR des différents events de la <:WCA:456059019677663233>, respectivement avec les commandes '%wr' et '%cr' !\n Pour les WR : %wr *event* \n Pour les CR : %cr *event* *continent* \n Pour les NR : %nr *event* *code_iso2_du_pays* Il permet également d'obtenir les records d'une personne spécifique, pour ça utilisez la commande '%id' \n Pour les records d'une personne : '%id *event* *id_wca*' \n  Pour la liste des events : %events \n Pour la liste des continents : %continents \n Pour la liste des pays : %countries");
	
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
