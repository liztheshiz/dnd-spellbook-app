// Initialize list of spells + methods in IIFE
let spellsRepository = (function() {
	// VARIABLES >>>
	let spellsList = []; // Initialize spellsList
	let apiUrl = 'https://www.dnd5eapi.co/api/spells/';
	// Accepted list of keys in spell objects in spellsList
	let spellKeys = ['index', 'name', 'detailsUrl', 'level', 'school', 'castingTime', 'range', 'duration', 'areaOfEffect', 'classes', 'description', 'higherLevel'];
	
	// DOM selectors
	let spellsGrid = document.querySelector('.spells-grid');
	let loadingMessage = document.querySelector('.loading-overlay');
	let searchInput = document.querySelector('.search-bar_input');
	let searchButton = document.querySelector('.search-bar_button');
	let modalContainer = document.querySelector('#modal-container');
	let modal = document.querySelector('#modal');
	let titleElement = document.querySelector('.modal_title');
	let levelElement = document.querySelector('.modal_subheading');
	let castingTimeElement = document.querySelector('.modal_info_casting-time');
	let rangeElement = document.querySelector('.modal_info_range');
	let durationElement = document.querySelector('.modal_info_duration');
	let areaOfEffectElement = document.querySelector('.modal_info_area-of-effect');
	let showMoreButton = document.querySelector('.show-more-button');
	let descriptionElement = document.querySelector('.modal_description-wrapper');
	let descriptionText = document.querySelector('.modal_description');
	let closeButtonElement = document.querySelector('.modal-close');
	// <<< VARIABLES



	// FUNCTIONS >>>
	// Hides loading message when param is true, otherwise makes it visible (used on initial load and when loading modal)
	function loadingMessageHidden(hide) {
		if (hide) {
			loadingMessage.classList.add('hidden');
		} else {
			loadingMessage.classList.remove('hidden');
		}
	}

	// Adds new item to spellsList (used in loadList)
	function add(item) {
		// Only adds an object with keys listed in spellKeys
		if (typeof item === 'object' && (Object.keys(item).every((element, i) => element === spellKeys[i]))) {
			spellsList.push(item);
		}
	}

	// Loads initial list of spells from API with index, name, and detailsUrl attributes
	function loadList() {
	    loadingMessageHidden(false);
	    return fetch(apiUrl).then(function (response) {
	      	return response.json();
	    }).then(function (json) {
	      	json.results.forEach(function (item) {
	        	let spell = {
		          	index: item.index,
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

	// Returns spellsList array
	function getAll() {
		return spellsList;
	}

	// Adds new spell to spells-grid
	function addGridItem(spell) {
		let gridItem = document.createElement('div');
		gridItem.classList.add('spells-grid_item');

		let gridItemTitle = document.createElement('h3');
		gridItemTitle.innerHTML = spell.name;
		gridItemTitle.classList.add('spells-grid_item_title');
		gridItem.appendChild(gridItemTitle);

		spellsGrid.appendChild(gridItem);

		gridItem.addEventListener('click', () => showDetails(spell));
	}

	// Shows details of given spell in modal
	function showDetails(spell) {
		loadingMessageHidden(false);
		loadDetails(spell).then(() => showModal(spell)).then(() => loadingMessageHidden(true));
	}

	// Adds additional details to given spell object (used in show details)
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

	// Shows modal with details of given spell
	function showModal(spell) {
		// Makes sure description is hidden when opening new modal
		descriptionElement.classList.add('hidden');
		showMoreButton.innerText = 'Show description';

		// Adds the new modal content to HTML elements selected in the DOM
		titleElement.innerText = spell.name;
		levelElement.innerHTML = `Level ${spell.level} ${spell.school.name}`;
		castingTimeElement.innerHTML = `<h5>Casting Time</h5><p>${spell.castingTime}</p>`;
		rangeElement.innerHTML = `<h5>Range</h5><p>${spell.range}</p>`;
		durationElement.innerHTML = `<h5>Duration</h5><p>${spell.duration}</p>`;
		
		// Special AOE case handler (no AOE attribute)
		areaOfEffectString = '<h5>Area of Effect</h5>';
		if (spell.areaOfEffect) {
			areaOfEffectString += `<p>${spell.areaOfEffect.size} ft ${spell.areaOfEffect.type}</p>`;
		} else {
			areaOfEffectString += '<p>none</p>';
		}
		areaOfEffectElement.innerHTML = areaOfEffectString;

		// Build description string from description array of paragraphs
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

	// Hides modal (called in event listeners)
	function hideModal() {
	  	modalContainer.classList.remove('is-visible');
	}

	// Returns spell object with given name (used in search bar)
	function findSpell(name) {
		// First normalize search input to match index formatting
		let formattedName = name.replace(/\s+/g, '-').toLowerCase();
		let givenSpell = spellsList.filter(element => element.index === formattedName);
		// Returns either single spell object, or null if no match
		if (givenSpell.length === 1) {
			return givenSpell[0];
		} else {
			return null;
		}
	}
	// <<< FUNCTIONS



	// EVENT LISTENERS >>>
	// Searchs list of spells for user's input and loads its details in the modal if found
	searchButton.addEventListener('click', (e) => {
		let searchValue = searchInput.value;
		let spell = findSpell(searchValue);

		if (spell) {
			showDetails(spell);
		} else {
			alert('Spell not found! Please check your... "spell"-ing.'); // Error message if spell not found
		}
	});

	// Hides modal when user hits escape
	window.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
			hideModal();
		}
	});

	// Hides modal when user clicks outside of modal window
	modalContainer.addEventListener('click', (e) => {
		let target = e.target;
		if (target === modalContainer) {
			hideModal();
		}
	});

	// Hides modal when user clicks close button
	closeButtonElement.addEventListener('click', hideModal);

	// Shows/hides more spell info if user clicks button
	showMoreButton.addEventListener('click', (e) => {
		descriptionElement.classList.toggle('hidden');
		if (descriptionElement.classList.contains('hidden')) {
			showMoreButton.innerText = 'Show description';
		} else {
			showMoreButton.innerText = 'Hide description';
		}
	});
	// <<< EVENT LISTENERS



	// Returns funcitons to be used outside IIFE
	return {loadingMessageHidden, loadList, getAll, addGridItem}
})();

// Prints grid of spells in spellsList on screen as buttons
spellsRepository.loadList().then(function() {
	spellsRepository.getAll().forEach(spell => spellsRepository.addGridItem(spell));
	spellsRepository.loadingMessageHidden(true);
});