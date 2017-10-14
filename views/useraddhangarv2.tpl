<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="HangarHero.com">

    <title>Add Hangar - HangarHero.com</title>

    <!-- Bootstrap Core CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/lumen/bootstrap.min.css">

    <!-- Custom Fonts -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1" crossorigin="anonymous">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

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
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-84812424-1', 'auto');
      ga('send', 'pageview');

    </script>
</head>

<body>
  <div id="wrapper">
    <!-- Navigation -->
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">HangarHero</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
              <li><a href="/managerv2">Back To Schedule</a></li>
            </ul>
          </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>
      <div class="container">
        <div id="page-wrapper">
          <div class="alert alert-dismissible alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Billing Change</strong> Adding a hangar can change your billing amount <a href="http://blog.hangarhero.com/2016/11/22/Important-information-on-adding-and-removing-hangars/">Click here for more information</a>
          </div>
          {{range $key, $val := .errors}}
          <div class="alert alert-dismissible alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>{{$key}}</strong> {{$val}}
          </div>
          {{end}}
          <div class="alert alert-dismissible alert-success">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>To define a hangar: </strong> All measurements should be added using meters and decimals. I.E. 1 for 1 meter, 1.5 for one and a half meters, or 3.05 for 10 feet.
            <ul>
              <li>Enter the name of the hangar in the Name field.</li>
              <li>Define the points corresponding to corners of the hangar or ramp space.
                <ul>
                  <li>ex: A 20 meter square hangar would have corners at (0,0), (20,0), (20,20), and (0,20) on an (X,Y) plane.</li>
                </ul>
              </li>
              <li>Click on the Add Field button to define additional points for more complex hangar and ramp spaces.</li>
              <li>Progress around the edge of the hangar space clockwise to prevent overlapping edges.</li>
              <li>To the right of the input area is a preview window to allow you to better visualize the entered points.</li>
              <li>This window can be zoomed in and out using the scroll wheel and panned by left clicking and dragging.</li>
              <li>Once you are satisfied with your hangar click ‘Submit’ to save.</li>
            </ul>
          </div>
          <!--  Show Error Modal -->
          <div id="showerror" class="modal fade" role="dialog">
            <div class="modal-dialog">
              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Error</h4>
                </div>
                <div class="modal-body">
                  <div class="alert alert-danger" role="alert">
                    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                    <span class="sr-only">Error:</span>
                    <span id="errormsg"></span>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div><!-- end show error modal -->
          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="hangarname" class="col-lg-2 control-label">Hangar Name</label>
                    <div class="col-lg-10">
                      <input type="text" class="form-control" name="name" id="hangarname">
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <p class="text-center">X</p>
                </div>
                <div class="col-md-6">
                  <p class="text-center">Y</p>
                </div>
              </div>
              <div id="pointContainer">
                <div class="row pointset" id="n0"> <!-- this is a point set -->
                  <div class="col-md-6">
                    <input type="number" name="x" class="form-control point col-md-6" value="0" readonly="true">
                  </div>
                  <div class="col-md-6">
                    <input type="number" name="y" class="form-control point" value="0" readonly="true">
                  </div>
                </div><!-- end of point set -->
                <div class="row pointset" id="n1"> <!-- this is a point set -->
                  <div class="col-md-6">
                    <input type="number" name="x" class="form-control point" value="0">
                  </div>
                  <div class="col-md-6">
                    <input type="number" name="y" class="form-control point" value="20">
                  </div>
                </div><!-- end of point set -->
                <div class="row pointset" id="n2"> <!-- this is a point set -->
                  <div class="col-md-6">
                    <input type="number" name="x" class="form-control point" value="20">
                  </div>
                  <div class="col-md-6">
                    <input type="number" name="y" class="form-control point" value="20">
                  </div>
                </div><!-- end of point set -->
                <div class="row pointset" id="n3"> <!-- this is a point set -->
                  <div class="col-md-6">
                    <input type="number" name="x" class="form-control point" value="20">
                  </div>
                  <div class="col-md-6">
                    <input type="number" name="y" class="form-control point" value="0">
                  </div>
                </div><!-- end of point set -->
              </div>
              <div class="row">
                <div class="col-md-12">
                  <button id="addField" class="btn btn-default">Add Field</button>
                  <button id="submit" class="btn btn-primary">Submit</button>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div id="graph-container"></div>
            </div>
          </div>
          <div class="navbar navbar-bottom">
            <p class="text-center"><a href="/static/html/privacypolicy.html">Privacy Policy</a> &copy; HangarHero.com <a href="/static/html/termsofservice.html">Terms of Service</a> </p>
          </div>
        </div>
      </div>
    </div>
    <div hidden="true">
      <form action="/addhangar" method="post" id="hiddenForm">
        <input type="text" class="form-control" id="hiddenName" name="name">
        <input type="text" class="form-control" id="hiddenDefinition" name="definition">
      </form>
    </div>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <script>
      onload = function() {
        //data container holds the points for display
        var data = {
          nodes: [],
          edges: []
        };
        //s is the sigma graph view
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

        //set up four points initialy to form a plane
        var totalPoints = 4;

        //sigma setup
        $.each($(".point"), function(k, v) {
            v.oninput = updateDrawing;
        });
        updateDrawing();

        function updateDrawing() {
          data.nodes.length = 0;
          data.edges.length = 0;
          $.each($(".pointset"), function(k, v) {
            var node = new Object();
            node.x = v.children[0].children[0].value;
            var yinit = v.children[1].children[0].value
            var yinv = (v.children[1].children[0].value) * (-1);
            node.y = yinv;
            node.size = 1;
            node.id = v.id;
            node.label = "(" + v.children[0].children[0].value + "," + v.children[1].children[0].value + ")";
            if (node.x !== "" && node.y !== "") {
              data.nodes[k] = node;
            }
          });
          if (data.nodes.length > 1) {
            var last;
            for (var i = 0; i < data.nodes.length; i++) {
              console.log("setting up edge: " + i);
              console.log(data.nodes);
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
          s.graph.clear();
          s.graph.read(data)
          s.refresh();
        }

        // submit method
        $("#submit")
          .button()
          .click(function(event) {
            event.preventDefault();
            console.log(data);
            //role up the results to what the server is wanting
            var name = $("#hangarname").val();
            var rawReturn = {
              points: [],
            }
            for (var i = 0; i < data.nodes.length; i++) {
              var node = {
                x: 0,
                y: 0
              }
              node.x = (data.nodes[i].x) * (1);
              node.y = (data.nodes[i].y) * (-1);
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
              intReturn.name = name;
              intReturn.definition = JSON.stringify(rawReturn);
              console.log(intReturn.name);
              console.log(intReturn.definition);
              $('#hiddenName').val(intReturn.name);
              $('#hiddenDefinition').val(intReturn.definition);
              $('#hiddenForm').submit();
            }
          });



          //open the error dialog
          function openError(thrown) {
            $('#errormsg').text(thrown);
            $('#showerror').modal('toggle');
          }

          //method to add new point sets
          $("#addField")
            .button()
            .click(function(event) {
              event.preventDefault();
                var points = $("<div>", {
                  id: "n" + totalPoints,
                    "class": "pointset row uniform 50%"
                  });
                  totalPoints++;
                  var xholder = $("<div>", {
                    "class": "col-md-6"
                  });
                  var yholder = $("<div>", {
                    "class": "col-md-6"
                  });
                  var xpoint = $("<input>", {
                    type: "number",
                    name: "x",
                    "class": "point form-control",
                  });
                  xholder.append(xpoint);
                  points.append(xholder);
                  var ypoint = $("<input>", {
                    type: "number",
                    name: "y",
                    "class": "point form-control",
                  });
                  yholder.append(ypoint);
                  points.append(yholder);

                  $("#pointContainer").append(points);
                  $.each($(".point"), function(k, v) {
                    v.oninput = updateDrawing;
                  });
                });
              };
    </script>
  </body>
  </html>
