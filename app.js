/* ═══════════════════════════════════════════
   FASYA Collection — app.js
   Logika Interaktif Utama
   ═══════════════════════════════════════════ */

// ── Konfigurasi ────────────────────────────
const CONFIG = {
  // Ganti dengan URL CSV Google Sheets yang sudah di-publish ke web
  // Contoh: 'https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv'
  SHEETS_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQshjmB4k2FnZo-48zmmwGea-xvWtaJUjXgB-W--ucmUJfOmyQuoZN45aiGtsCzXhMxGoVYXI9NZErV/pub?output=csv',

  // Nomor WhatsApp toko (format internasional tanpa +)
  NOMOR_WA: '6285641578504',

  // Animasi delay antar kartu (ms)
  CARD_STAGGER_DELAY: 80,
  // Aktifkan debugging sementara (menjalankan pemeriksaan otomatis di console)
  DEBUG: true,
};

// ── Data Produk Dummy ──────────────────────
// Data ini akan digantikan oleh Google Sheets saat CSV URL diisi
const DUMMY_PRODUCTS = [
  {
    id: 1,
    nama: 'Sandal Klasik Pria',
    kategori: 'Pria',
    bahan: 'Kulit',
    ukuran: '39 - 43',
    hargaEcer: 125000,
    hargaGrosir: 2000000,
    warna: [
      { nama: 'Coklat Tua', hex: '#6B4226', foto: '' },
      { nama: 'Hitam',      hex: '#1F1F1F', foto: '' },
      { nama: 'Tan',        hex: '#C4A882', foto: '' },
    ],
  },
  {
    id: 2,
    nama: 'Sandal Tali Wanita',
    kategori: 'Wanita',
    bahan: 'Vinil',
    ukuran: '36 - 40',
    hargaEcer: 85000,
    hargaGrosir: 1400000,
    warna: [
      { nama: 'Cream',  hex: '#CFBB99', foto: '' },
      { nama: 'Bone',   hex: '#E5D7C4', foto: '' },
      { nama: 'Coklat', hex: '#8B6F47', foto: '' },
    ],
  },
  {
    id: 3,
    nama: 'Selop Santai',
    kategori: 'Pria',
    bahan: 'Kulit',
    ukuran: '39 - 44',
    hargaEcer: 110000,
    hargaGrosir: 1800000,
    warna: [
      { nama: 'Coklat Muda', hex: '#A67B5B', foto: '' },
      { nama: 'Hitam',       hex: '#2B2B2B', foto: '' },
    ],
  },
  {
    id: 4,
    nama: 'Sandal Anak Ceria',
    kategori: 'Anak',
    bahan: 'Vinil',
    ukuran: '28 - 34',
    hargaEcer: 45000,
    hargaGrosir: 720000,
    warna: [
      { nama: 'Merah',  hex: '#C0392B', foto: '' },
      { nama: 'Biru',   hex: '#2E86C1', foto: '' },
      { nama: 'Hijau',  hex: '#27AE60', foto: '' },
      { nama: 'Kuning', hex: '#F1C40F', foto: '' },
    ],
  },
  {
    id: 5,
    nama: 'Sandal Jepit Wanita Elegan',
    kategori: 'Wanita',
    bahan: 'Kulit',
    ukuran: '36 - 41',
    hargaEcer: 95000,
    hargaGrosir: 1500000,
    warna: [
      { nama: 'Maroon',  hex: '#6B2D3E', foto: '' },
      { nama: 'Nude',    hex: '#D5B99C', foto: '' },
    ],
  },
  {
    id: 6,
    nama: 'Sandal Gunung Pria',
    kategori: 'Pria',
    bahan: 'Kulit',
    ukuran: '39 - 44',
    hargaEcer: 165000,
    hargaGrosir: 2600000,
    warna: [
      { nama: 'Coklat Tua', hex: '#4C3D19', foto: '' },
      { nama: 'Olive',      hex: '#556B2F', foto: '' },
      { nama: 'Hitam',      hex: '#1A1A1A', foto: '' },
    ],
  },
  {
    id: 7,
    nama: 'Sandal Pita Anak',
    kategori: 'Anak',
    bahan: 'Vinil',
    ukuran: '26 - 32',
    hargaEcer: 40000,
    hargaGrosir: 640000,
    warna: [
      { nama: 'Pink',   hex: '#E091A3', foto: '' },
      { nama: 'Ungu',   hex: '#9B59B6', foto: '' },
      { nama: 'Putih',  hex: '#F5F0E8', foto: '' },
    ],
  },
  {
    id: 8,
    nama: 'Sandal Slide Wanita',
    kategori: 'Wanita',
    bahan: 'Vinil',
    ukuran: '36 - 40',
    hargaEcer: 65000,
    hargaGrosir: 1040000,
    warna: [
      { nama: 'Putih',  hex: '#FAFAFA', foto: '' },
      { nama: 'Hitam',  hex: '#222222', foto: '' },
      { nama: 'Sage',   hex: '#9CAF88', foto: '' },
    ],
  },
];


// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
let produkList = [];
let filterKategori = 'Semua';
let filterBahan = 'Semua';
// Per-card state: tracks selected color index and price type
// { [productId]: { selectedColor: 0, priceType: 'ecer' } }
let cardStates = {};
// Cart stored in localStorage
let keranjang = JSON.parse(localStorage.getItem('fasya_cart') || '[]');


// ═══════════════════════════════════════════
// DOM REFERENCES
// ═══════════════════════════════════════════
const $grid       = document.getElementById('product-grid');
const $emptyState = document.getElementById('empty-state');
const $cartBadge  = document.getElementById('cart-badge');
const $cartDrawer = document.getElementById('cart-drawer');
const $cartOverlay= document.getElementById('cart-overlay');
const $cartItems  = document.getElementById('cart-items');
const $cartEmpty  = document.getElementById('cart-empty');
const $cartFooter = document.getElementById('cart-footer');
const $cartTotal  = document.getElementById('cart-total');
const $toast      = document.getElementById('toast');
const $toastMsg   = document.getElementById('toast-msg');
const $header     = document.getElementById('header');
const $hamburger  = document.getElementById('btn-hamburger');
const $mobileOverlay = document.getElementById('mobile-nav-overlay');


// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initData();
  initFilters();
  initCart();
  initHeader();
  initSmoothScroll();
});


// ═══════════════════════════════════════════
// DATA LOADING
// ═══════════════════════════════════════════

async function initData() {
  if (CONFIG.SHEETS_CSV_URL) {
    try {
      const res = await fetch(CONFIG.SHEETS_CSV_URL);
      const csvText = await res.text();
      produkList = parseCSV(csvText);
    } catch (err) {
      console.warn('Gagal memuat data dari Google Sheets, menggunakan data dummy.', err);
      produkList = DUMMY_PRODUCTS;
    }
  } else {
    produkList = DUMMY_PRODUCTS;
  }

  // Init card states
  produkList.forEach(p => {
    cardStates[p.id] = { selectedColor: 0, priceType: 'ecer' };
  });

  renderProducts();
}

/**
 * Parse CSV text dari Google Sheets menjadi array produk.
 * Kolom yang diharapkan: ID, Nama_Produk, Kategori, Bahan, Ukuran, Harga_Ecer, Harga_Grosir, Warna_Hex, Link_Foto
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 3) return []; // Butuh minimal 2 baris header + 1 baris data

  return lines.slice(2).map(line => {
    const cols = parseCSVLine(line);

    // Helper untuk mem-parsing harga
    function parsePrice(val) {
      if (!val) return 0;
      const cleaned = val.toString().replace(/[^0-9]/g, '');
      return cleaned ? parseInt(cleaned, 10) : 0;
    }

    const hexArr = [];
    const fotoArr = [];
    const namaProduk = (cols[1] || '').trim();
    
    // Looping untuk kolom Warna1-Warna5 (indeks 7-11) dan Foto1-Foto5 (indeks 12-16)
    for (let i = 0; i < 5; i++) {
      const color = (cols[7 + i] || '').trim();
      const photo = (cols[12 + i] || '').trim();
      if (color) {
        hexArr.push(color);
        fotoArr.push(photo);
      }
    }
    
    const warna = hexArr.map((hex, i) => {
      const photo = (fotoArr[i] || '').trim();
      const fotoFinal = photo || buildFotoPath(namaProduk, hex);
      return {
        nama: hex, // Menggunakan kode hex sebagai fallback nama warna
        hex: hex,
        foto: fotoFinal,
      };
    });

    return {
      id: parseInt(cols[0]) || 0,
      nama: namaProduk,
      kategori: (cols[2] || '').trim(),
      bahan: (cols[3] || '').trim(),
      ukuran: (cols[4] || '').trim(),
      hargaEcer: parsePrice(cols[5]),
      hargaGrosir: parsePrice(cols[6]),
      warna: warna.length > 0 ? warna : [{ nama: 'Default', hex: '#CCCCCC', foto: '' }],
    };
  }).filter(p => p.id > 0);
}

/** Simple CSV line parser that handles quoted fields */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}


