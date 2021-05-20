document.onreadystatechange = function () {
    if (document.readyState === 'interactive') renderApp();
  
    function renderApp() {
      var onInit = app.initialized();
  
      onInit.then(getClient).catch(handleErr);
  
      function getClient(_client) {
        window.client = _client;
        client.events.on('app.activated', onAppActivate);
      }
    }
  };
  
  function onAppActivate() {
    var textElement = document.getElementById('apptext');
    var getContact = client.data.get('contact');
  
    client.interface.trigger("showModal", {
      title: 'Edit a Scheduled Reply',
      template: "view/secondModal.html",
      data: {}
    });
    client.instance.receive(
      function(event)  {
        var data = event.helper.getData();
        notifyMe("success",data.message)
        
    });
    getContact.then(showContact).catch(handleErr);
    function showContact(payload) {
      textElement.innerHTML = `Ticket created by ${payload.contact.name}`;
    }
  }
  
  
  function notifyMe(m_type,msg)
  {
    client.interface.trigger("showNotify", {
        type: m_type,
        message: msg
    }).then(function(data) {
        console.log(data)
    });
  }
  
  
  function handleErr(err) {
    console.error(`Error occured. Details:`, err);
  }
  