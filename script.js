let users = JSON.parse(localStorage.getItem("users")) || [];
let transaksi = [];
let currentUser = null;
let hasilScan = null;

/* DATABASE BARANG */
const barangDB = {
  "8992775210011": { nama: "Pulpen", harga: 3000 },
  "8999999030012": { nama: "Buku", harga: 8000 }
};

/* NAVIGASI */
function show(id){
  document.querySelectorAll("div[id]").forEach(d=>d.classList.add("d-none"));
  document.getElementById(id).classList.remove("d-none");
}

/* HASH PASSWORD */
async function hash(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
}

/* REGISTER */
async function register(){
  const tgl = new Date(rTanggal.value).toLocaleDateString("id-ID", {
    day:"numeric", month:"long", year:"numeric"
  });
  const ttlGabung = rTempat.value + ", " + tgl;

  users.push({
    nama: rNama.value,
    id: rID.value,
    ttl: ttlGabung,
    jk: rJK.value,
    username: rUser.value,
    password: await hash(rPass.value),
    role: rRole.value
  });

  localStorage.setItem("users", JSON.stringify(users));
  alert("Register berhasil");
  show("login");
}

/* LOGIN */
async function login(){
  const errorBox = document.getElementById("loginError");
  const card = document.getElementById("login");
  const btn = document.getElementById("loginBtn");
  const text = document.getElementById("loginText");
  const spinner = document.getElementById("loginSpinner");

  // reset
  errorBox.classList.add("d-none");
  errorBox.innerText = "";
  lUser.classList.remove("input-error");
  lPass.classList.remove("input-error");

  // VALIDASI KOSONG
  if(!lUser.value || !lPass.value){
    errorBox.innerText = "Username dan password wajib diisi";
    errorBox.classList.remove("d-none");

    if(!lUser.value) lUser.classList.add("input-error");
    if(!lPass.value) lPass.classList.add("input-error");

    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
    return;
  }

  // LOADING ON
  btn.disabled = true;
  text.innerText = "Memeriksa...";
  spinner.classList.remove("d-none");

  await new Promise(r => setTimeout(r, 600)); // simulasi loading

  const user = users.find(x => x.username === lUser.value);

  if(!user){
    errorBox.innerText = "Username tidak ditemukan";
    errorBox.classList.remove("d-none");
    lUser.classList.add("input-error");

    btn.disabled = false;
    text.innerText = "Login";
    spinner.classList.add("d-none");

    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
    return;
  }

  const pass = await hash(lPass.value);

  if(user.password !== pass){
    errorBox.innerText = "Password salah";
    errorBox.classList.remove("d-none");
    lPass.classList.add("input-error");

    btn.disabled = false;
    text.innerText = "Login";
    spinner.classList.add("d-none");

    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");

    lPass.value = "";
    return;
  }

  // LOGIN BERHASIL ✅
  spinner.classList.add("d-none");
  text.innerText = "Berhasil";

  card.classList.add("glow-success", "bounce");

  setTimeout(()=>{
    currentUser = user;
    show("dashboard");
    btn.disabled = false;
    text.innerText = "Login";
    card.classList.remove("glow-success", "bounce");
  },500);
}


/* RESET PASSWORD */
async function resetPass(){
  const u = users.find(x=>x.username===fUser.value && x.id===fID.value);
  if(!u) return alert("Data salah");
  u.password = await hash(fPass.value);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Password diubah");
  show("login");
}

/* ADMIN */
function showAdmin(){
  adminList.innerHTML="";
  users.forEach((u,i)=>{
    adminList.innerHTML+=`
    <tr>
      <td>${u.nama}</td>
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td>${u.role}</td>
      <td><button class="btn btn-danger btn-sm" onclick="hapus(${i})">Hapus</button></td>
    </tr>`;
  });
  show("admin");
}

function hapus(i){
  users.splice(i,1);
  localStorage.setItem("users",JSON.stringify(users));
  showAdmin();
}

/* BARCODE SCANNER */
function startScan(){
  previewBarang.classList.add("d-none");
  Quagga.init({
    inputStream:{type:"LiveStream",target:scanner,constraints:{facingMode:"environment"}},
    decoder:{readers:["ean_reader","code_128_reader"]}
  },()=>Quagga.start());

  Quagga.onDetected(d=>{
    const code=d.codeResult.code;
    if(barangDB[code]){
      hasilScan={barcode:code,...barangDB[code]};
      pBarcode.innerText=code;
      pNama.innerText=hasilScan.nama;
      pHarga.innerText=hasilScan.harga;
      previewBarang.classList.remove("d-none");
      Quagga.stop();
    }
  });
}

function isiDariScan(){
  namaBarang.value=hasilScan.nama;
  hargaBarang.value=hasilScan.harga;
  jumlahBarang.value=1;
  previewBarang.classList.add("d-none");
}

