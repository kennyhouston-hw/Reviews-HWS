// === РЕНДЕР КАРТОЧЕК ===
function renderCards(reviewsArray, gridSelector) {
    const targetGrid = document.querySelector(gridSelector);
    if (!targetGrid) {
        console.error(`Grid container not found for selector: ${gridSelector}`);
        return;
    }

    const avatarColors = ['#FFC107', '#F44336', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#00BCD4', '#E91E63'];

    targetGrid.innerHTML = reviewsArray.map(item => {
        const showReadMoreLink = item.text.split(' ').length > 80;
        const initial = item.name ? item.name[0].toUpperCase() : '';
        const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
        return `
            <div class="my-card ${item.coursefilter} d-flex flex-column gap-2 py-4 txt txt-primary" data-date="${item.datefilter}">
                <div class="autor d-flex mb-2 txt txt-small">
                    <span class="txt-primary course">${item.type}</span>
                </div>
                <div class="user d-flex flex-row my-g-3 my-2">
                    <span class="avatar" style="background-color: ${randomColor};">${initial}</span>
                    <div class="user-name d-flex flex-column gap-1">
                        <span class="txt txt-primary txt-subtitle">${item.name}</span>
                        <span class="txt-secondary txt-small">${item.date}</span>
                    </div>
                </div>
                <p class="truncated-text">${item.text}</p>
                ${showReadMoreLink ? '<span class="read-more-link mt-2">Читать полностью ▾</span>' : ''}
            </div>
        `;
    }).join('');
}


// === СОРТИРОВКИ ===
function initializeSortingCourse(containerSelector) {
    const $container = $(containerSelector);
    const $select = $container.find(".sort-select");
    const $cardsContainer = $container.find(".review-grid-js");

    $select.on('change', function () {
        const selectedTarget = $(this).find(":selected").data("target");
        const $cards = $cardsContainer.find(".my-card");
        if (selectedTarget === "all") {
            $cards.removeClass('hidden-card').addClass('d-flex');
        } else {
            $cards.addClass('hidden-card').removeClass('d-flex');
            $cards.filter("." + selectedTarget).removeClass('hidden-card').addClass('d-flex');
        }
    });
    $select.trigger('change');
}

function initializeSortingDate(containerSelector) {
    const $container = $(containerSelector);
    const sortButton = $container.find('.sort-date-toggle');
    const grid = $container.find('.review-grid-js')[0];
    let isAscending = false;

    const iconAscending = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/></svg>';
    const textAscending = 'Сначала старые';
    const iconDescending = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/></svg>';
    const textDescending = 'Сначала новые';

    function sortCards(order) {
        if (!grid) return;
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

    sortButton.on('click', function () {
        isAscending = !isAscending;
        sortCards(isAscending ? 1 : -1);
        updateButtonContent();
    });

    sortCards(-1);
    isAscending = false;
    updateButtonContent();
}

// Скрытие текста
function toggleText(linkElement) {
    const pElement = linkElement.previousElementSibling;
    if (pElement.classList.contains('truncated-text')) {
        pElement.classList.remove('truncated-text');
        pElement.classList.add('expanded-text');
        linkElement.textContent = 'Скрыть ▴';
    } else {
        pElement.classList.remove('expanded-text');
        pElement.classList.add('truncated-text');
        linkElement.textContent = 'Читать полностью ▾';
    }
}
document.body.addEventListener('click', function(event) {
    if (event.target && event.target.matches('.read-more-link')) {
        toggleText(event.target);
    }
});


// === ЗАГРУЗКА JSON===
const url = 'https://ya.hwschool.online/reviews/reviews_test.json?t=' + Date.now();

fetch(url)
    .then(response => response.json())
    .then(json => {
        const reviewsData = json.data; 

        renderCards(reviewsData, '#ru-cards');
        renderCards(reviewsData, '#exp-cards');

        initializeSortingCourse('#ru');
        initializeSortingDate('#ru');

        initializeSortingCourse('#exp');
        initializeSortingDate('#exp');
    })
    .catch(error => {
        console.error("Failed to load reviews data:", error);
    });
