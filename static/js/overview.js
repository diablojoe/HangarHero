/*global $, vis, document, jQuery, window, location */
/*jslint plusplus: true */
//when the doc is ready setup the search button
$(document).ready(function () {
    //search function for add aircraft dialog
    $('#acSave').prop('disabled', true);
    $("#search").button().click(function (event) {
        var x = document.getElementById("regnumber");
        try {
            $.get("/api/aircraft/" + x.value, function (data, status) {
                if (status == "success") {
                    var acdata = JSON.parse(data);
                    if (!acdata.hasOwnProperty("Code")) {
                        console.log("make " + acdata.Make);
                        console.log("model " + acdata.Model);
                        console.log("name " + acdata.Name);
                        console.log("Id " + acdata.Id);
                        document.getElementById("make").textContent = acdata.Make;
                        document.getElementById("model").textContent = acdata.Model;
                        document.getElementById("acowner").textContent = acdata.Owner;
                        document.getElementById("id").textContent = acdata.Id;
                        var acId = acdata.Id;
                        $('#acSave').prop('disabled', false);
                        console.log(data);
                    } else {
                        openError(acdata.English);
                        if (acdata.Code == 401) {
                            window.location.href = "/login";
                        }
                    }
                } else {
                    openError("Aircraft registration not found");
                }

            });
        } catch (err) {
            openError("Unable to contact server. Please check your connection and reload the page");
        }
    });
    //set up the add aircraft dialog date range picker
    $(function () {
        var startDateTextBox = $('#rangestart');
        var endDateTextBox = $('#rangeend');

        startDateTextBox.datetimepicker({
            timeFormat: 'HH:mm',
            minuteGrid: 15,
            stepMinute: 15,
            onClose: function (dateText, inst) {
                if (endDateTextBox.val() !== '') {
                    var testStartDate = startDateTextBox.datetimepicker('getDate');
                    var testEndDate = endDateTextBox.datetimepicker('getDate');
                    if (testStartDate > testEndDate) {
                        endDateTextBox.datetimepicker('setDate', testStartDate);
                    }
                } else {
                    endDateTextBox.val(dateText);
                }
            },
            onSelect: function (selectedDateTime) {
                endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate'));
            }
        });
        endDateTextBox.datetimepicker({
            timeFormat: 'HH:mm',
            minuteGrid: 15,
            stepMinute: 15,
            onClose: function (dateText, inst) {
                if (startDateTextBox.val() !== '') {
                    var testStartDate = startDateTextBox.datetimepicker('getDate');
                    var testEndDate = endDateTextBox.datetimepicker('getDate');
                    if (testStartDate > testEndDate) {
                        startDateTextBox.datetimepicker('setDate', testEndDate);
                    }
                } else {
                    startDateTextBox.val(dateText);
                }
            },
            onSelect: function (selectedDateTime) {
                startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate'));
            }
        });
    });
    //set up the add equipment dialog date range picker
    $(function () {
        var startDateTextBox = $('#eqrangestart');
        var endDateTextBox = $('#eqrangeend');

        startDateTextBox.datetimepicker({
            timeFormat: 'HH:mm',
            minuteGrid: 15,
            stepMinute: 15,
            onClose: function (dateText, inst) {
                if (endDateTextBox.val() !== '') {
                    var testStartDate = startDateTextBox.datetimepicker('getDate');
                    var testEndDate = endDateTextBox.datetimepicker('getDate');
                    if (testStartDate > testEndDate) {
                        endDateTextBox.datetimepicker('setDate', testStartDate);
                    }
                } else {
                    endDateTextBox.val(dateText);
                }
            },
            onSelect: function (selectedDateTime) {
                endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate'));
            }
        });
        endDateTextBox.datetimepicker({
            timeFormat: 'HH:mm',
            minuteGrid: 15,
            stepMinute: 15,
            onClose: function (dateText, inst) {
                if (startDateTextBox.val() !== '') {
                    var testStartDate = startDateTextBox.datetimepicker('getDate');
                    var testEndDate = endDateTextBox.datetimepicker('getDate');
                    if (testStartDate > testEndDate) {
                        startDateTextBox.datetimepicker('setDate', testEndDate);
                    }
                } else {
                    startDateTextBox.val(dateText);
                }
            },
            onSelect: function (selectedDateTime) {
                startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate'));
            }
        });
    });
    //set up the equipment categories
    $(function () {
        var i;
        $("#equipment").selectmenu({
            width: 200
        });
        $("#categories").selectmenu({
            width: 200,
            change: function (event, data) {
                try {
                    $.get("/api/geteqnames/" + data.item.value, function (data, status) {
                        $("#equipment").empty();
                        if (status != "success") {
                            openError("Unable to get equipment names");
                        } else {
                            var equip = JSON.parse(data);
                            if (!equip.hasOwnProperty("Code")) {
                                for (i = 0; i < equip.length; i++) {
                                    jQuery('<option/>', {
                                        value: equip[i].Id,
                                        text: equip[i].Name
                                    }).appendTo('#equipment');
                                }
                                $("#equipment").selectmenu("refresh");
                            } else {
                                if (equip.Code == 401) {
                                    window.location.href = "/login";
                                }
                                openError(equip.English);
                            }
                        }
                    });
                } catch (err) {
                    openError("Unable to contact server. Please check your connection and reload the page");
                }
            }
        });
        //fill up the cats
        try {
            $.get("/api/getcats/", function (data, status) {
                if (status != "success") {
                    openError("Unable to get categories");
                } else {
                    var cats = JSON.parse(data);
                    if (cats !== null) {
                        if (!cats.hasOwnProperty("Code")) {

                            for (i = 0; i < cats.length; i++) {
                                if (i === 0) {
                                    jQuery('<option/>', {
                                        value: cats[i].Id,
                                        text: cats[i].Name,
                                        selected: 'selected'
                                    }).appendTo('#categories');
                                } else {
                                    jQuery('<option/>', {
                                        value: cats[i].Id,
                                        text: cats[i].Name
                                    }).appendTo('#categories');
                                }
                            }
                        } else {
                            openError(cats.English);
                            if (cats.Code == 401) {
                                window.location.href = "/login";
                            }
                        }
                    }
                }
                try {
                    $("#categories").selectmenu("refresh");
                } catch (err) {
                    console.log("There is nothing to display");
                }
            });
        } catch (err) {
            openError("Unable to contact server. Please check your connection and reload the page");
        }
    });
});

