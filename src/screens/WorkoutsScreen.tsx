import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  FAB, 
  List, 
  Chip,
  Modal,
  Portal,
  TextInput,
  SegmentedButtons
} from 'react-native-paper';
import db from '../database/database';

interface Exercise {
  id: number;
  name: string;
  category: string;
  muscle_group: string;
}

interface WorkoutLog {
  id: number;
  exercise_name: string;
  sets_completed: number;
  reps_completed: string;
  weight_used: number;
  workout_date: string;
}

export default function WorkoutsScreen() {
  const [activeTab, setActiveTab] = useState('today');
  const [todayWorkouts, setTodayWorkouts] = useState<WorkoutLog[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    exerciseId: '',
    sets: '',
    reps: '',
    weight: ''
  });

  useEffect(() => {
    loadTodayWorkouts();
    loadExercises();
  }, []);

  const loadTodayWorkouts = () => {
    const today = new Date().toISOString().split('T')[0];
    
    db.transaction(tx => {
      tx.executeSql(
        `SELECT wl.*, e.name as exercise_name 
         FROM workout_logs wl 
         JOIN exercises e ON wl.exercise_id = e.id 
         WHERE DATE(wl.workout_date) = ? 
         ORDER BY wl.workout_date DESC`,
        [today],
        (_, { rows }) => {
          setTodayWorkouts(rows._array);
        },
        (_, error) => {
          console.error('Bugünkü antrenmanlar yüklenirken hata:', error);
          return false;
        }
      );
    });
  };

  const loadExercises = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM exercises ORDER BY name',
        [],
        (_, { rows }) => {
          setExercises(rows._array);
        }
      );
    });
  };

  const addWorkoutLog = () => {
    if (!newWorkout.exerciseId || !newWorkout.sets || !newWorkout.reps) {
      Alert.alert('Hata', 'Egzersiz, set ve tekrar alanları zorunludur.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO workout_logs (user_id, exercise_id, sets_completed, reps_completed, weight_used, workout_date) VALUES (?, ?, ?, ?, ?, ?)',
        [1, newWorkout.exerciseId, newWorkout.sets, newWorkout.reps, newWorkout.weight || 0, today], // user_id = 1 (demo)
        (_, result) => {
          Alert.alert('Başarılı', 'Antrenman kaydedildi.');
          setNewWorkout({ exerciseId: '', sets: '', reps: '', weight: '' });
          setModalVisible(false);
          loadTodayWorkouts();
        },
        (_, error) => {
          Alert.alert('Hata', 'Antrenman kaydedilirken bir hata oluştu.');
          console.error(error);
          return false;
        }
      );
    });
  };

  const renderTodayWorkouts = () => (
    <ScrollView style={styles.scrollView}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Bugünkü Özet</Title>
          <View style={styles.summaryRow}>
            <Chip icon="fitness">
              {todayWorkouts.length} Egzersiz
            </Chip>
            <Chip icon="timer">
              {todayWorkouts.reduce((total, w) => total + w.sets_completed, 0)} Set
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {todayWorkouts.map(workout => (
        <Card key={workout.id} style={styles.workoutCard}>
          <List.Item
            title={workout.exercise_name}
            description={`${workout.sets_completed} set × ${workout.reps_completed} tekrar`}
            right={() => (
              <View style={styles.workoutDetails}>
                {workout.weight_used > 0 && (
                  <Paragraph style={styles.weight}>
                    {workout.weight_used} kg
                  </Paragraph>
                )}
              </View>
            )}
          />
        </Card>
      ))}

      {todayWorkouts.length === 0 && (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Title>Bugün henüz antrenman yok</Title>
            <Paragraph>
              İlk antrenmanınızı kaydetmek için + butonuna tıklayın.
            </Paragraph>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );

  const renderPrograms = () => (
    <ScrollView style={styles.scrollView}>
      <Card style={styles.programCard}>
        <Card.Content>
          <Title>Antrenman Programları</Title>
          <Paragraph>Yakında eklenecek...</Paragraph>
          <Button mode="outlined" style={styles.programButton}>
            Yeni Program Oluştur
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: 'today', label: 'Bugün' },
          { value: 'programs', label: 'Programlar' }
        ]}
        style={styles.segmentedButtons}
      />

      {activeTab === 'today' ? renderTodayWorkouts() : renderPrograms()}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title>Antrenman Kaydet</Title>
          
          <View style={styles.exerciseSelector}>
            <Paragraph>Egzersiz Seçin:</Paragraph>
            <ScrollView style={styles.exerciseList} nestedScrollEnabled>
              {exercises.map(exercise => (
                <Button
                  key={exercise.id}
                  mode={newWorkout.exerciseId === exercise.id.toString() ? 'contained' : 'outlined'}
                  onPress={() => setNewWorkout({...newWorkout, exerciseId: exercise.id.toString()})}
                  style={styles.exerciseButton}
                >
                  {exercise.name}
                </Button>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.inputRow}>
            <TextInput
              label="Set Sayısı *"
              value={newWorkout.sets}
              onChangeText={(text) => setNewWorkout({...newWorkout, sets: text})}
              style={styles.smallInput}
              mode="outlined"
              keyboardType="numeric"
            />
            
            <TextInput
              label="Tekrar *"
              value={newWorkout.reps}
              onChangeText={(text) => setNewWorkout({...newWorkout, reps: text})}
              style={styles.smallInput}
              mode="outlined"
              placeholder="8-12"
            />
          </View>
          
          <TextInput
            label="Ağırlık (kg)"
            value={newWorkout.weight}
            onChangeText={(text) => setNewWorkout({...newWorkout, weight: text})}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
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
              onPress={addWorkoutLog}
              style={styles.modalButton}
            >
              Kaydet
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
  segmentedButtons: {
    margin: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  workoutCard: {
    marginBottom: 8,
  },
  workoutDetails: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  weight: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  emptyCard: {
    marginTop: 50,
    alignItems: 'center',
  },
  programCard: {
    marginBottom: 16,
  },
  programButton: {
    marginTop: 16,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  exerciseSelector: {
    marginVertical: 16,
  },
  exerciseList: {
    maxHeight: 150,
    marginTop: 8,
  },
  exerciseButton: {
    marginVertical: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    marginVertical: 8,
  },
  smallInput: {
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