function error(cmd, msg){
	msg.channel.send(`La commande ${cmd} n'est pas reconnue, pour plus d'infos : %help`)
}
export {error};