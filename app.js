colors = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];

startPage();





$('#clearCountries').on("click", function () {
    event.preventDefault();
    localStorage.removeItem("mycountries");
    startPage();
    renderButtons();
    location.reload();

});

$('#world-map').on("click", function () {
    event.preventDefault();
    var place = $('.jvectormap-tip').html().trim();
    place = place.toUpperCase();
    $("#place-input").val();
    if (countries.indexOf(place) == -1 && place != "") {
        countries.push(place);
        localStorage.setItem("mycountries", JSON.stringify(countries));
        renderButtons();
    }

    showGifs(place);
    if (countries.length > 0) {
        document.getElementById("visits").style.display = "flex";
    }

    startPage();
});

$(document).on("click", '.gif', function () {
    event.stopPropagation();
    // console.log("hi");
    var state = $(this).attr("data-state");

    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
    startPage();
});


$(document).on("click", '.place-button', function () {
    event.stopPropagation();
    // console.log(this);
    showGifs($(this).attr("data-place"));
    startPage();
});


$(function () {
    $('#world-map').vectorMap({
        map: 'world_mill',
        zoomOnScroll: false,
        backgroundColor: 'white',
        regionStyle: {
            initial: {
                fill: '#a64ac9',
                "fill-opacity": 1,
                stroke: 'none',
                "stroke-width": 0,
                "stroke-opacity": 1
            },
            hover: {
                "fill-opacity": 0.5,
                cursor: 'pointer'
            },
            selected: {
                fill: 'yellow'
            },
            selectedHover: {
            }
        },

        onRegionTipShow: function (e, el, code) {
            el.html(el.html());
        }
    });
});

function startPage() {
    if (JSON.parse(localStorage.getItem("mycountries")) != null) {
        countries = JSON.parse(localStorage.getItem("mycountries"));
        document.getElementById("clearCountries").style.display = "flex";
    }
    else {
        countries = [];
        document.getElementById("clearCountries").style.display = "none";
    }

    if (countries.length > 0) {
        document.getElementById("visits").style.display = "flex";
        renderButtons();
    }
    else {
        document.getElementById("visits").style.display = "none";
        renderButtons();
    }
};


function renderButtons() {

    $("#buttons").empty();
    var j = 0;

    for (var i = 0; i < countries.length; i++) {
        var button = $("<button>");

        button.addClass("place-button btn btn-" + colors[j]);
        button.attr("type", "button");
        button.attr("data-place", countries[i]);
        button.text(countries[i]);
        j++;
        if (j === colors.length) { j = 0; }


        $("#buttons").append(button);

    }
}




function showGifs(place) {
    var APIkey = "nECr5SIz2j118Kp1zdxDW0LB8Ynat2e0";
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + place + "&api_key=" + APIkey + "&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            var results = response.data;
            // console.log(results);
            var j = 0;
            // Looping through each result item

            for (var i = 0; i < results.length; i++) {
                var placeDiv = $("<div class='d-inline-block'>");
                var rating = results[i].rating.toUpperCase();
                var span = $("<span>").text("Rated: " + rating);
                var placeImage = $("<img>");

                placeImage.addClass("gif");
                placeImage.attr("src", results[i].images.fixed_height_still.url);
                placeImage.attr("data-state", "still");
                placeImage.attr("data-still", results[i].images.fixed_height_still.url);
                placeImage.attr("data-animate", results[i].images.fixed_height.url);

                placeDiv.append(placeImage);
                placeDiv.append('<br><a href="' + results[i].images.original.url + '" target="_blank" download>Link</a>');
                placeDiv.append('<br>');
                placeDiv.append(span);

                j++;

                if (j === colors.length) { j = 0; }

                $("#gif-panel").prepend(placeDiv);

            }

            $("#gif-panel").prepend($("<hr>"));

            document.getElementById("gifs-show").style.display = "flex";


        });
}


