<!DOCTYPE html>
<html>

<head>
    <!--<script src='http://betterjs.org/build/better.js'></script> -->
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="description" content="" />
    <meta name="keywords" content="" />

    <!--[if lte IE 8]><script src="js/html5shiv.js"></script><![endif]-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>
    <script src="/static/js/skel.min.js"></script>
    <script src="/static/js/skel-layers.min.js"></script>
    <script src="/static/js/init.js"></script>
    <noscript>
        <link rel="stylesheet" href="static/css/skel.css" />
        <link rel="stylesheet" href="static/css/style.css" />
        <link rel="stylesheet" href="static/css/style-xlarge.css" />
    </noscript>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r77/three.min.js"></script>
    <script src="/static/js/OrbitControls.js"></script>
    <script src="/static/js/threex.collider.js"></script>
    <script src="/static/js/threex.collidersystem.js"></script>
    <script src="/static/js/threex.colliderhelper.js"></script>
    <script src="/static/js/OBJLoader.js"></script>
    <script src="/static/js/EventsControls.js"></script>
    <script src="/static/js/OBJExporter.js"></script>
    <script src="/static/js/render.js"></script>


    <!-- Include JQUERY Widgets -->
    <link href="https://code.jquery.com/ui/1.11.4/themes/redmond/jquery-ui.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
    <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>

    <!-- Include Font -->
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
    <!-- Include pips for slider -->
    <script src="/static/js/jquery-ui-slider-pips.js"></script>
    <link href="/static/css/jquery-ui-slider-pips.css" rel="stylesheet">
    <script src="/static/js/queen3d.js"></script>
    <style>
        #canvas {
            width: 80%;
            height: 70%;
            float: left;
        }
        
        #accordion {
            width: 20%;
            height: 70%;
            float: right;
        }
        
        #slider {
            clear: both;
            width: 80%;
        }
        
        #navigation {
            clear: both;
            margin-top: 0px;
            margin-bottom: 0px;
            margin-right: 0px;
            margin-left: 0px;
        }
        
        .left {
            float: left;
            width: 33%;
        }

    </style>
</head>

<body>
    <header id="header" class="skels-layers-fixed" style="height:3em;">
        <h1><strong><a href="/">HangarHero.com</a></strong></h1>
        <nav id="nav">
            <ul>
                <li><a href="/manager">Schedule</a></li>
                <li><a href="/logout">Log Out</a></li>
            </ul>
        </nav>
    </header>
    <section id="main" class="wrapper" style="padding-top:.1em;">
        <div class="container">
            <div id="canvas">
            </div>
            <div id="accordion">
            </div>
            <div id="slider"></div>
            <br>
            <div id="navigation">
                <div class="left">
                    <button id="previous">Previous Day</button>
                </div>
                <div class="left">
                    <button id="save">Save</button>
                </div>
                <div class="left">
                    <button id="next">Next Day</button>
                </div>
            </div>
        </div>
    </section>
    <!-- Footer -->
    <footer id="footer">
        <div class="container">
            <ul class="copyright">
                <li>&copy; HangarHero.com</li>
            </ul>
        </div>
    </footer>
    <div id="dialogerror" title="Error" style="z-index:15000;">
        <div class="ui-widget">
            <div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">
                <p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>
                    <strong>Alert:</strong> <span id="errormsg"></span></p>
            </div>
        </div>
    </div>
    <script>
        $("#dialogerror").dialog({
            autoOpen: false,
            width: 400,
            buttons: [{
                id: "reload",
                text: "Reload",
                click: function() {
                    location.reload();
                }
            }, {
                text: "Cancel",
                click: function() {
                    $(this).dialog("close");
                }
            }]
        });
        var stringdate = {{.date}};
        var hangarId = {{.hangar}};
        var time = new Date(stringdate);
        var scene = init(hangarId);
        var activeNames = [];
        $.get("/api/renderinstance/" + hangarId + "$" + time.toISOString(), function(data, status) {


        });
        $("#slider").slider({
            max: 24,
            step: .25
        }).slider("pips", {
            rest: "label",
            step: 4,
            suffix: ":00"
        });
        
        $('#slider').slider({
            change: function(event, ui) {
                //clear the accordion
                $("#accordion").empty();
                $("#accordion").accordion("refresh");
                clear(scene);
                //figure out the time we want
                var hour = Math.floor(ui.value);
                var minfrac = ui.value - hour;
                var minutes = fracToMin(minfrac);
                time.setHours(hour);
                time.setMinutes(minutes);
                $.get("/api/renderinstance/" + hangarId + "$" + time.toISOString(), function(data, status) {
                    savedata = JSON.parse(data);
                    console.log(savedata);
                    if (!savedata.hasOwnProperty("Code")) {
                        var hangarDefinition = savedata.Hangar.Definition;
                        addFloor(scene, hangarDefinition);
                        console.log(savedata);
                        if (savedata.AClines != null) {

                            for (var i = 0; i < savedata.AClines.length; i++) {
                                if (savedata.AClines[i].Instance.ModelInfo.ObjectRef != null) {
                                    add3d(scene, savedata.AClines[i].Instance.ModelInfo.ObjectRef.Location, savedata.AClines[i].Instance.Registration.Id, savedata.AClines[i].Id, savedata.AClines[i].Position, savedata.AClines[i].Rotation, true);
                                    activeNames.push("AC" + savedata.AClines[i].Id);
                                }
                            }
                        }
                        if (savedata.EQlines != null) {
                            for (var i = 0; i < savedata.EQlines.length; i++) {
                                if (savedata.EQlines[i].Instance.ModelInfo.ObjectRef != null) {
                                    add3d(scene, savedata.EQlines[i].Instance.ModelInfo.ObjectRef.Location, savedata.EQlines[i].Instance.ModelInfo.Name, savedata.EQlines[i].Id, savedata.EQlines[i].Position, savedata.EQlines[i].Rotation, false);
                                    activeNames.push("EQ" + savedata.EQlines[i].Id);
                                }
                            }
                        }
                    }else{
                        if (savedata.Code == 401) {
                                window.location.href = "/login";
                        }
                        openError(savedata.English);
                    }
                });
            }
        });
        $("#accordion").accordion({
            heightStyle: "content"
        });
        var startloc = dateToFrac(time);
        $("#slider").slider("option", "value", startloc);
        $(function() {});
        $("#logout")
            .button()
            .click(function(event) {
                window.location.href = "/logout"
            });
        $("#save")
            .button()
            .click(function(event) {
                save();
            });
        $("#next")
            .button()
            .click(function(event) {
                next();
            });
        $("#previous")
            .button()
            .click(function(event) {
                previous();
            });

    </script>
</body>

</html>
