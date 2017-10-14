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
    $('#addacbutton').prop('disabled', false);
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
    $('#addeqbutton').prop('disabled', false);
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
    $('#updatebutton').prop('disabled', false);
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
      $('#gotobutton').prop('disabled', false);
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
    editable: {
      add: true, // add new items by double tapping
      updateTime: true, // drag items horizontally
      updateGroup: false, // drag items from one group to another
      remove: true // delete an item by tapping the delete button top right
    },
    onAdd: function (item, callback) {
      $("#searchaircraft").modal("show");
      callback(null);
    },
    onMove: function (item, callback) {
      console.log("in updateprops" + item);
      var savedata = {
        Id: item.id,
        StartTime: item.start,
        EndTime: item.end
      };
      var json = JSON.stringify(savedata);
        $.post("/api/updateacinstance/", json, function (data, status) {})
        .fail(function() {
          openError("There has been an error in changing the instance time please reload the page");
        });
    },
    onRemove: function (item, callback) {
      var savedata = {
        Id: item.id,
      };
      var json = JSON.stringify(savedata);
      console.log("about to do onRemove for " + json);
      $.post("/api/removeacinstance/", json, function (data, status) {})
      .fail(function() {
        openError("There has been an error in removing the instance time please reload the page");
      });
      callback(item);
    },
    onUpdate: function (item, callback) {
      //get the data from the event
      $('#updatevis').data("itemid", item.id);
      $('#updatevis').data("type", "aircraft");
      //set the calender
      //make the date objects
      var start = new Date(item.start);
      var end = new Date (item.end);
      $('#updatedaterange').data('daterangepicker').setStartDate(start);
      $('#updatedaterange').data('daterangepicker').setEndDate(end);
      //open up the change modal
      $('#updatevis').modal('toggle');
      //do not let vis take care of this
      callback(null);
    },
    showCurrentTime: true,
    groupOrder: 'content',
    snap: function (date, scale, step) {
      var hour = 15 * 60 * 1000;
      return Math.round(date / hour) * hour;
    }
  };
  this.EQscheduleOptions = {
    start: new Date(),
    end: this.future,
    selectable: true,
    editable: {
      add: true, // add new items by double tapping
      updateTime: true, // drag items horizontally
      updateGroup: false, // drag items from one group to another
      remove: true // delete an item by tapping the delete button top right
    },
    onAdd: function (item, callback) {
      openEQCats();
      callback(null);
    },
    onMove: function (item, callback) {
      console.log("in updateprops" + item);
      var savedata = {
        Id: item.id,
        StartTime: item.start,
        EndTime: item.end
      };
      var json = JSON.stringify(savedata);
      $.post("/api/updateeqinstance/", json, function (data, status) {})
        .fail(function() {
          openError("There has been an error in changing the instance time please reload the page");
      });
    },
    onRemove: function (item, callback) {
      var savedata = {
        Id: item.id,
      };
      var json = JSON.stringify(savedata);
      $.post("/api/removeeqinstance/", json, function (data, status) {})
        .fail(function() {
          openError("There has been an error in removing the instance time please reload the page");
      });
      callback(item);
    },
    onUpdate: function (item, callback) {
      //get the data from the event
      $('#updatevis').data("itemid", item.id);
      $('#updatevis').data("type", "equipment");
      //set the calender
      //make the date objects
      var start = new Date(item.start);
      var end = new Date (item.end);
      $('#updatedaterange').data('daterangepicker').setStartDate(start);
      $('#updatedaterange').data('daterangepicker').setEndDate(end);
      //open up the change modal
      $('#updatevis').modal('toggle');
      //do not let vis take care of this
      callback(null);
    },
    showCurrentTime: true,
    groupOrder: 'content',
    snap: function (date, scale, step) {
      var hour = 15 * 60 * 1000;
      return Math.round(date / hour) * hour;
    }
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
    $.get("/api/acschedule/" + this.hangarId + "$" + sd.toISOString() + "$" + ed.toISOString(), updateACStores.bind(this))
      .fail(function() {
        openError("There has been an error in getting aircraft instances");
    });
  }.bind(this));
  this.movementAircraftTimeline.on('rangechanged',function (properties) {
    var sd = new Date(Date.parse(properties.start));
    var ed = new Date(Date.parse(properties.end));
    $.get("/api/acschedule/" + this.hangarId + "$" + sd.toISOString() + "$" + ed.toISOString(), updateACStores.bind(this))
      .fail(function() {
        openError("There has been an error in getting equipment equipment instances");
    });
  }.bind(this));
  this.scheduleEquipmentTimeline.on('rangechanged',function (properties) {
    var sd = new Date(Date.parse(properties.start));
    var ed = new Date(Date.parse(properties.end));
    $.get("/api/eqschedule/" + this.hangarId + "$" + sd.toISOString() + "$" + ed.toISOString(), updateEQStores.bind(this))
      .fail(function() {
        openError("There has been an error in getting aircraft instances");
    });
  }.bind(this));
  this.movementEquipmentTimeline.on('rangechanged',function (properties) {
    var sd = new Date(Date.parse(properties.start));
    var ed = new Date(Date.parse(properties.end));
    $.get("/api/eqschedule/" + this.hangarId + "$" + sd.toISOString() + "$" + ed.toISOString(), updateEQStores.bind(this))
      .fail(function() {
        openError("There has been an error in getting equipment instances");
    });
  }.bind(this));
  this.movementAircraftTimeline.on('select', function (properties) {
    console.log(properties);
    var item = this.movementAircraftItems.get(properties.items[0]);
    var loc = '/hangarmodel/' + $('body').data("hangarid") + '$' + item.start;
    console.log(loc);
    window.location.href = loc;
  }.bind(this));
  this.movementEquipmentTimeline.on('select', function (properties) {
    console.log(properties);
    var item = this.movementEquipmentItems.get(properties.items[0]);
    var loc = '/hangarmodel/' + $('body').data("hangarid") + '$' + item.start;
    console.log(loc);
    window.location.href = loc;
  }.bind(this));
  $('#protext').text("Getting Innitial Aircraft Data Store");
  $('#probar').css("width", "60%");

  var sd = new Date();
  var ed = this.future;
  $.get("/api/acschedule/" + this.hangarId + "$" + sd.toISOString() + "$" + ed.toISOString(), updateACStores.bind(this))
    .fail(function() {
      openError("There has been an error in getting aircraft instances");
  });
  $('#protext').text("Getting Innitial Equipment Data Store");
  $('#probar').css("width", "80%");
  $.get("/api/eqschedule/" + this.hangarId + "$" + sd.toISOString() + "$" + ed.toISOString(), updateEQStores.bind(this))
    .fail(function() {
      openError("There has been an error in getting equipment instances");
  });
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

