/*global $, document, location, jQuery */
$(document).ready(function () {
    $("#tabs").tabs();
    $(".jqButton").button();
    updateMenus();

    //error dialog
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
    //Model dialogs
    //add model
    $("#dialogAddModel").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Save",
            click: function () {
                //post the results to the server
                var toSave = {
                    Name: $('#dialogAddModel-Name').val(),
                    DaeLocation: $('#dialogAddModel-Model').val()
                };
                console.log(toSave);
                $.post("/admin/adddaelocation", toSave, function (data, status) {
                    if (status == "success") {
                        updateMenus();
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });
    //edit model
    $("#dialogEditModel").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Save",
            click: function () {
                //post the results to the server
                var toSave = {
                    Id: $('#dialogAddModelId').text(),
                    Name: $('#dialogAddModel-Name').val(),
                    DaeLocation: $('#dialogAddModel-Name').val()
                };
                console.log(toSave);
                $.post("", toSave, function (data, status) {
                    updateMenus();
                    if (status == "success") {
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });
    //remove model
    $("#dialogRemoveModel").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Confirm",
            click: function () {
                //post the results to the server
                var toRemove = {
                    Id: $('#dialogRemoveModelId').text(),
                };
                console.log(toRemove);
                $.post("/admin/removedaelocation", toRemove, function (data, status) {
                    if (status == "success") {
                        updateMenus();
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });



    $('#modelAdd').click(function AddModel() {
        $("#dialogAddModel").dialog("open");
    });

    $('#modelEdit').click(function EditModel() {
        $('#dialogEditModelId').text($('#modelSelect').val());
        $("#dialogEditModel").dialog("open");
    });

    $('#modelRemove').click(function RemoveModel() {
        $('#dialogRemoveModelId').text($('#modelSelect').val());
        $("#dialogRemoveModel").dialog("open");
    });

    //Manufacturer dialogs
    //add Manufacturer
    $("#dialogAddManufacturer").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Save",
            click: function () {
                //post the results to the server
                var toSave = {
                    Name: $('#dialogAddManufacturer-Name').val()
                };
                $.post("/admin/addmanufacturer", toSave, function (data, status) {
                    if (status == "success") {
                        updateMenus();
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });
    //edit Manufacturer
    $("#dialogEditManufacturer").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Save",
            click: function () {
                //post the results to the server
                var toSave = {
                    Id: $('#dialogEditManufacturerId').text(),
                    Name: $('#dialogEditManufacturer-Name').val(),
                };
                console.log(toSave);
                $.post("/admin/editmanufacturer", toSave, function (data, status) {
                    if (status == "success") {
                        updateMenus();
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });
    //remove Manufacturer
    $("#dialogRemoveManufacturer").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Confirm",
            click: function () {
                //post the results to the server
                var toRemove = {
                    Id: $('#dialogRemoveManufacturerId').text(),
                };
                console.log(toRemove);
                $.post("/admin/removemanufacturer", toRemove, function (data, status) {
                    if (status == "success") {
                        updateMenus();
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });



    $('#manufacturerAdd').click(function AddManufacturer() {
        $("#dialogAddManufacturer").dialog("open");
    });

    $('#manufacturerEdit').click(function EditManufacturer() {
        $('#dialogEditManufacturerId').text($('#modelSelect').val());
        $("#dialogEditManufacturer").dialog("open");
    });

    $('#manufacturerRemove').click(function RemoveManufacturer() {
        $('#dialogRemoveManufacturerId').text($('#modelSelect').val());
        $("#dialogRemoveManufacturer").dialog("open");
    });

    //acModel dialogs
    //add acModel
    $("#dialogAddacModel").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Save",
            click: function () {
                //post the results to the server
                var toSave = {
                    Name: $('#dialogAddacModel-Name').val(),
                    MakerId: $('#dialogAddacModel-Manufacturer').val(),
                    DaeId: $('#dialogAddacModel-Model').val()
                };
                $.post("/admin/addacmodel", toSave, function (data, status) {
                    if (status == "success") {
                        $(this).dialog("close");
                        updateMenus();
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });
    //edit acModel
    $("#dialogEditacModel").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Save",
            click: function () {
                //post the results to the server
                var toSave = {
                    Id: $('#dialogEditacModelId').text(),
                    Name: $('#dialogEditacModel-Name').val(),
                    MakerId: $('#dialogEditacModel-Manufacturer').val(),
                    DaeId: $('#dialogEditacModel-Model').val()
                };
                console.log(toSave);
                $.post("/admin/editacmodel", toSave, function (data, status) {
                    if (status == "success") {
                        updateMenus();
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });
    //remove acModel
    $("#dialogRemoveacModel").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Confirm",
            click: function () {
                //post the results to the server
                var toRemove = {
                    Id: $('#dialogRemoveacModelId').text(),
                };
                console.log(toRemove);
                $.post("/admin/removeacmodel", toRemove, function (data, status) {
                    updateMenus();
                    if (status == "success") {
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });



    $('#acModelAdd').click(function AddacModel() {
        $("#dialogAddacModel").dialog("open");
    });

    $('#acModelEdit').click(function EditacModel() {
        $('#dialogEditacModelId').text($('#modelSelect').val());
        $("#dialogEditacModel").dialog("open");
    });

    $('#acModelRemove').click(function RemoveacModel() {
        $('#dialogRemoveacModelId').text($('#modelSelect').val());
        $("#dialogRemoveacModel").dialog("open");
    });

    //equipmentCat dialogs
    //add equipmentCat
    $("#dialogAddequipmentCat").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Save",
            click: function () {
                //post the results to the server
                var toSave = {
                    Name: $('#dialogAddequipmentCat-Name').val(),
                };
                $.post("/admin/addequipmentcat", toSave, function (data, status) {
                    if (status == "success") {
                        updateMenus();
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });
    //edit equipmentCat
    $("#dialogEditequipmentCat").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Save",
            click: function () {
                //post the results to the server
                var toSave = {
                    Id: $('#dialogEditequipmentCatId').text(),
                    Name: $('#dialogEditequipmentCat-Name').val(),
                };
                console.log(toSave);
                $.post("/admin/editequipmentcat", toSave, function (data, status) {
                    if (status == "success") {
                        updateMenus();
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });
    //remove equipmentCat
    $("#dialogRemoveequipmentCat").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Confirm",
            click: function () {
                //post the results to the server
                var toRemove = {
                    Id: $('#dialogRemoveequipmentCatId').text(),
                };
                console.log(toRemove);
                $.post("/admin/removeequipmentcat", toRemove, function (data, status) {
                    if (status == "success") {
                        updateMenus();
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });



    $('#equipmentCatAdd').click(function AddequipmentCat() {
        $("#dialogAddequipmentCat").dialog("open");
    });

    $('#equipmentCatEdit').click(function EditequipmentCat() {
        $('#dialogEditequipmentCatId').text($('#modelSelect').val());
        $("#dialogEditequipmentCat").dialog("open");
    });

    $('#equipmentCatRemove').click(function RemoveequipmentCat() {
        $('#dialogRemoveequipmentCatId').text($('#modelSelect').val());
        $("#dialogRemoveequipmentCat").dialog("open");
    });
    //Equipment dialogs
    //add Equipment
    $("#dialogAddEquipment").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Save",
            click: function () {
                //post the results to the server
                var toSave = {
                    Name: $('#dialogAddEquipment-Name').val(),
                    MakerId: $('#dialogAddEquipment-Cat').val(),
                    DaeId: $('#dialogAddEquipment-Model').val()
                };
                $.post("/admin/addequipment", toSave, function (data, status) {
                    if (status == "success") {
                        updateMenus();
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });
    //edit Equipment
    $("#dialogEditEquipment").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Save",
            click: function () {
                //post the results to the server
                var toSave = {
                    Id: $('#dialogEditEquipmentId').text(),
                    Name: $('#dialogEditEquipment-Name').val(),
                    MakerId: $('#dialogEditEquipment-Cat').val(),
                    DaeId: $('#dialogEditEquipment-Model').val()
                };
                console.log(toSave);
                $.post("/admin/editequipment", toSave, function (data, status) {
                    if (status == "success") {
                        updateMenus();
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });
    //remove Equipment
    $("#dialogRemoveEquipment").dialog({
        autoOpen: false,
        width: 400,
        buttons: [{
            text: "Confirm",
            click: function () {
                //post the results to the server
                var toRemove = {
                    Id: $('#dialogRemoveEquipmentId').text(),
                };
                console.log(toRemove);
                $.post("", toRemove, function (data, status) {
                    if (status == "success") {
                        updateMenus();
                        $(this).dialog("close");
                    } else {
                        openError("unable to save");
                    }
                });

            }
            }, {
            text: "Cancel",
            click: function () {
                $(this).dialog("close");
            }
            }]
    });



    $('#equipmentAdd').click(function AddEquipment() {
        $("#dialogAddEquipment").dialog("open");
    });

    $('#equipmentEdit').click(function EditEquipment() {
        $('#dialogEditEquipmentId').text($('#modelSelect').val());
        $("#dialogEditEquipment").dialog("open");
    });

    $('#equipmentRemove').click(function RemoveEquipment() {
        $('#dialogRemoveEquipmentId').text($('#modelSelect').val());
        $("#dialogRemoveEquipment").dialog("open");
    });

    function openError(thrown) {
        $("#errormsg").text(thrown);
        $("#dialogerror").dialog("open");
    }

    function updateMenus() {
        //get models
        $.get("/admin/listmodels", function (data, status) {
            if (status === "success") {
                var options = JSON.parse(data);
                $('.modellist').each(function () {
                    $(this).empty();
                    console.log(options);
                    var i;
                    for (i = 0; i < options.length; i++) {
                        jQuery('<option/>', {
                            value: options[i].Id,
                            text: options[i].Name
                        }).appendTo($(this));
                    }
                });
            } else {
                openError("Unable to get models");
            }
        });
        //get manufacturers
        $.get("/admin/listmanufacturers", function (data, status) {
            if (status === "success") {
                var options = JSON.parse(data);
                $('.manufacturerlist').each(function () {
                    $(this).empty();
                    var i;
                    for (i = 0; i < options.length; i++) {
                        jQuery('<option/>', {
                            value: options[i].Id,
                            text: options[i].Name
                        }).appendTo($(this));
                    }
                });
            } else {
                openError("Unable to get models");
            }
        });
        //get categories
        $.get("/admin/listequipmentcat", function (data, status) {
            if (status === "success") {
                var options = JSON.parse(data);
                $('.equipmentcatlist').each(function () {
                    $(this).empty();
                    var i;
                    for (i = 0; i < options.length; i++) {
                        jQuery('<option/>', {
                            value: options[i].Id,
                            text: options[i].Name
                        }).appendTo($(this));
                    }
                });
            } else {
                openError("Unable to get models");
            }
        });
        //get equipment
        $.get("/admin/listequipment", function (data, status) {
            if (status === "success") {
                var options = JSON.parse(data);
                $('.equipmentlist').each(function () {
                    $(this).empty();
                    var i;
                    for (i = 0; i < options.length; i++) {
                        jQuery('<option/>', {
                            value: options[i].Id,
                            text: options[i].Name
                        }).appendTo($(this));
                    }
                });
            } else {
                openError("Unable to get models");
            }
        });
        $.get("/admin/listacModel", function (data, status) {
            if (status === "success") {
                var options = JSON.parse(data);
                $('.acmodellist').each(function () {
                    $(this).empty();
                    var i;
                    for (i = 0; i < options.length; i++) {
                        jQuery('<option/>', {
                            value: options[i].Id,
                            text: options[i].Name
                        }).appendTo($(this));
                    }
                });
            } else {
                openError("Unable to get models");
            }
        });
    }

});
