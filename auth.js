function login() {
    const user = document.getElementById('lUser').value;
    const pass = document.getElementById('lPass').value;

    if (user === '' || pass === '') {
        alert('Username dan password wajib diisi');
        return;
    }

    const data = new FormData();
    data.append('username', user);
    data.append('password', pass);

    fetch('backend/login.php', {
        method: 'POST',
        body: data
    })
    .then(res => res.json())
    .then(result => {
        if (result.status === 'success') {
            alert('Login berhasil');

            // simpan role login
            localStorage.setItem("role", result.role);

            window.location.href = "dashboard.html";
        }

    })
    .catch(() => alert('Terjadi kesalahan'));
}


// LOGOUT
function logout() {
    fetch('backend/logout.php')
        .then(() => {
            localStorage.removeItem("role");
            window.location.href = "login.html";
        });
}

// RESET PASSWORD
function resetPass() {
    const user = document.getElementById('fUser').value;
    const pass = document.getElementById('fPass').value;

    if (user === '' || pass === '') {
        alert('Isi semua data');
        return;
    }

    const data = new FormData();
    data.append('username', user);
    data.append('password', pass);

    fetch('backend/reset_password.php', {
        method: 'POST',
        body: data
    })
    .then(res => res.text())
    .then(res => {
        if (res === "PASSWORD_DIUBAH") {
            alert("Password berhasil diubah");
        } else if (res === "USER_TIDAK_ADA") {
            alert("Username tidak ditemukan");
        } else {
            alert("Gagal reset password");
        }
    });
}