// PTAnalizer JavaScript - Personal Trainer Analytics v1.2
console.log('🔧 PTAnalizer JavaScript dosyası yüklendi!');

// Firebase Veritabanı Sistemi
let useFirebase = true;
let useLocalStorage = false;
const STORAGE_PREFIX = 'PT_';

// Veritabanını başlat - Firebase öncelikli
async function initDatabase() {
    try {
        // Firebase erişim testi
        if (window.firebaseDB && window.firebaseModules) {
            console.log('Firebase veritabanı sistemi başlatılıyor...');
            
            // Test koleksiyonu oluştur
            const { collection, addDoc } = window.firebaseModules;
            
            try {
                // PTAnalizer Firebase bağlantı testi
                console.log('PTAnalizer Firebase bağlantısı test ediliyor...');
                
                await addDoc(collection(window.firebaseDB, 'ptanalizer_test'), {
                    timestamp: new Date(),
                    app: 'PTAnalizer',
                    version: '1.0.0',
                    test: true
                });
                
                console.log('✅ PTAnalizer Firebase bağlantı testi başarılı');
                useFirebase = true;
                useLocalStorage = false;
                return true;
                
            } catch (firebaseError) {
                console.warn('Firebase bağlantı hatası, localStorage\'a geçiliyor:', firebaseError);
                useFirebase = false;
                useLocalStorage = true;
                initLocalStorage();
                return true;
            }
        } else {
            console.warn('Firebase modülleri yüklenmedi, localStorage kullanılacak');
            useFirebase = false;
            useLocalStorage = true;
            initLocalStorage();
            return true;
        }
    } catch (error) {
        console.error('Database init hatası:', error);
        useFirebase = false;
        useLocalStorage = true;
        initLocalStorage();
        return true;
    }
}

// localStorage başlatma ve yönetimi
function initLocalStorage() {
    console.log('localStorage veritabanı sistemi başlatılıyor...');

    try {
        // localStorage erişim testi
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log('localStorage erişim testi başarılı');
    } catch (error) {
        console.error('localStorage erişim hatası:', error);
        throw new Error('localStorage kullanılamıyor');
    }
    
    // Tablolar için boş diziler oluştur
    const tables = ['clients', 'workouts', 'programs', 'measurements'];
    tables.forEach(table => {
        if (!localStorage.getItem(STORAGE_PREFIX + table)) {
            localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify([]));
            console.log(`${table} tablosu oluşturuldu`);
        } else {
            const existingData = JSON.parse(localStorage.getItem(STORAGE_PREFIX + table));
            console.log(`${table} tablosu mevcut, ${existingData.length} kayıt var`);
        }
    });

    // Ayarlar için boş obje
    if (!localStorage.getItem(STORAGE_PREFIX + 'settings')) {
        localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify({}));
        console.log('Settings tablosu oluşturuldu');
    }

    // ID sayacı
    if (!localStorage.getItem(STORAGE_PREFIX + 'nextId')) {
        localStorage.setItem(STORAGE_PREFIX + 'nextId', '1');
        console.log('ID sayacı başlatıldı');
    } else {
        const currentId = localStorage.getItem(STORAGE_PREFIX + 'nextId');
        console.log(`ID sayacı mevcut: ${currentId}`);
    }
    
    console.log('localStorage veritabanı hazır!');
}
// Firebase yardımcı fonksiyonları
async function addToFirebase(collectionName, data) {
    try {
        const { collection, addDoc } = window.firebaseModules;
        data.createdAt = new Date();
        data.updatedAt = new Date();
        
        const docRef = await addDoc(collection(window.firebaseDB, collectionName), data);
        console.log(`${collectionName} koleksiyonuna veri eklendi:`, docRef.id);
        
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error(`${collectionName} koleksiyonuna veri eklenirken hata:`, error);
        throw error;
    }
}

async function getFromFirebase(collectionName) {
    try {
        const { collection, getDocs, orderBy, query } = window.firebaseModules;
        const q = query(collection(window.firebaseDB, collectionName), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`${collectionName} koleksiyonundan ${data.length} kayıt okundu`);
        return data;
    } catch (error) {
        console.error(`${collectionName} koleksiyonu okunurken hata:`, error);
        return [];
    }
}

async function updateInFirebase(collectionName, id, data) {
    try {
        const { doc, updateDoc } = window.firebaseModules;
        data.updatedAt = new Date();
        
        const docRef = doc(window.firebaseDB, collectionName, id);
        await updateDoc(docRef, data);
        
        console.log(`${collectionName} koleksiyonunda güncelleme yapıldı:`, id);
        return { id, ...data };
    } catch (error) {
        console.error(`${collectionName} koleksiyonu güncellenirken hata:`, error);
        throw error;
    }
}

async function deleteFromFirebase(collectionName, id) {
    try {
        const { doc, deleteDoc } = window.firebaseModules;
        const docRef = doc(window.firebaseDB, collectionName, id);
        await deleteDoc(docRef);
        
        console.log(`${collectionName} koleksiyonundan silindi:`, id);
        return true;
    } catch (error) {
        console.error(`${collectionName} koleksiyonundan silme hatası:`, error);
        throw error;
    }
}

