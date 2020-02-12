'use strict';

const apiKey = '85dc62aa7f0dbb4b96e9d1e81c686294'; 
const searchURL = 'https://api.themoviedb.org/3/search/movie';
const idSearchURL = 'https://api.themoviedb.org/3/movie/';

// generate clean url for fetch request
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

// call api with query value and params
function getMovies(movieQuery) {
    const params = {
        query: movieQuery,
        include_adult: 'false',
        language: 'en-US',
        api_key: apiKey
    };

    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    console.log(url);
  
    fetch(url) 
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
}

// display search results when searching by movie
function displayResults(resultsObj) {
    console.log(resultsObj);
    $('.search-results').empty();
    $('.search-results').show();
    $('.errors').hide();

    if(resultsObj.results.length < 1) {
        $('.errors').show();
        $('.errors').append(
            `Oops! Looks like we weren't able to find movies matching that search.  Try another title!`
        );
    } else {
        $('.navlinks').show();
        for(let i = 0; i < resultsObj.results.length; i++) {
            let movieTitle = resultsObj.results.map(titleVal => titleVal.title);
            let moviePost = resultsObj.results.map(postVal => postVal.poster_path);
            let releaseYear = resultsObj.results.map(yearVal => yearVal.release_date.substring(4,0));
            let movieId = resultsObj.results.map(idVal => idVal.id);

            $('.search-results').append(
                `<section class='movie-block' id='${movieId[i]}'>
                <div><img src='https://image.tmdb.org/t/p/w500${moviePost[i]}' class='poster' alt='${movieTitle[i]}' /></div>
                <div><span class='title-click spacer'>${movieTitle[i]} (${releaseYear[i]})</span></div>
                <a class='button pointer a-link' onclick='selectMovie(${movieId[i]})'>This one!</a>
                </section>`
            );
        }
    }
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

// watch for searches by movie and clean string value
function movieSubmit() {
    $('.movie-form').submit(event => {
        event.preventDefault();
        const movieStringRaw = $('#js-movie').val();
        let movieString = movieStringRaw;

        cleanString(movieStringRaw);

        function cleanString(originalString) {
            movieString = originalString.split(/[\s, ]+/).join('-');
        }

        getMovies(movieString);
    })
}

// pull info via api for selected movie
function selectMovie(clickId) {
    const idParams = {
        include_adult: 'false',
        language: 'en-US',
        api_key: apiKey
    };

    const queryString = formatQueryParams(idParams)
    const url = idSearchURL + clickId + '?' + queryString;

    console.log(url);
  
    fetch(url) 
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayMovieRating(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
}

// display selected movie and form for submitting user ranking
function displayMovieRating(movieInfo) {
    console.log(movieInfo);
    $('.feature').hide();
    $('.search-results').hide();
    $('.selected-movie').empty();
    $('.selected-movie').show();

    let title = movieInfo.title;
    let year = movieInfo.release_date.substring(4,0);
    let poster = movieInfo.poster_path;
    let filmid = movieInfo.id;

    $('.selected-movie').append(
        `<section class='rate-movie'>
        <div><img src='https://image.tmdb.org/t/p/w500${poster}' class='poster' alt='${title}' /></div>
        <div><span class='title-click'>${title}</span> (${year})</div>
        <form id='rating-form'>
        <label for='rate-movie'>How would you rate this movie?</label>
        <select name='rate-movie' type='select' placeholder='10' required>
        <option value='10'>10</option>
        <option value='9'>9</option>
        <option value='8'>8</option>
        <option value='7'>7</option>
        <option value='6'>6</option>
        <option value='5'>5</option>
        <option value='4'>4</option>
        <option value='3'>3</option>
        <option value='2'>2</option>
        <option value='1'>1</option>
        </select>
        </form>
        <a class='button pointer a-link' onclick='findReccos(${filmid})'>Find recco's!</a>
        </section>`
    )
}

// pull recommendations via api with movie id
function findReccos(reccoId) {
    const idParams = {
        include_adult: 'false',
        language: 'en-US',
        api_key: apiKey
    };

    const queryString = formatQueryParams(idParams)
    const url = idSearchURL + reccoId + '/recommendations?' + queryString;

    console.log(url);
  
    fetch(url) 
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayReccos(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
}

// display movie recommendations
function displayReccos(movieReccos) {
    console.log(movieReccos);

    $('.selected-movie').hide();
    $('.feature').hide();
    $('.recommendations').empty();
    $('.recommendations').show();

    for(let i = 0; i < movieReccos.results.length; i++) {
        let reccoTitle = movieReccos.results.map(titleVal => titleVal.title);
        let reccoPost = movieReccos.results.map(postVal => postVal.poster_path);
        let reccoSumm = movieReccos.results.map(overviewVal => overviewVal.overview);
        let reccoYear = movieReccos.results.map(releaseVal => releaseVal.release_date.substring(4,0));
        let reccoId = movieReccos.results.map(idVal => idVal.id);

        $('.recommendations').append(
            `<section class='movie-block'>
            <div><img src='https://image.tmdb.org/t/p/w500${reccoPost[i]}' class='poster' alt='${reccoTitle[i]}' /></div>
            <div><span class='title-click spacer'>${reccoTitle[i]} (${reccoYear[i]})</span></div>
            <section class='overview hidden' id='${reccoId[i]}'>${reccoSumm[i]}</section>
            <a class='button pointer a-link' onClick='showOverview(${reccoId[i]})'>Read Overview</a>
            </section>`
        )
    }
}

// show movie summaries
function showOverview(overviewId) {
    let idSumm = document.getElementById(overviewId);
    if (idSumm.style.display === 'none') {
        idSumm.style.display = 'block';
    } else {
        idSumm.style.display = 'none'
    }
}

// start a new search
function newSearch() {
    $('.new-search').click(function() {
        $('.movie').show();
        $('.movie-block').hide();
        $('.navlinks').hide();
        document.getElementById('movie-form').reset();
    })
}

function watchButtons() {
    showMovieForm();
    showGenreForm();
    movieSubmit();
    newSearch();
}

$(watchButtons);