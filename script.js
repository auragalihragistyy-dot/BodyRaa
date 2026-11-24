/* BodyRaa — Body & Style
   Semua interaksi utama berada di file ini. Data profil disimpan lokal di browser. */
(() => {
  'use strict';

  const STORAGE_KEY = 'BodyRaa-profile-v2';
  const $ = (id) => document.getElementById(id);
  let profile = null;
  let currentFilter = 'all';
  let toastTimer = null;

  // Katalog outfit set: ganti path gambar di sini saat menambahkan foto milikmu.
  // Setiap set memiliki foto utama dan detail item terpisah.
  const outfitSets = [
    {
      id: 'soft-casual',
      category: 'casual',
      shape: 'Pear Shape',
      title: 'Soft Casual Set',
      subtitle: 'CASUAL · EVERYDAY',
      cover: 'image/pear_outfit1_model.jpg',
      detailImage: 'image/pear_outfit1_model.jpg',
      itemsImage: 'image/pear_outfit1_landscape.png',
      description: 'Inspirasi outfit kasual dengan atasan hitam, celana ivory, hijab beige taupe, dan aksesori senada.',
      note: 'Padukan atasan hitam dengan celana ivory dan hijab beige taupe. Tas hitam dan sepatu off-white melengkapi tampilan.',
      items: [
        { label: 'Hijab', name: 'Beige taupe' },
        { label: 'Atasan', name: 'Hitam pekat' },
        { label: 'Bawahan', name: 'Celana ivory cream' },
        { label: 'Tas', name: 'Jet black' },
        { label: 'Sepatu', name: 'Off-white cream' }
      ]
    },
    {
      id: 'feminine-charm',
      category: 'feminine',
      shape: 'Pear Shape',
      title: 'Feminine Charm',
      subtitle: 'FEMININE · STYLE 02',
      cover: 'image/feminim.png',
      detailImage: 'image/feminim.png',
      itemsImage: 'image/outfit_feminim.png',
      itemsImageAlt: 'Detail item Feminine Charm: hijab beige taupe, blus burgundy, rok krem, tas ivory, dan sepatu cream beige',
      description: 'Tampilan feminin dengan blus burgundy berlengan puff, rok plisket warna krem, dan hijab beige taupe.',
      note: 'Jadikan blus burgundy sebagai aksen warna, lalu padukan dengan rok krem dan hijab beige taupe. Tas ivory dan sepatu cream beige menjaga tampilan tetap lembut dan serasi.',
      items: [
        { label: 'Hijab', name: 'Beige taupe' },
        { label: 'Atasan', name: 'Blus burgundy berlengan puff' },
        { label: 'Bawahan', name: 'Rok plisket krem' },
        { label: 'Tas', name: 'Ivory cream' },
        { label: 'Sepatu', name: 'Cream beige' }
      ]
    },
    {
      id: 'everyday-office',
      category: 'office',
      shape: 'Pear Shape',
      title: 'Smart Casual Set',
      subtitle: 'OFFICE · SMART CASUAL',
      cover: 'image/Fashion_Portrait.png',
      detailImage: 'image/Fashion_Portrait.png',
      itemsImage: 'image/Smart_Casual.png',
      itemsImageAlt: 'Detail outfit smart casual: hijab hitam, blus biru muda, celana hitam wide-leg, tas hitam, dan sepatu krem ivory',
      description: 'Paduan blus biru muda berlengan puff, celana hitam wide-leg, dan hijab hitam untuk tampilan smart casual yang rapi.',
      note: 'Padukan blus biru muda dengan celana hitam wide-leg dan hijab hitam. Tas hitam serta sepatu krem melengkapi tampilan untuk ke kantor atau agenda semi-formal.',
      items: [
        { label: 'Hijab', name: 'Hitam pekat' },
        { label: 'Atasan', name: 'Blus biru muda' },
        { label: 'Bawahan', name: 'Celana hitam wide-leg' },
        { label: 'Tas', name: 'Hitam' },
        { label: 'Sepatu', name: 'Krem ivory' }
      ]
    },
    {
      id: 'elegant-layer',
      category: 'elegant',
      shape: 'Inverted Triangle',
      title: 'DAILY - FEMININE ELEGANT',
      subtitle: 'DAILY · FEMININE ELEGANT',
      cover: 'image/feminim_elegan (2).png',
      detailImage: 'image/feminim_elegan (2).png',
      itemsImage: 'image/feminim_elegan.png',
      itemsImageAlt: 'Detail DAILY - FEMININE ELEGANT: hijab coklat muda beige, dress coklat mocha, sepatu beige nude, dan palet warna netral hangat',
      description: 'Dress panjang coklat mocha dengan potongan berpinggang dan rok flowy, dipadukan dengan hijab beige untuk tampilan feminin yang anggun dan nyaman dipakai sehari-hari.',
      note: 'Padukan dress coklat mocha dengan hijab beige muda dan sepatu nude. Palet warna coklat, mocha, beige, dan nude menjaga tampilan tetap lembut serta serasi untuk aktivitas harian.',
      items: [
        { label: 'Hijab', name: 'Coklat muda (beige)' },
        { label: 'Dress', name: 'Coklat mocha' },
        { label: 'Sepatu', name: 'Beige nude' }
      ]
    },
    {
      id: 'taupe-layered',
      category: 'inverted',
      shape: 'Inverted Triangle',
      title: 'Everyday Taupe Layer',
      subtitle: 'EVERYDAY · TAUPE LAYER',
      cover: 'image/inverted_triangle_coklat1set.png',
      detailImage: 'image/inverted_triangle_coklat1set.png',
      itemsImage: 'image/coklatpisah.png',
      itemsImageAlt: 'Detail Everyday Taupe Layer: hijab beige cream, outer panjang taupe, atasan dan celana putih, sepatu beige nude, serta tas beige cream',
      description: 'Paduan hijab beige cream dan outer panjang warna taupe yang dikenakan terbuka di atas atasan serta celana putih, untuk tampilan berlapis yang ringan dan rapi.',
      note: 'Kenakan outer taupe terbuka di atas atasan putih agar tercipta garis vertikal yang santai. Padukan dengan celana putih, hijab beige cream, tas senada, dan sepatu nude untuk tampilan sehari-hari yang harmonis.',
      items: [
        { label: 'Hijab', name: 'Beige cream' },
        { label: 'Outer', name: 'Taupe panjang' },
        { label: 'Atasan & bawahan', name: 'Set putih' },
        { label: 'Sepatu', name: 'Beige nude' },
        { label: 'Tas', name: 'Beige cream' }
      ]
    },
    {
      id: 'sage-green',
      category: 'inverted',
      shape: 'Inverted Triangle',
      title: 'Sage Green Set',
      subtitle: 'EVERYDAY · SAGE GREEN',
      cover: 'image/inverted_triangle_hijau1set.png',
      detailImage: 'image/inverted_triangle_hijau1set.png',
      itemsImage: 'image/hijaupisah.png',
      itemsImageAlt: 'Detail Sage Green Set: hijab dan celana wide-leg hijau sage, blus putih, sepatu putih, tas putih gading, serta palet warna',
      description: 'Blus putih berlengan puff dipadukan dengan celana wide-leg hijau sage dan hijab senada, menghadirkan tampilan segar dengan warna lembut.',
      note: 'Padukan blus putih dengan celana wide-leg hijau sage dan hijab senada. Sepatu putih serta tas putih gading melengkapi look sehari-hari yang ringan dan serasi.',
      items: [
        { label: 'Hijab', name: 'Hijau muda (sage)' },
        { label: 'Atasan', name: 'Blus putih' },
        { label: 'Bawahan', name: 'Celana wide-leg hijau sage' },
        { label: 'Sepatu', name: 'Putih' },
        { label: 'Tas', name: 'Putih gading (cream)' }
      ]
    },
    {
      id: 'rectangle-taupe-tunic',
      category: 'rectangle',
      shape: 'Rectangle',
      title: 'Taupe Belted Tunic',
      subtitle: 'EVERYDAY · TAUPE BELTED TUNIC',
      cover: 'image/rectangle1.jpeg',
      detailImage: 'image/rectangle1.jpeg',
      itemsImage: 'image/rectangle2.jpeg',
      itemsImageAlt: 'Detail Taupe Belted Tunic: hijab beige taupe, tunik belted coklat mocca, celana putih, sepatu beige nude, dan tas beige cream',
      description: 'Tunik belted warna taupe lembut dipadukan dengan celana putih dan hijab beige untuk tampilan rapi dengan nuansa netral.',
      note: 'Kenakan tunik belted sebagai fokus outfit, lalu padukan dengan celana putih, hijab beige taupe, sepatu nude, dan tas cream agar tampilan tetap ringan dan serasi.',
      items: [
        { label: 'Hijab', name: 'Beige taupe' },
        { label: 'Atasan', name: 'Tunik belted taupe / mocca' },
        { label: 'Bawahan', name: 'Celana putih' },
        { label: 'Sepatu', name: 'Beige nude' },
        { label: 'Tas', name: 'Beige cream' }
      ]
    },
    {
      id: 'rectangle-peplum-skirt',
      category: 'rectangle',
      shape: 'Rectangle',
      title: 'Soft Peplum Skirt Set',
      subtitle: 'SOFT FEMININE · PEPLUM & SKIRT',
      cover: 'image/rectangle3.jpeg',
      detailImage: 'image/rectangle3.jpeg',
      itemsImage: 'image/rectangle33.jpeg',
      itemsImageAlt: 'Detail Soft Peplum Skirt Set: hijab cream, atasan peplum beige mocca, rok beige mocca, sepatu putih cream, dan tas putih cream',
      description: 'Atasan peplum beige dengan rok panjang senada membentuk tampilan feminin yang lembut, dilengkapi hijab cream dan aksesori warna terang.',
      note: 'Padukan atasan peplum dan rok dalam nuansa beige mocca agar terlihat serasi. Hijab cream, sepatu, dan tas warna putih cream melengkapi look feminin untuk kegiatan sehari-hari atau acara santai.',
      items: [
        { label: 'Hijab', name: 'Beige cream' },
        { label: 'Atasan', name: 'Peplum beige mocca' },
        { label: 'Bawahan', name: 'Rok beige mocca' },
        { label: 'Sepatu', name: 'Putih cream' },
        { label: 'Tas', name: 'Putih cream' }
      ]
    },
    {
      id: 'rectangle-floral-neutral',
      category: 'rectangle',
      shape: 'Rectangle',
      title: 'Floral Neutral Set',
      subtitle: 'EVERYDAY · FLORAL NEUTRAL',
      cover: 'image/rectangle4.jpeg',
      detailImage: 'image/rectangle4.jpeg',
      itemsImage: 'image/rectangle44.jpeg',
      itemsImageAlt: 'Detail Floral Neutral Set: hijab beige cream, blus motif bunga coklat, celana wide-leg beige mocca, sepatu beige cream, dan tas putih cream',
      description: 'Blus motif bunga bernuansa cream dan coklat dipadukan dengan celana wide-leg beige, menciptakan outfit santai yang manis dan tetap rapi.',
      note: 'Biarkan motif floral menjadi aksen, lalu seimbangkan dengan celana wide-leg beige mocca dan hijab beige cream. Sepatu serta tas warna cream menyatukan keseluruhan tampilan.',
      items: [
        { label: 'Hijab', name: 'Beige cream' },
        { label: 'Atasan', name: 'Blus floral cream-coklat' },
        { label: 'Bawahan', name: 'Celana wide-leg beige mocca' },
        { label: 'Sepatu', name: 'Beige cream' },
        { label: 'Tas', name: 'Putih cream' }
      ]
    },
    {
      id: 'hourglass-striped',
      category: 'hourglass',
      shape: 'Hourglass',
      title: 'Classic Stripe Set',
      subtitle: 'SMART CASUAL · BLACK & WHITE STRIPES',
      cover: 'image/hourglas11.jpeg',
      detailImage: 'image/hourglas11.jpeg',
      itemsImage: 'image/hourglas1.jpeg',
      itemsImageAlt: 'Detail Classic Stripe Set: hijab hitam, atasan garis hitam-putih, celana putih wide-leg, sepatu beige cream, tas hitam, dan palet warna',
      description: 'Atasan rajut bergaris hitam-putih dipadukan dengan celana putih wide-leg dan hijab hitam untuk tampilan smart casual yang clean.',
      note: 'Jadikan atasan garis sebagai aksen, lalu seimbangkan dengan celana putih dan hijab hitam. Sepatu beige cream memberi sentuhan lembut, sementara tas hitam mengikat keseluruhan look.',
      items: [
        { label: 'Hijab', name: 'Hitam' },
        { label: 'Atasan', name: 'Rajut garis hitam-putih' },
        { label: 'Bawahan', name: 'Celana wide-leg putih' },
        { label: 'Sepatu', name: 'Beige cream' },
        { label: 'Tas', name: 'Hitam' }
      ]
    },
    {
      id: 'hourglass-tweed-skirt',
      category: 'hourglass',
      shape: 'Hourglass',
      title: 'Cream Tweed & Black Skirt',
      subtitle: 'ELEGANT · TWEED & SKIRT',
      cover: 'image/hourglass22.jpeg',
      detailImage: 'image/hourglass22.jpeg',
      itemsImage: 'image/horglass2.jpeg',
      itemsImageAlt: 'Detail Cream Tweed & Black Skirt: hijab beige cream, blazer tweed krem, rok hitam, sandal hitam, tas hitam, dan palet warna',
      description: 'Blazer tweed krem dipadukan dengan rok hitam panjang, hijab beige cream, dan aksesori hitam untuk tampilan elegan.',
      note: 'Padukan tekstur tweed krem dengan rok hitam sebagai kontras utama. Hijab beige cream melembutkan kombinasi warna, sementara sandal dan tas hitam menjaga tampilan tetap serasi.',
      items: [
        { label: 'Hijab', name: 'Beige cream' },
        { label: 'Outer', name: 'Blazer tweed krem' },
        { label: 'Bawahan', name: 'Rok hitam panjang' },
        { label: 'Sepatu', name: 'Sandal hitam' },
        { label: 'Tas', name: 'Hitam' }
      ]
    },
    {
      id: 'hourglass-denim',
      category: 'hourglass',
      shape: 'Hourglass',
      title: 'Cream Top & Denim',
      subtitle: 'CASUAL · CREAM & DENIM',
      cover: 'image/hourglas33.jpeg',
      detailImage: 'image/hourglas33.jpeg',
      itemsImage: 'image/hourglass3.jpeg',
      itemsImageAlt: 'Detail Cream Top & Denim: hijab beige taupe, atasan cream lengan lebar, celana jeans wide-leg biru, sneakers putih, tas putih cream, dan palet warna',
      description: 'Atasan cream berlengan lebar dipadukan dengan jeans wide-leg biru dan hijab beige taupe untuk gaya kasual yang nyaman.',
      note: 'Pasangkan atasan cream dengan jeans wide-leg agar tampilan terasa santai. Hijab beige taupe, sneakers putih, dan tas putih cream melengkapi palet warna netral-biru.',
      items: [
        { label: 'Hijab', name: 'Beige taupe' },
        { label: 'Atasan', name: 'Atasan cream lengan lebar' },
        { label: 'Bawahan', name: 'Jeans wide-leg biru' },
        { label: 'Sepatu', name: 'Sneakers putih' },
        { label: 'Tas', name: 'Putih cream' }
      ]
    },
    {
      id: 'balanced-camel-blazer',
      category: 'balanced',
      shape: 'Balanced',
      title: 'Camel Blazer & Tailored Trousers',
      subtitle: 'SMART CASUAL · CAMEL & CREAM',
      cover: 'image/balanced1.jpeg',
      detailImage: 'image/balanced1.jpeg',
      itemsImage: 'image/balanced11.jpeg',
      itemsImageAlt: 'Detail Camel Blazer & Tailored Trousers: hijab beige cream, blazer camel, inner putih, celana tailored beige, heels cream, tas beige, dan palet warna',
      description: 'Blazer camel dikenakan di atas inner putih dan celana tailored beige, dipadukan dengan hijab serta aksesori bernuansa cream untuk tampilan smart casual yang rapi.',
      note: 'Pertahankan nuansa netral dengan blazer camel, inner putih, dan celana beige. Hijab, tas, serta heels cream melengkapi look yang serasi untuk acara semi-formal atau kegiatan sehari-hari.',
      items: [
        { label: 'Hijab', name: 'Beige cream' },
        { label: 'Outer', name: 'Blazer camel' },
        { label: 'Inner', name: 'Putih' },
        { label: 'Bawahan', name: 'Celana tailored beige' },
        { label: 'Sepatu', name: 'Heels cream' },
        { label: 'Tas', name: 'Beige cream' }
      ]
    },
    {
      id: 'balanced-knit-skirt',
      category: 'balanced',
      shape: 'Balanced',
      title: 'Soft Knit & Cream Skirt',
      subtitle: 'SOFT FEMININE · TAUPE & CREAM',
      cover: 'image/balanced2.jpeg',
      detailImage: 'image/balanced2.jpeg',
      itemsImage: 'image/balanced22.jpeg',
      itemsImageAlt: 'Detail Soft Knit & Cream Skirt: hijab beige, sweater rajut taupe, rok panjang cream, ankle boots beige, tas bahu coklat, dan palet warna',
      description: 'Sweater rajut taupe dipadukan dengan rok panjang cream, hijab beige, ankle boots senada, dan tas bahu coklat untuk tampilan feminin yang lembut.',
      note: 'Padukan tekstur sweater rajut taupe dengan rok cream yang flowy. Hijab dan ankle boots beige menjaga kesan lembut, sementara tas coklat memberi aksen warna yang hangat.',
      items: [
        { label: 'Hijab', name: 'Beige' },
        { label: 'Atasan', name: 'Sweater rajut taupe' },
        { label: 'Bawahan', name: 'Rok panjang cream' },
        { label: 'Sepatu', name: 'Ankle boots beige' },
        { label: 'Tas', name: 'Coklat' }
      ]
    },
    {
      id: 'balanced-denim-layer',
      category: 'balanced',
      shape: 'Balanced',
      title: 'Beige Denim Layer',
      subtitle: 'CASUAL · BEIGE & BLUE DENIM',
      cover: 'image/balanced3.jpeg',
      detailImage: 'image/balanced3.jpeg',
      itemsImage: 'image/balanced33.jpeg',
      itemsImageAlt: 'Detail Beige Denim Layer: hijab beige, jaket denim beige, inner putih, jeans wide-leg biru, tas coklat, sepatu pointed cream, dan palet warna',
      description: 'Jaket denim beige dan inner putih dipadukan dengan jeans wide-leg biru, hijab beige, tas coklat, serta sepatu cream untuk gaya kasual.',
      note: 'Jadikan jaket denim beige sebagai layer di atas inner putih, lalu padukan dengan jeans wide-leg biru. Hijab beige menyatukan warna netral, sementara tas coklat dan sepatu cream melengkapi tampilan.',
      items: [
        { label: 'Hijab', name: 'Beige' },
        { label: 'Outer', name: 'Jaket denim beige' },
        { label: 'Inner', name: 'Putih' },
        { label: 'Bawahan', name: 'Jeans wide-leg biru' },
        { label: 'Sepatu', name: 'Pointed shoes cream' },
        { label: 'Tas', name: 'Coklat' }
      ]
    }
  ];

  const outfitLibrary = [
    { id: 1, type: 'top', title: 'Everyday textured top', meta: 'ATASAN · CASUAL', desc: 'Kemeja ringan, knit top, atau atasan bertekstur untuk tampilan santai yang tetap rapi.', tip: 'Padukan dengan denim, tailored pants, atau bawahan favoritmu.', tone: 1, garment: 'top' },
    { id: 2, type: 'bottom', title: 'Relaxed straight-leg pants', meta: 'BAWAHAN · EVERYDAY', desc: 'Celana straight-cut atau wide-leg yang nyaman dan mudah dipadukan.', tip: 'Coba warna netral agar mudah masuk ke banyak outfit.', tone: 2, garment: 'bottom' },
    { id: 3, type: 'onepiece', title: 'Easy matching outfit', meta: 'ONE-PIECE · SMART CASUAL', desc: 'Dress, jumpsuit, atau matching set dengan potongan yang nyaman sesuai preferensimu.', tip: 'Pilih model dan panjang yang cocok untuk aktivitasmu.', tone: 3, garment: 'onepiece' },
    { id: 4, type: 'layer', title: 'Soft structured outer', meta: 'OUTERWEAR · LAYERING', desc: 'Outer ringan seperti overshirt, blazer santai, atau cardigan untuk variasi tampilan.', tip: 'Pakai terbuka atau ditutup sesuai mood dan cuaca.', tone: 4, garment: 'layer' },
    { id: 5, type: 'top', title: 'Clean-cut shirt', meta: 'ATASAN · MINIMAL', desc: 'Kemeja dengan garis sederhana yang bisa dipakai sendiri atau sebagai layering.', tip: 'Eksplorasi warna earth tone, putih gading, atau warna favoritmu.', tone: 5, garment: 'top' },
    { id: 6, type: 'bottom', title: 'Pleated or A-line bottom', meta: 'BAWAHAN · VERSATILE', desc: 'Rok A-line atau celana berlipit sebagai opsi potongan yang berbeda.', tip: 'Pilih material yang nyaman dan tidak membatasi gerak.', tone: 6, garment: 'bottom' },
    { id: 7, type: 'top', title: 'Simple top - Everyday Casual', meta: 'ATASAN · RELAXED', desc: 'Atasan V-neck polos untuk gaya kasual.', tip: 'Coba bawahan dengan celana pleated wide-leg untuk gaya kasual, detail lipit atau tekstur.', tone: 1, garment: 'top' },
    { id: 8, type: 'bottom', title: 'Easy wide-leg trousers', meta: 'BAWAHAN · RELAXED FIT', desc: 'Celana wide-leg sebagai pilihan santai yang mudah dipadukan.', tip: 'Padukan dengan atasan simpel untuk tampilan yang seimbang.', tone: 2, garment: 'bottom' },
    { id: 9, type: 'onepiece', title: 'Wrap Midi Dress', meta: 'ONE-PIECE · SOFT FEMININE', desc: 'Wrap dress dengan detail ikat dan rok jatuh untuk gaya elegan.', tip: 'Pilih motif sederhana dan variasi panjang lengan sesuai selera.', tone: 3, garment: 'onepiece' },
    { id: 10, type: 'layer', title: 'Peplum Blazer', meta: 'OUTERWARE • ELEGANT CHIC', desc: 'Blazer dengan detail peplum yang memberikan variasi bentuk pada outfit.', tip: 'Padukan dengan celana straight-leg atau rok panjang.', tone: 4, garment: 'layer' },
    { id: 11, type: 'layer', title: 'Casual denim combination', meta: 'OUTERWEAR · STREET CASUAL', desc: 'Denim jacket ringan dengan kaus polos untuk gaya sehari-hari.', tip: 'Pilih cargo pants, wide-leg jeans, atau relaxed trousers untuk bawahan.', tone: 5, garment: 'top' },
    { id: 12, type: 'layer', title: 'Cropped Cardigan', meta: 'OUTERWARE • SOFT CASUAL', desc: 'Cardigan pendek dengan bahan knit untuk tampilan santai dan manis.', tip: 'Padukan dengan celana high-waist atau rok panjang.', tone: 6, garment: 'bottom' }
  ];

  const outfitReferenceImages = {
    1: { src: 'image/knitt.jpeg', alt: 'Inspirasi outfit knit' },
    2: { src: 'image/widelag.jpeg', alt: 'Inspirasi outfit wide leg' },
    3: { src: 'image/1set.jpeg', alt: 'Inspirasi outfit satu set' },
    4: { src: 'image/outeran.jpeg', alt: 'Inspirasi outfit outerwear' },
    5: { src: 'image/kemeja.jpeg', alt: 'Inspirasi outfit kemeja' },
    6: { src: 'image/rokA.jpeg', alt: 'Inspirasi rok A-line' },
    7: { src: 'image/style7.jpeg', alt: 'Inspirasi outfit style 7' },
    8: { src: 'image/style8.jpeg', alt: 'Inspirasi outfit style 8' },
    9: { src: 'image/wrapmidi.jpeg', alt: 'Inspirasi wrap midi dress' },
    10: { src: 'image/peplum.jpeg', alt: 'Inspirasi peplum' },
    11: { src: 'image/denim.jpeg', alt: 'Inspirasi outfit denim' },
    12: { src: 'image/cardigan.jpeg', alt: 'Inspirasi outfit cardigan' }
  };

  const shapeInfo = {
    pear: { name: 'Pear Shape', desc: 'Ukuran pinggul pada data yang kamu masukkan cenderung lebih besar dibanding area dada. Ini hanya gambaran proporsi, bukan label yang membatasi pilihan pakaian.', tags: ['Lower proportion', 'Soft balance', 'Explore your style'] },
    hourglass: { name: 'Hourglass', desc: 'Area dada dan pinggul terlihat relatif seimbang, dengan ukuran pinggang yang lebih kecil pada data pengukuranmu.', tags: ['Upper-lower balance', 'Defined waist ratio', 'Explore your style'] },
    inverted: { name: 'Inverted Triangle', desc: 'Area dada pada data yang dimasukkan cenderung lebih besar dibanding area pinggul. Banyak pilihan potongan bisa kamu eksplorasi.', tags: ['Upper proportion', 'Relaxed silhouettes', 'Explore your style'] },
    rectangle: { name: 'Rectangle', desc: 'Ukuran dada, pinggang, dan pinggul pada data ini relatif berdekatan. Layering dan variasi potongan bisa jadi cara seru bereksperimen.', tags: ['Similar measurements', 'Clean lines', 'Explore your style'] },
    balanced: { name: 'Balanced', desc: 'Tidak ada perbedaan ukuran atas dan bawah yang sangat dominan pada data ini. Kamu bisa bereksperimen dengan beragam potongan.', tags: ['Balanced proportions', 'Versatile styling', 'Explore your style'] }
  };

  profile = loadProfile();

  const shapeImages = {
    pear: 'image/pear.jpeg',
    hourglass: 'image/hourglass.jpeg',
    inverted: 'image/triangle.jpeg',
    rectangle: 'image/rectangle.jpeg',
    balanced: 'image/balanced.jpeg'
  };

  const shapeTips = {
    pear: {
      top: 'Coba kemeja berkerah, atasan bertekstur, atau warna yang kamu suka untuk variasi tampilan bagian atas.',
      bottom: 'Straight-leg, wide-leg, atau A-line bisa menjadi opsi nyaman untuk dicoba.',
      onepiece: 'Eksplorasi dress, jumpsuit, atau matching set dengan detail yang kamu sukai.',
      layer: 'Overshirt atau outer berstruktur ringan bisa menjadi pilihan layering.'
    },
    hourglass: {
      top: 'Wrap top, kemeja, atau atasan fitted yang tetap nyaman bisa masuk ke pilihanmu.',
      bottom: 'High-rise, straight-leg, atau rok favorit bisa dipadukan dengan berbagai atasan.',
      onepiece: 'Coba wrap dress, jumpsuit, atau matching set sesuai selera.',
      layer: 'Cardigan pendek atau blazer santai bisa melengkapi tampilan.'
    },
    inverted: {
      top: 'Atasan berpotongan simpel atau relaxed fit bisa menjadi opsi sehari-hari.',
      bottom: 'Wide-leg, pleated pants, atau bawahan bertekstur bisa dicoba untuk variasi siluet.',
      onepiece: 'Pilih dress, jumpsuit, atau matching set dengan potongan yang terasa nyaman.',
      layer: 'Outer ringan dengan garis sederhana mudah dipadukan dengan outfit harian.'
    },
    rectangle: {
      top: 'Coba layered shirt, knit top, atau atasan dengan detail yang kamu sukai.',
      bottom: 'Straight-leg, cargo, pleated pants, atau rok bisa memberi variasi tampilan.',
      onepiece: 'Matching set, jumpsuit, atau dress simpel bisa jadi pilihan praktis.',
      layer: 'Eksplorasi cardigan, overshirt, dan blazer untuk permainan layering.'
    },
    balanced: {
      top: 'Kemeja, knit top, kaus, atau atasan favorit bisa dieksplorasi dengan leluasa.',
      bottom: 'Beragam potongan seperti straight-leg, wide-leg, dan rok bisa dicoba.',
      onepiece: 'Dress, jumpsuit, dan matching set sama-sama bisa menjadi pilihan.',
      layer: 'Pilih outer berdasarkan suasana, cuaca, dan gaya yang ingin kamu tampilkan.'
    }
  };

  const outfitRecommendations = {
    balanced: [1, 2, 3, 5, 6, 9, 11],
    rectangle: [1, 4, 6, 9, 10, 12, 3],
    hourglass: [2, 3, 5, 7, 9, 11, 12],
    inverted: [2, 6, 8, 7, 9, 3],
    pear: [1, 4, 5, 7, 11, 12]
  };

  function loadProfile() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !shapeInfo[parsed.shape]) return null;
      return parsed;
    } catch (error) {
      console.warn('Profil lokal tidak dapat dibaca:', error);
      return null;
    }
  }

  function saveProfile() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.warn('Penyimpanan lokal tidak tersedia:', error);
      showToast('Hasil tampil, tetapi browser tidak mengizinkan penyimpanan lokal.');
      return false;
    }
  }

  function showToast(message) {
    const el = $('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.classList.remove('show'), 2800);
  }

  function showPage(name) {
    const target = $(`page-${name}`);
    if (!target) return;
    document.querySelectorAll('.page').forEach((page) => page.classList.toggle('active', page === target));
    document.querySelectorAll('[data-page]').forEach((button) => button.classList.toggle('active', button.dataset.page === name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (name === 'wardrobe') renderWardrobe();
  }

  document.querySelectorAll('[data-page]').forEach((button) => {
    button.addEventListener('click', () => showPage(button.dataset.page));
  });
  document.querySelectorAll('[data-home]').forEach((button) => {
    button.addEventListener('click', (event) => { event.preventDefault(); showPage('home'); });
  });
  $('menuToggle')?.addEventListener('click', () => showToast('Gunakan navigasi di bagian bawah layar.'));

  function getNum(id) {
    const raw = $(id)?.value?.trim();
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  }

  // Klasifikasi proporsi (perkiraan untuk eksplorasi styling, bukan standar universal).
  // Tahap 1: bandingkan lingkar dada dan pinggul. Jika selisih >5%, arah proporsi
  // menentukan Pear atau Inverted Triangle. Tahap 2: jika keduanya berdekatan,
  // gunakan rasio pinggang terhadap rata-rata dada dan pinggul.
  // Lebar bahu opsional dicatat, tetapi tidak dibandingkan dengan lingkar tubuh
  // karena itu ukuran lebar, bukan ukuran lingkar.
  function classify({ bust, waist, hips }) {
    const upperLowerAverage = (bust + hips) / 2;
    const upperLowerGap = Math.abs(bust - hips) / Math.max(bust, hips);
    const waistRatio = waist / upperLowerAverage;

    // Dominasi area atas/bawah diprioritaskan agar tidak tertimpa rasio pinggang.
    if (upperLowerGap > 0.05) {
      return hips > bust ? 'pear' : 'inverted';
    }

    // Jika dada dan pinggul relatif seimbang, klasifikasikan dari rasio pinggang.
    if (waistRatio <= 0.75) return 'hourglass';
    if (waistRatio >= 0.82) return 'rectangle';
    return 'balanced';
  }

  function handleAnalysis(event) {
    event.preventDefault();
    const bust = getNum('bust');
    const waist = getNum('waist');
    const hips = getNum('hips');
    const height = getNum('height');
    const shoulders = getNum('shoulders');

    if (bust === null || waist === null || hips === null) {
      showToast('Isi ukuran dada, pinggang, dan pinggul terlebih dahulu.');
      return;
    }
    if ([bust, waist, hips].some((value) => value < 20 || value > 220) ||
        (height !== null && (height < 100 || height > 230)) ||
        (shoulders !== null && (shoulders < 10 || shoulders > 100))) {
      showToast('Periksa kembali angka pengukuran yang dimasukkan.');
      return;
    }

    profile = {
      height, bust, waist, hips, shoulders,
      shape: classify({ bust, waist, hips }),
      updatedAt: new Date().toISOString()
    };
    currentFilter = 'all';
    saveProfile();
    renderResult();
    renderWardrobe();
    $('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('Hasil analisis berhasil dibuat.');
  }

  $('measurementForm')?.addEventListener('submit', handleAnalysis);

  // Satu fungsi untuk membersihkan seluruh data, baik dari tombol form
  // maupun tombol reset pada bagian hasil analisis.
  function clearAllProfileData() {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (error) { console.warn(error); }
    profile = null;
    $('measurementForm')?.reset();
    $('shapeQuizForm')?.reset();
    $('resultSection')?.classList.add('hidden');
    $('customShapeImage')?.classList.add('hidden');
    $('customShapeImage')?.removeAttribute('src');
    currentFilter = 'all';
    renderWardrobe();
    showToast('Semua data, hasil analisis, dan isian form berhasil dibersihkan.');
  }

  $('clearForm')?.addEventListener('click', clearAllProfileData);
  $('resetProfile')?.addEventListener('click', clearAllProfileData);

  // Pilihan metode analisis: pengukuran atau kuis pengalaman berpakaian.
  document.querySelectorAll('[data-method]').forEach((button) => {
    button.addEventListener('click', () => {
      const method = button.dataset.method;
      document.querySelectorAll('[data-method]').forEach((item) => item.classList.toggle('active', item === button));
      $('measurementMethod').classList.toggle('hidden', method !== 'measure');
      $('quizMethod').classList.toggle('hidden', method !== 'quiz');
    });
  });

  $('shapeQuizForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const answers = [1,2,3,4,5].map((n) => data.get(`q${n}`));
    if (answers.some((answer) => !answer)) { showToast('Jawab semua pertanyaan terlebih dahulu.'); return; }
    const scores = { pear: 0, inverted: 0, hourglass: 0, rectangle: 0, balanced: 0 };
    answers.forEach((answer) => {
      if (answer === 'lower') scores.pear += 1;
      if (answer === 'upper') scores.inverted += 1;
      if (answer === 'waist' || answer === 'curved') scores.hourglass += 1;
      if (answer === 'straight') scores.rectangle += 1;
      if (answer === 'same' || answer === 'balanced' || answer === 'mix') scores.balanced += 1;
    });
    const sorted = Object.entries(scores).sort((a,b) => b[1]-a[1]);
    const topScore = sorted[0][1];
    const tied = sorted.filter((entry) => entry[1] === topScore);
    const selectedShape = topScore === 0 || tied.length > 1 ? 'balanced' : sorted[0][0];
    profile = {
      shape: selectedShape, method: 'quiz', quizAnswers: answers,
      updatedAt: new Date().toISOString()
    };
    currentFilter = 'all';
    saveProfile(); renderResult(); renderWardrobe();
    $('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('Hasil kuis berhasil dibuat. Ini hanya perkiraan untuk eksplorasi style.');
  });

  function renderResult() {
    if (!profile) return;
    const info = shapeInfo[profile.shape];
    $('resultSection').classList.remove('hidden');
    $('shapeName').textContent = info.name;
    $('shapeDescription').textContent = profile.method === 'quiz' ? 'Kategori ini merupakan perkiraan dari jawaban kuis tentang pengalaman memilih pakaian, bukan hasil pengukuran. Gunakan sebagai inspirasi styling saja.' : info.desc;
    $('resultTags').innerHTML = info.tags.map((tag) => `<span>${tag}</span>`).join('');
    const stats = profile.method === 'quiz'
      ? [['METODE', 'Kuis sederhana'], ['JAWABAN', '5 pertanyaan'], ['HASIL', 'Perkiraan'], ['TUJUAN', 'Eksplorasi style']]
      : [['HEIGHT', profile.height ? `${profile.height} cm` : '—'], ['CHEST', `${profile.bust} cm`], ['WAIST', `${profile.waist} cm`], ['HIPS', `${profile.hips} cm`]];
    $('statsRow').innerHTML = stats.map(([label, value]) => `<div class="stat-box"><span>${label}</span><b>${value}</b></div>`).join('');
    $('shapeVisual').dataset.shape = profile.shape;
    $('shapeResultImage').src = shapeImages[profile.shape];
    $('shapeResultImage').alt = `Ilustrasi bentuk tubuh ${info.name}`;
    $('wardrobeProfile').textContent = info.name;
    renderResultRecommendations();
  }

  function renderResultRecommendations() {
    const grid = $('resultOutfitGrid');
    if (!grid || !profile) return;
    const recommended = outfitSets
      .filter((set) => set.shape === shapeInfo[profile.shape].name)
      .slice(0, 3);
    grid.innerHTML = recommended.map((set) => {
      const styleNumber = String(outfitSets.indexOf(set) + 1).padStart(2, '0');
      return `
        <button class="outfit-card outfit-set-card" type="button" data-open-recommendation="${set.id}" aria-label="Lihat detail ${set.title}">
          <div class="outfit-art outfit-set-cover${set.detailImage ? ' outfit-portrait-cover' : ''}">
            ${set.cover ? `<img class="outfit-cover-image" src="${set.cover}" alt="Foto outfit ${set.title}" loading="lazy" />` : `<div class="outfit-empty-placeholder"><span>FOTO OUTFIT</span><small>Gambar akan ditambahkan manual</small></div>`}
            <span class="outfit-open-hint">VIEW THE SET ↗</span>
          </div>
          <div class="outfit-info">
            <span class="outfit-meta">STYLE ${styleNumber} · ${set.subtitle}</span>
            <h3>${set.title}</h3>
            <p>${set.description}</p>
            <div class="outfit-tip">✳ Klik foto untuk melihat detail set</div>
          </div>
        </button>`;
    }).join('');
    const count = grid.querySelectorAll('.outfit-set-card').length;
    const countLabel = document.querySelector('.recommendation-count');
    if (countLabel) countLabel.textContent = `${count} OUTFIT`;
  }

  function getOutfitText(item) {
    const style = profile?.style || 'all';
    let title = item.title;
    if (item.id === 3) {
      if (style === 'feminine') title = 'Easy day dress';
      else if (style === 'masculine') title = 'Relaxed jumpsuit / co-ord';
      else if (style === 'androgynous') title = 'Minimal matching set';
      else title = 'Easy one-piece & matching set';
    }
    const personalizedTip = profile ? (shapeTips[profile.shape]?.[item.type] || item.tip) : item.tip;
    return { title, tip: personalizedTip };
  }

  function renderWardrobe() {
    if (!$('outfitGrid')) return;
    $('wardrobeProfile').textContent = profile
      ? `Semua 15 outfit · hasil analisismu ${shapeInfo[profile.shape].name}`
      : 'Semua 15 outfit dari 5 body shape';

    const cards = outfitSets.filter((set) => currentFilter === 'all' || set.category === currentFilter);
    document.querySelectorAll('.filter-chip').forEach((button) => {
      button.classList.toggle('active', (button.dataset.filter || 'all') === currentFilter);
    });

    $('outfitGrid').innerHTML = cards.map((set) => `
      <button class="outfit-card outfit-set-card" type="button" data-open-outfit="${set.id}" aria-label="Lihat detail ${set.title}">
        <div class="outfit-art outfit-set-cover${set.detailImage ? ' outfit-portrait-cover' : ''}">
          ${set.cover ? `<img class="outfit-cover-image" src="${set.cover}" alt="Foto outfit ${set.title}" loading="lazy" />` : `<div class="outfit-empty-placeholder"><span>FOTO OUTFIT</span><small>Gambar akan ditambahkan manual</small></div>`}
          <span class="outfit-open-hint">VIEW THE SET ↗</span>
        </div>
        <div class="outfit-info">
          <span class="outfit-meta">STYLE ${String(outfitSets.indexOf(set) + 1).padStart(2, '0')} · ${set.subtitle}</span>
          <h3>${set.title}</h3>
          <p>${set.description}</p>
          <div class="outfit-tip">✳ Klik foto untuk melihat detail set</div>
        </div>
      </button>
    `).join('');
  }

  function openOutfitDetail(setId) {
    const set = outfitSets.find((item) => item.id === setId);
    if (!set || !$('outfitDetailModal')) return;
    $('outfitDetailContent').innerHTML = `
      <div class="outfit-detail-heading">
        <span class="step-label">${set.subtitle}</span>
        <h2 id="outfitDetailTitle">${set.title}</h2>
        ${set.shape ? `<p class="outfit-shape-tag">DIREKOMENDASIKAN UNTUK · ${set.shape}</p>` : ''}
        <p>${set.description}</p>
      </div>
      ${set.detailImage
        ? `<div class="outfit-detail-cover outfit-detail-portrait"><img src="${set.detailImage}" alt="Foto utama outfit ${set.title}" /></div>`
        : `<div class="outfit-detail-cover"><div class="outfit-empty-placeholder"><span>FOTO UTAMA OUTFIT</span><small>Gambar akan ditambahkan manual</small></div></div>`}
      ${set.itemsImage
        ? `<div class="outfit-detail-landscape"><img src="${set.itemsImage}" alt="${set.itemsImageAlt || `Foto landscape item outfit ${set.title}`}" /></div>`
        : `<div class="outfit-detail-items">
          ${set.items.map((item) => `
            <article class="outfit-piece">
              <div class="outfit-piece-image"><div class="outfit-empty-placeholder"><span>FOTO ITEM</span><small>Gambar akan ditambahkan manual</small></div></div>
              <div class="outfit-piece-copy"><span>${item.label}</span><h3>${item.name}</h3></div>
            </article>
          `).join('')}
        </div>`}
      <div class="outfit-detail-note"><span>✳ STYLING NOTES</span><p>${set.note}</p></div>
    `;
    $('outfitDetailModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  function closeOutfitDetail() {
    $('outfitDetailModal')?.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }

  $('outfitGrid')?.addEventListener('click', (event) => {
    const card = event.target.closest('[data-open-outfit]');
    if (card) openOutfitDetail(card.dataset.openOutfit);
  });
  $('resultOutfitGrid')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-open-recommendation]');
    if (!button) return;
    const setId = button.dataset.openRecommendation;
    openOutfitDetail(setId);
  });
  $('outfitDetailModal')?.addEventListener('click', (event) => {
    if (event.target.closest('[data-close-outfit]')) closeOutfitDetail();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeOutfitDetail();
  });

  document.querySelectorAll('.filter-chip').forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter || 'all';
      renderWardrobe();
    });
  });

  $('shapeImage')?.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Pilih file gambar yang valid.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      $('customShapeImage').src = String(reader.result);
      $('customShapeImage').classList.remove('hidden');
      showToast('Visual pilihanmu berhasil ditampilkan.');
    };
    reader.onerror = () => showToast('Gambar tidak dapat dibaca. Coba file lain.');
    reader.readAsDataURL(file);
  });

  function restoreForm() {
    if (!profile) return;
    if (profile.method === 'quiz') {
      document.querySelector('[data-method="quiz"]')?.click();
    } else {
      ['height', 'shoulders', 'bust', 'waist', 'hips'].forEach((key) => { $(key).value = profile[key] ?? ''; });
    }
    renderResult();
  }


  restoreForm();
  renderWardrobe();
})();
