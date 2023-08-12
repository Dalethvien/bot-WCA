const invScramble = (args, msg) => {
	let inv = args.reverse();
	for (var x=0; x < inv.length; x++){
		if (inv[x][1] === undefined){
			console.log(inv[x])
			inv[x] = inv[x][0] + "'";
		}else if (inv[x][1] === "'"){
			inv[x] = inv[x][0];
		}else if (inv[x][1] === "2"){
			inv[x] = inv[x]
		}
	}
	console.log(inv);
	msg.channel.send(inv.join(" ").toUpperCase());
}
export {invScramble};