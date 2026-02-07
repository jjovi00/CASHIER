<?php
include "koneksi.php";

$username = $_POST['username'];
$id       = $_POST['id_karyawan'];

// Cek data
$cek = mysqli_query($conn,
    "SELECT * FROM users 
     WHERE username='$username' AND id_karyawan='$id'"
);

if (mysqli_num_rows($cek) == 0) {
    echo "<script>
        alert('Data tidak ditemukan!');
        window.location='lupa_password.php';
    </script>";
    exit;
}

// Password baru otomatis
$password_baru = rand(100000,999999);
$password_hash = password_hash($password_baru, PASSWORD_DEFAULT);

// Update password
mysqli_query($conn,
    "UPDATE users SET password='$password_hash'
     WHERE username='$username' AND id_karyawan='$id'"
);

echo "
<!DOCTYPE html>
<html>
<head>
<title>Password Baru</title>
<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'>
</head>
<body class='d-flex justify-content-center align-items-center vh-100'>
<div class='card p-4 text-center'>
  <h5>Password Baru Anda</h5>
  <h2 class='text-success'>$password_baru</h2>
  <p>Silakan login dan ganti password.</p>
  <a href='login.php' class='btn btn-success'>Login</a>
</div>
</body>
</html>
";
?>
