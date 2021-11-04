const fetch = require('node-fetch');
const Job = require('cron').CronJob
const Player = require("./player")

let JobActual = null
let lastMessage = null

async function listAllPlayers(){
  const url = 'https://api.wfstats.cf/clan/members?name=KingsOfZuera&server=eu';
  let result = await fetch(url)
  result = await result.json()
  return result.members
}

async function destroyAllDates(){
  Player.sync({ force: true })
}

async function firstQuery(){
  let first = '\nCampeonato da Kings Of Zuera!\n\nBoa sorte a todos\n'
  let listAll = await listAllPlayers()

  listAll.map((play, index) => (
    Player.create({nickname: play.nickname, earned_pc: 0, old_pc: play.clan_points, new_pc: play.clan_points}),
    index < 10? first += `\n ${index+1}º Lugar: ${play.nickname}, com ${play.clan_points} Pontos PC` : ''
  ))

  return first
}

async function updatePlayer(player, newPc){
  player.new_pc = newPc;
  player.earned_pc = player.new_pc - player.old_pc;
  player.save();
}

function comparer(a, b) {
  if (a.dataValues.earned_pc < b.dataValues.earned_pc)
      return 1;

  if (a.dataValues.earned_pc > b.dataValues.earned_pc)
      return -1;

  return 0;
}

function createMessage(listPlay){
  let msg = 'Campeonato da Kings Of Zuera!\n'
  listPlay.map((play, index) => 
    index < 10? msg += `\n ${index+1}º Lugar: ${play.nickname}, com ${play.earned_pc} Pontos Ganhos` : ''
  )

  return msg
}

async function updateTable(client){
  const players = await Player.findAll();
  players.sort(comparer);
  let msg = createMessage(players)
  sendMsgBotTemp(client, msg)
}

async function updatePoints(client){
  let newListAll = await listAllPlayers() // retorna um array com os pontos de todos os players
  
  for (let play of newListAll){
    let player = await Player.findByPk(play.nickname)
    await updatePlayer(player, play.clan_points)
  }
  console.log('atualizei')
  updateTable(client)
}

// mensagem que apaga
async function sendMsgBotTemp(client, msg){
  if (lastMessage != null){
    await lastMessage.delete()
  }
  lastMessage = await client.channels.cache.get(`905655056160948244`).send(msg)
}

// mensagem que nao Apaga
async function sendMsgBot(client, msg){
  client.channels.cache.get(`905655056160948244`).send(msg)
}

// async function stopJobs(jobUpdate, jobStop, client){
//   if (jobUpdate.running){
//     console.log('Estou rodando ainda!')
//     await new Promise(r => setTimeout(r, 10000));
//     console.log('Pronto, agora parei :(')
//   }
//   jobUpdate.stop()
//   jobStop.stop()
//   sendMsgBot(client, 'ACABOUUUUUU')
//   updatePoints(client)
// }

async function acabar(client){
  sendMsgBot(client, '\n##### Campeonato Terminado!! ##### \n')
  await updatePoints(client)
  if (JobActual != null){ 
    JobActual.stop()
    lastMessage = null
  }
}

async function iniciar(client){
  console.log("Entrei")
  await destroyAllDates();
  console.log("Limpei os dados")
  let first = await firstQuery()
  sendMsgBot(client, first)
  console.log("Criei os novos")
  
  const jobUpdate = new Job('*/5 * * * *', () =>{
    updatePoints(client)
  }, null, true, 'America/Sao_Paulo')
  
  // const jobStop = new Job('* */2 * * *',  () =>{
  //   stopJobs(jobUpdate, jobStop, client)
  // }, null, true, 'America/Sao_Paulo')

  JobActual = jobUpdate
}


async function continuar(client){
  lastMessage = null
  sendMsgBot(client, "Continuando campeonato!")
  const jobUpdate = new Job('*/5 * * * *', () =>{
    updatePoints(client)
  }, null, true, 'America/Sao_Paulo')
  
  // const jobStop = new Job('* */2 * * *',  () =>{
  //   stopJobs(jobUpdate, jobStop, client)
  // }, null, true, 'America/Sao_Paulo')

  JobActual = jobUpdate
}

module.exports = { iniciar, acabar, continuar };