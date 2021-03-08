const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const bot = new Discord.Client({disableEveryone: true});
const http = require('http');
const fs = require('fs');
const ms = require('ms');
const express = require('express');
const app = express();
const data = require("./datamodules/data.json")
const coin = require("./datamodules/coins.json")
const userstats = require("./datamodules/userstats.json")
const curf = require("./datamodules/curf.json")
const queuedf = require("./datamodules/queuedf.json")
const bans = require("./datamodules/bans.json")
const bids = require("./datamodules/bids.json")
const changelog = require("./datamodules/changelog.json")
const disable = require("./datamodules/disabled.json")
const sstat = require("./datamodules/serverstats.json")
const bstat = require("./datamodules/botstats.json")
let mods = ["265536498529599490", "561272014850097152", "503641535342968832", "147915661442678784", "589505336621269013", "715626758367477811", "418013790593089546", "485573662334779405", "718547413421522967"]

const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

let listeners = []

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

client.on('guildMemberAdd', member => {
    console.log(`Member added: ${member.id}`)
    let tempilist = []
    let listt = []
    let mapi = []
    if(curf["list"].one[1]) mapi.push(curf["list"].one[1])
    if(curf["list"].two[1]) mapi.push(curf["list"].two[1])
    if(curf["list"].three[1]) mapi.push(curf["list"].three[1])
    if(curf["list"].four[1]) mapi.push(curf["list"].four[1])
    if(curf["list"].five[1]) mapi.push(curf["list"].five[1])
    if(mapi.includes(member.id)){
        console.log("Its a bot we need")
        if(client.guilds.cache.get(member.guild.id).members.cache.filter(member => !member.user.bot).size < 5) return console.log("Not enough members") 
        if(member.id == curf["list"].one[1]){
            let curdone = curf["list"].one[3]
            curf["list"].one[3] = curdone + 1
        } else if(member.id == curf["list"].two[1]){
            let curdone = curf["list"].two[3]
            curf["list"].two[3] = curdone + 1
        } else if(member.id == curf["list"].three[1]){
            let curdone = curf["list"].three[3]
            curf["list"].three[3] = curdone + 1
        } else if(member.id == curf["list"].four[1]){
            let curdone = curf["list"].four[3]
            curf["list"].four[3] = curdone + 1
        } else if(member.id == curf["list"].five[1]){
            let curdone = curf["list"].five[3]
            curf["list"].five[3] = curdone + 1
        }
        fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
            if(err) console.log(err)
        });
        member.guild.members.cache.forEach(member => tempilist.push(member.user.id)); 
        var i
        for(i = 0; i < tempilist.length; i++){
            console.log("Checking users")
            let usi = member.guild.members.cache.get(tempilist[i])
            if(usi.hasPermission("ADMINISTRATOR")){
                console.log(`Admin found: ${usi.id}`)
                listt.push(tempilist[i])
            } else if(usi.id == member.guild.owner.id){
                console.log(`Owner found: ${usi.id}`)
                listt.push(tempilist[i])
            } 
        }
        setTimeout(function(){
            var today = new Date();
            const firstDate = new Date(2000, 1, 1);
            const secondDate = new Date(today.getFullYear(), (today.getMonth()+1), today.getDate());

            const diffdays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

            bstat[member.id][member.guild.id] = diffdays + 3
            fs.writeFile("./datamodules/botstats.json", JSON.stringify(bstat), (err) => {
                if(err) console.log(err)
            });
            if(!sstat[member.guild.id]){
                sstat[member.guild.id] = {
                    full: [[member.id, listt]],
                }
                fs.writeFile("./datamodules/serverstats.json", JSON.stringify(sstat), (err) => {
                    if(err) console.log(err)
                });
                sstat[member.guild.id][member.id] = diffdays + 3
                fs.writeFile("./datamodules/serverstats.json", JSON.stringify(sstat), (err) => {
                    if(err) console.log(err)
                });
            } else {
                sstat[member.guild.id].full.push([member.id, listt])
                sstat[member.guild.id][member.id] = diffdays + 3
                fs.writeFile("./datamodules/serverstats.json", JSON.stringify(sstat), (err) => {
                    if(err) console.log(err)
                });
            }

            var i
            for(i = 0; i < listt.length; i++){
                console.log("Checking Listt")
                if(listeners.includes(listt[i])){

                    if(member.id == curf["list"].one[1]){
                        if(curf["list"].one[4].includes(listt[i])) return console.log("Already done")
                    }
                    if(member.id == curf["list"].two[1]){
                        if(curf["list"].two[4].includes(listt[i])) return console.log("Already done")
                    }
                    if(member.id == curf["list"].three[1]){
                        if(curf["list"].three[4].includes(listt[i])) return console.log("Already done")
                    }
                    if(member.id == curf["list"].four[1]){
                        if(curf["list"].four[4].includes(listt[i])) return console.log("Already done")
                    }
                    if(member.id == curf["list"].five[1]){
                        if(curf["list"].five[4].includes(listt[i])) return console.log("Already done")
                    }

                    console.log("listeners includes users")
                    let curcoins = coin[listt[i]].coins
                    coin[listt[i]].coins = curcoins + 0.75
                    let curhist = coin[listt[i]].history
                    curhist.push("[+0.75] Adding Bot To Your Server")
                    console.log("Added to bal")
                    fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
                        if(err) console.log(err)
                    });

    

                    if(userstats[listt[i]].added == false){
                        userstats[listt[i]].added = true
                        fs.writeFile("./datamodules/userstats.json", JSON.stringify(userstats), (err) => {
                            if(err) console.log(err)
                        });
                    }

                    // sorting find lists
                    if(member.id == curf["list"].one[1]){
                        curf["list"].one[4].push(listt[i])
                        fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
                            if(err) console.log(err)
                        });
                        if(curf["list"].one[3] == curf["list"].one[2]){
                            curf["list"].one = []
                            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
                                if(err) console.log(err)
                            });
                        }
                    } else if(member.id == curf["list"].two[1]){
                        curf["list"].two[4].push(listt[i])
                        fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
                            if(err) console.log(err)
                        });
                        if(curf["list"].two[3] == curf["list"].two[2]){
                            curf["list"].two = []
                            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
                                if(err) console.log(err)
                            });
                        }
                    } else if(member.id == curf["list"].three[1]){
                        curf["list"].three[4].push(listt[i])
                        fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
                            if(err) console.log(err)
                        });
                        if(curf["list"].three[3] == curf["list"].three[2]){
                            curf["list"].three = []
                            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
                                if(err) console.log(err)
                            });
                        }
                    } else if(member.id == curf["list"].four[1]){
                        curf["list"].four[4].push(listt[i])
                        fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
                            if(err) console.log(err)
                        });
                        if(curf["list"].four[3] == curf["list"].four[2]){
                            curf["list"].four = []
                            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
                                if(err) console.log(err)
                            });
                        }
                    } else if(member.id == curf["list"].five[1]){
                        curf["list"].five[4].push(listt[i])
                        fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
                            if(err) console.log(err)
                        });
                        if(curf["list"].five[3] == curf["list"].five[2]){
                            curf["list"].five = []
                            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
                                if(err) console.log(err)
                            });
                        }
                    }
                }
            }
        }, ms("0.5s"))
    }
});