//Search Aircraft
function SearchAC(){
  var x = $('#countrycode').val();
  x += $("#regnumber").val();
  console.log("searching for " + x);
    $.get("/api/aircraft/" + x, function (data, status) {
      if (status == "success") {
        var acdata = JSON.parse(data);
        if (!acdata.hasOwnProperty("Code")) {
          document.getElementById("make").textContent = acdata.Make;
          document.getElementById("model").textContent = acdata.Model;
          document.getElementById("acowner").textContent = acdata.Owner;
          document.getElementById("acid").textContent = acdata.Id;
          //display the results
          console.log("setting the acid data to " + acdata.Id);
          $('#addacmodalbody').data("acid", acdata.Id);
          $('#searchaircraft').modal('toggle');
          $('#addaircraft').modal('toggle');
        } else {
          $('#searchaircraft').modal('toggle');
          openError(acdata.English);
          if (acdata.Code == 401) {
            window.location.href = "/login";
          }
        }
      } else {
        $('#searchaircraft').modal('toggle');
        openError("Aircraft registration not found");
      }
    })
    .fail(function() {
      openError("There has been an error in searching for a tail number");
  });
}
//Add Aircraft
function AddAc (){
  var OHfromKey = $('body').data("hangarid");
  var starttime = $('#addacmodalbody').data("starttime");
  var endtime = $('#addacmodalbody').data("endtime");
  var aircraft = $('#addacmodalbody').data("acid");
  if (OHfromKey === "" || starttime === "" || endtime === "") {
    openError("Make sure to fill out all fields");
  } else {
    var acInstance = {
      OwningHangar: parseInt(OHfromKey),
      Registration: aircraft,
      StartTime: starttime,
      EndTime: endtime
    };

    var json = JSON.stringify(acInstance);
    $.post("/api/addacinstance", json, function (data, status) {
      if (status != "success") {
        openError("Cannot save aircraft to server");
      }
      //this needs to be checked because it may be out of scope
      window.scheduleAircraftTimeline.setWindow(acInstance.StartTime, acInstance.EndTime);
      window.movementAircraftTimeline.setWindow(acInstance.StartTime, acInstance.EndTime);
    })
    .fail(function() {
      openError("There has been an error adding an aircraft to the schedule");
    });
  }
}
//get categories
function openEQCats(){
  //show yourself
  $('#searchequipmentcat').modal('toggle');

  //get the data
  $("#equipmentcatspinner").show();
  $("#equipmentcatcontainer").hide();
  console.log("about to get eq cats");
  $.get("/api/getcats/", function (data, status){
    if (status != "success") {
      openError("Cannot get categories from the server");
    }else{
      $("#equipmentcat").empty();
      var cats = JSON.parse(data);
      $.each(cats, function (k, el) {
        var opt = $('<option />',{
          value: el.Id,
          text : el.Name,
        });
        $("#equipmentcat").append(opt);
      });
      //get rid of the spinner and show the dropdown
      $("#catspinner").hide();
      $("#equipmentcatcontainer").show();
    }
  })
  .fail(function() {
    openError("There has been an error in getting equipment categories");
  });
}

