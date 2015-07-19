<?php
session_start();
$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['assignment_id']) && $_SESSION['priv_level']>1) {
    include("advanced_user_oo.php");
    Define('DATABASE_SERVER', $hostname);
    Define('DATABASE_USERNAME', $username);
    Define('DATABASE_PASSWORD', $password);
    Define('DATABASE_NAME', 'individualizer');
    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);

    $students = $_POST['students'];
    $ids = $_POST['ids'];
    $assignment_id = $_POST['assignment_id'];

    $query = "INSERT INTO students (assignment_id, net_id, family_name, given_name, field_1, field_2, field_3, field_4, field_5, field_6) VALUES ".$students." ON DUPLICATE KEY
    UPDATE field_1=VALUES(field_1), field_2=VALUES(field_2), field_3=VALUES(field_3), field_4=VALUES(field_4), field_5=VALUES(field_5), field_6=VALUES(field_6); ";
    $query .= "DELETE FROM students WHERE assignment_id='$assignment_id' AND net_id NOT IN ".$ids."; ";
    $result = $mysqli->multi_query($query);

    $mysqli->close();
    echo json_encode($result);
}

?>