client.on("guildDelete", guild => {
    var today = new Date();
    const firstDate = new Date(2000, 1, 1);
    const secondDate = new Date(today.getFullYear(), (today.getMonth()+1), today.getDate());

    const diffdays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    if(sstat[guild.id]){
    let lent = sstat[guild.id].full
    var i
    for(i = 0; i < lent.length; i++){
        let iddd = sstat[guild.id]["full"][i][0]
        if(sstat[guild.id][iddd] > diffdays){
            let lenb = sstat[guild.id]["full"][i][1]
            var e
            for(e = 0; e < lenb.length; e++){
                let user = sstat[guild.id]["full"][i][1][e]
                if(coin[user]){
                let curbal = coin[user].coins
                let curhist = coin[user].history
                coin[user].coins = curbal - 2
                curhist.push("[-2] Removing Bot4Bot from a guild with a pending bot")
                fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
                    if(err) console.log(err)
                });
                }

                /*
                let returnbal = coin[sstat[bstat[guild.id]["full"][i][0]].return].coins
                let returnhist = coin[sstat[bstat[guild.id]["full"][i][0]].return].history

                coin[sstat[bstat[guild.id]["full"][i][0]].return].coins = returnbal + 1
                returnhist.push("[+1] Return from someone removing your bot before 3 days passed")

                fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
                    if(err) console.log(err)
                });
                */// wait till intro
            }
        }
    }
    }
})

client.on("guildMemberRemove", function(member){
    let done = []
    if(sstat[member.guild.id]){
        let lent = sstat[member.guild.id].full
        var i
        for(i = 0; i < lent.length; i++){
            let ed = sstat[member.guild.id]["full"][i][0]
            if(ed = member.id){
                var today = new Date();
                const firstDate = new Date(2000, 1, 1);
                const secondDate = new Date(today.getFullYear(), (today.getMonth()+1), today.getDate());
                const diffdays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

                if(sstat[member.guild.id][ed] > diffdays){
                    let lenb = sstat[member.guild.id].full[i][1]
                    var e
                    for(e = 0; e < lenb.length; e++){
                        let usii = sstat[member.guild.id].full[i][1][e]
                        if(!done.includes(usii)){
                        if(coin[usii]){
                            let curcoin = coin[usii].coins
                            let curhist = coin[usii].history
                            coin[usii].coins = curcoin - 2
                            curhist.push("[-2] Removing a bot before 3 days had passed")
                            sstat[member.guild.id]["full"][i][1].remove(usii)

                            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
                                if(err) console.log(err)
                            });
                            
                            done.push(usii)

                            if(bstat[member.id].return){
                                let retcoin = coin[bstat[member.id].return].coins
                                let rethist = coin[bstat[member.id].return].history
                                coin[bstat[member.id].return].coins = retcoin + 1
                                curhist.push("[+1] Someone removed your bot from their server before 3 days passed")
                                fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
                                    if(err) console.log(err)
                                });
                            }
                        }
                      }
                    }
                }
            }
        }
    }
});


//auto nitro booster rewards

var today = new Date();
var time = today.getHours() + ":" + today.getMinutes()
console.log(time)
let donetoday = false

setInterval(dailybooster, 15000);

function dailybooster( )
{
if(donetoday == false){
    if(time == "14:1"){
        let usi = client.guilds.cache.get('735674915729965056').roles.get('735834078170841104').members.map(m=>m.user.id);
        var i
        for(i = 0; i < usi.length; i++){
            let curcoin = coin[usi[i]].coins
            let curhist = coin[usi[i]].history
            coin[usi[i]].coins = curcoin + 2
            curhist.push("[+2] Server Boosting Bot4Bot official support server")
            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
                if(err) console.log(err)
            });
        }
        setTimeout(function(){
            donetoday = true
            setTimeout(function(){
                donetoday = false
            }, ms("2m"))
        }, ms("2.5s"))
    }
}
}

//
setInterval(fcheck, 15000);

function fcheck( )
{
if(curf["list"].one[1]){
    if(curf["list"].one[3] == curf["list"].one[2]){
        curf["list"].one = []
        fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
            if(err) console.log(err)
        });
    } 
} else if(curf["list"].two[1]){
    if(curf["list"].two[3] == curf["list"].two[2]){
        curf["list"].two = []
        fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
            if(err) console.log(err)
        });
    } 
} else if(curf["list"].three[1]){
    if(curf["list"].three[3] == curf["list"].three[2]){
        curf["list"].three = []
        fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
            if(err) console.log(err)
        });
    } 
} else if(curf["list"].four[1]){
    if(curf["list"].four[3] == curf["list"].four[2]){
        curf["list"].four = []
        fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
            if(err) console.log(err)
        });
    } 
} else if(curf["list"].five[1]){
    if(curf["list"].five[3] == curf["list"].five[2]){
        curf["list"].five = []
        fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
            if(err) console.log(err)
        });
    } 
} 
}

client.on("ready", async () => {

})

client.on("message", async message => {

    if(message.channel.id == "735913147180777494"){
        if(message.author.id == "695664615534755850"){
            let argi = message.content.split("|")
            let userid = argi[0]
            if(argi[1] == "chargeback"){
                message.channel.send("__Initiating automated ban and bal clearence__")
                const bans = require("./datamodules/bans.json")
                bans.bans.push(userid)
                coin[userid].coins = -1000000
                coin[userid].history.push("[-1000000] Automated bot ban and balance ruin for chargeback")
                fs.writeFile("./datamodules/bans.json", JSON.stringify(bans), (err) => {
                    if(err) console.log(err)
                });
                fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
                    if(err) console.log(err)
                });
                message.channel.send("**User has been banned!**")
                return
            }
            let status = "SUCCESSFUL"
            let amount = parseInt(argi[1])
            let curcoin = coin[userid].coins
            coin[userid].coins = curcoin + amount
            let curhist = coin[userid].history
            curhist.push(`[+${amount.toLocaleString()}] Web store purchase`) 
            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
                if(err){
                    console.log(err)
                    status = `<@265536498529599490> ***Error!***\n\`${err}\``
                }
            });
            message.channel.send(`Coins added to user balance, Status: ${status}`)
        }
    }


let prefix = "."
  const users = client.users.size
  const servers = client.guilds.size
  if(message.author.bot) return;
 if(message.content.indexOf(".") !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(disable.list.includes(message.channel.id)){
      if(!message.content.includes(".enable")) return
  }

  if(bans.bans.includes(message.author.id)) return

if(!data[message.author.id]){
   data[message.author.id] = {
    bots: []
  };
}
  fs.writeFile("./datamodules/data.json", JSON.stringify(data), (err) => {
  if(err) console.log(err)
});

if(!coin[message.author.id]){
   coin[message.author.id] = {
    coins: 2,
    history: [],
    username: message.author.username
  };
}
  fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});

if(!userstats[message.author.id]){
   userstats[message.author.id] = {
    added: false,
    purchased: false,
    amountpurchased: 0,
    amountadded: 0,
    curlink: ""
  };
}
  fs.writeFile("./datamodules/userstats.json", JSON.stringify(userstats), (err) => {
  if(err) console.log(err)
});


if(coin[message.author.id].username != message.author.username){
    coin[message.author.id].username = message.author.username
    fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
}





if(command == "bal" || command == "balance"){
    let curcoin = coin[message.author.id].coins
    let hist = coin[message.author.id].history
    let stringie = ""
    if(hist.length > 10){
    var i
    for (i = hist.length - 10; i < hist.length; i++) {
        stringie = `${hist[i]}\n${stringie}`
    }
    } else {
    var i
    for (i = 0; i < hist.length; i++) {
        stringie = `${hist[i]}\n${stringie}`
    } 
    }
    setTimeout(function(){
    if(stringie == ""){
        stringie = "This user does not have any previous transactions"
    }
    let emb = new Discord.MessageEmbed()
        .setTitle(`${message.author.username}'s Balance`)
        .setColor("#483eb5")
        .setDescription(`**${curcoin}** Coins`)
        .addField("Transaction History", stringie)
        .setFooter("Bot4Bot")
    message.channel.send(emb)
    }, ms("0.25s"))
}

