console.log('Iniciando o bot')
require("dotenv").config()

// let channel = "905284439595184138" // meu
let channel = "905655056160948244" // koz


const { Client, Intents } = require('discord.js');
// const config = require("./config.json");
const fetchAll = require('discord-fetch-all');
const robo = require("./robo.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.login(process.env.BOT_TOKEN);
const prefix = "!";

async function apagar(message, all){
  const allMessages = await fetchAll.messages(message.channel, {
    reverseArray: true, // Reverse the returned array
  });

  for (var i = 0; i < allMessages.length; i++){
    if (allMessages[i].author.id === "905282739467587626"){

      // apaga tudo menos o First
      if(!all){
        if (!allMessages[i].content.includes('atuais')){
          await allMessages[i].delete();
        }
      }

      // apagar tudo mesmo
      else{
        await allMessages[i].delete();
      }
    }
  }
}

client.on("ready", async function(){
  client.channels.cache.get(channel).send("!continuarpontos")
})

client.on("messageCreate", async function(message) {
  if (!message.content.startsWith(prefix)) return;
  
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  // console.log(message)
  if (message.author.id === '322815670981099542' || message.author.id === '294953779126861824' || message.author.id === "905282739467587626"){
    // apenas esses IDs podem chamar o bot 

    if (command === "limpar") {    
      apagar(message, false)
    }

    if (command === "limpartudo") {    
      apagar(message, true)
    }

    if (command === "iniciarpontos") {                      
      message.reply("Iniciando!");
      robo.iniciar(client)
      }
    
    if (command === "finalizarpontos") {
      console.log('Vamos parando!!!')
      robo.acabar(client)
    }

    if (command === "continuarpontos") {
      await apagar(message, false)
      console.log('Continuando!!!')
      robo.continuar(client)
    }
  }
});