/* TRANSAKSI */
function tambah(){
  const total = hargaBarang.value * jumlahBarang.value;
  transaksi.push({nama:namaBarang.value,total});
  render();
}

function render(){
  let sum=0;
  list.innerHTML="";
  transaksi.forEach(x=>{
    sum+=x.total;
    list.innerHTML+=`<tr><td>${x.nama}</td><td>Rp ${x.total}</td></tr>`;
  });
  total.innerText="Total: Rp "+sum;
}

/* METODE PEMBAYARAN + QR */
function pilihMetode(){
  const metode = metodeBayar.value;
  tunaiBox.classList.toggle("d-none", metode !== "Tunai");

  if(metode && metode !== "Tunai"){
    barcodeBox.classList.remove("d-none");
    const totalBayar = total.innerText.replace("Total: Rp ","");
    const dataQR = `Pembayaran ${metode} | Total Rp ${totalBayar}`;

    QRCode.toDataURL(dataQR,{width:200},(e,url)=>barcodeImg.src=url);
  }else{
    barcodeBox.classList.add("d-none");
  }
}

/* KEMBALIAN */
uangBayar?.addEventListener("input",()=>{
  const t = parseInt(total.innerText.replace("Total: Rp ","")) || 0;
  const b = parseInt(uangBayar.value) || 0;
  kembalian.innerText = b - t;
});

/* VALIDASI */
function validasiPembayaran(){
  if(!metodeBayar.value){
    alert("Pilih metode pembayaran!");
    return false;
  }
  if(metodeBayar.value==="Tunai"){
    const t = parseInt(total.innerText.replace("Total: Rp ",""));
    if((parseInt(uangBayar.value)||0) < t){
      alert("Uang tunai kurang!");
      return false;
    }
  }
  return true;
}

/* CETAK STRUK */
function cetak(){
  if(!validasiPembayaran()) return;

  let s="<h3>STRUK</h3>";
  transaksi.forEach(x=>s+=`<p>${x.nama} - Rp ${x.total}</p>`);
  s+=`<p><b>Metode:</b> ${metodeBayar.value}</p>`;

  const w=window.open();
  w.document.write(s);
  w.print();
}

function logout(){location.reload();}
lUser.addEventListener("input", ()=>loginError.classList.add("d-none"));
lPass.addEventListener("input", ()=>loginError.classList.add("d-none"));
lUser.addEventListener("input", ()=>{
  lUser.classList.remove("input-error");
  loginError.classList.add("d-none");
});

lPass.addEventListener("input", ()=>{
  lPass.classList.remove("input-error");
  loginError.classList.add("d-none");
});
const produkData = [
  {
    nama:"Nasi Goreng",
    harga:15000,
    kategori:"makanan",
    gambar:"https://source.unsplash.com/400x300/?nasi-goreng"
  },
  {
    nama:"Mie Ayam",
    harga:12000,
    kategori:"makanan",
    gambar:"https://source.unsplash.com/400x300/?mie-ayam"
  },
  {
    nama:"Ayam Geprek",
    harga:18000,
    kategori:"makanan",
    gambar:"https://source.unsplash.com/400x300/?ayam-geprek"
  },
  {
    nama:"Es Teh",
    harga:5000,
    kategori:"minuman",
    gambar:"https://source.unsplash.com/400x300/?ice-tea"
  },
  {
    nama:"Kopi",
    harga:8000,
    kategori:"minuman",
    gambar:"https://source.unsplash.com/400x300/?coffee"
  },
  {
    nama:"Keripik",
    harga:6000,
    kategori:"snack",
    gambar:"https://source.unsplash.com/400x300/?snack"
  }
];

const produkList = document.getElementById("produkList");

/* TAMPILKAN PRODUK */
function renderProduk(filter="all"){
  produkList.innerHTML = "";

  produkData
    .filter(p => filter==="all" || p.kategori===filter)
    .forEach(p => {
      produkList.innerHTML += `
        <div class="col-6 col-md-4">
          <div class="produk-card" onclick="tambahKeKasir('${p.nama}', ${p.harga})">
            <img src="${p.gambar}" alt="${p.nama}">
            <div class="produk-info">
              <h6>${p.nama}</h6>
              <small>Rp ${p.harga.toLocaleString()}</small>
            </div>
          </div>
        </div>
      `;
    });
}

/* FILTER KATEGORI */
function filterKategori(kategori){
  renderProduk(kategori);
}

/* MASUK KE KASIR */
function tambahKeKasir(nama, harga){
  document.getElementById("namaBarang").value = nama;
  document.getElementById("hargaBarang").value = harga;
  document.getElementById("jumlahBarang").value = 1;

  tambahBarang(); // fungsi kasir kamu
}

/* LOAD AWAL */
renderProduk();
function showPage(id){
  document.querySelectorAll(".page")
    .forEach(p=>p.classList.add("d-none"));
  document.getElementById(id).classList.remove("d-none");
}