function equipmentCatNext(){
  //get the selected value and set it in data for the subcategories
  $("#searchequipmentsubcat").data("cat", $("#equipmentcat").val());
  $("#catspinner").show();
  $("#equipmentcatcontainer").hide();
  $('#searchequipmentcat').modal('toggle');
  openEQSubCats();
}
//get subcategories
function openEQSubCats(){
  //show yourself
  $('#searchequipmentsubcat').modal('toggle');
  $("#subcatspinner").show();
  $("#equipmentsubcatcontainer").hide();
  var subcat = $("#searchequipmentsubcat").data("cat");
  $.get("/api/getsubcats/" + subcat, function (data, status){
    if (status != "success") {
      openError("Cannot get sub-categories from the server");
    }else{
      var cats = JSON.parse(data);
      $("#equipmentsubcat").empty();
      $.each(cats, function (k, el) {
        var opt = $('<option />',{
          value: el.Id,
          text : el.Name,
        });
        $("#equipmentsubcat").append(opt);
      });
      //get rid of the spinner and show the dropdown
      $("#subcatspinner").hide();
      $("#equipmentsubcatcontainer").show();
    }
  })
  .fail(function() {
    openError("There has been an error in getting equipment sub-categories");
  });
}

function equipmentSubCatNext(){
  //get the selected value and set it in data for the subcategories
  $("#subcatspinner").show();
  $("#equipmentsubcatcontainer").hide();
  $("#addequipment").data("subcat", $("#equipmentsubcat").val());
  $('#searchequipmentsubcat').modal('toggle');
  openAddEquipment();
}
//add equipment
function openAddEquipment(){
  //show yourself
  $('#addequipment').modal('toggle');

  $("#equipmentspinner").show();
  $("#equipmentcontainer").hide();
  var subcat = $("#addequipment").data("subcat");
  $.get("/api/geteqnames/" + subcat, function (data, status){
    if (status != "success") {
      openError("Cannot get equipment from the server");
    }else{
      var cats = JSON.parse(data);
      $("#equipment").empty();
      $.each(cats, function (k, el) {
        var opt = $('<option />',{
          value: el.Id,
          text : el.Name,
        });
        $("#equipment").append(opt);
      });
      //get rid of the spinner and show the dropdown
      $("#equipmentspinner").hide();
      $("#equipmentcontainer").show();
    }
  })
  .fail(function() {
    openError("There has been an error in getting equipment");
  });
}
//Add Equipment
function AddEq (){
  var OHfromKey = $('body').data("hangarid");
  var starttime = $('#equipment').data("starttime");
  var endtime = $('#equipment').data("endtime");
  var equipment = $("#equipment").val();
  if (OHfromKey === "" || starttime === "" || endtime === "") {
    openError("Make sure to fill out all fields");
  } else {
    var eqInstance = {
      OwningHangar: parseInt(OHfromKey),
      Id: parseInt(equipment),
      StartTime: starttime,
      EndTime: endtime
    };
    console.log(eqInstance);

    var json = JSON.stringify(eqInstance);
    $.post("/api/addeqinstance", json, function (data, status) {
      if (status != "success") {
        openError("Cannot save equipment to server");
      }
      window.scheduleEquipmentTimeline.setWindow(eqInstance.StartTime, eqInstance.EndTime);
      window.movementEquipmentTimeline.setWindow(eqInstance.StartTime, eqInstance.EndTime);
      $('#addequipment').modal('toggle');
    })
    .fail(function() {
      openError("There has been an error in adding equipment");
    });
  }
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
    $.post("/api/updateacinstance/", json, function (data, status) {
      window.scheduleAircraftTimeline.setWindow(savedata.StartTime, savedata.EndTime);
      window.movementAircraftTimeline.setWindow(savedata.StartTime, savedata.EndTime);
    })
    .fail(function() {
      openError("There has been an error in updating vis aircraft");
    });
  }else{
    $.post("/api/updateeqinstance/", json, function (data, status) {
      window.scheduleEquipmentTimeline.setWindow(savedata.StartTime, savedata.EndTime);
      window.movementEquipmentTimeline.setWindow(savedata.StartTime, savedata.EndTime);
    })
    .fail(function() {
      openError("There has been an error in updating vis equipment");
    });
  }
  $('#updatevis').modal('toggle');
}
//go to hangar model now
function GoNow (){
  var now = new Date();
  var mins = now.getMinutes();
  var quarterHours = Math.round(mins/15);
  if (quarterHours == 4){
      now.setHours(now.getHours()+1);
  }
  var rounded = (quarterHours*15)%60;
  now.setMinutes(rounded);
  now.setSeconds(0);
  now.setMilliseconds(0);
  var loc = '/hangarmodel/' + $('body').data("hangarid") + '$' + now.toISOString();
  window.location.href = loc;
}
function GoTime (){
  var starttime = $('#gotime').data("time");
  if (starttime){
    var loc = '/hangarmodel/' + $('body').data("hangarid") + '$' + starttime;
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
  $.post("/api/submitbug/", json, function (data, status) {})
  .fail(function() {
    openError("There has been an error in submitting a bug");
  });
  $('#filebug').modal('toggle');
}
