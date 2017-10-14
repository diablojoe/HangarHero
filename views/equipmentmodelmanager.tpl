<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="HangarHero.com">

    <title>Admin- Equipment Model Manager - HangarHero.com</title>

    <!-- Bootstrap Core CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/lumen/bootstrap.min.css">

    <!-- Custom Fonts -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1" crossorigin="anonymous">

    <!-- Include one of jTable styles. -->
    <link href="/static/js/jtable.2.4.0/themes/metro/blue/jtable.min.css" rel="stylesheet" type="text/css" />

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
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
                  <li><a href="/admin/equipmentmodelmanager">Equipment</a></li>
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
          <div class="container">
              <div id="ModelTableContainer"></div>
          </div>
          <p class="text-center"><a href="/static/html/privacypolicy.html">Privacy Policy</a> &copy; HangarHero.com <a href="/static/html/termsofservice.html">Terms of Service</a> </p>
        </div>
      </div>
    </div>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
    <!-- Include jTable script file. -->
    <script src="/static/js/jtable.2.4.0/jquery.jtable.min.js" type="text/javascript"></script>
    <!-- Bootstrap Core JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <script type="text/javascript">
      $(document).ready(function() {
        //Main table covering equipment cats
        $('#ModelTableContainer').jtable({
          title: 'Table of Equipment Categories',
          //paging: true, //Enable paging
          //sorting: true, //Enable sorting
          //defaultSorting: 'ICAO ASC',
          actions: {
            listAction: '/admin/api/listequipmentcat',
            createAction: '/admin/api/addequipmentcat',
            updateAction: '/admin/api/editequipmentcat',
            deleteAction: '/admin/api/deleteequipmentcat'
          },
          fields: {
            CatId: {
              key: true,
              list: false
            },
            Name: {
              title: 'Name',
              width: '40%'
            },
            //subcategories
            SubCats: {
              title: '',
              width: '5%',
              sorting: false,
              edit: false,
              create: false,
              display: function(catData) {
                //Create an image that will be used to open child table
                var $img = $('<img src="/static/img/plane-icon.png" title="Edit associated aircraft" />');
                //Open child table when user clicks the image
                $img.click(function() {
                $('#ModelTableContainer').jtable('openChildTable',
                  $img.closest('tr'), {
                  title: catData.record.Name + ' - Sub-Categories',
                  actions: {
                    listAction: '/admin/api/listassociatedsub/' + catData.record.CatId,
                    deleteAction: '/admin/api/removeassociatedsub',
                    updateAction: '/admin/api/updateassociatedsub',
                    createAction: '/admin/api/createassociatedsub'
                  },
                  fields: {
                    CatId: {
                      type: 'hidden',
                      defaultValue: catData.record.ModelId
                    },
                    SubId: {
                      key: true,
                      create: true,
                      edit: false,
                      list: true,
                      width: '20%',
                      title: 'ID'
                    },
                    Name: {
                      title: 'Name',
                      width: '40%'
                    },
                    Equipment: {
                      title: '',
                      width: '5%',
                      sorting: false,
                      edit: false,
                      create: false,
                      display: function(subData) {
                        //Create an image that will be used to open child table
                        var $img = $('<img src="/static/img/plane-icon.png" title="Edit associated aircraft" />');
                        //Open child table when user clicks the image
                        $img.click(function() {
                          $('#ModelTableContainer').jtable('openChildTable',
                            $img.closest('tr'), {
                            title: subData.record.Name + ' - Associated Aircraft',
                            actions: {
                              listAction: '/admin/api/listassociatedeq/' + subData.record.SubId,
                              deleteAction: '/admin/api/removeassociatedeq',
                              updateAction: '/admin/api/updateassociatedeq',
                              createAction: '/admin/api/createassociatedeq'
                            },
                            fields: {
                              CatId: {
                                type: 'hidden',
                                defaultValue: subData.record.CatId
                              },
                              SubId: {
                                type: 'hidden',
                                defaultValue: subData.record.SubId
                              },
                              EquipmentId: {
                                key: true,
                                create: true,
                                edit: false,
                                list: true,
                                width: '20%',
                                title: 'ID'
                              },
                              Name: {
                                title: 'Name',
                                width: '40%'
                              },
                              Object3d: {
                                title: '',
                                width: '5%',
                                sorting: false,
                                edit: false,
                                create: false,
                                display: function(eqData) {
                                  //Create an image that will be used to open child table
                                  var $img = $('<img src="/static/img/plane-icon.png" title="Edit associated aircraft" />');
                                  //Open child table when user clicks the image
                                  $img.click(function() {
                                    $('#ModelTableContainer').jtable('openChildTable',
                                      $img.closest('tr'), {
                                      title: subData.record.Name + ' - Object3d',
                                      actions: {
                                        listAction: '/admin/api/listassociatedobject3d/' + eqData.record.EquipmentId,
                                        deleteAction: '/admin/api/removeassociatedobject3d',
                                        updateAction: '/admin/api/updateassociatedobject3d',
                                        createAction: '/admin/api/createassociatedobject3d'
                                      },
                                      fields: {
                                        CatId: {
                                          type: 'hidden',
                                          defaultValue: subData.record.CatId
                                        },
                                        SubId: {
                                          type: 'hidden',
                                          defaultValue: subData.record.SubId
                                        },
                                        EquipmentId: {
                                          type: 'hidden',
                                          defaultValue: subData.record.SubId
                                        },
                                        Object3dId: {
                                          key: true,
                                          create: true,
                                          edit: false,
                                          list: true,
                                          width: '20%',
                                          title: 'ID'
                                        },
                                        ICAO: {
                                          title: 'Name',
                                          width: '40%'
                                        },
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
