<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_kasir_up";

$conn = mysqli_connect($host, $user, $pass, $db);
if (!$conn) {
    die("Koneksi database gagal");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $nama     = $_POST['nama_kasir'];
    $tempat  = $_POST['tempat_lahir'];
    $tanggal = $_POST['tanggal_lahir'];
    $jk       = $_POST['jenis_kelamin'];
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $role     = $_POST['role'];

    $sql = "INSERT INTO kasir 
            (nama_kasir, tempat_lahir, tanggal_lahir, jenis_kelamin, username, password, role)
            VALUES 
            ('$nama', '$tempat', '$tanggal', '$jk', '$username', '$password', '$role')";

    if (mysqli_query($conn, $sql)) {
        echo "yeay! registration successful!";
    } else {
        echo "oops.. registration failed";
    }
}