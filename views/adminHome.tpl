<html>

<head>
    <title>Admin Log In - HangarHero.com</title>
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
    <header id="header" class="skels-layers-fixed" style="background-color: #f32853;">
        <h1><strong><a href="index.html">HangarHero.com</a></strong></h1>
        <nav id="nav">
            <ul>
                <li><a href="/admin/home">Admin Home</a></li>
                <li><a href="/admin/logout">Log Out</a></li>
            </ul>
        </nav>
    </header>
    <section id="main" class="wrapper">
        <div class="container">
            <input type="button" onclick="location.href='/admin/modelmanager';" value="Manage Models" />
            <input type="button" onclick="location.href='/admin/addadmin';" value="Add Administrator" />
            <input type="button" onclick="location.href='/admin/loadusdb';" value="WARNING!! UpdateDB" />

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