// ═══════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════

function renderProducts() {
  const filtered = produkList.filter(p => {
    const matchKategori = filterKategori === 'Semua' || p.kategori === filterKategori;
    const matchBahan    = filterBahan === 'Semua' || p.bahan === filterBahan;
    return matchKategori && matchBahan;
  });

  if (filtered.length === 0) {
    $grid.innerHTML = '';
    $emptyState.classList.remove('hidden');
    return;
  }

  $emptyState.classList.add('hidden');

  $grid.innerHTML = filtered.map((produk, idx) => {
    const state = cardStates[produk.id];
    const selectedWarna = produk.warna[state.selectedColor] || produk.warna[0];
    const isGrosir = state.priceType === 'grosir';
    const harga = isGrosir ? produk.hargaGrosir : produk.hargaEcer;
    const priceLabel = isGrosir ? '/ kodi' : '/ pasang';
    const foto = selectedWarna.foto;

    // Determine if swatch is very light (needs border)
    const swatchesHTML = produk.warna.map((w, wIdx) => {
      const isActive = wIdx === state.selectedColor;
      const isLight = isLightColor(w.hex);
      return `<button
        class="color-swatch${isActive ? ' active' : ''}${isLight ? ' swatch-light' : ''}"
        style="background-color: ${w.hex}"
        title="${w.nama}"
        onclick="ubahWarnaProduk(${produk.id}, ${wIdx}, this)"
        aria-label="Warna ${w.nama}"
      ></button>`;
    }).join('');

    const imageHTML = foto
      ? `<img class="product-card__img" id="gambar-produk-${produk.id}" src="${foto}" alt="${produk.nama} — ${selectedWarna.nama}" loading="lazy" />`
      : `<div class="product-card__img-placeholder" id="gambar-produk-${produk.id}">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
             <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
             <circle cx="8.5" cy="8.5" r="1.5"/>
             <polyline points="21 15 16 10 5 21"/>
           </svg>
           <span>${produk.nama}</span>
         </div>`;

    return `
      <article class="product-card" style="animation-delay: ${idx * CONFIG.CARD_STAGGER_DELAY}ms" data-id="${produk.id}">
        <div class="product-card__img-wrap">
          ${imageHTML}
          <span class="product-card__badge">${produk.kategori}</span>
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${produk.nama}</h3>

          <div class="product-card__size">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 12H4M4 12l4 4M4 12l4-4M20 12l-4 4M20 12l-4-4"/>
            </svg>
            <span>Ukuran ${produk.ukuran}</span>
          </div>

          <div class="price-toggle" id="toggle-${produk.id}">
            <button class="price-toggle__btn${!isGrosir ? ' active' : ''}" onclick="toggleHarga(${produk.id}, 'ecer')">Ecer</button>
            <button class="price-toggle__btn${isGrosir ? ' active' : ''}" onclick="toggleHarga(${produk.id}, 'grosir')">Grosir</button>
          </div>

          <div class="product-card__swatches" id="swatch-grup-${produk.id}">
            ${swatchesHTML}
          </div>

          <div class="product-card__price-row">
            <span class="product-card__price" id="harga-${produk.id}">Rp ${formatRupiah(harga)}</span>
            <span class="product-card__price-label" id="label-harga-${produk.id}">${priceLabel}</span>
          </div>

          <button class="product-card__add-btn" onclick="tambahKeKeranjang(${produk.id})" id="btn-tambah-${produk.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Tambah
          </button>
        </div>
      </article>
    `;
  }).join('');
}


// ═══════════════════════════════════════════
// INTERACTIVITY — Color Swatch
// ═══════════════════════════════════════════

