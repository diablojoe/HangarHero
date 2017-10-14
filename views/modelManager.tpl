<html>

<head>
    <title>Model Manager - HangarHero.com</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <!--[if lte IE 8]><script src="js/html5shiv.js"></script><![endif]-->
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
    <script src="/static/js/skel.min.js"></script>
    <script src="/static/js/skel-layers.min.js"></script>
    <script src="/static/js/init.js"></script>
    <!-- Include JQUERY Widgets -->
    <link href="https://code.jquery.com/ui/1.11.4/themes/redmond/jquery-ui.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
    <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
    <!-- Include one of jTable styles. -->
    <link href="/static/js/jtable.2.4.0/themes/metro/blue/jtable.min.css" rel="stylesheet" type="text/css" />

    <!-- Include jTable script file. -->
    <script src="/static/js/jtable.2.4.0/jquery.jtable.min.js" type="text/javascript"></script>
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
            <ul>
                <li><a href="/admin/home">Admin Home</a></li>
                <li><a href="/admin/logout">Log Out</a></li>
            </ul>
            </ul>
        </nav>
    </header>
    <section id="main" class="wrapper">
        <div class="container">
            <div id="ModelTableContainer"></div>
        </div>
        <div class="container">
            <form action="/admin/modelmanager" method="post" id="addObject3d" enctype="multipart/form-data">
                <input type="text" name="ICAO" placeholder="ICAO"><br>
                <br>
                <input type="file" name="objfile" placeholder="Object FIle"><br>
                <br>
                <input type="submit" name="submit"><br>
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
    <script type="text/javascript">
        $(document).ready(function() {
            $('#ModelTableContainer').jtable({
                title: 'Table of models',
                //paging: true, //Enable paging
                //sorting: true, //Enable sorting
                //defaultSorting: 'ICAO ASC',
                actions: {
                    listAction: '/admin/api/listobject3d',
                    createAction: '/admin/api/addobject3d',
                    updateAction: '/admin/api/editobject3d',
                    deleteAction: '/admin/api/deleteobject3d'
                },
                fields: {
                    ModelId: {
                        key: true,
                        list: false
                    },
                    Name: {
                        title: 'Name',
                        width: '40%'
                    },
                    ICAO: {
                        title: 'ICAO',
                        width: '20%'
                    },
                    Location: {
                        title: 'Location',
                        width: '30%',
                    },
                    AssociatedAC: {
                        title: '',
                        width: '5%',
                        sorting: false,
                        edit: false,
                        create: false,
                        display: function(aircraftData) {
                            //Create an image that will be used to open child table
                            var $img = $('<img src="/static/img/plane-icon.png" title="Edit associated aircraft" />');
                            //Open child table when user clicks the image
                            $img.click(function() {
                                $('#ModelTableContainer').jtable('openChildTable',
                                    $img.closest('tr'), {
                                        title: aircraftData.record.Name + ' - Associated Aircraft',
                                        actions: {
                                            listAction: '/admin/api/associatedaclist/' + aircraftData.record.ModelId,
                                            deleteAction: '/admin/api/removeassociatedcode',
                                            updateAction: '/admin/api/updateassociatedcode',
                                            createAction: '/admin/api/createassociatedcode'
                                        },
                                        fields: {
                                            ModelId: {
                                                type: 'hidden',
                                                defaultValue: aircraftData.record.ModelId
                                            },
                                            CodeId: {
                                                key: true,
                                                create: true,
                                                edit: false,
                                                list: true,
                                                width: '20%',
                                                title: 'ID'
                                            },
                                            Make: {
                                                title: 'Make',
                                                width: '30%',
                                                edit: false, 
                                                create: false
                                            },
                                            Model: {
                                                title: 'Model',
                                                width: '30%',
                                                edit: false,
                                                create: false
                                            }
                                        }
                                    },
                                    function(data) { //opened handler
                                        data.childTable.jtable('load');
                                    });
                            });
                            //Return image to show on the person row
                            return $img;
                        }
                    }
                },

            });
            $('#ModelTableContainer').jtable('load');
        });

    </script>
</body>

</html>
