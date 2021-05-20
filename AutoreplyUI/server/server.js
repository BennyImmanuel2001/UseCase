function manipulateNames(args){
  console.log ("from manipulate")
  var eventNames=[];
  console.log (args)
  if(args.method=="get")
  {
    return new Promise(function(myResolve, myReject) {
      
        myResolve(eventNames);
     
    });
  }
  if(args.method=="set")
  {
    console.log("in set")
    // return function setnames(){
      eventNames.push({name : args.name,subject : args.subject, date : args.date})
      console.log("array")
      console.log(eventNames)
    //}
  }
  if(args.method=="del")
  {
    //.........
  }
}
exports = {

    events: [
      { event: 'onTicketCreate', callback: 'onTicketCreateHandler' },
      { event: "onScheduledEvent", callback: "onScheduledEventHandler" }
    ],
    onScheduledEventHandler: function(payload) {
      console.log("Logging arguments from onScheduledEvent: " +  JSON.stringify(payload));
      var userId = 1111;
      $db.get(`schedules_${userId}`).then(function(then){
          console.log(then)
      }, function(err) {
        if (err.status == 404) {
         
        }
      });
    },
    fetchList: function (args){
      
      let getnames= manipulateNames({method : "get"});
      console.log(getnames)
      getnames.then((names)=>{
        console.log("ser names")
        console.log(names)
        console.log("ser names")
      })
    },
    fetchSingle : function (args){
      $schedule.fetch({
        name: args.name
      })
      .then(function(data) {
        console.log("fetch data")
        console.log(data)
        renderData(null,  data);
          //"data" is a json with name, data and schedule_at used to create the schedule
      }, function(err) {
        console.log("fetch error")
        console.log(err)
        renderData(err);
          // “err” is a json with status and message.
      });
    },
    deleteSchedule: function(args){
      $schedule.delete({
        name: args.name
      })
      .then(function(data) {
        console.log("delete")
        console.log(data)
        renderData(null,data)
        //"data" is a json with status and message.
      }, function(err) {
        console.log("delete")
        console.log(err)
        renderData(err);

        //"err" is a json with status and message.
      });
    },
    createSchedule: function(args) {
      
      let name = args.scheduleName;
      let subject = args.scheduleData.subject
      let date = args.scheduleData.schedule_at
      $schedule.create({
        name: args.scheduleName,
        data: args.scheduleData,
        schedule_at: args.scheduleData.schedule_at
      }).then(function(data) {
        console.log("create data")
        console.log(data)
       
        renderData(null,  {name,subject,date});
      }, function(err) {
        console.log("create err")
        console.log(err)
        renderData(err);
      });
    },
  
    onTicketCreateHandler: function(args) {
      console.log(args['data'])
      console.log("__________________")
      console.log(args)
      console.log('Hello ' + args['data']['requester']['name']);
    },

    updateSchedule:function(args){
      console.log(args)
      $schedule.update({
        name: args.scheduleName,
        data: args.scheduleData,
        schedule_at: args.scheduleData.schedule_at
      })
      .then(function(data) {
        console.log("data update")
        console.log(data)
        renderData(null,data)
          //"data" is a json with status and message.
      }, function(err) {
        console.log("update err")
        console.log(err)
        renderData(err)
          //"err" is a json with status and message.
      });
    }
    
  };