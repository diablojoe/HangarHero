$(document).ready(function () {
  $('#loadingmodal').modal('toggle');
  $('#protext').text("Starting to Load");
  $('#probar').css("width", "0%");

  var athing =  new timelines();
  $('#protext').text("Setting up Date Range Pickers");
  $('#probar').css("width", "90%");
  //setup for add aircraft date range picker
  var rangestart = new Date();
  var startstring = (rangestart.getMonth() + 1) + '/' + rangestart.getDate() + '/' +  rangestart.getFullYear();
  var rangeend = new Date();
  rangeend.setDate(rangeend.getDate() + 1);
  var endstring = (rangeend.getMonth() + 1) + '/' + rangeend.getDate() + '/' +  rangeend.getFullYear();
  $('#addacdaterange').daterangepicker({
      "timePicker": true,
      "timePicker24Hour": true,
      "timePickerIncrement": 15,
      "startDate": startstring,
      "endDate": endstring
  }, function(start, end, label) {
    //save this information to the modal props for submission
    $('#addacmodalbody').data("starttime", start.toISOString());
    $('#addacmodalbody').data("endtime", end.toISOString());
  });
  //setup for add equipment date range picker
  $('#addeqdaterange').daterangepicker({
      "timePicker": true,
      "timePicker24Hour": true,
      "timePickerIncrement": 15,
      "startDate": startstring,
      "endDate": endstring
  }, function(start, end, label) {
    //save this information to the modal props for submission
    $('#equipment').data("starttime", start.toISOString());
    $('#equipment').data("endtime", end.toISOString());
  });
  //setup for update vis date range picker
  $('#updatedaterange').daterangepicker({
      "timePicker": true,
      "timePicker24Hour": true,
      "timePickerIncrement": 15,
      "startDate": startstring,
      "endDate": endstring
  }, function(start, end, label) {
    //save this information to the modal props for submission
    $('#updatevis').data("starttime", start.toISOString());
    $('#updatevis').data("endtime", end.toISOString());
  });
  //setup the goto date  picker
  $('#gotime').daterangepicker({
    "singleDatePicker": true,
    "timePicker": true,
    "timePicker24Hour": true,
    "timePickerIncrement": 15,
    "startDate": startstring,
    "endDate": endstring
    }, function(start, end, label) {
      $('#gotime').data("time", start.toISOString());
  });
  $('#loadingmodal').modal('toggle');
});
function  timelines (){
  $('#protext').text("Getting hangar id and date");
  $('#probar').css("width", "5%");
  /*create all the needed variables for vis creation section */
  //hangars id #
  this.hangarId = $('body').data("hangarid");
  //locations where the vis items will be created
  this.scheduleAircraft = document.getElementById('scheduleaircraft');
  this.scheduleEquipment = document.getElementById('scheduleequipment');
  this.movementAircraft = document.getElementById('movementaircraft');
  this.movementEquipment = document.getElementById('movementequipment');
  $('#protext').text("Setting Vis options");
  $('#probar').css("width", "10%");
  //vis options
  this.future = new Date();
  this.future.setDate(this.future.getDate() + 1);
  this.movementOptions = {
    start: new Date(),
    end: this.future,
    editable: false,
    showCurrentTime: true,
    groupOrder: 'content'
  };
  this.ACscheduleOptions = {
    start: new Date(),
    end: this.future,
    selectable: true,
    editable: false,
    showCurrentTime: true,
    groupOrder: 'content'
  };
  this.EQscheduleOptions = {
    start: new Date(),
    end: this.future,
    selectable: true,
    editable: false,

    showCurrentTime: true,
    groupOrder: 'content'
  };
  $('#protext').text("Setting Vis item collections");
  $('#probar').css("width", "15%");
  //item collections for each vis
  this.scheduleAircraftItems = new vis.DataSet({
      type: {
          start: 'ISODate',
          end: 'ISODate'
      }
  });
  this.scheduleEquipmentItems = new vis.DataSet({
      type: {
          start: 'ISODate',
          end: 'ISODate'
      }
  });
  this.movementAircraftItems = new vis.DataSet({
      type: {
          start: 'ISODate',
          end: 'ISODate'
      }
  });
  this.movementEquipmentItems = new vis.DataSet({
      type: {
          start: 'ISODate',
          end: 'ISODate'
      }
  });
  this.groups = new vis.DataSet();
  this.eqgroups = new vis.DataSet();
  /*done creating vairiables */
  //initialize the vis areas and make them accessable from the window
  //this is not best practice but allows for simple callback navigation
  $('#protext').text("Initializing Schedule Aircraft Timeline");
  $('#probar').css("width", "20%");
  this.scheduleAircraftTimeline = new vis.Timeline(this.scheduleAircraft, this.scheduleAircraftItems, this.groups, this.ACscheduleOptions);
  window.scheduleAircraftTimeline = this.scheduleAircraftTimeline;
  $('#protext').text("Initializing Schedule Equipment Timeline");
  $('#probar').css("width", "25%");
  this.scheduleEquipmentTimeline = new vis.Timeline(this.scheduleEquipment, this.scheduleEquipmentItems, this.eqgroups, this.EQscheduleOptions);
  window.scheduleEquipmentTimeline = this.scheduleEquipmentTimeline;
  $('#protext').text("Initializing Movement Aircraft Timeline");
  $('#probar').css("width", "30%");
  this.movementAircraftTimeline = new vis.Timeline(this.movementAircraft, this.movementAircraftItems, this.groups, this.movementOptions);
  window.movementAircraftTimeline = this.movementAircraftTimeline;
  $('#protext').text("Initializing Movement Equipment Timeline");
  $('#probar').css("width", "35%");
  this.movementEquipmentTimeline = new vis.Timeline(this.movementEquipment, this.movementEquipmentItems, this.eqgroups, this.movementOptions);
  window.movementEquipmentTimeline = this.movementEquipmentTimeline;
  $('#protext').text("Initializing Timeline Functions");
  $('#probar').css("width", "40%");
  /* VIS FUNCTIONS */
  //range changed
  this.scheduleAircraftTimeline.on('rangechanged',function (properties) {
    var sd = new Date(Date.parse(properties.start));
    var ed = new Date(Date.parse(properties.end));
    try {
      $.get("/api/acschedule/" + this.hangarId + "$" + sd.toISOString() + "$" + ed.toISOString(), updateACStores.bind(this));
    }catch (err){
      openError(err);
    }
  }.bind(this));
  this.movementAircraftTimeline.on('rangechanged',function (properties) {
    var sd = new Date(Date.parse(properties.start));
    var ed = new Date(Date.parse(properties.end));
    try {
      $.get("/api/acschedule/" + this.hangarId + "$" + sd.toISOString() + "$" + ed.toISOString(), updateACStores.bind(this));
    }catch (err){
      openError(err);
    }
  }.bind(this));
  this.scheduleEquipmentTimeline.on('rangechanged',function (properties) {
    var sd = new Date(Date.parse(properties.start));
    var ed = new Date(Date.parse(properties.end));
    try {
      $.get("/api/eqschedule/" + this.hangarId + "$" + sd.toISOString() + "$" + ed.toISOString(), updateEQStores.bind(this));
    }catch (err){
      openError(err);
    }
  }.bind(this));
  this.movementEquipmentTimeline.on('rangechanged',function (properties) {
    var sd = new Date(Date.parse(properties.start));
    var ed = new Date(Date.parse(properties.end));
    try {
      $.get("/api/eqschedule/" + this.hangarId + "$" + sd.toISOString() + "$" + ed.toISOString(), updateEQStores.bind(this));
    }catch (err){
      openError(err);
    }
  }.bind(this));
  this.movementAircraftTimeline.on('select', function (properties) {
    console.log(properties);
    var item = this.movementAircraftItems.get(properties.items[0]);
    var loc = '/viewer/hangar/' + $('body').data("hangarid") + '$' + item.start;
    console.log(loc);
    window.location.href = loc;
  }.bind(this));
  this.movementEquipmentTimeline.on('select', function (properties) {
    console.log(properties);
    var item = this.movementEquipmentItems.get(properties.items[0]);
    var loc = '/viewer/hangar/' + $('body').data("hangarid") + '$' + item.start;
    console.log(loc);
    window.location.href = loc;
  }.bind(this));
  $('#protext').text("Getting Innitial Aircraft Data Store");
  $('#probar').css("width", "60%");

  var sd = new Date();
  var ed = this.future;
  try {
    $.get("/api/acschedule/" + this.hangarId + "$" + sd.toISOString() + "$" + ed.toISOString(), updateACStores.bind(this));
  }catch (err){
    openError(err);
  }
  $('#protext').text("Getting Innitial Equipment Data Store");
  $('#probar').css("width", "80%");
  try {
    $.get("/api/eqschedule/" + this.hangarId + "$" + sd.toISOString() + "$" + ed.toISOString(), updateEQStores.bind(this));
  }catch (err){
    openError(err);
  }
  //set up the first run  with data

  return this;
}

