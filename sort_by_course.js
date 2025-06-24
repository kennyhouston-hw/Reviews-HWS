function initializeSortingCourse() {
    console.log("initializeSortingCourse called.");

    // Убедитесь, что это правило есть в вашем style.css и загружается после Bootstrap
    // .hidden-card {
    //     display: none !important;
    // }

    $(".sort-select").on('change', function() {
        console.log("Sort select changed.");

        // Получаем актуальную коллекцию карточек при каждом изменении
        var $cards = $("#cards .my-card"); 
        console.log("Number of cards found:", $cards.length);

        var selectedTarget = $(this).find(":selected").attr("data-target");
        console.log("Selected target:", selectedTarget);

        if (selectedTarget === "all") {
            // Если выбран "Все курсы", показываем все карточки.
            // Удаляем класс hidden-card и добавляем d-flex (если он нужен для отображения flex-контейнера)
            $cards.removeClass('hidden-card').addClass('d-flex'); 
            console.log("Showing all cards by removing hidden-card and adding d-flex.");
        } else {
            // Если выбран конкретный курс:
            // 1. Скрываем все карточки: добавляем hidden-card и удаляем d-flex
            $cards.addClass('hidden-card').removeClass('d-flex'); 
            
            // 2. Находим отфильтрованные карточки
            var $filteredCards = $cards.filter("." + selectedTarget);
            
            // 3. Показываем отфильтрованные: удаляем hidden-card и добавляем d-flex
            $filteredCards.removeClass('hidden-card').addClass('d-flex');
            console.log("Showing filtered cards (class: ." + selectedTarget + "), found:", $filteredCards.length);
        }
    });

    // Опционально: Инициируем сортировку при загрузке страницы, чтобы сразу показать все карточки
    // Это имитирует выбор "Все курсы"
    $(".sort-select").trigger('change'); 
}