<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Lupa Password</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
</head>
<body class="d-flex justify-content-center align-items-center vh-100">

<div class="card p-4" style="width:350px">
  <h4 class="text-center mb-3">Lupa Password</h4>

  <form action="reset_password.php" method="POST">
    <input type="text" name="username" class="form-control mb-2" placeholder="Username" required>
    <input type="text" name="id_karyawan" class="form-control mb-3" placeholder="ID Karyawan" required>

    <button class="btn btn-primary w-100">Verifikasi</button>
  </form>
</div>

</body>
</html>