function updateACStores(data, status){
  var acdata = JSON.parse(data);
  if (acdata !== null) {
    //if there is no error code
    if (!acdata.hasOwnProperty("Code")) {
      var scheduleData = [];
      var serverGroups = [];
      var uniqueGroups = [];
      //fill up an array of all the groups
      for (i = 0; i < acdata.length; i++) {
        serverGroups.push(acdata[i].group);
      }
      //build another array of unique groups
      $.each(serverGroups, function (k, el) {
        if ($.inArray(el, uniqueGroups) === -1) {
          uniqueGroups.push(el);
        }
      });
      //clear the vis list of groups
      this.groups.clear();
      //fill the vis group list
      for (i = 0; i < uniqueGroups.length; i++) {
        this.groups.add({
          id: i,
          content: "<span>" + uniqueGroups[i] + "</span>"
        });
        //associate the ac records with the new group id number
        for (j = 0; j < acdata.length; j++) {
          if (acdata[j].group == uniqueGroups[i]) {
            acdata[j].group = i;
          }
        }
      }

      //get all the background items and make them the schedule items then put a random ID and delete the label in the original
      for (i = 0; i < acdata.length; i++) {
        if (acdata[i].type == "background") {
          var toAdd = jQuery.extend({}, acdata[i]);
          toAdd.type = "";
          acdata[i].content = "";
          acdata[i].id = Math.floor(Math.random() * (999999 - 2 + 1)) + 2;
          scheduleData.push(toAdd);
        }
      }
      this.scheduleAircraftItems.clear();
      this.scheduleAircraftItems.add(scheduleData);
      this.movementAircraftItems.clear();
      this.movementAircraftItems.add(acdata);
    }else {
      if (acdata.Code == 401) {
        window.location.href = "/login";
      }
      openError(acdata.English);
    }
  }
}
function updateEQStores(data, status){
  var eqdata = JSON.parse(data);
  if (eqdata !== null) {
    //if there is no error code
    if (!eqdata.hasOwnProperty("Code")) {
      var scheduleData = [];
      var serverGroups = [];
      var uniqueGroups = [];
      //fill up an array of all the groups
      for (i = 0; i < eqdata.length; i++) {
        serverGroups.push(eqdata[i].group);
      }
      //build another array of unique groups
      $.each(serverGroups, function (k, el) {
        if ($.inArray(el, uniqueGroups) === -1) {
          uniqueGroups.push(el);
        }
      });
      //clear the vis list of groups
      this.eqgroups.clear();
      //fill the vis group list
      for (i = 0; i < uniqueGroups.length; i++) {
        this.eqgroups.add({
          id: i,
          content: "<span>" + uniqueGroups[i] + "</span>"
        });
        //associate the ac records with the new group id number
        for (j = 0; j < eqdata.length; j++) {
          if (eqdata[j].group == uniqueGroups[i]) {
            eqdata[j].group = i;
          }
        }
      }

      //get all the background items and make them the schedule items then put a random ID and delete the label in the original
      for (i = 0; i < eqdata.length; i++) {
        if (eqdata[i].type == "background") {
          var toAdd = jQuery.extend({}, eqdata[i]);
          toAdd.type = "";
          eqdata[i].content = "";
          eqdata[i].id = Math.floor(Math.random() * (999999 - 2 + 1)) + 2;
          scheduleData.push(toAdd);
        }
      }
      this.scheduleEquipmentItems.clear();
      this.scheduleEquipmentItems.add(scheduleData);
      this.movementEquipmentItems.clear();
      this.movementEquipmentItems.add(eqdata);
    }else {
      if (eqdata.Code == 401) {
        window.location.href = "/login";
      }
      openError(eqdata.English);
    }
  }
}
//openError to display error information to the user
function openError(err){
  $('#errormsg').text(err);
  $('#showerror').modal('toggle');
}

