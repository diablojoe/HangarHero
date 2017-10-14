<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="HangarHero.com">

    <title>Admin - HangarHero.com</title>

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
    <style>
      html {
        position: relative;
        min-height: 100%;
      }
      body {
      /* Margin bottom by footer height */
        margin-bottom: 60px;
      }
      .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        /* Set the fixed height of the footer here */
        height: 30px;
      }
    </style>
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
            <a class="navbar-brand" href="#">HangarHero.com - Administrator</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Users<span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li role="separator" class="divider"></li>
                  <li><a href="#">Overview</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="#">Edit</a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Errors<span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a href="#">Overview</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="#">User</a></li>
                  <li><a href="#">Viewer</a></li>
                  <li><a href="#">Anonymous</a></li>
                  <li><a href="#">Administrator</a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">3D Assets<span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a href="#">Overview</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="/admin/modelmanager">Aircraft</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="/admin/addequipmentcat">Add Equipment Category</a></li>
                  <li><a href="/admin/addequipmentsubcat">Add Equipment Sub-Category</a></li>
                  <li><a href="/admin/addequipment">Add Equipment</a></li>
                  <li><a href="/admin/addobject3d">Add Unbound Object3d</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="#">Upload Model</a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Server<span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a href="#">Overview</a></li>
                  <li role="separator" class="divider"></li>
                  <li><a href="/admin/addadmin">Add Administrator</a></li>
                </ul>
              </li>
              <li><a href="/admin/logout">Log Off</a></li>
            </ul>
          </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>
      <div class="container">
        <div id="page-wrapper">
          {{range $key, $val := .errors}}
            <div class="alert alert-dismissible alert-danger">
              <button type="button" class="close" data-dismiss="alert">&times;</button>
              <strong>{{$key}}</strong> {{$val}}
            </div>
          {{end}}
          <form class="form-horizontal" action="/admin/addequipment" method="post">
            <fieldset>
              <legend>Add Equipment</legend>
              <div class="form-group">
                <label for="name" class="col-lg-2 control-label">Name</label>
                <div class="col-lg-6">
                  <input type="hidden" class="form-control" id="action" name="action" value="add">
                  <input type="text" class="form-control" id="name" name="name">
                </div>
              </div>
              <div class="form-group">
                <label for="subcatid" class="col-lg-2 control-label">Sub-Category</label>
                <div class="col-lg-6">
                  <select class="form-control" id="subcatid" name="subcatid">
                    {{range $key, $val := .eqsubcats}}
                      <option value="{{$key}}">{{$val}}</option>
                    {{end}}
                 </select>
                </div>
              </div>
              <div class="form-group">
                <label for="objectid" class="col-lg-2 control-label">Object3D</label>
                <div class="col-lg-6">
                  <select class="form-control" id="objectid" name="objectid">
                    {{range $key, $val := .objects}}
                      <option value="{{$key}}">{{$val}}</option>
                    {{end}}
                 </select>
                </div>
              </div>
              <div class="form-group">
                <div class="col-lg-6 col-lg-offset-2">
                  <button type="reset" class="btn btn-default">Clear</button>
                  <button type="submit" class="btn btn-primary">Submit</button>
                </div>
              </div>
            </fieldset>
          </form>
          <table class="table table-striped table-hover ">
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Sub-Category</th>
                <th>Name</th>
                <th>Object3D</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {{range $key, $val := .equipment}}
                <tr>
                  <td>{{$key}}</td>
                  <td>{{$val.Cat}}</td>
                  <td>{{$val.Subcat}}</td>
                  <td>{{$val.Name}}</td>
                  <td>{{$val.Object3d}}</td>
                  <td><a href="#" class="btn btn-danger remove" data-id="{{$key}}">Remove</a></td>
                </tr>
              {{end}}
            </tbody>
          </table>
        </div>
      </div>
      <footer class="footer">
        <div class="container">
          <p class="text-center"><a href="/static/html/privacypolicy.html">Privacy Policy</a> &copy; HangarHero.com <a href="/static/html/termsofservice.html">Terms of Service</a> </p>
        </div>
      </footer>
    </div>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <script>
      $('.remove').click(function(){
        var $form = $('<form>', {
            action: "/admin/addequipment",
            method: 'post'
        });
        $('<input>').attr({
            type: "hidden",
            name: "action",
            value: "remove"
        }).appendTo($form);
        $('<input>').attr({
            type: "hidden",
            name: "id",
            value: $(this).data('id')
        }).appendTo($form);
        $form.submit();
      });

    </script>
  </body>
  </html>
