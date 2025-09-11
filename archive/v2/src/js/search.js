let idx;
let pages = [];

export function loadIndex() {
    return fetch('/src/content/pages/en/typography.json')
        .then(response => response.json())
        .then(data => {
            pages = data.sections.map((section, i) => ({
                id: `${data.id}-${i}`,
                title: section.heading,
                body: `${data.lead} ${section.body}`, 
                pageId: data.id
            }));

            idx = lunr(function () {
                this.ref('id');
                this.field('title');
                this.field('body');
                pages.forEach(doc => this.add(doc));
            });

            console.log("Lunr index built!");
        })
        .catch(err => console.error("Error building search index:", err));
}
export function search(query) {
    if (!idx) {
        console.warn("Search index not loaded yet");
        return [];
    }

    const results = idx.search(query);
    return results.map(result => {
        const match = pages.find(p => p.id === result.ref);
        return {
            title: match.title,
            body: match.body,
            pageId: match.pageId
        };
    });
}
