// Initialize list of Pokemon + methods in IIFE
let pokemonRepository = (function() {
	// >>VARIABLES<< //
	let pokemonList = []; // Initialize pokemonList
	let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
	let pokemonKeys = ['name', 'detailsUrl', 'imageUrl', 'height', 'types']; // Accepted list of keys in Pokemon objects in pokemonList
	let buttonList = document.querySelector('.list-group'); // Selects .pokemon-list in DOM
	let loadingMessage = document.querySelector('.loading-message'); // Selects .loading-message in DOM
	let modalContainer = document.querySelector('#modal-container'); // Selects #modal-container in the DOM
	let titleElement = document.querySelector('.modal-title'); // Selects .modal-title in the DOM
	let contentElement = document.querySelector('.modal-body'); // Selects .modal-body in the DOM
	let imgElement = document.querySelector('.modal-image'); // Selects .modal-image in the DOM
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
		let listItem = document.createElement('div');
		listItem.innerHTML = `${pokemon.name}<br>`;
		listItem.classList.add('list-group-item', 'list-group-item-active', 'list-item', 'text-center');

		let listImage = document.createElement('img');
		listImage.classList.add('list-item_image');
		loadDetails(pokemon).then(function () {
			listImage.src = pokemon.imageUrl;
		});
		listItem.appendChild(listImage);

		let buttonItem = document.createElement('button');
		buttonItem.classList.add('list-button');
		buttonItem.setAttribute('data-target', '#modal-container');
		buttonItem.setAttribute('data-toggle', 'modal');
		let icon = document.createElement('img');
		icon.classList.add('list-button_icon');
		icon.src = 'img/menu-icon.png';
		buttonItem.appendChild(icon);

		listItem.appendChild(buttonItem);
		buttonList.appendChild(listItem);

		buttonItem.addEventListener('click', () => showDetails(pokemon));
	}

	function loadingMessageHidden(hide) {
		if (hide) {
			loadingMessage.classList.replace('d-block', 'd-none');
		} else {
			loadingMessage.classList.replace('d-none', 'd-block');
		}
	}

	// Logs name of given Pokemon in console
	function showDetails(pokemon) {
		loadDetails(pokemon).then(function () {
			showModal(pokemon);
		});
	}

	// Loads initial list of Pokemon from API with name and detailsURL attributes
	function loadList() {
	    loadingMessageHidden(false);
	    return fetch(apiUrl).then(function (response) {
	      	loadingMessageHidden(true);
	      	return response.json();
	    }).then(function (json) {
	      	loadingMessageHidden(true);
	      	json.results.forEach(function (item) {
	        	let pokemon = {
		          	name: item.name,
		          	detailsUrl: item.url
	        	};
	        	add(pokemon);
	      	});
	    }).catch(function (e) {
	      	loadingMessageHidden(true);
	      	console.error(e);
	    })
	}

	// Adds additional details to given Pokemon object: image, height, and types
	function loadDetails(item) {
	    loadingMessageHidden(false);
	    let url = item.detailsUrl;
	    return fetch(url).then(function (response) {
	      	loadingMessageHidden(true);
	      	return response.json();
	    }).then(function (details) {
	      	// Now we add the details to the item
	      	item.imageUrl = details.sprites.front_default;
	      	item.height = details.height;
	      	item.types = details.types;
	      	loadingMessageHidden(true);
	    }).catch(function (e) {
	      	loadingMessageHidden(true);
	      	console.error(e);
	    });
	}

	function showModal(pokemon) {
		// Clears all existing modal content
		titleElement.innerHTML = '';
		contentElement.innerHTML = '';

		// Adds the new modal content
		titleElement.innerText = pokemon.name;

		let typesString = '';
		pokemon.types.forEach(function (type, i) {
			if (i < pokemon.types.length - 1) {
				typesString += `${type.type.name}, `
			} else {
				typesString += `${type.type.name}`
			}
		});

		contentElement.innerHTML = `Height: ${pokemon.height}<br>Types: ${typesString}<br>`;

		imgElement.src = pokemon.imageUrl;
		contentElement.appendChild(imgElement);
	}

	return {getAll, add, findPokemon, addListItem, loadList, loadDetails}
})();

// Prints list of Pokemon in pokemonList on screen as buttons
pokemonRepository.loadList().then(function() {
	// Now the data is loaded!
	pokemonRepository.getAll().forEach(pokemon => pokemonRepository.addListItem(pokemon));
});