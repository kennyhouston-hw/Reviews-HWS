const CARDS_PER_PAGE = 9;

// Map для поиска инстанса по клику на read-more-link
const instances = new Map();

const iconAscending = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/></svg>';
const iconDescending = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/></svg>';

// === MODAL (один на всю страницу) ===
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'review-modal';
    modal.className = 'modal-overlay';
    modal.setAttribute('hidden', '');
    modal.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" aria-label="Закрыть">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
            </button>
            <div class="autor d-flex txt txt-small">
                <span class="modal-course txt-primary course"></span>
            </div>
            <div class="user d-flex flex-row my-g-3">
                <span class="avatar modal-avatar"></span>
                <div class="user-name d-flex flex-column gap-1">
                    <span class="modal-name txt txt-primary txt-subtitle"></span>
                    <span class="modal-date txt-secondary txt-small"></span>
                </div>
            </div>
            <p class="modal-text txt txt-primary"></p>
        </div>
    `;

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.body.appendChild(modal);
}

function openModal(item, color) {
    const modal = document.getElementById('review-modal');
    modal.querySelector('.modal-course').textContent = item.type;
    modal.querySelector('.modal-avatar').textContent = item.name ? item.name[0].toUpperCase() : '';
    modal.querySelector('.modal-avatar').style.backgroundColor = color;
    modal.querySelector('.modal-name').textContent = item.name;
    modal.querySelector('.modal-date').textContent = item.date;
    modal.querySelector('.modal-text').textContent = item.text;

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('modal-visible'));
}

function closeModal() {
    const modal = document.getElementById('review-modal');
    modal.classList.remove('modal-visible');
    document.body.style.overflow = '';
    modal.addEventListener('transitionend', () => modal.setAttribute('hidden', ''), { once: true });
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// === CLICK HANDLER (делегирование на document) ===
document.body.addEventListener('click', function (event) {
    if (!event.target.matches('.read-more-link')) return;
    const link = event.target;
    const container = link.closest('.main-container');
    const instance = instances.get(container);
    if (!instance) return;
    const item = instance.getItem(parseInt(link.dataset.idx));
    if (item) openModal(item, link.dataset.color);
});

// === INSTANCE ===
function createInstance(containerEl) {
    let allReviews = [];
    let filteredSortedReviews = [];
    let currentFilter = 'all';
    let isAscending = false;
    let currentPage = 1;

    const gridEl     = containerEl.querySelector('.review-grid-js');
    const paginEl    = containerEl.querySelector('.pagination');
    const controlsEl = containerEl.querySelector('.controls');
    const selectEl   = containerEl.querySelector('.sort-select');
    const sortBtnEl  = containerEl.querySelector('.sort-date-toggle');

    const avatarColors = ['#FFC107', '#F44336', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#00BCD4', '#E91E63'];

    function renderCards(reviewsArray, offset) {
        if (!gridEl) return;
        gridEl.innerHTML = reviewsArray.map((item, i) => {
            const showReadMore = item.text.split(' ').length > 80;
            const initial = item.name ? item.name[0].toUpperCase() : '';
            const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];
            return `
                <div class="my-card ${item.coursefilter} txt" data-date="${item.datefilter}">
                    <div class="autor d-flex txt txt-small">
                        <span class="txt-primary course">${item.type}</span>
                    </div>
                    <div class="user">
                        <span class="avatar" style="background-color: ${color};">${initial}</span>
                        <div class="user-name">
                            <span class="txt txt-primary txt-subtitle">${item.name}</span>
                            <span class="txt-tertiary txt-small">${item.date}</span>
                        </div>
                    </div>
                    <p class="truncated-text txt-secondary">${item.text}</p>
                    ${showReadMore ? `<span class="read-more-link mt-2" data-idx="${offset + i}" data-color="${color}">Читать полностью</span>` : ''}
                </div>
            `;
        }).join('');
    }

    function getPageNumbers(current, total) {
        if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 3)          return [1, 2, 3, '...', total];
        if (current >= total - 2)  return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    }

    function renderPagination(totalItems) {
        if (!paginEl) return;
        const totalPages = Math.ceil(totalItems / CARDS_PER_PAGE);
        if (totalPages <= 1) { paginEl.innerHTML = ''; return; }

        const nums = getPageNumbers(currentPage, totalPages);
        let html = `<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
        for (const p of nums) {
            html += p === '...'
                ? `<span class="page-ellipsis">…</span>`
                : `<button class="page-btn ${p === currentPage ? 'page-btn--active' : ''}" data-page="${p}">${p}</button>`;
        }
        html += `<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>›</button>`;
        paginEl.innerHTML = html;

        paginEl.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.dataset.page);
                render();
                controlsEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    function applyFilterAndSort() {
        filteredSortedReviews = currentFilter === 'all'
            ? [...allReviews]
            : allReviews.filter(r => r.coursefilter?.split(' ').includes(currentFilter));

        const dir = isAscending ? 1 : -1;
        filteredSortedReviews.sort((a, b) => dir * (new Date(a.datefilter) - new Date(b.datefilter)));

        currentPage = 1;
        render();
    }

    function render() {
        const start = (currentPage - 1) * CARDS_PER_PAGE;
        renderCards(filteredSortedReviews.slice(start, start + CARDS_PER_PAGE), start);
        renderPagination(filteredSortedReviews.length);
    }

    function updateSortButton() {
        if (!sortBtnEl) return;
        sortBtnEl.innerHTML = isAscending
            ? iconAscending + 'Сначала старые'
            : iconDescending + 'Сначала новые';
    }

    function init(data) {
        allReviews = data;

        selectEl?.addEventListener('change', function () {
            currentFilter = this.value;
            applyFilterAndSort();
        });

        sortBtnEl?.addEventListener('click', function () {
            isAscending = !isAscending;
            updateSortButton();
            applyFilterAndSort();
        });

        isAscending = false;
        updateSortButton();
        applyFilterAndSort();
    }

    return {
        init,
        getItem: (idx) => filteredSortedReviews[idx],
    };
}

// === BOOTSTRAP ===
createModal();

const url = 'https://ya.hwschool.online/reviews/reviews_test.json?t=' + Date.now();

fetch(url)
    .then(r => r.json())
    .then(json => {
        document.querySelectorAll('.main-container').forEach(containerEl => {
            if (!containerEl.querySelector('.review-grid-js')) return;
            const instance = createInstance(containerEl);
            instances.set(containerEl, instance);
            instance.init(json.data);
        });
    })
    .catch(error => console.error('Failed to load reviews data:', error));
