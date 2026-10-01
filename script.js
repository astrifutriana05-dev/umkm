/* ===== UBAH DI SINI ===== */
const CONFIG = {
  whatsapp: "6285162781819",              // nomor WA toko, format 62 tanpa +
  instagram: "https://instagram.com/cwuwicookie",
  info: "Pre-order 1–2 hari sebelumnya. Area antar: Jakarta & sekitarnya. Buka setiap hari 09.00–20.00.",
  tentang: {   // ganti semua isi ini dengan ceritamu sendiri
    judul: "Halo, kenalan dulu ya!",
    cerita: [
      "Cwuwi Cookie adalah usaha kecil yang membuat Dubai chewy cookie dengan tangan sendiri, dalam jumlah kecil supaya selalu fresh.",
      "Tulis di sini kenapa kamu mulai usaha ini, apa yang bikin cookie-mu beda, dan apa yang kamu janjikan ke pembeli."
    ],
    nama: "Nama Pemilik",
    peran: "Pemilik & pembuat cookie",
    foto: "dubaygambar1.jpg"
  },
  lokasi: {
    nama: "Dapur Cwuwi Cookie",
    alamat: "Jl. Contoh No. 12, Jakarta Selatan",   // ganti dengan alamat tokomu
    jam: "Buka setiap hari 09.00–20.00",
    mapsUrl: ""   // opsional: tempel link "Bagikan" dari Google Maps. Kosongkan untuk pencarian otomatis dari alamat.
  },
  badgePO: "Pre-order dibuka setiap hari",
  heroFoto: "dubayposter.jpg",
  items: [
    { id: "ori",  nama: "Dubai Original",       desc: "Pistachio kataifi, 1 pcs",   harga: 35000,  foto: "dubayori.jpg" },
    { id: "dark", nama: "Dark Choco Pistachio", desc: "Cokelat pekat, 1 pcs",       harga: 38000,  foto: "dubaydark.jpg" },
    { id: "box",  nama: "Box Hampers isi 4",    desc: "Campur 2 Original + 2 Dark", harga: 135000, foto: "dubaybox.jpg" }
  ],
  galeri: ["dubaypink.jpg","dubaystrawberry.jpg","dubayvannila.jpg","dubay1.jpg","dubay.png","dubay.jpg"],
  testimoni: [   // ganti dengan testimoni pembelimu yang asli
    { nama: "Contoh Pembeli 1", teks: "Tebal, isinya banyak, dan kataifinya masih kriuk. Pasti pesan lagi." },
    { nama: "Contoh Pembeli 2", teks: "Dibeli buat hampers kantor, semua suka. Kemasannya rapi." },
    { nama: "Contoh Pembeli 3", teks: "Tidak terlalu manis, pistachio-nya terasa. Pengiriman cepat." }
  ],
  faq: [
    ["Berapa lama cookie tahan?", "5 hari di suhu ruang, 2 minggu di kulkas. Hangatkan sebentar sebelum dimakan agar kembali chewy."],
    ["Apakah mengandung kacang?", "Ya, mengandung pistachio dan gandum. Informasikan alergi saat memesan."],
    ["Bisa kirim ke luar kota?", "Bisa lewat ekspedisi. Tanyakan ongkir lewat WhatsApp."],
    ["Bagaimana cara bayar?", "Transfer bank atau e-wallet. Detailnya kami kirim setelah pesanan masuk."]
  ]
};
/* ======================== */

const $ = id => document.getElementById(id);
const rp = n => "Rp" + n.toLocaleString("id-ID");
const qty = {};

