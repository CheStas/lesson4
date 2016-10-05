require('./../style/style.css');
console.log('hi333')

//df23dba7
//http://img.omdbapi.com/?i=tt2294629&apikey=df23dba7

var button = document.getElementsByClassName('search')
var request = document.getElementsByClassName('request')
// console.log(request)

button[0].addEventListener('click', function() {
  var value = request[0].value

  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'http://www.omdbapi.com/?s=' + value + '&y=&plot=full', false);
  xhr.send()

  if (xhr.status != 200) {
    console.log( 'errror', xhr.status + ': ' + xhr.statusText )
  } else {
  console.log( 'result===', xhr.responseText )
}
})
