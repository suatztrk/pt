import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  SegmentedButtons,
  DataTable,
  Chip
} from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import db from '../database/database';

const screenWidth = Dimensions.get('window').width;

interface WeightProgress {
  date: string;
  weight: number;
}

interface WorkoutStats {
  totalWorkouts: number;
  thisWeekWorkouts: number;
  averageWorkoutsPerWeek: number;
  favoriteExercise: string;
}

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState('progress');
  const [weightProgress, setWeightProgress] = useState<WeightProgress[]>([]);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    thisWeekWorkouts: 0,
    averageWorkoutsPerWeek: 0,
    favoriteExercise: ''
  });

  useEffect(() => {
    loadWeightProgress();
    loadWorkoutStats();
  }, []);

  const loadWeightProgress = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT measurement_date as date, weight 
         FROM body_measurements 
         WHERE weight IS NOT NULL 
         ORDER BY measurement_date DESC 
         LIMIT 10`,
        [],
        (_, { rows }) => {
          const data = rows._array.reverse(); // En eski tarihten başla
          setWeightProgress(data);
        }
      );
    });
  };

  const loadWorkoutStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekAgoStr = oneWeekAgo.toISOString().split('T')[0];

    db.transaction(tx => {
      // Toplam antrenman sayısı
      tx.executeSql(
        'SELECT COUNT(*) as total FROM workout_logs',
        [],
        (_, { rows }) => {
          const totalWorkouts = rows._array[0].total;
          
          // Bu haftaki antrenmanlar
          tx.executeSql(
            'SELECT COUNT(*) as thisWeek FROM workout_logs WHERE workout_date >= ?',
            [weekAgoStr],
            (_, { rows }) => {
              const thisWeekWorkouts = rows._array[0].thisWeek;
              
              // En çok yapılan egzersiz
              tx.executeSql(
                `SELECT e.name, COUNT(*) as count 
                 FROM workout_logs wl 
                 JOIN exercises e ON wl.exercise_id = e.id 
                 GROUP BY e.id 
                 ORDER BY count DESC 
                 LIMIT 1`,
                [],
                (_, { rows }) => {
                  const favoriteExercise = rows._array.length > 0 ? rows._array[0].name : 'Henüz yok';
                  
                  setWorkoutStats({
                    totalWorkouts,
                    thisWeekWorkouts,
                    averageWorkoutsPerWeek: Math.round(totalWorkouts / 4), // Yaklaşık 4 haftalık ortalama
                    favoriteExercise
                  });
                }
              );
            }
          );
        }
      );
    });
  };

  const chartConfig = {
    backgroundColor: '#6200ee',
    backgroundGradientFrom: '#6200ee',
    backgroundGradientTo: '#3700b3',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726'
    }
  };

  const renderProgressTab = () => {
    const weightData = {
      labels: weightProgress.map(item => 
        new Date(item.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })
      ),
      datasets: [{
        data: weightProgress.map(item => item.weight),
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2
      }]
    };

    return (
      <ScrollView style={styles.scrollView}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Genel İstatistikler</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{workoutStats.totalWorkouts}</Title>
                <Paragraph>Toplam Antrenman</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{workoutStats.thisWeekWorkouts}</Title>
                <Paragraph>Bu Hafta</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{workoutStats.averageWorkoutsPerWeek}</Title>
                <Paragraph>Haftalık Ortalama</Paragraph>
              </View>
            </View>
            <Chip icon="trophy" style={styles.favoriteChip}>
              En Sevilen: {workoutStats.favoriteExercise}
            </Chip>
          </Card.Content>
        </Card>

        {weightProgress.length > 0 && (
          <Card style={styles.chartCard}>
            <Card.Content>
              <Title>Kilo Takibi</Title>
              <LineChart
                data={weightData}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </Card.Content>
          </Card>
        )}

        {weightProgress.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title>Henüz veri yok</Title>
              <Paragraph>
                İlerleme grafiklerini görmek için vücut ölçümlerinizi kaydedin.
              </Paragraph>
              <Button mode="outlined" style={styles.addDataButton}>
                Ölçüm Ekle
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    );
  };

  const renderMonthlyTab = () => (
    <ScrollView style={styles.scrollView}>
      <Card style={styles.monthlyCard}>
        <Card.Content>
          <Title>Aylık Rapor - {new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</Title>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Metrik</DataTable.Title>
              <DataTable.Title numeric>Bu Ay</DataTable.Title>
              <DataTable.Title numeric>Geçen Ay</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>Antrenman Sayısı</DataTable.Cell>
              <DataTable.Cell numeric>{workoutStats.thisWeekWorkouts * 4}</DataTable.Cell>
              <DataTable.Cell numeric>{workoutStats.thisWeekWorkouts * 3}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Ortalama Set</DataTable.Cell>
              <DataTable.Cell numeric>156</DataTable.Cell>
              <DataTable.Cell numeric>142</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Kilo Değişimi</DataTable.Cell>
              <DataTable.Cell numeric>-2.1 kg</DataTable.Cell>
              <DataTable.Cell numeric>-1.8 kg</DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          <View style={styles.monthlyInsights}>
            <Title style={styles.insightsTitle}>Bu Ayki Öne Çıkanlar</Title>
            <Paragraph>• Antrenman sıklığında %15 artış</Paragraph>
            <Paragraph>• En çok gelişim gösteren kas grubu: Göğüs</Paragraph>
            <Paragraph>• Hedef kiloya %70 yaklaşıldı</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.exportCard}>
        <Card.Content>
          <Title>Rapor Dışa Aktar</Title>
          <Paragraph>Detaylı raporunuzu PDF olarak indirin</Paragraph>
          <Button mode="contained" style={styles.exportButton}>
            PDF İndir
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
          { value: 'progress', label: 'İlerleme' },
          { value: 'monthly', label: 'Aylık Rapor' }
        ]}
        style={styles.segmentedButtons}
      />

      {activeTab === 'progress' ? renderProgressTab() : renderMonthlyTab()}
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
  statsCard: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  favoriteChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  chartCard: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyCard: {
    marginTop: 50,
    alignItems: 'center',
  },
  addDataButton: {
    marginTop: 16,
  },
  monthlyCard: {
    marginBottom: 16,
  },
  monthlyInsights: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  insightsTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  exportCard: {
    marginBottom: 16,
  },
  exportButton: {
    marginTop: 8,
  },
});