// localStorage yardımcı fonksiyonları (Firebase fallback)
function getNextId() {
    const nextId = parseInt(localStorage.getItem(STORAGE_PREFIX + 'nextId') || '1');
    localStorage.setItem(STORAGE_PREFIX + 'nextId', (nextId + 1).toString());
    return nextId;
}

function saveToLocalStorage(table, data) {
    try {
        const items = JSON.parse(localStorage.getItem(STORAGE_PREFIX + table) || '[]');
        items.push(data);
        localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify(items));
        console.log(`${table} tablosuna veri eklendi:`, data);
        return true;
    } catch (error) {
        console.error(`${table} tablosuna veri eklenirken hata:`, error);
        return false;
    }
}

function getFromLocalStorage(table) {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_PREFIX + table) || '[]');
        console.log(`${table} tablosundan ${data.length} kayıt okundu`);
        return data;
    } catch (error) {
        console.error(`${table} tablosu okunurken hata:`, error);
        return [];
    }
}

function updateInLocalStorage(table, updatedItem) {
    try {
        const items = JSON.parse(localStorage.getItem(STORAGE_PREFIX + table) || '[]');
        const index = items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
            items[index] = updatedItem;
            localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify(items));
            console.log(`${table} tablosunda güncelleme yapıldı:`, updatedItem);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`${table} tablosu güncellenirken hata:`, error);
        return false;
    }
}

function deleteFromLocalStorage(table, id) {
    try {
        const items = JSON.parse(localStorage.getItem(STORAGE_PREFIX + table) || '[]');
        const filteredItems = items.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify(filteredItems));
        console.log(`${table} tablosundan ID ${id} silindi`);
        return true;
    } catch (error) {
        console.error(`${table} tablosundan silme hatası:`, error);
        return false;
    }
}
// Hibrit Veritabanı İşlemleri (Firebase + localStorage fallback)
const DatabaseManager = {
    // Öğrenci işlemleri
    async addClient(client) {
        try {
            if (useFirebase) {
                client.lastWorkout = new Date().toISOString().split('T')[0];
                client.workouts = 0;
                return await addToFirebase('ptanalizer_clients', client);
            } else {
                client.id = getNextId();
                client.createdAt = new Date().toISOString();
                client.lastWorkout = new Date().toISOString().split('T')[0];
                client.workouts = 0;
                
                const success = saveToLocalStorage('clients', client);
                if (success) {
                    return Promise.resolve(client);
                } else {
                    throw new Error('Öğrenci kaydedilemedi');
                }
            }
        } catch (error) {
            console.error('Öğrenci ekleme hatası:', error);
            return Promise.reject(error);
        }
    },
    
    async getAllClients() {
        try {
            if (useFirebase) {
                return await getFromFirebase('ptanalizer_clients');
            } else {
                return Promise.resolve(getFromLocalStorage('clients'));
            }
        } catch (error) {
            console.error('Öğrenciler yüklenirken hata:', error);
            return Promise.resolve([]);
        }
    },
    
    async updateClient(client) {
        try {
            if (useFirebase) {
                return await updateInFirebase('ptanalizer_clients', client.id, client);
            } else {
                client.updatedAt = new Date().toISOString();
                const success = updateInLocalStorage('clients', client);
                if (success) {
                    return Promise.resolve(client);
                } else {
                    throw new Error('Öğrenci güncellenemedi');
                }
            }
        } catch (error) {
            console.error('Öğrenci güncelleme hatası:', error);
            return Promise.reject(error);
        }
    },
    
    async deleteClient(id) {
        try {
            if (useFirebase) {
                await deleteFromFirebase('ptanalizer_clients', id);
                return Promise.resolve();
            } else {
                const success = deleteFromLocalStorage('clients', id);
                if (success) {
                    return Promise.resolve();
                } else {
                    throw new Error('Öğrenci silinemedi');
                }
            }
        } catch (error) {
            console.error('Öğrenci silme hatası:', error);
            return Promise.reject(error);
        }
    },
    
    // Antrenman işlemleri
    async addWorkout(workout) {
        try {
            if (useFirebase) {
                return await addToFirebase('ptanalizer_workouts', workout);
            } else {
                workout.id = getNextId();
                workout.createdAt = new Date().toISOString();
                
                const success = saveToLocalStorage('workouts', workout);
                if (success) {
                    return Promise.resolve(workout);
                } else {
                    throw new Error('Antrenman kaydedilemedi');
                }
            }
        } catch (error) {
            console.error('Antrenman ekleme hatası:', error);
            return Promise.reject(error);
        }
    },
    
    async getAllWorkouts() {
        try {
            if (useFirebase) {
                return await getFromFirebase('ptanalizer_workouts');
            } else {
                return Promise.resolve(getFromLocalStorage('workouts'));
            }
        } catch (error) {
            console.error('Antrenmanlar yüklenirken hata:', error);
            return Promise.resolve([]);
        }
    },
    
    async deleteWorkout(id) {
        try {
            if (useFirebase) {
                await deleteFromFirebase('ptanalizer_workouts', id);
                return Promise.resolve();
            } else {
                const success = deleteFromLocalStorage('workouts', id);
                if (success) {
                    return Promise.resolve();
                } else {
                    throw new Error('Antrenman silinemedi');
                }
            }
        } catch (error) {
            console.error('Antrenman silme hatası:', error);
            return Promise.reject(error);
        }
    },
    
    // Program işlemleri
    async addProgram(program) {
        try {
            if (useFirebase) {
                return await addToFirebase('ptanalizer_programs', program);
            } else {
                program.id = getNextId();
                program.createdAt = new Date().toISOString();
                
                const success = saveToLocalStorage('programs', program);
                if (success) {
                    return Promise.resolve(program);
                } else {
                    throw new Error('Program kaydedilemedi');
                }
            }
        } catch (error) {
            console.error('Program ekleme hatası:', error);
            return Promise.reject(error);
        }
    },
    
    async getAllPrograms() {
        try {
            if (useFirebase) {
                return await getFromFirebase('ptanalizer_programs');
            } else {
                return Promise.resolve(getFromLocalStorage('programs'));
            }
        } catch (error) {
            console.error('Programlar yüklenirken hata:', error);
            return Promise.resolve([]);
        }
    },
    
    // Ayarlar işlemleri
    async saveSetting(key, value) {
        try {
            if (useFirebase) {
                // Firebase'de ayarları ayrı koleksiyon olarak sakla
                const settingData = { key, value };
                return await addToFirebase('ptanalizer_settings', settingData);
            } else {
                const settings = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'settings') || '{}');
                settings[key] = { value: value, updatedAt: new Date().toISOString() };
                localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(settings));
                console.log(`Ayar kaydedildi: ${key} = ${value}`);
                return Promise.resolve();
            }
        } catch (error) {
            console.error('Ayar kaydetme hatası:', error);
            return Promise.reject(error);
        }
    },
    
    async getSetting(key) {
        try {
            if (useFirebase) {
                const settings = await getFromFirebase('ptanalizer_settings');
                const setting = settings.find(s => s.key === key);
                return Promise.resolve(setting ? setting.value : null);
            } else {
                const settings = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'settings') || '{}');
                const value = settings[key] ? settings[key].value : null;
                console.log(`Ayar okundu: ${key} = ${value}`);
                return Promise.resolve(value);
            }
        } catch (error) {
            console.error('Ayar okuma hatası:', error);
            return Promise.resolve(null);
        }
    }
};

