// Initialize list of Pokemon + methods in IIFE
let pokemonRepository = (function() {
	// >>VARIABLES //
	let pokemonList = []; // Initialize pokemonList
	let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
	let pokemonKeys = ['name', 'detailsUrl', 'imageUrl', 'height', 'types']; // Accepted list of keys in Pokemon objects in pokemonList
	let buttonList = document.querySelector('.pokemon-list'); // Selects .pokemon-list in DOM
	let loadingMessage = document.querySelector('.loading-message'); // Selects .loading-message in DOM
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

	function loadingMessageHidden(hide) {
		if (hide) {
			loadingMessage.classList.add('hidden');
		} else {
			loadingMessage.classList.remove('hidden');
		}
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
	      	loadingMessageHidden(true);
	      	// Now we add the details to the item
	      	item.imageUrl = details.sprites.front_default;
	      	item.height = details.height;
	      	item.types = details.types;
	    }).catch(function (e) {
	      	loadingMessageHidden(true);
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

// Prints list of Pokemon in pokemonList on screen as buttons
pokemonRepository.loadList().then(function() {
	// Now the data is loaded!
	pokemonRepository.getAll().forEach(pokemon => pokemonRepository.addListItem(pokemon));
});

function showModal(title, text) {
  let modalContainer = document.querySelector('#modal-container');

  // Clears all existing modal content
  modalContainer.innerHTML = '';

  let modal = document.createElement('div');
  modal.classList.add('modal');

  // Adds the new modal content
  let closeButtonElement = document.createElement('button');
  closeButtonElement.classList.add('modal-close');
  closeButtonElement.innerText = 'Close';

  let titleElement = document.createElement('h1');
  titleElement.innerText = title;

  let contentElement = document.createElement('p');
  contentElement.innerText = text;

  modal.appendChild(closeButtonElement);
  modal.appendChild(titleElement);
  modal.appendChild(contentElement);
  modalContainer.appendChild(modal);

  modalContainer.classList.add('is-visible');
}

document.querySelector('#show-modal').addEventListener('click', () => {
  showModal('Modal title', 'This is the modal content');
});