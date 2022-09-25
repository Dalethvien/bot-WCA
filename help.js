function help (cmd, msg){
	msg.channel.send("Ce bot vous permez d'obtenir les WR, CR et NR des différents events de la <:WCA:456059019677663233>, respectivement avec les commandes '%wr', '%cr' et '%nr' !\nPour les WR : %wr *event* \nPour les CR : %cr *event* *continent* \nPour les NR : %nr *event* *code_iso2_du_pays* \n\nIl permet également d'obtenir les records d'une personne spécifique, pour ça utilisez la commande '%id' \nPour les records d'une personne : '%id *event* *id_wca*' \n\nEnfin avec la commande *ranking* vous pouvez obtenir le classement dans un event de votre choix\nPour les classements : '%ranking *event* *pays ou contient* *nombre de personnes voulus*, si vous ne préciser pas de pays ou continent vous aurez le top mondial, si vous ne précisez pas de nombre personnes vous aurez le top 100 (maximum)\n\nPour la liste des events : %events \n Pour la liste des continents : %continents \n Pour la liste des pays : %countries");
	
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
