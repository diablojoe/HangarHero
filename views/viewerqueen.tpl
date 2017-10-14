<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="HangarHero.com">

    <title>Viewer - HangarHero.com</title>

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
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-84812424-1', 'auto');
      ga('send', 'pageview');

    </script>
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
            <a class="navbar-brand" href="#">HangarHero</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
              <li><a href="/viewer/schedule/{{.hangar}}">Back to Schedule</a></li>
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Help<span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a href="/static/html/documentation.html/#render">View Documentation</a></li>
                  <li><a href="#" data-toggle="modal" data-target="#filebug">Submit a bug report</a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Actions<span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a href="/logout">Log Off</a></li>
                </ul>
              </li>
            </ul>
          </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>
      <div class="container">
        <div id="page-wrapper">
          <div class="row">
            <div class="col-md-9"><!--3d space -->
              <div id="canvas"></div>
              <p class="text-center"><span id="hangarname"></span> - <span id="hangartime"></span></p>
              <div class="hidden-xs">
                <input id="slider" data-slider-id='slider' type="text" data-slider-min="0" data-slider-max="24" data-slider-step="0.25"/>
              </div>
              <div class="hidden-sm hidden-md hidden-lg center-block">
                <select name="hours" id="hours" class="form-control">
                  <option value="0">00</option>
                  <option value="1">01</option>
                  <option value="2">02</option>
                  <option value="3">03</option>
                  <option value="4">04</option>
                  <option value="5">05</option>
                  <option value="6">06</option>
                  <option value="7">07</option>
                  <option value="8">08</option>
                  <option value="9">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                  <option value="22">22</option>
                  <option value="23">23</option>
                </select>
                <select name="minutes" id="minutes" class="form-control">
                  <option value="0">:00</option>
                  <option value="15">:15</option>
                  <option value="30">:30</option>
                  <option value="45">:45</option>
                </select>
                <button type="button" class="btn btn-default" onclick="goTime()">Go</button>
              </div>
              <div class="row">
                <div class="col-xs-6">
                  <button class="pull-left btn-default" onclick="previous()">Previous Day</button>
                </div>
                <div class="col-xs-6">
                  <button class="pull-right btn-default" onclick="next()">Next Day</button>
                </div>
              </div>
            </div><!-- end 3dspace -->
            <div class="col-md-3"><!--model control space -->
              <div class="panel-group" id="accordion"><!-- control idea -->
              </div><!-- end control idea -->
            </div><!-- end model control -->
          </div><!-- end row -->
          <!--  Loading Modal -->
          <div id="loadingmodal" class="modal fade" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog">
              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">Loading</h4>
                </div>
                <div class="modal-body">
                  <p id="protext" class="text-center"></p>
                  <div class="progress progress-striped active">
                    <div id="probar" class="progress-bar" style="width: 0%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div><!-- end loading modal -->
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

          <!--  File Bug Modal -->
          <div id="filebug" class="modal fade" role="dialog">
            <div class="modal-dialog">
              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">File a bug report</h4>
                </div>
                <div class="modal-body">
                  <div class="input-group">
                    <div class="form-group">
                      <label for="textArea" class="col-lg-2 control-label">Description</label>
                      <div class="col-lg-10">
                        <textarea id="bugText" class="form-control" rows="3" id="textArea"></textarea>
                        <span class="help-block">Tell us all about what you found wrong. Please be as specific and descriptive as possible.</span>
                      </div>
                    </div>
                  </div><!-- /input-group -->
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                  <button class="btn btn-success" type="button" onclick="SubmitBug()">Submit</button>
                </div>
              </div>
            </div>
          </div><!-- end file bug modal -->
          <div class="navbar navbar-bottom">
            <p class="text-center"><a href="/static/html/privacypolicy.html">Privacy Policy</a> &copy; HangarHero.com <a href="/static/html/termsofservice.html">Terms of Service</a> </p>
          </div>
        </div><!--end page wrapper -->
      </div><!-- end container -->
    </div> <!-- end wrapper -->
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<!--
    <script type="text/javascript" src="//cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r77/three.min.js"></script>


    <script src="/static/js/ShaderLib.js"></script>
    -->
    <script src="https://threejs.org/build/three.min.js"></script>
    <script src="/static/js/OBJLoader.js"></script>
    <script src="/static/js/OrbitControls.js"></script>
    <script src="/static/js/Detector.js"></script>
    <script src="/static/js/EventsControls.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.1.3/bootstrap-slider.js"></script>
    <script type="text/javascript" src="/static/js/viewerrender.js"></script>
    </body>
</html>