function tabSetup() {
    this.vis = [];
    this.init = function () {
        //get the hangars for this user
        var tabContext = this;
        try {
            $.get("/api/gethangars/", function (data, status) {
                var i;
                if (status == "success") {
                    var hangars = JSON.parse(data);
                    if (!hangars.hasOwnProperty("Code")) {
                        //set up each tab
                        for (i = 0; i < hangars.length; i++) {
                            //construct the tab
                            var hangarId = hangars[i].Id;
                            var baseId = "tabs-" + hangarId;
                            var name = hangars[i].Name;
                            var visId = "vis" + baseId;
                            jQuery('<li/>', {
                                id: 'li' + baseId
                            }).appendTo('#tabTitles');
                            jQuery('<a/>', {
                                href: "#" + baseId,
                                text: name
                            }).appendTo('#li' + baseId);
                            jQuery('<div/>', {
                                id: baseId
                            }).appendTo('#tabs');
                            //add the div for the schedule
                            jQuery('<h3/>', {
                                text: "Schedule"
                            }).appendTo("#" + baseId);
                            jQuery('<div/>', {
                                id: baseId + "schedule"
                            }).appendTo("#" + baseId);
                            jQuery('<h5/>', {
                                text: "Aircraft"
                            }).appendTo('#' + baseId + "schedule");
                            jQuery('<div/>', {
                                id: "schedule" + visId
                            }).appendTo('#' + baseId + "schedule");
                            jQuery('<h5/>', {
                                text: "Equipment"
                            }).appendTo('#' + baseId + "schedule");
                            jQuery('<div/>', {
                                id: "schedule" + visId + "equipment"
                            }).appendTo('#' + baseId + "schedule");

                            //add the div for the model
                            jQuery('<h3/>', {
                                text: "Hangar"
                            }).appendTo("#" + baseId);
                            jQuery('<div/>', {
                                id: baseId + "hangar"
                            }).appendTo("#" + baseId);
                            jQuery('<h5/>', {
                                text: "Aircraft"
                            }).appendTo('#' + baseId + "hangar");
                            jQuery('<div/>', {
                                id: visId
                            }).appendTo('#' + baseId + "hangar");
                            jQuery('<h5/>', {
                                text: "Equipment"
                            }).appendTo('#' + baseId + "hangar");
                            jQuery('<div/>', {
                                id: visId + "equipment"
                            }).appendTo('#' + baseId + "hangar");
                            //construct the vis
                            tabContext.vis.push(new overViewVis(hangars[i].Id, visId + "equipment", "schedule" + visId + "equipment", "/api/eqschedule/", "/api/updateeqinstance/", "/api/removeeqinstance/"));
                            tabContext.vis[tabContext.vis.length - 1].init();

                            tabContext.vis.push(new overViewVis(hangars[i].Id, visId, "schedule" + visId, "/api/acschedule/", "/api/updateacinstance/", "/api/removeacinstance/"));
                            tabContext.vis[tabContext.vis.length - 1].init();
                            //construct the add AC instance Button
                            jQuery('<button/>', {
                                id: baseId + '--link',
                                type: 'button',
                                text: 'Add Aircraft',
                                name: hangars[i].Id,
                                onclick: function () {
                                    location.href = '#';
                                }
                            }).appendTo('#' + baseId + "schedule");
                            //add this as a button in ui
                            $("#" + baseId + '--link').button();
                            //jquery ui open
                            $("#" + baseId + '--link').click(function (event) {
                                //set the owning hangar in the dialog for it can be recovered for the save
                                $("#diagHangarId").text(event.currentTarget.getAttribute("name"));

                                $("#dialog").dialog("open");
                                event.preventDefault();
                            });
                            //construct the add equipment instance Button
                            jQuery('<button/>', {
                                id: baseId + '--linkequipment',
                                type: 'button',
                                text: 'Add Equipment',
                                name: hangars[i].Id,
                                onclick: function () {
                                    location.href = '#';
                                }
                            }).appendTo('#' + baseId + "schedule");
                            //add to button ui
                            $('#' + baseId + '--linkequipment').button();
                            //jquery ui open
                            $("#" + baseId + '--linkequipment').click(function (event) {
                                //set the owning hangar in the dialog for it can be recovered for the save
                                $("#diagHangarId").text(event.currentTarget.getAttribute("name"));
                                $("#dialogequipment").dialog("open");
                                event.preventDefault();
                            });
                            //make the date time picker work
                            jQuery('<input/>', {
                                id: baseId + 'inputdtg'
                            }).appendTo('#' + baseId + "hangar");
                            var goPicker = $('#' + baseId + 'inputdtg');
                            goPicker.datetimepicker({
                                timeFormat: 'HH:mm',
                                minuteGrid: 15,
                                stepMinute: 15
                            });
                            //button to go to picked time
                            jQuery('<button/>', {
                                id: baseId + '--linkdtg',
                                type: 'button',
                                text: 'Go',
                                name: hangars[i].Id
                            }).appendTo('#' + baseId + "hangar");
                            $('#' + baseId + '--linkdtg').button();
                            $('#' + baseId + '--linkdtg').click(function () {
                                var input = $('#' + baseId + 'inputdtg');
                                var dtg = input.datetimepicker('getDate');
                                if (dtg !== null) {
                                    var loc = '/hangarmodel/' + hangarId + '$' + dtg.toISOString();
                                    window.location.href = loc;
                                }
                            });
                            $("#" + baseId).accordion();
                            //button to go to now
                            jQuery('<button/>', {
                                id: baseId + '--linknow',
                                type: 'button',
                                text: 'Now',
                                name: hangars[i].Id
                            }).appendTo('#' + baseId + "hangar");
                            $('#' + baseId + '--linknow').button();
                            $('#' + baseId + '--linknow').click(function () {
                                var dtg = new Date();
                                var loc = '/hangarmodel/' + hangarId + '$' + dtg.toISOString();
                                window.location.href = loc;
                            });
                            $("#" + baseId).accordion();
                        }

                        $("#tabs").tabs("refresh");
                        $("#tabs").tabs("option", "active", 0);
                    } else {
                        if (data.Code == 401) {
                            window.location.href = "/login";
                        }
                        openError(data.English);
                    }
                } else {
                    openError("Error getting hangars");
                }
            });
        } catch (err) {
            openError("Unable to contact server. Please check your connection and reload the page");
        }
    };
    //setup the add aircraft diag
    $("#dialog").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
                id: "acSave",
                text: "Save",
                click: function () {
                    if (OHfromKey === "" || document.getElementById("rangestart").value === "" || document.getElementById("rangeend").value === "") {
                        openError("Make sure to fill out all fields");
                    } else {
                        var input = $('#rangestart');
                        var dtg = input.datetimepicker('getDate');
                        var start = dtg.toISOString();
                        input = $('#rangeend');
                        dtg = input.datetimepicker('getDate');
                        var end = dtg.toISOString();
                        var OHfromKey = $("#diagHangarId").text();
                        var acInstance = {
                            OwningHangar: parseInt(OHfromKey),
                            Registration: document.getElementById("id").textContent,
                            StartTime: start,
                            EndTime: end
                        };
                        console.log(acInstance);

                        var json = JSON.stringify(acInstance);

                        $.post("/api/addacinstance", json, function (data, status) {
                            if (status != "success") {
                                openError("Cannot save aircraft to server");
                            }
                        });
                        $(this).dialog("close");
                    }
                }
                    },
            {
                text: "Cancel",
                click: function () {
                    $(this).dialog("close");
                }
                    }]
    });
    //set up the add equipment dialog
    $("#dialogequipment").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            id: "eqSave",
            text: "Save",
            click: function () {
                if (OHfromKey === "" || document.getElementById("eqrangestart").value === "" || document.getElementById("eqrangeend").value === "") {
                    openError("Make sure to fill out all fields");
                } else {
                    var input = $('#eqrangestart');
                    var dtg = input.datetimepicker('getDate');
                    var start = dtg.toISOString();
                    input = $('#eqrangeend');
                    dtg = input.datetimepicker('getDate');
                    var end = dtg.toISOString();
                    var OHfromKey = $("#diagHangarId").text();
                    var eqInstance = {
                        OwningHangar: parseInt(OHfromKey),
                        Id: $('#categories').value,
                        StartTime: start,
                        EndTime: end
                    };
                    console.log(eqInstance);
                    var json = JSON.stringify(eqInstance);
                    console.log(json);
                    $.post("/api/addeqinstance", json, function (data, status) {
                        if (status != "success") {
                            openError("Cannot save equipment to server");
                        }
                    });
                    $(this).dialog("close");
                }
            }
                }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
                }]
    });
    //set up the add equipment dialog
    $("#dialogerror").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            id: "reload",
            text: "Reload",
            click: function () {
                location.reload();
            }
                }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
                }]
    });
}

