<html>

<head>
    <title>Add Admin - HangarHero.com</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <!--[if lte IE 8]><script src="js/html5shiv.js"></script><![endif]-->
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
    <script src="/static/js/skel.min.js"></script>
    <script src="/static/js/skel-layers.min.js"></script>
    <script src="/static/js/init.js"></script>
    <noscript>
        <link rel="stylesheet" href="css/skel.css" />
        <link rel="stylesheet" href="css/style.css" />
        <link rel="stylesheet" href="css/style-xlarge.css" />
    </noscript>
</head>

<body>
    <header id="header" class="skels-layers-fixed">
        <h1><strong><a href="index.html">HangarHero.com</a></strong></h1>
        <nav id="nav">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/adduser">Sign Up</a></li>
            </ul>
        </nav>
    </header>
    <section id="main" class="wrapper">
        <div class="container">
            {{range $key, $val := .errors}}
            <div class="ui-widget">
                <div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">
                    <p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><strong>{{$key}}: </strong>{{$val}}</p>
                </div>
            </div>
            {{end}}


            <form action="/admin/addadmin" method="post">
                Email:
                <br>
                <input type="email" name="email">
                <br> Password:
                <br>
                <input type="password" name="password">
                <br>
                <br> Re-enter Password:
                <br>
                <input type="password" name="password2">
                <br>
                <br>
                <input type="submit" name="submit">
                <br>
            </form>
        </div>
    </section>
    <!-- Footer -->
    <footer id="footer">
        <div class="container">
            <ul class="copyright">
                <li>&copy; HangarHero.com</li>
            </ul>
        </div>
    </footer>

</body>

</html>
<!DOCTYPE html>
<html>

<head>
    <title>Sign Up</title>
    <meta charset="utf-8">
    <link href="/static/css/jquery-ui.css" rel="stylesheet">

</head>

<body>
    <header>

    </header>
    <nav>
        <a href="index.html">Home</a>
        <a href="index.html">About</a>
        <a href="index.html">Blog</a>
    </nav>
    <section>

    </section>
    <footer>
        <span>Coppyright 2016 Hangar Queen</span>
    </footer>
    <script src="/static/js/jquery.js"></script>
    <script src="/static/js/jquery-ui.js"></script>
    <script>


    </script>

</body>

</html>
