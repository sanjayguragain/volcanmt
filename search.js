/**
 * Site Search Functionality for Volcan Mountain Foundation
 * Dynamically injects a search button into the header and a modal into the body.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Search Index defined statically
  const searchIndex = [
    { title: "Home", url: "index.html", keywords: "home volcan mountain foundation julian conservation preservation start main" },
    { title: "Who We Are - Mission & History", url: "who-we-are.html", keywords: "about mission board leadership staff natural history geology water plants animals iipay kumeyaay naming earthquake" },
    { title: "What We Do - Conservation & Education", url: "what-we-do.html", keywords: "conservation preservation wildlife badger oak borer gsob art gateway habitat restoration stewardship" },
    { title: "Get Involved - Volunteer & Events", url: "get-involved.html", keywords: "volunteer hike events membership sustaining friends shop nature center help" },
    { title: "Education Programs", url: "education.html", keywords: "youth children school field trip wildcrafting curriculum grades kids watershed explorers" },
    { title: "Donate & Support", url: "donate.html", keywords: "give money support planned giving five oaks circle sustaining friends impact gift" },
    { title: "Contact Us", url: "contact.html", keywords: "email phone address location message reach" },
    
    // Deep dives
    { title: "Badger Research", url: "what-we-do.html#wildlife", keywords: "badger wildlife research dogs canine ecology" },
    { title: "Goldspotted Oak Borer (GSOB)", url: "what-we-do.html#wildlife", keywords: "gsob oak borer dead trees beetle invasive pests" },
    { title: "Plant Nerds - Rare Plants", url: "what-we-do.html#wildlife", keywords: "rare plant survey flora botany flowers" },
    { title: "Art History on Volcan Mountain", url: "what-we-do.html#art", keywords: "art history hubbell gateway mirko frog sculpture resident" },
    { title: "Geology of Volcan Mountain", url: "who-we-are.html#natural-history", keywords: "geology rocks earthquakes elsinore fault tectonic mesozoic" },
    { title: "Watersheds", url: "who-we-are.html#natural-history", keywords: "watershed rain springs san felipe creek dieguito luis rey" },
    { title: "Human History & Naming", url: "who-we-are.html#natural-history", keywords: "iipay kumeyaay native american stokes balcon name origin" },
    { title: "Sky Island Trail & Nature Center", url: "who-we-are.html#sky-island", keywords: "trail hike viewscope binoculars nature center" },
    { title: "Wildlife Imaging Team (WIT)", url: "get-involved.html#volunteer", keywords: "wit wildlife camera trap volunteers animals" },
    { title: "Preservation Projects & Accomplishments", url: "what-we-do.html#conservation", keywords: "preservation land acquisition hunter camp acreage" }
  ];

  // 2. Inject Modal HTML
  const modalHTML = `
    <div id="vmf-search-modal" class="search-modal" aria-hidden="true" role="dialog">
      <div class="search-modal-backdrop" id="search-close-backdrop"></div>
      <div class="search-modal-content">
        <div class="search-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="vmf-search-input" placeholder="Search Volcan Mountain..." autocomplete="off">
          <button id="search-close-btn" aria-label="Close Search">✕</button>
        </div>
        <div class="search-results-container">
          <ul id="vmf-search-results"></ul>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // 3. Inject Search Button into Navigation
  const navContainer = document.querySelector('.nav-container');
  if (navContainer) {
    const searchBtn = document.createElement('button');
    searchBtn.className = 'nav-search-btn';
    searchBtn.setAttribute('aria-label', 'Open Search');
    searchBtn.setAttribute('title', 'Search Site');
    searchBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
    
    // Create a container to hold desktop nav + search button to keep layout clean
    const navList = navContainer.querySelector('.nav-links');
    if (navList) {
      // Create wrapper
      const navActionsWrapper = document.createElement('div');
      navActionsWrapper.className = 'nav-actions-wrapper';
      navActionsWrapper.style.display = 'flex';
      navActionsWrapper.style.alignItems = 'center';
      navActionsWrapper.style.marginLeft = 'auto'; // push to the right
      
      // Move nav-list inside wrapper, then add search button!
      navContainer.insertBefore(navActionsWrapper, navList);
      navActionsWrapper.appendChild(navList);
      navActionsWrapper.appendChild(searchBtn);
    } else {
      // Fallback
      navContainer.appendChild(searchBtn);
    }
  }

  // 4. State & Elements
  const modal = document.getElementById('vmf-search-modal');
  const input = document.getElementById('vmf-search-input');
  const resultsContainer = document.getElementById('vmf-search-results');
  const searchButtons = document.querySelectorAll('.nav-search-btn, a[href="#search"]');
  const closeBtn = document.getElementById('search-close-btn');
  const backdrop = document.getElementById('search-close-backdrop');

  // 5. Functions
  function openSearch(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      input.focus();
    }, 50);
    renderResults('');
  }

  function closeSearch(e) {
    if (e && e.target && e.target.closest && e.target.closest('.search-modal-content') && e.target.id !== 'search-close-btn') {
      // clicked inside the content but not on close btn
      return; 
    }
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    input.value = '';
    renderResults('');
  }

  function performSearch(query) {
    query = query.toLowerCase().trim();
    if (!query) {
      renderResults([]);
      return;
    }

    const results = searchIndex.filter(item => {
      return item.title.toLowerCase().includes(query) || item.keywords.toLowerCase().includes(query);
    });
    renderResults(results, query);
  }

  function renderResults(results, query) {
    resultsContainer.innerHTML = '';
    
    if (results.length === 0 && input.value.trim() !== '') {
      resultsContainer.innerHTML = '<li class="no-results">No results found for "' + query + '"</li>';
      return;
    }

    if (results.length === 0) return; // Empty query state

    results.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${item.url}" class="search-result-item">
                        <span class="search-result-title">${item.title}</span>
                      </a>`;
      li.querySelector('a').addEventListener('click', () => {
        closeSearch();
      });
      resultsContainer.appendChild(li);
    });
  }

  // 6. Event Listeners
  searchButtons.forEach(btn => btn.addEventListener('click', openSearch));
  closeBtn.addEventListener('click', closeSearch);
  backdrop.addEventListener('click', closeSearch);
  
  input.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeSearch();
    }
  });
});
