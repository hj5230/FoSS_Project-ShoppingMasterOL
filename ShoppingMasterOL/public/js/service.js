const reply = '<div>' +
  '<p class="small p-2 ms-3 mb-1"' +
    'style="background-color: #f5f6f7; border-radius: 15px 15px 15px 0px"></p>' +
'</div>';

const goods = '<div>' +
'<p class="small p-2 ms-3 mb-1"' +
  'style="background-color: #f5f6f7; border-radius: 15px 15px 15px 0px"></p>' +
'<img class="goods" src="" />' +
'</div>';

const sent = '<div>' +
  '<p class="small p-2 me-3 mb-1 text-white bg-primary"' +
    'style="border-radius: 15px 15px 0px 15px"></p>' +
'</div>';

const fetchResponse = async(col) => {
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
  let newReply = document.createElement('div')
  newReply.setAttribute('class', 'd-flex flex-row justify-content-start')
  newReply.innerHTML = goods
  newReply.querySelector('img').setAttribute('src', url)
  newReply.querySelector('img').setAttribute('style', 'height: 300px')
  newReply.querySelector('p').innerText = res[col].name
  console.log(url)
  document.querySelector('#chat-scroll').appendChild(newReply)
  document.querySelector('#chat-scroll').scrollTop = document.querySelector('#chat-scroll').scrollHeight
}

const postMsg = async() => {
  const msg = document.querySelector('#chat-input').value
  if(msg === '') return alert('no message was typed in')
  document.querySelector('#chat-input').value = ''
  let newSent = document.createElement('div')
  newSent.setAttribute('class', 'd-flex flex-row justify-content-end mb-4 pt-1')
  newSent.innerHTML = sent;
  newSent.querySelector('p').innerText = msg
  document.querySelector('#chat-scroll').appendChild(newSent)
  const pro = await fetch('/message/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: msg
    })
  })
  const echo = await pro.json()
  if(echo.reply == 0) {
    fetchResponse(0)
    return
  } else if(echo.reply == 1) {
    fetchResponse(2)
    return
  } else if(echo.reply == 2) {
    fetchResponse(3)
    return
  } else if(echo.reply == 3) {
    fetchResponse(4)
    return
  }
  let newReply = document.createElement('div')
  newReply.setAttribute('class', 'd-flex flex-row justify-content-start')
  newReply.innerHTML = reply
  newReply.querySelector('p').innerText = echo.reply
  document.querySelector('#chat-scroll').appendChild(newReply)
  document.querySelector('#chat-scroll').scrollTop = document.querySelector('#chat-scroll').scrollHeight
}

const enter = (event) => {
  e = event || window.event;
  if(e.keyCode != 13) return;
  postMsg()
}

((() => {
	console.log('Built with Django')
  document.querySelector('#chat-send').onclick = async() => {
    const msg = document.querySelector('#chat-input').value
    if(msg === '') return alert('no message was typed in')
    document.querySelector('#chat-input').value = ''
    let newSent = document.createElement('div')
    newSent.setAttribute('class', 'd-flex flex-row justify-content-end mb-4 pt-1')
    newSent.innerHTML = sent
    newSent.querySelector('p').innerText = msg
    document.querySelector('#chat-scroll').appendChild(newSent)
    const pro = await fetch('/message/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: msg
      })
    })
    const echo = await pro.json()
    if(echo.reply == 0) {
      fetchResponse(0)
      return
    } else if(echo.reply == 1) {
      fetchResponse(2)
      return
    } else if(echo.reply == 2) {
      fetchResponse(3)
      return
    } else if(echo.reply == 3) {
      fetchResponse(4)
      return
    }
    let newReply = document.createElement('div')
    newReply.setAttribute('class', 'd-flex flex-row justify-content-start')
    newReply.innerHTML = reply
    newReply.querySelector('p').innerText = echo.reply
    document.querySelector('#chat-scroll').appendChild(newReply)
    document.querySelector('#chat-scroll').scrollTop = document.querySelector('#chat-scroll').scrollHeight
  }
})())
