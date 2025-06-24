
    async function loadAndRenderCards() {
        const url = 'https://ya.hwschool.online/reviews/reviews_test.json?t=' + Date.now();

        let arr = (await (await fetch(url)).json()).data;
        const avatarColors = [
            '#FFC107', '#F44336', '#4CAF50', '#2196F3',
            '#9C27B0', '#FF9800', '#00BCD4', '#E91E63'
        ];

        document.querySelector('.grid').innerHTML = arr.map(item => {
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

    document.querySelector('.grid').addEventListener('click', function(event) {
        if (event.target && event.target.matches('.read-more-link')) {
            toggleText(event.target);
        }
    });

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

    loadAndRenderCards().then(() => {
            initializeSortingCourse();
            initializeSortingDate();
        });

  
  
 