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
        $('.movie').hide();
        $('.select-result').show();
        $('.footer').hide();
        $('.intro').empty();
        $('.intro').append(`<p>Select the movie you'd like to apply your score to</p>`);

        for(let i = 0; i < resultsObj.results.length; i++) {
            let movieTitle = resultsObj.results.map(titleVal => titleVal.title);
            let moviePost = resultsObj.results.map(postVal => postVal.poster_path);
            let releaseYear = resultsObj.results.map(yearVal => yearVal.release_date.substring(4,0));
            let movieId = resultsObj.results.map(idVal => idVal.id);

            $('.search-results').append(
                `<section class='movie-block' id='${movieId[i]}'>
                <div><img src='https://image.tmdb.org/t/p/w500${moviePost[i]}' class='poster' alt='${movieTitle[i]}' /></div>
                <div class='spacer'><span class='title-click'><span class='title'>${movieTitle[i]}</span> (${releaseYear[i]})</span></div>
                <a class='button pointer spacer' onclick='selectMovie(${movieId[i]})'>This one!</a>
                </section>`
            );
        }

        adjustFooter('.search-results');
    }
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
    $('.intro').hide();
    $('.selected-movie').empty();
    $('.selected-movie').show();
    $('.footer').show();

    let title = movieInfo.title;
    let year = movieInfo.release_date.substring(4,0);
    let poster = movieInfo.poster_path;
    let filmid = movieInfo.id;

    $('.selected-movie').append(
        `<section class='movie-block'>
        <div><img src='https://image.tmdb.org/t/p/w500${poster}' class='poster' alt='${title}' /></div>
        <div><span class='title-click'><span class='title'>${title}</span> (${year})</span></div>
        <form id='rating-form'>
        <label for='rate-movie'>How would you rate this movie?</label>
        <select name='rate-movie' type='select' placeholder='10' class='select-css' required>
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
        <a class='button pointer spacer' onclick='findReccos(${filmid})'>Find recco's!</a>
        </section>`
    )

    adjustFooter('.selected-movie');
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
    $('.movie-form').hide();
    $('.footer').hide();
    $('.recommendations').empty();
    $('.recommendations').show();

    for(let i = 0; i < movieReccos.results.length; i++) {
        let reccoTitle = movieReccos.results.map(titleVal => titleVal.title);
        let reccoPost = movieReccos.results.map(postVal => postVal.poster_path);
        let reccoSumm = movieReccos.results.map(overviewVal => overviewVal.overview);
        let reccoYear = movieReccos.results.map(releaseVal => releaseVal.release_date.substring(4,0));
        let reccoId = movieReccos.results.map(idVal => idVal.id);
        let vote = movieReccos.results.map(voteVal => voteVal.vote_average);

        $('.recommendations').append(
            `<section class='movie-block'>
            <div><img src='https://image.tmdb.org/t/p/w500${reccoPost[i]}' class='poster' alt='${reccoTitle[i]}' /></div>
            <div><span class='title-click spacer'><span class='title'>${reccoTitle[i]}</span> (${reccoYear[i]})</span></div>
            <div><p>Rating: ${vote[i]}</p></div>
            <div class='spacer'></div>
            <section class='overview hidden' id='${reccoId[i]}'>
            ${reccoSumm[i]}
            <div class='spacer'></div>
            </section>
            <a class='button pointer spacer' onClick='showOverview(${reccoId[i]})'>Read Overview</a>
            </section>`
        )
    }

    adjustFooter('.recommendations');
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
        $('.movie-form').show();
        $('.footer').show();
        $('.search-results').empty();
        $('.selected-movie').empty();
        $('.recommendations').empty();
    })
} 

function adjustFooter(section) {
    let domHeight = document.getElementById('container').scrollHeight;
    if(domHeight > screen.height) {
        $(section).append(
            `<section class="bottom">
            <img class="bottom-img" src="https://user-images.githubusercontent.com/58446465/74387951-ec970a00-4df1-11ea-9aae-63a07eb26562.png" alt="Recco's Movie Recommendations" />
            </section>`
        )
        $('.footer').hide();
    } else { 
        $('.footer').show();
    }
}


function watchButtons() {
    movieSubmit();
    newSearch();
}

$(watchButtons);