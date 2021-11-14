const fetch = require('node-fetch');
const Player = require("./player")

let workAtual = true
let lastMessage = null
let listAllPlayers = []

// let channel = "905284439595184138" // meu
let channel = "905655056160948244" // koz


let timeSleep = 60000 
// seconds

async function getPlayByNk(listPlay, nk){
  for (let play of listPlay){
    if (play.nickname === nk){
      return play
    }
  }
  return null
}

async function comparererPointsUpdate(oldListPLay, newListPLay){
  for (let newPlay of newListPLay){
    let oldPlay = await getPlayByNk(oldListPLay, newPlay.nickname)
    if (oldPlay != null){
      if (newPlay.clan_points != oldPlay.clan_points){
          return true
        }
      }
    }
  return false
}

async function updateListAllPlayers(){
  let oldListAllPlayers = listAllPlayers
  const url = 'https://api.wfstats.cf/clan/members?name=KingsOfZuera&server=eu';
  let result = await fetch(url)
  result = await result.json()
  if(!result?.status === 'error'){
    listAllPlayers = await result.members

    let state = false
  
    // em caso da lista anterior ser vazia
    if (oldListAllPlayers.length === 0){
      state = true
    }
  
    // se n for vazia, comparar as duas listas para ver se tem atualizacao
    else{
      state = await comparererPointsUpdate(oldListAllPlayers, listAllPlayers)
    }
    return state  
  }

  return 'error'
}


async function destroyAllDates(){
  Player.sync({ force: true })
}

async function firstQuery(client){
  listAllPlayers = []
  let first = '\nRanking da Kings Of Zuera!\n\nPontos atuais\n'
  await updateListAllPlayers()

  listAllPlayers.map((play, index) => (
    Player.create({nickname: play.nickname, earned_pc: 0, old_pc: play.clan_points, new_pc: play.clan_points}),
      first += `\n ${index+1}º: ${play.nickname}, com ${play.clan_points} PC`
  ))

  await sendMsgBot(client, first)
}

async function updatePlayer(player, newPc){
  // atualizara na tabela se houve mudanca nos pontos
  if (newPc - player.new_pc != 0){
    player.new_pc = newPc;
    player.earned_pc = player.new_pc - player.old_pc;
    player.save();
  }
}

function comparer(a, b) {
  if (a.dataValues.earned_pc < b.dataValues.earned_pc)
      return 1;

  if (a.dataValues.earned_pc > b.dataValues.earned_pc)
      return -1;

  return 0;
}

function createMessage(listPlay){
  let msg = 'Ranking da Kings Of Zuera!\n'
  listPlay.map((play, index) => 
    msg += `\n ${index+1}º: ${play.nickname}, +${play.earned_pc} PC ganhos`
  )
  return msg
}

async function updateTable(client){
  const players = await Player.findAll(); // pega todos players do BD
  players.sort(comparer); // Organiza por PCs ganhos
  let msg = createMessage(players)
  sendMsgBotTemp(client, msg)
}

async function updatePoints(client){
  console.log('Estou Vivo!')
  let haveUpdate = await updateListAllPlayers()

  if (haveUpdate === true){
    // atualiza no Banco de Dados
    for (let newPlay of listAllPlayers){
      let bdPlayer = await Player.findByPk(newPlay.nickname)
      if (bdPlayer != undefined && bdPlayer != null){
        await updatePlayer(bdPlayer, newPlay.clan_points)
      }
    }

    // Atualiza no Discord
    updateTable(client)
  }

  if (haveUpdate === "error"){
    sendMsgBotTemp(client, "API Warface Fora do Ar")
  }
}

// mensagem que apaga
async function sendMsgBotTemp(client, msg){
  if (lastMessage != null){
    try{
      await lastMessage.delete()
    }
    catch{
      console.log('N consegui apagar, mas td bem.')
    }
  }
  lastMessage = await client.channels.cache.get(channel).send(msg)
}

// mensagem que nao Apaga
async function sendMsgBot(client, msg){
  client.channels.cache.get(channel).send(msg)
}

async function acabar(client){
  sendMsgBot(client, '\n##### Ranking Terminado!! ##### \n')
  await updatePoints(client)
  workAtual = false
}

async function iniciar(client){
  workAtual = true
  lastMessage = null
  listAllPlayers = []

  console.log("Entrei")

  await destroyAllDates();
  console.log("Limpei os dados")

  await firstQuery(client)
  console.log("Criei os novos")

  // while indeterminado
  while (workAtual) {
    await updatePoints(client)
    await new Promise(r => setTimeout(r, timeSleep));
  }
}

async function continuar(client){
  workAtual = true
  lastMessage = null
  sendMsgBot(client, "Continuando Ranking!")
  
  while (workAtual) {
    await updatePoints(client)
    await new Promise(r => setTimeout(r, timeSleep));
  }
}

module.exports = { iniciar, acabar, continuar };