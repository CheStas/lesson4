require('./../style/main.scss');
const film = require('./film.handlebars')
//df23dba7
//http://img.omdbapi.com/?i=tt2294629&apikey=df23dba7

const button = document.getElementsByClassName('search')
const request = document.getElementsByClassName('request')
const result = document.getElementsByClassName('result')



button[0].addEventListener('click', searchIt)
request[0].addEventListener('keypress', function(e) {
    if (e.keyCode === 13) {
        searchIt()
    }
})

function searchIt() {
  const value = request[0].value
  const xhr = new XMLHttpRequest()
  xhr.open('GET', 'http://www.omdbapi.com/?s=' + value + '&plot=full&apikey=df23dba7', false);
  xhr.send()

  if (xhr.status != 200) {
    console.log( 'errror', xhr.status + ': ' + xhr.statusText )
  } else {
  // console.log( 'result===', xhr.responseText)
  const response = JSON.parse(xhr.responseText)

  response.Search.forEach(function (el) {
      console.log(el)
      const wrap = document.createElement('tr')
      wrap.classList.add('list__film')
      wrap.innerHTML = film({
          name: el.Title,
          year: el.Year,
          imbdID: el.imbdID,
          type: el.Type,
          poster: el.Poster //url jpg
      })
      result[0].appendChild(wrap)
  })
}
}
