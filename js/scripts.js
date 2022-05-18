// Initialize list of Pokemon + methods in IIFE
let pokemonRepository = (function() {
	// >>VARIABLES<< //
	let pokemonList = []; // Initialize pokemonList
	let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
	let pokemonKeys = ['name', 'detailsUrl', 'imageUrl', 'height', 'types']; // Accepted list of keys in Pokemon objects in pokemonList
	let buttonList = document.querySelector('.pokemon-list'); // Selects .pokemon-list in DOM
	let loadingMessage = document.querySelector('.loading-message'); // Selects .loading-message in DOM
	let modalContainer = document.querySelector('#modal-container'); // Selects #modal-container in the DOM
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
		listItem.innerHTML = `${pokemon.name}<br>`;
		listItem.classList.add('list-item');

		let listImage = document.createElement('img');
		listImage.classList.add('list-item_image');
		loadDetails(pokemon).then(function () {
			listImage.src = pokemon.imageUrl;
		});
		listItem.appendChild(listImage);

		let buttonItem = document.createElement('button');
		buttonItem.classList.add('list-button');

		let icon = document.createElement('img');
		icon.classList.add('list-button_icon');
		icon.src = 'img/button-icon.png';
		buttonItem.appendChild(icon);

		listItem.appendChild(buttonItem);
		buttonList.appendChild(listItem);

		buttonItem.addEventListener('click', () => showDetails(pokemon));
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
	      	// Now we add the details to the item
	      	item.imageUrl = details.sprites.front_default;
	      	item.imageUrlBack = details.sprites.back_default;
	      	item.height = details.height;
	      	item.types = details.types;
	      	loadingMessageHidden(true);
	    }).catch(function (e) {
	      	loadingMessageHidden(true);
	      	console.error(e);
	    });
	}

	// Logs name of given Pokemon in console
	function showDetails(pokemon) {
		loadDetails(pokemon).then(function () {
			showModal(pokemon);
		});
	}

	function showModal(pokemon) {
		// Clears all existing modal content
		modalContainer.innerHTML = '';

		let modal = document.createElement('div');
		modal.classList.add('modal');

		// Adds the new modal content
		let closeButtonElement = document.createElement('button');
		closeButtonElement.classList.add('modal-close');
		closeButtonElement.innerText = 'Close';
		closeButtonElement.addEventListener('click', hideModal);

		let titleElement = document.createElement('h2');
		titleElement.innerText = pokemon.name;

		let typesString = '';
		pokemon.types.forEach(function (type, i) {
			if (i < pokemon.types.length - 1) {
				typesString += `${type.type.name}, `
			} else {
				typesString += `${type.type.name}`
			}
		});

		let contentElement = document.createElement('p');
		contentElement.innerHTML = `Height: ${pokemon.height}<br>Types: ${typesString}`;

		let imgElement = document.createElement('img');
		imgElement.src = pokemon.imageUrl;

		let imgElementBack = document.createElement('img');
		imgElementBack.src = pokemon.imageUrlBack;

		modal.appendChild(closeButtonElement);
		modal.appendChild(titleElement);
		modal.appendChild(contentElement);
		modal.appendChild(imgElement);
		modal.appendChild(imgElementBack);
		modalContainer.appendChild(modal);

		modalContainer.classList.add('is-visible');
	}

	function hideModal() {
	  	modalContainer.classList.remove('is-visible');
	}

	window.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
			hideModal();
		}
	});

	modalContainer.addEventListener('click', (e) => {
		let target = e.target;
		if (target === modalContainer) {
			hideModal();
		}
	});

	return {getAll, add, findPokemon, addListItem, loadList, loadDetails}
})();

// Prints list of Pokemon in pokemonList on screen as buttons
pokemonRepository.loadList().then(function() {
	// Now the data is loaded!
	pokemonRepository.getAll().forEach(pokemon => pokemonRepository.addListItem(pokemon));
});