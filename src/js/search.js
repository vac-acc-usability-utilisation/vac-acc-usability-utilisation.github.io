export async function initSearch() {
    // Load the index data
    const response = await fetch('src/lunr/en.json');
    const documents = await response.json();

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

    searchInput.addEventListener('input', function (e) {
        const query = e.target.value.trim();
        if (!query) {
            resultsDiv.innerHTML = '<h2 class="font-body">Recent searches</h2>';
            return;
        }
        const results = idx.search(query);
        if (results.length === 0) {
            resultsDiv.innerHTML = `<p>No results found for “${query}”.</p>`;
            return;
        }
        resultsDiv.innerHTML = `<div class="search-summary bottom-margin">Showing ${results.length} result${results.length !== 1 ? 's' : ''} for “${query}”</div>` +
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
    });
}