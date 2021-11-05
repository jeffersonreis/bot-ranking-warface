const fetch = require('node-fetch');
let listAllPlayers = []

let index = 0

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
  listAllPlayers = await result.members

  return await comparererPointsUpdate(oldListAllPlayers, listAllPlayers)
}

async function run(){
  ok = true
  while (ok){
    console.log(await updateListAllPlayers())
  }
}

run()