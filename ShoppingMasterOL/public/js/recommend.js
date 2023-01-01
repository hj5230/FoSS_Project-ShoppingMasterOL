const card = '<div class="card h-100 border-success mb-3">' +
'<img class="card-img-top">' +
'<div class="card-body">' +
  '<h5 class="card-title">Card title</h5>' +
  '<small class="card-text"></small>' +
  '<div class="row" style="position:absolute; bottom:0">' +
    '<h3></h3>' +
  '</div>' +
'</div>' +
'</div>';

const user = '<div class="card h-100 border-primary mb-3">' +
'<img class="card-img-top">' +
'<div class="card-body text-primary">' +
  '<h5 class="card-title">Card title</h5>' +
  '<small class="card-text"></small>' +
  '<div class="row" style="position:absolute; bottom:0">' +
    '<h3></h3>' +
  '</div>' +
'</div>' +
'</div>';

const fetchItem = async(col) => {
  const pro = await fetch('/getjson/')
  const res = await pro.json()
  const url = await fetch('/getimg/'+ col)
  .then((response) => {
    const reader = response.body.getReader()
    return new ReadableStream({
      start(controller) {
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            if(done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              return pump();
            });
          }
        }
      })
    })
  .then((stream) => new Response(stream))
  .then((response) => response.blob())
  .then((blob) => URL.createObjectURL(blob))
  .then((url) => {
    return url
  })
  let newCard = document.createElement('div')
  newCard.setAttribute('class', 'col-sm-2')
  newCard.innerHTML = card
  newCard.querySelector('img').setAttribute('src', url)
  newCard.querySelector('.card-title').innerText = res[col].name
  newCard.querySelector('small').innerText = res[col].description
  newCard.querySelector('h3').innerText = " € " + res[col].price
  document.querySelector('#container').appendChild(newCard)
}

const setUser = async(col) => {
  const url = await fetch('/getuser/')
  .then((response) => {
    const reader = response.body.getReader()
    return new ReadableStream({
      start(controller) {
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            if(done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            return pump();
          });
        }
      }
    })
  })
  .then((stream) => new Response(stream))
  .then((response) => response.blob())
  .then((blob) => URL.createObjectURL(blob))
  .then((url) => {
    return url
  })
  let newCard = document.createElement('div')
  newCard.setAttribute('class', 'col-sm-2')
  newCard.setAttribute('id', 'user')
  newCard.innerHTML = user
  newCard.querySelector('img').setAttribute('src', url)
  newCard.querySelector('.card-title').innerText = "User " + (col + 1)
  document.querySelector('#container').appendChild(newCard)
}

const inputjson = () => {
  let input = document.querySelector('#json')
  input.value = JSON.stringify(matrix).toString()
}

(async() => {
  console.log("Built with Django")
  const infolist = []
  let info = (document.querySelector('#info')).querySelectorAll('p')
  for(let i of info) {
    console.log(i.innerText)
    if(i.outerText.length == 2) infolist.push([])
    else if(i.outerText.length / 3 == 1) infolist.push([
      parseInt(i.outerText.substring(1, 2))
    ])
    else infolist.push([
      parseInt(i.outerText.substring(1, 2)),
      parseInt(i.outerText.substring(4, 5))
    ])
  }
  console.log(infolist)
  for(let i in infolist) {
    await setUser(parseInt(i))
    for(let j of infolist[i]) await fetchItem(j)
  }
})()
