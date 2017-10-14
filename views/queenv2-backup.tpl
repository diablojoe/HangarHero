<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="HangarHero.com">

    <title>HangarHero.com</title>

    <!-- Bootstrap Core CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- MetisMenu CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/metisMenu/2.5.2/metisMenu.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/lumen/bootstrap.min.css">

    <!-- Custom Fonts -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1" crossorigin="anonymous">

    <!-- Include Date Range Picker -->
    <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.css" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.1.3/css/bootstrap-slider.css">
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <style>
      #slider {
      	width: 100%;
      }
    </style>
</head>

<body data-hangarid="{{.hangar}}" data-date="{{.date}}">
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
            <a class="navbar-brand" href="#">HangarHero.com</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Hangars<span class="caret"></span></a>
                <ul class="dropdown-menu">
                  {{range $key, $val := .hangars}}
                    <li><a href="/managerv2/{{$val.Id}}">{{$val.Name}}{{if eq $val.Id $.current}}<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>{{end}}</a></li>
                  {{end}}
                  <li role="separator" class="divider"></li>
                  <li><a href="/addhangar">Add Hangar</a></li>
                  <li><a href="#">Remove Hangar</a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Actions<span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a href="#" data-toggle="modal" data-target="#searchaircraft">Schedule Aircraft</a></li>
                  <li><a href="#">Schedule Equipment</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="#" data-toggle="modal" data-target="#gohangar">View Hangar</a></li>
                  <li><a href="#" onclick="GoNow()">View Hangar Now</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="#">Share This Hangar</a></li>
                </ul>
              </li>
              <li><a href="/logout">Log Off</a></li>
            </ul>
          </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>
      <div class="container">
        <div id="page-wrapper">
          <div class="row">
            <div class="col-md-9"><!--3d space -->
              <div id="canvas"></div>
            </div><!-- end 3dspace -->
            <div class="col-md-3"><!--model control space -->
              <div class="panel-group" id="accordion"><!-- control idea -->
              </div><!-- end control idea -->
            </div><!-- end model control -->
          </div><!-- end row -->
          <div class="row"><!--slider control row -->
            <div class="col-md-12"><!--slider control space -->
              <input id="slider" data-slider-id='slider' type="text" data-slider-min="0" data-slider-max="24" data-slider-step="0.25"/>
            </div>
          </div><!-- end slider control space -->
          <div class="row">
            <div class="col-md-12">
              <button onclick="previous()">Previous Day</button>
              <button onclick="save()">Save</button>
              <button onclick="next()">Next Day</button>
            </div>
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
        </div><!--end page wrapper -->
      </div><!-- end container -->
    </div> <!-- end wrapper -->
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

    <script type="text/javascript" src="//cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r77/three.min.js"></script>
    <script src="/static/js/Detector.js"></script>
    <script src="/static/js/OrbitControls.js"></script>
    <script src="/static/js/threex.collider.js"></script>
    <script src="/static/js/threex.collidersystem.js"></script>
    <script src="/static/js/threex.colliderhelper.js"></script>
    <script src="/static/js/OBJLoader.js"></script>
    <script src="/static/js/EventsControls.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.1.3/bootstrap-slider.js"></script>
    <script type="text/javascript" src="/static/js/render.js"></script>
    <script>
      var stringdate = {{.date}};
      var hangarId = {{.hangar}};
      var time = new Date(stringdate);

      var scene = init(hangarId);
      var activeNames = [];
      var slide = $("#slider").slider();
      var startloc = dateToFrac(time);
      slide.slider('setValue', startloc);
      slide.slider().on('slideStop', function(){
        console.log("I have stopped sliding so im going to update");
        update();
      });
      update();

      function update(){
        console.log("running update");
        //clear the accordion
        $('#accordion').empty();
        clear(scene);
        //figure out the time we want
        var hour = Math.floor(slide.slider('getValue'));
        var minfrac = slide.slider('getValue') - hour;
        var minutes = fracToMin(minfrac);
        time.setHours(hour);
        time.setMinutes(minutes);
        $.get("/api/renderinstance/" + hangarId + "$" + time.toISOString(), function(data, status) {
          savedata = JSON.parse(data);

          if (!savedata.hasOwnProperty("Code")) {
            var hangarDefinition = savedata.Hangar.Definition;
            addFloor(scene, hangarDefinition);

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
    </script>

    </body>
</html>