function overViewVis(hangarId, containingDiv, scheduleDiv, scheduleAPI, updateAPI, removeAPI) {
    this.d = null;
    this.options = null;
    this.acInstanceStart = null;
    this.acInstanceStop = null;
    this.acId = null;
    this.timeline = null;
    this.items = null;
    this.groups = null;
    this.container = null;
    this.containerName = containingDiv;
    this.scheduleContainer = scheduleDiv;
    this.hangar = hangarId;
    this.scheduleTimeline = null;
    this.scheduleOptions = null;
    this.scheduleItems = null;
    this.scheduleGroups = null;
    this.scheduleAPI = scheduleAPI;
    this.updateAPI = updateAPI;
    this.removeAPI = removeAPI;

    this.init = function () {
        this.d = new Date();
        this.d.setDate(this.d.getDate() + 1);
        //vis display options
        this.options = {
            start: new Date(),
            end: this.d,
            editable: false,
            showCurrentTime: true,
            groupOrder: 'content'
        };
        this.scheduleOptions = {
            start: new Date(),
            end: this.d,
            editable: {
                add: false, // add new items by double tapping
                updateTime: true, // drag items horizontally
                updateGroup: false, // drag items from one group to another
                remove: true // delete an item by tapping the delete button top right
            },
            showCurrentTime: true,
            groupOrder: 'content',
            snap: function (date, scale, step) {
                var hour = 15 * 60 * 1000;
                return Math.round(date / hour) * hour;
            }
        };
        //vis dataset definition
        this.items = new vis.DataSet({
            type: {
                start: 'ISODate',
                end: 'ISODate'
            }
        });
        this.scheduleItems = new vis.DataSet({
            type: {
                start: 'ISODate',
                end: 'ISODate'
            }
        });
        //set up the container for the groups
        this.groups = new vis.DataSet();
        //bring the timeline alive
        this.container = document.getElementById(this.containerName);
        this.timeline = new vis.Timeline(this.container, this.items, this.groups, this.options);
        this.timeline.hangarId = this.hangar;
        this.timeline.items = this.items;
        this.timeline.groups = this.groups;

        //bring the schedule timeline online
        this.container = document.getElementById(this.scheduleContainer);
        this.scheduleTimeline = new vis.Timeline(this.container, this.scheduleItems, this.groups, this.scheduleOptions);
        this.scheduleTimeline.hangarId = this.hangar;
        this.scheduleTimeline.items = this.scheduleItems;
        this.scheduleTimeline.groups = this.groups;

        //callback for the ajax function
        var callback = this;

        //set up the timeline finctions
        this.timeline.on('rangechanged', function (properties) {
            var sd = new Date(Date.parse(properties.start));
            var ed = new Date(Date.parse(properties.end));
            callback.update(sd, ed);
            if (properties.byUser) {
                callback.scheduleTimeline.setWindow(callback.timeline.getWindow());
            }
        });
        this.timeline.on('select', function (properties) {
            console.log(properties);
            var item = callback.items.get(properties.items[0]);
            console.log(item);
            var loc = '/hangarmodel/' + callback.hangar + '$' + item.start;
            console.log(loc);
            window.location.href = loc;
        });
        this.scheduleTimeline.on('rangechanged', function (properties) {
            if (properties.byUser) {
                callback.timeline.setWindow(callback.scheduleTimeline.getWindow());
            }
        });
        this.scheduleItems.on("update", function (event, properties) {
            console.log(properties.data);
            var savedata = {
                Id: properties.data[0].id,
                StartTime: properties.data[0].start,
                EndTime: properties.data[0].end
            };
            var json = JSON.stringify(savedata);
            try {
                $.post(callback.updateAPI, json, function (data, status) {
                    if (status != "success") {
                        openError("Unable to update schedule to server");
                    }
                    var temp = JSON.parse(data);
                    if (temp.hasOwnProperty("Code")) {
                        if (temp.Code == 401) {
                            window.location.href = "/login";
                        }
                        openError(temp.English);
                    }
                });
            } catch (err) {
                openError("Unable to contact server. Please check your connection and reload the page");
            }
        });
        this.scheduleItems.onRemove = (function (event, properties) {
            console.log(properties.data);
            var savedata = {
                Id: properties.data[0].id,
            };
            var json = JSON.stringify(savedata);
            try {
                $.post(callback.removeAPI, json, function (data, status) {
                    if (status != "success") {
                        openError("Unable to update remove schedule from server");
                        var temp = JSON.parse(data);
                        if (temp.hasOwnProperty("Code")) {
                            if (temp.Code == 401) {
                                window.location.href = "/login";
                            }
                            openError(temp.English);
                        }
                    }
                });
            } catch (err) {
                openError("Unable to contact server. Please check your connection and reload the page");
            }
        });
    };
    this.update = function (sd, ed) {
        var callback = this;
        try {
            $.get(callback.scheduleAPI + this.hangar + "$" + sd.toISOString() + "$" + ed.toISOString(), function (data, status) {
                if (status != "success") {
                    openError("Unable to update schedule from server");
                } else {
                    var serverGroups = [];
                    var acdata = JSON.parse(data);
                    if (acdata !== null) {
                        if (!acdata.hasOwnProperty("Code")) {
                            console.log(acdata);
                            var scheduleData = [];
                            if (acdata !== null) {
                                var i;
                                for (i = 0; i < acdata.length; i++) {
                                    serverGroups.push(acdata[i].group);
                                }
                                var uniqueGroups = [];
                                $.each(serverGroups, function (k, el) {
                                    if ($.inArray(el, uniqueGroups) === -1) {
                                        uniqueGroups.push(el);
                                    }
                                });
                                callback.groups.clear();
                                for (i = 0; i < uniqueGroups.length; i++) {
                                    callback.groups.add({
                                        id: i,
                                        content: "<span onclick='tester(this)'>" + uniqueGroups[i] + "</span>"
                                    });
                                    var j;
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
                                console.log(acdata);
                                callback.items.clear();
                                callback.items.add(acdata);
                                callback.scheduleItems.clear();
                                callback.scheduleItems.add(scheduleData);

                            } else {
                                callback.items.clear();
                                callback.scheduleItems.clear();
                                callback.groups.clear();

                            }
                        } else {
                            if (acdata.Code == 401) {
                                window.location.href = "/login";
                            }
                            openError(acdata.English);
                        }
                    }
                }
            });
        } catch (err) {
            openError("Unable to contact server. Please check your connection and reload the page");
        }
    };
}


function openError(thrown) {
    $("#errormsg").text(thrown);
    $("#dialogerror").dialog("open");
}
