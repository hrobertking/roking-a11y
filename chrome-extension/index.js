chrome.runtime.onMessage.addListener(function (message, sender, respond) {
  switch (message.text) {
    case 'get_body':
      respond(document.body.innerHTML);
      break;
    case 'set_score':
      document.body.setAttribute('data-readability', message.score);
      break;
    default:
      // ignore
  }
});

