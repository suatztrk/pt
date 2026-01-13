# Personal Trainer Mobil Uygulaması

Personal trainer'lar ve fitness meraklıları için geliştirilmiş kapsamlı antrenman takip uygulaması.

## 🚀 Hızlı Başlangıç

### 1. Projeyi İndirin
```bash
git clone https://github.com/[kullanici-adi]/PersonalTrainerApp.git
cd PersonalTrainerApp
```

### 2. Demo'yu Çalıştırın (Anında Test)
```bash
# Windows
start demo.html

# macOS
open demo.html

# Linux
xdg-open demo.html
```

### 3. Mobil Uygulama Kurulumu (Opsiyonel)

#### Gereksinimler:
- Node.js (v16 veya üzeri) - [İndir](https://nodejs.org/)
- npm veya yarn

#### Kurulum:
```bash
# Bağımlılıkları yükle
npm install

# Expo CLI'yi global olarak yükle
npm install -g @expo/cli

# Uygulamayı başlat
npm start
```

#### Mobil Test:
1. **Expo Go** uygulamasını indirin:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Terminal'de görünen **QR kodu** tarayın
3. Uygulama telefonunuzda açılacak

## 📱 Özellikler

### 🏋️ Personal Trainer'lar İçin:
- ✅ **Öğrenci Yönetimi**: Öğrenci bilgileri, iletişim detayları
- ✅ **Vücut Ölçümleri**: Boy, kilo, vücut ölçüleri takibi
- ✅ **Program Oluşturma**: Kişiselleştirilmiş antrenman programları
- ✅ **İlerleme Takibi**: Detaylı performans analizi
- ✅ **PDF Raporları**: Profesyonel rapor indirme

### 💪 Bireysel Kullanıcılar İçin:
- ✅ **Antrenman Kaydı**: Set, tekrar, ağırlık takibi
- ✅ **İlerleme Grafikleri**: Görsel performans analizi
- ✅ **Egzersiz Kütüphanesi**: Geniş egzersiz veritabanı
- ✅ **Kişisel İstatistikler**: Detaylı analiz ve öngörüler

## 🎯 Demo Kullanımı

### Temel İşlemler:
1. **Öğrenci Ekleme**: "Öğrenciler" → "+" butonu
2. **Antrenman Kaydetme**: "Antrenmanlar" → "+" butonu
3. **Program Oluşturma**: "Program Oluştur" butonu
4. **Rapor İndirme**: "Raporlar" → "PDF İndir"

### Test Senaryosu:
```
1. Demo'yu açın (demo.html)
2. Birkaç öğrenci ekleyin
3. Antrenman kayıtları oluşturun
4. Raporlar sekmesinden PDF indirin
5. Tüm özellikleri test edin
```

## 🔧 Teknoloji Stack

- **Framework**: React Native (Expo)
- **Dil**: TypeScript
- **UI**: React Native Paper
- **Navigasyon**: React Navigation
- **Veritabanı**: SQLite
- **Grafikler**: React Native Chart Kit
- **PDF**: jsPDF
- **Platform**: iOS & Android

## 📊 Proje Yapısı

```
PersonalTrainerApp/
├── demo.html              # Web demo (anında çalışır)
├── App.tsx                # Ana uygulama
├── package.json           # Bağımlılıklar
├── src/
│   ├── screens/          # Ekran bileşenleri
│   │   ├── HomeScreen.tsx
│   │   ├── ClientsScreen.tsx
│   │   ├── WorkoutsScreen.tsx
│   │   ├── ReportsScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── database/         # Veritabanı
│       └── database.ts
├── assets/               # Görseller
└── README.md            # Bu dosya
```

## 🐛 Sorun Giderme

### Node.js Sürüm Sorunu:
```bash
# Node.js sürümünü kontrol edin
node --version

# v16+ gerekli, güncelleyin:
# https://nodejs.org/
```

### Expo Kurulum Sorunu:
```bash
# Expo CLI'yi yeniden yükleyin
npm uninstall -g @expo/cli
npm install -g @expo/cli@latest
```

### Demo Açılmıyor:
- `demo.html` dosyasını doğrudan tarayıcıya sürükleyin
- Veya dosya yolunu tarayıcı adres çubuğuna yapıştırın

## 📈 Gelecek Özellikler

- [ ] Push bildirimleri
- [ ] Sosyal medya entegrasyonu
- [ ] Video egzersiz kılavuzları
- [ ] Beslenme takibi
- [ ] Wearable cihaz entegrasyonu
- [ ] Çoklu dil desteği
- [ ] Bulut senkronizasyonu

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Commit yapın (`git commit -m 'Yeni özellik eklendi'`)
4. Push yapın (`git push origin feature/YeniOzellik`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **GitHub**: [Repository Link]
- **Demo**: `demo.html` dosyasını açın
- **Issues**: GitHub Issues sekmesini kullanın

---

## ⚡ Hızlı Komutlar

```bash
# Projeyi klonla ve demo'yu aç
git clone [repo-url] && cd PersonalTrainerApp && start demo.html

# Mobil geliştirme için
npm install && npm start

# Sadece demo test et
# demo.html dosyasını tarayıcıda aç
```

**Not**: Demo (`demo.html`) hiçbir kurulum gerektirmez ve anında çalışır!