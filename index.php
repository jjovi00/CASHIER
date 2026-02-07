<?php
session_start();
if(!isset($_SESSION['login'])){
    header("Location: auth/login.php");
    exit;
}
?>
<h2>Kasir Parfum</h2>
Halo, <?= $_SESSION['nama']; ?><br><br>

<a href="transaksi/kasir.php">Mulai Transaksi</a><br>
<a href="auth/logout.php">Logout</a>