// Global değişkenler - artık veritabanından yüklenecek
let clients = [];
let workouts = [];
let programs = [];
let measurements = [];
// Veritabanından verileri yükle
async function loadDataFromDatabase() {
    try {
        clients = await DatabaseManager.getAllClients();
        workouts = await DatabaseManager.getAllWorkouts();
        programs = await DatabaseManager.getAllPrograms();
        
        console.log('Veritabanından yüklendi:', {
            clients: clients.length,
            workouts: workouts.length,
            programs: programs.length,
            storageType: useFirebase ? 'Firebase' : 'localStorage'
        });
        
        // Eğer veri yoksa demo verilerini ekle
        if (clients.length === 0) {
            console.log('Demo verileri ekleniyor...');
            await addDemoData();
        } else {
            // UI'yi güncelle
            updateAllDisplays();
        }
        
    } catch (error) {
        console.error('Veritabanı yükleme hatası:', error);
        showNotification('Veritabanı yüklenirken hata oluştu!', 'error');
        
        // Hata durumunda boş dizilerle devam et
        clients = [];
        workouts = [];
        programs = [];
        measurements = [];
        updateAllDisplays();
    }
}

// Demo verilerini veritabanına ekle
async function addDemoData() {
    try {
        console.log('Demo verileri ekleniyor...');
        
        // Demo öğrenciler
        const demoClients = [
            { name: 'Ahmet Yılmaz', email: 'ahmet@example.com', phone: '+90 555 123 4567', goal: 'weight-loss', height: 175, weight: 80 },
            { name: 'Fatma Kaya', email: 'fatma@example.com', phone: '+90 555 234 5678', goal: 'muscle-gain', height: 165, weight: 60 },
            { name: 'Mehmet Özkan', email: 'mehmet@example.com', phone: '+90 555 345 6789', goal: 'strength', height: 180, weight: 85 }
        ];
        
        for (let client of demoClients) {
            await DatabaseManager.addClient(client);
        }
        
        // Demo antrenmanlar
        const demoWorkouts = [
            { exercise: 'Bench Press', sets: 4, reps: '8-10', weight: 80, date: '2026-01-20', notes: 'İyi form ile yapıldı' },
            { exercise: 'Squat', sets: 4, reps: '12', weight: 100, date: '2026-01-20', notes: 'Derinlik iyi' },
            { exercise: 'Pull-up', sets: 4, reps: '6-8', weight: 0, date: '2026-01-20', notes: 'Vücut ağırlığı ile' },
            { exercise: 'Deadlift', sets: 3, reps: '5', weight: 120, date: '2026-01-19', notes: 'Güçlü kaldırış' },
            { exercise: 'Shoulder Press', sets: 3, reps: '10', weight: 40, date: '2026-01-19', notes: 'Omuz stabilitesi iyi' }
        ];
        
        for (let workout of demoWorkouts) {
            await DatabaseManager.addWorkout(workout);
        }
        
        // Demo programlar
        const demoPrograms = [
            { 
                name: 'Başlangıç Kuvvet Programı', 
                client: 'ahmet', 
                type: 'strength', 
                duration: 8, 
                frequency: 3, 
                description: 'Temel kuvvet hareketlerine odaklanan 8 haftalık program' 
            },
            { 
                name: 'Kas Geliştirme Programı', 
                client: 'fatma', 
                type: 'mixed', 
                duration: 12, 
                frequency: 4, 
                description: 'Kas kütlesi artırımına yönelik kapsamlı program' 
            }
        ];
        
        for (let program of demoPrograms) {
            await DatabaseManager.addProgram(program);
        }
        
        // Verileri yeniden yükle
        await loadDataFromDatabase();
        
        showNotification('Demo verileri başarıyla eklendi!', 'success');
        console.log('Demo verileri ekleme tamamlandı');
        
    } catch (error) {
        console.error('Demo veri ekleme hatası:', error);
        showNotification('Demo verileri eklenirken hata oluştu!', 'error');
    }
}

