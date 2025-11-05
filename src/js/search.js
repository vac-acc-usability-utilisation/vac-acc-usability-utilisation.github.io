import { fetchWithCache, debounce } from './utils.js';

export async function initSearch() {
    // Load the index data (cached)
    let documentsText;
    try {
        documentsText = await fetchWithCache('src/lunr/en.json');
    } catch (err) {
        console.error('Could not load search index', err);
        return;
    }
    const documents = JSON.parse(documentsText);

    // Build the Lunr index
    const idx = lunr(function () {
        this.ref('id');
        this.field('title');
        this.field('body');
        this.field('keywords');
        documents.forEach(function (doc) {
            this.add(doc);
        }, this);
    });

    // Wire up the search input
    const searchInput = document.getElementById('search');
    const resultsDiv = document.querySelector('.search-results');
    if (!searchInput || !resultsDiv) return;

    const doSearch = (query) => {
        const q = query.trim();
        if (!q) {
            resultsDiv.innerHTML = '<h2 class="font-body">Recent searches</h2>';
            return;
        }
        let results = [];
        try { results = idx.search(q); } catch (e) { results = []; }

        if (results.length === 0) {
            resultsDiv.innerHTML = `<p>No results found for “${q}”.</p>`;
            return;
        }
        resultsDiv.innerHTML = `<div class="search-summary bottom-margin">Showing ${results.length} result${results.length !== 1 ? 's' : ''} for “${q}”</div>` +
            results.map(r => {
                const doc = documents.find(d => d.id === r.ref);
                return `<div class="search-result grid">
                    <a href="${doc.url}" class="card sm12 md12 lg4 xl4 xxl4">
                    <article class="round wave">
                    <h3 class="font-title">${doc.title}</h3>
                    <p>${doc.body}</p>
                    </article>
                    </a>
                </div>`;
            }).join('');
    };

    // debounce input handler
    searchInput.addEventListener('input', debounce((e) => doSearch(e.target.value), 240));
}