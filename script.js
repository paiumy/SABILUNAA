/* =========================================================================
   SABILUNAA / HISTOVERSE - SCRIPT.JS (PROFESSIONAL UI/UX INTERACTIVITY)
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. EFEK NAVBAR GLASSMORPHISM SAAT SCROLL
    // ==========================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            // Jika halaman digeser ke bawah lebih dari 50px, tambahkan efek kaca
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ==========================================
    // 2. MENU HAMBURGER (RESPONSIVE MOBILE)
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerBtn && navLinks) {
        // Buka/Tutup menu saat ikon hamburger diklik
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburgerBtn.classList.toggle('active'); // Opsi jika ingin membuat animasi "X" di CSS nanti
        });

        // Menutup menu otomatis jika salah satu link di dalam menu diklik
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 3. SMOOTH SCROLLING UNTUK MENU NAVIGASI
    // ==========================================
    // Membuat pergerakan halaman sangat mulus saat link berawalan '#' diklik
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Lewati jika hanya "#"
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault(); // Hentikan lompatan kasar bawaan HTML
                
                // Geser perlahan ke elemen yang dituju, dikurangi tinggi navbar (80px)
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // ==========================================
    // 4. ANIMASI SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    // Teknik modern & ringan agar elemen muncul perlahan saat discroll ke area pandang
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');
    
    // Konfigurasi observer: elemen muncul saat 15% bagiannya sudah masuk layar
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return; // Jika belum masuk layar, diamkan
            } else {
                // Jika masuk layar, tambahkan class 'active' untuk memicu animasi CSS
                entry.target.classList.add('active');
                // Berhenti mengamati elemen ini setelah animasinya jalan 1x (agar ringan)
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // ==========================================
    // 5. PARALLAX EFFECT 3D PADA HERO SECTION
    // ==========================================
    // Memberikan "Nyawa": Gambar akan bergerak sedikit mengikuti arah kursor mouse
    const heroSection = document.querySelector('.hero-section');
    const heroImages = document.querySelectorAll('.hero-img'); // Mengambil bungkus gambarnya

    if (heroSection && heroImages.length > 0) {
        heroSection.addEventListener('mousemove', (e) => {
            // Hitung posisi mouse dari tengah layar
            const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 40;

            // Terapkan pergerakan berlawanan pada gambar kiri dan kanan
            heroImages[0].style.transform = `translate(${xAxis}px, ${yAxis}px)`;
            if(heroImages[1]) {
                heroImages[1].style.transform = `translate(${-xAxis}px, ${-yAxis}px)`;
            }
        });

        // Kembalikan posisi gambar ke tengah secara perlahan jika mouse keluar dari Hero
        heroSection.addEventListener('mouseleave', () => {
            heroImages.forEach(img => {
                img.style.transition = "transform 0.5s ease-out";
                img.style.transform = `translate(0px, 0px)`;
                
                // Hilangkan transisi setelah selesai agar pergerakan mouse berikutnya tetap responsif
                setTimeout(() => {
                    img.style.transition = "none";
                }, 500);
            });
        });
    }

    // ==========================================
    // 6. FALLBACK GAMBAR JIKA ERROR/LINK RUSAK
    // ==========================================
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = "https://via.placeholder.com/800x600/f1f5f9/94a3b8?text=Gambar+Masih+Diproses";
            this.alt = "Gambar gagal dimuat";
            this.style.objectFit = "cover";
        });
    });

});

// ==========================================
// 7. LOGIKA HALAMAN BELAJAR (MINI LMS)
// ==========================================
// Fungsi diletakkan di luar DOMContentLoaded agar bisa diakses langsung oleh atribut onclick HTML
function bukaBab(babId) {
    const semuaMateri = document.querySelectorAll('.tab-content');
    const semuaTombol = document.querySelectorAll('.lms-menu button');

    // A. Hilangkan class active dari semua materi dengan efek perlahan
    semuaMateri.forEach(materi => {
        materi.style.opacity = '0';
        setTimeout(() => {
            materi.classList.remove('active');
        }, 300); // Tunggu 0.3 detik sebelum benar-benar dihilangkan (sesuai CSS transition)
    });

    // B. Reset warna dan style tombol sidebar
    semuaTombol.forEach(tombol => {
        tombol.classList.remove('active');
    });

    // C. Munculkan materi yang dipilih setelah sedikit jeda agar transisi halus
    setTimeout(() => {
        const materiDipilih = document.getElementById(babId);
        if (materiDipilih) {
            materiDipilih.classList.add('active');
            // Sedikit delay untuk memicu animasi masuk (fade in & slide up)
            setTimeout(() => {
                materiDipilih.style.opacity = '1';
            }, 50);
        }
    }, 300);

    // D. Aktifkan (warnai) tombol yang sedang ditekan
    const tombolAktif = Array.from(semuaTombol).find(t => t.getAttribute('onclick') === `bukaBab('${babId}')`);
    if (tombolAktif) {
        tombolAktif.classList.add('active');
    }

    // E. Auto-scroll ke bagian atas materi jika dibuka dari HP/Mobile
    if (window.innerWidth < 1024) {
        const lmsContent = document.querySelector('.lms-content');
        if (lmsContent) {
            window.scrollTo({
                top: lmsContent.offsetTop - 90, // Minus 90px agar tidak tertutup navbar
                behavior: 'smooth'
            });
        }
    }
}
