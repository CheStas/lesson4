require('./../style/main.scss');
const noPoster = require('./../static/noposter.png');
const film = require('./film.handlebars');
//df23dba7
//http://img.omdbapi.com/?i=tt2294629&apikey=df23dba7

/* Записываем обьект в локальное хранилище, и извлекаем его */
//localStorage.setItem('test', JSON.stringify(test));
//const localTest = JSON.parse(localStorage.getItem('test'));

//1. текущая страница выделяется синим - при переходе на другу страницу номер ее выделяется синим, другие номер - белые.
//2. выводить номера только первой последней, текущей и по 3 ближайшие страницы от текущей
//3. записать favoriteList в локал стор, и извлекать его оттуда

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

function addFilmToFavorite(e) {
    let resultListId = true;

    if (e.target.className === 'addToFavorite') {
        const id = (event.target.getAttribute('data-id'))
        const wrap = event.target.parentElement.parentElement;

        resultList.forEach(function (el) {
            if (el.imdbID === id) {
                if (favoriteList.indexOf(el) === -1) {
                    favoriteList.push(el)
                    favoriteID.push(id);
                    wrap.classList.add('fav')
                } else {
                    favoriteList.splice(favoriteList.indexOf(el), 1)
                    favoriteID.splice(favoriteList.indexOf(el), 1)
                    wrap.classList.remove('fav')
                }
                resultListId = false;
            }
        });

        if (resultListId) {
            favoriteList.forEach(function (el, i) {
                if (el.imdbID === id) {
                    favoriteList.splice(i, 1)
                    favoriteID.splice(i, 1)
                    wrap.classList.remove('fav')
                }
            })
        }
    }
}

function goToPage() {
    if (event.target.className == 'goToPage') {
        result[0].innerHTML = '';

        event.target.classList.add('currentPage')

        if (event.target.innerHTML == 'first') {
            searchIt(1)
        } else if (event.target.innerHTML == 'last') {
            searchIt(pageArr.length)
        } else  {
            searchIt(event.target.innerHTML)
        }
    }
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
    })
}

function searchIt(page = 1) {
    result[0].innerHTML = '';
    pagesWrap[0].innerHTML = '';
    resultList = [];
    pageArr = [];

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

                for(let i = 1; i < pages + 1; i++) {
                    pageArr.push(i)
                }
                pageList();
            }
        }
    }
    result[0].innerHTML = 'search..';
}


