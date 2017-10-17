<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Intuitive Hangar Planning Solutions. Organize ramp and hangar space. Schedule aircraft movements. Share your plans with the team.">
    <meta name="author" content="HangarHero">

    <title>HangarHero</title>

    <!-- Bootstrap Core CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- MetisMenu CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/metisMenu/2.5.2/metisMenu.css">

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
      .navbar {
          margin-bottom: 0px;
      }
      .bg {
        background: url('/static/img/banner.jpg') no-repeat center center fixed;
        position: fixed;
        width: 100%;
        height: 100vh; /*same height as jumbotron */
        top:0;
        left:0;
        z-index: -1;
        background-size: cover;
      }

      .jumbotron {
        height: 70vh;
        color: white;
        text-shadow: #444 0 1px 1px;
        background:transparent;
        background-size: cover;
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
              <li><a href="/contact">Contact</a></li>
              <li><a target="_blank" href="http://blog.hangarhero.com">News</a></li>
              <li><a href="/adduser">Sign Up</a></li>
              <li><a href="/login">Log In</a></li>
            </ul>
          </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>
      <div class="bg"></div>
      <div class="jumbotron">
        <div class="container">
          <div id="page-wrapper">
            <div class="row">
              <div class="col-md-7">
                <h1>Intuitive Hangar Planning Solutions</h1>
                <p class="lead" style="color:black">Organize ramp and hangar space. </p>
                <p class="lead" style="color:black">Schedule aircraft movements.</p>
              </div>
              <div class="col-md-5">
                <a href="/adduser"><img src="/static/img/free_trial.png" class="img-responsive"></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div id="page-wrapper">
          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-12">
                  <h1 class="text-center" id="learnmore">Drag and Drop Scheduling</h1>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <h2 class="text-center">Book aircraft arrivals and departures with a powerful interactive timeline.  Track activity at a glance and adjust movements and timing effortlessly.</h2>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <img src="/static/img/scheduling.png" class="img-responsive">
            </div>
          </div>
          <br>
          <br>
          <div class="row">
            <div class="col-md-6">
              <img src="/static/img/spacemanagement.png" class="img-responsive">
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-12">
                  <h1 class="text-center">Organize in 3D space</h1>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <h2 class="text-center">Use our extensive database of aircraft and equipment models to arrange your work and storage spaces visually.  Generate maps linked with your timeline to plan complex movements with ease.</h2>
                </div>
              </div>
            </div>
          </div>
          <br>
          <br>
          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-12">
                  <h1 class="text-center">Coordinate with your entire team</h1>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <h2 class="text-center">Always up-to-date schedules and layout maps available on any smartphone or tablet.  Keep your team members on the same page even as plans are changing.</h2>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <img src="/static/img/communication.png" class="img-responsive">
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <a href="/adduser"><img src="/static/img/free_trial.png" class="img-responsive center-block"></a>
            </div>
          </div>
          <br>
          <br>
          <div class="navbar navbar-bottom">
            <p class="text-center"><a href="/static/html/privacypolicy.html">Privacy Policy</a> &copy; HangarHero.com <a href="/static/html/termsofservice.html">Terms of Service</a> </p>
          </div>
        </div>
      </div>
    </div>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

    <script>
      var jumboHeight = $('.jumbotron').outerHeight();
      var navHeight = $('.navbar-header').outerHeight();
      function parallax(){
          var scrolled = $(window).scrollTop();
          $('.bg').css('height', (jumboHeight-scrolled) +  navHeight + 'px');
      }
      parallax();
      $(window).scroll(function(e){
          parallax();
      });
    </script>
  </body>
  </html>
