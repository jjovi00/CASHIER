<?php
session_start();
header('Content-Type: application/json');

$conn = mysqli_connect("localhost", "root", "", "db_kasir_up");

if (!$conn) {
    die("DB ERROR");
}

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

$query = mysqli_query($conn, "SELECT * FROM kasir WHERE username='$username'");
$data = mysqli_fetch_assoc($query);

if (!$data) {
    echo json_encode([
        "status" => "error",
        "message" => "Username tidak ditemukan"
    ]);
    exit;
}

if (!password_verify($password, $data['password'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Password salah"
    ]);
    exit;
}

$_SESSION['login'] = true;
$_SESSION['id_kasir'] = $data['id_kasir'];
$_SESSION['role'] = $data['role'];

echo json_encode([
    "status" => "success",
    "role" => $data['role']
]);