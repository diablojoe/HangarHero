<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="HangarHero.com">

    <title>Sign Up - HangarHero.com</title>

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
            <a class="navbar-brand" href="#">HangarHero.com</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
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
          <div class="row">
            <div class="col-md-4 col-md-offset-2">
              <div class="panel panel-info">
                <div class="panel-heading">
                  <h3 class="panel-title">Small to Medium Business</h3>
                </div>
                <div class="panel-body">
                  <ul class="center-block">
                    <li>Includes one hangar or ramp space</li>
                    <li>Can be upgraded to ten hangar or ramp spaces (at additional charge)</li>
                    <li>Unlimited viewer accounts</li>
                    <li>Self service credit card based subscription</li>
                  </ul>
                  <br>
                  <form action="/adduserpay" method="post" class="form-horizontal" id="form">
                    <input type="text" style="visibility: hidden;" value="one_space" name="subtype" />
                    <script
                      src="https://checkout.stripe.com/checkout.js" class="stripe-button"
                      data-key="pk_live_NybgQDvGjfHw2TWS0YK6ZZlf"
                      data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
                      data-name="HangarHero.com"
                      data-description="One Hangar Subscription"
                      data-panel-label="Subscribe"
                      data-label="Subscribe"
                      data-amount="9995"
                      data-allow-remember-me="false"
                      data-zip-code="true">
                    </script>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="panel panel-success">
                <div class="panel-heading">
                  <h3 class="panel-title">Enterprise Service</h3>
                </div>
                <div class="panel-body">
                  <ul class="center-block">
                    <li>Unlimited potential hangar and ramp spaces</li>
                    <li>Unlimited viewer accounts</li>
                    <li>Dedicated server and sub-domain</li>
                    <li>Flexable payment options</li>
                  </ul>
                  <form action="/adduserpay" method="post" class="form-horizontal" id="form">
                    <input type="text" style="visibility: hidden;" value="enterprise" name="subtype" />
                    <input type="submit" value="Contact Us" class="btn btn-success center-block"/>
                  </form>
                </div>
              </div>
            </div>
          </div>
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

  </body>
</html>