app.initialized().then(async function(client){
  var ticketID="";
  let id="";
  await client.data.get("ticket").then (function(data) {
    id = `Reply_${ data.ticket.id}`;
  });
  
  ticketID= id
  let UpdateBtn = document.getElementById('UpdateChanges');
  UpdateBtn.addEventListener('click',updateSchedule);
  
  document.getElementById('cancelChanges').addEventListener('click', function(){
   client.instance.close();
  });

  document.getElementById('delbtn').addEventListener('click', function(){
    deleteEvent(id);
  });

  await loadData(id);
  
  function loadData(userId) {
    console.log(userId)
    console.log("userId")
    client.request.invoke('fetchSingle', {
        name:userId
      }).then(function(data) {
        
        console.log("fetch single")
        console.log(data)
        setValue(data)
      }, function(err) {
        console.log(err);

    });
  }

  function deleteEvent(eventid)
  {
    client.request.invoke('deleteSchedule', {
      name:eventid
    }).then(function(data) {
      
      console.log("fetch single")
      console.log(data)
     
      sendNotification("success","Schedule Event is deleted")

    }, function(err) {
      console.log(err);

    });
  }

  function setValue(val){
    console.log(parseInt(val.response.data.priority))
    console.log(parseInt(val.response.data.status))
    console.log(val.response.data.status)
    document.getElementById('toID').value= val.response.data.contact;
    document.getElementById('toID').setAttribute('disabled',true);
    document.getElementById('subject').value= val.response.data.subject;
    document.getElementById('Msg').value= val.response.data.description;
    loadCC(val.response.data.cc)
    loadStatusAgentAndPriority(val.response.data.status,val.response.data.priority);
    setDate(val.response.data.schedule_at)

  }

  function loadCC(vale){
    let val = vale.split(',')
    document.getElementById('ccID').setSelectedValues(val) ;
  }

  function setDate(val)
  {

    var date = new Date(val);
    var dt = date.getDate()
    var month =(date.getMonth()+1)

    if (dt < 10) {
    dt = '0' + dt;
    }
    if (month < 10) {
    month = '0' + month;
    }
    
    var hh=date.getHours()

    if(hh.toString().length<2)
    {
    hh= "0"+hh
    }

    var d = date.getFullYear()+'-' + month + '-'+dt;
    
    
    d+="T"+hh +":"+date.getMinutes()
    

    document.getElementById('time').value=d
  }

  function  loadStatusAgentAndPriority(status_val,priority_val){
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
          statusSelect.value=status_val

          let prioritySelect = document.getElementById("Priority");
          for (Ids in priorityChoices) {
              console.log(Ids)
              let option = document.createElement("option");
              option.text = Ids
              option.value = priorityChoices[Ids];
              prioritySelect.appendChild(option);
          }
          prioritySelect.value= priority_val

        
      },function(error) {
          console.error(error)
    });
  }

  async function updateSchedule(){


    var scheduleName =   ticketID;

    var scheduleData = await getFieldValues();


    client.request.invoke('updateSchedule', {
        scheduleName: scheduleName,
        scheduleData: scheduleData,
      }).then(function(data) {
            console.log("updateSchedule")
            console.log(data)
            sendNotification("success","Scheduled Event is Updated for this Ticket")
      }, function(err) {
        console.log(err);

    });
  }

  async function getCC(value){
    let ccID= document.getElementById('ccID').getSelectedItem()
    let ccs="";
    await ccID.then((data)=>{
      ccs= data.map(x=>{return x.value;}).join(',')
    })
    return ccs
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

  function sendNotification(type, message) {

    client.instance.send({
      message
    });
    client.instance.close();
  
  }
});