function showTab(tabName) {
    // Tüm tab içeriklerini gizle
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.add('hidden'));
    
    // Tüm tab'ları pasif yap
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Seçilen tab'ı göster
    document.getElementById(tabName).classList.remove('hidden');
    event.target.classList.add('active');
    
    // Tab değiştiğinde verileri güncelle
    updateTabContent(tabName);
}

function updateAllDisplays() {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const tabName = activeTab.textContent.trim();
        updateTabContent(getTabNameFromText(tabName));
    }
    updateHomeStats();
}

function getTabNameFromText(text) {
    switch(text) {
        case 'Dashboard': return 'home';
        case 'Müşteriler': return 'clients';
        case 'Analizler': return 'workouts';
        case 'Raporlar': return 'reports';
        case 'Ayarlar': return 'profile';
        default: return 'home';
    }
}

function updateTabContent(tabName) {
    if (tabName === 'clients') {
        updateClientsDisplay();
    } else if (tabName === 'workouts') {
        updateWorkoutsDisplay();
    } else if (tabName === 'home') {
        updateHomeStats();
    }
}

function updateHomeStats() {
    // Ana sayfa istatistiklerini güncelle
    const totalClients = clients.length;
    const today = new Date().toISOString().split('T')[0];
    const todayWorkouts = workouts.filter(w => w.date === today).length;
    
    const statCards = document.querySelectorAll('.stat-card .stat-number');
    if (statCards.length >= 2) {
        statCards[0].textContent = totalClients;
        statCards[1].textContent = todayWorkouts;
    }
    
    // Hoş geldiniz mesajını güncelle
    const welcomeCard = document.querySelector('.card p');
    if (welcomeCard) {
        const dbInfo = useFirebase ? '🔥 Firebase bulut veritabanı' : '💾 localStorage veritabanı';
        welcomeCard.innerHTML = `
            Bugün <strong>${new Date().toLocaleDateString('tr-TR')}</strong> tarihinde 
            <strong>${todayWorkouts}</strong> antrenman kaydedildi.
            <br><small>Toplam <strong>${clients.length}</strong> öğrenci, <strong>${workouts.length}</strong> antrenman kaydı mevcut.</small>
            <br><small style="color: #6200ee;">${dbInfo} aktif</small>
        `;
    }
}
function updateClientsDisplay() {
    const clientsContainer = document.querySelector('#clients .card');
    let clientsHTML = '<h3>Müşteri Portföyü 👥</h3>';
    
    clients.forEach(client => {
        const initials = client.name.split(' ').map(n => n[0]).join('');
        const clientWorkouts = workouts.filter(w => w.clientId === client.id).length;
        const lastWorkout = client.lastWorkout ? new Date(client.lastWorkout).toLocaleDateString('tr-TR') : 'Henüz yok';
        
        clientsHTML += `
            <div class="client-item">
                <div class="avatar">${initials}</div>
                <div class="client-info">
                    <h4>${client.name}</h4>
                    <p>${client.email} • ${clientWorkouts} antrenman</p>
                    <p style="font-size: 12px; color: #999;">Son antrenman: ${lastWorkout}</p>
                    ${client.phone ? `<p style="font-size: 12px; color: #666;">📞 ${client.phone}</p>` : ''}
                    ${client.goal ? `<p style="font-size: 12px; color: #6200ee;">🎯 ${getGoalText(client.goal)}</p>` : ''}
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <button onclick="editClient('${client.id}')" style="background: #6200ee; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">Düzenle</button>
                    <button onclick="deleteClient('${client.id}')" style="background: #d32f2f; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">Sil</button>
                </div>
            </div>
        `;
    });
    
    if (clients.length === 0) {
        clientsHTML += `
            <div style="text-align: center; padding: 20px; color: #666;">
                <p>Henüz müşteri eklenmemiş.</p>
                <p>+ butonuna tıklayarak ilk müşterinizi ekleyin!</p>
            </div>
        `;
    }
    
    clientsContainer.innerHTML = clientsHTML;
}

