import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  FAB, 
  List, 
  Avatar,
  Searchbar,
  Modal,
  Portal,
  TextInput
} from 'react-native-paper';
import db from '../database/database';

interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  lastWorkout?: string;
  totalWorkouts: number;
}

export default function ClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT u.*, 
         COUNT(wl.id) as total_workouts,
         MAX(wl.workout_date) as last_workout
         FROM users u 
         LEFT JOIN workout_logs wl ON u.id = wl.user_id 
         WHERE u.role = 'client' 
         GROUP BY u.id`,
        [],
        (_, { rows }) => {
          const clientsData = rows._array.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            lastWorkout: row.last_workout,
            totalWorkouts: row.total_workouts || 0
          }));
          setClients(clientsData);
        },
        (_, error) => {
          console.error('Öğrenciler yüklenirken hata:', error);
          return false;
        }
      );
    });
  };

  const addClient = () => {
    if (!newClient.name || !newClient.email) {
      Alert.alert('Hata', 'Ad ve e-posta alanları zorunludur.');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (name, email, phone, role, trainer_id) VALUES (?, ?, ?, ?, ?)',
        [newClient.name, newClient.email, newClient.phone, 'client', 1], // trainer_id = 1 (demo)
        (_, result) => {
          Alert.alert('Başarılı', 'Öğrenci başarıyla eklendi.');
          setNewClient({ name: '', email: '', phone: '' });
          setModalVisible(false);
          loadClients();
        },
        (_, error) => {
          Alert.alert('Hata', 'Öğrenci eklenirken bir hata oluştu.');
          console.error(error);
          return false;
        }
      );
    });
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Öğrenci ara..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView style={styles.scrollView}>
        {filteredClients.map(client => (
          <Card key={client.id} style={styles.clientCard}>
            <List.Item
              title={client.name}
              description={`${client.email} • ${client.totalWorkouts} antrenman`}
              left={() => (
                <Avatar.Text 
                  size={50} 
                  label={client.name.charAt(0).toUpperCase()} 
                />
              )}
              right={() => (
                <View style={styles.clientActions}>
                  <Button mode="outlined" compact>
                    Detay
                  </Button>
                </View>
              )}
            />
            {client.lastWorkout && (
              <Card.Content>
                <Paragraph style={styles.lastWorkout}>
                  Son antrenman: {new Date(client.lastWorkout).toLocaleDateString('tr-TR')}
                </Paragraph>
              </Card.Content>
            )}
          </Card>
        ))}

        {filteredClients.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title>Henüz öğrenci yok</Title>
              <Paragraph>
                İlk öğrencinizi eklemek için + butonuna tıklayın.
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title>Yeni Öğrenci Ekle</Title>
          
          <TextInput
            label="Ad Soyad *"
            value={newClient.name}
            onChangeText={(text) => setNewClient({...newClient, name: text})}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="E-posta *"
            value={newClient.email}
            onChangeText={(text) => setNewClient({...newClient, email: text})}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
          />
          
          <TextInput
            label="Telefon"
            value={newClient.phone}
            onChangeText={(text) => setNewClient({...newClient, phone: text})}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
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
              onPress={addClient}
              style={styles.modalButton}
            >
              Ekle
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setModalVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  clientCard: {
    marginBottom: 8,
  },
  clientActions: {
    justifyContent: 'center',
  },
  lastWorkout: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyCard: {
    marginTop: 50,
    alignItems: 'center',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});