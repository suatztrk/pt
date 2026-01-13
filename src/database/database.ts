import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('personal_trainer.db');

// Veritabanı tablolarını oluştur
export const initDatabase = () => {
  db.transaction(tx => {
    // Kullanıcılar tablosu (PT'ler ve öğrenciler)
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        role TEXT NOT NULL CHECK (role IN ('trainer', 'client')),
        trainer_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trainer_id) REFERENCES users (id)
      );
    `);

    // Vücut ölçümleri tablosu
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS body_measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        height REAL,
        weight REAL,
        body_fat_percentage REAL,
        muscle_mass REAL,
        chest REAL,
        waist REAL,
        hip REAL,
        arm REAL,
        thigh REAL,
        measurement_date DATE NOT NULL,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    // Egzersizler tablosu
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        muscle_group TEXT NOT NULL,
        description TEXT,
        instructions TEXT
      );
    `);

    // Antrenman programları tablosu
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS workout_programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        trainer_id INTEGER NOT NULL,
        client_id INTEGER,
        duration_weeks INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trainer_id) REFERENCES users (id),
        FOREIGN KEY (client_id) REFERENCES users (id)
      );
    `);

    // Program egzersizleri tablosu
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS program_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        program_id INTEGER NOT NULL,
        exercise_id INTEGER NOT NULL,
        day_of_week INTEGER NOT NULL,
        sets INTEGER NOT NULL,
        reps TEXT NOT NULL,
        weight REAL,
        rest_seconds INTEGER,
        order_index INTEGER,
        FOREIGN KEY (program_id) REFERENCES workout_programs (id),
        FOREIGN KEY (exercise_id) REFERENCES exercises (id)
      );
    `);

    // Antrenman kayıtları tablosu
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS workout_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        program_id INTEGER,
        exercise_id INTEGER NOT NULL,
        sets_completed INTEGER NOT NULL,
        reps_completed TEXT NOT NULL,
        weight_used REAL,
        workout_date DATE NOT NULL,
        duration_minutes INTEGER,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (program_id) REFERENCES workout_programs (id),
        FOREIGN KEY (exercise_id) REFERENCES exercises (id)
      );
    `);

    // Temel egzersizleri ekle
    const exercises = [
      ['Bench Press', 'Strength', 'Chest', 'Göğüs kasları için temel egzersiz'],
      ['Squat', 'Strength', 'Legs', 'Bacak kasları için temel egzersiz'],
      ['Deadlift', 'Strength', 'Back', 'Sırt ve bacak kasları için bileşik egzersiz'],
      ['Pull-up', 'Strength', 'Back', 'Sırt kasları için vücut ağırlığı egzersizi'],
      ['Push-up', 'Strength', 'Chest', 'Göğüs kasları için vücut ağırlığı egzersizi'],
      ['Shoulder Press', 'Strength', 'Shoulders', 'Omuz kasları için temel egzersiz'],
      ['Bicep Curl', 'Strength', 'Arms', 'Bicep kasları için izolasyon egzersizi'],
      ['Tricep Dip', 'Strength', 'Arms', 'Tricep kasları için egzersiz'],
      ['Plank', 'Core', 'Core', 'Karın kasları için statik egzersiz'],
      ['Lunges', 'Strength', 'Legs', 'Bacak kasları için tek taraflı egzersiz']
    ];

    exercises.forEach(exercise => {
      tx.executeSql(
        'INSERT OR IGNORE INTO exercises (name, category, muscle_group, description) VALUES (?, ?, ?, ?)',
        exercise
      );
    });
  });
};

export default db;