if(command == "pay" || command == "give"){
    let member = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
    if(member.id == message.author.id) return message.channel.send("You cant pay yourself!")
    if(!args[1]) return message.reply("Please specify an amount you wish to pay!")
    let yourbal = coin[message.author.id].coins
    let yourhist = coin[message.author.id].history
    let theirbal = coin[member.id].coins
    let theirhist = coin[member.id].history
    if(args[2]){
    let reason = args.slice(2).join(" ");
    if(reason.length > 40) return message.channel.send("Payment reasons can't be greater than 40 charachters")
    let amt = parseInt(args[1])
    console.log(Number.isNaN(amt))
    if(Number.isNaN(amt) == true) {
        message.channel.send("Please specify a valid number")
    } else {
    if(yourbal < amt) return message.channel.send("You do not have enough coins to do that")
    if(amt < 5) return message.channel.send("You must pay more than 5 coins")

    coin[message.author.id].coins = yourbal - amt
    coin[member.id].coins = theirbal + amt
    yourhist.push(`[-${amt.toLocaleString()}] Paid ${amt.toLocaleString()} coins to <@${member.id}> for ${reason}`)
    theirhist.push(`[+${amt.toLocaleString()}] Received ${amt.toLocaleString()} coins from <@${message.author.id}> for ${reason}`)
    fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});

    message.channel.send(`Paid ${amt} Coins to <@${member.id}> for ${reason}`)

    }
    } else {
    let amt = parseInt(args[1])
    if(Number.isNaN(amt) == true) {
        message.channel.send("Please specify a valid number")
    } else {
    if(yourbal < amt) return message.channel.send("You do not have enough coins to do that")
    if(amt < 5) return message.channel.send("You must pay more than 5 coins")

    coin[message.author.id].coins = yourbal - amt
    coin[member.id].coins = theirbal + amt
    yourhist.push(`[-${amt.toLocaleString()}] Paid ${amt.toLocaleString()} coins to <@${member.id}>`)
    theirhist.push(`[+${amt.toLocaleString()}] Received ${amt.toLocaleString()} coins from <@${message.author.id}>`)
    fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});

    message.channel.send(`Paid ${amt} Coins to <@${member.id}>`)
    }
    }
}

if(command == "f" || command == "find" || command == "discover"){
    if(Date.now() - message.author.createdAt < 1000*60*60*24*7) return message.channel.send("Your account must be older than 7 days to use this feature, this is to prevent bots")

    let f = require("./datamodules/curf.json")
    let itinery1 = []
    let itinery2 = []
    let link1 = ""
    let link2 = ""
    /*
    if(!f["list"].one[1] && !f["list"].two[1]){
        itinery1 = ["No Developers Currently Buying Bots", "N/A"]
        itinery2 = ["No Developers Currently Buying Bots", "N/A"]
        link1 = "N/A"
        link2 = "N/A"
    } else if(!f["list"].one[1] && f["list"].two[1]){
        itinery1 = ["No Developers Currently Buying Bots", "N/A"]
        itinery2 = f["list"].two
        link1 = "N/A"
        link2 = `https://discord.com/oauth2/authorize?client_id=${itinery2[1]}&scope=bot&permissions=0`
    } else if(f["list"].one[1] && !f["list"].two[1]){
        itinery1 = f["list"].one
        itinery2 = ["No Developers Currently Buying Bots", "N/A"]
        link1 = `https://discord.com/oauth2/authorize?client_id=${itinery1[1]}&scope=bot&permissions=0`
        link2 = "N/A"
    } else if(f["list"].one[1] && f["list"].two[1]){
        itinery1 = f["list"].one
        itinery2 = f["list"].two
        link1 = `https://discord.com/oauth2/authorize?client_id=${itinery1[1]}&scope=bot&permissions=0`
        link2 = `https://discord.com/oauth2/authorize?client_id=${itinery2[1]}&scope=bot&permissions=0`
    }
    */
    let lot = []

    if(f["list"].one[4]){
    if(!f["list"].one[4].includes(message.author.id)){
        lot.push(f["list"].one)
    }
}
    if(f["list"].two[4]){
    if(!f["list"].two[4].includes(message.author.id)){
        lot.push(f["list"].two)
    }
} 
    if(f["list"].three[4]){
    if(!f["list"].three[4].includes(message.author.id)){
        lot.push(f["list"].three)
    }
}
    if(f["list"].four[4]){
    if(!f["list"].four[4].includes(message.author.id)){
        lot.push(f["list"].four)
    }
}
    if(f["list"].five[4]){
    if(!f["list"].five[4].includes(message.author.id)){
        lot.push(f["list"].five)
    }
}

if(lot.length == 0){
    itinery1 = ["No Developers Currently Buying Bots", "N/A"]
    itinery2 = ["No Developers Currently Buying Bots", "N/A"]
    link1 = "N/A"
    link2 = "N/A"
} else if(lot.length == 1){
    itinery1 = lot[0]
    itinery2 = ["No Developers Currently Buying Bots", "N/A"]
    link1 = `https://discord.com/oauth2/authorize?client_id=${itinery1[1]}&scope=bot&permissions=0`
    link2 = "N/A"
} else {
    itinery1 = lot[0]
    itinery2 = lot[1]
    link1 = `https://discord.com/oauth2/authorize?client_id=${itinery1[1]}&scope=bot&permissions=0`
    link2 = `https://discord.com/oauth2/authorize?client_id=${itinery2[1]}&scope=bot&permissions=0`
}


    let emb = new Discord.MessageEmbed()
        .setTitle("Find developers buying bot add's")
        .setDescription(`${message.author}, The below bots will give you 0.75 coins each for adding them to your server!\n**Remember:** Bot4Bot must be in the server you add the discord bot to and the server __must__ have more than 5 real members\nAny questions? Join our official support server: **https://discord.gg/BgkmNd4**`) 
        .setColor("#1c6ced")
        .addField("**Get coins without adding bots!**", "Visit https://bit.ly/bot4bot to purchase coins!")
        .addField(`**${itinery1[0]}**`, `Invite:\n${link1}`)
        .addField(`**${itinery2[0]}**`, `Invite:\n${link2}`)
        .addField("**Bid Perm Winner For Today**", "[COMING SOON]")
        .addField("**Add this bot**", "https://bit.ly/inviteB4B")
        .setFooter("Bot4Bot 2020© • Find Command")


        message.channel.send(emb)
        
        if(!listeners.includes(message.author.id)){
            listeners.push(message.author.id)
            setTimeout(function(){
                listeners.remove(message.author.id)
            }, ms("5m"))
        }


}

