<?php
session_start();
class UserInfo {
    var $login_error = "NONE";
    var $fields = [];
    var $values = [];
    var $assignment_id;
    var $priv_level = 1;
    var $students = [];
}

$res = new UserInfo();

$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['assignment_id'])) {
    include("advanced_user_oo.php");
    Define('DATABASE_SERVER', $hostname);
    Define('DATABASE_USERNAME', $username);
    Define('DATABASE_PASSWORD', $password);
    Define('DATABASE_NAME', 'individualizer');

    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);

    $assignment_id = $_SESSION['assignment_id'];
    $res->priv_level = $_SESSION['priv_level'];
    $res->assignment_id = $assignment_id;

    $query = "SELECT field_1, field_2, field_3, field_4, field_5, field_6
        FROM fields
        WHERE assignment_id='$assignment_id'";

    $result = $mysqli->query($query);
    $json = array();
    while ($row = $result->fetch_assoc()) {
        $json[] = $row;
    }
    $res->fields = $json;
    
    if ($res->priv_level==1) {
        $net_id = $_SESSION['net_id'];
        $query = "SELECT field_1, field_2, field_3, field_4, field_5, field_6
        FROM students
        WHERE net_id='$net_id' AND assignment_id='$assignment_id'";

        $result = $mysqli->query($query);
        $json = array();
        while ($row = $result->fetch_assoc()) {
            $json[] = $row;
        }
        $res->values = $json;
    } else {
        $query = "SELECT net_id, family_name, given_name, field_1, field_2, field_3, field_4, field_5, field_6
        FROM students
        WHERE assignment_id='$assignment_id'";

        $result = $mysqli->query($query);
        $json = array();
        while ($row = $result->fetch_assoc()) {
            $json[] = $row;
        }
        $res->students = $json;
    }
    
    $mysqli->close();
    echo json_encode($res);

} else {
    $res->login_error = "Authentication error.";
    echo json_encode($res);
}

?>