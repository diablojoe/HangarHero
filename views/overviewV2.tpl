<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="HangarHero.com">

    <title>HangarHero</title>

    <!-- Bootstrap Core CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- MetisMenu CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/metisMenu/2.5.2/metisMenu.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/lumen/bootstrap.min.css">

    <!-- Custom Fonts -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1" crossorigin="anonymous">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1/vis.css">

    <!-- Include Date Range Picker -->
    <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.css" />

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-84812424-1', 'auto');
      ga('send', 'pageview');

    </script>

</head>

<body data-hangarid="{{.current}}">
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
            {{range $key, $val := .hangars}}
              {{if eq $val.Id $.current}}
                <a class="navbar-brand" href="/managerv2/{{$val.Id}}">HangarHero - {{$val.Name}}</a>
              {{end}}
            {{end}}
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Help<span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a href="/static/html/documentation.html">View Documentation</a></li>
                  <li><a href="#" data-toggle="modal" data-target="#filebug">Submit a bug report</a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Hangars<span class="caret"></span></a>
                <ul class="dropdown-menu">
                  {{range $key, $val := .hangars}}
                    <li><a href="/managerv2/{{$val.Id}}">{{$val.Name}}{{if eq $val.Id $.current}}<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>{{end}}</a></li>
                  {{end}}
                  <li role="separator" class="divider"></li>
                  <li><a href="#" data-toggle="modal" data-target="#gohangar">View Hangar</a></li>
                  <li><a href="#" onclick="GoNow()">View Hangar Now</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="/addhangar">Add Hangar</a></li>
                  <li><a href="/removehangar">Remove Hangar</a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Actions<span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a href="#" data-toggle="modal" data-target="#searchaircraft">Schedule Aircraft</a></li>
                  <li><a href="#" onclick="openEQCats()">Schedule Equipment</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="/account">Manage Account</a></li>
                  <li role="separator" class="divider"></li>
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
            <div class="col-lg-12">
              <ul class="nav nav-tabs nav-justified">
                <li class="active"><a data-toggle="tab" href="#schedule">Schedule</a></li>
                <li><a data-toggle="tab" href="#movement">Movement</a> </li>
              </ul>

              <div class="tab-content">
                <div id="schedule" class="tab-pane fade in active">
                  <div class="panel-group" id="scheduleaccordion">
                    <div class="panel panel-default">
                      <div class="panel-heading">
                        <h4 class="panel-title">
                          <a data-toggle="collapse" data-parent="#scheduleaccordion" href="#collapse1">
                          Aircraft</a>
                        </h4>
                      </div>
                      <div id="collapse1" class="panel-collapse collapse in">
                        <div class="panel-body">
                          <div id="scheduleaircraft"></div>
                        </div>
                      </div>
                    </div>
                    <div class="panel panel-default">
                      <div class="panel-heading">
                        <h4 class="panel-title">
                          <a data-toggle="collapse" data-parent="#scheduleaccordion" href="#collapse2">
                          Equipment</a>
                        </h4>
                      </div>
                      <div id="collapse2" class="panel-collapse collapse">
                        <div class="panel-body">
                          <div id="scheduleequipment"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="movement" class="tab-pane fade">
                  <div class="panel-group" id="movementaccordion">
                    <div class="panel panel-default">
                      <div class="panel-heading">
                        <h4 class="panel-title">
                          <a data-toggle="collapse" data-parent="#movementaccordion" href="#collapse3">
                          Aircraft</a>
                        </h4>
                      </div>
                      <div id="collapse3" class="panel-collapse collapse in">
                        <div class="panel-body">
                          <div id="movementaircraft"></div>
                        </div>
                      </div>
                    </div>
                    <div class="panel panel-default">
                      <div class="panel-heading">
                        <h4 class="panel-title">
                          <a data-toggle="collapse" data-parent="#movementaccordion" href="#collapse4">
                          Equipment</a>
                        </h4>
                      </div>
                      <div id="collapse4" class="panel-collapse collapse">
                        <div class="panel-body">
                          <div id="movementequipment"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        <!--  Search Aircraft Modal -->
        <div id="searchaircraft" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Search For Aircraft</h4>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-2">
                    <select name="countrycode" id="countrycode" class="form-control">
                      <option value="N-">N-</option>
                    </select>
                  </div>
                  <div class="col-md-7">
                    <input id="regnumber" type="text" class="form-control" placeholder="228US">
                  </div>
                  <div class="col-md-3">
                    <button class="btn btn-default" type="button" onclick="SearchAC()">Search</button>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div><!-- end search aircraft modal -->
        <!--  Add Aircraft Modal -->
        <div id="addaircraft" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Add Aircraft</h4>
              </div>
              <div class="modal-body" id="addacmodalbody">
                <span id="acid"></span>
                <br>
                <span id="acowner"></span>
                <br>
                <span id="make"></span>
                <br>
                <span id="model"></span>
                <br>
                <input type="text" class="form-control" id="addacdaterange" />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button id="addacbutton" type="button" class="btn btn-success" data-dismiss="modal" onclick="AddAc()" disabled="true">Add</button>
              </div>
            </div>
          </div>
        </div><!-- end add aircraft modal -->
        <!--  Search Equipment Category Modal -->
        <div id="searchequipmentcat" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Equipment Categories</h4>
              </div>
              <div class="modal-body">
                <i id="catspinner" class="fa fa-spinner fa-spin text-center" style="font-size:48px;color:blue"></i>
                <div class="form-group" id="equipmentcatcontainer">
                  <label for="equipmentcat" class="col-lg-2 control-label">Category</label>
                  <div class="col-lg-10">
                    <select name="equipmentcat" id="equipmentcat" class="form-control"></select>
                  </div>
                </div>
                <br>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" onclick="equipmentCatNext()">Next</button>
              </div>
            </div>
          </div>
        </div><!-- end search equipment subcat modal -->
        <!--  Search Equipment Sub-Category Modal -->
        <div id="searchequipmentsubcat" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Equipment Sub-Categories</h4>
              </div>
              <div class="modal-body">
                <i id="subcatspinner" class="fa fa-spinner fa-spin text-center" style="font-size:48px;color:blue"></i>
                <div class="form-group" id="equipmentsubcatcontainer">
                  <label for="equipmentsubcat" class="col-lg-2 control-label">Sub-Category</label>
                  <div class="col-lg-10">
                    <select name="equipmentsubcat" id="equipmentsubcat" class="form-control"></select>
                  </div>
                </div>
                <br>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" onclick="equipmentSubCatNext()">Next</button>
              </div>
            </div>
          </div>
        </div><!-- end search equipment sub-cat modal -->
        <!--  Add Equipment Modal -->
        <div id="addequipment" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Add Equipment</h4>
              </div>
              <div class="modal-body">
                <i id="equipmentspinner" class="fa fa-spinner fa-spin text-center" style="font-size:48px;color:blue"></i>
                <div class="form-group" id="equipmentcontainer">
                  <label for="equipment" class="col-lg-2 control-label">Equipment</label>
                  <div class="col-lg-10">
                    <select name="equipment" id="equipment" class="form-control"></select>
                  </div>
                </div>
                <br>
                <input type="text" class="form-control" id="addeqdaterange" />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button id="addeqbutton" type="button" class="btn btn-success" onclick="AddEq()" disabled="true">Add</button>
              </div>
            </div>
          </div>
        </div><!-- end add equipment modal -->
        <!--  Update Vis Modal -->
        <div id="updatevis" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Update Times</h4>
              </div>
              <div class="modal-body">
                <input type="text" class="form-control" id="updatedaterange" />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button id="updatebutton" type="button" class="btn btn-success" onclick="UpdateVis()" disabled="true">Update</button>
              </div>
            </div>
          </div>
        </div><!-- end updatevis modal -->
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
        <!--  Goto Hangar Modal -->
        <div id="gohangar" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Go To Your Hangar</h4>
              </div>
              <div class="modal-body" id="gomodal">
                <input type="text" name="daterange" id="gotime" />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button id="gotobutton" type="button" class="btn btn-success" data-dismiss="modal" onclick="GoTime()" disabled="true">Go</button>
              </div>
            </div>
          </div>
        </div><!-- end show error modal -->
        <div class="navbar navbar-bottom">
          <p class="text-center"><a href="/static/html/privacypolicy.html">Privacy Policy</a> &copy; HangarHero.com <a href="/static/html/termsofservice.html">Terms of Service</a> </p>
        </div>
      </div><!-- end container -->
    </div><!-- End wrapper -->
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

    <!-- Metis Menu Plugin JavaScript -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/metisMenu/2.5.2/metisMenu.js"></script>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1/vis.js"></script>
    <script type="text/javascript" src="//cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="//cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.js"></script>

    <script type="text/javascript" src="/static/js/overviewV2.js"></script>

  </body>
</html>
