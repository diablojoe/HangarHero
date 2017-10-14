<html>

<head>
    <title>Log In - HangarHero.com</title>
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
            <h2>Log In</h2>
            <form action="/login" method="post" id="form">
                <div class="row uniform 50%">
                    <div class="6u 12u$(xsmall)">
                        <input type="text" name="email" id="email" value="" placeholder="E-Mail Address" />
                    </div>
                    <div class="6u$ 12u$(xsmall)">
                        <input type="password" name="password" id="password" value="" placeholder="Password" />
                    </div>
                    <div class="12u$">
                        <ul class="actions">
                            <li>
                                <input type="submit" value="Log In" class="special" />
                            </li>
                        </ul>
                    </div>
                </div>
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