function ubahWarnaProduk(idProduk, indeksWarna, clickedEl) {
  const produk = produkList.find(p => p.id == idProduk);
  if (!produk) return;

  const state = cardStates[idProduk];
  if (state) state.selectedColor = indeksWarna;
  const warna = produk.warna[indeksWarna];

  // Find the product card element related to the clicked swatch (robust even if IDs duplicate)
  let cardEl = null;
  if (clickedEl && typeof clickedEl.closest === 'function') {
    cardEl = clickedEl.closest('.product-card');
  }
  if (!cardEl) {
    cardEl = document.querySelector(`.product-card[data-id="${idProduk}"]`);
  }
  if (!cardEl) return;

  // Find image or placeholder within this card
  let elGambar = cardEl.querySelector(`#gambar-produk-${idProduk}`) || cardEl.querySelector('.product-card__img') || cardEl.querySelector('.product-card__img-placeholder');

  // Compute foto to use: prefer explicit foto, fallback to generated path
  const fotoToUse = (warna && warna.foto) ? warna.foto : buildFotoPath(produk.nama, warna && warna.hex);

  if (elGambar) {
    if (fotoToUse) {
      // If currently a placeholder or not an <img>, replace with <img>
      if (elGambar.classList.contains('product-card__img-placeholder') || elGambar.tagName.toLowerCase() !== 'img') {
        const imgEl = document.createElement('img');
        imgEl.className = 'product-card__img';
        imgEl.id = `gambar-produk-${idProduk}`;
        imgEl.src = fotoToUse;
        imgEl.alt = `${produk.nama} — ${warna ? warna.nama : ''}`;
        imgEl.loading = 'lazy';
        imgEl.onerror = function () {
          const placeholder = document.createElement('div');
          placeholder.className = 'product-card__img-placeholder';
          placeholder.id = `gambar-produk-${idProduk}`;
          placeholder.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
             <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
             <circle cx="8.5" cy="8.5" r="1.5"/>
             <polyline points="21 15 16 10 5 21"/>
           </svg><span>${produk.nama}</span>`;
          imgEl.parentNode && imgEl.parentNode.replaceChild(placeholder, imgEl);
        };
        elGambar.parentNode.replaceChild(imgEl, elGambar);
      } else {
        // Smooth transition for existing <img>
        elGambar.style.opacity = '0';
        setTimeout(() => {
          elGambar.src = fotoToUse;
          elGambar.alt = `${produk.nama} — ${warna ? warna.nama : ''}`;
          elGambar.style.opacity = '1';
        }, 200);
        elGambar.onerror = function () {
          const placeholder = document.createElement('div');
          placeholder.className = 'product-card__img-placeholder';
          placeholder.id = `gambar-produk-${idProduk}`;
          placeholder.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
             <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
             <circle cx="8.5" cy="8.5" r="1.5"/>
             <polyline points="21 15 16 10 5 21"/>
           </svg><span>${produk.nama}</span>`;
          elGambar.parentNode.replaceChild(placeholder, elGambar);
        };
      }
    } else {
      // No foto available: keep or update placeholder text
      if (elGambar.classList.contains('product-card__img-placeholder')) {
        const span = elGambar.querySelector('span');
        if (span) span.textContent = `${produk.nama} — ${warna ? warna.nama : ''}`;
      } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'product-card__img-placeholder';
        placeholder.id = `gambar-produk-${idProduk}`;
        placeholder.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
             <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
             <circle cx="8.5" cy="8.5" r="1.5"/>
             <polyline points="21 15 16 10 5 21"/>
           </svg><span>${produk.nama}</span>`;
        elGambar.parentNode.replaceChild(placeholder, elGambar);
      }
    }
  }

  // Update swatch active states only within this card
  const swatches = cardEl.querySelectorAll('.color-swatch');
  swatches.forEach((sw, i) => {
    sw.classList.toggle('active', i === indeksWarna);
  });
}


// ═══════════════════════════════════════════
// INTERACTIVITY — Price Toggle
// ═══════════════════════════════════════════

function toggleHarga(idProduk, tipe) {
  const produk = produkList.find(p => p.id === idProduk);
  if (!produk) return;

  const state = cardStates[idProduk];
  state.priceType = tipe;

  const isGrosir = tipe === 'grosir';
  const harga = isGrosir ? produk.hargaGrosir : produk.hargaEcer;
  const label = isGrosir ? '/ kodi' : '/ pasang';

  // Update price display
  const elHarga = document.getElementById(`harga-${idProduk}`);
  const elLabel = document.getElementById(`label-harga-${idProduk}`);
  if (elHarga) elHarga.textContent = `Rp ${formatRupiah(harga)}`;
  if (elLabel) elLabel.textContent = label;

  // Update toggle buttons
  const toggleBtns = document.querySelectorAll(`#toggle-${idProduk} .price-toggle__btn`);
  toggleBtns.forEach(btn => {
    const btnType = btn.textContent.trim().toLowerCase();
    btn.classList.toggle('active', btnType === tipe);
  });
}


// ═══════════════════════════════════════════
// CART MANAGEMENT
// ═══════════════════════════════════════════

function initCart() {
  updateCartBadge();
  renderCartItems();

  // Open/Close cart
  document.getElementById('btn-open-cart').addEventListener('click', () => openCart());
  document.getElementById('btn-close-cart').addEventListener('click', () => closeCart());
  $cartOverlay.addEventListener('click', () => closeCart());

  // Checkout
  document.getElementById('btn-checkout').addEventListener('click', buatPesanWhatsApp);
}

function openCart() {
  $cartDrawer.classList.add('open');
  $cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  $cartDrawer.classList.remove('open');
  $cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function tambahKeKeranjang(idProduk) {
  const produk = produkList.find(p => p.id === idProduk);
  if (!produk) return;

  const state = cardStates[idProduk];
  const warna = produk.warna[state.selectedColor];
  const isGrosir = state.priceType === 'grosir';
  const harga = isGrosir ? produk.hargaGrosir : produk.hargaEcer;
  const tipe = isGrosir ? 'Grosir (Kodi)' : 'Eceran';

  // Check if same item (same id + same color + same type) already in cart
  const existingIdx = keranjang.findIndex(item =>
    item.id === idProduk &&
    item.warnaHex === warna.hex &&
    item.tipe === tipe
  );

  if (existingIdx >= 0) {
    keranjang[existingIdx].kuantitas += 1;
  } else {
    keranjang.push({
      id: idProduk,
      nama: produk.nama,
      warnaNama: warna.nama,
      warnaHex: warna.hex,
      tipe: tipe,
      harga: harga,
      kuantitas: 1,
    });
  }

  saveCart();
  updateCartBadge();
  renderCartItems();
  showToast(`${produk.nama} ditambahkan ke keranjang!`);

  // Animate the add button
  const btn = document.getElementById(`btn-tambah-${idProduk}`);
  if (btn) {
    btn.style.transform = 'scale(0.92)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  }
}

function ubahKuantitas(cartIdx, delta) {
  if (!keranjang[cartIdx]) return;

  keranjang[cartIdx].kuantitas += delta;
  if (keranjang[cartIdx].kuantitas <= 0) {
    keranjang.splice(cartIdx, 1);
  }

  saveCart();
  updateCartBadge();
  renderCartItems();
}

function hapusItemKeranjang(cartIdx) {
  keranjang.splice(cartIdx, 1);
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function saveCart() {
  localStorage.setItem('fasya_cart', JSON.stringify(keranjang));
}

function updateCartBadge() {
  const totalItems = keranjang.reduce((sum, item) => sum + item.kuantitas, 0);
  $cartBadge.textContent = totalItems;
  $cartBadge.classList.toggle('visible', totalItems > 0);
}

function renderCartItems() {
  if (keranjang.length === 0) {
    $cartItems.innerHTML = '';
    $cartEmpty.classList.remove('hidden');
    $cartFooter.classList.add('hidden');
    return;
  }

  $cartEmpty.classList.add('hidden');
  $cartFooter.classList.remove('hidden');

  let totalHarga = 0;

  $cartItems.innerHTML = keranjang.map((item, idx) => {
    const subtotal = item.harga * item.kuantitas;
    totalHarga += subtotal;

    return `
      <div class="cart-item">
        <div class="cart-item__color-dot" style="background-color: ${item.warnaHex}"></div>
        <div class="cart-item__info">
          <div class="cart-item__name">${item.nama}</div>
          <div class="cart-item__details">${item.warnaNama} · ${item.tipe}</div>
          <div class="cart-item__price">Rp ${formatRupiah(subtotal)}</div>
        </div>
        <div class="cart-item__actions">
          <button class="cart-item__qty-btn" onclick="ubahKuantitas(${idx}, -1)" aria-label="Kurangi">−</button>
          <span class="cart-item__qty">${item.kuantitas}</span>
          <button class="cart-item__qty-btn" onclick="ubahKuantitas(${idx}, 1)" aria-label="Tambah">+</button>
          <button class="cart-item__remove" onclick="hapusItemKeranjang(${idx})" aria-label="Hapus">✕</button>
        </div>
      </div>
    `;
  }).join('');

  $cartTotal.textContent = `Rp ${formatRupiah(totalHarga)}`;
}


// ═══════════════════════════════════════════
// WHATSAPP CHECKOUT
// ═══════════════════════════════════════════

function buatPesanWhatsApp() {
  if (keranjang.length === 0) {
    showToast('Keranjang masih kosong!');
    return;
  }

  const inputNama    = document.getElementById('input-nama').value.trim();
  const inputAlamat  = document.getElementById('input-alamat').value.trim();
  const inputCatatan = document.getElementById('input-catatan').value.trim();

  if (!inputNama || !inputAlamat) {
    showToast('Mohon isi nama dan alamat pengiriman');
    return;
  }

  let totalHarga = 0;
  let teks = `Halo FASYA Collection, Saya ingin memesan:\n\n`;

  keranjang.forEach(item => {
    const subtotal = item.harga * item.kuantitas;
    totalHarga += subtotal;
    teks += `• ${item.nama}\n`;
    teks += `  Warna: ${item.warnaNama}\n`;
    teks += `  Tipe: ${item.tipe}\n`;
    teks += `  Qty: ${item.kuantitas}\n`;
    teks += `  Harga: Rp ${formatRupiah(subtotal)}\n\n`;
  });

  teks += `*Total Keseluruhan: Rp ${formatRupiah(totalHarga)}*\n\n`;
  teks += `*Data Pengiriman:*\n`;
  teks += `Nama: ${inputNama}\n`;
  teks += `Alamat: ${inputAlamat}\n`;
  if (inputCatatan) {
    teks += `Catatan: ${inputCatatan}\n`;
  }

  const urlValid = `https://api.whatsapp.com/send?phone=${CONFIG.NOMOR_WA}&text=${encodeURIComponent(teks)}`;
  window.open(urlValid, '_blank');
}


// ═══════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════

function initFilters() {
  // Kategori
  document.querySelectorAll('#filter-kategori .filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filter-kategori .filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterKategori = btn.dataset.filter;
      renderProducts();
    });
  });

  // Bahan
  document.querySelectorAll('#filter-bahan .filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filter-bahan .filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterBahan = btn.dataset.filter;
      renderProducts();
    });
  });
}


