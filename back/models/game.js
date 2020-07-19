const crypto = require('crypto')
const Quote = require('./quote')

const makeColor = (name, code) => ({
  name,
  code
})

const colors = [
  makeColor('teak',         '#ba9570'), // hsl(30°,  40%, 73%)
  makeColor('timblet',      '#baba70'), // hsl(60°,  40%, 73%)
  makeColor('olivine',      '#95ba70'), // hsl(90°,  40%, 73%)
  makeColor('fern',         '#70ba70'), // hsl(120°, 40%, 73%)
  makeColor('silver tree',  '#70ba95'), // hsl(150°, 40%, 73%)
  makeColor('neptune',      '#70baba'), // hsl(180°, 40%, 73%)
  makeColor('ship cove',    '#7070ba'), // hsl(240°, 40%, 73%)
  makeColor('wisteria',     '#9570ba'), // hsl(270°, 40%, 73%)
  makeColor('fuchsia pink', '#ba70ba'), // hsl(300°, 40%, 73%)
  makeColor('turkish rose', '#ba7095')  // hsl(330°, 40%, 73%)
]

const generateId = () => crypto.randomBytes(Number(20 / 2) ).toString('hex')

const games = {}

const get = (gameId) => games[gameId]

const create = () => {
  const id = generateId()
  const quote = Quote.random()
  const messages = [
    {
      sender: 'liracer',
      content: `The game id is ${id}`
    },
    {
      sender: 'liracer',
      content: `The current program is ${quote.program}`
    }
  ]
  const players = []

  const game = {
    id,
    quote,
    messages,
    players
  }

  games[id] = game

  return game
}

const remove = (gameId) => {
  delete games[gameId]
}

const getPlayer = (gameId, playerIp) => games[gameId][playerIp]

const uniqueColor = (gameId) => colors.find(color => {
  console.log(color)
  return !games[gameId].players.some(player => {
    console.log(player)
    return JSON.stringify(player.color) === JSON.stringify(color.code)
  })  
})

const createPlayer = (gameId, playerIp, ws) => {
  const color = uniqueColor(gameId)
  if(color !== undefined){
    const player = {
      ip: playerIp,
      color: color.code,
      name: color.name,
      ws
    }
    games[gameId].players.push(player)
  } else {
    throw 'Could not create player since the room is full'
  }
}

const removePlayer = (gameId, playerIp) => {
  delete games[gameId][playerIp]
}

const saveMessage = (id, message) => {
  games[id].messages.push(message)
}

const publicInterface = {
  get,
  create,
  remove,
  getPlayer,
  createPlayer, 
  removePlayer,
  saveMessage
}

module.exports = publicInterface