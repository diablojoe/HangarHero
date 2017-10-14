<html>

<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="description" content="" />
    <meta name="keywords" content="" />

    <!--[if lte IE 8]><script src="js/html5shiv.js"></script><![endif]-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>
    <script src="/static/js/skel.min.js"></script>
    <script src="/static/js/skel-layers.min.js"></script>
    <script src="/static/js/init.js"></script>
    <noscript>
        <link rel="stylesheet" href="static/css/skel.css" />
        <link rel="stylesheet" href="static/css/style.css" />
        <link rel="stylesheet" href="static/css/style-xlarge.css" />
    </noscript>

    <!-- Include charts Prerequisites -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1/vis.min.js"></script>
    <link href="/static/css/vis.css" rel="stylesheet" type="text/css" />

    <!-- Include JQUERY Widgets -->
    <link href="https://code.jquery.com/ui/1.11.4/themes/redmond/jquery-ui.css" rel="stylesheet">

    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
    <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>

    <!-- Includes for  Date Range Picker -->
    <script type="text/javascript" src="//cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/bootstrap/latest/css/bootstrap.css" />

    <!-- Include Date Range Picker -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/1.6.1/jquery-ui-timepicker-addon.min.js"></script>
    <link rel="stylesheet" media="all" type="text/css" href="/static/css/jquery-ui-timepicker-addon.css" />

    <script src="/static/js/overview.js"></script>

</head>

<body>
    <header id="header" class="skels-layers-fixed">
        <h1><strong><a href="/">HangarHero.com</a></strong></h1>
        <nav id="nav">
            <ul>
                <li><a href="/logout">Log Out</a></li>
            </ul>
        </nav>
    </header>
    <section id="main" class="wrapper">
        <div class="container">
            <div id="tabs">
                <ul id="tabTitles"></ul>
            </div>
           <button type="button" id="addhangar">Add Hangar</button>
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
    <!--Hidden diag boxes -->
    <div id="dialog" title="Add Aircraft" style="z-index:15000;">
        Registration number:
        <br>
        <input id="regnumber" type="text">
        <button id="search">Search</button>
        <br>
        <span id="id" style="display:none;"></span>
        <br>
        <span id="acowner"></span>
        <br>
        <span id="make"></span>
        <br>
        <span id="model"></span>
        <br>
        <input type="text" name="daterange" id="rangestart" />
        <input type="text" name="daterange" id="rangeend" />
        <span id="diagHangarId" style="display:none;"></span>
    </div>
    <div id="dialogequipment" title="Add Equipment" style="z-index:15000;">
        <label for="categories">Category: </label>
        <select name="categories" id="categories">
        </select>
        <br>
        <label for="equipment">Equipment: </label>
        <select name="equipment" id="equipment">
        </select>
        <br>
        <input type="text" name="daterange" id="eqrangestart" />
        <input type="text" name="daterange" id="eqrangeend" />
        <span id="eqdiagHangarId" style="display:none;"></span>
    </div>
    <div id="dialogerror" title="Error" style="z-index:15000;">
        <div class="ui-widget">
            <div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">
                <p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>
                    <strong>Alert:</strong> <span id="errormsg"></span></p>
            </div>
        </div>
    </div>

    <script>
        $("#tabs").tabs();
        var mytabs = new tabSetup();
        mytabs.init();
        $(function() {
            $("#addhangar")
                .button()
                .click(function(event) {
                    window.location.href = "/addhangar"
                });
        });

    </script>
</body>

</html>