if(command == "buy" || command == "purchase"){
    let yourbal = coin[message.author.id].coins
    if(!args[0]) return message.channel.send("Please tag or give the id for the bot you wish to purchase adds for")
    if(!args[1]) return message.channel.send("Please specify how many bot add's you wish to purchase")
    let amt = parseInt(args[1])
    if(Number.isNaN(amt) == true) return message.channel.send("Please specify a valid number")
    let id = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
    if(id.id == "735676509838245920") return message.channel.send("You cant pay people to add me, it would be cool but sadly discord doesnt work like that")
    let reason = ""
    if(args[2]){
        reason = args.slice(2).join(" ");
    } else {
        reason = "Add this bot for 0.75 coins"
    }
    if(amt > yourbal) return message.channel.send("***Uh Oh...***\nIt seems you dont have enough coins to do that, *sorry!*")
    if(amt < 4) return message.channel.send("***Oops...***\nPurchase orders must be greater than 4 coins, *sorry!*")
    //if(userstats[message.author.id].added == false) return message.channel.send("***Hmm...***\nTo unlock this feature you need to add atleast 1 bot to any server you own using .find")
        console.log("Passed through gate 1")

        let mapi = []
        if(curf["list"].one[1]) mapi.push(curf["list"].one[1])
        if(curf["list"].two[1]) mapi.push(curf["list"].two[1])
        if(curf["list"].three[1]) mapi.push(curf["list"].three[1])
        if(curf["list"].four[1]) mapi.push(curf["list"].four[1])
        if(curf["list"].five[1]) mapi.push(curf["list"].five[1])
        if(mapi.length == 5 && !mapi.includes(id.id)) return message.channel.send("**Oops!**\nAll advertising slots are currently booked, try again in a few minutes!")


        if(!bstat[id.id]){
            bstat[id.id] = {
                return: message.author.id
            };
        }
        fs.writeFile("./datamodules/botstats.json", JSON.stringify(bstat), (err) => {
            if(err) console.log(err)
        });



        if(curf["list"].one.includes(id.id)){
            coin[message.author.id].coins = yourbal - amt
            coin[message.author.id].history.push(`[-${amt.toLocaleString()}] You bought an ad for ${amt.toLocaleString()} coins`)
            let curamt = curf["list"].one[2]
            curf["list"].one[2] = curamt + amt
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
            let thumbnaill = client.users.fetch(id.id)
            let emb = new Discord.MessageEmbed()
                .setTitle("Order Placed!")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                .setDescription(`Your ${amt} bot order has been placed\nType .info to check its status`)
                .setFooter("Bot4Bot 2020© • Order System")
            message.channel.send(emb)
            return
        } else if(curf["list"].two.includes(id.id)){
            coin[message.author.id].coins = yourbal - amt
            coin[message.author.id].history.push(`[-${amt.toLocaleString()}] You bought an ad for ${amt.toLocaleString()} coins`)
            let curamt = curf["list"].two[2]
            curf["list"].two[2] = curamt + amt
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
            let thumbnaill = client.users.fetch(id.id)
            let emb = new Discord.MessageEmbed()
                .setTitle("Order Placed!")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                .setDescription(`Your ${amt} bot order has been placed\nType .info to check its status`)
                .setFooter("Bot4Bot 2020© • Order System")
            message.channel.send(emb)
            return
        } else if(curf["list"].three.includes(id.id)){
            coin[message.author.id].coins = yourbal - amt
            coin[message.author.id].history.push(`[-${amt.toLocaleString()}] You bought an ad for ${amt.toLocaleString()} coins`)
            let curamt = curf["list"].three[2]
            curf["list"].three[2] = curamt + amt
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
            let thumbnaill = client.users.fetch(id.id)
            let emb = new Discord.MessageEmbed()
                .setTitle("Order Placed!")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                .setDescription(`Your ${amt} bot order has been placed\nType .info to check its status`)
                .setFooter("Bot4Bot 2020© • Order System")
            message.channel.send(emb)
            return
        } else if(curf["list"].four.includes(id.id)){
            coin[message.author.id].coins = yourbal - amt
            coin[message.author.id].history.push(`[-${amt.toLocaleString()}] You bought an ad for ${amt.toLocaleString()} coins`)
            let curamt = curf["list"].four[2]
            curf["list"].four[2] = curamt + amt
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
            let thumbnaill = client.users.fetch(id.id)
            let emb = new Discord.MessageEmbed()
                .setTitle("Order Placed!")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                .setDescription(`Your ${amt} bot order has been placed\nType .info to check its status`)
                .setFooter("Bot4Bot 2020© • Order System")
            message.channel.send(emb)
            return
        } else if(curf["list"].five.includes(id.id)){
            coin[message.author.id].coins = yourbal - amt
            coin[message.author.id].history.push(`[-${amt.toLocaleString()}] You bought an ad for ${amt.toLocaleString()} coins`)
            let curamt = curf["list"].five[2]
            curf["list"].five[2] = curamt + amt
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
            let thumbnaill = client.users.fetch(id.id)
            let emb = new Discord.MessageEmbed()
                .setTitle("Order Placed!")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                .setDescription(`Your ${amt} bot order has been placed\nType .info to check its status`)
                .setFooter("Bot4Bot 2020© • Order System")
            message.channel.send(emb)
            return
        }



        if(!curf["list"].one[1]){
            console.log("curf1 is free")
            coin[message.author.id].coins = yourbal - amt
            coin[message.author.id].history.push(`[-${amt.toLocaleString()}] You bought an ad for ${amt.toLocaleString()} coins`)
            console.log("Sorted bal stuff")
            curf["list"].one = [reason, id.id, amt, 0, [], message.author.id]
            console.log("Sorted curf stuff")
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
            console.log("Written")
            let thumbnaill = client.users.fetch(id.id)
            let emb = new Discord.MessageEmbed()
                .setTitle("Order Placed!")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                .setDescription(`Your ${amt} bot order has been placed\nType .info to check its status`)
                .setFooter("Bot4Bot 2020© • Order System")
            message.channel.send(emb)
            console.log("sent")


///////////////////gap
        
    } else if(!curf["list"].two[1]){
            console.log("curf1 is free")
            coin[message.author.id].coins = yourbal - amt
            coin[message.author.id].history.push(`[-${amt.toLocaleString()}] You bought an ad for ${amt.toLocaleString()} coins`)
            console.log("Sorted bal stuff")
            curf["list"].two = [reason, id.id, amt, 0, [], message.author.id]
            console.log("Sorted curf stuff")
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
            console.log("Written")
            let thumbnaill = client.users.fetch(id.id)
            let emb = new Discord.MessageEmbed()
                .setTitle("Order Placed!")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                .setDescription(`Your ${amt} bot order has been placed\nType .info to check its status`)
                .setFooter("Bot4Bot 2020© • Order System")
            message.channel.send(emb)
            console.log("sent")
        
////////////////////////////gap


    } else if(!curf["list"].three[1]){
            console.log("curf1 is free")
            coin[message.author.id].coins = yourbal - amt
            coin[message.author.id].history.push(`[-${amt.toLocaleString()}] You bought an ad for ${amt.toLocaleString()} coins`)
            console.log("Sorted bal stuff")
            curf["list"].three = [reason, id.id, amt, 0, [], message.author.id]
            console.log("Sorted curf stuff")
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
            console.log("Written")
            let thumbnaill = client.users.fetch(id.id)
            let emb = new Discord.MessageEmbed()
                .setTitle("Order Placed!")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                .setDescription(`Your ${amt} bot order has been placed\nType .info to check its status`)
                .setFooter("Bot4Bot 2020© • Order System")
            message.channel.send(emb)
            console.log("sent")
        
    } else if(!curf["list"].four[1]){
            console.log("curf1 is free")
            coin[message.author.id].coins = yourbal - amt
            coin[message.author.id].history.push(`[-${amt.toLocaleString()}] You bought an ad for ${amt.toLocaleString()} coins`)
            console.log("Sorted bal stuff")
            curf["list"].four = [reason, id.id, amt, 0, [], message.author.id]
            console.log("Sorted curf stuff")
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
            console.log("Written")
            let thumbnaill = client.users.fetch(id.id)
            let emb = new Discord.MessageEmbed()
                .setTitle("Order Placed!")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                .setDescription(`Your ${amt} bot order has been placed\nType .info to check its status`)
                .setFooter("Bot4Bot 2020© • Order System")
            message.channel.send(emb)
            console.log("sent")
        
    } else if(!curf["list"].five[1]){
            console.log("curf1 is free")
            coin[message.author.id].coins = yourbal - amt
            coin[message.author.id].history.push(`[-${amt.toLocaleString()}] You bought an ad for ${amt.toLocaleString()} coins`)
            console.log("Sorted bal stuff")
            curf["list"].five = [reason, id.id, amt, 0, [], message.author.id]
            console.log("Sorted curf stuff")
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
            fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
            console.log("Written")
            let thumbnaill = client.users.fetch(id.id)
            let emb = new Discord.MessageEmbed()
                .setTitle("Order Placed!")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                .setDescription(`Your ${amt} bot order has been placed\nType .info to check its status`)
                .setFooter("Bot4Bot 2020© • Order System")

            message.channel.send(emb)
            console.log("sent")
        
    } else {
        return message.channel.send("**Oops!***\nAll advertising slots are currently booked, try again in 2 minutes!")
    }
    
}

