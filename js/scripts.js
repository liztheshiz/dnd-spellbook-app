// Initialize list of spells + methods in IIFE
let spellsRepository = (function() {
	// >>VARIABLES<< //
	let spellsList = []; // Initialize spellsList
	let apiUrl = 'https://www.dnd5eapi.co/api/spells/';
	//let spellKeys = ['name', 'detailsUrl', 'imageUrl', 'height', 'types']; // Accepted list of keys in spell objects in spellsList
	let spellsGrid = document.querySelector('.spells-grid'); // Selects .spells-grid in DOM
	let loadingMessage = document.querySelector('.loading-message'); // Selects .loading-message in DOM
	let modalContainer = document.querySelector('#modal-container'); // Selects #modal-container in the DOM
	// VARIABLES<< //

	// Returns spellsList
	function getAll() {
		return spellsList;
	}

	// Adds new item to spellsList
	function add(item) {
		// Only adds an object
		if (typeof item === 'object') {//&& (Object.keys(item).every((element, i) => element === spellKeys[i]))) {
			spellsList.push(item);
		}
	}

	// Returns spell object with given name
	function findSpell(name) {
		// Create array of spells with given name
		let givenSpell = spellsList.filter(element => element.name === name);
		// Returns either single spell object, or array of objects if >1 spells with same name
		if (givenSpell.length === 1) {
			return givenSpell[0];
		} else if (givenSpell.length > 1) {
			return givenSpell;
		}
	}

	// Adds new spell to spells-grid
	function addListItem(spell) {
		let listItem = document.createElement('div');
		listItem.innerHTML = `${spell.name}<br>`;
		listItem.classList.add('list-item');

		let listImage = document.createElement('img');
		listImage.classList.add('list-item_image');
		loadDetails(spell).then(function () {
			listImage.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png';
		});
		listItem.appendChild(listImage);

		let buttonItem = document.createElement('button');
		buttonItem.classList.add('list-button');
		buttonItem.innerText = 'See Details';

		listItem.appendChild(buttonItem);
		spellsGrid.appendChild(listItem);

		buttonItem.addEventListener('click', () => showDetails(spell));
	}

	function loadingMessageHidden(hide) {
		if (hide) {
			loadingMessage.classList.add('hidden');
		} else {
			loadingMessage.classList.remove('hidden');
		}
	}

	// Loads initial list of spells from API with name and detailsUrl attributes
	function loadList() {
	    loadingMessageHidden(false);
	    return fetch(apiUrl).then(function (response) {
	      	loadingMessageHidden(true);
	      	return response.json();
	    }).then(function (json) {
	      	loadingMessageHidden(true);
	      	json.results.forEach(function (item) {
	        	let spell = {
		          	name: item.name,
		          	detailsUrl: `https://www.dnd5eapi.co${item.url}`
	        	};
	        	add(spell);
	      	});
	    }).catch(function (e) {
	      	loadingMessageHidden(true);
	      	console.error(e);
	    })
	}

	// Adds additional details to given spell object: image, height, and types
	function loadDetails(item) {
	    loadingMessageHidden(false);
	    let url = item.detailsUrl;
	    return fetch(url).then(function (response) {
	      	loadingMessageHidden(true);
	      	return response.json();
	    }).then(function (details) {
	      	// Now we add the details to the item
	      	item.description = details.desc;
	      	//item.higherLevel = details.hight_level;
	      	item.range = details.range;
	      	item.duration = details.duration;
	      	loadingMessageHidden(true);
	    }).catch(function (e) {
	      	loadingMessageHidden(true);
	      	console.error(e);
	    });
	}

	// Logs name of given spell in console
	function showDetails(spell) {
		loadDetails(spell).then(function () {
			showModal(spell);
		});
	}

	function showModal(spell) {
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
		titleElement.innerText = spell.name;

		let descriptionString = '';
		spell.description.forEach(function (paragraph, i) {
			if (i < spell.description.length - 1) {
				descriptionString += `${paragraph}<br><br>`
			} else {
				descriptionString += `${paragraph}`
			}
		});

		let contentElement = document.createElement('p');
		contentElement.innerHTML = `Description:  ${descriptionString}<br>Range: ${spell.range}<br>Duration: ${spell.duration}`;

		let imgElement = document.createElement('img');
		imgElement.src = spell.imageUrl;

		modal.appendChild(closeButtonElement);
		modal.appendChild(titleElement);
		modal.appendChild(contentElement);
		modal.appendChild(imgElement);
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

	return {getAll, add, findSpell, addListItem, loadList, loadDetails}
})();

// Prints list of spells in spellsList on screen as buttons
spellsRepository.loadList().then(function() {
	// Now the data is loaded!
	spellsRepository.getAll().forEach(spell => spellsRepository.addListItem(spell));
});