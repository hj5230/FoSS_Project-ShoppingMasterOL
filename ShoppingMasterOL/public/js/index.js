const card = '<div class="card h-100">' +
'<img class="card-img-top">' +
'<div class="card-body">' +
  '<h5 class="card-title">Card title</h5>' +
  '<small class="card-text"></small>' +
  '<div class="row" style="position:absolute; bottom:0">' +
    '<h3></h3>' +
    '<a href="javascript:void(0)" class="btn btn-outline-primary">Select</a>' +
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

const matrix = {
  0: [0, 0, 0, 0, 0],
  1: [0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 0],
  4: [0, 0, 0, 0, 0]
}

const fetchItem = async(row, col) => {
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
            if (done) {
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
  newCard.querySelector('a').setAttribute('id', row.toString() + col.toString())
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
            if (done) {
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
  // newCard.querySelector('a').parentNode.removeChild(newCard.querySelector('a'))
  document.querySelector('#container').appendChild(newCard)
}

const inputjson = () => {
  let input = document.querySelector('#json')
  input.value = JSON.stringify(matrix).toString()
}

(async() => {
  console.log("Built with Django")
  for(let row = 0; row < 5; ++row) {
    await setUser(row)
    for(let col = 0; col < 5; ++ col) {
      await fetchItem(row, col)
    }
  }
  let selects = document.querySelector('#panel').querySelectorAll('a')
  for(let i in selects) {
    selects[i].onclick = () => {
      selects[i].setAttribute('class', 'btn btn-primary')
      let row = selects[i].id[0]
      let col = selects[i].id[1]
      matrix[row][col] = 1
      console.log(matrix);
    }
  }
  document.querySelector('#submit').onclick = () => {
    document.querySelector('#post').click()
  }
})()
