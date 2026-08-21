# Orzax Outreach Studio (statik, ücretsiz sürüm)

Bu sürüm hiçbir API anahtarı veya backend gerektirmez. Form, sizin için hazır bir
prompt üretir; siz bunu normal bir Claude.ai sohbetine yapıştırırsınız (mevcut
üyeliğinizle, ekstra ücret yok), Claude'un cevabını da siteye geri yapıştırırsınız.
Site otomatik olarak konu/gövde olarak ayırır ve tarayıcınızda (localStorage)
kaydeder.

## GitHub Pages'e yükleme — Yol A: Tarayıcıdan (terminal gerekmez)

1. github.com'da oturum açın, sağ üstten **New repository** ile yeni bir repo
   oluşturun (ör. `orzax-outreach-studio`), **Public** seçin.
2. Repo sayfasında **Add file → Upload files** deyin.
3. Bu klasördeki üç dosyayı sürükleyin: `index.html`, `style.css`, `app.js`
   (ve isterseniz bu `README.md`'yi de).
4. **Commit changes** ile onaylayın.
5. Repo'da **Settings → Pages**'e gidin. "Build and deployment" altında
   **Source: Deploy from a branch**, **Branch: main / (root)** seçip **Save**
   deyin.
6. ~1 dakika sonra sayfanın üstünde canlı link belirir:
   `https://KULLANICI_ADINIZ.github.io/orzax-outreach-studio/`

## GitHub Pages'e yükleme — Yol B: Terminalden

```bash
cd orzax-outreach-static
git init
git add .
git commit -m "Orzax outreach studio"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/orzax-outreach-studio.git
git push -u origin main
```

Sonra yukarıdaki 5. adımdaki gibi Settings → Pages'ten yayınlayın.

## Kullanım

1. Formu doldurun (hesap, niş, iş birliği türü zorunlu).
2. **Prompt Oluştur**'a basın, çıkan metni **Promptu Kopyala** ile kopyalayın.
3. **Claude.ai'yi Aç** ile yeni bir sohbet başlatın, kopyaladığınız metni
   yapıştırıp gönderin.
4. Claude'un cevabını kopyalayıp bu sayfadaki "Cevabı Buraya Yapıştırın"
   kutusuna yapıştırın, **Ayır ve Kaydet**'e basın.
5. Konu/gövde otomatik ayrılır, düzenlenebilir ve alttaki "Kayıtlı
   Taslaklar" listesine kaydedilir (yalnızca bu tarayıcıda saklanır).

## Not

Taslaklar `localStorage`'da tutulur — farklı bir cihaz veya tarayıcıdan
eriştiğinizde görünmezler. Ekip olarak paylaşmak isterseniz, üretilen
maili "Tümünü Kopyala" ile alıp kendi CRM/e-posta aracınıza taşıyın.
