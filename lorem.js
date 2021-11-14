const fetch = require('node-fetch');
listAllPlayers = []
async function updateListAllPlayers(){
  let oldListAllPlayers = listAllPlayers
  const url = 'https://api.wfstats.cf/clan/members?name=KingsOfZuera&server=eu';
  let result = await fetch(url)
  result = await result.json()
  if(!result?.status === error){
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
}

updateListAllPlayers();