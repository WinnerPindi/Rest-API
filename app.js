const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParse = require('body-parser')
const { Sequelize } = require('sequelize')
const {success, getUniqueId}= require('./helper.js')
let pokemons = require('./mock-pokemon');

const app = express()
const port = 3000
//Connect to Data base
const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {
        host:'localhost',
        dialect:'mariadb',
        dialectOptions:{
            timezone:'Etc/GMT-2'
        },
        logging : false
    }
)
// Verification de la connexion

sequelize.authenticate()
    .then(_ => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.log(`Impossible de se connecter à la base de données ${error}`))

//Middleware
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParse.json())

app.get('/', (req,res) => res.send('Hello again, Express!'))

//On retourne la liste de tous les pokémons
app.get('/api/pokemons', (req,res) => {
    const message = 'La liste des pokémons a bien été récupérée.'
    res.json(success(message, pokemons))
})

//On recupère Un seul pokemon
app.get('/api/pokemons/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const pokemon =pokemons.find(pokemon => pokemon.id === id)
    const message = 'Un pokémon a été trouvé.'
    res.json(success(message, pokemon))
})

//Point de terminaison Post pour ajouter un pokemon 
app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons)
    const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`
    res.json(success(message, pokemonCreated))
})

// Point de terminaison Put qui ma permettre la modification d'un pokemon
app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonUpdated = { ...req.body, id: id }
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id? pokemonUpdated : pokemon
    })
    const message = `Le pokemon ${pokemonUpdated.name} a bien été modifié.`
    res.json(success(message, pokemonUpdated))
})

// Point de terminaison DELETE qui permettra de supprimer un pokemon
app.delete('/api/pokemons/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons.filter(pokemon => pokemon.id !== id)
    const message = `Le pokemon ${pokemonDeleted.name} a bien été supprimé.`
    res.json(success(message, pokemonDeleted))

})


app.listen(port, () => console.log(`Notre appliction est démarrée sur : http://localhost:${port}`))