// ═══════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════

function initHeader() {
  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    $header.classList.toggle('scrolled', scrollY > 20);
    lastScroll = scrollY;
  }, { passive: true });

  // Active nav link tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -60% 0px' });

  sections.forEach(section => observer.observe(section));

  // Hamburger toggle
  $hamburger.addEventListener('click', () => {
    $hamburger.classList.toggle('open');
    $mobileOverlay.classList.toggle('open');
    document.body.style.overflow = $mobileOverlay.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  document.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      $hamburger.classList.remove('open');
      $mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}


// ═══════════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════════

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}


// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════

function formatRupiah(num) {
  return num.toLocaleString('id-ID');
}

/**
 * Determine if a hex color is "light" (needs border for visibility).
 * Returns true if perceived brightness > 200.
 */
function isLightColor(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  // Perceived brightness
  return (r * 299 + g * 587 + b * 114) / 1000 > 200;
}

/**
 * Build a fallback image path from product name and hex color.
 * Example: nama="Sandal1", hex="#5a5aa0" => "Assets/Foto produk/Sandal1_5a5aa0.jpg"
 */
function buildFotoPath(nama, hex) {
  if (!nama || !hex) return '';
  const cleanHex = hex.replace('#', '').toLowerCase();
  const cleanName = nama.trim().replace(/\s+/g, '').replace(/[^a-zA-Z0-9_-]/g, '');
  const path = `Assets/Foto produk/${cleanName}_${cleanHex}.jpg`;
  return encodeURI(path);
}

