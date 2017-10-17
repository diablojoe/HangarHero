<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Sign up for HangarHero Now">
    <meta name="author" content="HangarHero">

    <title>Sign Up - HangarHero</title>

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
            <a class="navbar-brand" href="/">HangarHero</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
              <li><a href="/adduser">Sign Up</a></li>
            </ul>
          </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>

      <div class="container">
        <div id="page-wrapper">
          <div class="row">
            <div class="col-md-6">
              <h2>What HangarHero can do for you</h2>
              <p>Get the most out of your hangar and ramp space with next generation cloud based hangar planning and scheduling solutions from HangarHero.com.</p>
              <p>Do more with the facilities you have.  Our advanced 3d mapping technology allows you to plan equipment and aircraft placement in limited spaces more efficiently than ever before.  Plan, preview, and publish your hangar layout maps in 3d with a simple interface.  HangarHero lets you get the most out of every square meter.</p>
              <p>Save money by eliminating wasted man hours with our powerful integrated scheduling tools.  Adapt to scheduling changes on the fly and synchronize aircraft ground movements between office and mobile operators seamlessly.</p>
              <p>At HangarHero we believe solutions should resolve problems, not create more headaches.  Our cloud based architecture means that you won't take on any additional IT overhead.  Let us handle the backups and updates so that you don't have to.</p>
              <p>HangarHero could be up and operating live in your business today! We require no special hardware, software, or plugins.  Most users can achieve basic proficiency in less than an hour using our online video instruction materials.</p>
              <p>Try HangarHero risk free.  Cancel any time in the first month, for any reason, and it's free.</p>
              <!--<h3>What you get</h3>
              <p>30 Day Free Trial</p>
              <p>Up to 10 hangar or ramp spaces</p>
              <p>$99.95 per hangar a month billed at the end of trial period</p>
              <p>Use any major credit-card</p> -->
            </div>
            <div class="col-md-6">
            {{range $key, $val := .errors}}
            <div class="alert alert-dismissible alert-danger">
              <button type="button" class="close" data-dismiss="alert">&times;</button>
              <strong>{{$key}}</strong> {{$val}}
            </div>
            {{end}}
            <form action="/adduser" method="post" class="form-horizontal" id="form">
              <fieldset>
                <legend>Sign Up For Free</legend>
                  <div class="form-group">
                    <label for="firstname" class="col-lg-2 control-label">First Name</label>
                    <div class="col-lg-10">
                      <input type="text" class="form-control" name="firstname" id="firstname" value="" placeholder="First Name" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="lastname" class="col-lg-2 control-label">Last Name</label>
                    <div class="col-lg-10">
                      <input type="text" class="form-control" name="lastname" id="lastname" value="" placeholder="Last Name" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="orgname" class="col-lg-2 control-label">Organization Name</label>
                    <div class="col-lg-10">
                      <input type="text" class="form-control" name="orgname" id="orgname" value="" placeholder="Organization Name" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="zip" class="col-lg-2 control-label">Zip Code</label>
                    <div class="col-lg-10">
                      <input type="text" class="form-control" name="zip" id="zip" value="" placeholder="Zip Code" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="email" class="col-lg-2 control-label">E-Mail</label>
                    <div class="col-lg-10">
                      <input type="text" class="form-control" name="email" id="email" value="" placeholder="Email Address" />
                    </div>
                  </div>
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
                      <div class="checkbox">
                        <label>
                          <input type="checkbox" name="TOS"> I have read and agree to the <a href="/static/html/termsofservice.html" target="_blank">Terms of Service</a>
                        </label>
                      </div>
                      <div class="checkbox">
                        <label>
                          <input type="checkbox" name="SA"> I have read and agree to the <a href="/static/html/serviceagreement.html" target="_blank">Service Agreement</a>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-10 col-lg-offset-2">
                    <button type="reset" class="btn btn-default">Reset</button>
                    <button type="submit" class="btn btn-primary">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <footer class="footer">
          <div class="container">
            <p class="text-center"><a href="/static/html/privacypolicy.html">Privacy Policy</a> &copy; HangarHero.com <a href="/static/html/termsofservice.html">Terms of Service</a> </p>
          </div>
        </footer>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

  </body>
</html>
