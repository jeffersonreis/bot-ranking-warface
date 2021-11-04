console.log('Iniciando o bot')

const { Client, Intents } = require('discord.js');
// const config = require("./config.json");
const fetchAll = require('discord-fetch-all');
const robo = require("./robo.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.login("OTA1MjgyNzM5NDY3NTg3NjI2.YYH0QA.3adDsZzBIVKVZoV1uyFzvpeHVGg");
const prefix = "!";

client.on("messageCreate", async function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  // console.log(message)
  if (message.author.id === '322815670981099542' || message.author.id === '294953779126861824'){
    // apenas esses IDs podem chamar o bot 

    if (command === "limpartudo") {    
      console.log('Ei')                  
      
      const allMessages = await fetchAll.messages(message.channel, {
        reverseArray: true, // Reverse the returned array
        // userOnly: true, // Only return messages by users
        // botOnly: false, // Only return messages by bots
        // pinnedOnly: false, // Only returned pinned messages
      });

      console.log('TAMANHO', allMessages.length)
      console.log('ID', allMessages[2].author.id)

      for (var i = 0; i < allMessages.length; i++){
        if (allMessages[i].author.id === "905282739467587626"){
          await allMessages[i].delete();
        }
      }
    }

    if (command === "iniciarcampeonato") {                      
      message.reply("Iniciando!");
      robo.iniciar(client)
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