function UpdateVis(){
  //get the modal values
  var starttime = $('#updatevis').data("starttime");
  var endtime = $('#updatevis').data("endtime");
  var id = $('#updatevis').data("itemid");
  var type = $('#updatevis').data("type");
  var savedata = {
    Id: id,
    StartTime: starttime,
    EndTime: endtime
  };
  var json = JSON.stringify(savedata);
  //submit to server
  if (type === "aircraft"){
    try {
      $.post("/api/updateacinstance/", json, function (data, status) {
        window.scheduleAircraftTimeline.setWindow(savedata.StartTime, savedata.EndTime);
        window.movementAircraftTimeline.setWindow(savedata.StartTime, savedata.EndTime);
      });
    } catch (err) {
      openError("Unable to contact server. Please check your connection and reload the page");
    }
  }else{
    try {
      $.post("/api/updateeqinstance/", json, function (data, status) {
        window.scheduleEquipmentTimeline.setWindow(savedata.StartTime, savedata.EndTime);
        window.movementEquipmentTimeline.setWindow(savedata.StartTime, savedata.EndTime);
      });
    } catch (err) {
      openError("Unable to contact server. Please check your connection and reload the page");
    }
  }
  $('#updatevis').modal('toggle');
}
//go to hangar model now
function GoNow (){
  var now = new Date();
  var mins = now.getMinutes();
  var quarterHours = Math.round(mins/15);
  if (quarterHours == 4)
  {
      now.setHours(now.getHours()+1);
  }
  var rounded = (quarterHours*15)%60;
  now.setMinutes(rounded);
  now.setSeconds(0);
  now.setMilliseconds(0);
  var loc = '/viewer/hangar/' + $('body').data("hangarid") + '$' + now.toISOString();
  window.location.href = loc;
}
function GoTime (){
  var starttime = $('#gotime').data("time");
  if (starttime){
    var loc = '/viewer/hangar/' + $('body').data("hangarid") + '$' + starttime;
    window.location.href = loc;
  }else{
    openError("Please select a time");
  }
}
function SubmitBug(){
  var text = $('#bugText').val();
  var toSubmit = {
    Text: text
  };
  var json = JSON.stringify(toSubmit);
  try {
    $.post("/viewer/submitbug/", json, function (data, status) {});
  } catch (err) {
    openError("Unable to contact server. Please check your connection and reload the page");
  }
  $('#filebug').modal('toggle');
}
