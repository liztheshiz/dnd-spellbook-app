// Initialize list of Pokemon + methods in IIFE
let pokemonRepository = (function() {
	// Initialize pokemonList
	let pokemonList = [
		{name: 'Charizard', height: 1.7, types: ['fire', 'flying']},
		{name: 'Mankey', height: 0.5, types: ['fighting']},
		{name: 'Piloswine', height: 1.1, types: ['ice', 'ground']}
	];
	// Accepted list of keys in Pokemon objects in pokemonList
	let pokemonKeys = ['name', 'height', 'types'];
	// Selects .pokemon-list in DOM
	let buttonList = document.querySelector('.pokemon-list');

	// Returns pokemonList
	function getAll() {
		return pokemonList;
	}

	// Adds new item to pokemonList
	function add(item) {
		// Only adds object types with keys found in pokemonKeys
		if ((typeof item === 'object') && (Object.keys(item).every((element, i) => element === pokemonKeys[i]))) {
			pokemonList.push(item);
		}
	}

	// Returns Pokemon object with given name
	function findPokemon(name) {
		// Create array of Pokemon with given name
		let givenPokemon = pokemonList.filter(element => element.name === name);
		// Returns either single Pokemon object, or array of objects if >1 Pokemon with same name
		if (givenPokemon.length === 1) {
			return givenPokemon[0];
		} else if (givenPokemon.length > 1) {
			return givenPokemon;
		}
	}

	// Logs name of given Pokemon in console
	function showDetails(pokemon) {
		console.log(pokemon.name);
	}

	// Adds event listener to given object that logs name of given Pokemon using showDetails
	function addListener(button, pokemon) {
		button.addEventListener('click', () => showDetails(pokemon));
	}

	// Adds new Pokemon button to pokemon-list
	function addListItem(pokemon) {
		let listItem = document.createElement('li');

		let buttonItem = document.createElement('button');
		buttonItem.innerText = pokemon.name;
		buttonItem.classList.add('list-button');

		listItem.appendChild(buttonItem);
		buttonList.appendChild(listItem);

		addListener(buttonItem, pokemon);
	}

	return {getAll, add, findPokemon, addListItem}
})();

// Print list of Pokemon in pokemonList on screen as buttons
pokemonRepository.getAll().forEach(pokemon => pokemonRepository.addListItem(pokemon));