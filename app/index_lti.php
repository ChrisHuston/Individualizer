<?php
session_start();
// Load up the Basic LTI Support code
require_once 'ims-blti/blti.php';
$context = new BLTI("YourSecret", false, false);

if ( $context->valid ) {
    if (isset($_POST['custom_canvas_user_login_id'])) {
        $_SESSION['course_id'] = $_POST['custom_canvas_course_id'];
        $_SESSION['net_id'] = strtolower($_POST['custom_canvas_user_login_id']);
        $roles = $_POST['roles'];
        if (strpos($roles, 'Administrator') !== false || strpos($roles, 'Instructor') !== false || strpos($roles, 'Designer') !== false || strpos($roles, 'ContentDeveloper') !== false) {
            $_SESSION['priv_level'] = 3;
        } else if (strpos($roles, 'TeachingAssistant') !== false) {
            $_SESSION['priv_level'] = 2;
        } else {
            $_SESSION['priv_level'] = 1;
        }
        $_SESSION['assignment_id'] = $_POST['custom_canvas_assignment_id'];
        if (isset($_POST['lis_result_sourcedid'])) {
            $_SESSION['lis_result_sourcedid'] = $_POST['lis_result_sourcedid'];
            $_SESSION['lis_outcome_service_url'] = $_POST['lis_outcome_service_url'];
            $_SESSION['oauth_consumer_key'] = $_POST['oauth_consumer_key'];
        }
    }
}
?>

<!doctype html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Individualizer</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <link rel="styleSheet" href="../bower_components/angular-ui-grid/ui-grid.min.css"/>
    <link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="../bower_components/angular-material/angular-material.css">
    <link rel="stylesheet" href="styles/main.css">
    <!-- endbuild -->
</head>
<body ng-app="individualizerApp">
<!-- Add your site or application content here -->
<div class="container-fluid" ng-view=""></div>

<script src="../bower_components/angular/angular.min.js"></script>
<script src="../bower_components/angular-route/angular-route.min.js"></script>
<script src="../bower_components/angular-touch/angular-touch.min.js"></script>
<script src="../bower_components/angular-animate/angular-animate.min.js"></script>
<script src="../bower_components/lodash/dist/lodash.min.js"></script>
<script src="../bower_components/angular-ui-grid/ui-grid.min.js"></script>
<script src="../bower_components/angular-material/angular-material.js"></script>
<script src="../bower_components/angular-aria/angular-aria.min.js"></script>

<script src="scripts/app.js"></script>
<script src="scripts/controllers/admin.js"></script>
<script src="scripts/controllers/main.js"></script>
<script src="scripts/services/user.js"></script>
<script src="../bower_components/d3/d3.min.js"></script>
</body>
</html>