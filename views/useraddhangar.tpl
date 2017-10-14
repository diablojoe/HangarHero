<!DOCTYPE html>
<html>

<head>
    <title>Add Hangar</title>
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

    <!-- Include JQUERY Widgets -->
    <link href="https://code.jquery.com/ui/1.11.4/themes/redmond/jquery-ui.css" rel="stylesheet">

    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
    <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>

    <!-- Include Charts -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.1.0/sigma.min.js"></script>
    <style>
        #graph-container {
            max-width: 400px;
            height: 400px;
            margin: auto;
            border: 2px solid #666;
            border-radius: 5px;
        }

    </style>
</head>

<body>
    <header id="header" class="skels-layers-fixed">
        <h1><strong><a href="/">HangarHero.com</a></strong></h1>
        <nav id="nav">
            <ul>
                <li><a href="/manager">Schedule</a></li>
                <li><a href="/logout">Log Out</a></li>
            </ul>
        </nav>
    </header>
    <section id="one" class="wrapper style1">
        <div class="container 75%">
            <div class="row 200%">
                <div class="6u 12u$(medium)">
                    <div class="row uniform">
                        <input type="text" name="name" id="hangarname" style="padding:0;">
                        <div id="pointContainer">
                            <div class="pointset row uniform 50%" id="n0">
                                <input type="number" name="x" class="point" style="width:50%;">
                                <input type="number" name="y" class="point" style="width:50%;">
                            </div>
                            <div class="pointset row uniform 50%" id="n1">
                                <input type="number" name="x" class="point" style="width:50%;">
                                <input type="number" name="y" class="point" style="width:50%;">
                            </div>
                            <div class="pointset row uniform 50%" id="n2">
                                <input type="number" name="x" class="point" style="width:50%;">
                                <input type="number" name="y" class="point" style="width:50%;">
                            </div>
                        </div>
                    </div>
                    <button id="addField">Add Field</button>
                    <button id="submit">Submit</button>
                </div>
                <div class="6u$ 12u$(medium)">
                    <div id="graph-container"></div>
                </div>
            </div>
        </div>
    </section>
    <footer id="footer">
        <div class="container">
            <ul class="copyright">
                <li>&copy; HangarHero.com</li>
            </ul>
        </div>
    </footer>

    <!-- Error Diag -->
    <div id="dialogerror" title="Error">
        <div class="ui-widget">
            <div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">
                <p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>
                    <strong>Alert:</strong> <span id="errormsg"></span></p>
            </div>
        </div>
    </div>
    <script>
        onload = function() {
            var data = {
                nodes: [],
                edges: []
            };
            s = new sigma({
                graph: data,
                container: 'graph-container',
                settings: {
                    minNodeSize: 4,
                    maxNodeSize: 2,
                    minEdgeSize: 1,
                    maxEdgeSize: 1,
                    labelThreshold: 0
                }
            });
            var totalPoints = 3;

            //sigma setup
            $.each($(".point"), function(k, v) {
                v.oninput = updateDrawing;
            });


            function updateDrawing() {
                data.nodes.length = 0;
                data.edges.length = 0;
                $.each($(".pointset"), function(k, v) {
                    var node = new Object();
                    node.x = v.children[0].value;
                    var yinit = v.children[1].value
                    console.log("the y value before inverting is: " + yinit);
                    var yinv = (v.children[1].value) * (-1);
                    console.log("the y value after inverting is: " + yinv);
                    node.y = yinv;
                    node.size = 1;
                    node.id = v.id;
                    node.label = "(" + v.children[0].value + "," + node.y = v.children[1].value + ")";
                    if (node.x != "" && node.y != "") {
                        data.nodes[k] = node;
                    }
                });
                if (data.nodes.length > 1) {
                    var last;
                    for (var i = 0; i < data.nodes.length; i++) {
                        var edge = new Object();
                        edge.source = data.nodes[i].id;
                        if (i == data.nodes.length - 1) {
                            //final point conenct to start
                            edge.target = data.nodes[0].id;
                        } else {
                            edge.target = data.nodes[i + 1].id;
                        }
                        edge.id = "e" + i
                        data.edges.push(edge);
                    }


                }
                console.log(data.nodes);
                console.log(data.edges);
                s.graph.clear();
                s.graph.read(data)
                s.refresh();
            }
            $("#submit")
                .button()
                .click(function(event) {
                    event.preventDefault();
                    console.log(data);
                    //role up the results to what the server is wanting
                    console.log($("#hangarname").val())
                    var name = $("#hangarname").val();
                    var rawReturn = {
                        points: [],
                        name: ""
                    }
                    rawReturn.name = name;
                    for (var i = 0; i < data.nodes.length; i++) {
                        var node = {
                            x: 0,
                            y: 0
                        }
                        node.x = data.nodes[i].x;
                        node.y = data.nodes[i].y;
                        rawReturn.points.push(node);
                    }
                    if (name === "" || name == null) {
                        openError("This hangar needs a name");
                    } else if (rawReturn.points.length < 3) {
                        openError("Please enter at least three points");
                    } else {
                        var intReturn = {
                            name: "",
                            definition: ""
                        }
                        intReturn.name = rawReturn.name;
                        intReturn.definition = JSON.stringify(rawReturn.points);
                        fintReturn = JSON.stringify(intReturn);
                        console.log(fintReturn);
                    }
                });
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

            function openError(thrown) {
                $("#errormsg").text(thrown);
                $("#dialogerror").dialog("open");
            }
            $("#addField")
                .button()
                .click(function(event) {
                    event.preventDefault();
                    var points = $("<div>", {
                        id: "n" + totalPoints,
                        class: "pointset row uniform 50%"
                    });
                    totalPoints++;
                    var xpoint = $("<input>", {
                        type: "number",
                        name: "x",
                        class: "point",
                        style: "width:50%;",
                    });
                    points.append(xpoint);
                    var ypoint = $("<input>", {
                        type: "number",
                        name: "y",
                        class: "point",
                        style: "width:50%;",
                    });
                    points.append(ypoint);

                    $("#pointContainer").append(points);
                    $.each($(".point"), function(k, v) {
                        v.oninput = updateDrawing;
                    });
                });

        };

    </script>
</body>

</html>
