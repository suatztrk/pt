import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  List, 
  Avatar,
  Switch,
  Divider,
  Modal,
  Portal,
  TextInput
} from 'react-native-paper';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 555 123 4567',
    specialization: 'Kuvvet Antrenmanı, Kilo Verme'
  });

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: () => {
          // Çıkış işlemi burada yapılacak
          Alert.alert('Başarılı', 'Hesabınızdan çıkış yapıldı.');
        }}
      ]
    );
  };

  const saveProfile = () => {
    // Profil güncelleme işlemi burada yapılacak
    Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profil Kartı */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text 
              size={80} 
              label={profileData.name.split(' ').map(n => n[0]).join('')} 
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Title>{profileData.name}</Title>
              <Paragraph>{profileData.email}</Paragraph>
              <Paragraph style={styles.specialization}>
                {profileData.specialization}
              </Paragraph>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button mode="outlined" onPress={() => setModalVisible(true)}>
              Profili Düzenle
            </Button>
          </Card.Actions>
        </Card>

        {/* İstatistikler */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Hızlı İstatistikler</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>24</Title>
                <Paragraph>Aktif Öğrenci</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>156</Title>
                <Paragraph>Bu Ay Antrenman</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>4.8</Title>
                <Paragraph>Ortalama Puan</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Ayarlar */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Title>Ayarlar</Title>
          </Card.Content>
          
          <List.Item
            title="Bildirimler"
            description="Push bildirimleri al"
            left={() => <List.Icon icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Koyu Tema"
            description="Karanlık modu etkinleştir"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Yedekleme"
            description="Verileri yedekle"
            left={() => <List.Icon icon="backup-restore" />}
            onPress={() => Alert.alert('Bilgi', 'Yedekleme özelliği yakında eklenecek.')}
          />
          
          <Divider />
          
          <List.Item
            title="Veri Dışa Aktar"
            description="Tüm verileri dışa aktar"
            left={() => <List.Icon icon="export" />}
            onPress={() => Alert.alert('Bilgi', 'Dışa aktarma özelliği yakında eklenecek.')}
          />
        </Card>

        {/* Destek ve Bilgi */}
        <Card style={styles.supportCard}>
          <Card.Content>
            <Title>Destek ve Bilgi</Title>
          </Card.Content>
          
          <List.Item
            title="Yardım Merkezi"
            left={() => <List.Icon icon="help-circle" />}
            onPress={() => Alert.alert('Bilgi', 'Yardım sayfası açılacak.')}
          />
          
          <List.Item
            title="Geri Bildirim Gönder"
            left={() => <List.Icon icon="message-text" />}
            onPress={() => Alert.alert('Bilgi', 'Geri bildirim formu açılacak.')}
          />
          
          <List.Item
            title="Uygulama Hakkında"
            left={() => <List.Icon icon="information" />}
            onPress={() => Alert.alert('Personal Trainer App', 'Sürüm 1.0.0\n\nPersonal trainer ve fitness takip uygulaması.')}
          />
        </Card>

        {/* Çıkış */}
        <Card style={styles.logoutCard}>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={handleLogout}
              buttonColor="#d32f2f"
              style={styles.logoutButton}
            >
              Hesaptan Çıkış Yap
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      {/* Profil Düzenleme Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title>Profili Düzenle</Title>
          
          <TextInput
            label="Ad Soyad"
            value={profileData.name}
            onChangeText={(text) => setProfileData({...profileData, name: text})}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="E-posta"
            value={profileData.email}
            onChangeText={(text) => setProfileData({...profileData, email: text})}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
          />
          
          <TextInput
            label="Telefon"
            value={profileData.phone}
            onChangeText={(text) => setProfileData({...profileData, phone: text})}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />
          
          <TextInput
            label="Uzmanlık Alanları"
            value={profileData.specialization}
            onChangeText={(text) => setProfileData({...profileData, specialization: text})}
            style={styles.input}
            mode="outlined"
            multiline
          />

          <View style={styles.modalActions}>
            <Button 
              mode="outlined" 
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              İptal
            </Button>
            <Button 
              mode="contained" 
              onPress={saveProfile}
              style={styles.modalButton}
            >
              Kaydet
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  specialization: {
    color: '#666',
    fontStyle: 'italic',
  },
  statsCard: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  settingsCard: {
    marginBottom: 16,
  },
  supportCard: {
    marginBottom: 16,
  },
  logoutCard: {
    marginBottom: 32,
  },
  logoutButton: {
    flex: 1,
    margin: 16,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  input: {
    marginVertical: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 8,
  },
});