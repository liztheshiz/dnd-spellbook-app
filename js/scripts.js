// Initialize list of spells + methods in IIFE
let spellsRepository = (function() {
	// >>VARIABLES<< //
	let spellsList = []; // Initialize spellsList
	let apiUrl = 'https://www.dnd5eapi.co/api/spells/';
	//let spellKeys = ['name', 'detailsUrl', 'imageUrl', 'height', 'types']; // Accepted list of keys in spell objects in spellsList
	let spellsGrid = document.querySelector('.spells-grid'); // Selects .spells-grid in DOM
	let loadingMessage = document.querySelector('.loading-message'); // Selects .loading-message in DOM
	let modalContainer = document.querySelector('#modal-container'); // Selects #modal-container in the DOM
	let modal = document.querySelector('#modal');
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
		listItem.classList.add('list-item');

		let gridItemTitle = document.createElement('h3');
		gridItemTitle.innerHTML = spell.name;
		gridItemTitle.classList.add('spells-grid_item_title');
		listItem.appendChild(gridItemTitle);

		let imageWrapper = document.createElement('div');
		imageWrapper.classList.add('list-image-wrapper');
		let listImage = document.createElement('img');
		listImage.classList.add('list-item_image');
		loadDetails(spell).then(function () {
			listImage.src = `img/schools/${spell.school.index}.png`;
		});
		imageWrapper.appendChild(listImage);
		listItem.appendChild(imageWrapper);

		spellsGrid.appendChild(listItem);

		listItem.addEventListener('click', () => showDetails(spell));
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
	      	item.range = details.range;
	      	item.duration = details.duration;
	      	item.level = details.level;
	      	item.castingTime = details.casting_time;
	      	item.school = details.school;
	      	item.classes = details.classes;
	      	item.areaOfEffect = details.area_of_effect;
	      	item.description = details.desc;
	      	item.higherLevel = details.higher_level;
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
		// Adds the new modal content
		let closeButtonElement = document.querySelector('.modal-close');
		closeButtonElement.addEventListener('click', hideModal);

		let titleElement = document.querySelector('.modal_title');
		titleElement.innerText = spell.name;

		let descriptionString = '';
		spell.description.forEach(function (paragraph, i) {
			if (i < spell.description.length - 1) {
				descriptionString += `${paragraph}<br><br>`
			} else {
				descriptionString += `${paragraph}`
			}
		});

		let levelElement = document.querySelector('.modal_level');
		levelElement.innerHTML = `Level: ${spell.level}`;

		let schoolElement = document.querySelector('.modal_school');
		schoolElement.innerHTML = `School: ${spell.school.name}`;

		let rangeElement = document.querySelector('.modal_range');
		rangeElement.innerHTML = `Range: ${spell.range}`;

		let durationElement = document.querySelector('.modal_duration');
		durationElement.innerHTML = `Duration: ${spell.duration}`;

		let castingTimeElement = document.querySelector('.modal_casting-time');
		castingTimeElement.innerHTML = `Casting Time: ${spell.castingTime}`;

		//let imgElement = document.querySelector('.modal_img');
		//imgElement.src = spell.imageUrl;

		let descriptionElement = document.querySelector('.modal_description');
		descriptionElement.innerHTML = `Description:  ${descriptionString}`;

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