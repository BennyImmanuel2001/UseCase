app.initialized().then(function(client){

  let eventID="";

  client.data.get("ticket").then (function(data) {
    eventID = `Reply_${ data.ticket.id}`;
  },function (err){
    console.log(err)
    console.log("ticket")
  });

  client.data.get("contact").then (
    function(data) {
        console.log("contact")
        console.log(data)
        document.getElementById('toID').value=data.contact.email;
        //document.getElementById('toID').setAttribute('disabled',true);
      // document.getElementById('toID').value="benny.immanuel@spritle.com";
    },
    function(error) {
      console.log("contact")
      console.log(error)
      // failure operation
    }
  );

  loadStatusAgentAndPriority()
  loadEmails();

  document.getElementById('ticketSubmit').addEventListener('click',ScheduledReply);
  document.getElementById('ticketCancel').addEventListener('click',async  function(){
    client.instance.close();
  });

  function getCC(value){
    let ccID= document.getElementById('ccID').getSelectedItem()
    let ccs="";
     ccID.then((data)=>{ccs= data.map(x=>{return x.value;}).join(',')})
    return ccs
  }

  function loadEmails(){
  
    client.request.get("https://spritlesoftware.freshdesk.com/api/v2/agents", 
    {headers:{
    "Authorization": "Basic <%= encode(iparam.API) %>", 
    contentType:"application/json",
    'content-type': 'application/json',
    datatype : "application/json",}
}).then(function(data) {
    let arr= JSON.parse(data.response);
  



    $('.dd_container').append( ' <fw-select   id="ccID"  placeholder="Your choices" label="" state-text="" multiple ></fw-select>')
    arr.map((a,key) => {
      let eid = a.contact.email;
      
      $('#ccID').append(`<fw-select-option value="${eid}">${eid}</fw-select-option>`)
    
    });
  },function(error) {
    console.error(error)
  });
  }

  function ScheduledReply(){
    var scheduleName =   eventID;
    var scheduleData = await getFieldValues();

    client.request.invoke('createSchedule', {
        scheduleName: scheduleName,
        scheduleData: scheduleData,
      }).then(function(data) {
            console.log("createSchedule")
            console.log(data.response)
            sendNotification("success","Scheduled Event is created for this Ticket")
          }, function(err) {
        console.log("error createSchedule")
        console.log(err.message);
        sendNotification("warning",err.message)
    });
  }

  async function getFieldValues() {
    return {
      subject:document.getElementById('subject').value,
      description: document.getElementById('Msg').value,
      contact: document.getElementById('toID').value,
      status: Number(document.getElementById('Status').value),
      priority: Number(document.getElementById('Priority').value),
      schedule_at: new Date(document.getElementById('time').value).toISOString(),
      cc: await getCC()
    };
  }




  function  loadStatusAgentAndPriority(){
    client.request.get("https://spritlesoftware.freshdesk.com/api/v2/ticket_fields", 
            {headers:{
            "Authorization": "Basic <%= encode(iparam.API) %>", 
            contentType:"application/json",
            'content-type': 'application/json',
            datatype : "application/json",}
        }).then(function(data) {
            let arr= JSON.parse(data.response);
            const status = arr.filter(a => a.name === "status");
            const priority = arr.filter(a => a.name === "priority");
          
  
            let statusChoices=status[0].choices;
            let priorityChoices=priority[0].choices;
            
            let statusSelect = document.getElementById("Status");
            for (Ids in statusChoices) {
                console.log(Ids)
                let option = document.createElement("option");
                option.text =  statusChoices[Ids].toString().split(',')[0];
                option.value =Ids
                statusSelect.appendChild(option);
            }
  
            let prioritySelect = document.getElementById("Priority");
            for (Ids in priorityChoices) {
                console.log(Ids)
                let option = document.createElement("option");
                option.text = Ids
                option.value = priorityChoices[Ids];
                prioritySelect.appendChild(option);
            }
  
          
        },function(error) {
            console.error(error)
    });
  }

  function sendNotification(type, message) {

    client.instance.send({
      message
    });
    client.instance.close();
  }


});




// async function demo() {
//   return {
//     subject:"document.getElementById('subject').value",
//     description: "document.getElementById('Msg').value,",
//     contact: "document.getElementById('toID').value",
//     status: "Number(document.getElementById('Status').value)",
//     priority: "Number(document.getElementById('Priority').value)",
//     schedule_at: "new Date(document.getElementById('time').value).toISOString()",
//     cc: await getCC()
//   };
// }