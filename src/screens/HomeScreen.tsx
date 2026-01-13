import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import { initDatabase } from '../database/database';

interface DashboardStats {
  totalClients: number;
  todayWorkouts: number;
  weeklyProgress: number;
}

export default function HomeScreen({ navigation }: any) {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    todayWorkouts: 0,
    weeklyProgress: 0
  });

  useEffect(() => {
    initDatabase();
    loadDashboardStats();
  }, []);

  const loadDashboardStats = () => {
    // Burada veritabanından istatistikleri yükleyeceğiz
    setStats({
      totalClients: 12,
      todayWorkouts: 5,
      weeklyProgress: 85
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title>Hoş Geldiniz!</Title>
            <Paragraph>
              Bugün {new Date().toLocaleDateString('tr-TR')} tarihinde 
              {stats.todayWorkouts} antrenman planlanmış.
            </Paragraph>
          </Card.Content>
        </Card>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.statNumber}>{stats.totalClients}</Title>
              <Paragraph>Toplam Öğrenci</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.statNumber}>{stats.todayWorkouts}</Title>
              <Paragraph>Bugünkü Antrenmanlar</Paragraph>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.progressCard}>
          <Card.Content>
            <Title>Haftalık İlerleme</Title>
            <Paragraph>Bu hafta tamamlanan antrenman oranı</Paragraph>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${stats.weeklyProgress}%` }]} 
              />
            </View>
            <Paragraph style={styles.progressText}>{stats.weeklyProgress}%</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.actionCard}>
          <Card.Content>
            <Title>Hızlı İşlemler</Title>
            <View style={styles.actionButtons}>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Öğrenciler')}
                style={styles.actionButton}
              >
                Yeni Öğrenci Ekle
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => navigation.navigate('Antrenmanlar')}
                style={styles.actionButton}
              >
                Program Oluştur
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Antrenmanlar')}
      />
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
  welcomeCard: {
    marginBottom: 16,
    backgroundColor: '#6200ee',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 0.48,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
  },
  progressCard: {
    marginBottom: 16,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6200ee',
    borderRadius: 5,
  },
  progressText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionCard: {
    marginBottom: 80,
  },
  actionButtons: {
    marginTop: 8,
  },
  actionButton: {
    marginVertical: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});