function error(cmd, msg){
	msg.channel.send(`la commande ${cmd} n'est pas reconnu, pour plus d'infos : %help`)
}
export {error};