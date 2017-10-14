<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="HangarHero">

    <title>HangarHero - Edit Account</title>

    <!-- Bootstrap Core CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- MetisMenu CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/metisMenu/2.5.2/metisMenu.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/lumen/bootstrap.min.css">

    <!-- Custom Fonts -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1" crossorigin="anonymous">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1/vis.css">

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
          <a class="navbar-brand" href="/managerv2/">HangarHero</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
              <li><a href="/managerv2/">Back to Schedule</a></li>
            </ul>
          </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>
      <div class="container">
        <div id="page-wrapper">
          {{range $key, $val := .errors}}
            <div class="ui-widget">
                <div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">
                    <p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><strong>{{$key}}: </strong>{{$val}}</p>
                </div>
            </div>
          {{end}}
          <ul class="nav nav-tabs nav-justified">
            <li class="active"><a data-toggle="tab" href="#viewers">Viewers</a></li>
            <li><a data-toggle="tab" href="#details">Details</a> </li>
            <li><a data-toggle="tab" href="#billing">Billing</a> </li>
          </ul>

          <div class="tab-content">
            <div id="viewers" class="tab-pane fade in active">
              <table class="table table-striped table-hover ">
                <thead>
                  <tr>
                    <th>E-Mail Address</th>
                  </tr>
                </thead>
                <tbody>
                  {{range $key, $val := .viewers}}
                  <tr>
                    <td>{{$val.Email}}</td>
                  </tr>
                  {{end}}
                </tbody>
              </table>
              <br>
              <a href="/addviewer" class="btn btn-success">Add Viewer</a>
              <a href="/removeviewer" class="btn btn-warning">Remove Viewer</a>
            </div>

            <div id="details" class="tab-pane fade">
              <form action="/editaccount" method="post" class="form-horizontal" id="form">
                <fieldset>
                  <legend>Edit Account</legend>
                    <div class="form-group">
                      <label for="firstname" class="col-lg-2 control-label">First Name</label>
                      <div class="col-lg-10">
                        <input type="text" class="form-control" name="firstname" id="firstname" value="{{.user.FirstName}}" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="lastname" class="col-lg-2 control-label">Last Name</label>
                      <div class="col-lg-10">
                        <input type="text" class="form-control" name="lastname" id="lastname" value="{{.user.LastName}}" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="orgname" class="col-lg-2 control-label">Organization Name</label>
                      <div class="col-lg-10">
                        <input type="text" class="form-control" name="orgname" id="orgname" value="{{.user.OrgName}}" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="zip" class="col-lg-2 control-label">Zip Code</label>
                      <div class="col-lg-10">
                        <input type="text" class="form-control" name="zip" id="zip" value="{{.user.Zip}}" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="email" class="col-lg-2 control-label">E-Mail</label>
                      <div class="col-lg-10">
                        <input type="text" class="form-control" name="email" id="email" value="{{.user.Email}}" />
                      </div>
                    </div>
                    <br>
                    <div class="form-group">
                      <label for="password" class="col-lg-2 control-label">Password</label>
                      <div class="col-lg-10">
                        <input type="password" class="form-control" name="password" id="password" value="" placeholder="Password" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="password2" class="col-lg-2 control-label">Re-Type Password</label>
                      <div class="col-lg-10">
                        <input type="password" class="form-control" name="password2" id="password2" value="" placeholder="Re-Type Password" />
                      </div>
                    </div>
                    <div class="col-lg-10 col-lg-offset-2">
                      <button type="reset" class="btn btn-default">Reset</button>
                      <button type="submit" class="btn btn-primary">Update</button>
                    </div>
                  </fieldset>
                </form>
              </div>
              <div id="billing" class="tab-pane fade">
                <br>
                <p>Account created on: {{.user.Reg_date}}</p>
                <p>Account active until on this billing cycle: {{.user.ValidUntil}}</p>
                <p>Number of hangars: {{.numhangars}}</p>
                <p>Number of hangars allowed on your plan: {{.plan.Hangars}}</p>
                <p>Number of viewers: {{.numviewers}}</p>
                <p>Number of viewers allowed on your plan: {{.plan.Viewers}}</p>
                <br>
                <a href="/changepaymentmethod" class="btn btn-success">Change Payment Method</a>
                <a href="/removeaccount" class="btn btn-danger">Cancel Subscription</a>

              </div>
          </div>
        </div>
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

  </body>
</html>
