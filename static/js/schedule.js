/* global $, vis, document, jQuery, window, location */
/*jslint plusplus: true */
$(document).ready(function () {
    UISetup();
});

function UISetup() {
    $('#acSave').prop('disabled', true);
    $("#search").button().click(ACSearch());
    DateRangePickerSetup('#rangestart', "#rangeend");
    DateRangePickerSetup("#eqrangestart", "#eqrangeend");
    EQCatSetup();
    tabSetup();
}

//Aircraft modal aircraft search
function ACSearch() {
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
}

//Modal date range picker setup
function DateRangePickerSetup(startID, endID) {
    var startDateTextBox = $(startID);
    var endDateTextBox = $(endID);

    startDateTextBox.datetimepicker({
        timeFormat: 'HH:mm',
        minuteGrid: 15,
        stepMinute: 15,
        onClose: function (dateText) {
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
        onSelect: function () {
            endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate'));
        }
    });
    endDateTextBox.datetimepicker({
        timeFormat: 'HH:mm',
        minuteGrid: 15,
        stepMinute: 15,
        onClose: function (dateText) {
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
        onSelect: function () {
            startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate'));
        }
    });
}

//Equipment category setup
function EQCatSetup() {
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
}

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

function openError(thrown) {
    $("#errormsg").text(thrown);
    $("#dialogerror").dialog("open");
}

//helper for links so we are not making functions in a loop
function linkHref() {
    location.href = '#';
}