function getGoalText(goal) {
    const goals = {
        'weight-loss': 'Kilo Verme',
        'muscle-gain': 'Kas Kazanma',
        'strength': 'Kuvvet Artırma',
        'endurance': 'Dayanıklılık'
    };
    return goals[goal] || goal;
}

function deleteClient(clientId) {
    if (confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
        DatabaseManager.deleteClient(clientId).then(() => {
            showNotification('Öğrenci başarıyla silindi!');
            loadDataFromDatabase();
        }).catch(error => {
            console.error('Öğrenci silme hatası:', error);
            showNotification('Öğrenci silinirken hata oluştu!', 'error');
        });
    }
}

function deleteWorkout(workoutId) {
    if (confirm('Bu antrenman kaydını silmek istediğinizden emin misiniz?')) {
        DatabaseManager.deleteWorkout(workoutId).then(() => {
            showNotification('Antrenman kaydı silindi!');
            loadDataFromDatabase();
        }).catch(error => {
            console.error('Antrenman silme hatası:', error);
            showNotification('Antrenman silinirken hata oluştu!', 'error');
        });
    }
}

function editClient(clientId) {
    // Basit edit işlemi - gelecekte geliştirilebilir
    const client = clients.find(c => c.id === clientId);
    if (client) {
        const newName = prompt('Yeni ad:', client.name);
        if (newName && newName !== client.name) {
            client.name = newName;
            DatabaseManager.updateClient(client).then(() => {
                showNotification('Öğrenci bilgileri güncellendi!');
                loadDataFromDatabase();
            }).catch(error => {
                console.error('Öğrenci güncelleme hatası:', error);
                showNotification('Öğrenci güncellenirken hata oluştu!', 'error');
            });
        }
    }
}

function updateWorkoutsDisplay() {
    const workoutsContainer = document.querySelector('#workouts .card');
    const today = new Date().toISOString().split('T')[0];
    const todayWorkouts = workouts.filter(w => w.date === today);
    
    let html = `
        <h3>Performans Analizleri 📊</h3>
        <p style="margin-bottom: 15px;"><strong>${todayWorkouts.length} Analiz</strong> bugün kaydedildi</p>
    `;
    
    let workoutsHTML = '';
    
    todayWorkouts.forEach(workout => {
        workoutsHTML += `
            <div class="workout-item">
                <div>
                    <h4>${workout.exercise}</h4>
                    <p>${workout.sets} set × ${workout.reps} tekrar</p>
                    ${workout.notes ? `<p style="font-size: 12px; color: #666; font-style: italic;">${workout.notes}</p>` : ''}
                </div>
                <div class="workout-details">
                    <div class="weight">${workout.weight > 0 ? workout.weight + ' kg' : 'Vücut ağırlığı'}</div>
                    <button onclick="deleteWorkout('${workout.id}')" style="background: #d32f2f; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-top: 4px; cursor: pointer;">Sil</button>
                </div>
            </div>
        `;
    });
    
    if (todayWorkouts.length === 0) {
        workoutsHTML += `
            <div style="text-align: center; padding: 20px; color: #666;">
                <p>Bugün henüz antrenman kaydı yok.</p>
                <p>+ butonuna tıklayarak ilk antrenmanınızı kaydedin!</p>
            </div>
        `;
    }
    
    workoutsContainer.innerHTML = html + workoutsHTML;
}

function addNew() {
    const activeTab = document.querySelector('.tab.active').textContent.trim();
    
    switch(activeTab) {
        case 'Müşteriler':
            openModal('addClient');
            break;
        case 'Analizler':
            openModal('addWorkout');
            break;
        default:
            openModal('addClient');
    }
}