if(command == "econ"){
    if(message.author.id != "265536498529599490" && message.author.id != "503641535342968832") return

    if(!args[0]) return
    if(!args[1]) return
    if(!args[2]) return

    let type = args[0].toLowerCase()
    let member = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[1])
    let amount = parseInt(args[2])

    if(type != "add" && type != "delete" && type != "set") return message.channel.send("Invalid arguments")

    let theirbal = coin[member.id].coins
    let theirhist = coin[member.id].history

    if(type == "add"){
        coin[member.id].coins = theirbal + amount
        theirhist.push(`[+${amount.toLocaleString()}] Econ Add | From <@${message.author.id}>`)
        fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
    message.channel.send(`Added ${amount.toLocaleString()} Coins to ${member.id}\nUpdated Bal: ${coin[member.id].coins.toLocaleString()}`)
    }
    if(type == "delete"){
        coin[member.id].coins = theirbal - amount
        theirhist.push(`[-${amount.toLocaleString()}] Econ Delete | From <@${message.author.id}>`)
        fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
    message.channel.send(`Removed ${amount.toLocaleString()} Coins from ${member.id}\nUpdated Bal: ${coin[member.id].coins.toLocaleString()}`)
    }
    if(type == "set"){
        coin[member.id].coins = amount
        theirhist.push(`[${amount.toLocaleString()}] Econ Set | From <@${message.author.id}>`)
        fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
    message.channel.send(`Set ${member.id}'s Balance to ${amount.toLocaleString()}\nUpdated Bal: ${coin[member.id].coins.toLocaleString()}`)
    }
}

if(command == "mod"){
    if(!mods.includes(message.author.id)) return
    let type = args[0].toLowerCase()
    if(type != "bal" && type != "ruin" && type != "ban" && type != "unban" && type != "remove" && type != "clearhistory") return message.channel.send("Invalid arguments")

    if(type == "bal"){
        let member = args[1]
        if(!member) return message.channel.send("Please provide a valid user ID")
        let curcoin = coin[member].coins
        let hist = coin[member].history
        let stringie = ""
        if(hist.length > 10){
        var i
        for (i = hist.length - 10; i < hist.length; i++) {
            stringie = `${stringie}${hist[i]}\n`
        }
        } else {
        var i
        for (i = 0; i < hist.length; i++) {
            stringie = `${stringie}${hist[i]}\n`
        } 
        }
        setTimeout(function(){
        if(stringie == ""){
            stringie = "This user does not have any previous transactions"
        }
        let emb = new Discord.MessageEmbed()
            .setTitle(`${coin[member].username}'s Balance`)
            .setColor("#483eb5")
            .setDescription(`**${curcoin.toLocaleString()}** Coins`)
            .addField("Transaction History", stringie)
            .setFooter("Bot4Bot")
        message.channel.send(emb)
        }, ms("0.25s"))

    } else if(type == "ban"){
        let member = args[1]
        let bani = bans.bans
        bani.push(member)
        fs.writeFile("./datamodules/bans.json", JSON.stringify(bans), (err) => {
  if(err) console.log(err)
});
        message.channel.send(`${member} Has Been Banned`)
    } else if(type == "unban"){
        let member = args[1]
        let bani = bans.bans
        bani.remove(member)
        fs.writeFile("./datamodules/bans.json", JSON.stringify(bans), (err) => {
  if(err) console.log(err)
});
        message.channel.send(`${member} Has Been Unbanned`)
    } else if(type == "ruin"){
        let member = args[1]
        coin[member].coins = coin[member].coins - 10000000
        coin[member].history.push("[-10,000,000] Ruined Balance For Breaking ToS")
        fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
        message.channel.send(`Ruined **${member}**'s Balance`)
    } else if(type == "remove"){
        let cli = args[1]
        if(curf["list"].one[1] == cli){
            curf["list"].one = []
            message.channel.send("Client has been removed")
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
        } else if(curf["list"].two[1] == cli){
            curf["list"].two = []
            message.channel.send("Client has been removed")
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
        } else if(curf["list"].three[1] == cli){
            curf["list"].three = []
            message.channel.send("Client has been removed")
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
        } else if(curf["list"].four[1] == cli){
            curf["list"].four = []
            message.channel.send("Client has been removed")
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
        } else if(curf["list"].five[1] == cli){
            curf["list"].five = []
            message.channel.send("Client has been removed")
            fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
        } else {
            message.channel.send("Invalid client")
        }
    } else if(type == "clearhistory"){
        let user = args[1]
        coin[user].history = []
        message.channel.send("Cleared History")
        fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
    }
}

