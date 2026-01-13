# 📤 GitHub'a Yükleme Kılavuzu

Bu kılavuz, Personal Trainer App projesini GitHub'a yüklemeniz için gereken adımları içerir.

## 🔧 Ön Hazırlık

### 1. GitHub Hesabı Oluşturun
- [github.com](https://github.com) adresinden ücretsiz hesap açın
- E-posta adresinizi doğrulayın

### 2. Git Kurulumu
```bash
# Git kurulu mu kontrol edin
git --version

# Kurulu değilse:
# Windows: https://git-scm.com/download/win
# macOS: brew install git
# Linux: sudo apt install git
```

### 3. Git Yapılandırması
```bash
git config --global user.name "Adınız Soyadınız"
git config --global user.email "email@example.com"
```

---

## 📤 GitHub'a Yükleme

### 1. GitHub'da Repository Oluşturun
1. GitHub'da oturum açın
2. Sağ üst köşedeki **"+"** → **"New repository"**
3. Repository adı: `PersonalTrainerApp`
4. Açıklama: `Personal Trainer ve Fitness Takip Uygulaması`
5. **Public** seçin (herkes görebilsin)
6. **"Create repository"** tıklayın

### 2. Yerel Projeyi Git'e Bağlayın
```bash
# Proje klasörüne gidin
cd PersonalTrainerApp

# Git repository'si başlatın
git init

# Dosyaları ekleyin
git add .

# İlk commit'i yapın
git commit -m "İlk commit: Personal Trainer App oluşturuldu"

# GitHub repository'sine bağlayın (URL'yi kendi repo URL'nizle değiştirin)
git remote add origin https://github.com/[kullanici-adi]/PersonalTrainerApp.git

# Ana branch'i main olarak ayarlayın
git branch -M main

# GitHub'a yükleyin
git push -u origin main
```

### 3. Repository URL'sini Alın
- GitHub'daki repository sayfanızda yeşil **"Code"** butonuna tıklayın
- HTTPS URL'sini kopyalayın: `https://github.com/[kullanici-adi]/PersonalTrainerApp.git`

---

## 🔄 Güncellemeler İçin

### Değişiklikleri GitHub'a Gönderme
```bash
# Değişiklikleri ekleyin
git add .

# Commit mesajı yazın
git commit -m "Yeni özellik eklendi: PDF rapor indirme"

# GitHub'a gönderin
git push
```

### Başka Bilgisayardan Çekme
```bash
# İlk kez indirme
git clone https://github.com/[kullanici-adi]/PersonalTrainerApp.git

# Güncellemeleri çekme
git pull
```

---

## 🌐 Başka Bilgisayarlarda Çalıştırma

### Hızlı Kurulum (Sadece Demo)
```bash
# 1. Projeyi indirin
git clone https://github.com/[kullanici-adi]/PersonalTrainerApp.git

# 2. Klasöre girin
cd PersonalTrainerApp

# 3. Demo'yu açın
start demo.html  # Windows
open demo.html   # macOS
xdg-open demo.html  # Linux
```

### Tam Kurulum (Mobil Geliştirme)
```bash
# 1. Projeyi indirin
git clone https://github.com/[kullanici-adi]/PersonalTrainerApp.git
cd PersonalTrainerApp

# 2. Node.js bağımlılıklarını yükleyin
npm install

# 3. Expo CLI'yi yükleyin
npm install -g @expo/cli

# 4. Uygulamayı başlatın
npm start
```

---

## 📋 Kontrol Listesi

### Yükleme Öncesi:
- [ ] GitHub hesabı oluşturuldu
- [ ] Git kuruldu ve yapılandırıldı
- [ ] Proje dosyaları hazır

### Yükleme Sonrası:
- [ ] Repository GitHub'da görünüyor
- [ ] README.md düzgün görüntüleniyor
- [ ] demo.html dosyası mevcut
- [ ] Başka bilgisayardan clone edilebiliyor

### Test:
- [ ] `git clone` komutu çalışıyor
- [ ] `demo.html` açılıyor ve çalışıyor
- [ ] `npm install` hatasız tamamlanıyor
- [ ] `npm start` çalışıyor

---

## 🎯 Örnek Repository Yapısı

Yükleme sonrası GitHub'daki repository'niz şöyle görünmelidir:

```
PersonalTrainerApp/
├── 📄 README.md              # Ana dokümantasyon
├── 📄 KURULUM.md             # Kurulum kılavuzu
├── 📄 GITHUB_YUKLEME.md      # Bu dosya
├── 🌐 demo.html              # Web demo (anında çalışır)
├── 📱 App.tsx                # React Native uygulaması
├── 📦 package.json           # Bağımlılıklar
├── 📂 src/                   # Kaynak kodlar
├── 📂 assets/                # Görseller
├── ⚙️ .gitignore            # Git ignore
└── 🔧 babel.config.js       # Babel yapılandırması
```

---

## 🚀 Paylaşım

### Repository'yi Paylaşın:
```
GitHub URL: https://github.com/[kullanici-adi]/PersonalTrainerApp
Demo Link: https://github.com/[kullanici-adi]/PersonalTrainerApp/blob/main/demo.html
```

### Başkalarının Kullanması İçin:
1. Repository URL'sini paylaşın
2. `KURULUM.md` dosyasını okumalarını söyleyin
3. Hızlı test için `demo.html`'i önerın

---

## 🆘 Sorun Giderme

### "Permission denied" Hatası:
```bash
# SSH key oluşturun
ssh-keygen -t rsa -b 4096 -c "email@example.com"

# GitHub'a SSH key ekleyin
# Settings → SSH and GPG keys → New SSH key
```

### "Repository not found" Hatası:
- Repository URL'sinin doğru olduğundan emin olun
- Repository'nin public olduğunu kontrol edin

### Git Push Hatası:
```bash
# Force push (dikkatli kullanın)
git push --force-with-lease
```

---

**🎉 Tebrikler! Projeniz artık GitHub'da ve herkes tarafından kullanılabilir.**

**Paylaşım URL'si**: `https://github.com/[kullanici-adi]/PersonalTrainerApp`