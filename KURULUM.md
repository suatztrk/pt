# 🚀 Personal Trainer App - Kurulum Kılavuzu

Bu kılavuz, Personal Trainer App'i GitHub'dan indirip çalıştırmanız için gereken tüm adımları içerir.

## ⚡ Hızlı Başlangıç (Demo)

### 1. Projeyi İndirin
```bash
git clone https://github.com/[kullanici-adi]/PersonalTrainerApp.git
cd PersonalTrainerApp
```

### 2. Demo'yu Anında Çalıştırın
```bash
# Windows
start demo.html

# macOS
open demo.html

# Linux
xdg-open demo.html
```

**Bu kadar! Demo hiçbir kurulum gerektirmez ve anında çalışır.**

---

## 📱 Mobil Uygulama Kurulumu (İsteğe Bağlı)

### Gereksinimler

#### 1. Node.js Kurulumu
- **İndirin**: [nodejs.org](https://nodejs.org/)
- **Minimum sürüm**: v16 veya üzeri
- **Kontrol edin**:
  ```bash
  node --version
  npm --version
  ```

#### 2. Git Kurulumu
- **Windows**: [git-scm.com](https://git-scm.com/)
- **macOS**: `brew install git` veya Xcode Command Line Tools
- **Linux**: `sudo apt install git` (Ubuntu/Debian)

### Kurulum Adımları

#### 1. Projeyi Klonlayın
```bash
git clone https://github.com/[kullanici-adi]/PersonalTrainerApp.git
cd PersonalTrainerApp
```

#### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

**Hata alırsanız**:
```bash
# Cache'i temizleyin
npm cache clean --force
npm install
```

#### 3. Expo CLI'yi Yükleyin
```bash
npm install -g @expo/cli
```

#### 4. Uygulamayı Başlatın
```bash
npm start
```

### 📱 Mobil Cihazda Test

#### 1. Expo Go Uygulamasını İndirin
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

#### 2. QR Kodu Tarayın
- Terminal'de görünen QR kodu Expo Go ile tarayın
- Uygulama otomatik olarak yüklenecek

---

## 🔧 Sorun Giderme

### Node.js Sürüm Hatası
```bash
# Sürümü kontrol edin
node --version

# v16'dan düşükse nodejs.org'dan güncelleyin
```

### npm install Hatası
```bash
# Node modules'ü silin ve yeniden yükleyin
rm -rf node_modules package-lock.json
npm install
```

### Expo CLI Hatası
```bash
# Expo CLI'yi yeniden yükleyin
npm uninstall -g @expo/cli
npm install -g @expo/cli@latest
```

### Demo Açılmıyor
1. `demo.html` dosyasını doğrudan tarayıcıya sürükleyin
2. Veya dosya yolunu kopyalayıp tarayıcı adres çubuğuna yapıştırın
3. Chrome, Firefox, Safari, Edge gibi modern tarayıcılar kullanın

### Port Zaten Kullanımda
```bash
# Farklı port kullanın
npx expo start --port 19001
```

---

## 🎯 Test Senaryoları

### Demo Testi
1. `demo.html`'i açın
2. **Öğrenci Ekle**: "Öğrenciler" → "+" → Form doldur
3. **Antrenman Kaydet**: "Antrenmanlar" → "+" → Egzersiz seç
4. **Rapor İndir**: "Raporlar" → "PDF İndir"
5. **Profil Düzenle**: "Profil" → "Profili Düzenle"

### Mobil Test
1. Expo Go ile QR kodu tarayın
2. Uygulama açıldığında tüm sekmeleri test edin
3. Form doldurma işlemlerini deneyin
4. Navigasyon çalışıyor mu kontrol edin

---

## 📂 Proje Yapısı

```
PersonalTrainerApp/
├── demo.html              # ⚡ Anında çalışan web demo
├── App.tsx                # Ana React Native uygulaması
├── package.json           # Bağımlılıklar ve scriptler
├── src/
│   ├── screens/          # Uygulama ekranları
│   └── database/         # Veritabanı işlemleri
├── assets/               # Görseller ve ikonlar
├── README.md             # Ana dokümantasyon
├── KURULUM.md           # Bu dosya
└── .gitignore           # Git ignore kuralları
```

---

## 🚀 Geliştirme Ortamı

### VS Code Eklentileri (Önerilen)
```
- React Native Tools
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- Expo Tools
```

### Faydalı Komutlar
```bash
# Geliştirme sunucusunu başlat
npm start

# Android emülatörde aç
npm run android

# iOS simülatörde aç (macOS)
npm run ios

# Web versiyonunu aç
npm run web

# Bağımlılıkları güncelle
npm update

# Cache temizle
npx expo start --clear
```

---

## 📞 Destek

### Sorun Yaşıyorsanız:
1. **GitHub Issues**: Repository'de issue açın
2. **Dokümantasyon**: README.md'yi inceleyin
3. **Demo Test**: Önce `demo.html`'i test edin

### Yararlı Linkler:
- [Expo Dokümantasyonu](https://docs.expo.dev/)
- [React Native Dokümantasyonu](https://reactnative.dev/)
- [Node.js İndirme](https://nodejs.org/)

---

**🎉 Kurulum tamamlandı! Artık Personal Trainer App'i kullanabilirsiniz.**