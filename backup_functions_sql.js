// تحميل قائمة النسخ الاحتياطية
function loadBackupFiles() {
    const backupSelect = document.getElementById('backup_files');
    if (!backupSelect) return;

    const backups = [];
    const prefix = DB.getDBPrefix();

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix + 'backup_')) {
            backups.push({
                key: key,
                date: key.replace(prefix + 'backup_', '')
            });
        }
    }

    backups.sort((a, b) => new Date(b.date) - new Date(a.date));

    backupSelect.innerHTML = '<option value="">اختر نسخة احتياطية</option>';
    backups.forEach(backup => {
        const option = document.createElement('option');
        option.value = backup.key;
        option.textContent = backup.date;
        backupSelect.appendChild(option);
    });

    if (backups.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '🚫 لا توجد نسخ احتياطية';
        option.disabled = true;
        backupSelect.appendChild(option);
    }
}

// استرداد نسخة احتياطية
function restoreBackup() {
    const backupSelect = document.getElementById('backup_files');
    const externalBackup = document.getElementById('external_backup');

    if (!backupSelect || !externalBackup) return;

    let backupKey = backupSelect.value;

    // إضافة مستمع للاسترداد التلقائي عند اختيار ملف
    externalBackup.addEventListener('change', function() {
        if (this.files.length > 0) {
            restoreBackup();
        }
    });

    // إضافة مستمع للاسترداد التلقائي عند اختيار نسخة من القائمة
    backupSelect.addEventListener('change', function() {
        if (this.value) {
            restoreBackup();
        }
    });

    if (externalBackup.files.length > 0) {
        const file = externalBackup.files[0];
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.db')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const arrayBuffer = e.target.result;
                    const uint8Array = new Uint8Array(arrayBuffer);

                    if (typeof window.SqlJs === 'undefined') {
                        loadSqlJsAndRestore(uint8Array);
                    } else {
                        // عرض التفاصيل قبل الاسترداد
                        showBackupDetailsFromDb(uint8Array);
                    }
                } catch (error) {
                    console.error('Error reading file:', error);
                }
            };
            reader.readAsArrayBuffer(file);
            return;
        } else {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const backupData = JSON.parse(e.target.result);

                    const prefix = DB.getDBPrefix();
                    Object.keys(backupData).forEach(key => {
                        localStorage.setItem(prefix + key, JSON.stringify(backupData[key]));
                    });

                    setTimeout(() => location.reload(), 500);
                } catch (error) {
                }
            };
            reader.readAsText(file);
            return;
        }
    }

    if (!backupKey) {
        return;
    }

    try {
        const backupData = JSON.parse(localStorage.getItem(backupKey));
        const prefix = DB.getDBPrefix();

        Object.keys(backupData).forEach(key => {
            localStorage.setItem(prefix + key, JSON.stringify(backupData[key]));
        });

        setTimeout(() => location.reload(), 500);
    } catch (error) {
    }
}

function loadSqlJsAndRestore(uint8Array) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
    script.onload = function() {
        toast('⏳ جاري تحميل ملف WASM...', 'info');
        fetch('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm')
            .then(response => response.arrayBuffer())
            .then(wasmBuffer => {
                window.SqlJs.wasmBinary = wasmBuffer;
                restoreFromDb(uint8Array);
            })
            .catch(error => {
                console.error('Error loading WASM:', error);
            });
    };
    document.head.appendChild(script);
}

function restoreFromDb(uint8Array) {
    try {
        const db = new window.SqlJs.Database(uint8Array);

        const backupData = {
            users: [],
            products: [],
            sales: [],
            expenses: [],
            maintenance: [],
            purchases: [],
            suppliers: [],
            settings: {}
        };

        const tables = ['users', 'products', 'sales', 'expenses', 'maintenance', 'purchases', 'suppliers'];
        tables.forEach(table => {
            try {
                const stmt = db.exec(`SELECT * FROM ${table}`);
                if (stmt.length > 0) {
                    const columns = stmt[0].columns;
                    const values = stmt[0].values;
                    backupData[table] = values.map(row => {
                        const obj = {};
                        columns.forEach((col, i) => {
                            obj[col] = row[i];
                        });
                        return obj;
                    });
                } else {
                    backupData[table] = [];
                }
            } catch (err) {
                console.error(`Error reading table ${table}:`, err);
                backupData[table] = [];
            }
        });

        const prefix = DB.getDBPrefix();
        Object.keys(backupData).forEach(key => {
            localStorage.setItem(prefix + key, JSON.stringify(backupData[key]));
        });

        setTimeout(() => location.reload(), 500);
    } catch (error) {
        console.error('Error restoring from DB:', error);
    }
}

function createBackup() {
    const prefix = DB.getDBPrefix();
    const backupData = {};
    const backupKey = prefix + 'backup_' + new Date().toISOString();

    const keys = ['users', 'products', 'sales', 'expenses', 'maintenance', 'purchases', 'suppliers', 'settings'];
    keys.forEach(key => {
        const defaultValue = key === 'settings' ? '{}' : '[]';
        backupData[key] = JSON.parse(localStorage.getItem(prefix + key) || defaultValue);
    });

    localStorage.setItem(backupKey, JSON.stringify(backupData));

    loadBackupFiles();
}

// حفظ نسخة احتياطية في مجلد محدد
function saveBackupToFolder() {
    const folderInput = document.getElementById('save_backup_folder');
    const nameInput = document.getElementById('backup_name');
    
    if (!folderInput.files || folderInput.files.length === 0) {
        alert('يرجى اختيار مجلد لحفظ النسخة الاحتياطية');
        return;
    }
    
    // إنشاء النسخة الاحتياطية
    const prefix = DB.getDBPrefix();
    const backupData = {};
    
    const keys = ['users', 'products', 'sales', 'expenses', 'maintenance', 'purchases', 'suppliers', 'settings'];
    keys.forEach(key => {
        const defaultValue = key === 'settings' ? '{}' : '[]';
        backupData[key] = JSON.parse(localStorage.getItem(prefix + key) || defaultValue);
    });
    
    // إنشاء اسم الملف
    const now = new Date();
    const timestamp = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
    
    const fileName = nameInput.value || `نسخة_احتياطية_${timestamp}`;
    const jsonFileName = `${fileName}.json`;
    
    // تحويل البيانات إلى JSON
    const jsonContent = JSON.stringify(backupData, null, 2);
    
    // إنشاء Blob وتحميل الملف
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = jsonFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // حفظ المجلد في الإعدادات
    const settings = JSON.parse(localStorage.getItem(prefix + 'settings') || '{}');
    settings.backup_folder = folderInput.files[0].webkitRelativePath.split('/')[0];
    localStorage.setItem(prefix + 'settings', JSON.stringify(settings));
    
    cmo();
}
