// toggle form to enter movie title
function showMovieForm() {
    $('.movie-init').click(function() {
        $('.movie-form').toggle('slow', function () {
            if($('.movie-form').is(':visible')){
                $('.movie-form').show();
            } else {
                $('.movie-form').hide();
            }
        })
    })
}

// toggle form to select movie genre
function showGenreForm() {
    $('.genre-init').click(function() {
        $('.genre-form').toggle('slow', function () {
            if($('.genre-form').is(':visible')){
                $('.genre-form').show();
            } else {
                $('.genre-form').hide();
            }
        })
    })
}

function watchButtons() {
    showMovieForm();
    showGenreForm();
}

$(watchButtons);