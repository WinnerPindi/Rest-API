const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const {success, getUniqueId}= require('./helper.js')
let pokemons = require('./mock-pokemon');

const app = express()
const port = 3000
//Middleware
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))


app.get('/', (req,res) => res.send('Hello again, Express!'))

//On retourne la liste de tous les pokémons
app.get('/api/pokemons', (req,res) => {
    const message = 'La liste des pokémons a bien été récupérée.'
    res.json(success(message, pokemons))
})

//On rescupère Un seul pokemon
app.get('/api/pokemons/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const pokemon =pokemons.find(pokemon => pokemon.id === id)
    const message = 'Un pokémon a été trouvé.'
    res.json(success(message, pokemon))
})
//Methode Post pour ajouter un pokemon 
app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons)
    const pokemonCreated = {...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`
    res.json(success(message, pokemonCreated))
})





app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`) )