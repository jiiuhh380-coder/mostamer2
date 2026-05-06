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

    if (externalBackup.files.length > 0) {
        const file = externalBackup.files[0];
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.db')) {
            if (!confirm('⚠️ تأكيد الاسترداد\n\nهل أنت متأكد من استرداد نسخة قاعدة البيانات من تطبيق سطح المكتب؟\n\n⚠️ تحذير: هذه العملية ستستبدل جميع البيانات الحالية!')) {
                return;
            }

            toast('⏳ جاري قراءة ملف قاعدة البيانات...', 'info');

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const arrayBuffer = e.target.result;
                    const uint8Array = new Uint8Array(arrayBuffer);

                    if (typeof window.SqlJs === 'undefined') {
                        toast('⏳ جاري تحميل مكتبة SQL...', 'info');
                        loadSqlJsAndRestore(uint8Array);
                    } else {
                        restoreFromDb(uint8Array);
                    }
                } catch (error) {
                    console.error('Error reading file:', error);
                    toast('❌ خطأ في قراءة الملف: ' + error.message, 'error');
                }
            };
            reader.readAsArrayBuffer(file);
            return;
        } else {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const backupData = JSON.parse(e.target.result);

                    if (!confirm('⚠️ تأكيد الاسترداد\n\nهل أنت متأكد من استرداد النسخة الاحتياطية؟\n\n⚠️ تحذير: هذه العملية ستستبدل قاعدة البيانات الحالية بجميع بياناتها!')) {
                        return;
                    }

                    const prefix = DB.getDBPrefix();
                    Object.keys(backupData).forEach(key => {
                        localStorage.setItem(prefix + key, JSON.stringify(backupData[key]));
                    });

                    toast('✅ تم استرداد النسخة الاحتياطية بنجاح');
                    setTimeout(() => location.reload(), 1500);
                } catch (error) {
                    toast('❌ خطأ في قراءة الملف: ' + error.message, 'error');
                }
            };
            reader.readAsText(file);
            return;
        }
    }

    if (!backupKey) {
        toast('⚠️ يرجى اختيار نسخة احتياطية للاسترداد', 'error');
        return;
    }

    if (!confirm('⚠️ تأكيد الاسترداد\n\nهل أنت متأكد من استرداد النسخة الاحتياطية؟\n\n⚠️ تحذير: هذه العملية ستستبدل قاعدة البيانات الحالية بجميع بياناتها!')) {
        return;
    }

    try {
        const backupData = JSON.parse(localStorage.getItem(backupKey));
        const prefix = DB.getDBPrefix();

        Object.keys(backupData).forEach(key => {
            localStorage.setItem(prefix + key, JSON.stringify(backupData[key]));
        });

        toast('✅ تم استرداد النسخة الاحتياطية بنجاح');
        setTimeout(() => location.reload(), 1500);
    } catch (error) {
        toast('❌ خطأ في استرداد النسخة الاحتياطية: ' + error.message, 'error');
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
                toast('❌ خطأ في تحميل ملف WASM: ' + error.message, 'error');
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

        if (!confirm('⚠️ تأكيد الاسترداد\n\nهل أنت متأكد من استرداد النسخة الاحتياطية؟\n\n⚠️ تحذير: هذه العملية ستستبدل قاعدة البيانات الحالية بجميع بياناتها!')) {
            return;
        }

        const prefix = DB.getDBPrefix();
        Object.keys(backupData).forEach(key => {
            localStorage.setItem(prefix + key, JSON.stringify(backupData[key]));
        });

        toast('✅ تم استرداد النسخة الاحتياطية بنجاح');
        setTimeout(() => location.reload(), 1500);
    } catch (error) {
        console.error('Error restoring from DB:', error);
        toast('❌ خطأ في قراءة ملف قاعدة البيانات: ' + error.message, 'error');
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

    toast('✅ تم إنشاء نسخة احتياطية بنجاح');
    loadBackupFiles();
}
