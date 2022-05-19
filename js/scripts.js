// Initialize list of spells + methods in IIFE
let spellsRepository = (function() {
	// >>VARIABLES<< //
	let spellsList = []; // Initialize spellsList
	let apiUrl = 'https://www.dnd5eapi.co/api/spells/';
	let spellKeys = ['name', 'detailsUrl', 'level', 'school', 'castingTime', 'range', 'duration', 'areaOfEffect', 'classes', 'description', 'higherLevel']; // Accepted list of keys in spell objects in spellsList
	let spellsGrid = document.querySelector('.spells-grid'); // Selects .spells-grid in DOM
	let loadingMessage = document.querySelector('.overlay'); // Selects .loading-message in DOM
	let modalContainer = document.querySelector('#modal-container'); // Selects #modal-container in the DOM

	let showMoreButton = document.querySelector('.show-more-button');
	let descriptionElement = document.querySelector('.modal_description_wrapper');
	let descriptionText = document.querySelector('.modal_description');
	showMoreButton.addEventListener('click', function() {
		descriptionElement.classList.toggle('hidden');
		if (descriptionElement.classList.contains('hidden')) {
			showMoreButton.innerText = 'Show description';
		} else {
			showMoreButton.innerText = 'Hide description';
		}
	});

	let modal = document.querySelector('#modal');
	// VARIABLES<< //

	// Returns spellsList
	function getAll() {
		return spellsList;
	}

	// Adds new item to spellsList
	function add(item) {
		// Only adds an object
		if (typeof item === 'object' && (Object.keys(item).every((element, i) => element === spellKeys[i]))) {
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
/*		let listImage = document.createElement('img');
		listImage.classList.add('list-item_image');
		loadDetails(spell).then(function () {
			listImage.src = `img/schools/${spell.school.index}.png`;
		});
		imageWrapper.appendChild(listImage);
		listItem.appendChild(imageWrapper);
*/
		spellsGrid.appendChild(listItem);

		listItem.addEventListener('click', () => showDetails(spell));
	}

	function showDetails(spell) {
		loadingMessageHidden(false);
		loadDetails(spell).then(() => showModal(spell)).then(() => loadingMessageHidden(true));
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
	      	return response.json();
	    }).then(function (json) {
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

	// Adds additional details to given spell object
	function loadDetails(item) {
	    let url = item.detailsUrl;
	    return fetch(url).then(function (response) {
	      	return response.json();
	    }).then(function (details) {
	      	// Now we add the details to the item
	      	item.level = details.level;
	      	item.school = details.school;
	      	item.castingTime = details.casting_time;
	      	item.range = details.range;
	      	item.duration = details.duration;
	      	item.areaOfEffect = details.area_of_effect;
	      	item.classes = details.classes;
	      	item.description = details.desc;
	      	item.higherLevel = details.higher_level;
	    }).catch(function (e) {
	      	console.error(e);
	    });
	}

	function showModal(spell) {
		// Makes sure description is hidden when opening new modal
		descriptionElement.classList.add('hidden');
		showMoreButton.innerText = 'Show description';

		// Adds the new modal content
		let closeButtonElement = document.querySelector('.modal-close');
		closeButtonElement.addEventListener('click', hideModal);

		let titleElement = document.querySelector('.modal_title');
		titleElement.innerText = spell.name;

		let levelElement = document.querySelector('.modal_subheading');
		levelElement.innerHTML = `Level ${spell.level} ${spell.school.name}`;

		let castingTimeElement = document.querySelector('.modal_info_casting-time');
		castingTimeElement.innerHTML = `<h5>Casting Time</h5><p>${spell.castingTime}</p>`;

		let rangeElement = document.querySelector('.modal_info_range');
		rangeElement.innerHTML = `<h5>Range</h5><p>${spell.range}</p>`;

		let durationElement = document.querySelector('.modal_info_duration');
		durationElement.innerHTML = `<h5>Duration</h5><p>${spell.duration}</p>`;

		let areaOfEffectElement = document.querySelector('.modal_info_area-of-effect');
		areaOfEffectString = '<h5>Area of Effect</h5>';
		if (spell.areaOfEffect) {
			areaOfEffectString += `<p>${spell.areaOfEffect.size} ft ${spell.areaOfEffect.type}</p>`;
		} else {
			areaOfEffectString += '<p>none</p>';
		}
		areaOfEffectElement.innerHTML = areaOfEffectString;

		//let imgElement = document.querySelector('.modal_img');
		//imgElement.src = spell.imageUrl;

		let descriptionString = '';
		spell.description.forEach(function (paragraph, i) {
			if ((i === spell.description.length - 1) || (spell.description.length === 1)){
				descriptionString += `${paragraph}`
			} else {
				descriptionString += `${paragraph}<br><br>`
			}
		});

		descriptionText.innerHTML = `Description:  ${descriptionString}`;

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

	return {getAll, add, findSpell, addListItem, loadList, loadDetails, loadingMessageHidden}
})();

// Prints list of spells in spellsList on screen as buttons
spellsRepository.loadList().then(function() {
	// Now the data is loaded!
	spellsRepository.getAll().forEach(spell => spellsRepository.addListItem(spell));
	spellsRepository.loadingMessageHidden(true);
});