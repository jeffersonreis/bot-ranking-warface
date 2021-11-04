console.log('Iniciando o bot')

const { Client, Intents } = require('discord.js');
const config = require("./config.json");
const robo = require("./robo.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.login(config.BOT_TOKEN);
const prefix = "!";

function lancaBrabra(){
  client.on("ready", function() {
    client.channels.cache.get(`905284439595184138`).send(`Text`)
  });
}

client.on("messageCreate", function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  // console.log(message)
  if (message.author.id === '322815670981099542' || message.author.id === '294953779126861824'){
    // apenas esses IDs podem chamar o bot 

    if (command === "iniciarcampeonato") {                      
      message.reply("Iniciando!");
      Job = robo.iniciar(client)
      }
    
    if (command === "finalizarcampeonato") {
      console.log('Vamos parando!!!')
      robo.acabar(client)
    }

    if (command === "continuarcampeonato") {
      console.log('Continuando!!!')
      robo.continuar(client)
    }
  }
});

// client.channels.cache.get(`905284439595184138`).send(`Text`)