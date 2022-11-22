exports.success = (message, data) => {
    return{ message, data }
}

exports.getUniqueId = (pokemon) =>{
    const pokemonsIds = pokemons.map(pokemon > pokemon.id)
    const maxId = pokemonIds.reduce((a,b) => Math.max(a, b))
    const uniqueId = maxId

    return uniqueId
}