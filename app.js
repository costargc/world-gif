
var colors = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];


if (JSON.parse(localStorage.getItem("mytopics")) != null) {
    topics = JSON.parse(localStorage.getItem("mytopics"));
}
else {
    var topics = [];
}
if (topics.length > 0) {
    document.getElementById("visits").style.display = "flex";
    renderButtons();
}


$('#world-map').on("click", function () {
    event.preventDefault();
    var topic = $('.jvectormap-tip').html().trim();
    topic = topic.toUpperCase();
    $("#topic-input").val();
    if (topics.indexOf(topic) == -1 && topic != "") {
        topics.push(topic);
        localStorage.setItem("mytopics", JSON.stringify(topics));
        renderButtons();
    }

    showGifs(topic);
    if (topics.length > 0) {
        document.getElementById("visits").style.display = "flex";
    }


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
});


$(document).on("click", '.topic-button', function () {
    event.stopPropagation();
    // console.log(this);
    showGifs($(this).attr("data-topic"));

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



function renderButtons() {

    $("#buttons").empty();
    var j = 0;

    for (var i = 0; i < topics.length; i++) {
        var button = $("<button>");

        button.addClass("topic-button btn btn-" + colors[j]);
        button.attr("type", "button");
        button.attr("data-topic", topics[i]);
        button.text(topics[i]);
        j++;
        if (j === colors.length) { j = 0; }


        $("#buttons").append(button);

    }
}




function showGifs(topic) {
    var APIkey = "nECr5SIz2j118Kp1zdxDW0LB8Ynat2e0";
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=" + APIkey + "&limit=10";

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
                var topicDiv = $("<div class='d-inline-block'>");
                var rating = results[i].rating.toUpperCase();
                var span = $("<span>").text("Rated: " + rating);
                var topicImage = $("<img>");

                topicImage.addClass("gif");
                topicImage.attr("src", results[i].images.fixed_height_still.url);
                topicImage.attr("data-state", "still");
                topicImage.attr("data-still", results[i].images.fixed_height_still.url);
                topicImage.attr("data-animate", results[i].images.fixed_height.url);

                topicDiv.append(topicImage);
                topicDiv.append('<br><a href="' + results[i].images.original.url + '" target="_blank" download>Link</a>');
                topicDiv.append('<br>');
                topicDiv.append(span);

                j++;

                if (j === colors.length) { j = 0; }

                $("#gif-panel").prepend(topicDiv);

            }

            $("#gif-panel").prepend($("<hr>"));

            document.getElementById("gifs-show").style.display = "flex";


        });
}


