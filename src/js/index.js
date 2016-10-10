require('./../style/main.scss');
const noPoster = require('./../static/noposter.png');
const film = require('./film.handlebars');
//df23dba7
//http://img.omdbapi.com/?i=tt2294629&apikey=df23dba7

const button = document.getElementsByClassName('search');
const request = document.getElementsByClassName('request');
const result = document.getElementsByClassName('result');
const yearEl = document.getElementsByClassName('year');
const typeEl = document.getElementsByClassName('type');
const pagesWrap = document.getElementsByClassName('pages');
let resultList = [];
let pageArr = [];
let currentPage = 1;

pagesWrap[0].addEventListener('click', goToPage);
button[0].addEventListener('click', searchIt);

request[0].addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        searchIt()
    }
});

function goToPage() {
    if (event.target.className == 'goToPage') {
        result[0].innerHTML = '';
        let from;
        let to;
        console.log('innerHTML event target', event.target.innerHTML)
        if (event.target.innerHTML == '&lt;') {
            currentPage = 1
            from = 0;
            to = 9
        } else if (event.target.innerHTML == '&gt;') {
            currentPage = resultList.length;
            from = resultList.length - 10;
            to = resultList.length;
        } else  {
            currentPage = event.target.innerHTML;
            from = (event.target.innerHTML + '0') - 10;
            to = event.target.innerHTML + '0';
        }

        for (var i = from; i < to; i++) {
            const wrap = document.createElement('tr');
            wrap.classList.add('list__film');
            wrap.innerHTML = film({
                name: resultList[i].Title,
                year: resultList[i].Year,
                imbdID: resultList[i].imbdID,
                type: resultList[i].Type,
                poster: (resultList[i].Poster == 'N/A') ? noPoster : resultList[i].Poster
            });
            result[0].appendChild(wrap);
        }
    }
}

function pageList() {
    //pagesWrap[0].innerHTML = '';
    let pageNumber;
    //if (currentPage === 1) {
    //
    //}
    //for (var i = 0; i < 5; i++) {
    //    if (i === 0) {
    //        const toPage = document.createElement('a')
    //        toPage.innerHTML = '<';
    //        toPage.classList.add('goToPage');
    //        pagesWrap[0].appendChild(toPage);
    //    } else if (i === 4) {
    //        const toPage = document.createElement('a')
    //        toPage.innerHTML = '>';
    //        toPage.classList.add('goToPage');
    //        pagesWrap[0].appendChild(toPage);
    //    } else if (i === 1) {
    //        const toPage = document.createElement('a')
    //        toPage.innerHTML = currentPage - 1;
    //        toPage.classList.add('goToPage');
    //        pagesWrap[0].appendChild(toPage);
    //    } else if (i === 2) {
    //        const toPage = document.createElement('a')
    //        toPage.innerHTML = currentPage;
    //        toPage.classList.add('goToPage');
    //        pagesWrap[0].appendChild(toPage);
    //    } else if (i === 3) {
    //        const toPage = document.createElement('a')
    //        toPage.innerHTML = currentPage + 2;
    //        toPage.classList.add('goToPage');
    //        pagesWrap[0].appendChild(toPage);
    //    }
    //}
    pageArr.forEach(function (el, i) {
        if (i === 0) {
            pageNumber = '<'
        } else if (i === pageArr.length - 1) {
            pageNumber = '>'
        } else {
            pageNumber = i + 1
        }
        const toPage = document.createElement('a')
        toPage.innerHTML = pageNumber;
        toPage.classList.add('goToPage');
        pagesWrap[0].appendChild(toPage);
    })
}

function searchIt() {
    result[0].innerHTML = '';
    const value = request[0].value;
    const type = typeEl[0].value;
    let year = (isNaN(yearEl[0].value) ? '' : yearEl[0].value)
    const xhr = new XMLHttpRequest();
    let page = 1;

    xhr.open('GET', 'http://www.omdbapi.com/?s=' + value + '&plot=full&apikey=df23dba7&page=' + page + '&type='+ type + '&y=' + year, false);
    xhr.send();

    if (xhr.status != 200) {
        console.log('errror', xhr.status + ': ' + xhr.statusText)
    } else {
        // console.log( 'result===', xhr.responseText)
        const response = JSON.parse(xhr.responseText);
        //console.log(response);
        const pages = Math.ceil((response.totalResults / 10));
        console.log('pages--', pages)
        console.log('url--', 'http://www.omdbapi.com/?s=' + value + '&plot=full&apikey=df23dba7&page=' + i + '&type='+ type + '&y=' + year)
        for(var i = 1; i < pages; i++) {
            //console.log(i)
            xhr.open('GET', 'http://www.omdbapi.com/?s=' + value + '&plot=full&apikey=df23dba7&page=' + i + '&type='+ type + '&y=' + year, false);
            xhr.send();
            if (xhr.status != 200) {
                console.log('errror', xhr.status + ': ' + xhr.statusText)
            } else {
                const response = JSON.parse(xhr.responseText);
                //console.log(response);
                response.Search.forEach(function (el) {
                    resultList.push(el)
                })
                if (i===1) {
                    resultList.forEach(function (el) {
                        const wrap = document.createElement('tr');
                        wrap.classList.add('list__film');
                        wrap.innerHTML = film({
                            name: el.Title,
                            year: el.Year,
                            imbdID: el.imbdID,
                            type: el.Type,
                            poster: (el.Poster == 'N/A') ? noPoster : el.Poster //url jpg
                        });
                        result[0].appendChild(wrap);
                    })
                }
            }
            pageArr.push(i)
        }
        pageList()
    }
    console.log('resultList', resultList)
}

