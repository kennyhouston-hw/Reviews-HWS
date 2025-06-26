function initializeSortingCourse() {
    console.log("initializeSortingCourse called.");

    $(".sort-select").on('change', function() {
        console.log("Sort select changed.");

        var $cards = $("#cards .my-card"); 
        console.log("Number of cards found:", $cards.length);

        var selectedTarget = $(this).find(":selected").attr("data-target");
        console.log("Selected target:", selectedTarget);

        if (selectedTarget === "all") {

            $cards.removeClass('hidden-card').addClass('d-flex'); 
            console.log("Showing all cards by removing hidden-card and adding d-flex.");
        } else {
            $cards.addClass('hidden-card').removeClass('d-flex');           
            var $filteredCards = $cards.filter("." + selectedTarget);
            $filteredCards.removeClass('hidden-card').addClass('d-flex');
            console.log("Showing filtered cards (class: ." + selectedTarget + "), found:", $filteredCards.length);
        }
    });

    $(".sort-select").trigger('change'); 
}