const reply = '<div>' +
  '<p class="small p-2 ms-3 mb-1"' +
    'style="background-color: #f5f6f7; border-radius: 15px 15px 15px 0px"></p>' +
'</div>';

const sent = '<div>' +
  '<p class="small p-2 me-3 mb-1 text-white bg-primary"' +
    'style="border-radius: 15px 15px 0px 15px"></p>' +
'</div>';

const postMsg = async() => {
  const msg = document.querySelector('#chat-input').value
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
    let newReply = document.createElement('div')
    newReply.setAttribute('class', 'd-flex flex-row justify-content-start')
    newReply.innerHTML = reply
    newReply.querySelector('p').innerText = echo.reply
    document.querySelector('#chat-scroll').appendChild(newReply)
    document.querySelector('#chat-scroll').scrollTop = document.querySelector('#chat-scroll').scrollHeight
  }
})())