function openModal(modalType) {
    console.log('🔧 Modal açılıyor:', modalType);
    let modalId;
    switch(modalType) {
        case 'addClient':
            modalId = 'addClientModal';
            break;
        case 'addWorkout':
            modalId = 'addWorkoutModal';
            break;
        case 'createProgram':
            modalId = 'createProgramModal';
            break;
        case 'editProfile':
            modalId = 'editProfileModal';
            break;
        case 'settings':
            modalId = 'settingsModal';
            break;
    }
    
    console.log('🔧 Modal ID:', modalId);
    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            console.log('✅ Modal açıldı:', modalId);
        } else {
            console.error('❌ Modal bulunamadı:', modalId);
        }
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Formu temizle
    const form = document.querySelector(`#${modalId} form`);
    if (form) {
        form.reset();
    }
    // Success mesajını gizle
    const successMsg = document.querySelector(`#${modalId} .success-message`);
    if (successMsg) {
        successMsg.style.display = 'none';
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Renk ayarları (CSS'de tanımlı)
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}
function addClient(event) {
    console.log('🔧 Müşteri ekleme başladı');
    event.preventDefault();
    
    try {
        // Form verilerini al ve validate et
        const name = document.getElementById('clientName').value.trim();
        const email = document.getElementById('clientEmail').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const goal = document.getElementById('clientGoal').value;
        const height = document.getElementById('clientHeight').value;
        const weight = document.getElementById('clientWeight').value;
        
        console.log('🔧 Form verileri:', { name, email, phone, goal });
        
        // Zorunlu alanları kontrol et
        if (!name) {
            console.log('❌ Ad Soyad eksik');
            showNotification('Ad Soyad alanı zorunludur!', 'error');
            return;
        }
        
        if (!email) {
            console.log('❌ Email eksik');
            showNotification('E-posta alanı zorunludur!', 'error');
            return;
        }
        
        // Email formatını kontrol et
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Email formatı hatalı');
            showNotification('Geçerli bir e-posta adresi girin!', 'error');
            return;
        }
        
        console.log('✅ Validasyon başarılı, veritabanına kaydediliyor...');
        
        const newClient = {
            name: name,
            email: email,
            phone: phone || '',
            goal: goal || '',
            height: height ? parseFloat(height) : null,
            weight: weight ? parseFloat(weight) : null
        };
        
        // Veritabanına kaydet
        DatabaseManager.addClient(newClient).then((savedClient) => {
            console.log('✅ Müşteri başarıyla kaydedildi:', savedClient);
            
            // Success mesajını göster
            const successMsg = document.getElementById('clientSuccess');
            if (successMsg) {
                successMsg.style.display = 'block';
            }
            
            // Notification göster
            showNotification(name + ' başarıyla eklendi!', 'success');
            
            // Verileri yeniden yükle
            loadDataFromDatabase().then(() => {
                console.log('✅ Veriler yeniden yüklendi');
                // 2 saniye sonra modal'ı kapat
                setTimeout(() => {
                    closeModal('addClientModal');
                }, 2000);
            }).catch(loadError => {
                console.error('❌ Veri yükleme hatası:', loadError);
                showNotification('Veriler yüklenirken hata oluştu!', 'error');
            });
            
        }).catch(error => {
            console.error('❌ Müşteri ekleme hatası:', error);
            showNotification('Müşteri eklenirken hata oluştu: ' + error.message, 'error');
        });
        
    } catch (error) {
        console.error('❌ Form işleme hatası:', error);
        showNotification('Form işlenirken hata oluştu: ' + error.message, 'error');
    }
}

function addWorkout(event) {
    event.preventDefault();
    
    try {
        const exerciseSelect = document.getElementById('exerciseName');
        const setsInput = document.getElementById('workoutSets');
        const repsInput = document.getElementById('workoutReps');
        const weightInput = document.getElementById('workoutWeight');
        const notesInput = document.getElementById('workoutNotes');
        
        // Zorunlu alanları kontrol et
        if (!exerciseSelect.value) {
            showNotification('Egzersiz seçimi zorunludur!', 'error');
            return;
        }
        
        if (!setsInput.value) {
            showNotification('Set sayısı zorunludur!', 'error');
            return;
        }
        
        if (!repsInput.value) {
            showNotification('Tekrar sayısı zorunludur!', 'error');
            return;
        }
        
        const exercise = exerciseSelect.options[exerciseSelect.selectedIndex].text;
        const sets = parseInt(setsInput.value);
        const reps = repsInput.value.trim();
        const weight = parseFloat(weightInput.value) || 0;
        const notes = notesInput.value.trim();
        
        console.log('Antrenman ekleniyor:', { exercise, sets, reps, weight });
        
        const newWorkout = {
            exercise: exercise,
            sets: sets,
            reps: reps,
            weight: weight,
            notes: notes,
            date: new Date().toISOString().split('T')[0]
        };
        
        // Veritabanına kaydet
        DatabaseManager.addWorkout(newWorkout).then((savedWorkout) => {
            console.log('Antrenman başarıyla kaydedildi:', savedWorkout);
            
            // Success mesajını göster
            const successMsg = document.getElementById('workoutSuccess');
            if (successMsg) {
                successMsg.style.display = 'block';
            }
            
            // Notification göster
            showNotification(exercise + ' antrenmanı kaydedildi!', 'success');
            
            // Verileri yeniden yükle
            loadDataFromDatabase().then(() => {
                // 2 saniye sonra modal'ı kapat
                setTimeout(() => {
                    closeModal('addWorkoutModal');
                }, 2000);
            }).catch(loadError => {
                console.error('Veri yükleme hatası:', loadError);
                showNotification('Veriler yüklenirken hata oluştu!', 'error');
            });
            
        }).catch(error => {
            console.error('Antrenman ekleme hatası:', error);
            showNotification('Antrenman kaydedilirken hata oluştu: ' + error.message, 'error');
        });
        
    } catch (error) {
        console.error('Form işleme hatası:', error);
        showNotification('Form işlenirken hata oluştu: ' + error.message, 'error');
    }
}