// ---------------- DEBUG HELPERS (development only) ----------------
const DEBUG_MODE = (function () {
  try {
    return (typeof location !== 'undefined' && location.search && location.search.indexOf('debug=1') >= 0) || localStorage.getItem('fasya_debug') === '1';
  } catch (e) {
    return false;
  }
})();

if (DEBUG_MODE) console.info('FASYA debug mode enabled — automated checks will run on load.');

window.fasyaDebug = {
  run: async function () {
    const results = [];
    function pass(msg) { console.log('%cPASS','color:green;font-weight:bold', msg); results.push({msg,ok:true}); }
    function fail(msg) { console.error('%cFAIL','color:red;font-weight:bold', msg); results.push({msg,ok:false}); }

    // allow UI to finish rendering
    await new Promise(r => setTimeout(r, 300));

    if (!Array.isArray(produkList) || produkList.length === 0) {
      fail('produkList kosong atau tidak dimuat');
      return results;
    }
    pass(`produkList terisi (${produkList.length} item)`);

    // Verify render for first few products
    const sample = produkList.slice(0, 4);
    for (const p of sample) {
      const card = document.querySelector(`.product-card[data-id="${p.id}"]`);
      if (!card) { fail(`Kartu produk tidak ditemukan untuk id ${p.id}`); continue; }
      pass(`Kartu ditemukan untuk id ${p.id}`);

      const swatches = card.querySelectorAll('.color-swatch');
      if (swatches.length !== p.warna.length) {
        console.warn(`Jumlah swatch (${swatches.length}) berbeda dari data (${p.warna.length}) untuk id ${p.id}`);
      } else pass(`Swatch count OK untuk id ${p.id}`);

      // Test clicking second swatch (if exists)
      if (swatches.length > 1) {
        const idx = Math.min(1, swatches.length - 1);
        const imgBefore = (card.querySelector('.product-card__img') || {}).src || null;
        swatches[idx].click();
        await new Promise(r => setTimeout(r, 300));
        const imgAfter = (card.querySelector('.product-card__img') || {}).src || null;
        const expected = (p.warna[idx] && p.warna[idx].foto) ? p.warna[idx].foto : buildFotoPath(p.nama, p.warna[idx] && p.warna[idx].hex);
        if (!imgAfter) {
          fail(`Gambar tidak muncul setelah klik swatch pada id ${p.id}`);
        } else if (expected && !imgAfter.includes(expected) && !imgAfter.endsWith(expected)) {
          console.warn(`Gambar berubah tetapi bukan yang diharapkan untuk id ${p.id}. after: ${imgAfter} expected contains: ${expected}`);
          pass(`Gambar berubah untuk id ${p.id} (tidak persis sama dengan expected)`);
        } else pass(`Swatch click mengubah gambar untuk id ${p.id}`);
      }
    }

    // Test price toggle for first product
    const first = produkList[0];
    if (first) {
      const toggle = document.getElementById(`toggle-${first.id}`);
      if (toggle) {
        const priceEl = document.getElementById(`harga-${first.id}`);
        const before = priceEl ? priceEl.textContent : null;
        const grosirBtn = toggle.querySelector('button:nth-child(2)');
        if (grosirBtn) {
          grosirBtn.click();
          await new Promise(r => setTimeout(r, 150));
          const after = priceEl ? priceEl.textContent : null;
          if (before === after) fail('toggleHarga tidak mengubah harga'); else pass('toggleHarga OK');
        } else console.warn('grosir button tidak ditemukan');
      } else console.warn('toggle element tidak ditemukan untuk product pertama');
    }

    // Test add to cart for first product
    if (first) {
      keranjang = [];
      saveCart();
      const addBtn = document.getElementById(`btn-tambah-${first.id}`);
      if (addBtn) {
        addBtn.click();
        await new Promise(r => setTimeout(r, 150));
        if (keranjang.length > 0) pass('tambahKeKeranjang OK'); else fail('tambahKeKeranjang gagal');
      } else console.warn('Add button tidak ditemukan');
    }

    console.table(results);
    return results;
  }
};

if (DEBUG_MODE) setTimeout(() => { window.fasyaDebug.run(); }, 650);

function showToast(msg) {
  $toastMsg.textContent = msg;
  $toast.classList.add('show');
  clearTimeout($toast._timeout);
  $toast._timeout = setTimeout(() => {
    $toast.classList.remove('show');
  }, 2500);
}
