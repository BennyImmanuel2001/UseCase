document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      var textElement = document.getElementById('apptext');
  var getContact = client.data.get('contact');
 
  client.data.get("ticket").then(function(data) {
    console.log("ticket >>>>>>>>>" , data)
  },function (err){
    console.log(err)
    console.log("ticket")
  });
  client.data.get("contact").then (
    function(data) {
        console.log("contact")
        console.log(data.contact)
      
    },
    function(error) {
        console.log(error)
  });  
  
  Promise.all([client.data.get("ticket"),client.data.get('contact')]).then(res=>
    {
      console.log(res)

      client.interface.trigger("showModal", {
        title: 'Create a Scheduled Reply',
        template: "view/modal.html",
        data: {}
      });
      
    }).catch(er=>
    {
      console.clear()
      console.log("from app in promise")
      console.log(er)
    })
    // client.data.get("ticket").then (function(data) {
    //   let eventID = `Reply_${ data.ticket.id}`;
    //   console.log(eventID)
    // },function (err){
    //   console.log(err)
    //   console.log("ticket")
    // });



    client.interface.trigger("showModal", {
      title: 'Create a Scheduled Reply',
      template: "view/modal.html",
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
  }
};



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