if(command == "info"){
    if(curf["list"].one[5] == message.author.id){
        let ordered = curf["list"].one[2]
        let gotten = curf["list"].one[3]
        let ghajh = 100 / ordered
        let doneper = Math.round(ghajh * gotten)
        let sdgh = Math.round(doneper / 10)
        let out = sdgh
        let remain = 10 - out
        let stringie = ""
        if(out > 0){
            stringie = "**"
        } else {
            stringie = ""
        }


        var i
        for(i = 0; i < out; i++){
            stringie = `${stringie}=`
            if(i == out - 1){
                stringie = `${stringie}**`
                console.log("done")
            }
        }
        setTimeout(function(){
            var b
            for(b = 0; b < remain; b++){
                stringie = `${stringie}–`
            }
            setTimeout(function(){
                let emb = new Discord.MessageEmbed()
                    .setTitle("Your Order Status")
                    .setColor("RANDOM")
                    .setDescription("Below is the status for your order")
                    .addField("**Current Order**", `${stringie} [${curf["list"].one[3]}/${curf["list"].one[2]}]`)

                message.channel.send(emb)
            }, ms("0.15s"))
        }, ms("0.15s"))
    } else if(curf["list"].two[5] == message.author.id){
        let ordered = curf["list"].two[2]
        let gotten = curf["list"].two[3]
        let ghajh = 100 / ordered
        let doneper = Math.round(ghajh * gotten)
        let sdgh = Math.round(doneper / 10)
        let out = sdgh
        let remain = 10 - out
        let stringie = ""
        if(out > 0){
            stringie = "**"
        } else {
            stringie = ""
        }

        var i
        for(i = 0; i < out; i++){
            stringie = `${stringie}=`
            if(i == out - 1){
                stringie = `${stringie}**`
                console.log("done")
            }
        }
        setTimeout(function(){
            var b
            for(b = 0; b < remain; b++){
                stringie = `${stringie}–`
            }
            setTimeout(function(){
                let emb = new Discord.MessageEmbed()
                    .setTitle("Your Order Status")
                    .setColor("RANDOM")
                    .setDescription("Below is the status for your order")
                    .addField("**Current Order**", `${stringie} [${curf["list"].two[3]}/${curf["list"].two[2]}]`)

                message.channel.send(emb)
            }, ms("0.15s"))
        }, ms("0.15s"))
    } else if(curf["list"].three[5] == message.author.id){
        let ordered = curf["list"].three[2]
        let gotten = curf["list"].three[3]
        let ghajh = 100 / ordered
        let doneper = Math.round(ghajh * gotten)
        let sdgh = Math.round(doneper / 10)
        let out = sdgh
        let remain = 10 - out
        let stringie = ""
        if(out > 0){
            stringie = "**"
        } else {
            stringie = ""
        }

        var i
        for(i = 0; i < out; i++){
            stringie = `${stringie}=`
            if(i == out - 1){
                stringie = `${stringie}**`
                console.log("done")
            }
        }
        setTimeout(function(){
            var b
            for(b = 0; b < remain; b++){
                stringie = `${stringie}–`
            }
            setTimeout(function(){
                let emb = new Discord.MessageEmbed()
                    .setTitle("Your Order Status")
                    .setColor("RANDOM")
                    .setDescription("Below is the status for your order")
                    .addField("**Current Order**", `${stringie} [${curf["list"].three[3]}/${curf["list"].three[2]}]`)

                message.channel.send(emb)
            }, ms("0.15s"))
        }, ms("0.15s"))
    } else if(curf["list"].four[5] == message.author.id){
        let ordered = curf["list"].four[2]
        let gotten = curf["list"].four[3]
        let ghajh = 100 / ordered
        let doneper = Math.round(ghajh * gotten)
        let sdgh = Math.round(doneper / 10)
        let out = sdgh
        let remain = 10 - out
        let stringie = ""
        if(out > 0){
            stringie = "**"
        } else {
            stringie = ""
        }

        var i
        for(i = 0; i < out; i++){
            stringie = `${stringie}=`
            if(i == out - 1){
                stringie = `${stringie}**`
                console.log("done")
            }
        }
        setTimeout(function(){
            var b
            for(b = 0; b < remain; b++){
                stringie = `${stringie}–`
            }
            setTimeout(function(){
                let emb = new Discord.MessageEmbed()
                    .setTitle("Your Order Status")
                    .setColor("RANDOM")
                    .setDescription("Below is the status for your order")
                    .addField("**Current Order**", `${stringie} [${curf["list"].four[3]}/${curf["list"].four[2]}]`)

                message.channel.send(emb)
            }, ms("0.15s"))
        }, ms("0.15s"))
    } else if(curf["list"].five[5] == message.author.id){
        let ordered = curf["list"].five[2]
        let gotten = curf["list"].five[3]
        let ghajh = 100 / ordered
        let doneper = Math.round(ghajh * gotten)
        let sdgh = Math.round(doneper / 10)
        let out = sdgh
        let remain = 10 - out
        let stringie = ""
        if(out > 0){
            stringie = "**"
        } else {
            stringie = ""
        }

        var i
        for(i = 0; i < out; i++){
            stringie = `${stringie}=`
            if(i == out - 1){
                stringie = `${stringie}**`
                console.log("done")
            }
        }
        setTimeout(function(){
            var b
            for(b = 0; b < remain; b++){
                stringie = `${stringie}–`
            }
            setTimeout(function(){
                let emb = new Discord.MessageEmbed()
                    .setTitle("Your Order Status")
                    .setColor("RANDOM")
                    .setDescription("Below is the status for your order")
                    .addField("**Current Order**", `${stringie} [${curf["list"].five[3]}/${curf["list"].five[2]}]`)

                message.channel.send(emb)
            }, ms("0.15s"))
        }, ms("0.15s"))
    } else {
        let emb = new Discord.MessageEmbed()
            .setTitle("Your Order Status")
            .setColor("RANDOM")
            .setDescription("Below is the status for your order")
            .addField("***Error!***", `You do not have a current order`)

        message.channel.send(emb)
    }
}


    if(command == "help"){
        let type
        if(args[0]){
            type = args[0].toLowerCase()
        }
        if(type == "general"){
            let emb = new Discord.MessageEmbed()
                .setTitle("Bot4Bot • General Commands")
                .setColor("#146eff")
                .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
                .addField("`.help`", "Displays a list of all commands")
                .addField("`.info`", "View the status of your current bot ad order")
                .addField("`.changelog`", "View the bots changelog and current version")
                .addField("`.support`", "Get a link to the bots support server **__COMMAND NOT READY__**")
                .addField("`.stats`", "View current bot statistics")
                .setFooter("Bot4Bot 2020© • Command List")

            message.channel.send(emb)
        } else if(type == "economy"){
            let emb = new Discord.MessageEmbed()
                .setTitle("Bot4Bot • Economy Commands")
                .setColor("#146eff")
                .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
                .addField("`.bal`", "View your balance")
                .addField("`.pay`", "Pay any user directly with Bot4Bot coins")
                .addField("`.find`", "Find developers paying 1 coin each for you to add their bot to your server")
                .addField("`.buy`", "Pay users to add your bot to their server **__COMMAND NOT READY__**")
                .addField("`.cancelorder`", "Cancel whatever sized order you want and receive a partial 75% refund for any members you have not received")
                .addField("`.bid`", "Place a bid on your bot, allows you to be on .find all day")
                .setFooter("Bot4Bot 2020© • Command List")

            message.channel.send(emb)
        } else if(type == "other"){
            let emb = new Discord.MessageEmbed()
                .setTitle("Bot4Bot • Other Commands")
                .setColor("#146eff")
                .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
                .addField("`.disable`", "Disable commands in the specified channel")
                .addField("`.enable`", "Enable commands in a specified channel")
                .addField("`.credits`", "View the owners and developers of the bot")
                .addField("`.ping`", "View the discord bots API Latency")
                .setFooter("Bot4Bot 2020© • Command List")

            message.channel.send(emb)
        } else if(type == "faq"){
            let emb = new Discord.MessageEmbed()
                .setTitle("Bot4Bot • Frequently Asked Questions")
                .setColor("#146eff")
                .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
                .addField("**How do I use this bot?**", "To use this bot its simple, the prefix is `.` type `.help` to see a list of commands you can use!")
                .addField("**How do I get coins?**", "To get coins type `.find` then add our bot and one of those bots to your server and youll get coins for free")
                .addField("**Is trading allowed?**", "Trading is not allowed, this is in order to comply with discord ToS")
                .addField("**Do I get anything if I boost the server?**", "You get 2 coins a day for free by boosting the official Bot4Bot server")
                .addField("**Can I sell my bot for coins?**", "Selling bots for coins falls under the trading category and is strictly prohibited")
                .addField("**Can I apply for staff**", "Staff applications are currently closed but there will be an announcement in the official announcement channel in the Bot4Bot server when they are open again!")
                .setFooter("Bot4Bot 2020© • Command List")

            message.channel.send(emb)
        } else if(type == "mod"){
            if(!mods.includes(message.author.id)) return
            let emb = new Discord.MessageEmbed()
                .setTitle("Bot4Bot • MOD Commands")
                .setColor("#146eff")
                .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
                .setDescription(`<@${message.author.id}>, Please remember MOD commands only work with user ID's`)
                .addField("`.mod bal`", "View a user's balance")
                .addField("`.mod ban`", "Ban a user from using commands")
                .addField("`.mod unban`", "Unban a user and allow them to continue using commands")
                .addField("`.mod ruin`", "Ruin a users balance, Only to be used if they break bots ToS")
                .setFooter("Bot4Bot 2020© • Command List")

            message.channel.send(emb)
        } else {
            if(mods.includes(message.author.id)){
            let emb = new Discord.MessageEmbed()
                .setTitle("Bot4Bot Commands")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
                .addField("General Commands", "Use `.help general` to access a list of general commands")
                .addField("Economy Commands", "Use `.help economy` to access a list of economy commands")
                .addField("Other Commands", "Use `.help other` to access a list of other commands")
                .addField("Mod Commands", "Use `.help mod` to access a list of moderative commands")
                .addField("**FAQ**", "Use `.help faq` to see a list of frequently asked questions")
                .setFooter("Bot4Bot 2020© • Command List")

            message.channel.send(emb)
            } else {
            let emb = new Discord.MessageEmbed()
                .setTitle("Bot4Bot Commands")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
                .addField("General Commands", "Use `.help general` to access a list of general commands")
                .addField("Economy Commands", "Use `.help economy` to access a list of economy commands")
                .addField("Other Commands", "Use `.help other` to access a list of other commands")
                .addField("**FAQ**", "Use `.help faq` to see a list of frequently asked questions")
                .setFooter("Bot4Bot 2020© • Command List")

            message.channel.send(emb)
            }
        }
    }

    if(command == "stats"){
        let emb = new Discord.MessageEmbed()
                .setTitle("Bot4Bot Stats")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
                .setDescription(`**Servers**  -  ${client.guilds.cache.size}\n**Users**  -  ${client.users.cache.size}\n**Shard #**  -  1 / 1\n**Uptime**  -  [Coming Soon]`)
                .setFooter("Bot4Bot 2020© • Stats")

        message.channel.send(emb)
    }

    if(command == "invite"){
        let emb = new Discord.MessageEmbed()
                .setTitle("Bot4Bot Invite Link")
                .setColor("#483eb5")
                .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
                .setDescription(`**https://bit.ly/inviteB4B**`)
                .setFooter("Bot4Bot 2020© • Invite Link")

        message.channel.send(emb)
    }

