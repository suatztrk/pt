import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  FAB, 
  List,
  Modal,
  Portal,
  TextInput,
  SegmentedButtons
} from 'react-native-paper';
import db from '../database/database';

interface Measurement {
  id: number;
  height: number;
  weight: number;
  body_fat_percentage: number;
  muscle_mass: number;
  chest: number;
  waist: number;
  hip: number;
  arm: number;
  thigh: number;
  measurement_date: string;
  notes: string;
}

export default function MeasurementsScreen() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [newMeasurement, setNewMeasurement] = useState({
    height: '',
    weight: '',
    bodyFat: '',
    muscleMass: '',
    chest: '',
    waist: '',
    hip: '',
    arm: '',
    thigh: '',
    notes: ''
  });

  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM body_measurements WHERE user_id = ? ORDER BY measurement_date DESC',
        [1], // user_id = 1 (demo)
        (_, { rows }) => {
          setMeasurements(rows._array);
        },
        (_, error) => {
          console.error('Ölçümler yüklenirken hata:', error);
          return false;
        }
      );
    });
  };

  const addMeasurement = () => {
    if (!newMeasurement.weight) {
      Alert.alert('Hata', 'En az kilo bilgisi girilmelidir.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO body_measurements 
         (user_id, height, weight, body_fat_percentage, muscle_mass, chest, waist, hip, arm, thigh, measurement_date, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1, // user_id
          newMeasurement.height || null,
          newMeasurement.weight,
          newMeasurement.bodyFat || null,
          newMeasurement.muscleMass || null,
          newMeasurement.chest || null,
          newMeasurement.waist || null,
          newMeasurement.hip || null,
          newMeasurement.arm || null,
          newMeasurement.thigh || null,
          today,
          newMeasurement.notes || null
        ],
        (_, result) => {
          Alert.alert('Başarılı', 'Ölçüm kaydedildi.');
          setNewMeasurement({
            height: '', weight: '', bodyFat: '', muscleMass: '',
            chest: '', waist: '', hip: '', arm: '', thigh: '', notes: ''
          });
          setModalVisible(false);
          loadMeasurements();
        },
        (_, error) => {
          Alert.alert('Hata', 'Ölçüm kaydedilirken bir hata oluştu.');
          console.error(error);
          return false;
        }
      );
    });
  };

  const renderMeasurementsList = () => (
    <ScrollView style={styles.scrollView}>
      {measurements.map(measurement => (
        <Card key={measurement.id} style={styles.measurementCard}>
          <Card.Content>
            <View style={styles.measurementHeader}>
              <Title>{new Date(measurement.measurement_date).toLocaleDateString('tr-TR')}</Title>
              {measurement.weight && (
                <Paragraph style={styles.weightBadge}>
                  {measurement.weight} kg
                </Paragraph>
              )}
            </View>
            
            <View style={styles.measurementGrid}>
              {measurement.height && (
                <View style={styles.measurementItem}>
                  <Paragraph style={styles.measurementLabel}>Boy</Paragraph>
                  <Paragraph style={styles.measurementValue}>{measurement.height} cm</Paragraph>
                </View>
              )}
              
              {measurement.body_fat_percentage && (
                <View style={styles.measurementItem}>
                  <Paragraph style={styles.measurementLabel}>Yağ Oranı</Paragraph>
                  <Paragraph style={styles.measurementValue}>{measurement.body_fat_percentage}%</Paragraph>
                </View>
              )}
              
              {measurement.muscle_mass && (
                <View style={styles.measurementItem}>
                  <Paragraph style={styles.measurementLabel}>Kas Kütlesi</Paragraph>
                  <Paragraph style={styles.measurementValue}>{measurement.muscle_mass} kg</Paragraph>
                </View>
              )}
              
              {measurement.chest && (
                <View style={styles.measurementItem}>
                  <Paragraph style={styles.measurementLabel}>Göğüs</Paragraph>
                  <Paragraph style={styles.measurementValue}>{measurement.chest} cm</Paragraph>
                </View>
              )}
              
              {measurement.waist && (
                <View style={styles.measurementItem}>
                  <Paragraph style={styles.measurementLabel}>Bel</Paragraph>
                  <Paragraph style={styles.measurementValue}>{measurement.waist} cm</Paragraph>
                </View>
              )}
              
              {measurement.hip && (
                <View style={styles.measurementItem}>
                  <Paragraph style={styles.measurementLabel}>Kalça</Paragraph>
                  <Paragraph style={styles.measurementValue}>{measurement.hip} cm</Paragraph>
                </View>
              )}
            </View>
            
            {measurement.notes && (
              <Paragraph style={styles.notes}>
                Not: {measurement.notes}
              </Paragraph>
            )}
          </Card.Content>
        </Card>
      ))}

      {measurements.length === 0 && (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Title>Henüz ölçüm yok</Title>
            <Paragraph>
              İlk vücut ölçümünüzü kaydetmek için + butonuna tıklayın.
            </Paragraph>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );

  const renderProgressTab = () => {
    if (measurements.length < 2) {
      return (
        <View style={styles.noProgressContainer}>
          <Card style={styles.noProgressCard}>
            <Card.Content>
              <Title>İlerleme Takibi</Title>
              <Paragraph>
                İlerleme grafiklerini görmek için en az 2 ölçüm kaydı gereklidir.
              </Paragraph>
            </Card.Content>
          </Card>
        </View>
      );
    }

    const latest = measurements[0];
    const previous = measurements[1];
    
    const weightChange = latest.weight - previous.weight;
    const waistChange = latest.waist && previous.waist ? latest.waist - previous.waist : null;

    return (
      <ScrollView style={styles.scrollView}>
        <Card style={styles.progressCard}>
          <Card.Content>
            <Title>Son Değişiklikler</Title>
            <View style={styles.changeGrid}>
              <View style={styles.changeItem}>
                <Paragraph style={styles.changeLabel}>Kilo Değişimi</Paragraph>
                <Paragraph style={[
                  styles.changeValue,
                  { color: weightChange > 0 ? '#d32f2f' : '#388e3c' }
                ]}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </Paragraph>
              </View>
              
              {waistChange !== null && (
                <View style={styles.changeItem}>
                  <Paragraph style={styles.changeLabel}>Bel Değişimi</Paragraph>
                  <Paragraph style={[
                    styles.changeValue,
                    { color: waistChange > 0 ? '#d32f2f' : '#388e3c' }
                  ]}>
                    {waistChange > 0 ? '+' : ''}{waistChange.toFixed(1)} cm
                  </Paragraph>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: 'list', label: 'Ölçümler' },
          { value: 'progress', label: 'İlerleme' }
        ]}
        style={styles.segmentedButtons}
      />

      {activeTab === 'list' ? renderMeasurementsList() : renderProgressTab()}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            <Title>Yeni Ölçüm Ekle</Title>
            
            <View style={styles.inputRow}>
              <TextInput
                label="Boy (cm)"
                value={newMeasurement.height}
                onChangeText={(text) => setNewMeasurement({...newMeasurement, height: text})}
                style={styles.halfInput}
                mode="outlined"
                keyboardType="numeric"
              />
              
              <TextInput
                label="Kilo (kg) *"
                value={newMeasurement.weight}
                onChangeText={(text) => setNewMeasurement({...newMeasurement, weight: text})}
                style={styles.halfInput}
                mode="outlined"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputRow}>
              <TextInput
                label="Yağ Oranı (%)"
                value={newMeasurement.bodyFat}
                onChangeText={(text) => setNewMeasurement({...newMeasurement, bodyFat: text})}
                style={styles.halfInput}
                mode="outlined"
                keyboardType="numeric"
              />
              
              <TextInput
                label="Kas Kütlesi (kg)"
                value={newMeasurement.muscleMass}
                onChangeText={(text) => setNewMeasurement({...newMeasurement, muscleMass: text})}
                style={styles.halfInput}
                mode="outlined"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputRow}>
              <TextInput
                label="Göğüs (cm)"
                value={newMeasurement.chest}
                onChangeText={(text) => setNewMeasurement({...newMeasurement, chest: text})}
                style={styles.halfInput}
                mode="outlined"
                keyboardType="numeric"
              />
              
              <TextInput
                label="Bel (cm)"
                value={newMeasurement.waist}
                onChangeText={(text) => setNewMeasurement({...newMeasurement, waist: text})}
                style={styles.halfInput}
                mode="outlined"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputRow}>
              <TextInput
                label="Kalça (cm)"
                value={newMeasurement.hip}
                onChangeText={(text) => setNewMeasurement({...newMeasurement, hip: text})}
                style={styles.halfInput}
                mode="outlined"
                keyboardType="numeric"
              />
              
              <TextInput
                label="Kol (cm)"
                value={newMeasurement.arm}
                onChangeText={(text) => setNewMeasurement({...newMeasurement, arm: text})}
                style={styles.halfInput}
                mode="outlined"
                keyboardType="numeric"
              />
            </View>
            
            <TextInput
              label="Bacak (cm)"
              value={newMeasurement.thigh}
              onChangeText={(text) => setNewMeasurement({...newMeasurement, thigh: text})}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
            />
            
            <TextInput
              label="Notlar"
              value={newMeasurement.notes}
              onChangeText={(text) => setNewMeasurement({...newMeasurement, notes: text})}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
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
                onPress={addMeasurement}
                style={styles.modalButton}
              >
                Kaydet
              </Button>
            </View>
          </ScrollView>
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
  segmentedButtons: {
    margin: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  measurementCard: {
    marginBottom: 12,
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weightBadge: {
    backgroundColor: '#6200ee',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 14,
    fontWeight: 'bold',
  },
  measurementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  measurementItem: {
    width: '48%',
    marginBottom: 8,
  },
  measurementLabel: {
    fontSize: 12,
    color: '#666',
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notes: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#666',
  },
  emptyCard: {
    marginTop: 50,
    alignItems: 'center',
  },
  noProgressContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  noProgressCard: {
    alignItems: 'center',
  },
  progressCard: {
    marginBottom: 16,
  },
  changeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  changeItem: {
    alignItems: 'center',
  },
  changeLabel: {
    fontSize: 12,
    color: '#666',
  },
  changeValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    marginVertical: 8,
  },
  halfInput: {
    flex: 1,
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