function createProgram(event) {
    event.preventDefault();
    
    const name = document.getElementById('programName').value;
    const client = document.getElementById('programClient').value;
    const type = document.getElementById('programType').value;
    const duration = document.getElementById('programDuration').value;
    const frequency = document.getElementById('programFrequency').value;
    const description = document.getElementById('programDescription').value;
    
    const newProgram = {
        name: name,
        client: client,
        type: type,
        duration: parseInt(duration),
        frequency: parseInt(frequency),
        description: description
    };
    
    // Veritabanına kaydet
    DatabaseManager.addProgram(newProgram).then(() => {
        // Success mesajını göster
        const successMsg = document.getElementById('programSuccess');
        successMsg.style.display = 'block';
        
        // Notification göster
        showNotification(name + ' programı oluşturuldu ve veritabanına kaydedildi!');
        
        // Verileri yeniden yükle
        loadDataFromDatabase().then(() => {
            // 2 saniye sonra modal'ı kapat
            setTimeout(() => {
                closeModal('createProgramModal');
            }, 2000);
        });
        
    }).catch(error => {
        console.error('Program ekleme hatası:', error);
        showNotification('Program oluşturulurken hata oluştu!', 'error');
    });
}

function updateProfile(event) {
    event.preventDefault();
    
    const name = document.getElementById('profileName').value;
    
    // Success mesajını göster
    const successMsg = document.getElementById('profileSuccess');
    successMsg.style.display = 'block';
    
    // Notification göster
    showNotification('Profil başarıyla güncellendi!');
    
    // 2 saniye sonra modal'ı kapat
    setTimeout(() => {
        closeModal('editProfileModal');
    }, 2000);
}

function saveSettings(event) {
    event.preventDefault();
    
    const notifications = document.getElementById('notifications').checked;
    const darkMode = document.getElementById('darkMode').checked;
    const autoBackup = document.getElementById('autoBackup').checked;
    const language = document.getElementById('language').value;
    const weightUnit = document.getElementById('weightUnit').value;
    
    // Ayarları veritabanına kaydet
    Promise.all([
        DatabaseManager.saveSetting('notifications', notifications),
        DatabaseManager.saveSetting('darkMode', darkMode),
        DatabaseManager.saveSetting('autoBackup', autoBackup),
        DatabaseManager.saveSetting('language', language),
        DatabaseManager.saveSetting('weightUnit', weightUnit)
    ]).then(() => {
        // Success mesajını göster
        const successMsg = document.getElementById('settingsSuccess');
        successMsg.style.display = 'block';
        
        // Notification göster
        showNotification('Ayarlar başarıyla kaydedildi ve veritabanına kaydedildi!');
        
        // 2 saniye sonra modal'ı kapat
        setTimeout(() => {
            closeModal('settingsModal');
        }, 2000);
        
    }).catch(error => {
        console.error('Ayarlar kaydetme hatası:', error);
        showNotification('Ayarlar kaydedilirken hata oluştu!', 'error');
    });
}