if (matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.setAttribute("data-bs-theme", "dark");

/* Placeholder otomatis kalau file foto belum ada */
function placeholder(src) {
  const nama = (src || "foto").split("/").pop();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#dfe7c4"/>
  <circle cx="200" cy="170" r="70" fill="#8FB339"/><circle cx="200" cy="170" r="52" fill="#4A2C1D"/>
  <text x="200" y="290" font-family="sans-serif" font-size="20" text-anchor="middle" fill="#5F7A21">Taruh foto di</text>
  <text x="200" y="320" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="#3B2217">images/${nama}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function pasangFoto(img, src) {
  img.dataset.src = src;
  img.addEventListener("error", () => { if (!img.dataset.fb) { img.dataset.fb = 1; img.src = placeholder(src); } });
  let tersimpan = null;
  try { tersimpan = localStorage.getItem("foto:" + src); } catch (e) {}
  img.src = tersimpan || src;   // foto yang dipilih lewat Edit foto didahulukan
}
const fotoTag = (src, cls, alt) => `<img class="foto ${cls}" data-src="${src}" alt="${alt}" loading="lazy">`;
function aktifkanFoto(root) { root.querySelectorAll("img[data-src]").forEach(i => pasangFoto(i, i.dataset.src)); }

function render() {
  pasangFoto($("hero-foto"), CONFIG.heroFoto);
  $("badge-po").textContent = CONFIG.badgePO;

  $("items").innerHTML = CONFIG.items.map(i => {
    qty[i.id] = 0;
    return `
    <div class="list-group-item d-flex align-items-center gap-3 p-3">
      ${fotoTag(i.foto, "thumb", i.nama)}
      <div class="flex-grow-1">
        <div class="fw-bold">${i.nama}</div>
        <small class="text-body-secondary">${i.desc}</small>
        <div class="harga">${rp(i.harga)}</div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button type="button" class="btn btn-outline-success qty-btn" data-id="${i.id}" data-d="-1" aria-label="Kurangi ${i.nama}">−</button>
        <output id="q-${i.id}" class="fw-bold text-center" style="min-width:22px">0</output>
        <button type="button" class="btn btn-outline-success qty-btn" data-id="${i.id}" data-d="1" aria-label="Tambah ${i.nama}">+</button>
      </div>
    </div>`;
  }).join("");

  $("galeri-grid").innerHTML = CONFIG.galeri.map((g, n) =>
    `<div class="col">${fotoTag(g, "galeri-img", "Foto Cwuwi Cookie " + (n + 1))}</div>`).join("");

  $("testi-grid").innerHTML = CONFIG.testimoni.map(t => `
    <div class="col-md-4"><div class="card h-100 shadow-sm"><div class="card-body">
      <div class="bintang" aria-label="5 dari 5 bintang">★★★★★</div>
      <p class="my-2">${t.teks}</p><small class="text-body-secondary fw-bold">${t.nama}</small>
    </div></div></div>`).join("");

  $("faq-list").innerHTML = CONFIG.faq.map((f, n) => `
    <div class="accordion-item">
      <h3 class="accordion-header"><button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq${n}">${f[0]}</button></h3>
      <div id="faq${n}" class="accordion-collapse collapse" data-bs-parent="#faq-list"><div class="accordion-body">${f[1]}</div></div>
    </div>`).join("");

  $("f-info").textContent = CONFIG.info;
  $("wa-link").href = `https://wa.me/${CONFIG.whatsapp}`;
  $("wa-fab").href = `https://wa.me/${CONFIG.whatsapp}`;
  $("ig-link").href = CONFIG.instagram;
  const L = CONFIG.lokasi, q = encodeURIComponent(L.alamat);
  $("lok-nama").textContent = L.nama;
  $("lok-alamat").textContent = L.alamat;
  $("lok-jam").textContent = L.jam;
  $("lok-buka").href = L.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${q}`;
  $("lok-arah").href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  $("lok-peta").src = `https://www.google.com/maps?q=${q}&output=embed`;

  const T = CONFIG.tentang;
  pasangFoto($("tentang-foto"), T.foto);
  $("tentang-judul").textContent = T.judul;
  $("tentang-teks").innerHTML = T.cerita.map(p => `<p class="text-body-secondary">${p}</p>`).join("");
  $("tentang-nama").textContent = T.nama;
  $("tentang-peran").textContent = T.peran;

  aktifkanFoto(document);
}

function update() {
  let total = 0;
  CONFIG.items.forEach(i => { $("q-" + i.id).textContent = qty[i.id]; total += qty[i.id] * i.harga; });
  $("total").textContent = rp(total);
  return total;
}
function tampilError(teks) { $("err").textContent = teks; $("err").classList.toggle("d-none", !teks); }

$("items").addEventListener("click", e => {
  const b = e.target.closest("button[data-id]");
  if (!b) return;
  qty[b.dataset.id] = Math.max(0, qty[b.dataset.id] + Number(b.dataset.d));
  tampilError(""); update();
});

/* Klik foto galeri -> perbesar */
$("galeri-grid").addEventListener("click", e => {
  const img = e.target.closest("img");
  if (!img) return;
  $("foto-besar").src = img.src; $("foto-besar").alt = img.alt;
  bootstrap.Modal.getOrCreateInstance($("foto-modal")).show();
});

$("kirim").addEventListener("click", () => {
  const total = update();
  const nama = $("nama").value.trim(), alamat = $("alamat").value.trim(), catatan = $("catatan").value.trim();
  if (total === 0) return tampilError("Pilih minimal satu cookie dulu.");
  if (!nama)       return tampilError("Isi nama kamu dulu.");
  if (!alamat)     return tampilError("Isi alamat pengiriman atau tulis 'ambil di tempat'.");
  const baris = CONFIG.items.filter(i => qty[i.id] > 0)
    .map(i => `- ${i.nama} x${qty[i.id]} = ${rp(i.harga * qty[i.id])}`).join("\n");
  const pesan = `Halo Cwuwi Cookie, saya mau pesan:\n${baris}\n\nTotal: ${rp(total)}\nNama: ${nama}\nAlamat: ${alamat}` + (catatan ? `\nCatatan: ${catatan}` : "");
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(pesan)}`, "_blank", "noopener");
});

render();
update();

/* ===== Mode edit foto: pilih foto langsung dari website ===== */
let editMode = false, slotAktif = null;

function setEdit(on) {
  editMode = on;
  document.body.classList.toggle("edit-mode", on);
  $("edit-bar").classList.toggle("d-none", !on);
  $("btn-edit").classList.toggle("d-none", on);
}
$("btn-edit").addEventListener("click", () => setEdit(true));
$("btn-selesai").addEventListener("click", () => setEdit(false));

// Saat mode edit aktif, klik foto = ganti foto (menggantikan lightbox)
document.addEventListener("click", e => {
  if (!editMode) return;
  const img = e.target.closest("img.foto");
  if (!img) return;
  e.preventDefault(); e.stopPropagation();
  slotAktif = img;
  $("pilih-foto").click();
}, true);

// Kecilkan foto agar ringan (maks 1000px) lalu jadikan JPEG
function kecilkan(file, max, selesai) {
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, max / Math.max(im.width, im.height));
      const c = document.createElement("canvas");
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      selesai(c.toDataURL("image/jpeg", 0.82));
    };
    im.src = r.result;
  };
  r.readAsDataURL(file);
}

$("pilih-foto").addEventListener("change", e => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file || !slotAktif) return;
  const img = slotAktif;
  kecilkan(file, 1000, data => {
    try {
      localStorage.setItem("foto:" + img.dataset.src, data);
      delete img.dataset.fb;
      img.src = data;
    } catch (err) {
      alert("Penyimpanan browser penuh. Coba foto yang lebih kecil atau tekan Reset.");
    }
  });
});

// Unduh foto yang sudah dipilih, dengan nama file sesuai CONFIG
$("btn-unduh").addEventListener("click", () => {
  const kunci = Object.keys(localStorage).filter(k => k.startsWith("foto:"));
  if (!kunci.length) return alert("Belum ada foto yang kamu ganti.");
  kunci.forEach((k, n) => setTimeout(() => {
    const a = document.createElement("a");
    a.href = localStorage.getItem(k);
    a.download = k.slice(5).split("/").pop().replace(/\.\w+$/, ".jpg");
    a.click();
  }, n * 400));
});

$("btn-reset").addEventListener("click", () => {
  if (!confirm("Hapus semua foto yang kamu pilih dan kembali ke foto di folder images?")) return;
  Object.keys(localStorage).filter(k => k.startsWith("foto:")).forEach(k => localStorage.removeItem(k));
  location.reload();
});
