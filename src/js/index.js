require('./../style/main.scss');
const noPoster = require('./../static/noposter.png');
const film = require('./film.handlebars');


//localStorage.setItem('test', JSON.stringify(test));
//const localTest = JSON.parse(localStorage.getItem('test'));

//TODO fix pageList when pages > 30
//TODO favoriteList to localStorage

const button = document.getElementsByClassName('search');
const request = document.getElementsByClassName('request');
const result = document.getElementsByClassName('result');
const yearEl = document.getElementsByClassName('year');
const typeEl = document.getElementsByClassName('type');
const pagesWrap = document.getElementsByClassName('pages');
let resultList = [];
let pageArr = [];
let currentPage = 1;
let favoriteList = [];
let favoriteID = [];

pagesWrap[0].addEventListener('click', goToPage);
button[0].addEventListener('click', searchIt);
result[0].addEventListener('click', addFilmToFavorite);
request[0].addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        searchIt()
    }
});
result[0].addEventListener('mouseover', function () {
    if (event.target.className === 'addToFavorite') {
        const wrap = event.target.parentElement.parentElement;
        wrap.classList.add('hover')
    }
});
result[0].addEventListener('mouseout', function () {
    if (event.target.className === 'addToFavorite') {
        const wrap = event.target.parentElement.parentElement;
        wrap.classList.remove('hover')
    }
});

function addFilmToFavorite(e) {
    let resultListId = true;

    if (e.target.className === 'addToFavorite') {
        const id = (event.target.getAttribute('data-id'));
        const wrap = event.target.parentElement.parentElement;

        resultList.forEach(function (el) {
            if (el.imdbID === id) {
                if (favoriteList.indexOf(el) === -1) {
                    favoriteList.push(el);
                    favoriteID.push(id);
                    wrap.classList.add('fav')
                } else {
                    favoriteList.splice(favoriteList.indexOf(el), 1);
                    favoriteID.splice(favoriteList.indexOf(el), 1);
                    wrap.classList.remove('fav');
                }
                resultListId = false;
            }
        });

        if (resultListId) {
            favoriteList.forEach(function (el, i) {
                if (el.imdbID === id) {
                    favoriteList.splice(i, 1);
                    favoriteID.splice(i, 1);
                    wrap.classList.remove('fav')
                }
            })
        }
    }
}

function goToPage() {
    if (event.target.className == 'goToPage') {
        result[0].innerHTML = '';

        const prevPage = document.getElementsByClassName('currentPage');
        prevPage[0].classList.remove('currentPage');

        const thisPage = event.target;
        thisPage.classList.add('currentPage');

        if (event.target.innerHTML == 'first') {
            currentPage = 1;
            searchIt(1);
        } else if (event.target.innerHTML == 'last') {
            currentPage = pageArr.length;
            searchIt(pageArr.length);
        } else  {
            currentPage = event.target.innerHTML;
            searchIt(event.target.innerHTML);
        }
    }
    return currentPage;
}

function pageList() {
    let pageNumber;
    pageArr.forEach(function (el, i) {
        const toPage = document.createElement('a');

        if (i === 0) {
            pageNumber = 'first';
            toPage.classList.add('currentPage');
        } else if (i === pageArr.length - 1) {
            pageNumber = 'last'
        } else {
            pageNumber = i + 1;
        }

        toPage.innerHTML = pageNumber;
        toPage.classList.add('goToPage');
        pagesWrap[0].appendChild(toPage);
    });
    return currentPage = 1;
}

function searchIt(page = 1) {
    result[0].innerHTML = '';
    resultList = [];
    if (page === 1) {
        pagesWrap[0].innerHTML = '';
        pageArr = [];
    }

    const value = request[0].value;
    const type = typeEl[0].value;
    let year = (isNaN(yearEl[0].value) ? '' : yearEl[0].value);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://www.omdbapi.com/?s=' + value + '&plot=full&apikey=df23dba7&page=' + page + '&type='+ type + '&y=' + year, true);
    xhr.send();

    xhr.onload = function () {
        if (xhr.readyState !=4) return;
        result[0].innerHTML = '';

        if (xhr.status != 200) {
            console.log('errror', xhr.status + ': ' + xhr.statusText)
        } else {
            const response = JSON.parse(xhr.responseText);

            if (response.Response === 'False') {
                result[0].innerHTML = response.Error
            } else {
                const pages = Math.ceil((response.totalResults / 10));

                response.Search.forEach( el => {
                    if (favoriteID.indexOf(el.imdbID) === -1) {
                        resultList.push(el)
                    }
                });

                favoriteList.forEach( el => {
                    const wrap = document.createElement('div');
                    wrap.classList.add('list__film');
                    wrap.classList.add('fav');
                    wrap.innerHTML = film({
                        name: el.Title,
                        year: el.Year,
                        id: el.imdbID,
                        type: el.Type,
                        poster: (el.Poster == 'N/A') ? noPoster : el.Poster
                    });
                    result[0].appendChild(wrap);
                });

                resultList.forEach( el => {
                    const wrap = document.createElement('div');
                    wrap.classList.add('list__film');
                    wrap.innerHTML = film({
                        name: el.Title,
                        year: el.Year,
                        id: el.imdbID,
                        type: el.Type,
                        poster: (el.Poster == 'N/A') ? noPoster : el.Poster
                    });
                    result[0].appendChild(wrap);
                });

                if (page === 1) {
                    for(let i = 1; i < pages + 1; i++) {
                        pageArr.push(i)
                    }
                    pageList();
                }
            }
        }
    };
    result[0].innerHTML = 'search..';
}