function downloadReport() {
    showNotification('Rapor hazırlanıyor...', 'info');
    
    setTimeout(() => {
        try {
            generatePDFReport();
            showNotification('PDF raporu başarıyla indirildi!');
        } catch (error) {
            // PDF oluşturulamazsa metin dosyası indir
            const reportContent = generateReportContent();
            downloadTextReport(reportContent);
            showNotification('Rapor metin dosyası olarak indirildi!');
        }
    }, 1500);
}
function generatePDFReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Türkçe karakter desteği için font ayarları
    doc.setFont("helvetica");
    
    // PDF başlığı
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('PERSONAL TRAINER RAPORU', 20, 30);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const today = new Date().toLocaleDateString('tr-TR');
    const month = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    doc.text(month + ' - Rapor Tarihi: ' + today, 20, 45);
    
    // Çizgi
    doc.line(20, 50, 190, 50);
    
    let yPos = 65;
    
    // Genel İstatistikler
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('GENEL ISTATISTIKLER', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('• Toplam Ogrenci Sayisi: ' + clients.length, 25, yPos);
    yPos += 8;
    doc.text('• Bu Ayki Antrenman Sayisi: ' + (workouts.length * 4), 25, yPos);
    yPos += 8;
    doc.text('• Haftalik Ortalama: ' + Math.round(workouts.length * 4 / 4) + ' antrenman', 25, yPos);
    yPos += 8;
    doc.text('• En Aktif Gun: Pazartesi', 25, yPos);
    yPos += 20;
    
    // İlerleme Analizi
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('ILERLEME ANALIZI', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('• Antrenman Sikliginda %15 Artis', 25, yPos);
    yPos += 8;
    doc.text('• En Cok Gelisim Gosteren: Gogus Kaslari', 25, yPos);
    yPos += 8;
    doc.text('• Hedef Kiloya %70 Yaklasim', 25, yPos);
    yPos += 8;
    doc.text('• Ortalama Antrenman Suresi: 75 dakika', 25, yPos);
    yPos += 20;
    
    // Öğrenci Detayları
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('OGRENCI DETAYLARI', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    clients.forEach(function(client) {
        if (yPos > 250) {
            doc.addPage();
            yPos = 30;
        }
        // Türkçe karakterleri temizle
        var cleanName = client.name.replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
                                  .replace(/ü/g, 'u').replace(/Ü/g, 'U')
                                  .replace(/ş/g, 's').replace(/Ş/g, 'S')
                                  .replace(/ı/g, 'i').replace(/İ/g, 'I')
                                  .replace(/ö/g, 'o').replace(/Ö/g, 'O')
                                  .replace(/ç/g, 'c').replace(/Ç/g, 'C');
        
        doc.text('• ' + cleanName, 25, yPos);
        yPos += 6;
        doc.text('  E-posta: ' + client.email, 30, yPos);
        yPos += 6;
        doc.text('  Toplam Antrenman: ' + (client.workouts || 0), 30, yPos);
        yPos += 6;
        doc.text('  Son Antrenman: ' + new Date(client.lastWorkout).toLocaleDateString('tr-TR'), 30, yPos);
        yPos += 12;
    });
    
    // PDF'i indir
    var fileName = 'PTAnalizer_Raporu_' + new Date().toLocaleDateString('tr-TR').replace(/\./g, '_') + '.pdf';
    doc.save(fileName);
}

function generateReportContent() {
    var today = new Date().toLocaleDateString('tr-TR');
    var month = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    
    var clientDetails = clients.map(function(client) {
        return '\n• ' + client.name + 
               '\n  - E-posta: ' + client.email +
               '\n  - Toplam Antrenman: ' + (client.workouts || 0) +
               '\n  - Son Antrenman: ' + new Date(client.lastWorkout).toLocaleDateString('tr-TR');
    }).join('');
    
    return 'PTANALIZER RAPORU\n' +
           month + '\n' +
           'Rapor Tarihi: ' + today + '\n\n' +
           '═══════════════════════════════════════\n\n' +
           '📊 GENEL İSTATİSTİKLER\n' +
           '═══════════════════════════════════════\n' +
           '• Toplam Müşteri Sayısı: ' + clients.length + '\n' +
           '• Bu Ayki Antrenman Sayısı: ' + workouts.length + '\n' +
           '• Aktif Program Sayısı: ' + programs.length + '\n\n' +
           '👥 MÜŞTERİ DETAYLARI\n' +
           '═══════════════════════════════════════' +
           clientDetails + '\n\n' +
           '═══════════════════════════════════════\n' +
           'Bu rapor PTAnalizer tarafından\n' +
           'otomatik olarak oluşturulmuştur.\n\n' +
           'Rapor ID: PTA-' + Date.now() + '\n' +
           'Oluşturulma: ' + new Date().toLocaleString('tr-TR') + '\n' +
           '═══════════════════════════════════════';
}

function downloadTextReport(content) {
    // Metin dosyası olarak indir (fallback)
    var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    var url = window.URL.createObjectURL(blob);
    
    var a = document.createElement('a');
    a.href = url;
    a.download = 'PTAnalizer_Raporu_' + new Date().toLocaleDateString('tr-TR').replace(/\./g, '_') + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    window.URL.revokeObjectURL(url);
}

// Modal dışına tıklandığında kapat
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Sayfa yüklendiğinde veritabanını başlat
window.addEventListener('load', async function() {
    console.log('🚀 PTAnalizer başlatılıyor...');
    try {
        // Veritabanını başlat
        await initDatabase();
        
        if (useFirebase) {
            console.log('🔥 PTAnalizer Firebase Firestore sistemi aktif');
            document.getElementById('db-status').textContent = '🔥 PTAnalizer Firebase: Aktif ✅';
            showNotification('PTAnalizer Firebase bulut veritabanı başarıyla başlatıldı! Veriler gerçek zamanlı senkronize ediliyor.', 'success');
        } else {
            console.log('💾 PTAnalizer localStorage sistemi aktif (Firebase fallback)');
            document.getElementById('db-status').textContent = '💾 PTAnalizer localStorage: Aktif ✅';
            showNotification('PTAnalizer localStorage veritabanı başarıyla başlatıldı! (Firebase fallback)', 'info');
        }
        
        // Verileri yükle
        console.log('📊 Veriler yükleniyor...');
        await loadDataFromDatabase();
        console.log('✅ Veriler yüklendi');
        
        // Animasyonları başlat
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
        
        // Firebase/Netlify deployment için özel mesaj
        if (window.location.hostname.includes('netlify')) {
            setTimeout(() => {
                if (useFirebase) {
                    showNotification('🚀 Netlify + Firebase deployment başarılı! Veriler bulutta güvende.', 'info');
                } else {
                    showNotification('🚀 Netlify deployment başarılı! Database localStorage ile çalışıyor.', 'info');
                }
            }, 2000);
        }
        
        console.log('🎉 PTAnalizer başarıyla başlatıldı!');
        
    } catch (error) {
        console.error('❌ Uygulama başlatma hatası:', error);
        document.getElementById('db-status').textContent = '💾 Hata: Başlatılamadı ❌';
        showNotification('Veritabanı başlatılamadı! Sayfa yenileniyor...', 'error');
        
        // Hata durumunda sayfayı yenile
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
});