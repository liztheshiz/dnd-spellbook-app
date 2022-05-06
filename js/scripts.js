// Initialize list of Pokemon
let pokemonList = [
	{name: 'Charizard', height: 1.7, types: ['fire', 'flying']},
	{name: 'Mankey', height: 0.5, types: ['fighting']},
	{name: 'Piloswine', height: 1.1, types: ['ice', 'ground']}
];

// Print list of Pokemon in pokemonList in pokemon-list
pokemonList.forEach(function(pokemon) {
	document.getElementById('pokemon-list').innerHTML += `${pokemon.name} (height: ${pokemon.height})`;
	if (pokemon.height >= 1.5) {
		document.getElementById('pokemon-list').innerHTML += ` - Wow, that's big!`;
	}
	document.getElementById('pokemon-list').innerHTML += '<br>';
});