$(document).ready(function () {

    $("#scrape").on("click", function () {
        $.ajax("/scrape", {
            type: "GET"
        }).then(function (result) {
            location.reload();
        })
    })
    
    $(".img").on("click", function () {
        $(this).parent().toggleClass("moved-left")
        $(this).parent().siblings().find("form").slideToggle(400);
    })
    
    $(".form").on("submit", function (e) {
        e.preventDefault();
        var title = $(this).find(".uk-input").val().trim();
        var body = $(this).find(".uk-textarea").val().trim();
        var obj = {
            title: title,
            body: body
        }
        var id = $(this).attr("id");
        $.ajax("/posts/" + id, {
            type: "POST",
            data: obj
        }).then(function (result) {
            console.log(result);
        })
    })








})