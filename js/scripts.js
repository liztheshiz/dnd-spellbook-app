// Initialize list of Pokemon + methods in IIFE
let pokemonRepository = (function() {
	let pokemonList = [
		{name: 'Charizard', height: 1.7, types: ['fire', 'flying']},
		{name: 'Mankey', height: 0.5, types: ['fighting']},
		{name: 'Piloswine', height: 1.1, types: ['ice', 'ground']}
	];
	let pokemonKeys = ['name', 'height', 'types'];

	// Returns pokemonList
	function getAll() {
		return pokemonList;
	}

	// Adds new item to pokemonList
	function add(item){
		// Only adds object types with keys found in pokemonKeys
		if ((typeof item === 'object') && (Object.keys(item).every((element, i) => element === pokemonKeys[i]))) {
			pokemonList.push(item);
		}
	}

	// Returns Pokemon object with given name
	function findPokemon(name) {
		let givenPokemon = pokemonList.filter(element => element.name === name);
		// Returns either single Pokemon object, or array of objects if >1 Pokemon with same name
		if (givenPokemon.length === 1) {
			return givenPokemon[0];
		} else if (givenPokemon.length > 1) {
			return givenPokemon;
		}
	}

	return {add, getAll, findPokemon}
})();

// Print list of Pokemon in pokemonList on on screen in pokemon-list
pokemonRepository.getAll().forEach(function(pokemon) {
	document.querySelector('#pokemon-list').innerHTML += `${pokemon.name} (height: ${pokemon.height})`;
	if (pokemon.height >= 1.5) {
		document.querySelector('#pokemon-list').innerHTML += ` - Wow, that's big!`;
	}
	document.querySelector('#pokemon-list').innerHTML += '<br>';
});