export function setupTableInteractions() {
    let selectedCount = 0;
    let lastSelectedRow = null;
    let lastSelectedArticle = null;

    function updateSelectedCount() {
        selectedCount = document.querySelectorAll('table.selectable-rows > tbody > tr.active, .selectable-grid > article.active').length;
        // Update the UI element showing the number of selected rows
        document.querySelectorAll('.numberRowsSelected').forEach(span => {
            span.textContent = selectedCount;
        });

        // Show/hide filter and controls rows based on selection
        document.querySelectorAll('.table-filters').forEach(row => {
            row.style.display = selectedCount > 0 ? 'none' : '';
        });
        document.querySelectorAll('.table-controls').forEach(row => {
            row.classList.toggle('hide', selectedCount === 0);
        });

        console.log('Selected rows/items:', selectedCount);
    }

    // Table row selection
    document.querySelectorAll('table.selectable-rows > tbody').forEach(tbody => {
        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.forEach((row, idx) => {
            row.addEventListener('click', function (e) {
                const table = row.closest('table');
                if (e.shiftKey && lastSelectedRow && table.contains(lastSelectedRow)) {
                    // Select range
                    const lastIdx = rows.indexOf(lastSelectedRow);
                    const [start, end] = [lastIdx, idx].sort((a, b) => a - b);
                    rows.slice(start, end + 1).forEach(r => r.classList.add('active'));
                } else if (e.ctrlKey || e.metaKey) {
                    // Toggle selection for this row
                    row.classList.toggle('active');
                    lastSelectedRow = row;
                } else {
                    // Remove 'active' from all rows in this table, then add to this row
                    rows.forEach(r => r.classList.remove('active'));
                    row.classList.add('active');
                    lastSelectedRow = row;
                }
                updateSelectedCount();
                e.stopPropagation();
            });
        });
    });

    // Article selection in grid
    document.querySelectorAll('.selectable-grid').forEach(grid => {
        const articles = Array.from(grid.querySelectorAll('article'));
        articles.forEach((article, idx) => {
            article.addEventListener('click', function (e) {
                if (e.shiftKey && lastSelectedArticle && grid.contains(lastSelectedArticle)) {
                    // Select range
                    const lastIdx = articles.indexOf(lastSelectedArticle);
                    const [start, end] = [lastIdx, idx].sort((a, b) => a - b);
                    articles.slice(start, end + 1).forEach(a => a.classList.add('active'));
                } else if (e.ctrlKey || e.metaKey) {
                    // Toggle selection for this article
                    article.classList.toggle('active');
                    lastSelectedArticle = article;
                } else {
                    // Remove 'active' from all articles in this grid, then add to this article
                    articles.forEach(a => a.classList.remove('active'));
                    article.classList.add('active');
                    lastSelectedArticle = article;
                }
                updateSelectedCount();
                e.stopPropagation();
            });
        });
    });

    // Remove 'active' if clicking outside any selectable row or article
    document.addEventListener('click', function (e) {
        document.querySelectorAll('table.selectable-rows tr.active, .selectable-grid > article.active').forEach(el => {
            el.classList.remove('active');
        });
        updateSelectedCount();
    });
}