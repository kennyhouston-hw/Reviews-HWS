function initializeSortingDate() {
    const sortButton = $('#sort-date-toggle');
    let isAscending = false; 

    const iconAscending = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/></svg>';
    const textAscending = 'Сначала старые';

    const iconDescending = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/></svg>';
    const textDescending = 'Сначала новые';

    function sortCards(order) {
        const grid = $('.grid')[0];
        const cards = Array.from(grid.children);

        cards.sort((a, b) => order * (new Date(a.dataset.date) - new Date(b.dataset.date)));
        grid.innerHTML = '';
        cards.forEach(card => grid.appendChild(card));
    }

    function updateButtonContent() {
        if (isAscending) {
            sortButton.html(iconAscending + textAscending); 
        } else {
            sortButton.html(iconDescending + textDescending); 
        }
    }

    // Обработчик клика по кнопке
    sortButton.on('click', function() {
        if (isAscending) {
            sortCards(-1); 
            isAscending = false;
        } else {
            sortCards(1);  
            isAscending = true;
        }
        updateButtonContent();
    });


    sortCards(-1); 
    isAscending = false; 
    updateButtonContent(); 
}
