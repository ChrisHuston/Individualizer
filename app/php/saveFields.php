<?php
session_start();
$_POST = json_decode(file_get_contents("php://input"), true);
if (isset($_SESSION['assignment_id'])) {
    include("advanced_user_oo.php");
    Define('DATABASE_SERVER', $hostname);
    Define('DATABASE_USERNAME', $username);
    Define('DATABASE_PASSWORD', $password);
    Define('DATABASE_NAME', 'individualizer');
    $mysqli = new mysqli(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);

    $assignment_id = $_POST['assignment_id'];
    if (isset($_POST['field_1'])) {
        $field_1 = $_POST['field_1'];
    }
    if (isset($_POST['field_2'])) {
        $field_2 = $_POST['field_2'];
    }
    if (isset($_POST['field_3'])) {
        $field_3 = $_POST['field_3'];
    }
    if (isset($_POST['field_4'])) {
        $field_4 = $_POST['field_4'];
    }
    if (isset($_POST['field_5'])) {
        $field_5 = $_POST['field_5'];
    }
    if (isset($_POST['field_6'])) {
        $field_6 = $_POST['field_6'];
    }

    $stmt = $mysqli->prepare("INSERT INTO fields (assignment_id, field_1, field_2, field_3, field_4, field_5, field_6)
        VALUES(?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE field_1=VALUES(field_1), field_2=VALUES(field_2), field_3=VALUES(field_3), field_4=VALUES(field_4), field_5=VALUES(field_5), field_6=VALUES(field_6); ");

    $stmt->bind_param("issssss", $assignment_id, $field_1, $field_2, $field_3, $field_4, $field_5, $field_6);
    $result = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    echo json_encode($result);
}

?>