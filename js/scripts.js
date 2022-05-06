// Initialize list of Pokemon + methods in IIFE
let pokemonRepository = (function() {
	let pokemonList = [
		{name: 'Charizard', height: 1.7, types: ['fire', 'flying']},
		{name: 'Mankey', height: 0.5, types: ['fighting']},
		{name: 'Piloswine', height: 1.1, types: ['ice', 'ground']}
	];

	function getAll() {
		return pokemonList;
	}

	function add(item){
		pokemonList.push(item);
	}

	return {add, getAll}
})();

// Print list of Pokemon in pokemonList in pokemon-list
pokemonRepository.getAll().forEach(function(pokemon) {
	document.getElementById('pokemon-list').innerHTML += `${pokemon.name} (height: ${pokemon.height})`;
	if (pokemon.height >= 1.5) {
		document.getElementById('pokemon-list').innerHTML += ` - Wow, that's big!`;
	}
	document.getElementById('pokemon-list').innerHTML += '<br>';
});