if(command === "eval"){
  
 function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}  
  let arg = message.content.split(" ").slice(1);
    if(message.author.id !== "265536498529599490") return
    try {
      let code = arg.join(" ");
      let evaled = eval(code);
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
      message.channel.send(clean(evaled), {code:"xl"});
      console.log(`Done: ${code} return: good`)
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      console.log("error with eval")
    }
   

  }


  if(command == "bid"){
      let member = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
      let type = args[1]
      if(!args[1]){
          let winner = ""
          let amount = 0
          if(bids["bidding"].invite != ""){
            winner = bids["bidding"].invite
            let emb = new Discord.MessageEmbed()
                .setTitle("Bid Perm | Todays Bidding")
                .setColor("#483eb5")
                .setDescription("The bidding system allows users to permanently place their bot on `.find` for the entire day, to place a bid do: **.bid @bot [amount]**")
                .addField("**Current Winner**", `<@${bids["bidding"].invite}>, With a bid sized at **${bids["bidding"].cost}** Coins`)
                .setFooter("Bidding ends every day at 2PM BST\n  Bot4Bot 2020© • Bidding System")

            message.channel.send(emb)
          } else {
            let emb = new Discord.MessageEmbed()
                .setTitle("Bid Perm | Todays Bidding")
                .setColor("#483eb5")
                .setDescription("The bidding system allows users to permanently place their bot on `.find` for the entire da, to place a bid do: **.bid @bot [amount]**y")
                .addField("**Current Winner**", `There are no current bidders,\nFeel free to submit any sized bid by doing:\n**+bid [amount]**`)
                .setFooter("Bidding ends every day at 2PM BST\n  Bot4Bot 2020© • Bidding System")

            message.channel.send(emb)
          }
      } else {
          let total = parseInt(args[1])
          if(Number.isNaN(total) == true) return message.channel.send("Please specify a valid number")
          if(coin[message.author.id].coins < total) return message.channel.send("You dont have enough coins for that!")
          if(total < bids["bidding"].cost){
              let emb = new Discord.MessageEmbed()
                .setTitle("***Oops...***")
                .setColor("#483eb5")
                .addField("Your bid could not be submitted", `You attempted to bid ${total} coins, However\nThe current highest bid is **${bids["bidding"].cost}** coins`)
                .setFooter("Bidding ends every day at 2PM BST\n  Bot4Bot 2020© • Bidding System")

              message.channel.send(emb)
          } else {
              let curcoin = coin[message.author.id].coins
              let curhist = coin[message.author.id].history
              coin[message.author.id].coins = curcoin - total
              coin[message.author.id].history.push(`[-${total}] Deposit for bot bid`)
              fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});

              if(bids["bidding"].invite != ""){
                  let coinreturn = coin[bids["bidding"].return].coins
                  coin[bids["bidding"].return].coins = coinreturn + bids["bidding"].cost
                  coin[bids["bidding"].return].history.push(`[+${bids["bidding"].cost}] Return from being outbid`)
                  fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
              }
              bids["bidding"].invite = member.id
              bids["bidding"].cost = total
              bids["bidding"].winner = member.username
              bids["bidding"].return = message.author.id
              fs.writeFile("./datamodules/bids.json", JSON.stringify(bids), (err) => {
  if(err) console.log(err)
});

              let emb = new Discord.MessageEmbed()
                .setTitle("**Congratulations!**")
                .setColor("#483eb5")
                .addField("Your bid was submitted", `Your bid of ${total} coins for ${member.username} was successfully submitted\nThe full amount has been taken from your account as a deposit\n**__If you lose the bid the full amount of coins will be returned to your balance__**`)
                .setFooter("Bidding ends every day at 2PM BST\n  Bot4Bot 2020© • Bidding System")

              message.channel.send(emb)
          }
      } 
  }

  if(command == "changelog"){
      let emb = new Discord.MessageEmbed()
        .setTitle(`Bot4Bot ChangeLog V${changelog.version}`)
        .setColor("#146eff")
        .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
        .setDescription(`**Developer Notes:** ${changelog.devnotes}`)
        .addField(`**UPDATES:**`, changelog.updates)
        .setFooter("Bot4Bot 2020© • Changelog")

      message.channel.send(emb)
  }
  if(command == "credits"){
      let emb = new Discord.MessageEmbed()
        .setTitle("Bot4Bot Credits")
        .setColor("#146eff")
        .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
        .addField("`Owners`", "**Austin#6034**\n**uhFinn#0001**")
        .addField("`Developer`", "**uhFinn#0001**")
        .addField("`Lead Of Operations`", "**xCube#0001**  -  Treasury Leader\n**Jxy#7070**  -  T&S Overseer\n**mintybub#8888**  -  Team Leader")

      message.channel.send(emb)
  }

  if(command == "ping"){
        let emb1 = new Discord.MessageEmbed()
            .setTitle("Ping?")
            .setColor("#146eff")
        const m = await message.channel.send(emb1);
        let emb2 = new Discord.MessageEmbed()
            .setTitle("Pong!")
            .setColor("#146eff")
            .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
            .setDescription(`**Latency**  -  ${m.createdTimestamp - message.createdTimestamp}ms\n**API Latency**  -  ${Math.round(client.ws.ping)}ms`)
            .setFooter("Bot4Bot 2020© • API Latency")
        m.edit(emb2);  
  }

  if(command == "cancelorder"){
      let num = args[0]
      if(!args[0]){
          let amt = 0
          let strings = ""
          if(curf["list"].one[5] == message.author.id){
            amt = amt + 1
            strings = `${amt}. Bot: ${curf["list"].one[1]} - Order Size: ${curf["list"].one[3]}/${curf["list"].one[2]}`
          }
          if(curf["list"].two[5] == message.author.id){
            amt = amt + 1
            strings = `\n${amt}. Bot: ${curf["list"].two[1]} - Order Size: ${curf["list"].two[3]}/${curf["list"].two[2]}`
          }
          if(curf["list"].three[5] == message.author.id){
            amt = amt + 1
            strings = `\n${amt}. Bot: ${curf["list"].three[1]} - Order Size: ${curf["list"].three[3]}/${curf["list"].three[2]}`
          }
          if(curf["list"].four[5] == message.author.id){
            amt = amt + 1
            strings = `\n${amt}. Bot: ${curf["list"].four[1]} - Order Size: ${curf["list"].four[3]}/${curf["list"].four[2]}`
          }
          if(curf["list"].five[5] == message.author.id){
            amt = amt + 1
            strings = `\n${amt}. Bot: ${curf["list"].five[1]} - Order Size: ${curf["list"].five[3]}/${curf["list"].five[2]}`
          }

          if(strings == ""){
              strings = "No current orders!"
          }

          let emb = new Discord.MessageEmbed()
            .setTitle("Cancel an order")
            .setColor("#146eff")
            .setDescription("**Please Note:** Cancelling an order only returns 75% of the due coins\nTo cancel an order do .cancelorder [clientID]")
            .addField("Orders:", strings)
            .setFooter("Bot4Bot 2020© • Order Cancellation")

        message.channel.send(emb)
      } else {
          if(curf["list"].one[1] == num){
              if(curf["list"].one[5] == message.author.id){
                  let amt0 = curf["list"].one[2] - curf["list"].one[3]
                  let amt = Math.round((amt0 / 4) * 3)
                  let curcoin = coin[message.author.id].coins
                  coin[message.author.id].coins = curcoin + amt
                  coin[message.author.id].history.push(`[+${amt}] 75% Refund for cancelling order`)
                  fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
                  curf["list"].one = []
                  fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
                  
                  let emb = new Discord.MessageEmbed()
                    .setTitle("Order Cancellation Successful")
                    .setColor("#146eff")
                    .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                    .setDescription(`Your order cancellation was successful!\nYou received your 75% partial refund of ${amt} Coins!`)
                    .setFooter("Bot4Bot 2020© • Order Cancellation")

                  message.channel.send(emb)
              }
          } else if(curf["list"].two[1] == num){
              if(curf["list"].two[5] == message.author.id){
                  let amt0 = curf["list"].two[2] - curf["list"].two[3]
                  let amt = Math.round((amt0 / 4) * 3)
                  let curcoin = coin[message.author.id].coins
                  coin[message.author.id].coins = curcoin + amt
                  coin[message.author.id].history.push(`[+${amt}] 75% Refund for cancelling order`)
                  fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
}); 
                  curf["list"].two = []
                  fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
                  let emb = new Discord.MessageEmbed()
                    .setTitle("Order Cancellation Successful")
                    .setColor("#146eff")
                    .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                    .setDescription(`Your order cancellation was successful!\nYou received your 75% partial refund of ${amt} Coins!`)
                    .setFooter("Bot4Bot 2020© • Order Cancellation")

                  message.channel.send(emb)
              }
          } else if(curf["list"].three[1] == num){
              if(curf["list"].three[5] == message.author.id){
                  let amt0 = curf["list"].three[2] - curf["list"].three[3]
                  let amt = Math.round((amt0 / 4) * 3)
                  let curcoin = coin[message.author.id].coins
                  coin[message.author.id].coins = curcoin + amt
                  coin[message.author.id].history.push(`[+${amt}] 75% Refund for cancelling order`)
                  fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
                  curf["list"].three = []
                  fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
                  let emb = new Discord.MessageEmbed()
                    .setTitle("Order Cancellation Successful")
                    .setColor("#146eff")
                    .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                    .setDescription(`Your order cancellation was successful!\nYou received your 75% partial refund of ${amt} Coins!`)
                    .setFooter("Bot4Bot 2020© • Order Cancellation")

                  message.channel.send(emb)
              }
          } else if(curf["list"].four[1] == num){
              if(curf["list"].four[5] == message.author.id){
                  let amt0 = curf["list"].four[2] - curf["list"].four[3]
                  let amt = Math.round((amt0 / 4) * 3)
                  let curcoin = coin[message.author.id].coins
                  coin[message.author.id].coins = curcoin + amt
                  coin[message.author.id].history.push(`[+${amt}] 75% Refund for cancelling order`)
                  fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
                  curf["list"].four = []
                  fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
                  let emb = new Discord.MessageEmbed()
                    .setTitle("Order Cancellation Successful")
                    .setColor("#146eff")
                    .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                    .setDescription(`Your order cancellation was successful!\nYou received your 75% partial refund of ${amt} Coins!`)
                    .setFooter("Bot4Bot 2020© • Order Cancellation")

                  message.channel.send(emb)
              }
          } else if(curf["list"].five[1] == num){
              if(curf["list"].five[5] == message.author.id){
                  let amt0 = curf["list"].five[2] - curf["list"].five[3]
                  let amt = Math.round((amt0 / 4) * 3)
                  let curcoin = coin[message.author.id].coins
                  coin[message.author.id].coins = curcoin + amt
                  coin[message.author.id].history.push(`[+${amt}] 75% Refund for cancelling order`)
                  fs.writeFile("./datamodules/coins.json", JSON.stringify(coin), (err) => {
  if(err) console.log(err)
});
                  curf["list"].five = []
                  fs.writeFile("./datamodules/curf.json", JSON.stringify(curf), (err) => {
  if(err) console.log(err)
});
                  let emb = new Discord.MessageEmbed()
                    .setTitle("Order Cancellation Successful")
                    .setColor("#146eff")
                    .setThumbnail("https://cdn.discordapp.com/emojis/699930719925043310.gif")
                    .setDescription(`Your order cancellation was successful!\nYou received your 75% partial refund of ${amt} Coins!`)
                    .setFooter("Bot4Bot 2020© • Order Cancellation")

                  message.channel.send(emb)
              }
          } else {

          }
      }
  }

  if(command == "disable"){
      if(!message.member.hasPermission("ADMINISTRATOR") && message.author.id != '265536498529599490') return message.channel.send("Only server admins can do that!")
      if(!args[0]) return message.channel.send("Please specify which channel you wish to disable")
      let channel = args[0].replace(/\D/g,'')
      if(disable.list.includes(channel)) return message.channel.send("That channel is already disabled!")
      disable.list.push(channel)
      message.channel.send(`I have disabled all Bot4Bot commands except .enable in <#${channel}>`)
      fs.writeFile("./datamodules/disabled.json", JSON.stringify(disable), (err) => {
  if(err) console.log(err)
});
  }
  if(command == "enable"){
      if(!message.member.hasPermission("ADMINISTRATOR") && message.author.id != '265536498529599490') return message.channel.send("Only server admins can do that!")
      if(!args[0]) return message.channel.send("Please specify which channel you wish to enable")
      let channel = args[0].replace(/\D/g,'')
      if(!disable.list.includes(channel)) return message.channel.send("That channel is already enabled!")
      disable.list.remove(channel)
      message.channel.send(`I have enabled all Bot4Bot commands in <#${channel}>`)
      fs.writeFile("./datamodules/disabled.json", JSON.stringify(disable), (err) => {
  if(err) console.log(err)
});
  }

  if(command == "support"){
      message.channel.send("Join our support server!\nLink: **https://discord.gg/BgkmNd4**")
  }

  if(command == "check"){
      var todi = new Date();
      const firstDate = new Date(2000, 1, 1);
      const secondDate = new Date(todi.getFullYear(), (todi.getMonth()+1), todi.getDate());
      const diffdays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

      let listcan = []
      let listcant = []
      
      if(!sstat[message.guild.id]){
          let emb = new Discord.MessageEmbed()
            .setTitle("Check Status")
            .setColor("#b54376")
            .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
            .setDescription("Removing bots from your server before 3 days have passed causes you to lose 2 coins per bot, please check below whether it is safe to remove the bots.")
            .addField("**Safe To Remove:**", "N/A")
            .addField("**Unsafe To Remove:**", "N/A")
            .setFooter("Bot4Bot 2020© • Check System")

        message.channel.send(emb)
      }
      let lent = sstat[message.guild.id]["full"]
      var i
      for(i = 0; i < lent.length; i++){
          let user = sstat[message.guild.id]["full"][i][0]
          if(sstat[message.guild.id][user] < diffdays){
            if(message.guild.member(user)){
                listcan.push(`<@${user}> ~ Can be removed without losing coins`)
            } else {

            }
          } else {
            if(message.guild.member(user)){
                listcant.push(`<@${user}> ~ Can not be removed **[Wait: ${sstat[message.guild.id][user] - diffdays} Days]**`)
            } else {

            }
          }
      }
      setTimeout(function(){
        if(!listcan[0]) listcan = ["N/A"]
        if(!listcant[0]) listcant = ["N/A"]
        let emb = new Discord.MessageEmbed()
            .setTitle("Check Status")
            .setColor("#b54376")
            .setThumbnail("https://cdn.discordapp.com/avatars/735676509838245920/158884b272525523c9109c474d1d05bd.png?size=128")
            .setDescription("Removing bots from your server before 3 days have passed causes you to lose 2 coins per bot, please check below whether it is safe to remove the bots.")
            .addField("**Safe To Remove:**", listcan.join("\n"))
            .addField("**Unsafe To Remove:**", listcant.join("\n"))
            .setFooter("Bot4Bot 2020© • Check System")

        message.channel.send(emb)
      }, ms("0.15s"))
  }


})

client.login("TOKEN")