// Initialize list of Pokemon + methods in IIFE
let pokemonRepository = (function() {
	// >>VARIABLES //
	let pokemonList = []; // Initialize pokemonList
	let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
	let pokemonKeys = ['name', 'height', 'types']; // Accepted list of keys in Pokemon objects in pokemonList
	let buttonList = document.querySelector('.pokemon-list'); // Selects .pokemon-list in DOM
	// VARIABLES<< //

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

	function loadList() {
	    return fetch(apiUrl).then(function (response) {
	      	return response.json();
	    }).then(function (json) {
	      	json.results.forEach(function (item) {
	        	let pokemon = {
	          	name: item.name,
	          	detailsUrl: item.url
	        	};
	        	add(pokemon);
	      	});
	    }).catch(function (e) {
	      	console.error(e);
	    })
	}

	function loadDetails(item) {
	    let url = item.detailsUrl;
	    return fetch(url).then(function (response) {
	      	return response.json();
	    }).then(function (details) {
	      	// Now we add the details to the item
	      	item.imageUrl = details.sprites.front_default;
	      	item.height = details.height;
	      	item.types = details.types;
	    }).catch(function (e) {
	      	console.error(e);
	    });
	}

	// Logs name of given Pokemon in console
	function showDetails(pokemon) {
		loadDetails(pokemon).then(() => console.log(pokemon));
	}

	// Adds event listener to given object that logs name of given Pokemon using showDetails
	function addListener(button, pokemon) {
		button.addEventListener('click', () => showDetails(pokemon));
	}

	return {getAll, add, findPokemon, addListItem, loadList, loadDetails}
})();

// Print list of Pokemon in pokemonList on screen as buttons
//pokemonRepository.getAll().forEach(pokemon => pokemonRepository.addListItem(pokemon));

pokemonRepository.loadList().then(function() {
	// Now the data is loaded!
	pokemonRepository.getAll().forEach(pokemon => pokemonRepository.addListItem(pokemon));
});