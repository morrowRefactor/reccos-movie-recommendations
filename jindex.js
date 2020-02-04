'use strict';

function getMovies() {
    const apiKey = 'cadc1278ff825f0fa5be2ce189d7b4a59ef1fe8f1af546690912ca539ffb0440'; 
    const searchURL = 'https://api.trakt.tv';
    const options = {
        headers: {
            'content-type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': apiKey
        }
    };
  
    fetch(searchURL, options)
      .then(response => response.json())
      .then(responseJson => console.log(responseJson));
}

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
    getMovies();
}

$(watchButtons);