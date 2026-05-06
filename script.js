// ============================================
// قاعدة البيانات المحلية (LocalStorage)
// ============================================
const DB = {
    // الحصول على بادئة قاعدة البيانات للحساب الحالي
    getDBPrefix() {
        const currentAccount = localStorage.getItem('current_account') || 'default';
        return `mostamer_${currentAccount}_`;
    },

    // الحصول على مفتاح قاعدة البيانات
    getDBKey(key) {
        return this.getDBPrefix() + key;
    },

    // تهيئة قاعدة البيانات
    init() {
        if (!localStorage.getItem('mostamer_accounts_initialized')) {
            this.initAccounts();
            localStorage.setItem('mostamer_accounts_initialized', 'true');
        }

        // تهيئة بيانات الحساب الحالي إذا لم تكن موجودة
        const prefix = this.getDBPrefix();
        if (!localStorage.getItem(prefix + 'initialized')) {
            this.initUsers();
            this.initProducts();
            this.initSales();
            this.initExpenses();
            this.initSettings();
            this.initMaintenance();
            this.initPurchases();
            this.initSuppliers();
            localStorage.setItem(prefix + 'initialized', 'true');
        }
    },

    // إدارة الحسابات
    initAccounts() {
        // إنشاء حساب افتراضي
        const accounts = [
            { id: 'default', name: 'الحساب الافتراضي', created_at: new Date().toISOString() }
        ];
        localStorage.setItem('mostamer_accounts', JSON.stringify(accounts));
        localStorage.setItem('current_account', 'default');
    },

    get accounts() {
        return JSON.parse(localStorage.getItem('mostamer_accounts') || '[]');
    },

    saveProducts() {
        const products = JSON.parse(localStorage.getItem(this.getDBKey('products')) || '[]');
        localStorage.setItem(this.getDBKey('products'), JSON.stringify(products));
    },

    saveSales() {
        const sales = JSON.parse(localStorage.getItem(this.getDBKey('sales')) || '[]');
        localStorage.setItem(this.getDBKey('sales'), JSON.stringify(sales));
    },

    savePurchases() {
        const purchases = JSON.parse(localStorage.getItem(this.getDBKey('purchases')) || '[]');
        localStorage.setItem(this.getDBKey('purchases'), JSON.stringify(purchases));
    },

    savePayments() {
        const payments = JSON.parse(localStorage.getItem(this.getDBKey('payments')) || '[]');
        localStorage.setItem(this.getDBKey('payments'), JSON.stringify(payments));
    },

    saveAccount(account) {
        const accounts = this.accounts;
        if (account.id) {
            const index = accounts.findIndex(a => a.id === account.id);
            if (index !== -1) accounts[index] = account;
        } else {
            account.id = 'acc_' + Date.now();
            account.created_at = new Date().toISOString();
            accounts.push(account);
        }
        localStorage.setItem('mostamer_accounts', JSON.stringify(accounts));
        return account;
    },

    deleteAccount(accountId) {
        if (accountId === 'default') {
            toast('لا يمكن حذف الحساب الافتراضي', 'error');
            return false;
        }

        // حذف جميع البيانات المرتبطة بالحساب
        const prefix = `mostamer_${accountId}_`;
        const keysToDelete = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => localStorage.removeItem(key));

        // حذف الحساب من القائمة
        const accounts = this.accounts.filter(a => a.id !== accountId);
        localStorage.setItem('mostamer_accounts', JSON.stringify(accounts));

        return true;
    },

    switchAccount(accountId) {
        const account = this.accounts.find(a => a.id === accountId);
        if (account) {
            localStorage.setItem('current_account', accountId);
            // إعادة تهيئة قاعدة البيانات للحساب الجديد
            this.init();
            return true;
        }
        return false;
    },

    getCurrentAccount() {
        const accountId = localStorage.getItem('current_account') || 'default';
        const accounts = JSON.parse(localStorage.getItem('mostamer_accounts') || '[{"id":"default","name":"الحساب الافتراضي"}]');
        return accounts.find(a => a.id === accountId);
    },

    // المستخدمين
    initUsers() {
        const users = [
            { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'المدير' }
        ];
        localStorage.setItem(this.getDBKey('users'), JSON.stringify(users));
    },

    get users() {
        return JSON.parse(localStorage.getItem(this.getDBKey('users')) || '[]');
    },

    saveUser(user) {
        const users = this.users;
        if (user.id) {
            const index = users.findIndex(u => u.id === user.id);
            if (index !== -1) users[index] = user;
        } else {
            user.id = Date.now();
            users.push(user);
        }
        localStorage.setItem(this.getDBKey('users'), JSON.stringify(users));
        return user;
    },

    deleteUser(id) {
        const users = this.users.filter(u => u.id !== id);
        localStorage.setItem(this.getDBKey('users'), JSON.stringify(users));
    },

    // المنتجات
    initProducts() {
        const products = [
            { id: 1, name: 'iPhone 15 Pro', brand: 'Apple', model: 'A1234', category: 'موبايلات', cost_price: 3500, selling_price: 4200, quantity: 10, min_stock: 5, barcode: '1234567890123', condition: 'جديد' },
            { id: 2, name: 'Samsung S24', brand: 'Samsung', model: 'S24', category: 'موبايلات', cost_price: 3000, selling_price: 3800, quantity: 8, min_stock: 5, barcode: '1234567890124', condition: 'جديد' },
            { id: 3, name: 'شاحن سريع', brand: 'Generic', model: 'QC3.0', category: 'ملحقات', cost_price: 50, selling_price: 100, quantity: 20, min_stock: 10, barcode: '1234567890125', condition: '-' }
        ];
        localStorage.setItem(this.getDBKey('products'), JSON.stringify(products));
    },

    get products() {
        return JSON.parse(localStorage.getItem(this.getDBKey('products')) || '[]');
    },

    saveProduct(product) {
        const products = this.products;
        if (product.id) {
            const index = products.findIndex(p => p.id === product.id);
            if (index !== -1) products[index] = product;
        } else {
            product.id = Date.now();
            products.push(product);
        }
        localStorage.setItem(this.getDBKey('products'), JSON.stringify(products));
        return product;
    },

    deleteProduct(id) {
        const products = this.products.filter(p => p.id !== id);
        localStorage.setItem(this.getDBKey('products'), JSON.stringify(products));
    },

    // المبيعات
    initSales() {
        localStorage.setItem(this.getDBKey('sales'), JSON.stringify([]));
    },

    get sales() {
        return JSON.parse(localStorage.getItem(this.getDBKey('sales')) || '[]');
    },

    saveSale(sale) {
        const sales = this.sales;
        const index = sales.findIndex(s => s.id === sale.id);
        if (index !== -1) {
            sales[index] = sale;
            localStorage.setItem(this.getDBKey('sales'), JSON.stringify(sales));
            return sale;
        }
        sale.id = Date.now();
        sale.invoice_number = this.generateInvoiceNumber();
        sale.sale_date = new Date().toISOString().split('T')[0];
        sale.sale_time = new Date().toLocaleTimeString('ar-SA');
        sales.push(sale);
        localStorage.setItem(this.getDBKey('sales'), JSON.stringify(sales));
        return sale;
    },

    updateSale(sale) {
        const sales = this.sales;
        const index = sales.findIndex(s => s.id === sale.id);
        if (index !== -1) {
            sales[index] = sale;
            localStorage.setItem(this.getDBKey('sales'), JSON.stringify(sales));
            return sale;
        }
        return null;
    },

    generateInvoiceNumber() {
        const prefix = 'INV';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    },

    deleteSale(id) {
        const sales = this.sales.filter(s => s.id !== id);
        localStorage.setItem(this.getDBKey('sales'), JSON.stringify(sales));
    },

    clearSales() {
        localStorage.setItem(this.getDBKey('sales'), JSON.stringify([]));
    },

    // المصاريف
    initExpenses() {
        localStorage.setItem(this.getDBKey('expenses'), JSON.stringify([]));
    },

    get expenses() {
        return JSON.parse(localStorage.getItem(this.getDBKey('expenses')) || '[]');
    },

    saveExpense(expense) {
        const expenses = this.expenses;
        expense.id = Date.now();
        expense.date = new Date().toISOString().split('T')[0];
        expenses.push(expense);
        localStorage.setItem(this.getDBKey('expenses'), JSON.stringify(expenses));
        return expense;
    },

    deleteExpense(id) {
        const expenses = this.expenses.filter(e => e.id !== id);
        localStorage.setItem(this.getDBKey('expenses'), JSON.stringify(expenses));
    },

    // الإعدادات
    initSettings() {
        const settings = {
            companyName: 'المستمر للمحاسبة',
            currency: 'د.أ',
            language: 'ar',
            theme: 'dark'
        };
        localStorage.setItem(this.getDBKey('settings'), JSON.stringify(settings));
    },

    get settings() {
        return JSON.parse(localStorage.getItem(this.getDBKey('settings')) || '{}');
    },

    saveSettings(settings) {
        localStorage.setItem(this.getDBKey('settings'), JSON.stringify(settings));
    },

    // الصيانة
    initMaintenance() {
        localStorage.setItem(this.getDBKey('maintenance'), JSON.stringify([]));
    },

    get maintenance() {
        return JSON.parse(localStorage.getItem(this.getDBKey('maintenance')) || '[]');
    },

    saveMaintenance(item) {
        const items = this.maintenance;
        if (item.id) {
            const index = items.findIndex(i => i.id === item.id);
            if (index !== -1) items[index] = item;
        } else {
            item.id = Date.now();
            item.received_date = new Date().toISOString().split('T')[0];
            item.received_time = new Date().toTimeString().slice(0, 5);
            item.status = item.status || 'قيد الإصلاح';
            items.push(item);
        }
        localStorage.setItem(this.getDBKey('maintenance'), JSON.stringify(items));
        return item;
    },

    deleteMaintenance(id) {
        const items = this.maintenance.filter(i => i.id !== id);
        localStorage.setItem(this.getDBKey('maintenance'), JSON.stringify(items));
    },

    clearMaintenance() {
        localStorage.setItem(this.getDBKey('maintenance'), JSON.stringify([]));
    },

    // المشتريات
    initPurchases() {
        localStorage.setItem(this.getDBKey('purchases'), JSON.stringify([]));
    },

    get purchases() {
        const purchases = localStorage.getItem(this.getDBKey('purchases'));
        return purchases ? JSON.parse(purchases) : [];
    },

    savePurchase(purchase) {
        const purchases = this.purchases;
        // التأكد من أن الفاتورة جديدة (بدون id)
        if (purchase.id === undefined || purchase.id === null) {
            purchase.id = Date.now();
            purchase.invoice_number = this.generatePurchaseInvoiceNumber();
            purchase.purchase_date = new Date().toISOString().split('T')[0];
            purchases.push(purchase);
        } else {
            const index = purchases.findIndex(p => p.id === purchase.id);
            if (index !== -1) purchases[index] = purchase;
        }
        localStorage.setItem(this.getDBKey('purchases'), JSON.stringify(purchases));
        return purchase;
    },

    deletePurchase(id) {
        const purchases = this.purchases.filter(p => p.id !== id);
        localStorage.setItem(this.getDBKey('purchases'), JSON.stringify(purchases));
    },

    clearPurchases() {
        localStorage.setItem(this.getDBKey('purchases'), JSON.stringify([]));
    },

    generatePurchaseInvoiceNumber() {
        const prefix = 'PUR';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    },

    // الموردين
    initSuppliers() {
        localStorage.setItem(this.getDBKey('suppliers'), JSON.stringify([]));
    },

    get suppliers() {
        return JSON.parse(localStorage.getItem(this.getDBKey('suppliers')) || '[]');
    },

    saveSupplier(supplier) {
        const suppliers = this.suppliers;
        if (supplier.id) {
            const index = suppliers.findIndex(s => s.id === supplier.id);
            if (index !== -1) suppliers[index] = supplier;
        } else {
            supplier.id = Date.now();
            suppliers.push(supplier);
        }
        localStorage.setItem(this.getDBKey('suppliers'), JSON.stringify(suppliers));
        return supplier;
    },

    deleteSupplier(id) {
        const suppliers = this.suppliers.filter(s => s.id !== id);
        localStorage.setItem(this.getDBKey('suppliers'), JSON.stringify(suppliers));
    },

    // إدارة الصيانة
    saveMaintenance() {
        localStorage.setItem(this.getDBKey('maintenance'), JSON.stringify(this.maintenance));
    },

    loadMaintenance() {
        const data = localStorage.getItem(this.getDBKey('maintenance'));
        if (data) {
            this.maintenance = JSON.parse(data);
        } else {
            this.maintenance = [];
        }
    }
};

// ============================================
// إدارة الجلسة
// ============================================
const Auth = {
    currentUser: null,

    login(username, password) {
        const user = DB.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            // حفظ المستخدم مع معرف الحساب الحالي
            const currentAccount = DB.getCurrentAccount();
            localStorage.setItem('currentUser', JSON.stringify({
                ...user,
                account_id: currentAccount.id
            }));
            return true;
        }
        return false;
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    },

    checkSession() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user !== null) {
            // التحقق من أن المستخدم ينتمي للحساب الحالي
            const currentAccount = DB.getCurrentAccount();
            if (user.account_id === currentAccount.id) {
                this.currentUser = user;
                return true;
            }
            // إذا لم يكن المستخدم ينتمي للحساب الحالي، قم بتسجيل الخروج
            this.logout();
        }
        return false;
    }
};

// ============================================
// دوال مساعدة
// ============================================
function toast(msg, type = 'success') {
    const t = document.getElementById('toast');
    const el = document.createElement('div');
    el.className = 'ti ' + type;
    el.textContent = (type === 'success' ? '✅ ' : '❌ ') + msg;
    t.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

function fmt(n) {
    const v = Number(n || 0);
    if (v >= 1000000) return (v / 1000000).toFixed(1) + 'م';
    if (v >= 1000) return v.toLocaleString('ar');
    return v.toLocaleString('ar');
}

function ld() {
    return '<div class="spin"></div>';
}

function em(m = 'لا توجد بيانات') {
    return `<div class="empty"><div class="ei">📭</div><p>${m}</p></div>`;
}

// ============================================
// إدارة النافذة المنبثقة
// ============================================
function omo(title, body, foot = '<button class="btn btn-ghost" onclick="cmo()">إغلاق</button>') {
    document.getElementById('mtitle').textContent = title;
    document.getElementById('mbody').innerHTML = body;
    document.getElementById('mfoot').innerHTML = foot;
    document.getElementById('ov').classList.add('open');
}

function cmo(e) {
    if (!e || e.target === document.getElementById('ov')) {
        document.getElementById('ov').classList.remove('open');
    }
}

// ============================================
// دوال مساعدة للمشتريات
// ============================================
function getDatesForPeriod(period) {
  const now = new Date();
  if (period === 'اليوم') {
    return [now.toISOString().split('T')[0], now.toISOString().split('T')[0]];
  } else if (period === 'أسبوع') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return [weekAgo.toISOString().split('T')[0], now.toISOString().split('T')[0]];
  } else if (period === 'شهر') {
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
    return [monthAgo.toISOString().split('T')[0], now.toISOString().split('T')[0]];
  } else if (period === 'سنة') {
    const yearAgo = new Date(now.getFullYear(), 0, 1);
    return [yearAgo.toISOString().split('T')[0], now.toISOString().split('T')[0]];
  }
  return ['', ''];
}

// ============================================
// دالة API المحلية للتعامل مع LocalStorage
// ============================================
async function api(path, method = 'GET', body = null) {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
        // التعامل مع الصيانة
        if (path.includes('/api/maintenance')) {
            if (path === '/api/maintenance/clear' && method === 'POST') {
                DB.clearMaintenance();
                return { success: true, message: 'تم حذف جميع طلبات الصيانة' };
            }
            if (path === '/api/maintenance/add' && method === 'POST') {
                const item = DB.saveMaintenance(body);
                return { success: true, message: 'تم إضافة طلب الصيانة', data: item };
            }
            if (path.includes('/api/maintenance/') && method === 'PUT') {
                const id = parseInt(path.split('/').pop());
                const item = DB.getMaintenance().find(i => i.id === id);
                if (item) {
                    Object.assign(item, body);
                    DB.saveMaintenance(item);
                    return { success: true, message: 'تم تحديث طلب الصيانة', data: item };
                }
                return { success: false, message: 'طلب الصيانة غير موجود' };
            }
            if (path.includes('/api/maintenance/') && method === 'DELETE') {
                const id = parseInt(path.split('/').pop());
                DB.deleteMaintenance(id);
                return { success: true, message: 'تم حذف طلب الصيانة' };
            }
            if (path === '/api/maintenance') {
                let data = DB.getMaintenance();
                const urlParams = new URLSearchParams(path.split('?')[1]);
                const status = urlParams.get('status');
                if (status) {
                    data = data.filter(m => m.status === status);
                }
                return { success: true, data: data };
            }
        }

        // التعامل مع أسعار الصرف
        if (path === '/api/currency/rates') {
            if (method === 'POST') {
                rates = { ...rates, ...body };
                localStorage.setItem('rates', JSON.stringify(rates));
                return { success: true, message: 'تم حفظ أسعار الصرف' };
            }
            return { success: true, data: rates };
        }

        // التعامل مع المشتريات
        if (path.includes('/api/purchases')) {
            if (path === '/api/purchases/clear' && method === 'POST') {
                DB.clearPurchases();
                return { success: true, message: 'تم حذف جميع المشتريات' };
            }
            if (path === '/api/purchases/add' && method === 'POST') {
                const now = new Date();
                const purchase = {
                    supplier_id: body.supplier_id,
                    supplier_name: body.supplier_id ? DB.suppliers.find(s => s.id === body.supplier_id)?.name || '' : '',
                    paid_amount: parseFloat(body.paid_amount) || 0,
                    items: (body.items || []).map((item, index) => ({
                        ...item,
                        id: item.id || Date.now() + index
                    })),
                    total_amount: body.items?.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) || 0,
                    purchase_date: now.toISOString().split('T')[0]
                };
                purchase.remaining_amount = purchase.total_amount - purchase.paid_amount;
                const saved = DB.savePurchase(purchase);
                // تحديث مخزون المنتجات
                body.items?.forEach(item => {
                    const product = DB.products.find(p => p.id === item.product_id);
                    if (product) {
                        product.quantity += item.quantity;
                        product.cost_price = item.unit_price;
                        product.selling_price = item.sell_price || product.selling_price;
                        DB.saveProduct(product);
                    }
                });
                return { success: true, message: 'تم إضافة فاتورة الشراء', data: saved };
            }
            if (path.includes('/api/purchases/') && method === 'PUT') {
                const id = parseInt(path.split('/').pop());
                const purchase = DB.purchases.find(p => p.id === id);
                if (purchase) {
                    const amount = parseFloat(body.amount) || 0;
                    purchase.paid_amount += amount;
                    purchase.remaining_amount = Math.max(0, purchase.total_amount - purchase.paid_amount);
                    DB.savePurchase(purchase);
                    return { success: true, message: 'تم تحديث فاتورة الشراء', data: purchase };
                }
                return { success: false, message: 'فاتورة الشراء غير موجودة' };
            }
            if (path.includes('/api/purchases/') && method === 'DELETE') {
                const id = parseInt(path.split('/').pop());
                DB.deletePurchase(id);
                return { success: true, message: 'تم حذف فاتورة الشراء' };
            }
            if (path.includes('/api/purchases/') && method === 'GET') {
                const id = parseInt(path.split('/').pop());
                const purchase = DB.purchases.find(p => p.id === id);
                if (purchase) {
                    const details = (purchase.items || []).map(item => {
                        const product = DB.products.find(p => p.id === item.product_id);
                        return {
                            id: item.id,
                            product_name: product?.name || 'غير معروف',
                            quantity: item.quantity,
                            unit_price: item.unit_price,
                            sell_price: item.sell_price || 0,
                            total_price: item.quantity * item.unit_price
                        };
                    });
                    console.log('API - Purchase:', purchase);
                    console.log('API - Purchase keys:', Object.keys(purchase));
                    console.log('API - Purchase invoice_number:', purchase.invoice_number);
                    console.log('API - Purchase purchase_date:', purchase.purchase_date);
                    console.log('API - Details:', details);
                    return { success: true, data: { purchase, details } };
                }
                return { success: false, message: 'فاتورة الشراء غير موجودة' };
            }
            if (path.startsWith('/api/purchases')) {
                // التعامل مع عرض فواتير المشتريات
                if (path === '/api/purchases' || path.startsWith('/api/purchases?')) {
                    const queryString = path.split('?')[1];
                    const urlParams = queryString ? new URLSearchParams(queryString) : new URLSearchParams();
                    const period = urlParams.get('period') || 'شهر';
                    let data = DB.purchases;
                    const now = new Date();
                    if (period === 'اليوم') {
                        data = data.filter(p => p.purchase_date === now.toISOString().split('T')[0]);
                    } else if (period === 'أسبوع') {
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        data = data.filter(p => new Date(p.purchase_date) >= weekAgo);
                    } else if (period === 'شهر') {
                        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
                        data = data.filter(p => new Date(p.purchase_date) >= monthAgo);
                    } else if (period === 'سنة') {
                        const yearAgo = new Date(now.getFullYear(), 0, 1);
                        data = data.filter(p => new Date(p.purchase_date) >= yearAgo);
                    }
                    return { success: true, data: data };
                }
            }
            if (path.includes('/api/purchases/') && path.includes('/pay') && method === 'POST') {
                const id = parseInt(path.split('/')[3]);
                const purchase = DB.purchases.find(p => p.id === id);
                if (purchase) {
                    const amount = parseFloat(body.amount) || 0;
                    purchase.paid_amount += amount;
                    purchase.remaining_amount = Math.max(0, purchase.total_amount - purchase.paid_amount);
                    DB.savePurchase(purchase);
                    return { success: true, message: 'تم تسجيل الدفعة', data: purchase };
                }
                return { success: false, message: 'فاتورة الشراء غير موجودة' };
            }
        }

        // التعامل مع المنتجات
        if (path.includes('/api/products')) {
            if (path === '/api/products/add' && method === 'POST') {
                const product = DB.saveProduct(body);
                return { success: true, message: 'تم إضافة المنتج', data: product };
            }
            if (path === '/api/products') {
                return { success: true, data: DB.products };
            }
        }

        // التعامل مع الموردين
        if (path.includes('/api/suppliers')) {
            if (path === '/api/suppliers/add' && method === 'POST') {
                const supplier = DB.saveSupplier(body);
                return { success: true, message: 'تم إضافة المورد', data: supplier };
            }
            if (path.includes('/api/suppliers/') && method === 'PUT') {
                const id = parseInt(path.split('/').pop());
                const supplier = DB.suppliers.find(s => s.id === id);
                if (supplier) {
                    Object.assign(supplier, body);
                    DB.saveSupplier(supplier);
                    return { success: true, message: 'تم تحديث المورد', data: supplier };
                }
                return { success: false, message: 'المورد غير موجود' };
            }
            if (path.includes('/api/suppliers/') && method === 'DELETE') {
                const id = parseInt(path.split('/').pop());
                DB.deleteSupplier(id);
                return { success: true, message: 'تم حذف المورد' };
            }
            if (path === '/api/suppliers') {
                return { success: true, data: DB.suppliers };
            }
        }

        return { success: false, message: 'المسار غير مدعوم' };
    } catch (e) {
        console.error('API Error:', e);
        return { success: false, message: 'خطأ: ' + e.message };
    }
}

// ============================================
// تسجيل الدخول
// ============================================
let selectedAccount = null;

function doLogin() {
    const btn = document.getElementById('login-btn');
    const un = document.getElementById('lu').value.trim();
    const pw = document.getElementById('lp').value.trim();

    document.getElementById('lerr').style.display = 'none';
    document.getElementById('lok').style.display = 'none';

    if (!un || !pw) {
        showErr('أدخل اسم المستخدم وكلمة المرور');
        return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ جاري الدخول...';

    if (Auth.login(un, pw)) {
        document.getElementById('lok').style.display = 'block';
        document.getElementById('lok').textContent = '✅ تم تسجيل الدخول بنجاح';
        setTimeout(() => {
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app').style.display = 'flex';
            document.getElementById('u-name').textContent = Auth.currentUser.name;
            document.getElementById('sb-user').textContent = 'مرحباً، ' + Auth.currentUser.name;

            // عرض معلومات الحساب الحالي
            const currentAccount = DB.getCurrentAccount();
            document.getElementById('sb-account').textContent = '🏢 ' + (currentAccount?.name || 'الحساب الافتراضي');

            go('dashboard');
        }, 1000);
    } else {
        showErr('بيانات الدخول غير صحيحة');
    }

    btn.disabled = false;
    btn.innerHTML = '🔑 تسجيل الدخول';
}

function showAccountsList() {
    const accounts = DB.accounts;
    const accountsGrid = document.getElementById('accounts-grid');

    // عرض قائمة الحسابات
    accountsGrid.innerHTML = accounts.map(acc => `
        <div class="account-item" onclick="selectAccount('${acc.id}')" data-id="${acc.id}">
            <div class="account-item-icon">🏢</div>
            <div class="account-item-name">${acc.name}</div>
            <div class="account-item-id">${acc.id === 'default' ? 'افتراضي' : 'محمي'}</div>
        </div>
    `).join('');

    // إظهار قائمة الحسابات وإخفاء نموذج تسجيل الدخول
    document.getElementById('accounts-login-list').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

function selectAccount(accountId) {
    const account = DB.accounts.find(a => a.id === accountId);
    selectedAccount = account;

    // تحديث واجهة المستخدم
    document.querySelectorAll('.account-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.id === accountId) {
            item.classList.add('active');
        }
    });

    // إذا كان الحساب الافتراضي
    if (accountId === 'default') {
        // إذا كان الحساب الافتراضي محمي بكلمة مرور، اطلبها
        if (account.password) {
            omo('🔐 كلمة مرور الحساب الافتراضي', `
                <div class="fg">
                    <div class="ff full">
                        <label>اسم الحساب</label>
                        <input type="text" value="${account?.name}" disabled style="background:var(--bg);opacity:0.7">
                    </div>
                    <div class="ff full">
                        <label>كلمة مرور الحساب *</label>
                        <input id="account-login-password" type="password" placeholder="أدخل كلمة مرور الحساب الافتراضي">
                    </div>
                </div>
            `, `
                <button class="btn btn-ghost" onclick="cmo()">إلغاء</button>
                <button class="btn btn-success" onclick="confirmAccountLogin('${accountId}')">🔓 فتح الحساب</button>
            `);
            return;
        }

        // إذا لم يكن محمي، ادخل مباشرة
        if (DB.switchAccount(accountId)) {
            // تسجيل الدخول التلقائي بمستخدم admin
            const adminUser = DB.users.find(u => u.username === 'admin');
            if (adminUser) {
                Auth.currentUser = adminUser;
                localStorage.setItem('currentUser', JSON.stringify({
                    ...adminUser,
                    account_id: account.id
                }));
            }

            // إخفاء شاشة الدخول وعرض التطبيق
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app').style.display = 'flex';
            document.getElementById('u-name').textContent = adminUser.name;
            document.getElementById('sb-user').textContent = 'مرحباً، ' + adminUser.name;
            document.getElementById('sb-account').textContent = '🏢 ' + account.name;

            toast('✅ تم فتح الحساب بنجاح');
            go('dashboard');
        }
        return;
    }

    // للحسابات المحمية بكلمة مرور، اطلبها
    omo('🔐 كلمة مرور الحساب', `
        <div class="fg">
            <div class="ff full">
                <label>اسم الحساب</label>
                <input type="text" value="${account?.name}" disabled style="background:var(--bg);opacity:0.7">
            </div>
            <div class="ff full">
                <label>كلمة مرور الحساب *</label>
                <input id="account-login-password" type="password" placeholder="أدخل كلمة مرور الحساب">
            </div>
        </div>
    `, `
        <button class="btn btn-ghost" onclick="cmo()">إلغاء</button>
        <button class="btn btn-success" onclick="confirmAccountLogin('${accountId}')">🔓 فتح الحساب</button>
    `);
}

function confirmAccountLogin(accountId) {
    const enteredPassword = document.getElementById('account-login-password').value.trim();
    const account = DB.accounts.find(a => a.id === accountId);

    if (!enteredPassword) {
        toast('يرجى إدخال كلمة المرور', 'error');
        return;
    }

    // التحقق من كلمة المرور
    if (btoa(enteredPassword) !== account.password) {
        toast('كلمة المرور غير صحيحة', 'error');
        return;
    }

    // التبديل إلى الحساب والدخول مباشرة
    if (DB.switchAccount(accountId)) {
        cmo();

        // تسجيل الدخول التلقائي بمستخدم admin
        const adminUser = DB.users.find(u => u.username === 'admin');
        if (adminUser) {
            Auth.currentUser = adminUser;
            localStorage.setItem('currentUser', JSON.stringify({
                ...adminUser,
                account_id: account.id
            }));
        }

        // إخفاء شاشة الدخول وعرض التطبيق
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        document.getElementById('u-name').textContent = adminUser.name;
        document.getElementById('sb-user').textContent = 'مرحباً، ' + adminUser.name;
        document.getElementById('sb-account').textContent = '🏢 ' + account.name;

        toast('✅ تم فتح الحساب بنجاح');
        go('dashboard');
    }
}

function showLoginForm() {
    document.getElementById('accounts-login-list').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    selectedAccount = null;
}

function showErr(msg) {
    const el = document.getElementById('lerr');
    el.textContent = '❌ ' + msg;
    el.style.display = 'block';
}

function doLogout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        Auth.logout();
        location.reload();
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sb-overlay');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// ============================================
// التنقل
// ============================================
const TITLES = {
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    sales: 'المبيعات',
    purchases: 'المشتريات',
    pos: 'نقطة البيع',
    suppliers: 'الموردين',
    customers: 'العملاء',
    expenses: 'المصاريف',
    maintenance: 'الصيانة',
    reports: 'التقارير',
    currency: 'حاسبة العملات',
    barcode_sale: 'بيع بالباركود',
    barcode_return: 'استرجاع بالباركود',
    count: 'الجرد',
    mobile: 'إدارة الموبايلات',
    users: 'إدارة المستخدمين',
    accounts: 'إدارة الحسابات',
    license: 'معلومات الترخيص',
    settings: 'الإعدادات',
    inventory: 'المخزون'
};

// ============================================
// لوحة التحكم
// ============================================
function dashboard() {
    const c = document.getElementById('pc');
    const sales = DB.sales || [];
    const products = DB.products || [];
    const expenses = DB.getExpenses ? DB.getExpenses() : [];

    // حساب الإحصائيات
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.sale_date === today);
    const monthSales = sales.filter(s => {
        const saleDate = new Date(s.sale_date);
        const now = new Date();
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    });

    const todayTotal = todaySales.reduce((sum, s) => sum + s.total_amount, 0);
    const monthTotal = monthSales.reduce((sum, s) => sum + s.total_amount, 0);
    const monthProfit = monthSales.reduce((sum, s) => sum + (s.profit || 0), 0);
    const yearProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
    const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);

    const monthExpenses = expenses.filter(e => {
        const expDate = new Date(e.date);
        const now = new Date();
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    }).reduce((sum, e) => sum + e.amount, 0);

    const inventoryValue = products.reduce((sum, p) => sum + (p.cost_price * p.quantity), 0);
    const lowStock = products.filter(p => p.quantity <= p.min_stock).length;
    const outStock = products.filter(p => p.quantity <= 0).length;
    const receivables = sales.filter(s => s.remaining_amount > 0).reduce((sum, s) => sum + s.remaining_amount, 0);

    c.innerHTML = `
    <div class="sg">
        <div class="sc bl"><div class="lb">💵 مبيعات اليوم</div><div class="vl">${fmt(todayTotal)}</div><div class="sb">${todaySales.length} فاتورة</div></div>
        <div class="sc bl"><div class="lb">📈 مبيعات الشهر</div><div class="vl">${fmt(monthTotal)}</div><div class="sb">${monthSales.length} فاتورة</div></div>
        <div class="sc gr"><div class="lb">💹 ربح الشهر</div><div class="vl">${fmt(monthProfit)}</div><div class="sb">سنوي: ${fmt(yearProfit)}</div></div>
        <div class="sc gr"><div class="lb">💼 إجمالي الأرباح</div><div class="vl">${fmt(totalProfit)}</div></div>
        <div class="sc wn"><div class="lb">🛍️ مصروفات الشهر</div><div class="vl">${fmt(monthExpenses)}</div></div>
        <div class="sc pu"><div class="lb">📦 قيمة المخزون</div><div class="vl">${fmt(inventoryValue)}</div><div class="sb">${products.length} منتج</div></div>
        <div class="sc rd"><div class="lb">📥 ديون العملاء</div><div class="vl">${fmt(receivables)}</div></div>
        <div class="sc wn"><div class="lb">⚠️ مخزون منخفض</div><div class="vl">${lowStock}</div><div class="sb">نافذ: ${outStock}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
        <div class="tw"><div class="th"><h3>🏆 أعلى المنتجات</h3></div><div id="tp-list">${ld()}</div></div>
        <div class="tw"><div class="th"><h3>⚠️ مخزون منخفض</h3></div><div id="ls-list">${ld()}</div></div>
    </div>`;

    // أعلى المنتجات
    const productSales = {};
    sales.forEach(sale => {
        if (sale.items && Array.isArray(sale.items)) {
            sale.items.forEach(item => {
                if (!productSales[item.product_id]) {
                    productSales[item.product_id] = { qty: 0, revenue: 0 };
                }
                productSales[item.product_id].qty += item.quantity;
                productSales[item.product_id].revenue += item.quantity * item.unit_price;
            });
        }
    });

    const topProducts = Object.entries(productSales)
        .map(([productId, data]) => {
            const product = products.find(p => p.id == productId);
            return { name: product?.name || 'غير معروف', ...data };
        })
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5);

    document.getElementById('tp-list').innerHTML = topProducts.length
        ? `<table><tr><th>المنتج</th><th>الكمية</th><th>الإيراد</th></tr>${topProducts.map(p => `<tr><td>${p.name}</td><td>${fmt(p.qty)}</td><td>${fmt(p.revenue)}</td></tr>`).join('')}</table>`
        : em();

    // مخزون منخفض
    const lowStockProducts = products.filter(p => p.quantity <= p.min_stock);
    document.getElementById('ls-list').innerHTML = lowStockProducts.length
        ? `<table><tr><th>المنتج</th><th>الكمية</th><th>الحد</th></tr>${lowStockProducts.slice(0, 5).map(p => `<tr><td>${p.name}</td><td><span class="badge ${p.quantity <= 0 ? 'br' : 'bw'}">${p.quantity}</span></td><td>${p.min_stock}</td></tr>`).join('')}</table>`
        : em('المخزون كافٍ ✅');
}

// ============================================
// المنتجات
// ============================================
function products(q = '') {
    const c = document.getElementById('pc');
    c.innerHTML = `<div class="sb-bar"><input class="si" id="ps" placeholder="🔍 بحث..." value="${q}" oninput="products(this.value)"><button class="btn btn-success" onclick="addProd()">+ إضافة منتج</button></div>
    <div class="tw"><div class="th"><h3>📦 المنتجات</h3><span id="pcnt" style="color:var(--muted);font-size:13px"></span></div><div id="pt">${ld()}</div></div>`;

    const allProducts = DB.products;
    const filtered = q ? allProducts.filter(p => 
        p.name.includes(q) || 
        p.brand.includes(q) || 
        p.barcode?.includes(q)
    ) : allProducts;

    document.getElementById('pcnt').textContent = filtered.length + ' منتج';
    document.getElementById('pt').innerHTML = filtered.length
        ? `<table><tr><th>الاسم</th><th>الماركة</th><th>الفئة</th><th>شراء</th><th>بيع</th><th>الكمية</th><th>الحالة</th><th></th></tr>
        ${filtered.map(p => {
            const productJson = JSON.stringify(p);
            return `<tr><td><b>${p.name}</b></td><td>${p.brand}</td><td>${p.category}</td><td>${fmt(p.cost_price)}</td><td>${fmt(p.selling_price)}</td>
        <td><span class="badge ${p.quantity <= 0 ? 'br' : p.quantity <= p.min_stock ? 'bw' : 'bg'}">${p.quantity}</span></td>
        <td>${p.condition}</td>
        <td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" onclick='eProd(${productJson})'>✏️</button> <button class="btn btn-danger btn-sm" onclick="dProd(${p.id},'${p.name.replace(/'/g, '')}')">🗑️</button></td></tr>`;
        }).join('')}</table>`
        : em();
}

function addProd() {
    omo('➕ إضافة منتج جديد', `<div class="fg">
        <div class="ff full"><label>الاسم *</label><input id="pn" placeholder="iPhone 15 Pro"></div>
        <div class="ff"><label>الماركة *</label><input id="pb" placeholder="Apple"></div>
        <div class="ff"><label>الموديل</label><input id="pm" placeholder="A1234"></div>
        <div class="ff"><label>الفئة</label><select id="pcat" onchange="toggleCondField()"><option>موبايلات</option><option>ملحقات</option><option>أجهزة لوحية</option><option>أخرى</option></select></div>
        <div class="ff"><label>سعر الشراء *</label><input id="pcp" type="number" placeholder="0"></div>
        <div class="ff"><label>سعر البيع *</label><input id="psp" type="number" placeholder="0"></div>
        <div class="ff"><label>الكمية *</label><input id="pq" type="number" placeholder="0"></div>
        <div class="ff"><label>الحد الأدنى</label><input id="pms" type="number" placeholder="5"></div>
        <div class="ff"><label>الباركود</label><input id="pbar" placeholder="اختياري"></div>
        <div class="ff" id="cond-field"><label>الحالة</label><select id="pcon"><option>جديد</option><option>مستعمل</option></select></div>
    </div>`, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="svProd()">💾 حفظ</button>`);
    setTimeout(toggleCondField, 50);
}

function toggleCondField() {
    const cat = document.getElementById('pcat')?.value;
    const cf = document.getElementById('cond-field');
    if (cf) cf.style.display = cat === 'موبايلات' ? 'flex' : 'none';
}

function svProd() {
    const product = {
        name: document.getElementById('pn').value,
        brand: document.getElementById('pb').value,
        model: document.getElementById('pm').value || '-',
        category: document.getElementById('pcat').value,
        cost_price: parseFloat(document.getElementById('pcp').value) || 0,
        selling_price: parseFloat(document.getElementById('psp').value) || 0,
        quantity: parseInt(document.getElementById('pq').value) || 0,
        min_stock: parseInt(document.getElementById('pms').value) || 5,
        barcode: document.getElementById('pbar').value || null,
        condition: document.getElementById('pcon').value
    };

    if (!product.name || !product.brand) {
        toast('يرجى ملء الحقول المطلوبة', 'error');
        return;
    }

    DB.saveProduct(product);
    cmo();
    toast('تم حفظ المنتج بنجاح');
    products();
}

function eProd(p) {
    omo('✏️ تعديل المنتج', `<div class="fg">
        <div class="ff full"><label>الاسم</label><input id="en" value="${p.name}"></div>
        <div class="ff"><label>الماركة</label><input id="eb" value="${p.brand}"></div>
        <div class="ff"><label>سعر الشراء</label><input id="ec" type="number" value="${p.cost_price}"></div>
        <div class="ff"><label>سعر البيع</label><input id="es" type="number" value="${p.selling_price}"></div>
        <div class="ff"><label>الكمية</label><input id="eq" type="number" value="${p.quantity}"></div>
        <div class="ff"><label>الحد الأدنى</label><input id="em" type="number" value="${p.min_stock}"></div>
        <div class="ff"><label>الحالة</label><select id="eco"><option ${p.condition === 'جديد' ? 'selected' : ''}>جديد</option><option ${p.condition === 'مستعمل' ? 'selected' : ''}>مستعمل</option><option ${p.condition === 'مجدد' ? 'selected' : ''}>مجدد</option></select></div>
    </div>`, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="upProd(${p.id})">💾 حفظ</button>`);
}

function upProd(id) {
    const product = {
        id,
        name: document.getElementById('en').value,
        brand: document.getElementById('eb').value,
        model: '-',
        cost_price: parseFloat(document.getElementById('ec').value) || 0,
        selling_price: parseFloat(document.getElementById('es').value) || 0,
        quantity: parseInt(document.getElementById('eq').value) || 0,
        min_stock: parseInt(document.getElementById('em').value) || 5,
        condition: document.getElementById('eco').value
    };

    DB.saveProduct(product);
    cmo();
    toast('تم تحديث المنتج بنجاح');
    products();
}

function dProd(id, name) {
    if (!confirm(`حذف: ${name}?`)) return;
    DB.deleteProduct(id);
    toast('تم حذف المنتج');
    products();
}

// ============================================
// نقطة البيع
// ============================================
let cart = [];

function pos() {
    const c = document.getElementById('pc');
    c.innerHTML = `<div class="pos-g">
      <div>
        <div class="sb-bar"><input class="si" id="pos-s" placeholder="🔍 اسم المنتج أو الباركود..." oninput="psrch(this.value)"></div>
        <div id="pos-prods" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">${ld()}</div>
      </div>
      <div>
        <div class="tw" style="padding:14px">
          <h3 style="margin-bottom:11px">🛒 السلة</h3>
          <div id="cart-items"></div>
          <div class="ri">
            <div style="display:flex;justify-content:space-between;margin-bottom:9px"><span style="color:var(--muted)">الإجمالي</span><b id="ct" style="font-size:19px;color:var(--accent)">0</b></div>
            <div class="ff" style="margin-bottom:9px"><label>المدفوع</label><input id="cp2" type="number" class="rin" placeholder="0" oninput="updRem()"></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:9px"><span style="color:var(--muted)">الباقي</span><b id="cr" style="color:var(--warn)">0</b></div>
            <div class="ff" style="margin-bottom:11px"><label>طريقة الدفع</label><select id="cm" class="rb"><option>نقدي</option><option>بطاقة</option><option>تحويل</option></select></div>
            <button class="btn btn-success" style="width:100%" onclick="doSale()">✅ إتمام البيع</button>
            <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:7px" onclick="cart=[];renderCart()">🗑️ مسح</button>
          </div>
        </div>
      </div>
    </div>`;
    renderCart();
    psrch('');
}

function psrch(q) {
    const allProducts = DB.products;
    const filtered = q ? allProducts.filter(p => 
        (p.name.includes(q) || p.barcode?.includes(q)) && p.quantity > 0
    ) : allProducts.filter(p => p.quantity > 0);

    const el = document.getElementById('pos-prods');
    if (!el) return;

    el.innerHTML = filtered.length
        ? filtered.slice(0, 24).map(p => `
            <div onclick="addCart(${p.id},'${p.name.replace(/'/g, '')}',${p.selling_price})"
                style="background:var(--bg2);border:1px solid var(--border);border-radius:9px;padding:13px;cursor:pointer;transition:all .18s"
                onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
                <div style="font-size:13px;font-weight:700;margin-bottom:5px">${p.name}</div>
                <div style="font-size:11px;color:var(--muted)">${p.brand} | متبقي: ${p.quantity}</div>
                <div style="font-size:16px;font-weight:900;color:var(--accent2);margin-top:7px">${fmt(p.selling_price)}</div>
            </div>`).join('')
        : em('لا توجد منتجات');
}

function addCart(id, name, price) {
    const ex = cart.find(i => i.id === id);
    if (ex) ex.qty++;
    else cart.push({ id, name, price, qty: 1 });
    renderCart();
}

function chQty(i, d) {
    cart[i].qty = Math.max(1, cart[i].qty + d);
    renderCart();
}

function rmItem(i) {
    cart.splice(i, 1);
    renderCart();
}

function clearCart() {
    cart = [];
    renderCart();
}

function updRem() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const paid = parseFloat(document.getElementById('cp2')?.value) || 0;
    const rem = document.getElementById('cr');
    if (rem) rem.textContent = fmt(Math.max(0, total - paid));
}

function renderCart() {
    const el = document.getElementById('cart-items');
    if (!el) return;

    if (!cart.length) {
        el.innerHTML = '<p style="text-align:center;color:var(--muted);padding:18px">السلة فارغة</p>';
        document.getElementById('ct').textContent = '0';
        return;
    }

    el.innerHTML = cart.map((i, idx) => `<div class="ci"><div class="nm"><div>${i.name}</div><div style="font-size:12px;color:var(--muted)">${fmt(i.price)} × ${i.qty}</div></div><div style="display:flex;align-items:center;gap:5px"><button class="qb" onclick="chQty(${idx},-1)">−</button><span style="min-width:22px;text-align:center">${i.qty}</span><button class="qb" onclick="chQty(${idx},1)">+</button><button class="qb" style="background:rgba(255,71,87,.2);color:var(--danger)" onclick="rmItem(${idx})">×</button></div></div>`).join('');

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    document.getElementById('ct').textContent = fmt(total);
    updRem();
}

function doSale() {
    if (!cart.length) {
        toast('السلة فارغة', 'error');
        return;
    }

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const paid = parseFloat(document.getElementById('cp2').value) || total;

    // حساب الربح
    let profit = 0;
    cart.forEach(item => {
        const product = DB.products.find(p => p.id === item.id);
        if (product) {
            profit += (item.price - product.cost_price) * item.qty;
            // تحديث المخزون
            product.quantity -= item.qty;
            DB.saveProduct(product);
        }
    });

    const sale = {
        items: cart.map(i => ({
            product_id: i.id,
            quantity: i.qty,
            unit_price: i.price
        })),
        total_amount: total,
        paid_amount: paid,
        remaining_amount: Math.max(0, total - paid),
        payment_method: document.getElementById('cm').value,
        profit: profit,
        username: Auth.currentUser?.username || 'مستخدم'
    };

    DB.saveSale(sale);
    toast(`✅ فاتورة ${sale.invoice_number} | الإجمالي: ${fmt(total)}`);
    cart = [];
    renderCart();
    document.getElementById('cp2').value = '';
    psrch('');
}

// ============================================
// المبيعات
// ============================================
let salesData = [];
let salesFilterState = { search: '', from_date: '', to_date: new Date().toISOString().slice(0, 10) };

function sales(pr = 'اليوم') {
    const c = document.getElementById('pc');

    let html = `
    <div style="background:var(--bg2);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:20px">
      <div style="margin-bottom:15px">
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <input id="sale-search" type="text" placeholder="🔍 بحث الفاتورة..." style="flex:1;min-width:200px;padding:12px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:14px" onkeyup="filterSalesTable()">
          <input id="sale-from" type="date" style="padding:12px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:14px" onchange="filterSalesTable()">
          <input id="sale-to" type="date" style="padding:12px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:14px" onchange="filterSalesTable()">
          <button class="btn btn-ghost" onclick="filterSalesTable()" style="padding:12px 20px;font-size:14px">تصفية</button>
        </div>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:15px">
        ${['اليوم', 'أسبوع', 'شهر', 'سنة', 'كل الوقت'].map(p => `<button class="btn ${p === pr ? 'btn-success' : 'btn-ghost'}" onclick="salesPeriod('${p}')" style="padding:10px 15px;font-size:14px;font-weight:bold">${p}</button>`).join('')}
      </div>

      <div style="border-top:2px solid var(--border);padding-top:15px;margin-top:15px">
        <button class="btn btn-danger" onclick="clearAllSales()" style="padding:15px 30px;font-size:16px;font-weight:bold;width:100%;background:var(--danger);color:white;border-radius:8px">
          🧹 تفريغ جميع الفواتير (حذف نهائي!)
        </button>
      </div>
    </div>

    <div class="tw">
      <div class="th"><h3>💰 سجل المبيعات</h3><span id="sale-stats" style="color:var(--muted);font-size:13px"></span></div>
      <div id="sales-table" style="overflow-x:auto"></div>
    </div>`;

    c.innerHTML = html;

    salesData = DB.sales || [];

    const [fromD, toD] = getDatesForPeriod(pr);

    const stats = {
        count: salesData.length,
        total: salesData.reduce((sum, s) => sum + s.total_amount, 0),
        profit: salesData.reduce((sum, s) => sum + (s.profit || 0), 0)
    };

    document.getElementById('sale-stats').textContent = `${stats.count} فاتورة | الإجمالي: ${fmt(stats.total)} | الربح: ${fmt(stats.profit)}`;
    renderSalesTable(salesData);

    setTimeout(() => {
        document.getElementById('sale-from').value = fromD;
        document.getElementById('sale-to').value = toD;
    }, 0);
}

function salesPeriod(p) {
    sales(p);
}

function filterSalesTable() {
    const search = document.getElementById('sale-search')?.value || '';
    const from = document.getElementById('sale-from')?.value || '';
    const to = document.getElementById('sale-to')?.value || '';

    let filtered = DB.sales;

    if (search) {
        filtered = filtered.filter(s => 
            s.invoice_number.includes(search) ||
            s.sale_date.includes(search)
        );
    }

    if (from) {
        filtered = filtered.filter(s => s.sale_date >= from);
    }

    if (to) {
        filtered = filtered.filter(s => s.sale_date <= to);
    }

    renderSalesTable(filtered);
}

function clearAllSales() {
    if (!confirm('🚨 هل تريد حذف جميع الفواتير؟\n\nهذا الإجراء نهائي ولا يمكن التراجع عنه!')) return;
    if (!confirm('⚠️ تأكيد نهائي: سيتم حذف جميع الفواتير!')) return;

    omo('🗑️ تفريغ الفواتير', `
    <div style="background:var(--bg3);padding:14px;border-radius:8px;color:var(--danger)">
        <p>🚨 تحذير: سيتم حذف جميع فواتير المبيعات من قاعدة البيانات</p>
        <p style="margin-top:10px;font-size:12px;color:var(--muted)">عدد الفواتير: <b>${DB.sales.length}</b></p>
    </div>`,
    `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-danger" onclick="confirmClearAllSales()">🗑️ حذف الكل</button>`);
}

function confirmClearAllSales() {
    DB.clearSales();
    cmo();
    toast('✅ تم حذف جميع الفواتير');
    sales('اليوم');
}

function getDatesForPeriod(period) {
    const today = new Date();
    let from = new Date();
    let to = new Date();

    if (period === 'اليوم') {
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
    } else if (period === 'أسبوع') {
        from.setDate(today.getDate() - today.getDay());
        to.setDate(from.getDate() + 6);
    } else if (period === 'شهر') {
        from.setDate(1);
        to.setMonth(today.getMonth() + 1, 0);
    } else if (period === 'سنة') {
        from.setMonth(0, 1);
        to.setMonth(11, 31);
    } else {
        return ['2020-01-01', today.toISOString().slice(0, 10)];
    }

    return [from.toISOString().slice(0, 10), to.toISOString().slice(0, 10)];
}

function renderSalesTable(data) {
    const tbl = document.getElementById('sales-table');
    if (!data || !data.length) {
        tbl.innerHTML = em('لا توجد مبيعات');
        return;
    }

    tbl.innerHTML = `
    <table style="width:100%">
      <tr>
        <th>رقم الفاتورة</th>
        <th>التاريخ</th>
        <th>الوقت</th>
        <th>المبلغ</th>
        <th>المدفوع</th>
        <th>المتبقي</th>
        <th>الربح</th>
        <th>الطريقة</th>
        <th>الكاشير</th>
        <th></th>
      </tr>
      ${data.map(s => {
        const payButton = s.remaining_amount > 0 ? `<button class="btn btn-warn btn-sm" onclick="paySale(${s.id},${s.remaining_amount})" title="تسجيل دفعة">💳</button>` : '';
        return `
      <tr>
        <td><b style="color:var(--accent)">${s.invoice_number}</b></td>
        <td>${s.sale_date}</td>
        <td>${s.sale_time || '—'}</td>
        <td>${fmt(s.total_amount)}</td>
        <td>${fmt(s.paid_amount)}</td>
        <td><span class="badge ${s.remaining_amount > 0 ? 'br' : 'bg'}">${fmt(s.remaining_amount)}</span></td>
        <td style="color:var(--accent2)">${fmt(s.profit || 0)}</td>
        <td>${s.payment_method || '—'}</td>
        <td>${s.username}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-ghost btn-sm" onclick="vSale(${s.id})" title="عرض التفاصيل">👁️</button>
          ${payButton}
          <button class="btn btn-info btn-sm" onclick="returnToInventory(${s.id})" title="إرجاع إلى المخزون">↩️</button>
          <button class="btn btn-danger btn-sm" onclick="deleteSale(${s.id})" title="حذف الفاتورة">🗑️</button>
        </td>
      </tr>`;
      }).join('')}
    </table>`;
}

function vSale(id) {
    const sale = DB.sales.find(s => s.id === id);
    if (!sale || !sale.items || !Array.isArray(sale.items)) {
        toast('خطأ في تحميل بيانات الفاتورة', 'error');
        return;
    }

    let html = `
    <div style="background:var(--bg3);padding:14px;border-radius:9px;margin-bottom:14px">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:10px">
        <div>
          <span style="color:var(--muted);font-size:11px;display:block;margin-bottom:3px">رقم الفاتورة</span>
          <div style="font-weight:700;color:var(--accent);font-size:16px">${sale.invoice_number}</div>
        </div>
        <div>
          <span style="color:var(--muted);font-size:11px;display:block;margin-bottom:3px">التاريخ والوقت</span>
          <div style="font-size:13px">${sale.sale_date} ${sale.sale_time || '—'}</div>
        </div>
        <div>
          <span style="color:var(--muted);font-size:11px;display:block;margin-bottom:3px">الكاشير</span>
          <div style="font-size:13px">${sale.username || '—'}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <div>
          <span style="color:var(--muted);font-size:11px;display:block;margin-bottom:3px">الإجمالي</span>
          <div style="font-weight:700;color:var(--accent2);font-size:15px">${fmt(sale.total_amount)}</div>
        </div>
        <div>
          <span style="color:var(--muted);font-size:11px;display:block;margin-bottom:3px">المدفوع</span>
          <div style="font-weight:700;color:var(--accent2);font-size:15px">${fmt(sale.paid_amount)}</div>
        </div>
        <div>
          <span style="color:var(--muted);font-size:11px;display:block;margin-bottom:3px">المتبقي</span>
          <div style="font-weight:700;color:${sale.remaining_amount > 0 ? 'var(--danger)' : 'var(--accent2)'};font-size:15px">${fmt(sale.remaining_amount)}</div>
        </div>
      </div>
    </div>

    <table style="width:100%;margin-bottom:14px">
      <tr style="background:var(--bg3)">
        <th>المنتج</th>
        <th>الماركة</th>
        <th>الكمية</th>
        <th>سعر الوحدة</th>
        <th>الإجمالي</th>
        <th>الربح</th>
      </tr>
      ${sale.items.map(d => {
        const product = DB.products.find(p => p.id === d.product_id);
        return `
        <tr>
          <td><b>${d.name || product?.name || 'غير معروف'}</b></td>
          <td>${product?.brand || '—'}</td>
          <td style="text-align:center">${d.quantity}</td>
          <td>${fmt(d.unit_price || d.price)}</td>
          <td>${fmt(d.total_price || (d.quantity * d.unit_price))}</td>
          <td style="color:var(--accent2)">${fmt(d.profit || 0)}</td>
        </tr>`;
      }).join('')}
    </table>

    <div style="background:var(--bg3);padding:12px;border-radius:8px;margin-bottom:14px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <span style="color:var(--muted);font-size:11px">طريقة الدفع</span>
          <div style="font-weight:600;margin-top:3px">${sale.payment_method || 'نقدي'}</div>
        </div>
        <div>
          <span style="color:var(--muted);font-size:11px">إجمالي الربح</span>
          <div style="font-weight:600;color:var(--accent2);margin-top:3px">${fmt(sale.profit || 0)}</div>
        </div>
      </div>
    </div>`;

    const payButton = sale.remaining_amount > 0 ? `<button class="btn btn-warn" onclick="paySale(${id},${sale.remaining_amount})">💳 تسجيل دفعة</button>` : '';
    omo(`📋 تفاصيل الفاتورة رقم: ${sale.invoice_number}`, html,
    `${payButton}
    <button class="btn btn-ghost" onclick="cmo()">✖ إغلاق</button>`);
}

function returnToInventory(id) {
    const sale = DB.sales.find(s => s.id === id);
    if (!sale || !sale.items || !Array.isArray(sale.items)) {
        toast('خطأ في تحميل البيانات', 'error');
        return;
    }

    const html = `
    <div style="background:rgba(0,255,157,.08);border:1px solid var(--accent2);border-radius:9px;padding:14px;margin-bottom:14px">
        <b style="color:var(--accent2)">⚠️ سيتم إرجاع المنتجات للمخزون وحذف الفاتورة نهائياً</b>
    </div>
    <div style="background:var(--bg3);padding:12px;border-radius:9px;margin-bottom:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        <div><span style="color:var(--muted);font-size:11px">رقم الفاتورة</span><div style="font-weight:700;color:var(--accent)">${sale.invoice_number}</div></div>
        <div><span style="color:var(--muted);font-size:11px">التاريخ</span><div>${sale.sale_date}</div></div>
        <div><span style="color:var(--muted);font-size:11px">الإجمالي</span><div style="font-weight:700;color:var(--accent2)">${fmt(sale.total_amount)}</div></div>
    </div>
    <table style="width:100%;margin-bottom:12px">
        <tr style="background:var(--bg3)"><th>المنتج</th><th>الكمية</th><th>سعر الوحدة</th><th>الإجمالي</th><th>الربح</th></tr>
        ${sale.items.map(d => {
            const product = DB.products.find(p => p.id === d.product_id);
            return `<tr>
                <td><b>${d.name || product?.name || 'غير معروف'}</b></td>
                <td style="text-align:center">${d.quantity}</td>
                <td>${fmt(d.unit_price || d.price)}</td>
                <td>${fmt(d.total_price || (d.quantity * d.unit_price))}</td>
                <td style="color:var(--accent2)">${fmt(d.profit || 0)}</td>
            </tr>`;
        }).join('')}
    </table>
    <div style="background:var(--bg3);padding:12px;border-radius:8px;display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div><span style="color:var(--muted);font-size:11px">المدفوع</span><div style="color:var(--accent2);font-weight:700">${fmt(sale.paid_amount)}</div></div>
        <div><span style="color:var(--muted);font-size:11px">المتبقي</span><div style="color:${sale.remaining_amount > 0 ? 'var(--danger)' : 'var(--accent2)'};font-weight:700">${fmt(sale.remaining_amount)}</div></div>
    </div>`;

    omo(`🔄 إرجاع فاتورة: ${sale.invoice_number}`, html,
    `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="confirmReturnToInventory(${id})">✅ إرجاع وحذف الفاتورة</button>`);
}

function confirmReturnToInventory(id) {
    const sale = DB.sales.find(s => s.id === id);
    if (!sale || !sale.items || !Array.isArray(sale.items)) {
        toast('خطأ في تحميل البيانات', 'error');
        return;
    }

    // إرجاع المنتجات للمخزون
    sale.items.forEach(item => {
        const product = DB.products.find(p => p.id === item.product_id);
        if (product) {
            product.quantity += item.quantity;
            DB.saveProduct(product);
        }
    });

    // حذف الفاتورة
    DB.deleteSale(id);

    cmo();
    toast('✅ تم إرجاع المنتجات للمخزون وحذف الفاتورة');
    sales('اليوم');
}

function paySale(id, rem) {
    omo('💳 تسجيل دفعة', `
    <div class="ff" style="margin-bottom:14px">
        <label style="color:var(--muted);font-size:12px">المبلغ المتبقي: <b style="color:var(--accent)">${fmt(rem)}</b></label>
        <input id="pay-amount" type="number" value="${rem}" style="margin-top:6px;background:var(--bg3);border:1px solid var(--border);padding:10px;border-radius:7px;color:var(--text);width:100%" placeholder="أدخل المبلغ">
    </div>
    <div class="ff">
        <label style="color:var(--muted);font-size:12px">طريقة الدفع</label>
        <select id="pay-method" style="margin-top:6px;background:var(--bg3);border:1px solid var(--border);padding:10px;border-radius:7px;color:var(--text);width:100%">
            <option>نقدي</option>
            <option>بطاقة</option>
            <option>تحويل</option>
            <option>شيك</option>
        </select>
    </div>`,
    `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="subPaySale(${id})">✅ تأكيد الدفع</button>`);
}

function subPaySale(id) {
    const amount = document.getElementById('pay-amount').value;
    const method = document.getElementById('pay-method').value;

    if (!amount || parseFloat(amount) <= 0) {
        toast('أدخل مبلغاً صحيحاً', 'error');
        return;
    }

    const sale = DB.sales.find(s => s.id === id);
    if (!sale) {
        toast('خطأ في تحميل البيانات', 'error');
        return;
    }

    sale.paid_amount += parseFloat(amount);
    sale.remaining_amount = Math.max(0, sale.total_amount - sale.paid_amount);

    DB.saveSale(sale);

    cmo();
    toast('✅ تم تسجيل الدفعة بنجاح');
    sales('اليوم');
}

function deleteSale(id) {
    if (!confirm('هل تريد حذف هذه الفاتورة؟')) return;

    omo('🗑️ حذف الفاتورة', `
    <div style="background:var(--bg3);padding:14px;border-radius:8px;color:var(--danger)">
        <p>⚠️ هذا سيحذف الفاتورة من قاعدة البيانات</p>
        <p style="margin-top:10px;font-size:12px;color:var(--muted)">ملاحظة: لن يتم استرجاع المنتجات للمخزون تلقائياً</p>
    </div>`, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-danger" onclick="confirmDeleteSale(${id})">🗑️ حذف</button>`);
}

function confirmDeleteSale(id) {
    DB.deleteSale(id);
    cmo();
    toast('✅ تم حذف الفاتورة');
    sales('اليوم');
}

// ============================================
// المصاريف
// ============================================
function expenses() {
    const c = document.getElementById('pc');
    const allExpenses = DB.getExpenses ? DB.getExpenses() : [];

    c.innerHTML = `<div class="sb-bar"><input class="si" id="es" placeholder="🔍 بحث..." oninput="filterExpenses()"><button class="btn btn-success" onclick="addExpense()">+ إضافة مصروف</button></div>
    <div class="tw"><div class="th"><h3>💸 المصاريف</h3><span id="ecnt" style="color:var(--muted);font-size:13px"></span></div><div id="et">${ld()}</div></div>`;

    document.getElementById('ecnt').textContent = allExpenses.length + ' مصروف';
    renderExpenses(allExpenses);
}

function renderExpenses(expenses) {
    const el = document.getElementById('et');
    if (!el) return;

    if (!expenses.length) {
        el.innerHTML = em('لا توجد مصاريف');
        return;
    }

    el.innerHTML = `<table><tr><th>التاريخ</th><th>الوصف</th><th>المبلغ</th><th>النوع</th><th></th></tr>
    ${expenses.map(e => `<tr><td>${e.date}</td><td>${e.description}</td><td>${fmt(e.amount)}</td><td>${e.type || 'عام'}</td>
    <td style="white-space:nowrap"><button class="btn btn-danger btn-sm" onclick="deleteExpense(${e.id})">🗑️</button></td></tr>`).join('')}</table>`;
}

function addExpense() {
    omo('➕ إضافة مصروف', `
    <div class="fg">
        <div class="ff full"><label>الوصف</label><input id="ed" placeholder="وصف المصروف"></div>
        <div class="ff"><label>المبلغ</label><input id="ea" type="number" placeholder="0"></div>
        <div class="ff"><label>النوع</label><select id="et"><option>عام</option><option>إيجار</option><option>كهرباء</option><option>ماء</option><option>راتب</option><option>أخرى</option></select></div>
    </div>`, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="saveExpense()">💾 حفظ</button>`);
}

function saveExpense() {
    const description = document.getElementById('ed').value;
    const amount = parseFloat(document.getElementById('ea').value) || 0;
    const type = document.getElementById('et').value;

    if (!description || amount <= 0) {
        toast('يرجى ملء البيانات بشكل صحيح', 'error');
        return;
    }

    DB.saveExpense({ description, amount, type });
    cmo();
    toast('✅ تم حفظ المصروف');
    expenses();
}

function deleteExpense(id) {
    if (!confirm('هل تريد حذف هذا المصروف؟')) return;
    DB.deleteExpense(id);
    toast('✅ تم حذف المصروف');
    expenses();
}

function filterExpenses() {
    const search = document.getElementById('es')?.value || '';
    const allExpenses = DB.getExpenses ? DB.getExpenses() : [];

    if (!search) {
        renderExpenses(allExpenses);
        return;
    }

    const filtered = allExpenses.filter(e => 
        e.description.includes(search) ||
        e.type?.includes(search)
    );

    renderExpenses(filtered);
}

// ============================================
// إدارة المستخدمين
// ============================================
function users() {
    const c = document.getElementById('pc');
    const allUsers = DB.users;

    c.innerHTML = `<div class="sb-bar"><button class="btn btn-success" onclick="addUser()">+ إضافة مستخدم</button></div>
    <div class="tw"><div class="th"><h3>👥 المستخدمون</h3></div><div id="ut">${ld()}</div></div>`;

    document.getElementById('ut').innerHTML = allUsers.length
        ? `<table><tr><th>الاسم</th><th>اسم المستخدم</th><th>الدور</th><th></th></tr>
        ${allUsers.map(u => {
            const userJson = JSON.stringify(u);
            return `<tr><td>${u.name}</td><td>${u.username}</td><td>${u.role}</td>
            <td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" onclick="eUser(${userJson})">✏️</button> ${u.username !== 'admin' ? `<button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">🗑️</button>` : ''}</td></tr>`;
        }).join('')}</table>`
        : em();
}

function addUser() {
    omo('➕ إضافة مستخدم جديد', `
    <div class="fg">
        <div class="ff"><label>الاسم</label><input id="un" placeholder="اسم المستخدم"></div>
        <div class="ff"><label>اسم المستخدم</label><input id="uu" placeholder="username"></div>
        <div class="ff"><label>كلمة المرور</label><input id="up" type="password" placeholder="password"></div>
        <div class="ff"><label>الدور</label><select id="ur"><option value="user">مستخدم</option><option value="admin">مدير</option></select></div>
    </div>`, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="saveUser()">💾 حفظ</button>`);
}

function saveUser() {
    const name = document.getElementById('un').value;
    const username = document.getElementById('uu').value;
    const password = document.getElementById('up').value;
    const role = document.getElementById('ur').value;

    if (!name || !username || !password) {
        toast('يرجى ملء جميع الحقول', 'error');
        return;
    }

    // التحقق من عدم تكرار اسم المستخدم
    if (DB.users.find(u => u.username === username)) {
        toast('اسم المستخدم موجود بالفعل', 'error');
        return;
    }

    DB.saveUser({ name, username, password, role });
    cmo();
    toast('✅ تم إضافة المستخدم');
    users();
}

function eUser(u) {
    omo('✏️ تعديل المستخدم', `
    <div class="fg">
        <div class="ff"><label>الاسم</label><input id="eun" value="${u.name}"></div>
        <div class="ff"><label>اسم المستخدم</label><input id="euu" value="${u.username}" ${u.username === 'admin' ? 'readonly' : ''}></div>
        <div class="ff"><label>كلمة المرور</label><input id="eup" type="password" placeholder="اتركه فارغاً للإبقاء على الحالي"></div>
        <div class="ff"><label>الدور</label><select id="eur"><option value="user" ${u.role === 'user' ? 'selected' : ''}>مستخدم</option><option value="admin" ${u.role === 'admin' ? 'selected' : ''}>مدير</option></select></div>
    </div>`, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="updateUser(${u.id})">💾 حفظ</button>`);
}

function updateUser(id) {
    const user = DB.users.find(u => u.id === id);
    if (!user) return;

    user.name = document.getElementById('eun').value;
    if (user.username !== 'admin') {
        user.username = document.getElementById('euu').value;
    }
    const password = document.getElementById('eup').value;
    if (password) {
        user.password = password;
    }
    user.role = document.getElementById('eur').value;

    DB.saveUser(user);
    cmo();
    toast('✅ تم تحديث المستخدم');
    users();
}

function deleteUser(id) {
    if (!confirm('هل تريد حذف هذا المستخدم؟')) return;
    DB.deleteUser(id);
    toast('✅ تم حذف المستخدم');
    users();
}

// ============================================
// الإعدادات
// ============================================
function settings() {
    const settings = DB.settings;

    const c = document.getElementById('pc');
    c.innerHTML = `
    <div class="tw">
        <div class="th"><h3>⚙️ إعدادات النظام</h3></div>
        <div style="padding:20px">

            <!-- معلومات البرنامج -->
            <div class="settings-section">
                <h4>ℹ️ معلومات البرنامج</h4>
                <div class="fg">
                    <div class="ff full">
                        <label>📛 اسم البرنامج</label>
                        <input type="text" value="${settings.companyName || 'المستمر للمحاسبة وإدارة المحلات'}" readonly>
                    </div>
                    <div class="ff full">
                        <label>©️ حقوق النشر</label>
                        <input type="text" value="جميع الحقوق محفوظة" readonly>
                    </div>
                    <div class="ff full">
                        <label>📞 رقم التواصل</label>
                        <input type="text" value="0994748596" readonly>
                    </div>
                </div>
            </div>

            <!-- إعدادات النسخ الاحتياطي -->
            <div class="settings-section">
                <h4>💾 إعدادات النسخ الاحتياطي</h4>
                <div class="fg">
                    <div class="ff full">
                        <label>📁 مسار النسخ الاحتياطي الأساسي</label>
                        <input type="text" id="backup_path" value="${settings.backup_path || ''}" placeholder="مسار المجلد">
                    </div>
                    <div class="ff full">
                        <label>📁 مسار النسخ الاحتياطي الإضافي</label>
                        <input type="text" id="second_backup_path" value="${settings.second_backup_path || ''}" placeholder="مسار المجلد">
                    </div>
                    <div class="ff full">
                        <label>
                            <input type="checkbox" id="auto_backup" ${settings.auto_backup !== false ? 'checked' : ''}>
                            💾 نسخ احتياطي تلقائي عند إغلاق البرنامج
                        </label>
                    </div>
                </div>
            </div>

            <!-- إعدادات الفاتورة -->
            <div class="settings-section">
                <h4>📄 إعدادات الفاتورة</h4>
                <div class="fg">
                    <div class="ff full">
                        <label>
                            <input type="checkbox" id="print_invoice" ${settings.print_invoice !== false ? 'checked' : ''}>
                            🖨️ طباعة الفاتورة تلقائياً بعد البيع
                        </label>
                    </div>
                </div>
            </div>

            <!-- إعدادات رأس المال -->
            <div class="settings-section">
                <h4>💰 إعدادات رأس المال</h4>
                <div class="fg">
                    <div class="ff">
                        <label>💵 رأس المال اليدوي</label>
                        <input type="number" id="capital" value="${settings.capital || 0}">
                    </div>
                </div>
            </div>

            <!-- استرداد نسخة احتياطية -->
            <div class="settings-section">
                <h4>🔙 استرداد نسخة احتياطية</h4>
                <div class="fg">
                    <div class="ff full">
                        <label>📂 استرداد من القائمة</label>
                        <select id="backup_files">
                            <option value="">اختر نسخة احتياطية</option>
                        </select>
                    </div>
                    <div class="ff full">
                        <button class="btn btn-ghost" onclick="loadBackupFiles()">🔄 تحديث القائمة</button>
                    </div>
                    <div class="ff full">
                        <label>📂 استرداد من ملف خارجي</label>
                        <input type="file" id="external_backup" accept=".db,.backup,.json">
                    </div>
                </div>
                <div style="margin-top:15px">
                    <button class="btn btn-warn" onclick="restoreBackup()">🔙 استرداد النسخة المحددة</button>
                </div>
                <div style="margin-top:10px;color:var(--danger);font-size:12px">
                    ⚠️ تحذير: الاسترداد سيستبدل قاعدة البيانات الحالية!
                </div>
            </div>

            <!-- أزرار الحفظ والإلغاء -->
            <div style="margin-top:25px;display:flex;gap:10px;justify-content:flex-end">
                <button class="btn btn-success" onclick="saveSettings()">💾 حفظ الإعدادات</button>
                <button class="btn btn-danger" onclick="resetAllData()">🗑️ إعادة تعيين جميع البيانات</button>
            </div>
        </div>
    </div>`;

    // تحميل قائمة النسخ الاحتياطية
    loadBackupFiles();
}

function saveSettings() {
    const settings = {
        companyName: document.querySelector('input[value*="المستمر"]').value,
        currency: DB.settings.currency || 'د.أ',
        language: DB.settings.language || 'ar',
        theme: DB.settings.theme || 'dark',
        backup_path: document.getElementById('backup_path').value,
        second_backup_path: document.getElementById('second_backup_path').value,
        auto_backup: document.getElementById('auto_backup').checked,
        print_invoice: document.getElementById('print_invoice').checked,
        capital: parseFloat(document.getElementById('capital').value) || 0
    };

    DB.saveSettings(settings);
    toast('✅ تم حفظ الإعدادات بنجاح');
}

function resetAllData() {
    if (!confirm('⚠️ هل تريد حذف جميع البيانات؟\n\nهذا الإجراء نهائي ولا يمكن التراجع عنه!')) return;
    if (!confirm('🚨 تأكيد نهائي: سيتم حذف جميع البيانات!')) return;

    localStorage.clear();
    DB.init();
    toast('✅ تم إعادة تعيين جميع البيانات');
    location.reload();
}

// ============================================
// الصفحات الأخرى
// ============================================
// ═══════════════════════════════════════════════════════════
//  PRODUCTS (إدارة الموبايلات)
// ═══════════════════════════════════════════════════════════
let productsData = [];

function products() {
    const c = document.getElementById('pc');
    const allProducts = DB.products;

    c.innerHTML = `
    <div class="sb-bar">
        <input class="si" id="ps" placeholder="🔍 بحث..." oninput="filterProducts()">
        <select class="si" id="pcat" onchange="filterProducts()" style="width:150px">
            <option value="">كل الفئات</option>
            <option value="موبايلات">موبايلات</option>
            <option value="ملحقات">ملحقات</option>
            <option value="أجهزة لوحية">أجهزة لوحية</option>
            <option value="أخرى">أخرى</option>
        </select>
        <select class="si" id="pcond" onchange="filterProducts()" style="width:120px">
            <option value="">كل الحالات</option>
            <option value="جديد">جديد</option>
            <option value="مستعمل">مستعمل</option>
        </select>
        <button class="btn btn-success" onclick="addProduct()">+ إضافة منتج</button>
        <button class="btn btn-danger" onclick="deleteAllProducts()">🗑️ حذف الجميع</button>
    </div>
    <div class="tw">
        <div class="th">
            <h3>📱 إدارة الموبايلات</h3>
            <span id="pcnt" style="color:var(--muted);font-size:13px"></span>
        </div>
        <div id="pt">${ld()}</div>
    </div>`;

    document.getElementById('pcnt').textContent = allProducts.length + ' منتج';
    renderProducts(allProducts);
}

function renderProducts(products) {
    const el = document.getElementById('pt');
    if (!el) return;

    if (!products.length) {
        el.innerHTML = em('لا توجد منتجات');
        return;
    }

    el.innerHTML = `
    <table style="width:100%">
        <tr>
            <th>المنتج</th>
            <th>الماركة</th>
            <th>الفئة</th>
            <th>الحالة</th>
            <th>المخزون</th>
            <th>سعر الشراء</th>
            <th>سعر البيع</th>
            <th>الربح</th>
            <th></th>
        </tr>
        ${products.map(p => {
            const productJson = JSON.stringify(p);
            return `
        <tr style="${p.quantity <= p.min_stock ? 'background:rgba(255,71,87,.08)' : ''}">
            <td>
                <b>${p.name}</b>
                ${p.barcode ? `<br><span style="font-size:11px;color:var(--muted)">📊 ${p.barcode}</span>` : ''}
            </td>
            <td>${p.brand}</td>
            <td>${p.category}</td>
            <td>${p.condition || '-'}</td>
            <td>
                <span style="${p.quantity <= p.min_stock ? 'color:var(--danger);font-weight:700' : ''}">
                    ${p.quantity}
                </span>
                ${p.quantity <= p.min_stock ? '<span style="color:var(--danger);font-size:11px">⚠️ منخفض</span>' : ''}
            </td>
            <td>${fmt(p.cost_price)}</td>
            <td>${fmt(p.selling_price)}</td>
            <td style="color:var(--accent2)">${fmt(p.selling_price - p.cost_price)}</td>
            <td style="white-space:nowrap">
                <button class="btn btn-ghost btn-sm" onclick='eProduct(${productJson})' title="تعديل">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})" title="حذف">🗑️</button>
            </td>
        </tr>`;
        }).join('')}
    </table>`;
}

function filterProducts() {
    const search = document.getElementById('ps')?.value || '';
    const category = document.getElementById('pcat')?.value || '';
    const condition = document.getElementById('pcond')?.value || '';
    const allProducts = DB.products;

    let filtered = allProducts;

    if (search) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.brand.toLowerCase().includes(search.toLowerCase()) ||
            p.model?.toLowerCase().includes(search.toLowerCase()) ||
            p.barcode?.includes(search)
        );
    }

    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }

    if (condition) {
        filtered = filtered.filter(p => p.condition === condition);
    }

    renderProducts(filtered);
}

function renderProducts(products) {
    const container = document.getElementById('pt');

    if (products.length === 0) {
        container.innerHTML = em('لا توجد منتجات');
        return;
    }

    let html = '<table style="width:100%;border-collapse:collapse">';
    html += '<thead><tr style="background:var(--bg3)">';
    html += '<th style="padding:12px;text-align:right;border-bottom:2px solid var(--border)">الاسم</th>';
    html += '<th style="padding:12px;text-align:right;border-bottom:2px solid var(--border)">الماركة</th>';
    html += '<th style="padding:12px;text-align:right;border-bottom:2px solid var(--border)">الموديل</th>';
    html += '<th style="padding:12px;text-align:right;border-bottom:2px solid var(--border)">الفئة</th>';
    html += '<th style="padding:12px;text-align:right;border-bottom:2px solid var(--border)">الحالة</th>';
    html += '<th style="padding:12px;text-align:right;border-bottom:2px solid var(--border)">الكمية</th>';
    html += '<th style="padding:12px;text-align:right;border-bottom:2px solid var(--border)">سعر الشراء</th>';
    html += '<th style="padding:12px;text-align:right;border-bottom:2px solid var(--border)">سعر البيع</th>';
    html += '</tr></thead><tbody>';

    products.forEach(p => {
        html += `<tr style="border-bottom:1px solid var(--border);cursor:pointer" onclick="editProduct(${p.id})">`;
        html += `<td style="padding:12px">${p.name}</td>`;
        html += `<td style="padding:12px">${p.brand}</td>`;
        html += `<td style="padding:12px">${p.model || '-'}</td>`;
        html += `<td style="padding:12px">${p.category}</td>`;
        html += `<td style="padding:12px">${p.condition || '-'}</td>`;
        html += `<td style="padding:12px">${p.quantity}</td>`;
        html += `<td style="padding:12px">${fmt(p.cost_price)}</td>`;
        html += `<td style="padding:12px">${fmt(p.selling_price)}</td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
    document.getElementById('pcnt').textContent = `عدد المنتجات: ${products.length}`;
}

function editProduct(id) {
    const product = DB.products.find(p => p.id === id);
    if (!product) {
        toast('⚠️ لم يتم العثور على المنتج', 'error');
        return;
    }

    omo('✏️ تعديل منتج', `
    <div class="fg">
        <div class="ff full">
            <label>اسم المنتج *</label>
            <input id="epn" value="${product.name}">
        </div>
        <div class="ff">
            <label>الماركة *</label>
            <input id="epb" value="${product.brand}">
        </div>
        <div class="ff">
            <label>الموديل</label>
            <input id="epm" value="${product.model || ''}">
        </div>
        <div class="ff">
            <label>الفئة *</label>
            <select id="epcat">
                <option value="موبايلات" ${product.category === 'موبايلات' ? 'selected' : ''}>موبايلات</option>
                <option value="ملحقات" ${product.category === 'ملحقات' ? 'selected' : ''}>ملحقات</option>
                <option value="أجهزة لوحية" ${product.category === 'أجهزة لوحية' ? 'selected' : ''}>أجهزة لوحية</option>
                <option value="أخرى" ${product.category === 'أخرى' ? 'selected' : ''}>أخرى</option>
            </select>
        </div>
        <div class="ff">
            <label>الحالة</label>
            <select id="epcond">
                <option value="جديد" ${product.condition === 'جديد' ? 'selected' : ''}>جديد</option>
                <option value="مستعمل" ${product.condition === 'مستعمل' ? 'selected' : ''}>مستعمل</option>
                <option value="-" ${product.condition === '-' ? 'selected' : ''}>-</option>
            </select>
        </div>
        <div class="ff">
            <label>الكمية *</label>
            <input id="epqty" type="number" value="${product.quantity}">
        </div>
        <div class="ff">
            <label>سعر الشراء *</label>
            <input id="epcp" type="number" value="${product.cost_price}">
        </div>
        <div class="ff">
            <label>سعر البيع *</label>
            <input id="epsp" type="number" value="${product.selling_price}">
        </div>
        <div class="ff">
            <label>الباركود</label>
            <input id="epbar" value="${product.barcode || ''}">
        </div>
        <div class="ff">
            <label>الحد الأدنى</label>
            <input id="epmin" type="number" value="${product.min_stock || 5}">
        </div>
    </div>`,
    `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="saveProduct(${id})">💾 حفظ</button>`);
}

function addProduct() {
    omo('➕ إضافة منتج جديد', `
    <div class="fg">
        <div class="ff full">
            <label>اسم المنتج *</label>
            <input id="pn" placeholder="مثال: iPhone 15 Pro">
        </div>
        <div class="ff">
            <label>الماركة *</label>
            <input id="pb" placeholder="مثال: Apple">
        </div>
        <div class="ff">
            <label>الموديل</label>
            <input id="pm" placeholder="مثال: A1234">
        </div>
        <div class="ff">
            <label>الفئة *</label>
            <select id="pcat">
                <option value="موبايلات">موبايلات</option>
                <option value="ملحقات">ملحقات</option>
                <option value="أجهزة لوحية">أجهزة لوحية</option>
                <option value="أخرى">أخرى</option>
            </select>
        </div>
        <div class="ff">
            <label>الحالة</label>
            <select id="pcond">
                <option value="جديد">جديد</option>
                <option value="مستعمل">مستعمل</option>
                <option value="-">-</option>
            </select>
        </div>
        <div class="ff">
            <label>الكمية *</label>
            <input id="pq" type="number" value="1" min="0">
        </div>
        <div class="ff">
            <label>الحد الأدنى</label>
            <input id="pmin" type="number" value="5" min="0">
        </div>
        <div class="ff">
            <label>سعر الشراء *</label>
            <input id="pcp" type="number" value="0" step="0.01">
        </div>
        <div class="ff">
            <label>سعر البيع *</label>
            <input id="psp" type="number" value="0" step="0.01">
        </div>
        <div class="ff full">
            <label>الباركود</label>
            <input id="pbar" placeholder="اختياري">
        </div>
    </div>`, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="saveProduct()">💾 حفظ</button>`);
}

function saveProduct() {
    const name = document.getElementById('pn').value;
    const brand = document.getElementById('pb').value;
    const model = document.getElementById('pm').value;
    const category = document.getElementById('pcat').value;
    const condition = document.getElementById('pcond').value;
    const quantity = parseInt(document.getElementById('pq').value) || 0;
    const min_stock = parseInt(document.getElementById('pmin').value) || 5;
    const cost_price = parseFloat(document.getElementById('pcp').value) || 0;
    const selling_price = parseFloat(document.getElementById('psp').value) || 0;
    const barcode = document.getElementById('pbar').value;

    if (!name || !brand || !category || cost_price <= 0 || selling_price <= 0) {
        toast('يرجى ملء جميع الحقول المطلوبة بشكل صحيح', 'error');
        return;
    }

    DB.saveProduct({
        name,
        brand,
        model,
        category,
        condition,
        quantity,
        min_stock,
        cost_price,
        selling_price,
        barcode
    });

    cmo();
    toast('✅ تم حفظ المنتج');
    products();
}

function deleteAllProducts() {
    const allProducts = DB.products;

    if (!allProducts.length) {
        toast('لا توجد منتجات للحذف', 'error');
        return;
    }

    omo('🗑️ حذف جميع المنتجات', `
        <div class="fg">
            <div class="ff full" style="background:rgba(255,71,87,.1);border:1px solid var(--danger);border-radius:8px;padding:15px;margin-bottom:15px">
                <p style="color:var(--danger);font-size:14px;margin:0">
                    ⚠️ هل أنت متأكد من حذف جميع المنتجات؟
                </p>
                <p style="color:var(--danger);font-size:13px;margin:5px 0 0 0">
                    عدد المنتجات: ${allProducts.length}
                </p>
                <p style="color:var(--danger);font-size:13px;margin:5px 0 0 0">
                    ⚠️ هذه العملية لا يمكن التراجع عنها!
                </p>
            </div>
        </div>
    `, `
        <button class="btn btn-ghost" onclick="cmo()">إلغاء</button>
        <button class="btn btn-danger" onclick="confirmDeleteAllProducts()">🗑️ حذف جميع المنتجات</button>
    `);
}

function confirmDeleteAllProducts() {
    const allProducts = DB.products;

    if (!allProducts.length) {
        toast('لا توجد منتجات للحذف', 'error');
        cmo();
        return;
    }

    // حذف جميع المنتجات
    localStorage.setItem(DB.getDBKey('products'), JSON.stringify([]));

    cmo();
    toast(`✅ تم حذف ${allProducts.length} منتج بنجاح`);
    products();
}

function eProduct(p) {
    omo('✏️ تعديل المنتج', `
    <div class="fg">
        <div class="ff full">
            <label>اسم المنتج *</label>
            <input id="epn" value="${p.name}">
        </div>
        <div class="ff">
            <label>الماركة *</label>
            <input id="epb" value="${p.brand}">
        </div>
        <div class="ff">
            <label>الموديل</label>
            <input id="epm" value="${p.model || ''}">
        </div>
        <div class="ff">
            <label>الفئة *</label>
            <select id="epcat">
                <option value="موبايلات" ${p.category === 'موبايلات' ? 'selected' : ''}>موبايلات</option>
                <option value="ملحقات" ${p.category === 'ملحقات' ? 'selected' : ''}>ملحقات</option>
                <option value="أجهزة لوحية" ${p.category === 'أجهزة لوحية' ? 'selected' : ''}>أجهزة لوحية</option>
                <option value="أخرى" ${p.category === 'أخرى' ? 'selected' : ''}>أخرى</option>
            </select>
        </div>
        <div class="ff">
            <label>الحالة</label>
            <select id="epcond">
                <option value="جديد" ${p.condition === 'جديد' ? 'selected' : ''}>جديد</option>
                <option value="مستعمل" ${p.condition === 'مستعمل' ? 'selected' : ''}>مستعمل</option>
                <option value="-" ${p.condition === '-' || !p.condition ? 'selected' : ''}>-</option>
            </select>
        </div>
        <div class="ff">
            <label>الكمية *</label>
            <input id="epq" type="number" value="${p.quantity}" min="0">
        </div>
        <div class="ff">
            <label>الحد الأدنى</label>
            <input id="epmin" type="number" value="${p.min_stock}" min="0">
        </div>
        <div class="ff">
            <label>سعر الشراء *</label>
            <input id="epcp" type="number" value="${p.cost_price}" step="0.01">
        </div>
        <div class="ff">
            <label>سعر البيع *</label>
            <input id="epsp" type="number" value="${p.selling_price}" step="0.01">
        </div>
        <div class="ff full">
            <label>الباركود</label>
            <input id="epbar" value="${p.barcode || ''}">
        </div>
    </div>`, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="updateProduct(${p.id})">💾 حفظ</button>`);
}

function updateProduct(id) {
    const product = DB.products.find(p => p.id === id);
    if (!product) return;

    product.name = document.getElementById('epn').value;
    product.brand = document.getElementById('epb').value;
    product.model = document.getElementById('epm').value;
    product.category = document.getElementById('epcat').value;
    product.condition = document.getElementById('epcond').value;
    product.quantity = parseInt(document.getElementById('epq').value) || 0;
    product.min_stock = parseInt(document.getElementById('epmin').value) || 5;
    product.cost_price = parseFloat(document.getElementById('epcp').value) || 0;
    product.selling_price = parseFloat(document.getElementById('epsp').value) || 0;
    product.barcode = document.getElementById('epbar').value;

    if (!product.name || !product.brand || !product.category || product.cost_price <= 0 || product.selling_price <= 0) {
        toast('يرجى ملء جميع الحقول المطلوبة بشكل صحيح', 'error');
        return;
    }

    DB.saveProduct(product);
    cmo();
    toast('✅ تم تحديث المنتج');
    products();
}

function deleteProduct(id) {
    if (!confirm('هل تريد حذف هذا المنتج؟')) return;

    // التحقق من عدم وجود المنتج في مبيعات نشطة
    const hasActiveSales = DB.sales.some(sale => 
        sale.items.some(item => item.product_id === id)
    );

    if (hasActiveSales) {
        toast('⚠️ لا يمكن حذف المنتج لأنه موجود في مبيعات سابقة', 'error');
        return;
    }

    DB.deleteProduct(id);
    toast('✅ تم حذف المنتج');
    products();
}

// ═══════════════════════════════════════════════════════════
//  PURCHASES
// ═══════════════════════════════════════════════════════════
let purchasesData=[];

async function purchases(pr='شهر'){
  const c=document.getElementById('pc');
  let html=`
  <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:18px">
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
      <input id="purch-search" type="text" placeholder="🔍 بحث في الفواتير..." class="si" style="flex:1;min-width:200px" onkeyup="filterPurchasesTable()">
      <input id="purch-from" type="date" class="si" style="flex:0;width:150px" onchange="filterPurchasesTable()">
      <input id="purch-to" type="date" class="si" style="flex:0;width:150px" onchange="filterPurchasesTable()">
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      ${['أسبوع','شهر','سنة','كل الوقت'].map(p=>`<button class="btn ${p===pr?'btn-success':'btn-ghost'} btn-sm" onclick="purchasesPeriod('${p}')">${p}</button>`).join('')}
      <div style="flex:1"></div>
      <button class="btn btn-danger" onclick="deleteAllPurchases()" style="padding:10px 15px;font-size:14px;font-weight:700">🗑️ حذف الجميع</button>
      <button class="btn btn-success" onclick="openAddPurch()" style="padding:10px 22px;font-size:15px;font-weight:700">🛒 إضافة فاتورة شراء</button>
    </div>
  </div>
  <div class="tw">
    <div class="th"><h3>🛍️ سجل المشتريات</h3><span id="purch-stats" style="color:var(--muted);font-size:13px"></span></div>
    <div id="purchases-table" style="overflow-x:auto"></div>
  </div>`;
  c.innerHTML=html;
  const r=await api(`/api/purchases?period=${encodeURIComponent(pr)}`);
  purchasesData=r.data||[];
  const[fromD,toD]=getDatesForPeriod(pr);
  const total=purchasesData.reduce((s,p)=>s+p.total_amount,0);
  const rem=purchasesData.reduce((s,p)=>s+p.remaining_amount,0);
  document.getElementById('purch-stats').textContent=`${purchasesData.length} فاتورة | الإجمالي: ${fmt(total)} | المتبقي: ${fmt(rem)}`;
  renderPurchasesTable(purchasesData);
  setTimeout(()=>{document.getElementById('purch-from').value=fromD;document.getElementById('purch-to').value=toD;},0);
}

// ── فتح واجهة إضافة فاتورة شراء (كاملة بدون مودال) ──────────
let purchCart=[];
let purchProds=[];
let purchSups=[];

async function openAddPurch(){
  const[sr,pr]=await Promise.all([api('/api/suppliers'),api('/api/products')]);
  purchSups=sr.data||[];
  purchProds=pr.data||[];
  purchCart=[];

  const ov=document.createElement('div');
  ov.id='purch-overlay';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px';
  ov.innerHTML=`
  <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;width:100%;max-width:900px;max-height:95vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.7)">
    <!-- Header -->
    <div style="padding:18px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,rgba(0,212,255,.08),rgba(0,255,157,.04))">
      <h2 style="margin:0;font-size:18px;color:var(--accent)">🛒 إضافة فاتورة شراء جديدة</h2>
      <button onclick="closePurchOverlay()" style="background:none;border:none;color:var(--muted);font-size:22px;cursor:pointer;line-height:1">✕</button>
    </div>

    <!-- Tabs: existing / new product -->
    <div style="padding:10px 22px 0;border-bottom:1px solid var(--border);display:flex;gap:0">
      <button id="tab-exist" onclick="switchPurchTab('exist')" style="padding:9px 20px;border:none;border-bottom:3px solid var(--accent);background:rgba(0,212,255,.08);color:var(--accent);font-family:Cairo,sans-serif;font-size:14px;font-weight:700;cursor:pointer;border-radius:8px 8px 0 0">📦 منتج موجود</button>
      <button id="tab-new" onclick="switchPurchTab('new')" style="padding:9px 20px;border:none;border-bottom:3px solid transparent;background:none;color:var(--muted);font-family:Cairo,sans-serif;font-size:14px;font-weight:600;cursor:pointer;border-radius:8px 8px 0 0">✨ منتج جديد</button>
    </div>

    <!-- Tab: Existing Product -->
    <div id="purch-tab-exist" style="padding:14px 22px;border-bottom:1px solid var(--border)">
      <!-- Supplier row inside tab -->
      <div style="display:flex;gap:10px;align-items:flex-end;margin-bottom:12px;flex-wrap:wrap">
        <div style="flex:2;min-width:180px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">🏢 المورد (اختياري)</label>
          <select id="pu-sup" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 12px;color:var(--text);font-size:14px">
            <option value="">— بدون مورد —</option>
            ${purchSups.map(s=>`<option value="${s.id}">${s.name}${s.phone?' ('+s.phone+')':''}</option>`).join('')}
          </select>
        </div>
        <button onclick="quickAddSupplierInline()" style="padding:9px 14px;background:rgba(0,212,255,.1);border:1px solid var(--accent);border-radius:7px;color:var(--accent);font-size:13px;cursor:pointer;white-space:nowrap;font-family:Cairo,sans-serif">➕ مورد جديد</button>
      </div>
      <!-- Product row -->
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
        <div style="flex:2;min-width:180px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">المنتج</label>
          <input id="pu-prod-search" list="pu-prod-list" placeholder="ابحث أو اختر منتج..." autocomplete="off"
            style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 12px;color:var(--text);font-size:14px">
          <datalist id="pu-prod-list">
            ${purchProds.map(p=>`<option value="${p.name}" data-id="${p.id}">${p.brand} | مخزون: ${p.quantity} | شراء: ${p.cost_price}</option>`).join('')}
          </datalist>
        </div>
        <div style="width:80px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">الكمية</label>
          <input id="pu-exist-qty" type="number" value="1" min="1" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 10px;color:var(--text);font-size:14px">
        </div>
        <div style="width:120px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">سعر الشراء</label>
          <input id="pu-exist-price" type="number" value="0" step="0.01" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 10px;color:var(--text);font-size:14px">
        </div>
        <div style="width:120px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">سعر البيع</label>
          <input id="pu-exist-sell" type="number" value="0" step="0.01" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 10px;color:var(--text);font-size:14px">
        </div>
        <button onclick="addExistToPurchCart()" style="padding:9px 18px;background:var(--accent2);color:#0f1923;border:none;border-radius:7px;font-weight:700;font-size:14px;cursor:pointer;white-space:nowrap;font-family:Cairo,sans-serif">➕ إضافة</button>
      </div>
    </div>

    <!-- Tab: New Product -->
    <div id="purch-tab-new" style="padding:14px 22px;border-bottom:1px solid var(--border);display:none">
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
        <div style="flex:2;min-width:140px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">الاسم *</label>
          <input id="pu-new-name" placeholder="اسم المنتج" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 12px;color:var(--text);font-size:14px">
        </div>
        <div style="flex:1;min-width:100px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">الماركة *</label>
          <input id="pu-new-brand" placeholder="Apple..." style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 12px;color:var(--text);font-size:14px">
        </div>
        <div style="width:110px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">الفئة</label>
          <select id="pu-new-cat" onchange="togglePurchCondition()" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 8px;color:var(--text);font-size:13px">
            <option>موبايلات</option><option>ملحقات</option><option>أجهزة لوحية</option><option>أخرى</option>
          </select>
        </div>
        <div id="pu-cond-wrap" style="width:95px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">الحالة</label>
          <select id="pu-new-cond" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 8px;color:var(--text);font-size:13px">
            <option>جديد</option><option>مستعمل</option>
          </select>
        </div>
        <div style="width:70px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">الكمية</label>
          <input id="pu-new-qty" type="number" value="1" min="1" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 8px;color:var(--text);font-size:14px">
        </div>
        <div style="width:110px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">سعر الشراء *</label>
          <input id="pu-new-cost" type="number" value="0" step="0.01" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 8px;color:var(--text);font-size:14px">
        </div>
        <div style="width:110px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">سعر البيع</label>
          <input id="pu-new-sell" type="number" value="0" step="0.01" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 8px;color:var(--text);font-size:14px">
        </div>
        <div style="width:110px">
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">الباركود</label>
          <input id="pu-new-bar" placeholder="اختياري" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 8px;color:var(--text);font-size:13px">
        </div>
        <button onclick="addNewToPurchCart()" style="padding:9px 18px;background:var(--accent2);color:#0f1923;border:none;border-radius:7px;font-weight:700;font-size:14px;cursor:pointer;white-space:nowrap;font-family:Cairo,sans-serif">➕ إضافة</button>
      </div>
    </div>

    <!-- Cart -->
    <div style="flex:1;overflow-y:auto;padding:0 22px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0 6px">
        <b style="color:var(--accent);font-size:14px">📋 المنتجات المضافة</b>
        <span id="pu-cart-cnt" style="color:var(--muted);font-size:13px">0 منتج</span>
      </div>
      <div id="pu-cart-table"></div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 22px;border-top:1px solid var(--border);background:var(--bg3);border-radius:0 0 16px 16px">
      <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="color:var(--muted);font-size:14px">المبلغ الإجمالي:</span>
          <span id="pu-total" style="font-size:22px;font-weight:900;color:var(--accent)">0</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <label style="color:var(--muted);font-size:14px;white-space:nowrap">المبلغ المدفوع:</label>
          <input id="pu-paid" type="number" value="0" step="0.01" style="width:140px;background:var(--bg2);border:2px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:15px;font-weight:700">
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="color:var(--muted);font-size:13px">المتبقي:</span>
          <span id="pu-remaining" style="font-size:16px;font-weight:700;color:var(--warn)">0</span>
        </div>
        <div style="flex:1"></div>
        <button onclick="closePurchOverlay()" style="padding:11px 22px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;cursor:pointer;font-family:Cairo,sans-serif">إلغاء</button>
        <button onclick="savePurchNew()" style="padding:11px 26px;background:var(--accent2);color:#0f1923;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;font-family:Cairo,sans-serif">💾 حفظ الفاتورة</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(ov);
  document.getElementById('pu-paid').addEventListener('input',updatePurchTotals);
}

function quickAddSupplierInline(){
  const div=document.createElement('div');
  div.id='quick-sup-popup';
  div.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:400;display:flex;align-items:center;justify-content:center';
  div.innerHTML=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:24px;width:400px;max-width:95vw">
    <h3 style="margin:0 0 16px;color:var(--accent)">➕ إضافة مورد جديد</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
      <div><label style="font-size:12px;color:var(--muted)">الاسم *</label><input id="qsn" style="width:100%;margin-top:5px;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 10px;color:var(--text);font-size:14px"></div>
      <div><label style="font-size:12px;color:var(--muted)">الهاتف</label><input id="qsp" style="width:100%;margin-top:5px;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:9px 10px;color:var(--text);font-size:14px"></div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button onclick="document.getElementById('quick-sup-popup').remove()" style="padding:9px 18px;background:var(--bg3);border:1px solid var(--border);border-radius:7px;color:var(--text);cursor:pointer;font-family:Cairo,sans-serif">إلغاء</button>
      <button onclick="saveQuickSupplier()" style="padding:9px 20px;background:var(--accent2);color:#0f1923;border:none;border-radius:7px;font-weight:700;cursor:pointer;font-family:Cairo,sans-serif">💾 حفظ</button>
    </div>
  </div>`;
  document.body.appendChild(div);
  setTimeout(()=>document.getElementById('qsn')?.focus(),100);
}

async function saveQuickSupplier(){
  const name=document.getElementById('qsn')?.value.trim();
  const phone=document.getElementById('qsp')?.value.trim()||'';
  if(!name){toast('أدخل اسم المورد','error');return;}
  const r=await api('/api/suppliers/add','POST',{name,phone,email:'',address:''});
  if(r.success){
    document.getElementById('quick-sup-popup')?.remove();
    toast('✅ تم إضافة المورد');
    const sr=await api('/api/suppliers');
    purchSups=sr.data||[];
    const sel=document.getElementById('pu-sup');
    if(sel){
      const cur=sel.value;
      sel.innerHTML=`<option value="">— بدون مورد —</option>${purchSups.map(s=>`<option value="${s.id}">${s.name}${s.phone?' ('+s.phone+')':''}</option>`).join('')}`;
      if(r.data?.id) sel.value=r.data.id;
      else sel.value=cur;
    }
  }else toast(r.message,'error');
}

function closePurchOverlay(){document.getElementById('purch-overlay')?.remove();}

function switchPurchTab(tab){
  const isExist=tab==='exist';
  document.getElementById('purch-tab-exist').style.display=isExist?'block':'none';
  document.getElementById('purch-tab-new').style.display=isExist?'none':'block';
  document.getElementById('tab-exist').style.cssText=`padding:9px 20px;border:none;border-bottom:3px solid ${isExist?'var(--accent)':'transparent'};background:${isExist?'rgba(0,212,255,.08)':'none'};color:${isExist?'var(--accent)':'var(--muted)'};font-family:Cairo,sans-serif;font-size:14px;font-weight:${isExist?700:600};cursor:pointer;border-radius:8px 8px 0 0`;
  document.getElementById('tab-new').style.cssText=`padding:9px 20px;border:none;border-bottom:3px solid ${!isExist?'var(--accent)':'transparent'};background:${!isExist?'rgba(0,212,255,.08)':'none'};color:${!isExist?'var(--accent)':'var(--muted)'};font-family:Cairo,sans-serif;font-size:14px;font-weight:${!isExist?700:600};cursor:pointer;border-radius:8px 8px 0 0`;
}

function togglePurchCondition(){
  const cat=document.getElementById('pu-new-cat')?.value;
  const wrap=document.getElementById('pu-cond-wrap');
  if(wrap) wrap.style.display=cat==='موبايلات'?'block':'none';
}

function updatePurchTotals(){
  const total=purchCart.reduce((s,i)=>s+i.total,0);
  const paid=parseFloat(document.getElementById('pu-paid')?.value)||0;
  const rem=document.getElementById('pu-remaining');
  if(rem) rem.textContent=fmt(Math.max(0,total-paid));
  if(rem) rem.style.color=total-paid>0?'var(--warn)':'var(--accent2)';
  const el=document.getElementById('pu-total');
  if(el) el.textContent=fmt(total);
}

function renderPurchCart(){
  const el=document.getElementById('pu-cart-table');
  if(!el)return;
  const cnt=document.getElementById('pu-cart-cnt');
  if(cnt) cnt.textContent=purchCart.length+' منتج';
  if(!purchCart.length){
    el.innerHTML=`<div style="text-align:center;padding:28px;color:var(--muted)">📭 لم تُضف أي منتجات بعد</div>`;
    updatePurchTotals();return;
  }
  el.innerHTML=`<table style="width:100%;border-collapse:collapse">
    <tr style="background:var(--bg3)"><th style="padding:9px 12px;text-align:right;font-size:12px;color:var(--muted)">المنتج</th><th style="padding:9px;font-size:12px;color:var(--muted)">الكمية</th><th style="padding:9px;font-size:12px;color:var(--muted)">سعر الشراء</th><th style="padding:9px;font-size:12px;color:var(--muted)">سعر البيع</th><th style="padding:9px;font-size:12px;color:var(--muted)">المجموع</th><th style="padding:9px"></th></tr>
    ${purchCart.map((item,i)=>`<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:10px 12px">
        <b>${item.name}</b><br>
        <span style="font-size:11px;color:var(--muted)">${item.isNew?'🆕 منتج جديد':'📦 موجود'} | ${item.category||''}</span>
      </td>
      <td style="padding:10px;text-align:center">
        <input type="number" value="${item.quantity}" min="1" 
          onchange="updatePurchCartItem(${i}, this.value)"
          style="width:60px;padding:5px;border:1px solid var(--border);border-radius:5px;background:var(--bg2);color:var(--text);text-align:center;font-size:13px">
      </td>
      <td style="padding:10px;text-align:center">
        <input type="number" value="${item.cost_price}" step="0.01" min="0"
          onchange="updatePurchCartItem(${i}, 'cost', this.value)"
          style="width:80px;padding:5px;border:1px solid var(--border);border-radius:5px;background:var(--bg2);color:var(--accent);text-align:center;font-size:13px">
      </td>
      <td style="padding:10px;text-align:center">
        <input type="number" value="${item.sell_price||0}" step="0.01" min="0"
          onchange="updatePurchCartItem(${i}, 'sell', this.value)"
          style="width:80px;padding:5px;border:1px solid var(--border);border-radius:5px;background:var(--bg2);color:var(--accent2);text-align:center;font-size:13px">
      </td>
      <td style="padding:10px;text-align:center;font-weight:700">${fmt(item.total)}</td>
      <td style="padding:10px">
        <button onclick="removePurchCartItem(${i})" 
          style="background:rgba(255,71,87,.15);border:none;color:var(--danger);padding:5px 10px;border-radius:5px;cursor:pointer">
          🗑️
        </button>
      </td>
    </tr>`).join('')}
  </table>`;
  updatePurchTotals();
}

function updatePurchCartItem(index, field, value) {
  const item = purchCart[index];
  if (!item) return;

  if (field === 'cost') {
    item.cost_price = parseFloat(value) || 0;
  } else if (field === 'sell') {
    item.sell_price = parseFloat(value) || 0;
  } else {
    item.quantity = parseInt(value) || 1;
  }

  item.total = item.quantity * item.cost_price;
  renderPurchCart();
}

function removePurchCartItem(i){purchCart.splice(i,1);renderPurchCart();}

function addExistToPurchCart(){
  const name=document.getElementById('pu-prod-search').value.trim();
  const qty=parseInt(document.getElementById('pu-exist-qty').value)||1;
  const price=parseFloat(document.getElementById('pu-exist-price').value)||0;
  const sell=parseFloat(document.getElementById('pu-exist-sell').value)||0;
  if(!name){toast('اختر منتجاً','error');return;}
  if(qty<=0){toast('الكمية يجب أن تكون أكبر من صفر','error');return;}
  const prod=purchProds.find(p=>p.name===name);
  if(!prod){toast('المنتج غير موجود في القائمة','error');return;}
  const exist=purchCart.find(c=>c.id===prod.id&&!c.isNew);
  if(exist){exist.quantity+=qty;exist.total=exist.quantity*exist.cost_price;}
  else purchCart.push({id:prod.id,name:prod.name,category:prod.category,quantity:qty,cost_price:price||prod.cost_price,sell_price:sell||prod.selling_price,total:qty*(price||prod.cost_price),isNew:false});
  renderPurchCart();
  document.getElementById('pu-prod-search').value='';
  document.getElementById('pu-exist-qty').value='1';
  document.getElementById('pu-exist-price').value='0';
  document.getElementById('pu-exist-sell').value='0';
  const total=purchCart.reduce((s,i)=>s+i.total,0);
  document.getElementById('pu-paid').value=total.toFixed(2);
  updatePurchTotals();
}

async function addNewToPurchCart(){
  const name=document.getElementById('pu-new-name').value.trim();
  const brand=document.getElementById('pu-new-brand').value.trim();
  const cat=document.getElementById('pu-new-cat').value;
  const cond=document.getElementById('pu-new-cond')?.value||'جديد';
  const qty=parseInt(document.getElementById('pu-new-qty').value)||1;
  const cost=parseFloat(document.getElementById('pu-new-cost').value)||0;
  const sell=parseFloat(document.getElementById('pu-new-sell').value)||0;
  const bar=document.getElementById('pu-new-bar').value.trim();
  if(!name||!brand){toast('اسم المنتج والماركة مطلوبان','error');return;}
  if(qty<=0){toast('الكمية يجب أن تكون أكبر من صفر','error');return;}
  const r=await api('/api/products/add','POST',{name,brand,model:'-',category:cat,cost_price:cost,selling_price:sell||cost,quantity:0,min_stock:5,barcode:bar||null,condition:cond});
  if(!r.success){toast(r.message,'error');return;}
  purchCart.push({id:r.data?.id||null,name,category:cat,quantity:qty,cost_price:cost,sell_price:sell,total:qty*cost,isNew:true,isJustCreated:true});
  renderPurchCart();
  document.getElementById('pu-new-name').value='';
  document.getElementById('pu-new-brand').value='';
  document.getElementById('pu-new-qty').value='1';
  document.getElementById('pu-new-cost').value='0';
  document.getElementById('pu-new-sell').value='0';
  document.getElementById('pu-new-bar').value='';
  const pr2=await api('/api/products');
  purchProds=pr2.data||[];
  document.getElementById('pu-prod-list').innerHTML=purchProds.map(p=>`<option value="${p.name}">${p.brand} | مخزون: ${p.quantity}</option>`).join('');
  toast('✅ تم إنشاء المنتج وإضافته');
  const total=purchCart.reduce((s,i)=>s+i.total,0);
  document.getElementById('pu-paid').value=total.toFixed(2);
  updatePurchTotals();
}

async function savePurchNew(){
  if(!purchCart.length){toast('أضف منتجات أولاً','error');return;}
  const total=purchCart.reduce((s,i)=>s+i.total,0);
  const paid=parseFloat(document.getElementById('pu-paid')?.value)||0;
  const supEl=document.getElementById('pu-sup');
  const supId=supEl&&supEl.value?parseInt(supEl.value):null;
  const items=purchCart.filter(item=>item.id).map(item=>({
    product_id:item.id,
    quantity:item.quantity,
    unit_price:item.cost_price||0,
    sell_price:item.sell_price||0
  }));
  if(!items.length){toast('تأكد من إضافة منتجات صحيحة','error');return;}
  const r=await api('/api/purchases/add','POST',{supplier_id:supId,paid_amount:paid,items});
  if(r.success){
    closePurchOverlay();
    toast(`✅ تم حفظ الفاتورة ${r.data?.invoice_number||''} | الإجمالي: ${fmt(total)}`);
    purchases('شهر');
  }else toast(r.message,'error');
}

function renderPurchasesTable(data){
  const tbl=document.getElementById('purchases-table');
  if(!data||!data.length){tbl.innerHTML=em('لا توجد مشتريات');return;}
  tbl.innerHTML=`<table style="width:100%">
    <tr><th>رقم الفاتورة</th><th>المورد</th><th>التاريخ</th><th>الإجمالي</th><th>المدفوع</th><th>المتبقي</th><th></th></tr>
    ${data.map(p=>`<tr>
      <td><b style="color:var(--accent)">${p.invoice_number}</b></td>
      <td>${p.supplier_name||'—'}</td>
      <td>${p.purchase_date}</td>
      <td>${fmt(p.total_amount)}</td>
      <td>${fmt(p.paid_amount)}</td>
      <td><span class="badge ${p.remaining_amount>0?'br':'bg'}">${fmt(p.remaining_amount)}</span></td>
      <td style="white-space:nowrap">
        <button class="btn btn-primary btn-sm" onclick="showPurchaseDetails(${p.id})" title="عرض التفاصيل">📄 التفاصيل</button>
        ${p.remaining_amount>0?`<button class="btn btn-warn btn-sm" onclick="payPurch(${p.id},${p.remaining_amount})">💳 دفع</button>`:''}
        <button class="btn btn-danger btn-sm" onclick="dPurch(${p.id})">🗑️ حذف</button>
      </td>
    </tr>`).join('')}
  </table>`;
}

function filterPurchasesTable(){
  const search=document.getElementById('purch-search').value.toLowerCase();
  const from=document.getElementById('purch-from').value;
  const to=document.getElementById('purch-to').value;
  const filtered=purchasesData.filter(p=>{
    const matchSearch=!search||p.invoice_number.toLowerCase().includes(search)||(p.supplier_name||'').toLowerCase().includes(search);
    const matchFrom=!from||p.purchase_date>=from;
    const matchTo=!to||p.purchase_date<=to;
    return matchSearch&&matchFrom&&matchTo;
  });
  renderPurchasesTable(filtered);
}

function purchasesPeriod(period){purchases(period);}

// دالة عرض تفاصيل فاتورة الشراء بشكل مفصل
async function showPurchaseDetails(id){
  const r=await api(`/api/purchases/${id}`);
  if(!r.success){toast('خطأ في تحميل البيانات','error');return;}
  const{purchase,details}=r.data;
  console.log('Purchase:', purchase);
  console.log('Details:', details);
  console.log('Items:', purchase.items);

  if(!purchase){toast('فاتورة الشراء غير موجودة','error');return;}
  if(!purchase.invoice_number){toast('رقم الفاتورة غير موجود','error');return;}

  let html=`
  <div style="background:var(--bg3);padding:20px;border-radius:12px;margin-bottom:20px;border-left:4px solid var(--accent)">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:16px">
      <div>
        <div style="color:var(--muted);font-size:12px;margin-bottom:4px">🧾 رقم الفاتورة</div>
        <div style="font-weight:700;color:var(--accent);font-size:18px">${purchase.invoice_number}</div>
      </div>
      <div>
        <div style="color:var(--muted);font-size:12px;margin-bottom:4px">📅 التاريخ</div>
        <div style="font-weight:600;font-size:16px">${purchase.purchase_date || 'لم يتم تحديده'}</div>
      </div>
      <div>
        <div style="color:var(--muted);font-size:12px;margin-bottom:4px">🏢 المورد</div>
        <div style="font-weight:600;font-size:16px">${purchase.supplier_name||'بدون مورد'}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;padding-top:16px;border-top:1px solid var(--border)">
      <div style="padding:12px;background:rgba(0,212,255,.1);border-radius:8px">
        <div style="color:var(--muted);font-size:11px;margin-bottom:4px">💰 الإجمالي</div>
        <div style="font-weight:700;color:var(--accent);font-size:20px">${fmt(purchase.total_amount)}</div>
      </div>
      <div style="padding:12px;background:rgba(0,255,157,.1);border-radius:8px">
        <div style="color:var(--muted);font-size:11px;margin-bottom:4px">✅ المدفوع</div>
        <div style="font-weight:700;color:var(--accent2);font-size:20px">${fmt(purchase.paid_amount)}</div>
      </div>
      <div style="padding:12px;background:rgba(${purchase.remaining_amount>0?'255,71,87':'0,255,157'},.1);border-radius:8px">
        <div style="color:var(--muted);font-size:11px;margin-bottom:4px">⏳ المتبقي</div>
        <div style="font-weight:700;color:${purchase.remaining_amount>0?'var(--danger)':'var(--accent2)'};font-size:20px">${fmt(purchase.remaining_amount)}</div>
      </div>
    </div>
  </div>

  <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:20px">
    <div style="padding:16px;background:var(--bg3);border-bottom:1px solid var(--border);font-weight:700;color:var(--accent);font-size:16px">📦 المنتجات (${details.length})</div>
    <table style="width:100%;margin:0">
      <tr style="background:var(--bg3)">
        <th style="padding:12px;text-align:right;font-size:13px">🏷️ المنتج</th>
        <th style="padding:12px;font-size:13px">📊 الكمية</th>
        <th style="padding:12px;font-size:13px">💵 سعر الشراء</th>
        <th style="padding:12px;font-size:13px">💵 سعر البيع</th>
        <th style="padding:12px;font-size:13px">🧮 الإجمالي</th>
        <th style="padding:12px;font-size:13px">✏️ تعديل</th>
      </tr>
      ${details.map(d=>{
        const product = DB.products.find(p => p.id === d.product_id);
        return `
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:14px;border-bottom:1px solid var(--border)">
          <b style="color:var(--accent);font-size:15px">${product?.name || d.product_name || 'غير معروف'}</b>
        </td>
        <td style="padding:14px;border-bottom:1px solid var(--border);text-align:center;color:var(--accent2);font-weight:700;font-size:15px">${d.quantity}</td>
        <td style="padding:14px;border-bottom:1px solid var(--border);text-align:center;font-size:15px">${fmt(d.unit_price)}</td>
        <td style="padding:14px;border-bottom:1px solid var(--border);text-align:center;font-size:15px">${fmt(d.sell_price || 0)}</td>
        <td style="padding:14px;border-bottom:1px solid var(--border);text-align:center;color:var(--accent2);font-weight:700;font-size:15px">${fmt(d.total_price)}</td>
        <td style="padding:14px;border-bottom:1px solid var(--border)">
          <button onclick="editPurchaseItem(${purchase.id}, ${d.id})"
            style="background:rgba(0,212,255,.15);border:none;color:var(--accent);padding:6px 12px;border-radius:5px;cursor:pointer;font-size:13px">
            ✏️
          </button>
        </td>
      </tr>`
      }).join('')}
    </table>
  </div>`;

  console.log('Before omo - title:', `📋 تفاصيل فاتورة الشراء: ${purchase.invoice_number}`);
  console.log('Before omo - html:', html);
  const payButton = purchase.remaining_amount>0?`<button class="btn btn-warn" onclick="payPurch(${id},${purchase.remaining_amount})">💳 تسجيل دفعة</button>`:'';
  omo(`📋 تفاصيل فاتورة الشراء: ${purchase.invoice_number}`, html,
  `${payButton}
  <button class="btn btn-danger" onclick="if(confirm('⚠️ هل أنت متأكد من حذف هذه الفاتورة؟\n\nسيتم حذف الفاتورة وكل البيانات المرتبطة بها')) dPurch(${id})">🗑️ حذف الفاتورة</button>
  <button class="btn btn-ghost" onclick="cmo()">✖️ إغلاق</button>`);
}

// دالة تعديل منتج في فاتورة الشراء
function editPurchaseItem(purchaseId, itemId) {
  const purchase = purchasesData.find(p => p.id === purchaseId);
  if (!purchase) return;

  const details = purchase.items || [];
  const item = details.find(d => d.id === itemId);
  if (!item) return;

  // إنشاء نافذة تعديل
  const overlay = document.createElement('div');
  overlay.id = 'edit-purchase-item-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:400;display:flex;align-items:center;justify-content:center;padding:16px';

  overlay.innerHTML = `
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;width:100%;max-width:500px;padding:24px">
      <h3 style="margin:0 0 20px;color:var(--accent)">✏️ تعديل المنتج</h3>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div>
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">الكمية</label>
          <input type="number" id="edit-item-qty" value="${item.quantity}" min="1" 
            style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:10px 12px;color:var(--text);font-size:14px">
        </div>
        <div>
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">سعر الشراء</label>
          <input type="number" id="edit-item-cost" value="${item.unit_price}" step="0.01" min="0"
            style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:10px 12px;color:var(--accent);font-size:14px">
        </div>
        <div>
          <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:5px">سعر البيع</label>
          <input type="number" id="edit-item-sell" value="${item.sell_price || 0}" step="0.01" min="0"
            style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:10px 12px;color:var(--accent2);font-size:14px">
        </div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px">
        <button onclick="document.getElementById('edit-purchase-item-overlay').remove()" 
          style="padding:10px 20px;background:var(--bg3);border:1px solid var(--border);border-radius:7px;color:var(--text);cursor:pointer;font-family:Cairo,sans-serif">
          إلغاء
        </button>
        <button onclick="saveEditedPurchaseItem(${purchaseId}, ${itemId})" 
          style="padding:10px 24px;background:var(--accent2);color:#0f1923;border:none;border-radius:7px;font-weight:700;cursor:pointer;font-family:Cairo,sans-serif">
          💾 حفظ التعديلات
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

// دالة حفظ التعديلات على منتج في فاتورة الشراء
async function saveEditedPurchaseItem(purchaseId, itemId) {
  const qty = parseInt(document.getElementById('edit-item-qty').value) || 1;
  const cost = parseFloat(document.getElementById('edit-item-cost').value) || 0;
  const sell = parseFloat(document.getElementById('edit-item-sell').value) || 0;

  if (qty <= 0) {
    toast('الكمية يجب أن تكون أكبر من صفر', 'error');
    return;
  }

  // تحديث البيانات
  const purchase = purchasesData.find(p => p.id === purchaseId);
  if (!purchase) return;

  const details = purchase.items || [];
  const itemIndex = details.findIndex(d => d.id === itemId);

  if (itemIndex !== -1) {
    details[itemIndex].quantity = qty;
    details[itemIndex].unit_price = cost;
    details[itemIndex].sell_price = sell;
    details[itemIndex].total_price = qty * cost;

    // إعادة حساب الإجمالي
    purchase.total_amount = details.reduce((sum, d) => sum + d.total_price, 0);
    purchase.remaining_amount = purchase.total_amount - purchase.paid_amount;

    // حفظ التعديلات
    const r = await api(`/api/purchases/${purchaseId}`, 'PUT', {
      supplier_id: purchase.supplier_id,
      paid_amount: purchase.paid_amount,
      items: details
    });

    if (r.success) {
      document.getElementById('edit-purchase-item-overlay').remove();
      toast('✅ تم تحديث المنتج');
      showPurchaseDetails(purchaseId);
    } else {
      toast(r.message || 'حدث خطأ أثناء التحديث', 'error');
    }
  } else {
    toast('المنتج غير موجود', 'error');
  }
}

async function vPurch(id){
  const r=await api(`/api/purchases/${id}`);
  if(!r.success){toast('خطأ في تحميل البيانات','error');return;}
  const{purchase,details}=r.data;
  let html=`
  <div style="background:var(--bg3);padding:14px;border-radius:9px;margin-bottom:14px;border-left:4px solid var(--accent)">
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:10px">
      <div><span style="color:var(--muted);font-size:11px">🧾 رقم الفاتورة</span><div style="font-weight:700;color:var(--accent);font-size:16px">${purchase.invoice_number}</div></div>
      <div><span style="color:var(--muted);font-size:11px">📅 التاريخ</span><div style="font-weight:600">${purchase.purchase_date}</div></div>
      <div><span style="color:var(--muted);font-size:11px">🏢 المورد</span><div style="font-weight:600">${purchase.supplier_name||'بدون مورد'}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;border-top:1px solid var(--border);padding-top:10px">
      <div style="padding:8px;background:rgba(0,212,255,.1);border-radius:5px"><span style="color:var(--muted);font-size:10px">💰 الإجمالي</span><div style="font-weight:700;color:var(--accent);font-size:15px">${fmt(purchase.total_amount)}</div></div>
      <div style="padding:8px;background:rgba(0,255,157,.1);border-radius:5px"><span style="color:var(--muted);font-size:10px">✅ المدفوع</span><div style="font-weight:700;color:var(--accent2);font-size:15px">${fmt(purchase.paid_amount)}</div></div>
      <div style="padding:8px;background:rgba(${purchase.remaining_amount>0?'255,71,87':'0,255,157'},.1);border-radius:5px"><span style="color:var(--muted);font-size:10px">⏳ المتبقي</span><div style="font-weight:700;color:${purchase.remaining_amount>0?'var(--danger)':'var(--accent2)'};font-size:15px">${fmt(purchase.remaining_amount)}</div></div>
    </div>
  </div>
  <div style="background:var(--bg2);border:1px solid var(--border);border-radius:9px;overflow:hidden;margin-bottom:14px">
    <div style="padding:12px;background:var(--bg3);border-bottom:1px solid var(--border);font-weight:700;color:var(--accent)">📦 المنتجات (${details.length})</div>
    <table style="width:100%;margin:0">
      <tr style="background:var(--bg3)"><th style="padding:10px;text-align:right">🏷️ المنتج</th><th style="padding:10px">📊 الكمية</th><th style="padding:10px">💵 السعر</th><th style="padding:10px">🧮 الإجمالي</th></tr>
      ${details.map(d=>`<tr><td style="padding:10px;border-bottom:1px solid var(--border)"><b style="color:var(--accent)">${d.product_name}</b></td><td style="padding:10px;border-bottom:1px solid var(--border);text-align:center;color:var(--accent2);font-weight:700">${d.quantity}</td><td style="padding:10px;border-bottom:1px solid var(--border);text-align:center">${fmt(d.unit_price)}</td><td style="padding:10px;border-bottom:1px solid var(--border);text-align:center;color:var(--accent2);font-weight:700">${fmt(d.total_price)}</td></tr>`).join('')}
    </table>
  </div>`;
  const payButton2 = purchase.remaining_amount>0?`<button class="btn btn-warn" onclick="payPurch(${id},${purchase.remaining_amount})">💳 دفعة</button>`:'';
  omo(`📋 فاتورة شراء: ${purchase.invoice_number}`,html,
  `${payButton2}
  <button class="btn btn-danger" onclick="if(confirm('هل تريد حذف هذه الفاتورة؟')) dPurch(${id})">🗑️ حذف</button>
  <button class="btn btn-ghost" onclick="cmo()">✖️ إغلاق</button>`);
}

function payPurch(id,rem){
  omo('💳 تسجيل دفعة للمورد',`
  <div class="ff" style="margin-bottom:14px">
    <label style="color:var(--muted);font-size:12px">المبلغ المتبقي: <b style="color:var(--accent)">${fmt(rem)}</b></label>
    <input id="pay-purch-amount" type="number" value="${rem}" style="margin-top:6px;background:var(--bg3);border:1px solid var(--border);padding:10px;border-radius:7px;color:var(--text);width:100%">
  </div>`,
  `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="sbPayPurch(${id})">✅ تأكيد</button>`);
}
async function sbPayPurch(id){
  const amount=document.getElementById('pay-purch-amount').value;
  if(!amount||parseFloat(amount)<=0){toast('أدخل مبلغاً صحيحاً','error');return;}
  const r=await api(`/api/purchases/${id}/pay`,'POST',{amount,method:'نقدي'});
  if(r.success){cmo();toast('✅ '+r.message);purchases('شهر');}else toast(r.message,'error');
}
async function dPurch(id){
  if(!confirm('هل تريد حذف هذه الفاتورة؟'))return;
  const r=await api(`/api/purchases/${id}`,'DELETE');
  if(r.success){toast('✅ تم الحذف');purchases('شهر');}else toast(r.message,'error');
}

function addExistToPurchCart(){
  const name=document.getElementById('pu-prod-search').value.trim();
  const qty=parseInt(document.getElementById('pu-exist-qty').value)||1;
  const price=parseFloat(document.getElementById('pu-exist-price').value)||0;
  const sell=parseFloat(document.getElementById('pu-exist-sell').value)||0;
  if(!name){toast('اختر منتجاً','error');return;}
  if(qty<=0){toast('الكمية يجب أن تكون أكبر من صفر','error');return;}
  const prod=purchProds.find(p=>p.name===name);
  if(!prod){toast('المنتج غير موجود في القائمة','error');return;}
  const exist=purchCart.find(c=>c.id===prod.id&&!c.isNew);
  if(exist){exist.quantity+=qty;exist.total=exist.quantity*exist.cost_price;}
  else purchCart.push({id:prod.id,name:prod.name,category:prod.category,quantity:qty,cost_price:price||prod.cost_price,sell_price:sell||prod.selling_price,total:qty*(price||prod.cost_price),isNew:false});
  renderPurchCart();
  document.getElementById('pu-prod-search').value='';
  document.getElementById('pu-exist-qty').value='1';
  document.getElementById('pu-exist-price').value='0';
  document.getElementById('pu-exist-sell').value='0';
  // auto-fill paid
  const total=purchCart.reduce((s,i)=>s+i.total,0);
  document.getElementById('pu-paid').value=total.toFixed(2);
  updatePurchTotals();
}

async function addNewToPurchCart(){
  const name=document.getElementById('pu-new-name').value.trim();
  const brand=document.getElementById('pu-new-brand').value.trim();
  const cat=document.getElementById('pu-new-cat').value;
  const cond=document.getElementById('pu-new-cond')?.value||'جديد';
  const qty=parseInt(document.getElementById('pu-new-qty').value)||1;
  const cost=parseFloat(document.getElementById('pu-new-cost').value)||0;
  const sell=parseFloat(document.getElementById('pu-new-sell').value)||0;
  const bar=document.getElementById('pu-new-bar').value.trim();
  if(!name||!brand){toast('اسم المنتج والماركة مطلوبان','error');return;}
  if(qty<=0){toast('الكمية يجب أن تكون أكبر من صفر','error');return;}
  // create product in DB
  const r=await api('/api/products/add','POST',{name,brand,model:'-',category:cat,cost_price:cost,selling_price:sell||cost,quantity:0,min_stock:5,barcode:bar||null,condition:cond});
  if(!r.success){toast(r.message,'error');return;}
  purchCart.push({id:r.data?.id||null,name,category:cat,quantity:qty,cost_price:cost,sell_price:sell,total:qty*cost,isNew:true,isJustCreated:true});
  renderPurchCart();
  document.getElementById('pu-new-name').value='';
  document.getElementById('pu-new-brand').value='';
  document.getElementById('pu-new-qty').value='1';
  document.getElementById('pu-new-cost').value='0';
  document.getElementById('pu-new-sell').value='0';
  document.getElementById('pu-new-bar').value='';
  // reload products list
  const pr2=await api('/api/products');
  purchProds=pr2.data||[];
  document.getElementById('pu-prod-list').innerHTML=purchProds.map(p=>`<option value="${p.name}">${p.brand} | مخزون: ${p.quantity}</option>`).join('');
  toast('✅ تم إنشاء المنتج وإضافته');
  const total=purchCart.reduce((s,i)=>s+i.total,0);
  document.getElementById('pu-paid').value=total.toFixed(2);
  updatePurchTotals();
}

async function savePurchNew(){
  if(!purchCart.length){toast('أضف منتجات أولاً','error');return;}
  const total=purchCart.reduce((s,i)=>s+i.total,0);
  const paid=parseFloat(document.getElementById('pu-paid')?.value)||0;
  const supEl=document.getElementById('pu-sup');
  const supId=supEl&&supEl.value?parseInt(supEl.value):null;
  const items=purchCart.filter(item=>item.id).map(item=>({
    product_id:item.id,
    quantity:item.quantity,
    unit_price:item.cost_price||0,
    sell_price:item.sell_price||0
  }));
  if(!items.length){toast('تأكد من إضافة منتجات صحيحة','error');return;}
  const r=await api('/api/purchases/add','POST',{supplier_id:supId,paid_amount:paid,items});
  if(r.success){
    closePurchOverlay();
    toast(`✅ تم حفظ الفاتورة ${r.data?.invoice_number||''} | الإجمالي: ${fmt(total)}`);
    purchases('شهر');
  }else toast(r.message,'error');
}

function renderPurchasesTable(data){
  const tbl=document.getElementById('purchases-table');
  if(!data||!data.length){tbl.innerHTML=em('لا توجد مشتريات');return;}
  tbl.innerHTML=`<table style="width:100%">
    <tr><th>رقم الفاتورة</th><th>المورد</th><th>التاريخ</th><th>الإجمالي</th><th>المدفوع</th><th>المتبقي</th><th></th></tr>
    ${data.map(p=>`<tr>
      <td><b style="color:var(--accent)">${p.invoice_number}</b></td>
      <td>${p.supplier_name||'—'}</td>
      <td>${p.purchase_date}</td>
      <td>${fmt(p.total_amount)}</td>
      <td>${fmt(p.paid_amount)}</td>
      <td><span class="badge ${p.remaining_amount>0?'br':'bg'}">${fmt(p.remaining_amount)}</span></td>
      <td style="white-space:nowrap">
        <button class="btn btn-ghost btn-sm" onclick="vPurch(${p.id})" title="عرض التفاصيل">👁️</button>
        ${p.remaining_amount>0?`<button class="btn btn-warn btn-sm" onclick="payPurch(${p.id},${p.remaining_amount})">💳</button>`:''}
        <button class="btn btn-danger btn-sm" onclick="dPurch(${p.id})">🗑️</button>
      </td>
    </tr>`).join('')}
  </table>`;
}

function filterPurchasesTable(){
  const search=document.getElementById('purch-search').value.toLowerCase();
  const from=document.getElementById('purch-from').value;
  const to=document.getElementById('purch-to').value;
  const filtered=purchasesData.filter(p=>{
    const matchSearch=!search||p.invoice_number.toLowerCase().includes(search)||(p.supplier_name||'').toLowerCase().includes(search);
    const matchFrom=!from||p.purchase_date>=from;
    const matchTo=!to||p.purchase_date<=to;
    return matchSearch&&matchFrom&&matchTo;
  });
  renderPurchasesTable(filtered);
}

function purchasesPeriod(period){purchases(period);}

async function vPurch(id){
  const r=await api(`/api/purchases/${id}`);
  if(!r.success){toast('خطأ في تحميل البيانات','error');return;}
  const purchase=r.data;
  let html=`
  <div style="background:var(--bg3);padding:14px;border-radius:9px;margin-bottom:14px;border-left:4px solid var(--accent)">
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:10px">
      <div><span style="color:var(--muted);font-size:11px">🧾 رقم الفاتورة</span><div style="font-weight:700;color:var(--accent);font-size:16px">${purchase.invoice_number}</div></div>
      <div><span style="color:var(--muted);font-size:11px">📅 التاريخ</span><div style="font-weight:600">${purchase.purchase_date}</div></div>
      <div><span style="color:var(--muted);font-size:11px">🏢 المورد</span><div style="font-weight:600">${purchase.supplier_name||'بدون مورد'}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;border-top:1px solid var(--border);padding-top:10px">
      <div style="padding:8px;background:rgba(0,212,255,.1);border-radius:5px"><span style="color:var(--muted);font-size:10px">💰 الإجمالي</span><div style="font-weight:700;color:var(--accent);font-size:15px">${fmt(purchase.total_amount)}</div></div>
      <div style="padding:8px;background:rgba(0,255,157,.1);border-radius:5px"><span style="color:var(--muted);font-size:10px">✅ المدفوع</span><div style="font-weight:700;color:var(--accent2);font-size:15px">${fmt(purchase.paid_amount)}</div></div>
      <div style="padding:8px;background:rgba(${purchase.remaining_amount>0?'255,71,87':'0,255,157'},.1);border-radius:5px"><span style="color:var(--muted);font-size:10px">⏳ المتبقي</span><div style="font-weight:700;color:${purchase.remaining_amount>0?'var(--danger)':'var(--accent2)'};font-size:15px">${fmt(purchase.remaining_amount)}</div></div>
    </div>
  </div>
  <div style="background:var(--bg2);border:1px solid var(--border);border-radius:9px;overflow:hidden;margin-bottom:14px">
    <div style="padding:12px;background:var(--bg3);border-bottom:1px solid var(--border);font-weight:700;color:var(--accent)">📦 المنتجات (${purchase.items?.length||0})</div>
    <table style="width:100%;margin:0">
      <tr style="background:var(--bg3)"><th style="padding:10px;text-align:right">🏷️ المنتج</th><th style="padding:10px">📊 الكمية</th><th style="padding:10px">💵 السعر</th><th style="padding:10px">🧮 الإجمالي</th></tr>
      ${purchase.items?.map(d=>{const product=DB.products.find(p=>p.id===d.product_id);return`<tr><td style="padding:10px;border-bottom:1px solid var(--border)"><b style="color:var(--accent)">${product?.name||'منتج محذوف'}</b></td><td style="padding:10px;border-bottom:1px solid var(--border);text-align:center;color:var(--accent2);font-weight:700">${d.quantity}</td><td style="padding:10px;border-bottom:1px solid var(--border);text-align:center">${fmt(d.unit_price)}</td><td style="padding:10px;border-bottom:1px solid var(--border);text-align:center;color:var(--accent2);font-weight:700">${fmt(d.quantity*d.unit_price)}</td></tr>`;}).join('')||'<tr><td colspan="4" style="padding:20px;text-align:center;color:var(--muted)">لا توجد منتجات</td></tr>'}
    </table>
  </div>`;
  omo(`📋 فاتورة شراء: ${purchase.invoice_number}`,html,
  `${purchase.remaining_amount>0?`<button class="btn btn-warn" onclick="payPurch(${id},${purchase.remaining_amount})">💳 دفعة</button>`:''}
  <button class="btn btn-danger" onclick="if(confirm('هل تريد حذف هذه الفاتورة؟')) dPurch(${id})">🗑️ حذف</button>
  <button class="btn btn-ghost" onclick="cmo()">✖️ إغلاق</button>`);
}

function payPurch(id,rem){
  omo('💳 تسجيل دفعة للمورد',`
  <div class="ff" style="margin-bottom:14px">
    <label style="color:var(--muted);font-size:12px">المبلغ المتبقي: <b style="color:var(--accent)">${fmt(rem)}</b></label>
    <input id="pay-purch-amount" type="number" value="${rem}" style="margin-top:6px;background:var(--bg3);border:1px solid var(--border);padding:10px;border-radius:7px;color:var(--text);width:100%">
  </div>`,
  `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="sbPayPurch(${id})">✅ تأكيد</button>`);
}
async function sbPayPurch(id){
  const amount=document.getElementById('pay-purch-amount').value;
  if(!amount||parseFloat(amount)<=0){toast('أدخل مبلغاً صحيحاً','error');return;}
  const r=await api(`/api/purchases/${id}/pay`,'POST',{amount,method:'نقدي'});
  if(r.success){cmo();toast('✅ '+r.message);purchases('شهر');}else toast(r.message,'error');
}
async function dPurch(id){
  if(!confirm('هل تريد حذف هذه الفاتورة؟'))return;
  const r=await api(`/api/purchases/${id}`,'DELETE');
  if(r.success){toast('✅ تم الحذف');purchases('شهر');}else toast(r.message,'error');
}

// ═══════════════════════════════════════════════════════════
//  SUPPLIERS
// ═══════════════════════════════════════════════════════════
async function suppliers(){
  const c=document.getElementById('pc');
  c.innerHTML=`<div style="display:flex;justify-content:flex-end;margin-bottom:14px"><button class="btn btn-success" onclick="addSup()">+ إضافة مورد</button></div>
  <div class="tw"><div class="th"><h3>🚚 الموردين</h3></div><div id="supt">${ld()}</div></div>`;
  const r=await api('/api/suppliers');
  document.getElementById('supt').innerHTML=r.data?.length
    ?`<table><tr><th>الاسم</th><th>الهاتف</th><th>البريد</th><th>العنوان</th><th></th></tr>
    ${r.data.map(s=>{
      const supplierJson = JSON.stringify(s);
      return `<tr><td><b>${s.name}</b></td><td>${s.phone}</td><td>${s.email||'—'}</td><td>${s.address||'—'}</td>
    <td><button class="btn btn-ghost btn-sm" onclick='eSup(${supplierJson})'>✏️</button> <button class="btn btn-danger btn-sm" onclick="dSup(${s.id})">🗑️</button></td></tr>`;
    }).join('')}</table>`:em();
}
function addSup(){omo('➕ مورد جديد',`<div class="fg"><div class="ff"><label>الاسم *</label><input id="sn"></div><div class="ff"><label>الهاتف *</label><input id="sph"></div><div class="ff"><label>البريد</label><input id="se"></div><div class="ff"><label>العنوان</label><input id="sa"></div></div>`,`<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="svSup()">💾 حفظ</button>`);}
async function svSup(){const r=await api('/api/suppliers/add','POST',{name:document.getElementById('sn').value,phone:document.getElementById('sph').value,email:document.getElementById('se').value,address:document.getElementById('sa').value});if(r.success){cmo();toast(r.message);suppliers();}else toast(r.message,'error');}
function eSup(s){omo('✏️ تعديل مورد',`<div class="fg"><div class="ff"><label>الاسم</label><input id="esn" value="${s.name}"></div><div class="ff"><label>الهاتف</label><input id="esp" value="${s.phone}"></div><div class="ff"><label>البريد</label><input id="ese" value="${s.email||''}"></div><div class="ff"><label>العنوان</label><input id="esa" value="${s.address||''}"></div></div>`,`<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="upSup(${s.id})">💾 حفظ</button>`);}
async function upSup(id){const r=await api(`/api/suppliers/${id}`,'PUT',{name:document.getElementById('esn').value,phone:document.getElementById('esp').value,email:document.getElementById('ese').value,address:document.getElementById('esa').value});if(r.success){cmo();toast(r.message);suppliers();}else toast(r.message,'error');}
async function dSup(id){if(!confirm('حذف؟'))return;const r=await api(`/api/suppliers/${id}`,'DELETE');if(r.success){toast(r.message);suppliers();}else toast(r.message,'error');}

function customers() {
    const c = document.getElementById('pc');
    c.innerHTML = `<div class="tw"><div class="th"><h3>العملاء</h3></div><div style="padding:20px">✅ قسم العملاء - جاهز للاستخدام</div></div>`;
}

// ═══════════════════════════════════════════════════════════
//  MAINTENANCE
// ═══════════════════════════════════════════════════════════
async function maintenance(sf='',sq=''){
  const c=document.getElementById('pc');
  c.innerHTML=`
  <div style="display:flex;gap:20px;align-items:flex-start">
    <!-- الجانب الرئيسي -->
    <div style="flex:1;min-width:0">
      <!-- شريط الأدوات -->
      <div style="display:flex;gap:7px;margin-bottom:14px;flex-wrap:wrap;align-items:center">
        ${['','قيد الإصلاح','جاهز','تم التسليم'].map(s=>`<button class="btn ${s===sf?'btn-success':'btn-ghost'} btn-sm" onclick="maintenance('${s}',document.getElementById('mq-search')?.value||'')">${s||'الكل'}</button>`).join('')}
        <input class="si" id="mq-search" placeholder="🔍 بحث عن عميل أو جهاز..." value="${sq}" oninput="maintenance('${sf}',this.value)" style="flex:1;min-width:180px">
        <button class="btn btn-success btn-sm" onclick="addMaint()">+ طلب صيانة</button>
        <button class="btn btn-danger btn-sm" onclick="clearAllMaint()">🗑️ حذف الكل</button>
      </div>
      <div class="tw"><div class="th"><h3>🔧 طلبات الصيانة</h3><span id="maint-cnt" style="color:var(--muted);font-size:13px"></span></div><div id="mt">${ld()}</div></div>
    </div>
    <!-- اللوحة الجانبية -->
    <div style="width:220px;flex-shrink:0;display:flex;flex-direction:column;gap:12px">
      <div class="sc gr" style="padding:18px">
        <div class="lb">💰 إجمالي السعر</div>
        <div class="vl" id="maint-total-price">0</div>
        <div class="sb">المبالغ المطلوبة</div>
      </div>
      <div class="sc pu" style="padding:18px">
        <div class="lb">💹 إجمالي الربح</div>
        <div class="vl" id="maint-total-profit">0</div>
        <div class="sb">ربح بعد التكاليف</div>
      </div>
      <div class="sc bl" style="padding:18px">
        <div class="lb">📋 عدد الطلبات</div>
        <div class="vl" id="maint-count-box">0</div>
      </div>
    </div>
  </div>`;

  const r=await api(`/api/maintenance${sf?'?status='+encodeURIComponent(sf):''}`);
  let data=r.data||[];

  // فلتر البحث
  if(sq){
    const qs=sq.toLowerCase();
    data=data.filter(m=>m.customer_name.toLowerCase().includes(qs)||m.device_model.toLowerCase().includes(qs)||m.phone.includes(qs));
  }

  // حساب الإجماليات
  let totalPrice=0,totalProfit=0;
  data.forEach(m=>{totalPrice+=(m.selling_price||0);totalProfit+=((m.selling_price||0)-(m.cost||0));});
  document.getElementById('maint-total-price').textContent=fmt(totalPrice);
  document.getElementById('maint-total-profit').textContent=fmt(totalProfit);
  document.getElementById('maint-count-box').textContent=data.length;
  document.getElementById('maint-cnt').textContent=data.length+' طلب';

  document.getElementById('mt').innerHTML=data.length
    ?`<div style="overflow-x:auto"><table style="width:100%"><tr><th>العميل</th><th>الهاتف</th><th>الجهاز</th><th>المشكلة</th><th>التكلفة</th><th>السعر الإجمالي</th><th>الربح</th><th>الحالة</th><th>تاريخ الاستلام</th><th></th></tr>
    ${data.map(m=>{
      const profit=(m.selling_price||0)-(m.cost||0);
      const maintJson = JSON.stringify(m);
      return `<tr>
    <td><b>${m.customer_name}</b></td><td>${m.phone}</td><td>${m.device_model}</td>
    <td style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${m.problem_description||''}">${m.problem_description||'—'}</td>
    <td>${fmt(m.cost)}</td>
    <td style="color:var(--accent2);font-weight:700">${fmt(m.selling_price||0)}</td>
    <td style="color:${profit>=0?'var(--accent2)':'var(--danger)'}">${profit>=0?'+':''}${fmt(profit)}</td>
    <td><span class="badge ${m.status==='جاهز'?'bg':m.status==='تم التسليم'?'bb':'bw'}">${m.status}</span></td>
    <td style="font-size:11px;color:var(--muted)">${m.received_date||'—'}</td>
    <td style="white-space:nowrap">
      <button class="btn btn-ghost btn-sm" title="تفاصيل" onclick='vMaint(${maintJson})'>👁️</button>
      <button class="btn btn-ghost btn-sm" onclick='upMaint(${maintJson})'>✏️</button>
      <button class="btn btn-danger btn-sm" onclick="dMaint(${m.id})">🗑️</button>
    </td></tr>`;
    }).join('')}</table></div>`
    :em('لا توجد طلبات صيانة');
}

function vMaint(m){
  const profit=(m.selling_price||0)-(m.cost||0);
  const html=`
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
    <div style="background:var(--bg3);border-radius:8px;padding:12px">
      <div style="font-size:11px;color:var(--muted)">العميل</div>
      <div style="font-weight:700;font-size:15px">${m.customer_name}</div>
    </div>
    <div style="background:var(--bg3);border-radius:8px;padding:12px">
      <div style="font-size:11px;color:var(--muted)">الهاتف</div>
      <div style="font-weight:600">${m.phone}</div>
    </div>
    <div style="background:var(--bg3);border-radius:8px;padding:12px">
      <div style="font-size:11px;color:var(--muted)">الجهاز</div>
      <div style="font-weight:700;color:var(--accent)">${m.device_model}</div>
    </div>
    <div style="background:var(--bg3);border-radius:8px;padding:12px">
      <div style="font-size:11px;color:var(--muted)">الحالة</div>
      <div><span class="badge ${m.status==='جاهز'?'bg':m.status==='تم التسليم'?'bb':'bw'}">${m.status}</span></div>
    </div>
    <div style="background:var(--bg3);border-radius:8px;padding:12px;grid-column:1/-1">
      <div style="font-size:11px;color:var(--muted);margin-bottom:5px">المشكلة</div>
      <div style="line-height:1.6">${m.problem_description||'لا يوجد وصف'}</div>
    </div>
    <div style="background:var(--bg3);border-radius:8px;padding:12px">
      <div style="font-size:11px;color:var(--muted)">تاريخ الاستلام</div>
      <div>${m.received_date||'—'} ${m.received_time||''}</div>
    </div>
    <div style="background:var(--bg3);border-radius:8px;padding:12px">
      <div style="font-size:11px;color:var(--muted)">تاريخ التسليم</div>
      <div>${m.delivery_date||'لم يُسلَّم بعد'}</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
    <div style="background:rgba(0,212,255,.1);border:1px solid var(--accent);border-radius:9px;padding:14px;text-align:center">
      <div style="font-size:11px;color:var(--muted)">التكلفة</div>
      <div style="font-size:20px;font-weight:900;color:var(--accent)">${fmt(m.cost)}</div>
    </div>
    <div style="background:rgba(0,255,157,.1);border:1px solid var(--accent2);border-radius:9px;padding:14px;text-align:center">
      <div style="font-size:11px;color:var(--muted)">السعر الإجمالي</div>
      <div style="font-size:20px;font-weight:900;color:var(--accent2)">${fmt(m.selling_price||0)}</div>
    </div>
    <div style="background:rgba(168,85,247,.1);border:1px solid #a855f7;border-radius:9px;padding:14px;text-align:center">
      <div style="font-size:11px;color:var(--muted)">الربح</div>
      <div style="font-size:20px;font-weight:900;color:${profit>=0?'#a855f7':'var(--danger)'}">${profit>=0?'+':''}${fmt(profit)}</div>
    </div>
  </div>`;
  omo(`📋 تفاصيل طلب صيانة`,html,
  `<button class="btn btn-warn btn-sm" onclick="cmo();upMaint(${JSON.stringify(m).replace(/"/g,'&quot;')})">✏️ تعديل</button>
   <button class="btn btn-ghost" onclick="cmo()">✖ إغلاق</button>`);
}

function clearAllMaint(){
  omo('🗑️ حذف جميع طلبات الصيانة',`
  <div style="background:rgba(255,71,87,.1);border:1px solid var(--danger);border-radius:8px;padding:16px;color:var(--danger)">
    <b>⚠️ تحذير:</b> سيتم حذف جميع طلبات الصيانة نهائياً ولا يمكن التراجع عن هذا الإجراء.
  </div>`,
  `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-danger" onclick="confirmClearAllMaint()">🗑️ حذف الكل</button>`);
}
async function confirmClearAllMaint(){
  const r=await api('/api/maintenance/clear','POST',{});
  if(r.success){cmo();toast('✅ تم حذف جميع طلبات الصيانة');maintenance();}else toast(r.message,'error');
}
function addMaint(){omo('➕ طلب صيانة',`<div class="fg"><div class="ff"><label>العميل *</label><input id="mc"></div><div class="ff"><label>الهاتف *</label><input id="mph"></div><div class="ff full"><label>الجهاز *</label><input id="md"></div><div class="ff full"><label>المشكلة</label><textarea id="mp"></textarea></div><div class="ff"><label>التكلفة (تكلفة الإصلاح)</label><input id="mcost" type="number" value="0" oninput="autoMaintPrice()"></div><div class="ff"><label>السعر الإجمالي (للعميل)</label><input id="msp" type="number" value="0" placeholder="السعر المطلوب من العميل"></div></div><div style="background:rgba(0,212,255,.08);border:1px solid var(--border);border-radius:8px;padding:10px;margin-top:10px;font-size:12px;color:var(--muted)">💡 التكلفة = تكلفة قطع الغيار والعمالة | السعر الإجمالي = السعر المطلوب من العميل</div>`,`<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="svMaint()">💾 حفظ</button>`);}
function autoMaintPrice(){const c=parseFloat(document.getElementById('mcost')?.value)||0;const sp=document.getElementById('msp');if(sp&&(parseFloat(sp.value)||0)===0)sp.value=c;}
async function svMaint(){const r=await api('/api/maintenance/add','POST',{customer_name:document.getElementById('mc').value,phone:document.getElementById('mph').value,device_model:document.getElementById('md').value,problem_description:document.getElementById('mp').value,cost:document.getElementById('mcost').value,selling_price:document.getElementById('msp').value||0,received_time:new Date().toTimeString().slice(0,5)});if(r.success){cmo();toast(r.message);maintenance();}else toast(r.message,'error');}
function upMaint(m){
  const maintJson = JSON.stringify(m);
  omo('✏️ تحديث',`<div class="fg"><div class="ff full"><label>الحالة</label><select id="ums"><option ${m.status==='قيد الإصلاح'?'selected':''}>قيد الإصلاح</option><option ${m.status==='جاهز'?'selected':''}>جاهز</option><option ${m.status==='تم التسليم'?'selected':''}>تم التسليم</option></select></div><div class="ff"><label>التكلفة</label><input id="umc" type="number" value="${m.cost}" oninput="autoMaintPriceUp()"></div><div class="ff"><label>السعر الإجمالي (للعميل)</label><input id="umsp" type="number" value="${m.selling_price||m.cost||0}"></div></div>`,`<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="sbUpMaint(${m.id})">💾 حفظ</button>`);}
function autoMaintPriceUp(){const c=parseFloat(document.getElementById('umc')?.value)||0;const sp=document.getElementById('umsp');if(sp&&(parseFloat(sp.value)||0)===0)sp.value=c;}
async function sbUpMaint(id){const r=await api(`/api/maintenance/${id}`,'PUT',{status:document.getElementById('ums').value,cost:document.getElementById('umc').value,selling_price:document.getElementById('umsp')?.value||0});if(r.success){cmo();toast(r.message);maintenance();}else toast(r.message,'error');}
async function dMaint(id){if(!confirm('حذف؟'))return;const r=await api(`/api/maintenance/${id}`,'DELETE');if(r.success){toast(r.message);maintenance();}else toast(r.message,'error');}

function reports() {
    const c = document.getElementById('pc');
    c.innerHTML = `
    <div class="tw">
        <div class="th">
            <h3>📈 التقارير</h3>
        </div>

        <!-- تبويبات التقارير -->
        <div class="tabs" style="margin: 20px;">
            <div class="tab active" onclick="switchReportTab('sales', this)">📊 تقارير المبيعات</div>
            <div class="tab" onclick="switchReportTab('inventory', this)">📦 تقارير المخزون</div>
            <div class="tab" onclick="switchReportTab('financial', this)">💰 التقارير المالية</div>
        </div>

        <!-- محتوى تبويب المبيعات -->
        <div id="sales-tab" class="report-tab-content">
            <div style="padding: 20px;">
                <!-- فلاتر المبيعات -->
                <div style="background: var(--bg2); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; align-items: end;">
                        <div class="ff">
                            <label>📅 الفترة</label>
                            <select id="sales-period" class="rin" onchange="updateSalesReport()">
                                <option value="today">اليوم</option>
                                <option value="week">أسبوع</option>
                                <option value="month" selected>شهر</option>
                                <option value="quarter">ربع سنة</option>
                                <option value="year">سنة</option>
                                <option value="all">كل الوقت</option>
                            </select>
                        </div>
                        <div class="ff">
                            <label>🔍 البحث</label>
                            <input type="text" id="sales-search" class="rin" placeholder="رقم الفاتورة، المنتج، المستخدم..." oninput="updateSalesReport()">
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn btn-primary" onclick="updateSalesReport()">👁️ عرض التقرير</button>
                            <button class="btn btn-ghost" onclick="printSalesReport()">🖨️ طباعة</button>
                            <button class="btn btn-success" onclick="exportSalesReport()">📊 Excel</button>
                        </div>
                    </div>
                </div>

                <!-- منطقة عرض تقرير المبيعات -->
                <div id="sales-report-content" style="background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 20px; min-height: 400px;">
                    <div style="text-align: center; color: var(--muted); padding: 60px 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
                        <p style="font-size: 18px;">اختر الفترة واضغط على "عرض التقرير"</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- محتوى تبويب المخزون -->
        <div id="inventory-tab" class="report-tab-content" style="display: none;">
            <div style="padding: 20px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="showCurrentInventoryReport()" style="height: 60px;">
                        📊 المخزون الحالي
                    </button>
                    <button class="btn btn-warn" onclick="showLowStockReport()" style="height: 60px;">
                        ⚠️ المخزون المنخفض
                    </button>
                    <button class="btn btn-danger" onclick="showOutOfStockReport()" style="height: 60px;">
                        ❌ المخزون المنتهي
                    </button>
                    <button class="btn btn-ghost" onclick="showInventoryByCategoryReport()" style="height: 60px;">
                        📈 المخزون حسب الفئة
                    </button>
                    <button class="btn btn-success" onclick="showInventoryValueReport()" style="height: 60px;">
                        💰 قيمة المخزون والرأسمال
                    </button>
                </div>

                <div id="inventory-report-content" style="background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 20px; min-height: 400px;">
                    <div style="text-align: center; color: var(--muted); padding: 60px 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">📦</div>
                        <p style="font-size: 18px;">اختر نوع تقرير المخزون</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- محتوى تبويب التقارير المالية -->
        <div id="financial-tab" class="report-tab-content" style="display: none;">
            <div style="padding: 20px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="showProfitReport()" style="height: 60px;">
                        💹 تقارير الأرباح
                    </button>
                    <button class="btn btn-danger" onclick="showExpensesReport()" style="height: 60px;">
                        💸 تقارير المصاريف
                    </button>
                    <button class="btn btn-success" onclick="showPurchasesReport()" style="height: 60px;">
                        🛒 تقارير المشتريات
                    </button>
                </div>

                <div id="financial-report-content" style="background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 20px; min-height: 400px;">
                    <div style="text-align: center; color: var(--muted); padding: 60px 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">💰</div>
                        <p style="font-size: 18px;">اختر نوع التقرير المالي</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// دالة التبديل بين تبويبات التقارير
function switchReportTab(tabName, element) {
    // إخفاء جميع محتويات التبويبات
    document.querySelectorAll('.report-tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    // إزالة الكلاس active من جميع التبويبات
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // إظهار التبويب المحدد
    document.getElementById(tabName + '-tab').style.display = 'block';
    element.classList.add('active');
}

// دالة تحديث تقرير المبيعات مع الفلترة والبحث
function updateSalesReport() {
    const period = document.getElementById('sales-period').value;
    const searchText = document.getElementById('sales-search').value.toLowerCase().trim();
    const reportContent = document.getElementById('sales-report-content');

    reportContent.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spin"></div><p>جاري تحميل تقرير المبيعات...</p></div>';

    setTimeout(() => {
        let sales = [...(DB.sales || [])];

        // تطبيق الفلترة حسب الفترة
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        sales = sales.filter(sale => {
            if (period === 'today') {
                return sale.sale_date === todayStr;
            } else if (period === 'week') {
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                return new Date(sale.sale_date) >= weekAgo;
            } else if (period === 'month') {
                const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);
                return new Date(sale.sale_date) >= monthAgo;
            } else if (period === 'quarter') {
                const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                return new Date(sale.sale_date) >= quarterAgo;
            } else if (period === 'year') {
                const yearAgo = new Date(today.getFullYear(), 0, 1);
                return new Date(sale.sale_date) >= yearAgo;
            }
            return true;
        });

        // تطبيق البحث
        if (searchText) {
            sales = sales.filter(sale => {
                const invoiceMatch = sale.invoice_number.toLowerCase().includes(searchText);
                const userMatch = (sale.username || '').toLowerCase().includes(searchText);
                const productMatch = sale.items && sale.items.some(item => {
                    const product = DB.products.find(p => p.id === item.product_id);
                    return product && product.name.toLowerCase().includes(searchText);
                });
                return invoiceMatch || userMatch || productMatch;
            });
        }

        // ترتيب النتائج حسب التاريخ
        sales.sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));

        const totalSales = sales.reduce((sum, s) => sum + s.total_amount, 0);
        const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
        const avgSale = sales.length > 0 ? totalSales / sales.length : 0;

        let html = `
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--accent); margin-bottom: 15px;">💰 تقرير المبيعات - ${getPeriodText(period)}</h3>

                <!-- بطاقات الملخص -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي المبيعات</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent);">${fmt(totalSales)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي الأرباح</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent2);">${fmt(totalProfit)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">عدد الفواتير</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--text);">${sales.length}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">متوسط قيمة الفاتورة</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--warn);">${fmt(avgSale)}</div>
                    </div>
                </div>

                <!-- جدول المبيعات -->
                <div style="background: var(--bg2); border-radius: 10px; overflow: hidden; border: 1px solid var(--border);">
                    <div style="padding: 15px; border-bottom: 1px solid var(--border); background: var(--bg3);">
                        <h4 style="margin: 0; color: var(--text);">تفاصيل المبيعات</h4>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg3);">
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">رقم الفاتورة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">التاريخ</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الوقت</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المستخدم</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المبلغ</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الربح</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sales.map(sale => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 12px;">${sale.invoice_number}</td>
                                        <td style="padding: 12px;">${sale.sale_date}</td>
                                        <td style="padding: 12px;">${sale.sale_time || '-'}</td>
                                        <td style="padding: 12px;">${sale.username || '-'}</td>
                                        <td style="padding: 12px; color: var(--accent); font-weight: bold;">${fmt(sale.total_amount)}</td>
                                        <td style="padding: 12px; color: var(--accent2); font-weight: bold;">${fmt(sale.profit || 0)}</td>
                                        <td style="padding: 12px; white-space: nowrap;">
                                            <button class="btn btn-primary" style="padding: 5px 10px; font-size: 12px;" onclick="showSaleDetails(${sale.id})">📄 التفاصيل</button>
                                            <button class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;" onclick="deleteAndReturnSale(${sale.id})">🗑️ حذف وإعادة</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        reportContent.innerHTML = html;
    }, 500);
}

// دالة الحصول على نص الفترة
function getPeriodText(period) {
    const periodTexts = {
        'today': 'اليوم',
        'week': 'أسبوع',
        'month': 'شهر',
        'quarter': 'ربع سنة',
        'year': 'سنة',
        'all': 'كل الوقت'
    };
    return periodTexts[period] || period;
}

// دالة عرض تفاصيل الفاتورة
function showSaleDetails(saleId) {
    const sale = DB.sales.find(s => s.id === saleId);
    if (!sale || !sale.items || !Array.isArray(sale.items)) {
        toast('خطأ في تحميل بيانات الفاتورة', 'error');
        return;
    }

    const products = sale.items.map(item => {
        const product = DB.products.find(p => p.id === item.product_id);
        return {
            ...product,
            quantity: item.quantity,
            totalPrice: item.quantity * item.unit_price
        };
    });

    let html = `
        <div style="padding: 20px;">
            <h3 style="color: var(--accent); margin-bottom: 20px;">📄 تفاصيل الفاتورة ${sale.invoice_number}</h3>

            <div style="background: var(--bg2); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">التاريخ:</div>
                        <div style="font-size: 16px; font-weight: bold;">${sale.sale_date}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">الوقت:</div>
                        <div style="font-size: 16px; font-weight: bold;">${sale.sale_time || '-'}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">المستخدم:</div>
                        <div style="font-size: 16px; font-weight: bold;">${sale.username || '-'}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">طريقة الدفع:</div>
                        <div style="font-size: 16px; font-weight: bold;">${sale.payment_method || '-'}</div>
                    </div>
                </div>
            </div>

            <div style="background: var(--bg2); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h4 style="margin-bottom: 15px; color: var(--text);">المنتجات</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: var(--bg3);">
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">المنتج</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">الكمية</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">سعر الوحدة</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">الإجمالي</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sale.items.map((item, index) => {
                            const product = DB.products.find(p => p.id === item.product_id);
                            return `
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 10px;">${product?.name || item.name || 'غير معروف'}</td>
                                <td style="padding: 10px;">${item.quantity}</td>
                                <td style="padding: 10px;">${fmt(item.unit_price || item.price)}</td>
                                <td style="padding: 10px; font-weight: bold;">${fmt(item.total_price || (item.quantity * (item.unit_price || item.price)))}</td>
                                <td style="padding: 10px;">
                                    <button class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;" onclick="deleteAndReturnItem(${sale.id}, ${index})">🗑️ حذف وإعادة</button>
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <div style="background: var(--bg3); padding: 20px; border-radius: 10px; text-align: left;">
                <div style="font-size: 14px; color: var(--muted);">المبلغ الإجمالي:</div>
                <div style="font-size: 28px; font-weight: bold; color: var(--accent);">${fmt(sale.total_amount)}</div>
                <div style="font-size: 14px; color: var(--accent2); margin-top: 10px;">الربح: ${fmt(sale.profit || 0)}</div>
            </div>
        </div>
    `;

    omo('📄 تفاصيل الفاتورة', html, `
        <button class="btn btn-ghost" onclick="cmo()">إغلاق</button>
        <button class="btn btn-primary" onclick="printSaleDetails(${saleId})">🖨️ طباعة</button>
    `);
}

// دالة إعادة الفاتورة إلى المخزون
function returnSaleToInventory(saleId) {
    const sale = DB.sales.find(s => s.id === saleId);
    if (!sale || !sale.items || !Array.isArray(sale.items)) {
        toast('خطأ في تحميل بيانات الفاتورة', 'error');
        return;
    }

    if (!confirm('⚠️ تأكيد إعادة الفاتورة إلى المخزون\n\nهل أنت متأكد من إعادة جميع المنتجات في هذه الفاتورة إلى المخزون؟\n\n⚠️ هذه العملية ستقوم بـ:\n• إضافة الكميات المباعة إلى المخزون\n• حذف الفاتورة من سجلات المبيعات')) {
        return;
    }

    // إعادة المنتجات إلى المخزون
    sale.items.forEach(item => {
        const product = DB.products.find(p => p.id === item.product_id);
        if (product) {
            product.quantity += item.quantity;
        }
    });

    // حفظ التغييرات في المخزون
    DB.products = [...DB.products];

    // حذف الفاتورة
    DB.sales = DB.sales.filter(s => s.id !== saleId);
    localStorage.setItem(DB.getDBKey('sales'), JSON.stringify(DB.sales));
    localStorage.setItem(DB.getDBKey('products'), JSON.stringify(DB.products));

    toast('✅ تم إعادة الفاتورة إلى المخزون بنجاح');
    updateSalesReport();
}

// دالة حذف صنف واحد من الفاتورة وإعادته إلى المخزون
function deleteAndReturnItem(saleId, itemIndex) {
    const sale = DB.sales.find(s => s.id === saleId);
    if (!sale || !sale.items || !Array.isArray(sale.items) || itemIndex < 0 || itemIndex >= sale.items.length) {
        toast('خطأ في تحميل بيانات الفاتورة', 'error');
        return;
    }

    const item = sale.items[itemIndex];
    const product = DB.products.find(p => p.id === item.product_id);

    if (!product) {
        toast('المنتج غير موجود في المخزون', 'error');
        return;
    }

    if (!confirm(`⚠️ تأكيد حذف الصنف وإعادته للمخزون\n\nهل أنت متأكد من حذف الصنف "${product.name}" وإعادته إلى المخزون؟\n\n⚠️ هذه العملية ستقوم بـ:\n• إضافة ${item.quantity} وحدة من "${product.name}" إلى المخزون\n• حذف الصنف من الفاتورة\n• تحديث إجمالي الفاتورة\n\n⚠️ هذه العملية لا يمكن التراجع عنها`)) {
        return;
    }

    // إعادة الصنف إلى المخزون
    product.quantity += item.quantity;
    DB.saveProduct(product);

    // حذف الصنف من الفاتورة
    sale.items.splice(itemIndex, 1);

    // إعادة حساب إجمالي الفاتورة
    sale.total_amount = sale.items.reduce((sum, i) => sum + (i.total_price || (i.quantity * (i.unit_price || i.price))), 0);
    sale.profit = sale.items.reduce((sum, i) => sum + (i.profit || 0), 0);

    // تحديث الفاتورة
    DB.updateSale(sale);

    // إغلاق النافذة وعرض التفاصيل مرة أخرى
    cmo();
    showSaleDetails(saleId);
    toast('✅ تم حذف الصنف وإعادته إلى المخزون بنجاح');
}

// دالة حذف فاتورة وإعادة المنتجات إلى المخزون
function deleteAndReturnSale(saleId) {
    const sale = DB.sales.find(s => s.id === saleId);
    if (!sale || !sale.items || !Array.isArray(sale.items)) {
        toast('خطأ في تحميل بيانات الفاتورة', 'error');
        return;
    }

    if (!confirm('⚠️ تأكيد حذف الفاتورة وإعادة المنتجات للمخزون\n\nهل أنت متأكد من حذف هذه الفاتورة وإعادة جميع المنتجات إلى المخزون؟\n\n⚠️ هذه العملية ستقوم بـ:\n• إضافة الكميات المباعة إلى المخزون\n• حذف الفاتورة من سجلات المبيعات\n\n⚠️ هذه العملية لا يمكن التراجع عنها')) {
        return;
    }

    // إعادة المنتجات إلى المخزون
    sale.items.forEach(item => {
        const product = DB.products.find(p => p.id === item.product_id);
        if (product) {
            product.quantity += item.quantity;
            DB.saveProduct(product);
        }
    });

    // حذف الفاتورة
    DB.deleteSale(saleId);

    toast('✅ تم حذف الفاتورة وإعادة المنتجات إلى المخزون بنجاح');
    updateSalesReport();
}

// دالة حذف فاتورة
function deleteSale(saleId) {
    const sale = DB.sales.find(s => s.id === saleId);
    if (!sale) {
        toast('خطأ في تحميل بيانات الفاتورة', 'error');
        return;
    }

    if (!confirm('⚠️ تأكيد حذف الفاتورة\n\nهل أنت متأكد من حذف هذه الفاتورة؟\n\n⚠️ هذه العملية لا يمكن التراجع عنها')) {
        return;
    }

    // حذف الفاتورة
    DB.sales = DB.sales.filter(s => s.id !== saleId);
    localStorage.setItem(DB.getDBKey('sales'), JSON.stringify(DB.sales));

    toast('✅ تم حذف الفاتورة بنجاح');
    updateSalesReport();
}

// دالة طباعة تفاصيل الفاتورة
function printSaleDetails(saleId) {
    const sale = DB.sales.find(s => s.id === saleId);
    if (!sale) return;

    const printContent = document.getElementById('mbody').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>فاتورة ${sale.invoice_number}</title>
            <style>
                body { font-family: 'Cairo', Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 10px; text-align: right; border-bottom: 1px solid #ddd; }
                th { background: #f5f5f5; }
                .total { font-size: 24px; font-weight: bold; color: #00d4ff; text-align: left; margin-top: 20px; }
            </style>
        </head>
        <body>
            <h1>فاتورة ${sale.invoice_number}</h1>
            <p>التاريخ: ${sale.sale_date} ${sale.sale_time || ''}</p>
            ${printContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// دالة تصدير تقرير المبيعات إلى Excel
function exportSalesReport() {
    const period = document.getElementById('sales-period').value;
    let sales = [...(DB.sales || [])];

    // تطبيق نفس الفلترة المستخدمة في العرض
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    sales = sales.filter(sale => {
        if (period === 'today') {
            return sale.sale_date === todayStr;
        } else if (period === 'week') {
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return new Date(sale.sale_date) >= weekAgo;
        } else if (period === 'month') {
            const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);
            return new Date(sale.sale_date) >= monthAgo;
        } else if (period === 'quarter') {
            const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
            return new Date(sale.sale_date) >= quarterAgo;
        } else if (period === 'year') {
            const yearAgo = new Date(today.getFullYear(), 0, 1);
            return new Date(sale.sale_date) >= yearAgo;
        }
        return true;
    });

    // إنشاء محتوى CSV
    let csvContent = '\uFEFF'; // BOM للدعم العربي
    csvContent += 'رقم الفاتورة,التاريخ,الوقت,المستخدم,المبلغ الإجمالي,الربح\n';

    sales.forEach(sale => {
        csvContent += `${sale.invoice_number},${sale.sale_date},${sale.sale_time || ''},${sale.username || ''},${sale.total_amount},${sale.profit || 0}\n`;
    });

    // تحميل الملف
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `تقرير_المبيعات_${getPeriodText(period)}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast('✅ تم تصدير التقرير بنجاح');
}

// دالة طباعة تقرير المبيعات
function printSalesReport() {
    const printContent = document.getElementById('sales-report-content').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>تقرير المبيعات</title>
            <style>
                body { font-family: 'Cairo', Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 10px; text-align: right; border-bottom: 1px solid #ddd; }
                th { background: #f5f5f5; }
                @media print { body { -webkit-print-color-adjust: exact; } }
            </style>
        </head>
        <body>
            <h1>تقرير المبيعات</h1>
            ${printContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// دالة حذف فاتورة من التقرير
function deleteSaleFromReport() {
    const saleId = prompt('أدخل رقم الفاتورة للحذف:');
    if (!saleId) return;

    const sale = DB.sales.find(s => s.invoice_number === saleId);
    if (!sale) {
        toast('❌ الفاتورة غير موجودة', 'error');
        return;
    }

    if (confirm(`هل أنت متأكد من حذف الفاتورة ${saleId}?`)) {
        DB.deleteSale(sale.id);
        toast('✅ تم حذف الفاتورة بنجاح');
        updateSalesReport();
    }
}

// دالة عرض تقرير المخزون الحالي
function showCurrentInventoryReport() {
    const reportContent = document.getElementById('inventory-report-content');
    reportContent.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spin"></div><p>جاري تحميل تقرير المخزون...</p></div>';

    setTimeout(() => {
        const products = DB.products || [];
        const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
        const totalCost = products.reduce((sum, p) => sum + (p.quantity * p.cost_price), 0);
        const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.selling_price), 0);
        const capital = totalCost;

        let html = `
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--accent); margin-bottom: 15px;">📊 تقرير المخزون الحالي</h3>

                <!-- بطاقات الملخص -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">عدد المنتجات</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent);">${products.length}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي الكمية</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent2);">${totalQuantity}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي التكلفة</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--warn);">${fmt(capital)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي القيمة</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent);">${fmt(totalValue)}</div>
                    </div>
                </div>

                <!-- جدول المخزون -->
                <div style="background: var(--bg2); border-radius: 10px; overflow: hidden; border: 1px solid var(--border);">
                    <div style="padding: 15px; border-bottom: 1px solid var(--border); background: var(--bg3);">
                        <h4 style="margin: 0; color: var(--text);">تفاصيل المخزون</h4>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg3);">
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المنتج</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الفئة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الحالة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الكمية</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">سعر الشراء</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">سعر البيع</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">التكلفة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">القيمة</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map(p => `
                                    <tr style="border-bottom: 1px solid var(--border); ${p.quantity === 0 ? 'background: rgba(255, 71, 87, 0.1);' : p.quantity < p.min_stock ? 'background: rgba(255, 165, 2, 0.1);' : ''}">
                                        <td style="padding: 12px;">${p.name}</td>
                                        <td style="padding: 12px;">${p.category || '-'}</td>
                                        <td style="padding: 12px;">${p.condition || '-'}</td>
                                        <td style="padding: 12px; ${p.quantity === 0 ? 'color: var(--danger);' : p.quantity < p.min_stock ? 'color: var(--warn);' : ''} font-weight: bold;">${p.quantity}</td>
                                        <td style="padding: 12px;">${fmt(p.cost_price)}</td>
                                        <td style="padding: 12px;">${fmt(p.selling_price)}</td>
                                        <td style="padding: 12px;">${fmt(p.quantity * p.cost_price)}</td>
                                        <td style="padding: 12px;">${fmt(p.quantity * p.selling_price)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        reportContent.innerHTML = html;
    }, 500);
}

// دالة عرض تقرير المخزون المنخفض
function showLowStockReport() {
    const reportContent = document.getElementById('inventory-report-content');
    reportContent.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spin"></div><p>جاري تحميل تقرير المخزون المنخفض...</p></div>';

    setTimeout(() => {
        const products = (DB.products || []).filter(p => p.quantity > 0 && p.quantity < p.min_stock);

        if (products.length === 0) {
            reportContent.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: var(--muted);">
                    <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
                    <p style="font-size: 18px;">لا توجد منتجات بمخزون منخفض</p>
                </div>
            `;
            return;
        }

        let html = `
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--warn); margin-bottom: 15px;">⚠️ تقرير المخزون المنخفض</h3>

                <div style="background: var(--bg2); padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <div style="font-size: 14px; color: var(--muted);">عدد المنتجات بمخزون منخفض:</div>
                    <div style="font-size: 32px; font-weight: bold; color: var(--warn);">${products.length}</div>
                </div>

                <!-- جدول المخزون المنخفض -->
                <div style="background: var(--bg2); border-radius: 10px; overflow: hidden; border: 1px solid var(--border);">
                    <div style="padding: 15px; border-bottom: 1px solid var(--border); background: var(--bg3);">
                        <h4 style="margin: 0; color: var(--text);">المنتجات التي تحتاج إلى إعادة تعبئة</h4>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg3);">
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المنتج</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الفئة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الكمية الحالية</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الحد الأدنى</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">النقص</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">سعر الشراء</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map(p => `
                                    <tr style="border-bottom: 1px solid var(--border); background: rgba(255, 165, 2, 0.1);">
                                        <td style="padding: 12px;">${p.name}</td>
                                        <td style="padding: 12px;">${p.category || '-'}</td>
                                        <td style="padding: 12px; color: var(--warn); font-weight: bold;">${p.quantity}</td>
                                        <td style="padding: 12px;">${p.min_stock}</td>
                                        <td style="padding: 12px; color: var(--danger); font-weight: bold;">${p.min_stock - p.quantity}</td>
                                        <td style="padding: 12px;">${fmt(p.cost_price)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        reportContent.innerHTML = html;
    }, 500);
}

// دالة عرض تقرير المخزون المنتهي
function showOutOfStockReport() {
    const reportContent = document.getElementById('inventory-report-content');
    reportContent.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spin"></div><p>جاري تحميل تقرير المخزون المنتهي...</p></div>';

    setTimeout(() => {
        const products = (DB.products || []).filter(p => p.quantity === 0);

        if (products.length === 0) {
            reportContent.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: var(--muted);">
                    <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
                    <p style="font-size: 18px;">لا توجد منتجات منتهية من المخزون</p>
                </div>
            `;
            return;
        }

        let html = `
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--danger); margin-bottom: 15px;">❌ تقرير المخزون المنتهي</h3>

                <div style="background: var(--bg2); padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <div style="font-size: 14px; color: var(--muted);">عدد المنتجات المنتهية:</div>
                    <div style="font-size: 32px; font-weight: bold; color: var(--danger);">${products.length}</div>
                </div>

                <!-- جدول المخزون المنتهي -->
                <div style="background: var(--bg2); border-radius: 10px; overflow: hidden; border: 1px solid var(--border);">
                    <div style="padding: 15px; border-bottom: 1px solid var(--border); background: var(--bg3);">
                        <h4 style="margin: 0; color: var(--text);">المنتجات المنتهية من المخزون</h4>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg3);">
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المنتج</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الفئة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الباركود</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">آخر سعر شراء</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">سعر البيع</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map(p => `
                                    <tr style="border-bottom: 1px solid var(--border); background: rgba(255, 71, 87, 0.1);">
                                        <td style="padding: 12px;">${p.name}</td>
                                        <td style="padding: 12px;">${p.category || '-'}</td>
                                        <td style="padding: 12px;">${p.barcode || '-'}</td>
                                        <td style="padding: 12px;">${fmt(p.cost_price)}</td>
                                        <td style="padding: 12px;">${fmt(p.selling_price)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        reportContent.innerHTML = html;
    }, 500);
}

// دالة عرض تقرير المخزون حسب الفئة
function showInventoryByCategoryReport() {
    const reportContent = document.getElementById('inventory-report-content');
    reportContent.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spin"></div><p>جاري تحميل تقرير المخزون حسب الفئة...</p></div>';

    setTimeout(() => {
        const products = DB.products || [];
        const categories = [...new Set(products.map(p => p.category).filter(c => c))];

        let html = `
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--accent); margin-bottom: 15px;">📈 تقرير المخزون حسب الفئة</h3>

                <div style="background: var(--bg2); padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <div style="font-size: 14px; color: var(--muted);">عدد الفئات:</div>
                    <div style="font-size: 32px; font-weight: bold; color: var(--accent);">${categories.length}</div>
                </div>

                <!-- جدول المخزون حسب الفئة -->
                <div style="background: var(--bg2); border-radius: 10px; overflow: hidden; border: 1px solid var(--border);">
                    <div style="padding: 15px; border-bottom: 1px solid var(--border); background: var(--bg3);">
                        <h4 style="margin: 0; color: var(--text);">تفاصيل المخزون حسب الفئة</h4>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg3);">
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الفئة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">عدد المنتجات</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">إجمالي الكمية</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">إجمالي التكلفة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">إجمالي القيمة</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${categories.map(category => {
                                    const categoryProducts = products.filter(p => p.category === category);
                                    const totalQuantity = categoryProducts.reduce((sum, p) => sum + p.quantity, 0);
                                    const totalCost = categoryProducts.reduce((sum, p) => sum + (p.quantity * p.cost_price), 0);
                                    const totalValue = categoryProducts.reduce((sum, p) => sum + (p.quantity * p.selling_price), 0);
                                    return `
                                        <tr style="border-bottom: 1px solid var(--border);">
                                            <td style="padding: 12px; font-weight: bold;">${category}</td>
                                            <td style="padding: 12px;">${categoryProducts.length}</td>
                                            <td style="padding: 12px;">${totalQuantity}</td>
                                            <td style="padding: 12px;">${fmt(totalCost)}</td>
                                            <td style="padding: 12px; color: var(--accent); font-weight: bold;">${fmt(totalValue)}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        reportContent.innerHTML = html;
    }, 500);
}

// دالة عرض تقرير قيمة المخزون والرأسمال
function showInventoryValueReport() {
    const reportContent = document.getElementById('inventory-report-content');
    reportContent.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spin"></div><p>جاري تحميل تقرير قيمة المخزون والرأسمال...</p></div>';

    setTimeout(() => {
        const products = DB.products || [];
        const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
        const totalCost = products.reduce((sum, p) => sum + (p.quantity * p.cost_price), 0);
        const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.selling_price), 0);
        const expectedProfit = totalValue - totalCost;
        const capital = totalCost;

        let html = `
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--accent); margin-bottom: 15px;">💰 تقرير قيمة المخزون والرأسمال</h3>

                <!-- بطاقات الملخص -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي الكمية</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent);">${totalQuantity}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي التكلفة</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--warn);">${fmt(capital)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي القيمة</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent);">${fmt(totalValue)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">الربح المتوقع</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent2);">${fmt(expectedProfit)}</div>
                    </div>
                </div>

                <!-- جدول تفصيلي -->
                <div style="background: var(--bg2); border-radius: 10px; overflow: hidden; border: 1px solid var(--border);">
                    <div style="padding: 15px; border-bottom: 1px solid var(--border); background: var(--bg3);">
                        <h4 style="margin: 0; color: var(--text);">تفاصيل المخزون</h4>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg3);">
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المنتج</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الكمية</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">سعر الشراء</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">سعر البيع</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">التكلفة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">القيمة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الربح المتوقع</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map(p => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 12px;">${p.name}</td>
                                        <td style="padding: 12px;">${p.quantity}</td>
                                        <td style="padding: 12px;">${fmt(p.cost_price)}</td>
                                        <td style="padding: 12px;">${fmt(p.selling_price)}</td>
                                        <td style="padding: 12px;">${fmt(p.quantity * p.cost_price)}</td>
                                        <td style="padding: 12px;">${fmt(p.quantity * p.selling_price)}</td>
                                        <td style="padding: 12px; color: var(--accent2); font-weight: bold;">${fmt(p.quantity * (p.selling_price - p.cost_price))}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        reportContent.innerHTML = html;
    }, 500);
}

// دالة عرض تقرير المشتريات
function showPurchasesReport() {
    const reportContent = document.getElementById('financial-report-content');
    reportContent.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spin"></div><p>جاري تحميل تقرير المشتريات...</p></div>';

    setTimeout(() => {
        const purchases = DB.purchases || [];
        const totalPurchases = purchases.reduce((sum, p) => sum + p.total_amount, 0);
        const totalPaid = purchases.reduce((sum, p) => sum + p.paid_amount, 0);
        const totalRemaining = purchases.reduce((sum, p) => sum + (p.remaining_amount || 0), 0);

        let html = `
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--accent); margin-bottom: 15px;">🛒 تقرير المشتريات</h3>

                <!-- بطاقات الملخص -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي المشتريات</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent);">${fmt(totalPurchases)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">المبالغ المدفوعة</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent2);">${fmt(totalPaid)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">المبالغ المتبقية</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--danger);">${fmt(totalRemaining)}</div>
                    </div>
                </div>

                <!-- جدول المشتريات -->
                <div style="background: var(--bg2); border-radius: 10px; overflow: hidden; border: 1px solid var(--border);">
                    <div style="padding: 15px; border-bottom: 1px solid var(--border); background: var(--bg3);">
                        <h4 style="margin: 0; color: var(--text);">تفاصيل المشتريات</h4>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg3);">
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">رقم الفاتورة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">التاريخ</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المورد</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المبلغ</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المدفوع</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المتبقي</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${purchases.map(p => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 12px;">${p.invoice_number}</td>
                                        <td style="padding: 12px;">${p.purchase_date}</td>
                                        <td style="padding: 12px;">${p.supplier_name || '-'}</td>
                                        <td style="padding: 12px; color: var(--accent); font-weight: bold;">${fmt(p.total_amount)}</td>
                                        <td style="padding: 12px; color: var(--accent2); font-weight: bold;">${fmt(p.paid_amount)}</td>
                                        <td style="padding: 12px; color: var(--danger); font-weight: bold;">${fmt(p.remaining_amount || 0)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        reportContent.innerHTML = html;
    }, 500);
}

// دالة تصدير تقرير المبيعات إلى Excel
function exportSalesReport() {
    const period = document.getElementById('sales-period').value;
    let sales = [...(DB.sales || [])];

    // تطبيق نفس الفلترة المستخدمة في العرض
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    sales = sales.filter(sale => {
        if (period === 'today') {
            return sale.sale_date === todayStr;
        } else if (period === 'week') {
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return new Date(sale.sale_date) >= weekAgo;
        } else if (period === 'month') {
            const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);
            return new Date(sale.sale_date) >= monthAgo;
        } else if (period === 'quarter') {
            const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
            return new Date(sale.sale_date) >= quarterAgo;
        } else if (period === 'year') {
            const yearAgo = new Date(today.getFullYear(), 0, 1);
            return new Date(sale.sale_date) >= yearAgo;
        }
        return true;
    });

    // ترتيب النتائج
    sales.sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));

    // إنشاء محتوى CSV
    let csvContent = '﻿'; // BOM للدعم العربي
    csvContent += 'رقم الفاتورة,التاريخ,الوقت,المستخدم,المبلغ,الربح\n';

    sales.forEach(sale => {
        const row = [
            sale.invoice_number,
            sale.sale_date,
            sale.sale_time || '',
            sale.username || '',
            sale.total_amount,
            sale.profit || 0
        ].join(',');
        csvContent += row + '\n';
    });

    // تحميل الملف
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_المبيعات_${getPeriodText(period)}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast('✅ تم تصدير التقرير بنجاح');
}

// دالة طباعة تقرير المبيعات
function printSalesReport() {
    const period = document.getElementById('sales-period').value;
    let sales = [...(DB.sales || [])];

    // تطبيق الفلترة
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    sales = sales.filter(sale => {
        if (period === 'today') {
            return sale.sale_date === todayStr;
        } else if (period === 'week') {
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return new Date(sale.sale_date) >= weekAgo;
        } else if (period === 'month') {
            const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);
            return new Date(sale.sale_date) >= monthAgo;
        } else if (period === 'quarter') {
            const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
            return new Date(sale.sale_date) >= quarterAgo;
        } else if (period === 'year') {
            const yearAgo = new Date(today.getFullYear(), 0, 1);
            return new Date(sale.sale_date) >= yearAgo;
        }
        return true;
    });

    sales.sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));

    const totalSales = sales.reduce((sum, s) => sum + s.total_amount, 0);
    const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);

    // إنشاء نافذة الطباعة
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>تقرير المبيعات</title>
            <style>
                body { font-family: 'Cairo', Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 10px; text-align: right; border-bottom: 1px solid #ddd; }
                th { background: #f5f5f5; }
                .summary { background: #f0f3f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
                .summary-item { margin: 10px 0; }
            </style>
        </head>
        <body>
            <h1>📊 تقرير المبيعات - ${getPeriodText(period)}</h1>
            <div class="summary">
                <div class="summary-item">📅 الفترة: ${getPeriodText(period)}</div>
                <div class="summary-item">📄 عدد الفواتير: ${sales.length}</div>
                <div class="summary-item">💰 إجمالي المبيعات: ${fmt(totalSales)}</div>
                <div class="summary-item">💹 إجمالي الأرباح: ${fmt(totalProfit)}</div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>رقم الفاتورة</th>
                        <th>التاريخ</th>
                        <th>الوقت</th>
                        <th>المستخدم</th>
                        <th>المبلغ</th>
                        <th>الربح</th>
                    </tr>
                </thead>
                <tbody>
                    ${sales.map(sale => `
                        <tr>
                            <td>${sale.invoice_number}</td>
                            <td>${sale.sale_date}</td>
                            <td>${sale.sale_time || '-'}</td>
                            <td>${sale.username || '-'}</td>
                            <td>${fmt(sale.total_amount)}</td>
                            <td>${fmt(sale.profit || 0)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="margin-top: 20px; text-align: center; color: #666;">
                🏁 نهاية التقرير
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// دالة حذف فاتورة من التقرير
function deleteSaleFromReport() {
    const invoiceNumber = prompt('أدخل رقم الفاتورة للحذف:');
    if (!invoiceNumber) return;

    const sale = DB.sales.find(s => s.invoice_number === invoiceNumber);
    if (!sale) {
        toast('❌ الفاتورة غير موجودة', 'error');
        return;
    }

    if (!confirm(`هل أنت متأكد من حذف الفاتورة ${invoiceNumber}?`)) return;

    DB.deleteSale(sale.id);
    toast('✅ تم حذف الفاتورة بنجاح');
    updateSalesReport();
}

// دالة عرض تقرير المصاريف
function showExpensesReport() {
    const reportContent = document.getElementById('financial-report-content');
    reportContent.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spin"></div><p>جاري تحميل تقرير المصاريف...</p></div>';

    setTimeout(() => {
        const expenses = DB.getExpenses ? DB.getExpenses() : [];
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

        // تجميع المصاريف حسب النوع
        const expensesByType = {};
        expenses.forEach(e => {
            const type = e.expense_type || 'غير مصنف';
            expensesByType[type] = (expensesByType[type] || 0) + e.amount;
        });

        let html = `
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--accent); margin-bottom: 15px;">💸 تقرير المصاريف</h3>

                <!-- بطاقات الملخص -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي المصاريف</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--danger);">${fmt(totalExpenses)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">عدد المصروفات</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--text);">${expenses.length}</div>
                    </div>
                </div>

                <!-- تجميع حسب النوع -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    ${Object.entries(expensesByType).map(([type, amount]) => `
                        <div style="background: var(--bg2); padding: 15px; border-radius: 8px; border: 1px solid var(--border);">
                            <div style="font-size: 12px; color: var(--muted); margin-bottom: 5px;">${type}</div>
                            <div style="font-size: 20px; font-weight: bold; color: var(--danger);">${fmt(amount)}</div>
                        </div>
                    `).join('')}
                </div>

                <!-- جدول المصاريف -->
                <div style="background: var(--bg2); border-radius: 10px; overflow: hidden; border: 1px solid var(--border);">
                    <div style="padding: 15px; border-bottom: 1px solid var(--border); background: var(--bg3);">
                        <h4 style="margin: 0; color: var(--text);">تفاصيل المصاريف</h4>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg3);">
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">التاريخ</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الوصف</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">النوع</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المبلغ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${expenses.map(e => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 12px;">${e.expense_date}</td>
                                        <td style="padding: 12px;">${e.description || '-'}</td>
                                        <td style="padding: 12px;">${e.expense_type || '-'}</td>
                                        <td style="padding: 12px; color: var(--danger); font-weight: bold;">${fmt(e.amount)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        reportContent.innerHTML = html;
    }, 500);
}

// دالة عرض تقرير المخزون
function showInventoryReport() {
    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spin"></div><p>جاري تحميل تقرير المخزون...</p></div>';

    setTimeout(() => {
        const products = DB.products || [];
        const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.selling_price), 0);
        const totalCost = products.reduce((sum, p) => sum + (p.quantity * p.cost_price), 0);
        const totalProfit = products.reduce((sum, p) => sum + (p.quantity * (p.selling_price - p.cost_price)), 0);
        const lowStock = products.filter(p => p.quantity <= p.min_stock);

        let html = `
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--accent); margin-bottom: 15px;">📋 تقرير المخزون</h3>

                <!-- بطاقات الملخص -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي قيمة المخزون</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent);">${fmt(totalValue)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي تكلفة المخزون</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent2);">${fmt(totalCost)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">الربح المتوقع</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent2);">${fmt(totalProfit)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">منتجات منخفضة المخزون</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--danger);">${lowStock.length}</div>
                    </div>
                </div>

                ${lowStock.length > 0 ? `
                <!-- تنبيه المخزون المنخفض -->
                <div style="background: rgba(255, 71, 87, 0.1); border: 1px solid var(--danger); border-radius: 10px; padding: 15px; margin-bottom: 25px;">
                    <h4 style="color: var(--danger); margin: 0 0 10px 0;">⚠️ منتجات منخفضة المخزون</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                        ${lowStock.map(p => `
                            <div style="background: var(--bg2); padding: 10px; border-radius: 8px;">
                                <div style="font-weight: bold; margin-bottom: 5px;">${p.name}</div>
                                <div style="font-size: 12px; color: var(--muted);">الكمية: ${p.quantity} | الحد الأدنى: ${p.min_stock}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- جدول المخزون -->
                <div style="background: var(--bg2); border-radius: 10px; overflow: hidden; border: 1px solid var(--border);">
                    <div style="padding: 15px; border-bottom: 1px solid var(--border); background: var(--bg3);">
                        <h4 style="margin: 0; color: var(--text);">تفاصيل المخزون</h4>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg3);">
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المنتج</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الماركة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الكمية</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">سعر الشراء</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">سعر البيع</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">قيمة المخزون</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الربح المتوقع</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map(p => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 12px;">${p.name}</td>
                                        <td style="padding: 12px;">${p.brand}</td>
                                        <td style="padding: 12px;">${p.quantity}</td>
                                        <td style="padding: 12px;">${fmt(p.cost_price)}</td>
                                        <td style="padding: 12px;">${fmt(p.selling_price)}</td>
                                        <td style="padding: 12px; color: var(--accent); font-weight: bold;">${fmt(p.quantity * p.selling_price)}</td>
                                        <td style="padding: 12px; color: var(--accent2); font-weight: bold;">${fmt(p.quantity * (p.selling_price - p.cost_price))}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        reportContent.innerHTML = html;
    }, 500);
}

// دالة عرض تقرير الصيانة
function showMaintenanceReport() {
    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spin"></div><p>جاري تحميل تقرير الصيانة...</p></div>';

    setTimeout(() => {
        const maintenance = DB.getMaintenance() || [];
        const totalCost = maintenance.reduce((sum, m) => sum + m.cost, 0);
        const totalSales = maintenance.reduce((sum, m) => sum + m.selling_price, 0);
        const totalProfit = maintenance.reduce((sum, m) => sum + (m.selling_price - m.cost), 0);

        // تجميع حسب الحالة
        const byStatus = {};
        maintenance.forEach(m => {
            const status = m.status || 'غير محدد';
            byStatus[status] = (byStatus[status] || 0) + 1;
        });

        let html = `
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--accent); margin-bottom: 15px;">🔧 تقرير الصيانة</h3>

                <!-- بطاقات الملخص -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">عدد الطلبات</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--text);">${maintenance.length}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي التكاليف</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--danger);">${fmt(totalCost)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي المبيعات</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent);">${fmt(totalSales)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">صافي الربح</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent2);">${fmt(totalProfit)}</div>
                    </div>
                </div>

                <!-- تجميع حسب الحالة -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    ${Object.entries(byStatus).map(([status, count]) => `
                        <div style="background: var(--bg2); padding: 15px; border-radius: 8px; border: 1px solid var(--border);">
                            <div style="font-size: 12px; color: var(--muted); margin-bottom: 5px;">${status}</div>
                            <div style="font-size: 20px; font-weight: bold; color: var(--accent);">${count}</div>
                        </div>
                    `).join('')}
                </div>

                <!-- جدول الصيانة -->
                <div style="background: var(--bg2); border-radius: 10px; overflow: hidden; border: 1px solid var(--border);">
                    <div style="padding: 15px; border-bottom: 1px solid var(--border); background: var(--bg3);">
                        <h4 style="margin: 0; color: var(--text);">تفاصيل الصيانة</h4>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg3);">
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">العميل</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الهاتف</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الجهاز</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المشكلة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">التكلفة</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">سعر البيع</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الربح</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${maintenance.map(m => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 12px;">${m.customer_name}</td>
                                        <td style="padding: 12px;">${m.phone}</td>
                                        <td style="padding: 12px;">${m.device_model}</td>
                                        <td style="padding: 12px;">${m.problem_description}</td>
                                        <td style="padding: 12px; color: var(--danger); font-weight: bold;">${fmt(m.cost)}</td>
                                        <td style="padding: 12px; color: var(--accent); font-weight: bold;">${fmt(m.selling_price)}</td>
                                        <td style="padding: 12px; color: var(--accent2); font-weight: bold;">${fmt(m.selling_price - m.cost)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        reportContent.innerHTML = html;
    }, 500);
}

// دالة عرض تقرير الأرباح
function showProfitReport() {
    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spin"></div><p>جاري تحميل تقرير الأرباح...</p></div>';

    setTimeout(() => {
        const sales = DB.sales || [];
        const expenses = DB.getExpenses ? DB.getExpenses() : [];
        const maintenance = DB.getMaintenance() || [];

        const totalSales = sales.reduce((sum, s) => sum + s.total_amount, 0);
        const totalSalesProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const maintenanceProfit = maintenance.reduce((sum, m) => sum + (m.selling_price - m.cost), 0);
        const totalProfit = totalSalesProfit + maintenanceProfit - totalExpenses;

        // تجميع البيانات حسب الشهر
        const monthlyData = {};
        [...sales, ...expenses].forEach(item => {
            const month = (item.sale_date || item.expense_date || '').substring(0, 7);
            if (!month) return;

            if (!monthlyData[month]) {
                monthlyData[month] = { sales: 0, expenses: 0, profit: 0 };
            }

            if (item.total_amount) {
                monthlyData[month].sales += item.total_amount;
                monthlyData[month].profit += (item.profit || 0);
            }
            if (item.amount) {
                monthlyData[month].expenses += item.amount;
                monthlyData[month].profit -= item.amount;
            }
        });

        // إضافة أرباح الصيانة
        maintenance.forEach(m => {
            const month = (m.received_date || '').substring(0, 7);
            if (!month) return;

            if (!monthlyData[month]) {
                monthlyData[month] = { sales: 0, expenses: 0, profit: 0 };
            }
            monthlyData[month].profit += (m.selling_price - m.cost);
        });

        const sortedMonths = Object.keys(monthlyData).sort();

        let html = `
            <div style="margin-bottom: 25px;">
                <h3 style="color: var(--accent); margin-bottom: 15px;">💹 تقرير الأرباح الشامل</h3>

                <!-- بطاقات الملخص -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي المبيعات</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--accent);">${fmt(totalSales)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">إجمالي المصاريف</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--danger);">${fmt(totalExpenses)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">أرباح الصيانة</div>
                        <div style="font-size: 24px; font-weight: bold; color: var(--warn);">${fmt(maintenanceProfit)}</div>
                    </div>
                    <div style="background: var(--bg2); padding: 20px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">صافي الربح</div>
                        <div style="font-size: 24px; font-weight: bold; color: ${totalProfit >= 0 ? 'var(--accent2)' : 'var(--danger)'};">${fmt(totalProfit)}</div>
                    </div>
                </div>

                <!-- جدول الأرباح الشهري -->
                <div style="background: var(--bg2); border-radius: 10px; overflow: hidden; border: 1px solid var(--border);">
                    <div style="padding: 15px; border-bottom: 1px solid var(--border); background: var(--bg3);">
                        <h4 style="margin: 0; color: var(--text);">الأرباح الشهرية</h4>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg3);">
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">الشهر</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المبيعات</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">المصاريف</th>
                                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 12px;">صافي الربح</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sortedMonths.map(month => {
                                    const data = monthlyData[month];
                                    return `
                                        <tr style="border-bottom: 1px solid var(--border);">
                                            <td style="padding: 12px;">${month}</td>
                                            <td style="padding: 12px; color: var(--accent); font-weight: bold;">${fmt(data.sales)}</td>
                                            <td style="padding: 12px; color: var(--danger); font-weight: bold;">${fmt(data.expenses)}</td>
                                            <td style="padding: 12px; color: ${data.profit >= 0 ? 'var(--accent2)' : 'var(--danger)'}; font-weight: bold;">${fmt(data.profit)}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        reportContent.innerHTML = html;
    }, 500);
}

function currency() {
    const c = document.getElementById('pc');
    c.innerHTML = `<div style="max-width:720px">
      <div class="tw" style="padding:18px;margin-bottom:18px">
        <h3 style="margin-bottom:14px;color:var(--accent)">⚙️ أسعار الصرف</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div style="background:var(--bg3);border-radius:8px;padding:13px"><label style="font-size:11px;color:var(--muted)">🇸🇾 سوري (شراء)</label><input class="rin" id="r1" value="${rates.syp_buy}" oninput="svRates();calcCur()" style="margin-top:6px"></div>
          <div style="background:var(--bg3);border-radius:8px;padding:13px"><label style="font-size:11px;color:var(--muted)">🇸🇾 سوري (بيع)</label><input class="rin" id="r2" value="${rates.syp_sell}" oninput="svRates();calcCur()" style="margin-top:6px"></div>
          <div style="background:var(--bg3);border-radius:8px;padding:13px"><label style="font-size:11px;color:var(--muted)">🇹🇷 تركي (شراء)</label><input class="rin" id="r3" value="${rates.try_buy}" oninput="svRates();calcCur()" style="margin-top:6px"></div>
          <div style="background:var(--bg3);border-radius:8px;padding:13px"><label style="font-size:11px;color:var(--muted)">🇹🇷 تركي (بيع)</label><input class="rin" id="r4" value="${rates.try_sell}" oninput="svRates();calcCur()" style="margin-top:6px"></div>
        </div>
        <div style="margin-top:10px;padding:8px 12px;background:rgba(0,255,157,.08);border-radius:7px;font-size:12px;color:var(--accent2)">✅ تُحفظ تلقائياً ولا تتغير حتى تعدلها</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
        ${[['🇺🇸 دولار','usd','var(--accent)'],['🇸🇾 سوري','syp','var(--accent2)'],['🇹🇷 تركي','try','var(--warn)']].map(([lbl,id,cl])=>`
        <div class="tw" style="padding:14px">
          <h4 style="margin-bottom:11px;color:${cl}">${lbl} ←</h4>
          <input class="rin" id="${id}-in" type="number" placeholder="أدخل مبلغ..." oninput="calcCur()" style="margin-bottom:11px">
          <div id="${id}-res"></div>
        </div>`).join('')}
      </div>
    </div>`;
}

// أسعار الصرف الافتراضية
let rates = {
  syp_buy: 14800,
  syp_sell: 15000,
  try_buy: 29.5,
  try_sell: 30.5
};

let svT;
function svRates(){rates.syp_buy=parseFloat(document.getElementById('r1').value)||14800;rates.syp_sell=parseFloat(document.getElementById('r2').value)||15000;rates.try_buy=parseFloat(document.getElementById('r3').value)||29.5;rates.try_sell=parseFloat(document.getElementById('r4').value)||30.5;clearTimeout(svT);svT=setTimeout(()=>api('/api/currency/rates','POST',rates),900);}
function nv(id){return parseFloat(document.getElementById(id)?.value)||0;}
function resBox(label,value,color='var(--accent2)'){return`<div style="background:var(--bg3);border-radius:7px;padding:11px;margin-bottom:8px"><span style="font-size:11px;color:var(--muted)">${label}</span><div style="font-size:19px;font-weight:900;color:${color}">${fmt(value)}</div></div>`;}
function calcCur(){
  const{syp_buy:sb,syp_sell:ss,try_buy:tb,try_sell:ts}=rates;
  const usd=nv('usd-in'),syp=nv('syp-in'),tryv=nv('try-in');
  const ur=document.getElementById('usd-res'),sr=document.getElementById('syp-res'),tr=document.getElementById('try-res');
  if(ur&&usd){ur.innerHTML=resBox('سوري (شراء)',usd*sb)+resBox('سوري (بيع)',usd*ss,'var(--danger)')+resBox('تركي (شراء)',usd*tb)+resBox('تركي (بيع)',usd*ts,'var(--danger)');}
  if(sr&&syp){sr.innerHTML=resBox('دولار (شراء)',ss>0?syp/ss:0)+resBox('دولار (بيع)',sb>0?syp/sb:0,'var(--danger)')+resBox('تركي (شراء)',ts>0?syp/ts:0)+resBox('تركي (بيع)',tb>0?syp/tb:0,'var(--danger)');}
  if(tr&&tryv){tr.innerHTML=resBox('دولار (شراء)',ts>0?tryv/ts:0)+resBox('دولار (بيع)',tb>0?tryv/tb:0,'var(--danger)')+resBox('سوري (شراء)',tryv*(ss>0?sb/ts:0))+resBox('سوري (بيع)',tryv*(tb>0?ss/tb:0),'var(--danger)');}
}

// تحميل أسعار الصرف من LocalStorage
const savedRates = localStorage.getItem('rates');
if (savedRates) {
  try {
    rates = JSON.parse(savedRates);
  } catch (e) {
    console.error('Error loading rates:', e);
  }
}

function barcode_sale() {
    const c = document.getElementById('pc');
    c.innerHTML = `<div class="tw">
      <div class="th"><h3>📦 بيع بالباركود</h3></div>
      <div style="padding:20px">
        <div class="fg" style="margin-bottom:20px">
          <div class="ff full"><label>ماسح الرمز (أو ابحث عن المنتج)</label>
            <input id="barcode-input" placeholder="امسح الباركود أو ابحث..." autofocus style="font-size:16px;padding:10px;border:2px solid var(--accent);border-radius:8px">
          </div>
        </div>
        <div id="sale-cart"></div>
        <div style="margin-top:20px;padding:20px;background:var(--bg3);border-radius:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:10px">
            <span>الإجمالي:</span>
            <span id="total-amount" style="font-size:18px;font-weight:bold;color:var(--accent)">0</span>
          </div>
          <button class="btn btn-success" style="width:100%;margin-bottom:10px" onclick="completeSale()">✅ إتمام البيع</button>
          <button class="btn btn-ghost" style="width:100%" onclick="clearCart()">🗑️ مسح السلة</button>
        </div>
      </div>
    </div>`;

    let cart = [];
    document.getElementById('barcode-input').addEventListener('keypress', async (e) => {
        if (e.key !== 'Enter') return;
        const code = e.target.value.trim();
        e.target.value = '';

        const product = DB.products.find(p => 
            p.barcode === code || 
            p.name.toLowerCase().includes(code.toLowerCase()) ||
            p.id.toString() === code
        );

        if (product) {
            const existing = cart.find(c => c.id === product.id);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ ...product, qty: 1 });
            }
            updateCart(cart);
            e.target.focus();
        } else {
            toast('❌ المنتج غير موجود', 'error');
        }
    });

    window.updateCart = (items) => {
        const html = items.map(p => `
          <div style="background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <b>${p.name}</b><br>
              <span style="color:var(--muted);font-size:12px">${p.brand} - ${fmt(p.selling_price)} لكل واحد</span>
            </div>
            <div style="display:flex;gap:5px;align-items:center">
              <button class="btn btn-ghost btn-sm" onclick="decreaseQty(${p.id},window.cartItems)">➖</button>
              <span style="font-weight:bold;min-width:30px;text-align:center">${p.qty}</span>
              <button class="btn btn-ghost btn-sm" onclick="increaseQty(${p.id},window.cartItems)">➕</button>
              <button class="btn btn-danger btn-sm" onclick="removeItem(${p.id},window.cartItems)">🗑️</button>
              <span style="font-weight:bold;color:var(--accent);min-width:80px;text-align:right">${fmt(p.qty * p.selling_price)}</span>
            </div>
          </div>
        `).join('');

        document.getElementById('sale-cart').innerHTML = html || '<p style="color:var(--muted);text-align:center">السلة فارغة</p>';

        const total = items.reduce((a, p) => a + (p.qty * p.selling_price), 0);
        document.getElementById('total-amount').textContent = fmt(total);

        window.cartItems = items;
    };

    window.increaseQty = (id, items) => {
        const item = items.find(i => i.id === id);
        if (item) item.qty++;
        updateCart(items);
    };

    window.decreaseQty = (id, items) => {
        const item = items.find(i => i.id === id);
        if (item && item.qty > 1) item.qty--;
        updateCart(items);
    };

    window.removeItem = (id, items) => {
        const idx = items.findIndex(i => i.id === id);
        if (idx > -1) items.splice(idx, 1);
        updateCart(items);
    };

    window.completeSale = () => {
        if (!window.cartItems?.length) {
            toast('❌ السلة فارغة', 'error');
            return;
        }

        const total = window.cartItems.reduce((a, p) => a + (p.qty * p.selling_price), 0);

        // تحديث المخزون وحساب الربح
        let profit = 0;
        window.cartItems.forEach(item => {
            const product = DB.products.find(p => p.id === item.id);
            if (product) {
                product.quantity -= item.qty;
                profit += (item.selling_price - product.cost_price) * item.qty;
                DB.saveProduct(product);
            }
        });

        const sale = {
            items: window.cartItems.map(p => ({
                product_id: p.id,
                quantity: p.qty,
                unit_price: p.selling_price
            })),
            total_amount: total,
            paid_amount: total,
            remaining_amount: 0,
            payment_method: 'نقدي',
            profit: profit,
            username: Auth.currentUser?.username || 'مستخدم'
        };

        DB.saveSale(sale);
        toast(`✅ فاتورة ${sale.invoice_number} | الإجمالي: ${fmt(total)}`);
        window.cartItems = [];
        updateCart([]);
        document.getElementById('barcode-input').focus();
    };

    window.clearCart = () => {
        if (confirm('هل متأكد؟')) {
            window.cartItems = [];
            updateCart([]);
        }
    };

    updateCart(cart);
}

function barcode_return() {
    const c = document.getElementById('pc');
    c.innerHTML = `<div class="tw">
      <div class="th"><h3>🔄 استرجاع بالباركود</h3></div>
      <div style="padding:20px">
        <div class="fg" style="margin-bottom:20px">
          <div class="ff full"><label>ماسح الرمز (أو ابحث عن المنتج)</label>
            <input id="return-input" placeholder="امسح الباركود أو ابحث..." autofocus style="font-size:16px;padding:10px;border:2px solid var(--warn);border-radius:8px">
          </div>
        </div>
        <div id="return-list"></div>
        <div style="margin-top:20px;padding:20px;background:var(--bg3);border-radius:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:10px">
            <span>إجمالي المرجعات:</span>
            <span id="total-return" style="font-size:18px;font-weight:bold;color:var(--warn)">0</span>
          </div>
          <button class="btn btn-warn" style="width:100%;margin-bottom:10px;background:var(--warn);color:#0f1923" onclick="completeReturn()">✅ إتمام الاسترجاع</button>
          <button class="btn btn-ghost" style="width:100%" onclick="clearReturns()">🗑️ مسح القائمة</button>
        </div>
      </div>
    </div>`;

    let returns = [];
    document.getElementById('return-input').addEventListener('keypress', (e) => {
        if (e.key !== 'Enter') return;
        const code = e.target.value.trim();
        e.target.value = '';

        const product = DB.products.find(p => 
            p.barcode === code || 
            p.name.toLowerCase().includes(code.toLowerCase()) ||
            p.id.toString() === code
        );

        if (product) {
            const existing = returns.find(c => c.id === product.id);
            if (existing) {
                existing.qty++;
            } else {
                returns.push({ ...product, qty: 1 });
            }
            updateReturns(returns);
            e.target.focus();
        } else {
            toast('❌ المنتج غير موجود', 'error');
        }
    });

    window.updateReturns = (items) => {
        const html = items.map(p => `
          <div style="background:var(--bg2);border:2px solid var(--warn);border-radius:8px;padding:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <b>${p.name}</b><br>
              <span style="color:var(--muted);font-size:12px">${p.brand} - سعر الاسترجاع: ${fmt(p.selling_price)}</span>
            </div>
            <div style="display:flex;gap:5px;align-items:center">
              <button class="btn btn-ghost btn-sm" onclick="decreaseReturn(${p.id},window.returnItems)">➖</button>
              <span style="font-weight:bold;min-width:30px;text-align:center">${p.qty}</span>
              <button class="btn btn-ghost btn-sm" onclick="increaseReturn(${p.id},window.returnItems)">➕</button>
              <button class="btn btn-danger btn-sm" onclick="removeReturn(${p.id},window.returnItems)">🗑️</button>
              <span style="font-weight:bold;color:var(--warn);min-width:80px;text-align:right">${fmt(p.qty * p.selling_price)}</span>
            </div>
          </div>
        `).join('');

        document.getElementById('return-list').innerHTML = html || '<p style="color:var(--muted);text-align:center">لا توجد مرجعات</p>';

        const total = items.reduce((a, p) => a + (p.qty * p.selling_price), 0);
        document.getElementById('total-return').textContent = fmt(total);

        window.returnItems = items;
    };

    window.increaseReturn = (id, items) => {
        const item = items.find(i => i.id === id);
        if (item) item.qty++;
        updateReturns(items);
    };

    window.decreaseReturn = (id, items) => {
        const item = items.find(i => i.id === id);
        if (item && item.qty > 1) item.qty--;
        updateReturns(items);
    };

    window.removeReturn = (id, items) => {
        const idx = items.findIndex(i => i.id === id);
        if (idx > -1) items.splice(idx, 1);
        updateReturns(items);
    };

    window.completeReturn = () => {
        if (!window.returnItems?.length) {
            toast('❌ لا توجد مرجعات', 'error');
            return;
        }

        // تحديث المخزون
        window.returnItems.forEach(item => {
            const product = DB.products.find(p => p.id === item.id);
            if (product) {
                product.quantity += item.qty;
                DB.saveProduct(product);
            }
        });

        toast('✅ تم معالجة الاسترجاع بنجاح');
        window.returnItems = [];
        updateReturns([]);
        document.getElementById('return-input').focus();
    };

    window.clearReturns = () => {
        if (confirm('هل متأكد؟')) {
            window.returnItems = [];
            updateReturns([]);
        }
    };

    updateReturns(returns);
}

function count() {
    const c = document.getElementById('pc');
    c.innerHTML = `<div class="tw"><div class="th"><h3>📊 الجرد</h3></div><div style="padding:20px">✅ قسم الجرد - جاهز للاستخدام</div></div>`;
}

function mobile() {
    const c = document.getElementById('pc');

    // التحقق من وجود البيانات
    if (!DB.mobiles) DB.mobiles = { inventory: [], purchases: [], payments: [], debts: [], cash: [] };
    if (!DB.products) DB.products = [];
    if (!DB.purchases) DB.purchases = [];
    if (!DB.payments) DB.payments = [];
    if (!DB.sales) DB.sales = [];

    const html = `
    <div class="tw">
        <div class="th">
            <h3>📱 إدارة الموبايلات والمخزون</h3>
            <button class="btn btn-ghost btn-sm" onclick="generateMobileReport()">📊 تقرير شامل</button>
        </div>

        <!-- التبويبات -->
        <div class="tabs" style="display: flex; gap: 10px; margin: 15px; border-bottom: 2px solid var(--border); padding-bottom: 10px;">
            <button class="tab-btn active" data-tab="inventory" onclick="switchMobileTab('inventory')">📦 مخزون الموبايلات</button>
            <button class="tab-btn" data-tab="purchases" onclick="switchMobileTab('purchases')">🛒 فواتير المشتريات</button>
            <button class="tab-btn" data-tab="payments" onclick="switchMobileTab('payments')">💸 الدفعات المتبقية</button>
            <button class="tab-btn" data-tab="debts" onclick="switchMobileTab('debts')">📝 ديون العملاء</button>
            <button class="tab-btn" data-tab="cash" onclick="switchMobileTab('cash')">💰 صندوق الموبايلات</button>
        </div>

        <!-- محتوى التبويبات -->
        <div id="mobile-tab-content">
            <!-- سيتم تحميل المحتوى حسب التبويب المختار -->
        </div>
    </div>`;

    c.innerHTML = html;

    // تحميل تبويب المخزون افتراضياً
    switchMobileTab('inventory');
}

// دالة التبديل بين التبويبات
function switchMobileTab(tab) {
    // تحديث الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });

    const content = document.getElementById('mobile-tab-content');

    switch(tab) {
        case 'inventory':
            loadMobileInventoryTab();
            break;
        case 'purchases':
            loadMobilePurchasesTab();
            break;
        case 'payments':
            loadMobilePaymentsTab();
            break;
        case 'debts':
            loadMobileDebtsTab();
            break;
        case 'cash':
            loadMobileCashTab();
            break;
    }
}

// تبويب مخزون الموبايلات
function loadMobileInventoryTab() {
    const content = document.getElementById('mobile-tab-content');

    const html = `
    <div class="sb-bar" style="margin: 15px 0;">
        <input class="si" id="mobile-search" placeholder="🔍 بحث..." oninput="refreshMobileInventory()">
        <div style="display: flex; gap: 10px; align-items: center;">
            <label>📅 من:</label>
            <input type="date" id="mobile-date-from" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">
            <label>إلى:</label>
            <input type="date" id="mobile-date-to" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">
            <button class="btn btn-sm" onclick="refreshMobileInventory()">🔍</button>
            <button class="btn btn-success btn-sm" onclick="addMobileProduct()">➕ إضافة موبايل</button>
            <button class="btn btn-warn btn-sm" onclick="editMobileProduct()">✏️ تعديل</button>
            <button class="btn btn-danger btn-sm" onclick="deleteMobileProduct()">🗑️ حذف</button>
            <button class="btn btn-ghost btn-sm" onclick="directSaleMobile()">💰 بيع مباشر</button>
            <button class="btn btn-danger btn-sm" onclick="clearMobileInventory()">🧨 حذف الجميع</button>
        </div>
    </div>

    <div class="tw" style="margin: 15px;">
        <div class="th">
            <h3>📦 مخزون الموبايلات</h3>
        </div>
        <div id="mobile-inventory-table"></div>
    </div>`;

    content.innerHTML = html;

    // تعيين التاريخ الافتراضي
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('mobile-date-from').value = today;
    document.getElementById('mobile-date-to').value = today;

    // تحميل البيانات
    refreshMobileInventory();
}

// دالة اختيار صفوف الجدول
function selectMobileRow(row) {
    // إزالة التحديد من جميع الصفوف
    document.querySelectorAll('.mobile-row').forEach(r => r.classList.remove('selected'));
    // إضافة التحديد للصف المحدد
    row.classList.add('selected');
}

function selectPurchaseRow(row) {
    document.querySelectorAll('.purchase-row').forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
}

function selectPaymentRow(row) {
    document.querySelectorAll('.payment-row').forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
}

function selectDebtRow(row) {
    document.querySelectorAll('.debt-row').forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
}

// دالة تحديث مخزون الموبايلات
function refreshMobileInventory() {
    const searchTerm = document.getElementById('mobile-search').value.trim().toLowerCase();
    const dateFrom = document.getElementById('mobile-date-from').value;
    const dateTo = document.getElementById('mobile-date-to').value;

    // تصفية المنتجات (فئة موبايلات فقط)
    let filtered = DB.products.filter(p => {
        if (p.category !== 'موبايلات') return false;
        if (p.is_deleted) return false;

        const matchesSearch = !searchTerm || 
            p.name.toLowerCase().includes(searchTerm) ||
            p.brand.toLowerCase().includes(searchTerm) ||
            p.model.toLowerCase().includes(searchTerm) ||
            p.barcode?.toLowerCase().includes(searchTerm);

        const matchesDate = (!dateFrom || p.created_date >= dateFrom) && 
                           (!dateTo || p.created_date <= dateTo);

        return matchesSearch && matchesDate;
    });

    // ترتيب حسب التاريخ (الأحدث أولاً)
    filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

    let html = '<table style="width: 100%; border-collapse: collapse;">';
    html += '<thead><tr style="background: var(--bg3);">';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الاسم</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الماركة</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الموديل</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الكمية</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الباركود</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">سعر الشراء</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">سعر البيع</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الحالة</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">التاريخ</th>';
    html += '</tr></thead><tbody>';

    filtered.forEach(p => {
        const status = p.quantity > p.min_stock ? '✅ متوفر' : 
                     p.quantity > 0 ? '⚠️ منخفض' : '❌ منتهي';
        html += `<tr class="mobile-row" data-id="${p.id}" style="cursor: pointer; border-bottom: 1px solid var(--border); transition: background 0.2s;" onclick="selectMobileRow(this)">`;
        html += `<td style="padding: 12px;">${p.name}</td>`;
        html += `<td style="padding: 12px;">${p.brand}</td>`;
        html += `<td style="padding: 12px;">${p.model}</td>`;
        html += `<td style="padding: 12px;">${p.quantity}</td>`;
        html += `<td style="padding: 12px;">${p.barcode}</td>`;
        html += `<td style="padding: 12px;">${fmt(p.cost_price)}</td>`;
        html += `<td style="padding: 12px;">${fmt(p.selling_price)}</td>`;
        html += `<td style="padding: 12px;">${status}</td>`;
        html += `<td style="padding: 12px;">${p.created_date}</td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';

    if (filtered.length === 0) {
        html += '<div style="text-align: center; padding: 40px; color: var(--muted);">لا توجد موبايلات في المخزون</div>';
    }

    document.getElementById('mobile-inventory-table').innerHTML = html;
}

// تبويب فواتير المشتريات
function loadMobilePurchasesTab() {
    const content = document.getElementById('mobile-tab-content');

    const html = `
    <div class="sb-bar" style="margin: 15px 0;">
        <input class="si" id="mobile-pur-search" placeholder="🔍 بحث..." oninput="refreshMobilePurchases()">
        <div style="display: flex; gap: 10px; align-items: center;">
            <label>📅 من:</label>
            <input type="date" id="mobile-pur-date-from" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">
            <label>إلى:</label>
            <input type="date" id="mobile-pur-date-to" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">
            <button class="btn btn-sm" onclick="refreshMobilePurchases()">🔍</button>
            <button class="btn btn-success btn-sm" onclick="addMobilePurchase()">➕ إضافة فاتورة</button>
            <button class="btn btn-warn btn-sm" onclick="editMobilePurchase()">✏️ تعديل</button>
            <button class="btn btn-danger btn-sm" onclick="deleteMobilePurchase()">🗑️ حذف</button>
            <button class="btn btn-danger btn-sm" onclick="clearMobilePurchases()">🧨 حذف الجميع</button>
        </div>
    </div>

    <div class="tw" style="margin: 15px;">
        <div class="th">
            <h3>🛒 فواتير مشتريات الموبايلات</h3>
        </div>
        <div id="mobile-purchases-table"></div>
    </div>`;

    content.innerHTML = html;

    // تعيين التاريخ الافتراضي
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('mobile-pur-date-from').value = today;
    document.getElementById('mobile-pur-date-to').value = today;

    // تحميل البيانات
    refreshMobilePurchases();
}

// دالة تحديث فواتير المشتريات
function refreshMobilePurchases() {
    const searchTerm = document.getElementById('mobile-pur-search').value.trim().toLowerCase();
    const dateFrom = document.getElementById('mobile-pur-date-from').value;
    const dateTo = document.getElementById('mobile-pur-date-to').value;

    // تصفية المشتريات التي تحتوي على موبايلات
    let filtered = DB.purchases.filter(p => {
        const hasMobiles = p.items?.some(item => {
            const product = DB.products.find(prod => prod.id === item.product_id);
            return product?.category === 'موبايلات';
        });

        if (!hasMobiles) return false;

        const matchesSearch = !searchTerm || 
            p.invoice_number.toLowerCase().includes(searchTerm) ||
            p.supplier_name?.toLowerCase().includes(searchTerm);

        const matchesDate = (!dateFrom || p.purchase_date >= dateFrom) && 
                           (!dateTo || p.purchase_date <= dateTo);

        return matchesSearch && matchesDate;
    });

    // ترتيب حسب التاريخ (الأحدث أولاً)
    filtered.sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date));

    let html = '<table style="width: 100%; border-collapse: collapse;">';
    html += '<thead><tr style="background: var(--bg3);">';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">رقم الفاتورة</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">المورد</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الإجمالي</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">المدفوع</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">المتبقي</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">التاريخ</th>';
    html += '</tr></thead><tbody>';

    filtered.forEach(p => {
        html += `<tr class="purchase-row" data-id="${p.id}" style="cursor: pointer; border-bottom: 1px solid var(--border); transition: background 0.2s;" onclick="selectPurchaseRow(this)">`;
        html += `<td style="padding: 12px;">${p.invoice_number}</td>`;
        html += `<td style="padding: 12px;">${p.supplier_name}</td>`;
        html += `<td style="padding: 12px;">${fmt(p.total_amount)}</td>`;
        html += `<td style="padding: 12px; color: var(--accent2);">${fmt(p.paid_amount)}</td>`;
        html += `<td style="padding: 12px; color: ${p.remaining_amount > 0 ? 'var(--danger)' : 'var(--accent2)'};">${fmt(p.remaining_amount)}</td>`;
        html += `<td style="padding: 12px;">${p.purchase_date}</td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';

    if (filtered.length === 0) {
        html += '<div style="text-align: center; padding: 40px; color: var(--muted);">لا توجد فواتير مشتريات</div>';
    }

    document.getElementById('mobile-purchases-table').innerHTML = html;
}

// تبويب الدفعات المتبقية
function loadMobilePaymentsTab() {
    const content = document.getElementById('mobile-tab-content');

    const html = `
    <div class="sb-bar" style="margin: 15px 0;">
        <input class="si" id="mobile-pay-search" placeholder="🔍 بحث..." oninput="refreshMobilePayments()">
        <div style="display: flex; gap: 10px; align-items: center;">
            <label>📅 من:</label>
            <input type="date" id="mobile-pay-date-from" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">
            <label>إلى:</label>
            <input type="date" id="mobile-pay-date-to" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">
            <button class="btn btn-sm" onclick="refreshMobilePayments()">🔍</button>
            <button class="btn btn-success btn-sm" onclick="payMobileRemaining()">💸 تسديد دفعة</button>
            <button class="btn btn-danger btn-sm" onclick="deleteMobilePurchaseFromPayments()">🗑️ حذف الفاتورة</button>
            <button class="btn btn-danger btn-sm" onclick="clearMobilePayments()">🧨 حذف الجميع</button>
        </div>
    </div>

    <div class="tw" style="margin: 15px;">
        <div class="th">
            <h3>💸 الدفعات المتبقية</h3>
        </div>
        <div id="mobile-payments-table"></div>
    </div>`;

    content.innerHTML = html;

    // تعيين التاريخ الافتراضي
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('mobile-pay-date-from').value = today;
    document.getElementById('mobile-pay-date-to').value = today;

    // تحميل البيانات
    refreshMobilePayments();
}

// دالة تحديث الدفعات المتبقية
function refreshMobilePayments() {
    const searchTerm = document.getElementById('mobile-pay-search').value.trim().toLowerCase();
    const dateFrom = document.getElementById('mobile-pay-date-from').value;
    const dateTo = document.getElementById('mobile-pay-date-to').value;

    // تصفية المشتريات التي تحتوي على موبايلات ولها مبالغ متبقية
    let filtered = DB.purchases.filter(p => {
        const hasMobiles = p.items?.some(item => {
            const product = DB.products.find(prod => prod.id === item.product_id);
            return product?.category === 'موبايلات';
        });

        if (!hasMobiles || p.remaining_amount <= 0) return false;

        const matchesSearch = !searchTerm || 
            p.invoice_number.toLowerCase().includes(searchTerm) ||
            p.supplier_name?.toLowerCase().includes(searchTerm);

        const matchesDate = (!dateFrom || p.purchase_date >= dateFrom) && 
                           (!dateTo || p.purchase_date <= dateTo);

        return matchesSearch && matchesDate;
    });

    // ترتيب حسب التاريخ (الأحدث أولاً)
    filtered.sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date));

    let html = '<table style="width: 100%; border-collapse: collapse;">';
    html += '<thead><tr style="background: var(--bg3);">';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">رقم الفاتورة</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">المورد</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الإجمالي</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">المدفوع</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">المتبقي</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">التاريخ</th>';
    html += '</tr></thead><tbody>';

    filtered.forEach(p => {
        html += `<tr class="payment-row" data-id="${p.id}" style="cursor: pointer; border-bottom: 1px solid var(--border); transition: background 0.2s;" onclick="selectPaymentRow(this)">`;
        html += `<td style="padding: 12px;">${p.invoice_number}</td>`;
        html += `<td style="padding: 12px;">${p.supplier_name}</td>`;
        html += `<td style="padding: 12px;">${fmt(p.total_amount)}</td>`;
        html += `<td style="padding: 12px; color: var(--accent2);">${fmt(p.paid_amount)}</td>`;
        html += `<td style="padding: 12px; color: ${p.remaining_amount > 0 ? 'var(--danger)' : 'var(--accent2)'};">${fmt(p.remaining_amount)}</td>`;
        html += `<td style="padding: 12px;">${p.purchase_date}</td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';

    if (filtered.length === 0) {
        html += '<div style="text-align: center; padding: 40px; color: var(--muted);">لا توجد دفعات متبقية</div>';
    }

    document.getElementById('mobile-payments-table').innerHTML = html;
}

// تبويب ديون العملاء
function loadMobileDebtsTab() {
    const content = document.getElementById('mobile-tab-content');

    const html = `
    <div class="sb-bar" style="margin: 15px 0;">
        <input class="si" id="mobile-debt-search" placeholder="🔍 بحث..." oninput="refreshMobileDebts()">
        <div style="display: flex; gap: 10px; align-items: center;">
            <button class="btn btn-sm" onclick="refreshMobileDebts()">🔄 تحديث</button>
            <button class="btn btn-success btn-sm" onclick="payMobileDebt()">💸 تسديد دين</button>
            <button class="btn btn-warn btn-sm" onclick="addMobileDebt()">➕ إضافة دين</button>
            <button class="btn btn-danger btn-sm" onclick="clearMobileDebts()">🧨 حذف الجميع</button>
        </div>
    </div>

    <div class="tw" style="margin: 15px;">
        <div class="th">
            <h3>📝 ديون العملاء</h3>
        </div>
        <div id="mobile-debts-table"></div>
    </div>`;

    content.innerHTML = html;

    // تحميل البيانات
    refreshMobileDebts();
}

// دالة تحديث ديون العملاء
function refreshMobileDebts() {
    const searchTerm = document.getElementById('mobile-debt-search').value.trim().toLowerCase();

    // تصفية المبيعات التي تحتوي على موبايلات ولها مبالغ متبقية
    let filtered = DB.sales.filter(s => {
        const hasMobiles = s.items?.some(item => {
            const product = DB.products.find(prod => prod.id === item.product_id);
            return product?.category === 'موبايلات';
        });

        if (!hasMobiles || s.remaining_amount <= 0) return false;

        const matchesSearch = !searchTerm || 
            s.invoice_number.toLowerCase().includes(searchTerm) ||
            s.customer_name?.toLowerCase().includes(searchTerm);

        return matchesSearch;
    });

    // ترتيب حسب التاريخ (الأحدث أولاً)
    filtered.sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));

    let html = '<table style="width: 100%; border-collapse: collapse;">';
    html += '<thead><tr style="background: var(--bg3);">';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">رقم الفاتورة</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">العميل</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الإجمالي</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">المدفوع</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">المتبقي</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">التاريخ</th>';
    html += '</tr></thead><tbody>';

    filtered.forEach(s => {
        html += `<tr class="debt-row" data-id="${s.id}" style="cursor: pointer; border-bottom: 1px solid var(--border); transition: background 0.2s;" onclick="selectDebtRow(this)">`;
        html += `<td style="padding: 12px;">${s.invoice_number}</td>`;
        html += `<td style="padding: 12px;">${s.customer_name}</td>`;
        html += `<td style="padding: 12px;">${fmt(s.total_amount)}</td>`;
        html += `<td style="padding: 12px; color: var(--accent2);">${fmt(s.paid_amount)}</td>`;
        html += `<td style="padding: 12px; color: ${s.remaining_amount > 0 ? 'var(--danger)' : 'var(--accent2)'};">${fmt(s.remaining_amount)}</td>`;
        html += `<td style="padding: 12px;">${s.sale_date}</td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';

    if (filtered.length === 0) {
        html += '<div style="text-align: center; padding: 40px; color: var(--muted);">لا توجد ديون للعملاء</div>';
    }

    document.getElementById('mobile-debts-table').innerHTML = html;
}

// تبويب صندوق الموبايلات
function loadMobileCashTab() {
    const content = document.getElementById('mobile-tab-content');

    const html = `
    <div class="sb-bar" style="margin: 15px 0;">
        <input class="si" id="mobile-cash-search" placeholder="🔍 بحث..." oninput="refreshMobileCash()">
        <div style="display: flex; gap: 10px; align-items: center;">
            <label>📅 من:</label>
            <input type="date" id="mobile-cash-date-from" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">
            <label>إلى:</label>
            <input type="date" id="mobile-cash-date-to" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">
            <button class="btn btn-sm" onclick="refreshMobileCash()">🔍 فلترة</button>
            <button class="btn btn-ghost btn-sm" onclick="refreshMobileCash()">🔄 تحديث</button>
            <button class="btn btn-ghost btn-sm" onclick="resetMobileCashFilters()">↺ إعادة تعيين</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCashTransaction()">🗑️ حذف معاملة</button>
            <button class="btn btn-danger btn-sm" onclick="clearMobileCash()">🧨 حذف الجميع</button>
        </div>
    </div>

    <!-- ملخص الصندوق -->
    <div id="mobile-cash-summary" style="margin: 15px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;"></div>

    <div class="tw" style="margin: 15px;">
        <div class="th">
            <h3>💰 حركة صندوق الموبايلات</h3>
        </div>
        <div id="mobile-cash-table"></div>
    </div>`;

    content.innerHTML = html;

    // تعيين التاريخ الافتراضي
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('mobile-cash-date-from').value = today;
    document.getElementById('mobile-cash-date-to').value = today;

    // تحميل البيانات
    refreshMobileCash();
}

// دالة تحديث صندوق الموبايلات
function refreshMobileCash() {
    const searchTerm = document.getElementById('mobile-cash-search').value.trim().toLowerCase();
    const dateFrom = document.getElementById('mobile-cash-date-from').value;
    const dateTo = document.getElementById('mobile-cash-date-to').value;

    // جمع جميع العمليات المرتبطة بالموبايلات
    let transactions = [];

    // 1. مبيعات الموبايلات (دخل)
    DB.sales.forEach(s => {
        const hasMobiles = s.items?.some(item => {
            const product = DB.products.find(prod => prod.id === item.product_id);
            return product?.category === 'موبايلات';
        });

        if (hasMobiles && s.status !== 'cleared') {
            transactions.push({
                type: 'مبيعات',
                invoice: s.invoice_number,
                party: s.customer_name,
                amount: s.paid_amount,
                date: s.sale_date,
                user: s.username || 'النظام',
                tag: 'income'
            });
        }
    });

    // 2. فواتير المشتريات (خرج)
    DB.purchases.forEach(p => {
        const hasMobiles = p.items?.some(item => {
            const product = DB.products.find(prod => prod.id === item.product_id);
            return product?.category === 'موبايلات';
        });

        if (hasMobiles) {
            transactions.push({
                type: 'فاتورة شراء',
                invoice: p.invoice_number,
                party: p.supplier_name,
                amount: p.paid_amount,
                date: p.purchase_date,
                user: 'النظام',
                tag: 'expense'
            });
        }
    });

    // 3. تسديدات الديون (دخل)
    DB.payments.forEach(py => {
        if (py.type === 'sale_debt_payment') {
            const sale = DB.sales.find(s => s.id === py.reference_id);
            const hasMobiles = sale?.items?.some(item => {
                const product = DB.products.find(prod => prod.id === item.product_id);
                return product?.category === 'موبايلات';
            });

            if (hasMobiles) {
                transactions.push({
                    type: 'تسديد دين',
                    invoice: sale?.invoice_number,
                    party: sale?.customer_name,
                    amount: py.amount,
                    date: py.payment_date,
                    user: py.username || 'النظام',
                    tag: 'income'
                });
            }
        }
    });

    // تصفية العمليات
    let filtered = transactions.filter(t => {
        const matchesSearch = !searchTerm || 
            t.invoice.toLowerCase().includes(searchTerm) ||
            t.party.toLowerCase().includes(searchTerm) ||
            t.user.toLowerCase().includes(searchTerm);

        const matchesDate = (!dateFrom || t.date >= dateFrom) && 
                           (!dateTo || t.date <= dateTo);

        return matchesSearch && matchesDate;
    });

    // ترتيب حسب التاريخ (الأحدث أولاً)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // حساب الإجماليات
    let totalIncome = 0;
    let totalExpense = 0;

    filtered.forEach(t => {
        if (t.tag === 'income') {
            totalIncome += t.amount;
        } else {
            totalExpense += t.amount;
        }
    });

    // حساب صافي الربح
    let netProfit = totalIncome - totalExpense;

    // حساب إجمالي ديون العملاء
    let totalCustomerDebts = DB.sales
        .filter(s => {
            const hasMobiles = s.items?.some(item => {
                const product = DB.products.find(prod => prod.id === item.product_id);
                return product?.category === 'موبايلات';
            });
            return hasMobiles && s.remaining_amount > 0;
        })
        .reduce((sum, s) => sum + s.remaining_amount, 0);

    // عرض الملخص
    const summaryHtml = `
    <div style="background: var(--accent2); border-radius: 9px; padding: 14px; border-right: 4px solid var(--accent2);">
        <div style="font-size: 11px; color: var(--muted);">إجمالي المقبوضات</div>
        <div style="font-size: 20px; font-weight: 900; color: var(--bg);">${fmt(totalIncome)}</div>
    </div>
    <div style="background: var(--danger); border-radius: 9px; padding: 14px; border-right: 4px solid var(--danger);">
        <div style="font-size: 11px; color: var(--muted);">إجمالي المدفوعات</div>
        <div style="font-size: 20px; font-weight: 900; color: var(--bg);">${fmt(totalExpense)}</div>
    </div>
    <div style="background: ${netProfit >= 0 ? '#3498db' : '#c0392b'}; border-radius: 9px; padding: 14px; border-right: 4px solid ${netProfit >= 0 ? '#3498db' : '#c0392b'};">
        <div style="font-size: 11px; color: var(--muted);">صافي الربح</div>
        <div style="font-size: 20px; font-weight: 900; color: var(--bg);">${fmt(netProfit)}</div>
    </div>
    <div style="background: var(--warn); border-radius: 9px; padding: 14px; border-right: 4px solid var(--warn);">
        <div style="font-size: 11px; color: var(--muted);">ديون العملاء</div>
        <div style="font-size: 20px; font-weight: 900; color: var(--bg);">${fmt(totalCustomerDebts)}</div>
    </div>`;

    document.getElementById('mobile-cash-summary').innerHTML = summaryHtml;

    // عرض الجدول
    let html = '<table style="width: 100%; border-collapse: collapse;">';
    html += '<thead><tr style="background: var(--bg3);">';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">نوع العملية</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">رقم الفاتورة</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الطرف الآخر</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">المبلغ</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">التاريخ</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">المستخدم</th>';
    html += '</tr></thead><tbody>';

    filtered.forEach(t => {
        html += `<tr style="border-bottom: 1px solid var(--border);">`;
        html += `<td style="padding: 12px; color: ${t.tag === 'income' ? 'var(--accent2)' : 'var(--danger)'};">${t.type}</td>`;
        html += `<td style="padding: 12px;">${t.invoice}</td>`;
        html += `<td style="padding: 12px;">${t.party}</td>`;
        html += `<td style="padding: 12px;">${fmt(t.amount)}</td>`;
        html += `<td style="padding: 12px;">${t.date}</td>`;
        html += `<td style="padding: 12px;">${t.user}</td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';

    if (filtered.length === 0) {
        html += '<div style="text-align: center; padding: 40px; color: var(--muted);">لا توجد عمليات</div>';
    }

    document.getElementById('mobile-cash-table').innerHTML = html;
}

// دوال مساعدة للتبويبات
function selectMobileRow(row) {
    document.querySelectorAll('.mobile-row.selected').forEach(r => {
        r.classList.remove('selected');
        r.style.background = '';
    });
    row.classList.add('selected');
    row.style.background = 'var(--bg3)';
}

function selectPurchaseRow(row) {
    document.querySelectorAll('.purchase-row.selected').forEach(r => {
        r.classList.remove('selected');
        r.style.background = '';
    });
    row.classList.add('selected');
    row.style.background = 'var(--bg3)';
}

function selectPaymentRow(row) {
    document.querySelectorAll('.payment-row.selected').forEach(r => {
        r.classList.remove('selected');
        r.style.background = '';
    });
    row.classList.add('selected');
    row.style.background = 'var(--bg3)';
}

function selectDebtRow(row) {
    document.querySelectorAll('.debt-row.selected').forEach(r => {
        r.classList.remove('selected');
        r.style.background = '';
    });
    row.classList.add('selected');
    row.style.background = 'var(--bg3)';
}

function resetMobileCashFilters() {
    document.getElementById('mobile-cash-search').value = '';
    document.getElementById('mobile-cash-date-from').value = new Date().toISOString().split('T')[0];
    document.getElementById('mobile-cash-date-to').value = new Date().toISOString().split('T')[0];
    refreshMobileCash();
}

// دوال الإضافة والتعديل والحذف (سيتم إضافتها لاحقاً)
function addMobileProduct() {
    omo('➕ إضافة موبايل جديد', `
    <div class="fg">
        <div class="ff full"><label>الاسم *</label><input id="mn" placeholder="iPhone 15 Pro"></div>
        <div class="ff"><label>الماركة</label><input id="mb" placeholder="Apple"></div>
        <div class="ff"><label>الموديل</label><input id="mm"></div>
        <div class="ff"><label>سعر الشراء *</label><input id="mcp" type="number" placeholder="0"></div>
        <div class="ff"><label>سعر البيع *</label><input id="msp" type="number" placeholder="0"></div>
        <div class="ff"><label>الكمية *</label><input id="mq" type="number" placeholder="1"></div>
        <div class="ff"><label>الباركود</label><input id="mbar"></div>
        <div class="ff"><label>الحالة</label><select id="mcond"><option>جديد</option><option>مستعمل</option></select></div>
    </div>`,
    `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="saveMobile()">💾 حفظ</button>`);
}

function editMobileProduct() {
    const selectedRow = document.querySelector('.mobile-row.selected');
    if (!selectedRow) {
        toast('⚠️ يرجى اختيار موبايل للتعديل', 'error');
        return;
    }

    const id = parseInt(selectedRow.dataset.id);
    const product = DB.products.find(p => p.id === id);

    if (!product) {
        toast('⚠️ لم يتم العثور على الموبايل', 'error');
        return;
    }

    omo('✏️ تعديل موبايل', `
    <div class="fg">
        <div class="ff full"><label>الاسم</label><input id="emn" value="${product.name}"></div>
        <div class="ff"><label>الماركة</label><input id="emb" value="${product.brand}"></div>
        <div class="ff"><label>الموديل</label><input id="emm" value="${product.model}"></div>
        <div class="ff"><label>سعر الشراء</label><input id="emcp" type="number" value="${product.cost_price}"></div>
        <div class="ff"><label>سعر البيع</label><input id="emsp" type="number" value="${product.selling_price}"></div>
        <div class="ff"><label>الكمية</label><input id="emq" type="number" value="${product.quantity}"></div>
        <div class="ff"><label>الحالة</label><select id="emcond"><option ${product.condition==='جديد'?'selected':''}>جديد</option><option ${product.condition==='مستعمل'?'selected':''}>مستعمل</option></select></div>
    </div>`,
    `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="updateMobile(${id})">💾 حفظ</button>`);
}

function saveMobile() {
    const data = {
        name: document.getElementById('mn').value,
        brand: document.getElementById('mb').value,
        model: document.getElementById('mm').value,
        cost_price: parseFloat(document.getElementById('mcp').value) || 0,
        selling_price: parseFloat(document.getElementById('msp').value) || 0,
        quantity: parseInt(document.getElementById('mq').value) || 1,
        barcode: document.getElementById('mbar').value,
        condition: document.getElementById('mcond').value,
        category: 'موبايلات',
        created_date: new Date().toISOString().split('T')[0]
    };

    if (!data.name || !data.brand) {
        toast('⚠️ الاسم والماركة مطلوبان', 'error');
        return;
    }

    DB.saveProduct(data);
    toast('✅ تم إضافة الموبايل بنجاح');
    cmo();
    refreshMobileInventory();
}

function updateMobile(id) {
    const data = {
        name: document.getElementById('emn').value,
        brand: document.getElementById('emb').value,
        model: document.getElementById('emm').value,
        cost_price: parseFloat(document.getElementById('emcp').value) || 0,
        selling_price: parseFloat(document.getElementById('emsp').value) || 0,
        quantity: parseInt(document.getElementById('emq').value) || 1,
        condition: document.getElementById('emcond').value
    };

    DB.saveProduct({...data, id: id});
    toast('✅ تم تحديث الموبايل بنجاح');
    cmo();
    refreshMobileInventory();
}

function deleteMobileProduct() {
    toast('⚠️ هذه الميزة قيد التطوير', 'info');
}

function directSaleMobile() {
    const selectedRow = document.querySelector('.mobile-row.selected');
    if (!selectedRow) {
        toast('⚠️ يرجى اختيار موبايل للبيع', 'error');
        return;
    }

    const id = parseInt(selectedRow.dataset.id);
    const product = DB.products.find(p => p.id === id);

    if (!product) {
        toast('⚠️ لم يتم العثور على الموبايل', 'error');
        return;
    }

    if (product.quantity <= 0) {
        toast('⚠️ الكمية غير متوفرة', 'error');
        return;
    }

    omo('💰 بيع مباشر: ' + product.name, `
    <div class="fg">
        <div class="ff full"><label>سعر البيع *</label><input id="dsp" type="number" value="${product.selling_price}"></div>
        <div class="ff full"><label>المبلغ المدفوع *</label><input id="dsa" type="number" value="${product.selling_price}"></div>
        <div class="ff full"><label>اسم العميل (للدين)</label><input id="dscn" placeholder="اختياري"></div>
    </div>`,
    `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="processDirectSale(${id})">✅ بيع</button>`);
}

function clearMobileInventory() {
    if (!confirm('⚠️ تأكيد الحذف\n\nهل أنت متأكد من حذف جميع الموبايلات؟\n\n⚠️ هذه العملية لا يمكن التراجع عنها!')) {
        return;
    }

    DB.products = DB.products.filter(p => p.category !== 'موبايلات');
    DB.saveProducts();
    toast('✅ تم حذف جميع الموبايلات بنجاح');
    refreshMobileInventory();
}

function processDirectSale(id) {
    const price = parseFloat(document.getElementById('dsp').value) || 0;
    const paid = parseFloat(document.getElementById('dsa').value) || 0;
    const customerName = document.getElementById('dscn').value || 'عميل نقدي';

    if (price <= 0) {
        toast('⚠️ السعر يجب أن يكون أكبر من صفر', 'error');
        return;
    }

    const product = DB.products.find(p => p.id === id);
    if (!product) {
        toast('⚠️ لم يتم العثور على الموبايل', 'error');
        return;
    }

    // إنشاء عملية بيع
    const sale = {
        id: Date.now(),
        items: [{
            product_id: id,
            quantity: 1,
            unit_price: price,
            total_price: price,
            cost_price: product.cost_price,
            profit: price - product.cost_price,
            product_name: product.name
        }],
        total_amount: price,
        paid_amount: paid,
        remaining: price - paid,
        invoice_number: DB.generateInvoiceNumber(),
        sale_date: new Date().toISOString().split('T')[0],
        sale_time: new Date().toLocaleTimeString('ar-SA'),
        customer_name: customerName,
        user_id: DB.currentUser?.id || 1
    };

    // خصم الكمية من المخزون
    product.quantity -= 1;
    DB.saveProduct(product);

    // حفظ البيع
    DB.sales.push(sale);
    DB.saveSales();

    toast('✅ تمت عملية البيع بنجاح');
    cmo();
    refreshMobileInventory();
}

function addMobilePurchase() {
    omo('➕ فاتورة مشتريات جديدة', `
    <div class="fg">
        <div class="ff full"><label>المورد</label>
        <select id="mp-sup">
            <option value="">— بدون مورد —</option>
            ${DB.suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
        </select></div>
        <div class="ff full"><label>رقم الفاتورة</label>
        <input id="mp-inv" value="سيتم إنشاؤه تلقائياً" readonly></div>
        <div class="ff"><label>الإجمالي</label>
        <input id="mp-total" type="number" placeholder="0"></div>
        <div class="ff"><label>المدفوع</label>
        <input id="mp-paid" type="number" placeholder="0" oninput="updatePurchaseTotals()"></div>
        <div id="mp-items" style="grid-column:1/-1;border:1px solid var(--border);border-radius:8px;padding:10px;margin-top:10px">
            <div style="text-align:center;color:var(--muted);padding:20px">لم تُضف أي منتجات بعد</div>
        </div>
        <button class="btn btn-ghost btn-sm" style="grid-column:1/-1" onclick="addPurchaseItem()">+ إضافة صنف</button>
    </div>`,
    `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="savePurchase()">💾 حفظ الفاتورة</button>`);
    updatePurchaseTotals();
}

function editMobilePurchase() {
    const selectedRow = document.querySelector('.purchase-row.selected');
    if (!selectedRow) {
        toast('⚠️ يرجى اختيار فاتورة للتعديل', 'error');
        return;
    }

    const id = parseInt(selectedRow.dataset.id);
    const purchase = DB.purchases.find(p => p.id === id);

    if (!purchase) {
        toast('⚠️ لم يتم العثور على الفاتورة', 'error');
        return;
    }

    omo('✏️ تعديل فاتورة المشتريات', `
    <div class="fg">
        <div class="ff full"><label>المورد</label>
        <select id="ep-sup">
            <option value="">— بدون مورد —</option>
            ${DB.suppliers.map(s => `<option value="${s.id}" ${s.id === purchase.supplier_id ? 'selected' : ''}>${s.name}</option>`).join('')}
        </select></div>
        <div class="ff"><label>الإجمالي</label>
        <input id="ep-total" type="number" value="${purchase.total_amount}"></div>
        <div class="ff"><label>المدفوع</label>
        <input id="ep-paid" type="number" value="${purchase.paid_amount}" oninput="updateEditPurchaseTotals()"></div>
        <div id="ep-items" style="grid-column:1/-1;border:1px solid var(--border);border-radius:8px;padding:10px;margin-top:10px">
            ${purchase.items.map((item, idx) => `
                <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:5px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border)">
                    <input class="ep-prod" type="text" value="${item.product_name}" readonly style="grid-column:1">
                    <input class="ep-qty" type="number" value="${item.quantity}" style="grid-column:2">
                    <input class="ep-price" type="number" value="${item.unit_price}" style="grid-column:3">
                    <button class="btn btn-danger btn-sm" onclick="removePurchaseItem(${idx})" style="grid-column:5">🗑️</button>
                </div>
            `).join('')}
        </div>
        <button class="btn btn-ghost btn-sm" style="grid-column:1/-1" onclick="addEditPurchaseItem()">+ إضافة صنف</button>
    </div>`,
    `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="updatePurchase(${id})">💾 حفظ التعديلات</button>`);
    updateEditPurchaseTotals();
}

function deleteMobilePurchase() {
    const selectedRow = document.querySelector('.purchase-row.selected');
    if (!selectedRow) {
        toast('⚠️ يرجى اختيار فاتورة للحذف', 'error');
        return;
    }

    const id = parseInt(selectedRow.dataset.id);
    const purchase = DB.purchases.find(p => p.id === id);

    if (!purchase) {
        toast('⚠️ لم يتم العثور على الفاتورة', 'error');
        return;
    }

    if (!confirm(`⚠️ تأكيد الحذف\n\nهل أنت متأكد من حذف هذه الفاتورة؟\n\n⚠️ سيتم حذف الفاتورة كاملة وجميع المنتجات المرتبطة بها!`)) {
        return;
    }

    // حذف المنتجات من المخزون
    if (purchase.items) {
        purchase.items.forEach(item => {
            const product = DB.products.find(p => p.id === item.product_id);
            if (product) {
                product.quantity -= item.quantity;
            }
        });
    }

    // حذف الفاتورة
    DB.purchases = DB.purchases.filter(p => p.id !== id);
    DB.savePurchases();
    DB.saveProducts();

    toast('✅ تم حذف الفاتورة بنجاح');
    refreshMobilePayments();
}

function clearMobilePurchases() {
    if (!confirm('⚠️ تأكيد حذف الجميع\n\nهل أنت متأكد من حذف جميع فواتير المشتريات؟\n\n⚠️ هذه العملية لا يمكن التراجع عنها!')) {
        return;
    }

    DB.purchases = DB.purchases.filter(p => p.source !== 'mobile');
    DB.savePurchases();
    toast('✅ تم حذف جميع فواتير المشتريات بنجاح');
    refreshMobilePurchases();
}

function savePurchase() {
    const supplierId = document.getElementById('mp-sup').value || null;
    const total = parseFloat(document.getElementById('mp-total').value) || 0;
    const paid = parseFloat(document.getElementById('mp-paid').value) || 0;
    const itemsContainer = document.getElementById('mp-items');

    // الحصول على المنتجات المضافة
    const itemRows = itemsContainer.querySelectorAll('.purchase-item-row');
    const items = Array.from(itemRows).map(row => {
        const productId = row.dataset.productId;
        const product = DB.products.find(p => p.id === parseInt(productId));
        return {
            product_id: parseInt(productId),
            product_name: product ? product.name : 'غير معروف',
            quantity: parseInt(row.querySelector('.pi-qty').value) || 1,
            unit_price: parseFloat(row.querySelector('.pi-price').value) || 0,
            total_price: (parseInt(row.querySelector('.pi-qty').value) || 1) * (parseFloat(row.querySelector('.pi-price').value) || 0),
            cost_price: product ? product.cost_price : 0,
            sell_price: product ? product.selling_price : 0
        };
    });

    if (items.length === 0) {
        toast('⚠️ أضف منتجات أولاً', 'error');
        return;
    }

    const purchase = {
        id: Date.now(),
        invoice_number: 'PUR-' + Date.now().toString().slice(-6),
        supplier_id: supplierId,
        total_amount: total,
        paid_amount: paid,
        remaining_amount: total - paid,
        purchase_date: new Date().toISOString().split('T')[0],
        items: items,
        source: 'mobile'
    };

    // تحديث مخزون المنتجات
    items.forEach(item => {
        const product = DB.products.find(p => p.id === item.product_id);
        if (product) {
            product.quantity += item.quantity;
            if (item.sell_price > 0) {
                product.selling_price = item.sell_price;
            }
            if (item.cost_price > 0) {
                product.cost_price = item.cost_price;
            }
        }
    });

    DB.purchases.push(purchase);
    DB.savePurchases();
    DB.saveProducts();

    toast('✅ تم حفظ الفاتورة بنجاح');
    cmo();
    refreshMobilePurchases();
}

function addPurchaseItem() {
    const container = document.getElementById('mp-items');
    const productSelect = document.createElement('div');
    productSelect.className = 'purchase-item-row';
    productSelect.style.cssText = 'display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:5px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border)';
    productSelect.innerHTML = `
        <select class="pi-prod" style="grid-column:1" onchange="onPurchaseProductChange(this)">
            <option value="">اختر منتج...</option>
            ${DB.products.filter(p => p.category === 'موبايلات').map(p => `<option value="${p.id}" data-name="${p.name}" data-cost="${p.cost_price}" data-sell="${p.selling_price}">${p.name} | ${p.brand}</option>`).join('')}
        </select>
        <input class="pi-qty" type="number" value="1" min="1" style="grid-column:2" placeholder="الكمية">
        <input class="pi-price" type="number" value="0" min="0" step="0.01" style="grid-column:3" placeholder="سعر الشراء">
        <button class="btn btn-danger btn-sm" onclick="this.parentElement.remove()" style="grid-column:5">🗑️</button>
    `;
    container.appendChild(productSelect);
    updatePurchaseTotals();
}

function onPurchaseProductChange(select) {
    const productId = select.value;
    if (!productId) return;

    const product = DB.products.find(p => p.id === parseInt(productId));
    if (!product) return;

    const row = select.closest('.purchase-item-row');
    const priceInput = row.querySelector('.pi-price');
    priceInput.value = product.cost_price;
    updatePurchaseTotals();
}

function payMobileRemaining() {
    const selectedRow = document.querySelector('.mobile-payment-row.selected');
    if (!selectedRow) {
        toast('⚠️ يرجى اختيار فاتورة للتسديد', 'error');
        return;
    }

    const id = parseInt(selectedRow.dataset.id);
    const purchase = DB.purchases.find(p => p.id === id);

    if (!purchase) {
        toast('⚠️ لم يتم العثور على الفاتورة', 'error');
        return;
    }

    const remaining = purchase.remaining;

    const amount = prompt(`المبلغ المتبقي: ${remaining}\n\nأدخل المبلغ المراد دفعه:`, remaining);

    if (amount === null) return;

    const payAmount = parseFloat(amount);

    if (isNaN(payAmount) || payAmount <= 0) {
        toast('⚠️ المبلغ غير صحيح', 'error');
        return;
    }

    if (payAmount > remaining) {
        toast('⚠️ المبلغ المدخل أكبر من الدين المتبقي', 'error');
        return;
    }

    // تحديث الفاتورة
    purchase.paid += payAmount;
    purchase.remaining -= payAmount;

    // إضافة سجل دفعة
    const payment = {
        id: Date.now(),
        type: 'purchase',
        reference_id: id,
        amount: payAmount,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'نقدي',
        user_id: DB.currentUser?.id || 1
    };

    DB.payments.push(payment);
    DB.savePayments();
    DB.savePurchases();

    toast('✅ تمت عملية التسديد بنجاح');
    refreshMobilePayments();
}

function deleteMobilePurchaseFromPayments() {
    const selectedRow = document.querySelector('.mobile-payment-row.selected');
    if (!selectedRow) {
        toast('⚠️ يرجى اختيار فاتورة للحذف', 'error');
        return;
    }

    if (!confirm('⚠️ تأكيد الحذف\n\nهل أنت متأكد من حذف هذه الفاتورة؟\n\n⚠️ سيتم حذف الفاتورة كاملة وجميع المنتجات المرتبطة بها!')) {
        return;
    }

    const id = parseInt(selectedRow.dataset.id);
    const purchase = DB.purchases.find(p => p.id === id);

    if (!purchase) {
        toast('⚠️ لم يتم العثور على الفاتورة', 'error');
        return;
    }

    // حذف المنتجات من المخزون
    if (purchase.items) {
        purchase.items.forEach(item => {
            const product = DB.products.find(p => p.id === item.product_id);
            if (product) {
                product.quantity -= item.quantity;
            }
        });
    }

    // حذف الفاتورة
    DB.purchases = DB.purchases.filter(p => p.id !== id);
    DB.savePurchases();
    DB.saveProducts();

    toast('✅ تم حذف الفاتورة بنجاح');
    refreshMobilePayments();
}

function clearMobilePayments() {
    if (!confirm('⚠️ تأكيد حذف الجميع\n\nهل أنت متأكد من حذف جميع الدفعات؟\n\n⚠️ هذه العملية لا يمكن التراجع عنها!')) {
        return;
    }

    DB.payments = DB.payments.filter(p => p.type !== 'purchase');
    DB.savePayments();
    toast('✅ تم حذف جميع الدفعات بنجاح');
    refreshMobilePayments();
}

function payMobileDebt() {
    const selectedRow = document.querySelector('.mobile-debt-row.selected');
    if (!selectedRow) {
        toast('⚠️ يرجى اختيار دين للتسديد', 'error');
        return;
    }

    const id = parseInt(selectedRow.dataset.id);
    const sale = DB.sales.find(s => s.id === id);

    if (!sale) {
        toast('⚠️ لم يتم العثور على الدين', 'error');
        return;
    }

    const remaining = sale.remaining;

    const amount = prompt(`المبلغ المتبقي على العميل: ${remaining}\n\nأدخل المبلغ المستلم:`, remaining);

    if (amount === null) return;

    const payAmount = parseFloat(amount);

    if (isNaN(payAmount) || payAmount <= 0 || payAmount > remaining) {
        toast('⚠️ المبلغ غير صحيح', 'error');
        return;
    }

    // تحديث الفاتورة
    sale.paid += payAmount;
    sale.remaining -= payAmount;

    // إضافة حركة للصندوق كقبض دين
    const payment = {
        id: Date.now(),
        type: 'sale_debt_payment',
        reference_id: id,
        amount: payAmount,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'نقدي',
        user_id: DB.currentUser?.id || 1
    };

    DB.payments.push(payment);
    DB.savePayments();
    DB.saveSales();

    toast('✅ تم تسديد الدين بنجاح');
    refreshMobileDebts();
}

function addMobileDebt() {
    const customerName = prompt('أدخل اسم العميل:');
    if (!customerName) return;

    const amount = prompt('أدخل المبلغ:');
    if (!amount) return;

    const debtAmount = parseFloat(amount);

    if (isNaN(debtAmount) || debtAmount <= 0) {
        toast('⚠️ المبلغ غير صحيح', 'error');
        return;
    }

    const invoiceNum = `DEBT-${Date.now()}`;

    const debt = {
        id: Date.now(),
        invoice_number: invoiceNum,
        customer_name: customerName,
        total_amount: debtAmount,
        paid_amount: 0,
        remaining_amount: debtAmount,
        sale_date: new Date().toISOString().split('T')[0],
        sale_time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        status: 'active',
        source: 'mobile'
    };

    DB.sales.push(debt);
    DB.saveSales();

    toast('✅ تم إضافة الدين بنجاح');
    refreshMobileDebts();
}

function clearMobileDebts() {
    if (!confirm('⚠️ تأكيد حذف الجميع\n\nهل أنت متأكد من حذف جميع الديون؟\n\n⚠️ هذه العملية لا يمكن التراجع عنها!')) {
        return;
    }

    DB.sales = DB.sales.filter(s => s.source !== 'mobile');
    DB.saveSales();
    toast('✅ تم حذف جميع الديون بنجاح');
    refreshMobileDebts();
}

function deleteCashTransaction() {
    const selectedRow = document.querySelector('.mobile-cash-row.selected');
    if (!selectedRow) {
        toast('⚠️ يرجى اختيار معاملة للحذف', 'error');
        return;
    }

    const values = selectedRow.dataset;
    const transType = values.type;
    const invoiceNum = values.invoice;

    if (!confirm(`⚠️ تأكيد الحذف\n\nهل أنت متأكد من حذف المعاملة؟\n\nالنوع: ${transType}\nرقم الفاتورة: ${invoiceNum}\nالمبلغ: ${values.amount}\n\n⚠️ تحذير: سيتم حذف الفاتورة كاملة وجميع المنتجات المرتبطة بها!`)) {
        return;
    }

    if (transType === 'مبيعات' || transType === 'تسديد دين') {
        // حذف فاتورة مبيعات
        const sale = DB.sales.find(s => s.invoice_number === invoiceNum);
        if (sale) {
            // إرجاع الكميات إلى المخزون
            if (sale.items) {
                sale.items.forEach(item => {
                    const product = DB.products.find(p => p.id === item.product_id);
                    if (product) {
                        product.quantity += item.quantity;
                    }
                });
            }

            // حذف الفاتورة
            DB.sales = DB.sales.filter(s => s.id !== sale.id);
            DB.saveSales();
            DB.saveProducts();

            toast('✅ تم حذف فاتورة المبيعات بنجاح وإرجاع المنتجات للمخزون');
        }
    } else if (transType === 'فاتورة شراء') {
        // حذف فاتورة مشتريات
        const purchase = DB.purchases.find(p => p.invoice_number === invoiceNum);
        if (purchase) {
            // حذف المنتجات من المخزون
            if (purchase.items) {
                purchase.items.forEach(item => {
                    const product = DB.products.find(p => p.id === item.product_id);
                    if (product) {
                        DB.products = DB.products.filter(p => p.id !== item.product_id);
                    }
                });
            }

            // حذف الفاتورة
            DB.purchases = DB.purchases.filter(p => p.id !== purchase.id);
            DB.savePurchases();
            DB.saveProducts();

            toast('✅ تم حذف فاتورة المشتريات بنجاح وحذف المنتجات من المخزون');
        }
    }

    refreshMobileCash();
}

function clearMobileCash() {
    if (!confirm('⚠️ تأكيد حذف الجميع\n\nهل أنت متأكد من حذف جميع البيانات في الصندوق؟\n\n⚠️ هذه العملية لا يمكن التراجع عنها!')) {
        return;
    }

    // حذف المبيعات
    DB.sales = DB.sales.filter(s => s.source !== 'mobile');

    // حذف المشتريات
    DB.purchases = DB.purchases.filter(p => p.source !== 'mobile');

    // حذف الدفعات
    DB.payments = DB.payments.filter(p => 
        p.type !== 'purchase' && 
        p.type !== 'sale_debt_payment'
    );

    DB.saveSales();
    DB.savePurchases();
    DB.savePayments();

    toast('✅ تم حذف البيانات وتصفير الأرصدة بنجاح');
    refreshMobileCash();
}

function generateMobileReport() {
    const c = document.getElementById('pc');

    const html = `
    <div class="tw">
        <div class="th">
            <h3>📊 التقرير التفصيلي لإدارة الموبايلات</h3>
        </div>

        <!-- فلاتر التقرير -->
        <div class="sb-bar" style="margin: 15px;">
            <select id="report-period" onchange="updateMobileReport()">
                <option value="all">الكل</option>
                <option value="today">اليوم</option>
                <option value="thisMonth" selected>هذا الشهر</option>
                <option value="custom">مخصص</option>
            </select>

            <div id="custom-date-range" style="display: none; gap: 10px; align-items: center;">
                <label>من:</label>
                <input type="date" id="report-from-date" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">
                <label>إلى:</label>
                <input type="date" id="report-to-date" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">
            </div>

            <label>الماركة:</label>
            <input type="text" id="report-brand" placeholder="تصفية بالماركة" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">

            <button class="btn btn-sm" onclick="updateMobileReport()">تحديث التقرير</button>
            <button class="btn btn-ghost btn-sm" onclick="mobile()">عودة</button>
        </div>

        <!-- ملخص التقرير -->
        <div id="report-summary" style="margin: 15px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;"></div>

        <!-- جدول التقرير -->
        <div class="tw" style="margin: 15px;">
            <div class="th">
                <h3>📋 تفاصيل التقرير</h3>
            </div>
            <div id="report-table"></div>
        </div>
    </div>`;

    c.innerHTML = html;

    // إضافة مستمع لتغيير الفترة
    document.getElementById('report-period').addEventListener('change', function() {
        const customRange = document.getElementById('custom-date-range');
        customRange.style.display = this.value === 'custom' ? 'flex' : 'none';
    });

    // تحميل التقرير الافتراضي
    updateMobileReport();
}

function updateMobileReport() {
    const period = document.getElementById('report-period').value;
    const brandFilter = document.getElementById('report-brand').value.trim().toLowerCase();
    let fromDate, toDate;

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    switch (period) {
        case 'today':
            fromDate = today.toISOString().split('T')[0];
            toDate = fromDate;
            break;
        case 'thisMonth':
            fromDate = firstDayOfMonth.toISOString().split('T')[0];
            toDate = today.toISOString().split('T')[0];
            break;
        case 'custom':
            fromDate = document.getElementById('report-from-date').value;
            toDate = document.getElementById('report-to-date').value;
            break;
    }

    // تصفية المنتجات (فئة موبايلات فقط)
    let filtered = DB.products.filter(p => {
        if (p.category !== 'موبايلات') return false;
        if (p.is_deleted) return false;

        const matchesBrand = !brandFilter || p.brand.toLowerCase().includes(brandFilter);
        const matchesDate = (!fromDate || p.created_date >= fromDate) && 
                           (!toDate || p.created_date <= toDate);

        return matchesBrand && matchesDate;
    });

    // حساب الإحصائيات
    let totalQty = 0;
    let totalCost = 0;
    let totalExpectedProfit = 0;

    filtered.forEach(p => {
        const totalC = p.quantity * p.cost_price;
        const expProfit = p.quantity * (p.selling_price - p.cost_price);
        const status = p.quantity > p.min_stock ? '✅ متوفر' : 
                      p.quantity > 0 ? '⚠️ منخفض' : '❌ منتهي';

        totalQty += p.quantity;
        totalCost += totalC;
        totalExpectedProfit += expProfit;
    });

    // جلب المبيعات الفعلية للموبايلات
    const mobileSales = DB.sales.filter(s => s.source === 'mobile' && s.status === 'active');
    const actualSalesProfit = mobileSales.reduce((sum, s) => {
        if (s.items) {
            return sum + s.items.reduce((itemSum, item) => {
                const product = DB.products.find(p => p.id === item.product_id);
                if (product && product.category === 'موبايلات') {
                    return itemSum + (item.unit_price - item.cost_price) * item.quantity;
                }
                return itemSum;
            }, 0);
        }
        return sum;
    }, 0);

    // عرض الملخص
    const summaryHtml = `
    <div style="background: var(--bg3); border-radius: 9px; padding: 14px; border-right: 4px solid var(--accent);">
        <div style="font-size: 11px; color: var(--muted);">إجمالي الكمية</div>
        <div style="font-size: 20px; font-weight: 900; color: var(--accent);">${totalQty}</div>
    </div>
    <div style="background: var(--bg3); border-radius: 9px; padding: 14px; border-right: 4px solid var(--warn);">
        <div style="font-size: 11px; color: var(--muted);">قيمة المخزون (شراء)</div>
        <div style="font-size: 20px; font-weight: 900; color: var(--warn);">${fmt(totalCost)}</div>
    </div>
    <div style="background: var(--bg3); border-radius: 9px; padding: 14px; border-right: 4px solid var(--accent2);">
        <div style="font-size: 11px; color: var(--muted);">المبيعات المحققة</div>
        <div style="font-size: 20px; font-weight: 900; color: var(--accent2);">${fmt(actualSalesProfit)}</div>
    </div>
    <div style="background: var(--bg3); border-radius: 9px; padding: 14px; border-right: 4px solid #a855f7;">
        <div style="font-size: 11px; color: var(--muted);">الأرباح المتوقعة</div>
        <div style="font-size: 20px; font-weight: 900; color: #a855f7;">${fmt(totalExpectedProfit)}</div>
    </div>`;

    document.getElementById('report-summary').innerHTML = summaryHtml;

    // عرض الجدول
    let tableHtml = '<table style="width: 100%; border-collapse: collapse;">';
    tableHtml += '<thead><tr style="background: var(--bg3);">';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">اسم الجهاز</th>';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الماركة</th>';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الكمية</th>';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">سعر الشراء</th>';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">سعر البيع</th>';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">إجمالي التكلفة</th>';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">ربح متوقع</th>';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الحالة</th>';
    tableHtml += '</tr></thead><tbody>';

    filtered.forEach(p => {
        const totalC = p.quantity * p.cost_price;
        const expProfit = p.quantity * (p.selling_price - p.cost_price);
        const status = p.quantity > p.min_stock ? '✅ متوفر' : 
                      p.quantity > 0 ? '⚠️ منخفض' : '❌ منتهي';

        tableHtml += '<tr style="border-bottom: 1px solid var(--border);">';
        tableHtml += `<td style="padding: 12px;">${p.name}</td>`;
        tableHtml += `<td style="padding: 12px;">${p.brand}</td>`;
        tableHtml += `<td style="padding: 12px;">${p.quantity}</td>`;
        tableHtml += `<td style="padding: 12px;">${fmt(p.cost_price)}</td>`;
        tableHtml += `<td style="padding: 12px;">${fmt(p.selling_price)}</td>`;
        tableHtml += `<td style="padding: 12px;">${fmt(totalC)}</td>`;
        tableHtml += `<td style="padding: 12px;">${fmt(expProfit)}</td>`;
        tableHtml += `<td style="padding: 12px;">${status}</td>`;
        tableHtml += '</tr>';
    });

    tableHtml += '</tbody></table>';

    if (filtered.length === 0) {
        tableHtml += '<div style="text-align: center; padding: 40px; color: var(--muted);">لا توجد بيانات للفترة المحددة</div>';
    }

    document.getElementById('report-table').innerHTML = tableHtml;
}

// دالة إضافة طلب صيانة
function addMaintenance() {
    const customerName = document.getElementById('maint_customer_name').value.trim();
    const phone = document.getElementById('maint_phone').value.trim();

    if (!customerName || !phone) {
        toast('⚠️ يرجى إدخال اسم العميل ورقم الهاتف', 'error');
        return;
    }

    const newMaintenance = {
        id: Date.now(),
        customer_name: customerName,
        phone: phone,
        device_model: document.getElementById('maint_device_model').value.trim(),
        problem: document.getElementById('maint_problem').value.trim(),
        cost: parseFloat(document.getElementById('maint_cost').value) || 0,
        selling_price: parseFloat(document.getElementById('maint_selling_price').value) || 0,
        source: document.getElementById('maint_source').value.trim(),
        profit_percent: parseFloat(document.getElementById('maint_profit_percent').value) || 100,
        status: document.getElementById('maint_status').value,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    const maintenance = DB.getMaintenance();
    maintenance.push(newMaintenance);
    DB.saveMaintenance(maintenance);

    toast('✅ تم إضافة طلب الصيانة بنجاح');
    clearMaintenanceFields();
    refreshMaintenanceTable();
}

// دالة تعديل طلب صيانة
function updateMaintenance() {
    const selectedRow = document.querySelector('.maintenance-row.selected');
    if (!selectedRow) {
        toast('⚠️ يرجى اختيار طلب للتعديل', 'error');
        return;
    }

    const id = parseInt(selectedRow.dataset.id);
    const maintenance = DB.getMaintenance();
    const index = maintenance.findIndex(m => m.id === id);

    if (index === -1) {
        toast('⚠️ لم يتم العثور على الطلب', 'error');
        return;
    }

    maintenance[index] = {
        ...maintenance[index],
        customer_name: document.getElementById('maint_customer_name').value.trim(),
        phone: document.getElementById('maint_phone').value.trim(),
        device_model: document.getElementById('maint_device_model').value.trim(),
        problem: document.getElementById('maint_problem').value.trim(),
        cost: parseFloat(document.getElementById('maint_cost').value) || 0,
        selling_price: parseFloat(document.getElementById('maint_selling_price').value) || 0,
        source: document.getElementById('maint_source').value.trim(),
        profit_percent: parseFloat(document.getElementById('maint_profit_percent').value) || 100,
        status: document.getElementById('maint_status').value
    };

    DB.saveMaintenance();

    toast('✅ تم تعديل الطلب بنجاح');
    clearMaintenanceFields();
    refreshMaintenanceTable();
}

// دالة حذف طلب صيانة
function deleteMaintenance() {
    const selectedRow = document.querySelector('.maintenance-row.selected');
    if (!selectedRow) {
        toast('⚠️ يرجى اختيار طلب للحذف', 'error');
        return;
    }

    if (!confirm('⚠️ تأكيد الحذف\n\nهل أنت متأكد من حذف هذا الطلب؟')) {
        return;
    }

    const id = parseInt(selectedRow.dataset.id);
    const maintenance = DB.getMaintenance();
    const filtered = maintenance.filter(m => m.id !== id);
    localStorage.setItem(DB.getDBKey('maintenance'), JSON.stringify(filtered));

    toast('✅ تم حذف الطلب بنجاح');
    clearMaintenanceFields();
    refreshMaintenanceTable();
}

// دالة حذف جميع طلبات الصيانة
function deleteAllMaintenance() {
    if (!confirm('⚠️ تأكيد حذف الجميع\n\nهل أنت متأكد من حذف جميع طلبات الصيانة؟\n\n⚠️ هذه العملية لا يمكن التراجع عنها!')) {
        return;
    }

    localStorage.setItem(DB.getDBKey('maintenance'), JSON.stringify([]));

    toast('✅ تم حذف جميع الطلبات بنجاح');
    refreshMaintenanceTable();
}

// دالة تفريغ الحقول
function clearMaintenanceFields() {
    document.getElementById('maint_customer_name').value = '';
    document.getElementById('maint_phone').value = '';
    document.getElementById('maint_device_model').value = '';
    document.getElementById('maint_problem').value = '';
    document.getElementById('maint_cost').value = '';
    document.getElementById('maint_selling_price').value = '';
    document.getElementById('maint_source').value = '';
    document.getElementById('maint_profit_percent').value = '100';
    document.getElementById('maint_status').value = 'قيد الإصلاح';

    // إزالة التحديد من الجدول
    document.querySelectorAll('.maintenance-row.selected').forEach(row => {
        row.classList.remove('selected');
    });
}

// دالة تحديث جدول الصيانة
function refreshMaintenanceTable() {
    const searchTerm = document.getElementById('maint-search').value.trim().toLowerCase();
    const fromDate = document.getElementById('maint-from-date').value;
    const toDate = document.getElementById('maint-to-date').value;

    let filtered = DB.getMaintenance().filter(m => {
        const matchesSearch = !searchTerm || 
            m.customer_name.toLowerCase().includes(searchTerm) ||
            m.phone.includes(searchTerm) ||
            m.device_model.toLowerCase().includes(searchTerm) ||
            m.problem.toLowerCase().includes(searchTerm);

        const matchesDate = (!fromDate || m.date >= fromDate) && 
                           (!toDate || m.date <= toDate);

        return matchesSearch && matchesDate;
    });

    // ترتيب حسب التاريخ (الأحدث أولاً)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    let totalCost = 0;
    let totalProfit = 0;

    let html = '<table style="width: 100%; border-collapse: collapse;">';
    html += '<thead><tr style="background: var(--bg3);">';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">العميل</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الهاتف</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الجهاز</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">المشكلة</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">التكلفة</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">سعر البيع</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الربح</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">الحالة</th>';
    html += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">التاريخ</th>';
    html += '</tr></thead><tbody>';

    filtered.forEach(m => {
        const rawProfit = m.selling_price - m.cost;
        const actualProfit = rawProfit * (m.profit_percent / 100);

        if (m.status === 'تم التسليم') {
            totalCost += m.cost;
            totalProfit += actualProfit;
        }

        const statusColors = {
            'قيد الإصلاح': '#f39c12',
            'تم الإصلاح': '#3498db',
            'تم التسليم': '#2ecc71',
            'لا يمكن الإصلاح': '#e74c3c'
        };

        html += `<tr class="maintenance-row" data-id="${m.id}" style="cursor: pointer; border-bottom: 1px solid var(--border); transition: background 0.2s;" onclick="selectMaintenanceRow(this)">`;
        html += `<td style="padding: 12px;">${m.customer_name}</td>`;
        html += `<td style="padding: 12px;">${m.phone}</td>`;
        html += `<td style="padding: 12px;">${m.device_model}</td>`;
        html += `<td style="padding: 12px;">${m.problem}</td>`;
        html += `<td style="padding: 12px;">${m.cost.toFixed(2)}</td>`;
        html += `<td style="padding: 12px;">${m.selling_price.toFixed(2)}</td>`;
        html += `<td style="padding: 12px; color: ${actualProfit >= 0 ? '#2ecc71' : '#e74c3c'};">${actualProfit.toFixed(2)}</td>`;
        html += `<td style="padding: 12px;"><span style="background: ${statusColors[m.status]}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">${m.status}</span></td>`;
        html += `<td style="padding: 12px;">${m.date}</td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';

    if (filtered.length === 0) {
        html += '<div style="text-align: center; padding: 40px; color: var(--muted);">لا توجد طلبات صيانة</div>';
    }

    document.getElementById('maintenance-table').innerHTML = html;

    // تحديث الملخص
    const summaryHtml = `إجمالي تكاليف المسلم: ${totalCost.toFixed(2)} | إجمالي الأرباح: ${totalProfit.toFixed(2)}`;
    const summaryEl = document.getElementById('maint-summary');
    summaryEl.textContent = summaryHtml;
    summaryEl.style.background = totalProfit >= 0 ? 'var(--accent2)' : 'var(--danger)';
}

// دالة تحديد صف في جدول الصيانة
function selectMaintenanceRow(row) {
    // إزالة التحديد من جميع الصفوف
    document.querySelectorAll('.maintenance-row.selected').forEach(r => {
        r.classList.remove('selected');
        r.style.background = '';
    });

    // تحديد الصف المختار
    row.classList.add('selected');
    row.style.background = 'var(--bg3)';

    // تحميل البيانات في الحقول
    const id = parseInt(row.dataset.id);
    const maintenance = DB.getMaintenance().find(m => m.id === id);

    if (maintenance) {
        document.getElementById('maint_customer_name').value = maintenance.customer_name;
        document.getElementById('maint_phone').value = maintenance.phone;
        document.getElementById('maint_device_model').value = maintenance.device_model;
        document.getElementById('maint_problem').value = maintenance.problem;
        document.getElementById('maint_cost').value = maintenance.cost;
        document.getElementById('maint_selling_price').value = maintenance.selling_price;
        document.getElementById('maint_source').value = maintenance.source;
        document.getElementById('maint_profit_percent').value = maintenance.profit_percent;
        document.getElementById('maint_status').value = maintenance.status;
    }
}

// دالة حساب أرباح الصيانة
function calculateMaintenanceProfits() {
    const totalProfit = DB.getMaintenance()
        .filter(m => m.status === 'تم التسليم')
        .reduce((sum, m) => {
            const rawProfit = m.selling_price - m.cost;
            return sum + (rawProfit * (m.profit_percent / 100));
        }, 0);

    alert(`إجمالي أرباح الصيانة (للطلبات المسلمة): ${totalProfit.toFixed(2)}`);
}

// دالة عرض تقارير الصيانة
function showMaintenanceReports() {
    const c = document.getElementById('pc');

    const html = `
    <div class="tw">
        <div class="th">
            <h3>📊 تقارير صيانة الموبايلات</h3>
        </div>

        <!-- فلاتر التقارير -->
        <div class="sb-bar" style="margin: 15px;">
            <select id="report-period" onchange="updateMaintenanceReport()">
                <option value="today">اليوم</option>
                <option value="yesterday">أمس</option>
                <option value="thisMonth" selected>هذا الشهر</option>
                <option value="lastMonth">الشهر السابق</option>
                <option value="custom">مخصص</option>
            </select>

            <div id="custom-date-range" style="display: none; gap: 10px; align-items: center;">
                <label>من:</label>
                <input type="date" id="report-from-date" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">
                <label>إلى:</label>
                <input type="date" id="report-to-date" style="padding: 8px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg3); color: var(--text);">
            </div>

            <button class="btn btn-sm" onclick="updateMaintenanceReport()">تحديث التقرير</button>
            <button class="btn btn-ghost btn-sm" onclick="mobile()">عودة</button>
        </div>

        <!-- ملخص التقرير -->
        <div id="report-summary" style="margin: 15px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;"></div>

        <!-- جدول التقرير -->
        <div class="tw" style="margin: 15px;">
            <div class="th">
                <h3>📋 تفاصيل التقرير</h3>
            </div>
            <div id="report-table"></div>
        </div>
    </div>`;

    c.innerHTML = html;

    // إضافة مستمع لتغيير الفترة
    document.getElementById('report-period').addEventListener('change', function() {
        const customRange = document.getElementById('custom-date-range');
        customRange.style.display = this.value === 'custom' ? 'flex' : 'none';
    });

    // تحميل التقرير الافتراضي
    updateMaintenanceReport();
}

// دالة تحديث تقرير الصيانة
function updateMaintenanceReport() {
    const period = document.getElementById('report-period').value;
    let fromDate, toDate;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    switch (period) {
        case 'today':
            fromDate = today.toISOString().split('T')[0];
            toDate = fromDate;
            break;
        case 'yesterday':
            fromDate = yesterday.toISOString().split('T')[0];
            toDate = fromDate;
            break;
        case 'thisMonth':
            fromDate = firstDayOfMonth.toISOString().split('T')[0];
            toDate = lastDayOfMonth.toISOString().split('T')[0];
            break;
        case 'lastMonth':
            fromDate = firstDayOfLastMonth.toISOString().split('T')[0];
            toDate = lastDayOfLastMonth.toISOString().split('T')[0];
            break;
        case 'custom':
            fromDate = document.getElementById('report-from-date').value;
            toDate = document.getElementById('report-to-date').value;
            break;
    }

    // تصفية البيانات حسب التاريخ
    let filtered = DB.getMaintenance().filter(m => {
        return m.date >= fromDate && m.date <= toDate;
    });

    // تجميع البيانات حسب التاريخ
    const groupedByDate = {};
    filtered.forEach(m => {
        if (!groupedByDate[m.date]) {
            groupedByDate[m.date] = {
                count: 0,
                totalCost: 0,
                totalSales: 0,
                totalProfit: 0
            };
        }

        const rawProfit = m.selling_price - m.cost;
        const actualProfit = rawProfit * (m.profit_percent / 100);

        groupedByDate[m.date].count++;
        groupedByDate[m.date].totalCost += m.cost;
        groupedByDate[m.date].totalSales += m.selling_price;
        groupedByDate[m.date].totalProfit += actualProfit;
    });

    // تحويل إلى مصفوفة وترتيبها حسب التاريخ
    const reportData = Object.keys(groupedByDate)
        .sort()
        .map(date => ({
            date: date,
            ...groupedByDate[date]
        }));

    // حساب الإجماليات
    const totalStats = {
        totalCount: filtered.length,
        totalCost: reportData.reduce((sum, d) => sum + d.totalCost, 0),
        totalSales: reportData.reduce((sum, d) => sum + d.totalSales, 0),
        totalProfit: reportData.reduce((sum, d) => sum + d.totalProfit, 0)
    };

    // عرض الملخص
    const summaryHtml = `
    <div style="background: var(--bg3); border-radius: 9px; padding: 14px; border-right: 4px solid var(--accent);">
        <div style="font-size: 11px; color: var(--muted);">عدد الطلبات</div>
        <div style="font-size: 20px; font-weight: 900; color: var(--accent);">${totalStats.totalCount}</div>
    </div>
    <div style="background: var(--bg3); border-radius: 9px; padding: 14px; border-right: 4px solid var(--warn);">
        <div style="font-size: 11px; color: var(--muted);">إجمالي التكلفة</div>
        <div style="font-size: 20px; font-weight: 900; color: var(--warn);">${fmt(totalStats.totalCost)}</div>
    </div>
    <div style="background: var(--bg3); border-radius: 9px; padding: 14px; border-right: 4px solid var(--accent2);">
        <div style="font-size: 11px; color: var(--muted);">إجمالي المبيعات</div>
        <div style="font-size: 20px; font-weight: 900; color: var(--accent2);">${fmt(totalStats.totalSales)}</div>
    </div>
    <div style="background: var(--bg3); border-radius: 9px; padding: 14px; border-right: 4px solid ${totalStats.totalProfit >= 0 ? '#2ecc71' : '#e74c3c'};">
        <div style="font-size: 11px; color: var(--muted);">صافي الربح</div>
        <div style="font-size: 20px; font-weight: 900; color: ${totalStats.totalProfit >= 0 ? '#2ecc71' : '#e74c3c'};">${fmt(totalStats.totalProfit)}</div>
    </div>`;

    document.getElementById('report-summary').innerHTML = summaryHtml;

    // عرض الجدول
    let tableHtml = '<table style="width: 100%; border-collapse: collapse;">';
    tableHtml += '<thead><tr style="background: var(--bg3);">';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">التاريخ</th>';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">العدد</th>';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">إجمالي التكلفة</th>';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">إجمالي المبيعات</th>';
    tableHtml += '<th style="padding: 12px; text-align: right; border-bottom: 2px solid var(--border);">صافي الربح</th>';
    tableHtml += '</tr></thead><tbody>';

    reportData.forEach(row => {
        tableHtml += '<tr style="border-bottom: 1px solid var(--border);">';
        tableHtml += `<td style="padding: 12px;">${row.date}</td>`;
        tableHtml += `<td style="padding: 12px;">${row.count}</td>`;
        tableHtml += `<td style="padding: 12px;">${fmt(row.totalCost)}</td>`;
        tableHtml += `<td style="padding: 12px;">${fmt(row.totalSales)}</td>`;
        tableHtml += `<td style="padding: 12px; color: ${row.totalProfit >= 0 ? '#2ecc71' : '#e74c3c'};">${fmt(row.totalProfit)}</td>`;
        tableHtml += '</tr>';
    });

    tableHtml += '</tbody></table>';

    if (reportData.length === 0) {
        tableHtml += '<div style="text-align: center; padding: 40px; color: var(--muted);">لا توجد بيانات للفترة المحددة</div>';
    }

    document.getElementById('report-table').innerHTML = tableHtml;
}

// تحميل بيانات الصيانة عند بدء التطبيق
DB.loadMaintenance();
function inventory(q = '', cat = 'الكل', st = 'الكل') {
    const c = document.getElementById('pc');
    const products = DB.products;

    const html = `
    <div class="sb-bar">
        <input class="si" id="inv-search" placeholder="🔍 بحث..." value="${q}" oninput="inventory(this.value,document.getElementById('icat').value,document.getElementById('ist').value)">
        <select id="icat" onchange="inventory(document.getElementById('inv-search').value,this.value,document.getElementById('ist').value)">
            <option value="الكل">كل الفئات</option>
            <option value="موبايلات">موبايلات</option>
            <option value="ملحقات">ملحقات</option>
            <option value="أجهزة لوحية">أجهزة لوحية</option>
            <option value="أخرى">أخرى</option>
        </select>
        <select id="ist" onchange="inventory(document.getElementById('inv-search').value,document.getElementById('icat').value,this.value)">
            <option value="الكل">كل الحالات</option>
            <option value="متوفر">متوفر</option>
            <option value="منخفض">منخفض</option>
            <option value="منتهي">منتهي</option>
        </select>
        <button class="btn btn-success" onclick="addInvProd()">+ إضافة منتج</button>
        <button class="btn btn-warn" onclick="openInventoryCount()">📊 جرد</button>
        <button class="btn btn-danger" onclick="deleteAllInventory()">🗑️ حذف الجميع</button>
    </div>

    <div id="inv-stats" class="sg"></div>

    <div id="inv-totals" style="display:none;margin-bottom:18px">
        <div id="inv-totals-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px"></div>
    </div>

    <div class="tw"><div class="th"><h3>📋 المخزون</h3><span id="icnt" style="color:var(--muted);font-size:13px"></span></div><div id="inv-table"></div></div>`;

    c.innerHTML = html;

    // فلتر البحث
    let filteredProducts = products;
    if (q) {
        filteredProducts = products.filter(p =>
            p.name.includes(q) ||
            p.brand.includes(q) ||
            p.category.includes(q) ||
            p.barcode?.includes(q)
        );
    }

    // فلتر الفئة
    let items = cat === 'الكل' ? filteredProducts : filteredProducts.filter(p => p.category === cat);

    // فلتر الحالة
    if (st === 'متوفر') items = items.filter(p => p.quantity > p.min_stock);
    else if (st === 'منخفض') items = items.filter(p => p.quantity <= p.min_stock && p.quantity > 0);
    else if (st === 'منتهي') items = items.filter(p => p.quantity <= 0);

    document.getElementById('icat').value = cat;
    document.getElementById('ist').value = st;

    let totalCost = 0, totalValue = 0, totalProfit = 0, outStock = 0, lowStock = 0, good = 0, totalQty = 0;
    items.forEach(p => {
        const itemCost = p.quantity * p.cost_price;
        const itemValue = p.quantity * p.selling_price;
        const itemProfit = p.quantity * (p.selling_price - p.cost_price);
        totalCost += itemCost;
        totalValue += itemValue;
        totalProfit += itemProfit;
        totalQty += p.quantity;
        if (p.quantity <= 0) outStock++;
        else if (p.quantity <= p.min_stock) lowStock++;
        else good++;
    });

    document.getElementById('inv-stats').innerHTML = `
    <div class="sc bl"><div class="lb">📦 إجمالي الكمية</div><div class="vl">${totalQty}</div><div class="sb">${items.length} منتج</div></div>
    <div class="sc gr"><div class="lb">💰 قيمة المخزون</div><div class="vl">${fmt(totalValue)}</div><div class="sb">تكلفة: ${fmt(totalCost)}</div></div>
    <div class="sc pu"><div class="lb">💹 الربح المتوقع</div><div class="vl">${fmt(totalProfit)}</div><div class="sb">هامش: ${totalValue > 0 ? Math.round(totalProfit / totalValue * 100) : 0}%</div></div>
    <div class="sc bg"><div class="lb">✅ متوفر</div><div class="vl">${good}</div></div>
    <div class="sc bw"><div class="lb">⚠️ منخفض</div><div class="vl">${lowStock}</div></div>
    <div class="sc br"><div class="lb">❌ منتهي</div><div class="vl">${outStock}</div></div>
    `;

    // عرض بطاقة الإجمالي والأرباح
    const totDiv = document.getElementById('inv-totals');
    totDiv.style.display = 'block';
    document.getElementById('inv-totals-grid').innerHTML = `
    <div style="background:var(--bg3);border-radius:9px;padding:14px;border-right:4px solid var(--accent)">
        <div style="font-size:11px;color:var(--muted)">إجمالي تكلفة المخزون</div>
        <div style="font-size:20px;font-weight:900;color:var(--accent)">${fmt(totalCost)}</div>
    </div>
    <div style="background:var(--bg3);border-radius:9px;padding:14px;border-right:4px solid var(--accent2)">
        <div style="font-size:11px;color:var(--muted)">إجمالي قيمة البيع</div>
        <div style="font-size:20px;font-weight:900;color:var(--accent2)">${fmt(totalValue)}</div>
    </div>
    <div style="background:var(--bg3);border-radius:9px;padding:14px;border-right:4px solid #a855f7">
        <div style="font-size:11px;color:var(--muted)">الربح المتوقع</div>
        <div style="font-size:20px;font-weight:900;color:#a855f7">${fmt(totalProfit)}</div>
    </div>
    <div style="background:var(--bg3);border-radius:9px;padding:14px;border-right:4px solid var(--warn)">
        <div style="font-size:11px;color:var(--muted)">نسبة الربح</div>
        <div style="font-size:20px;font-weight:900;color:var(--warn)">${totalCost > 0 ? Math.round(totalProfit / totalCost * 100) : 0}%</div>
    </div>
    `;

    document.getElementById('icnt').textContent = items.length + ' منتج';
    document.getElementById('inv-table').innerHTML = items.length
        ? `<table><tr><th>الاسم</th><th>الماركة</th><th>الفئة</th><th>الباركود</th><th>سعر الشراء</th><th>سعر البيع</th><th>هامش الربح</th><th>الكمية</th><th>القيمة الإجمالية</th><th>الربح المتوقع</th><th>الحالة</th><th></th></tr>
        ${items.map(p => {
            const status = p.quantity <= 0 ? '❌ منتهي' : p.quantity <= p.min_stock ? '⚠️ منخفض' : '✅ متوفر';
            const statusColor = p.quantity <= 0 ? 'br' : p.quantity <= p.min_stock ? 'bw' : 'bg';
            const itemValue = (p.quantity * p.selling_price);
            const itemProfit = p.quantity * (p.selling_price - p.cost_price);
            const margin = p.selling_price - p.cost_price;
            const marginPct = p.cost_price > 0 ? Math.round(margin / p.cost_price * 100) : 0;
            const productJson = JSON.stringify(p);
            return `<tr><td><b>${p.name}</b></td><td>${p.brand}</td><td>${p.category}</td><td style="font-size:11px;color:var(--muted);font-family:monospace">${p.barcode || '—'}</td><td>${fmt(p.cost_price)}</td><td style="color:var(--accent2)">${fmt(p.selling_price)}</td><td style="color:${margin >= 0 ? 'var(--accent2)' : 'var(--danger)'};font-size:12px">${margin >= 0 ? '+' : ''}${fmt(margin)} (${marginPct}%)</td>
            <td><span class="badge ${statusColor}">${p.quantity}</span></td><td style="color:var(--accent2);font-weight:700">${fmt(itemValue)}</td><td style="color:#a855f7;font-weight:700">${fmt(itemProfit)}</td><td>${status}</td>
            <td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" title="تحديث سريع" onclick="quickUpdateQty(${p.id},'${p.name.replace(/'/g, '')}',${p.quantity})">⚡</button><button class="btn btn-ghost btn-sm" onclick='eInvProd(${productJson})'>✏️</button> <button class="btn btn-danger btn-sm" onclick="dInvProd(${p.id},'${p.name.replace(/'/g, '')}')">🗑️</button></td></tr>`;
        }).join('')}</table>`
        : em('لا توجد منتجات');
}

function renderInventoryTable(products) {
    const el = document.getElementById('inv-table');
    if (!el) return;

    if (!products.length) {
        el.innerHTML = em('لا توجد منتجات');
        return;
    }

    el.innerHTML = `
    <table>
        <tr>
            <th>المنتج</th>
            <th>الماركة</th>
            <th>الفئة</th>
            <th>الكمية</th>
            <th>الحد الأدنى</th>
            <th>سعر الشراء</th>
            <th>سعر البيع</th>
            <th>القيمة</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
        </tr>
        ${products.map(p => {
            const statusClass = p.quantity <= 0 ? 'br' : p.quantity <= p.min_stock ? 'bw' : 'bg';
            const statusText = p.quantity <= 0 ? 'نافد' : p.quantity <= p.min_stock ? 'منخفض' : 'متوفر';
            const value = p.cost_price * p.quantity;
            const productJson = JSON.stringify(p);

            return `
            <tr>
                <td><b>${p.name}</b></td>
                <td>${p.brand}</td>
                <td>${p.category}</td>
                <td><span class="badge ${statusClass}">${p.quantity}</span></td>
                <td>${p.min_stock}</td>
                <td>${fmt(p.cost_price)}</td>
                <td>${fmt(p.selling_price)}</td>
                <td>${fmt(value)}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td style="white-space:nowrap">
                    <button class="btn btn-ghost btn-sm" onclick='eInvProd(${productJson})' title="تعديل">✏️</button>
                    <button class="btn btn-warn btn-sm" onclick='adjInvStock(${p.id})' title="تعديل الكمية">📦</button>
                    <button class="btn btn-danger btn-sm" onclick="dInvProd(${p.id},'${p.name.replace(/'/g, '')}')" title="حذف">🗑️</button>
                </td>
            </tr>`;
        }).join('')}
    </table>`;
}

function filterInventory(filter, tabElement) {
    // تحديث التبويبات
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tabElement.classList.add('active');

    const products = DB.products;
    let filtered;

    switch(filter) {
        case 'available':
            filtered = products.filter(p => p.quantity > p.min_stock);
            break;
        case 'low':
            filtered = products.filter(p => p.quantity > 0 && p.quantity <= p.min_stock);
            break;
        case 'out':
            filtered = products.filter(p => p.quantity <= 0);
            break;
        default:
            filtered = products;
    }

    renderInventoryTable(filtered);
}

function searchInventory(query) {
    const products = DB.products;
    const filtered = products.filter(p =>
        p.name.includes(query) ||
        p.brand.includes(query) ||
        p.category.includes(query) ||
        p.barcode?.includes(query)
    );
    renderInventoryTable(filtered);
}

// إضافة منتج من قسم المخزون
function addInvProd() {
    omo('➕ إضافة منتج جديد', `<div class="fg">
        <div class="ff full"><label>الاسم *</label><input id="ipn" placeholder="iPhone 15 Pro"></div>
        <div class="ff"><label>الماركة *</label><input id="ipb" placeholder="Apple"></div>
        <div class="ff"><label>الموديل</label><input id="ipm" placeholder="A1234"></div>
        <div class="ff"><label>الفئة</label><select id="ipcat" onchange="toggleInvCondField()"><option>موبايلات</option><option>ملحقات</option><option>أجهزة لوحية</option><option>أخرى</option></select></div>
        <div class="ff"><label>سعر الشراء *</label><input id="ipcp" type="number" placeholder="0"></div>
        <div class="ff"><label>سعر البيع *</label><input id="ipsp" type="number" placeholder="0"></div>
        <div class="ff"><label>الكمية *</label><input id="ipq" type="number" placeholder="0"></div>
        <div class="ff"><label>الحد الأدنى</label><input id="ipms" type="number" placeholder="5"></div>
        <div class="ff"><label>الباركود</label><input id="ipbar" placeholder="اختياري"></div>
        <div class="ff" id="icond-field"><label>الحالة</label><select id="ipcon"><option>جديد</option><option>مستعمل</option></select></div>
    </div>`, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="svInvProd()">💾 حفظ</button>`);
    setTimeout(toggleInvCondField, 50);
}

function toggleInvCondField() {
    const cat = document.getElementById('ipcat')?.value;
    const cf = document.getElementById('icond-field');
    if (cf) cf.style.display = cat === 'موبايلات' ? 'flex' : 'none';
}

function svInvProd() {
    const product = {
        name: document.getElementById('ipn').value,
        brand: document.getElementById('ipb').value,
        model: document.getElementById('ipm').value || '-',
        category: document.getElementById('ipcat').value,
        cost_price: parseFloat(document.getElementById('ipcp').value) || 0,
        selling_price: parseFloat(document.getElementById('ipsp').value) || 0,
        quantity: parseInt(document.getElementById('ipq').value) || 0,
        min_stock: parseInt(document.getElementById('ipms').value) || 5,
        barcode: document.getElementById('ipbar').value || null,
        condition: document.getElementById('ipcon').value
    };

    if (!product.name || !product.brand) {
        toast('يرجى ملء الحقول المطلوبة', 'error');
        return;
    }

    DB.saveProduct(product);
    cmo();
    toast('تم حفظ المنتج بنجاح');
    inventory();
}

// تعديل منتج من قسم المخزون
function eInvProd(p) {
    omo('✏️ تعديل المنتج', `<div class="fg">
        <div class="ff full"><label>الاسم</label><input id="ien" value="${p.name}"></div>
        <div class="ff"><label>الماركة</label><input id="ieb" value="${p.brand}"></div>
        <div class="ff"><label>سعر الشراء</label><input id="iec" type="number" value="${p.cost_price}"></div>
        <div class="ff"><label>سعر البيع</label><input id="ies" type="number" value="${p.selling_price}"></div>
        <div class="ff"><label>الكمية</label><input id="ieq" type="number" value="${p.quantity}"></div>
        <div class="ff"><label>الحد الأدنى</label><input id="iem" type="number" value="${p.min_stock}"></div>
        <div class="ff"><label>الحالة</label><select id="ieco"><option ${p.condition === 'جديد' ? 'selected' : ''}>جديد</option><option ${p.condition === 'مستعمل' ? 'selected' : ''}>مستعمل</option><option ${p.condition === 'مجدد' ? 'selected' : ''}>مجدد</option></select></div>
    </div>`, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="upInvProd(${p.id})">💾 حفظ</button>`);
}

function upInvProd(id) {
    const product = {
        id,
        name: document.getElementById('ien').value,
        brand: document.getElementById('ieb').value,
        model: '-',
        cost_price: parseFloat(document.getElementById('iec').value) || 0,
        selling_price: parseFloat(document.getElementById('ies').value) || 0,
        quantity: parseInt(document.getElementById('ieq').value) || 0,
        min_stock: parseInt(document.getElementById('iem').value) || 5,
        condition: document.getElementById('ieco').value
    };

    DB.saveProduct(product);
    cmo();
    toast('تم تحديث المنتج بنجاح');
    inventory();
}

// تعديل كمية المخزون
function adjInvStock(id) {
    const product = DB.products.find(p => p.id === id);
    if (!product) return;

    omo('📦 تعديل كمية المخزون', `
    <div style="background:var(--bg3);padding:15px;border-radius:8px;margin-bottom:15px">
        <div style="margin-bottom:10px"><b>${product.name}</b></div>
        <div style="color:var(--muted)">الكمية الحالية: ${product.quantity}</div>
    </div>
    <div class="fg">
        <div class="ff"><label>إضافة (+)</label><input id="ias" type="number" placeholder="0"></div>
        <div class="ff"><label>خصم (-)</label><input id="irs" type="number" placeholder="0"></div>
    </div>
    <div class="ff" style="margin-top:10px"><label>السبب</label><input id="irsn" placeholder="سبب التعديل"></div>
    `, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="confirmAdjStock(${id})">💾 حفظ</button>`);
}

function confirmAdjStock(id) {
    const product = DB.products.find(p => p.id === id);
    if (!product) return;

    const addQty = parseInt(document.getElementById('ias').value) || 0;
    const removeQty = parseInt(document.getElementById('irs').value) || 0;
    const reason = document.getElementById('irsn').value || 'تعديل يدوي';

    const newQty = product.quantity + addQty - removeQty;
    if (newQty < 0) {
        toast('الكمية النهائية لا يمكن أن تكون سالبة', 'error');
        return;
    }

    product.quantity = newQty;
    DB.saveProduct(product);

    cmo();
    toast(`تم تحديث الكمية إلى ${newQty}`);
    inventory();
}

// حذف منتج من قسم المخزون
function dInvProd(id, name) {
    if (!confirm(`حذف: ${name}?`)) return;
    DB.deleteProduct(id);
    toast('تم حذف المنتج');
    inventory();
}

// تحديث سريع للكمية
function quickUpdateQty(id, name, current) {
    omo(`⚡ تحديث كمية: ${name}`, `
    <div class="fg">
        <div class="ff full">
            <label style="font-size:12px">الكمية الحالية: <b>${current}</b></label>
            <input id="nqty" type="number" value="${current}" style="font-size:18px;font-weight:700;text-align:center" autofocus>
        </div>
    </div>
    `, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="doQuickUpdate(${id})">✅ حفظ</button>`);
    setTimeout(() => document.getElementById('nqty')?.focus(), 100);
}

function doQuickUpdate(id) {
    const newQty = parseInt(document.getElementById('nqty').value) || 0;
    const product = DB.products.find(p => p.id === id);
    if (product) {
        product.quantity = newQty;
        DB.saveProduct(product);
        cmo();
        toast('✅ تم تحديث الكمية');
        inventory();
    }
}

// عملية جرد المخزون
function openInventoryCount() {
    omo('📊 عملية جرد المخزون', `
    <div class="fg">
        <div class="ff full" style="background:var(--bg3);padding:12px;border-radius:8px;margin-bottom:12px">
            <p style="color:var(--muted);font-size:13px;line-height:1.6">
                🔍 <b>خطوات الجرد:</b><br>
                1️⃣ حدد الفئة المراد جردها<br>
                2️⃣ قارن الكمية الفعلية مع النظام<br>
                3️⃣ سجل أي فروقات<br>
                4️⃣ احفظ نتائج الجرد
            </p>
        </div>
        <div class="ff full">
            <label>الفئة</label>
            <select id="count-cat">
                <option value="الكل">كل الفئات</option>
                <option value="موبايلات">موبايلات</option>
                <option value="ملحقات">ملحقات</option>
                <option value="أجهزة لوحية">أجهزة لوحية</option>
                <option value="أخرى">أخرى</option>
            </select>
        </div>
        <div class="ff full">
            <label>ملاحظات الجرد</label>
            <textarea id="count-notes" placeholder="سجل الملاحظات والفروقات..."></textarea>
        </div>
    </div>
    `, `<button class="btn btn-ghost" onclick="cmo()">إلغاء</button><button class="btn btn-success" onclick="doInventoryCount()">✅ تسجيل الجرد</button>`);
}

function deleteAllInventory() {
    const allProducts = DB.products;

    if (!allProducts.length) {
        toast('لا توجد منتجات في المخزون', 'error');
        return;
    }

    omo('🗑️ حذف جميع المنتجات من المخزون', `
        <div class="fg">
            <div class="ff full" style="background:rgba(255,71,87,.1);border:1px solid var(--danger);border-radius:8px;padding:15px;margin-bottom:15px">
                <p style="color:var(--danger);font-size:14px;margin:0">
                    ⚠️ هل أنت متأكد من حذف جميع المنتجات من المخزون؟
                </p>
                <p style="color:var(--danger);font-size:13px;margin:5px 0 0 0">
                    عدد المنتجات: ${allProducts.length}
                </p>
                <p style="color:var(--danger);font-size:13px;margin:5px 0 0 0">
                    ⚠️ هذه العملية لا يمكن التراجع عنها!
                </p>
            </div>
        </div>
    `, `
        <button class="btn btn-ghost" onclick="cmo()">إلغاء</button>
        <button class="btn btn-danger" onclick="confirmDeleteAllInventory()">🗑️ حذف جميع المنتجات</button>
    `);
}

function confirmDeleteAllInventory() {
    const allProducts = DB.products;

    if (!allProducts.length) {
        toast('لا توجد منتجات في المخزون', 'error');
        cmo();
        return;
    }

    // حذف جميع المنتجات
    localStorage.setItem(DB.getDBKey('products'), JSON.stringify([]));

    cmo();
    toast(`✅ تم حذف ${allProducts.length} منتج من المخزون بنجاح`);
    inventory();
}

function doInventoryCount() {
    const cat = document.getElementById('count-cat').value;
    const notes = document.getElementById('count-notes').value;

    // حفظ سجل الجرد
    const countRecord = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        category: cat,
        notes: notes,
        items: []
    };

    // إضافة المنتجات للجرد
    const products = DB.products;
    const filteredProducts = cat === 'الكل' ? products : products.filter(p => p.category === cat);

    filteredProducts.forEach(p => {
        countRecord.items.push({
            product_id: p.id,
            name: p.name,
            system_qty: p.quantity,
            actual_qty: p.quantity,
            difference: 0
        });
    });

    // حفظ سجل الجرد في localStorage
    let counts = JSON.parse(localStorage.getItem('inventory_counts') || '[]');
    counts.push(countRecord);
    localStorage.setItem('inventory_counts', JSON.stringify(counts));

    cmo();
    toast(`✅ تم تسجيل جرد ${cat}`);
    inventory();
}

// ============================================
// إدارة الحسابات
// ============================================
function accounts() {
    const c = document.getElementById('pc');
    const currentAccount = DB.getCurrentAccount();
    const allAccounts = DB.accounts;

    c.innerHTML = `
    <div class="tw">
        <div class="th">
            <h3>🏢 إدارة الحسابات</h3>
            <button class="btn btn-success btn-sm" onclick="addAccount()">+ إضافة حساب</button>
        </div>
        <div style="padding:20px">
            <div style="background:var(--bg3);padding:15px;border-radius:8px;margin-bottom:20px">
                <h4 style="margin-bottom:10px;color:var(--accent)">الحساب الحالي</h4>
                <p style="font-size:18px;font-weight:bold;margin-bottom:5px">${currentAccount?.name || 'غير محدد'}</p>
                <p style="color:var(--muted);font-size:13px">معرف الحساب: ${currentAccount?.id || 'N/A'}</p>
                <button class="btn btn-ghost btn-sm" style="margin-top:10px" onclick="changeAccountPassword()">🔑 تغيير كلمة المرور</button>
            </div>
            <div id="accounts-list">
                ${allAccounts.map(acc => `
                    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:15px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center">
                        <div>
                            <b style="font-size:15px">${acc.name}</b>
                            <p style="color:var(--muted);font-size:12px;margin-top:5px">
                                معرف: ${acc.id} | 
                                تاريخ الإنشاء: ${new Date(acc.created_at).toLocaleDateString('ar-SA')}
                            </p>
                        </div>
                        <div style="display:flex;gap:5px">
                            ${acc.id !== currentAccount?.id ? `
                                <button class="btn btn-primary btn-sm" onclick="switchAccount('${acc.id}')">🔄 التبديل</button>
                            ` : `
                                <span class="badge bg">الحالي</span>
                            `}
                            ${acc.id !== 'default' ? `
                                <button class="btn btn-danger btn-sm" onclick="deleteAccount('${acc.id}', '${acc.name.replace(/'/g, "\'")}')">🗑️</button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>`;
}

function addAccount() {
    omo('➕ إضافة حساب جديد', `
        <div class="fg">
            <div class="ff full">
                <label>اسم الحساب *</label>
                <input id="account-name" placeholder="مثال: فرع الرياض">
            </div>
            <div class="ff full">
                <label>كلمة مرور الحساب *</label>
                <input id="account-password" type="password" placeholder="كلمة مرور لحماية الحساب">
            </div>
            <div class="ff full">
                <label>تأكيد كلمة المرور *</label>
                <input id="account-password-confirm" type="password" placeholder="أعد إدخال كلمة المرور">
            </div>
        </div>
    `, `
        <button class="btn btn-ghost" onclick="cmo()">إلغاء</button>
        <button class="btn btn-success" onclick="saveAccount()">💾 حفظ</button>
    `);
}

function saveAccount() {
    const name = document.getElementById('account-name').value.trim();
    const password = document.getElementById('account-password').value.trim();
    const passwordConfirm = document.getElementById('account-password-confirm').value.trim();

    if (!name) {
        toast('يرجى إدخال اسم الحساب', 'error');
        return;
    }

    if (!password) {
        toast('يرجى إدخال كلمة مرور الحساب', 'error');
        return;
    }

    if (password.length < 4) {
        toast('كلمة المرور يجب أن تكون 4 أحرف على الأقل', 'error');
        return;
    }

    if (password !== passwordConfirm) {
        toast('كلمات المرور غير متطابقة', 'error');
        return;
    }

    const account = DB.saveAccount({ 
        name,
        password: btoa(password) // تشفير بسيط لكلمة المرور
    });
    cmo();
    toast('✅ تم إضافة الحساب بنجاح');
    accounts();
}

function changeAccountPassword() {
    const currentAccount = DB.getCurrentAccount();
    const isDefaultAccount = currentAccount?.id === 'default';

    omo('🔑 تغيير كلمة مرور الحساب', `
        <div class="fg">
            <div class="ff full">
                <label>اسم الحساب</label>
                <input type="text" value="${currentAccount?.name}" disabled style="background:var(--bg);opacity:0.7">
            </div>
            ${!isDefaultAccount || currentAccount?.password ? `
                <div class="ff full">
                    <label>كلمة المرور الحالية *</label>
                    <input id="current-password" type="password" placeholder="أدخل كلمة المرور الحالية">
                </div>
            ` : `
                <div class="ff full" style="background:rgba(0,212,255,.1);border:1px solid var(--accent);border-radius:8px;padding:12px">
                    <p style="color:var(--accent);font-size:13px;margin:0">
                        ℹ️ أنت تقوم بتعيين كلمة مرور للحساب الافتراضي لأول مرة.
                    </p>
                </div>
            `}
            <div class="ff full">
                <label>كلمة المرور الجديدة *</label>
                <input id="new-password" type="password" placeholder="أدخل كلمة المرور الجديدة">
            </div>
            <div class="ff full">
                <label>تأكيد كلمة المرور الجديدة *</label>
                <input id="new-password-confirm" type="password" placeholder="أعد إدخال كلمة المرور الجديدة">
            </div>
        </div>
    `, `
        <button class="btn btn-ghost" onclick="cmo()">إلغاء</button>
        <button class="btn btn-success" onclick="saveAccountPasswordChange()">💾 حفظ التغييرات</button>
    `);
}

function saveAccountPasswordChange() {
    const newPassword = document.getElementById('new-password').value.trim();
    const newPasswordConfirm = document.getElementById('new-password-confirm').value.trim();
    const currentAccount = DB.getCurrentAccount();
    const isDefaultAccount = currentAccount?.id === 'default';

    // إذا كان الحساب الافتراضي وله كلمة مرور، أو حساب آخر، تحقق من كلمة المرور الحالية
    if (!isDefaultAccount || currentAccount?.password) {
        const currentPassword = document.getElementById('current-password')?.value.trim();

        if (!currentPassword) {
            toast('يرجى إدخال كلمة المرور الحالية', 'error');
            return;
        }

        // التحقق من كلمة المرور الحالية
        if (btoa(currentPassword) !== currentAccount.password) {
            toast('كلمة المرور الحالية غير صحيحة', 'error');
            return;
        }
    }

    if (!newPassword) {
        toast('يرجى إدخال كلمة المرور الجديدة', 'error');
        return;
    }

    if (newPassword.length < 4) {
        toast('كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل', 'error');
        return;
    }

    if (newPassword !== newPasswordConfirm) {
        toast('كلمات المرور الجديدة غير متطابقة', 'error');
        return;
    }

    // تحديث كلمة المرور
    const accounts = DB.accounts;
    const index = accounts.findIndex(a => a.id === currentAccount.id);
    if (index !== -1) {
        accounts[index].password = btoa(newPassword);
        localStorage.setItem('mostamer_accounts', JSON.stringify(accounts));
        cmo();
        toast('✅ تم تغيير كلمة المرور بنجاح');
        accounts();
    }
}

function switchAccount(accountId) {
    const account = DB.accounts.find(a => a.id === accountId);

    // إذا كان الحساب الافتراضي، لا نحتاج كلمة مرور
    if (accountId === 'default') {
        if (confirm('هل تريد التبديل إلى الحساب الافتراضي؟ سيتم تسجيل الخروج من الحساب الحالي.')) {
            if (DB.switchAccount(accountId)) {
                Auth.logout();
                location.reload();
            }
        }
        return;
    }

    // طلب كلمة المرور للحسابات المحمية
    omo('🔐 التبديل إلى الحساب', `
        <div class="fg">
            <div class="ff full">
                <label>اسم الحساب</label>
                <input type="text" value="${account?.name}" disabled style="background:var(--bg);opacity:0.7">
            </div>
            <div class="ff full">
                <label>كلمة مرور الحساب *</label>
                <input id="account-switch-password" type="password" placeholder="أدخل كلمة مرور الحساب">
            </div>
        </div>
    `, `
        <button class="btn btn-ghost" onclick="cmo()">إلغاء</button>
        <button class="btn btn-success" onclick="confirmSwitchAccount('${accountId}')">🔄 التبديل</button>
    `);
}

function confirmSwitchAccount(accountId) {
    const enteredPassword = document.getElementById('account-switch-password').value.trim();
    const account = DB.accounts.find(a => a.id === accountId);

    if (!enteredPassword) {
        toast('يرجى إدخال كلمة المرور', 'error');
        return;
    }

    // التحقق من كلمة المرور
    if (btoa(enteredPassword) !== account.password) {
        toast('كلمة المرور غير صحيحة', 'error');
        return;
    }

    cmo();
    if (DB.switchAccount(accountId)) {
        Auth.logout();
        location.reload();
    }
}

function deleteAccount(accountId, accountName) {
    const account = DB.accounts.find(a => a.id === accountId);
    const currentAccount = DB.getCurrentAccount();
    const isDefaultAccount = currentAccount?.id === 'default';

    omo('🗑️ حذف الحساب', `
        <div class="fg">
            <div class="ff full">
                <label>اسم الحساب</label>
                <input type="text" value="${accountName}" disabled style="background:var(--bg);opacity:0.7">
            </div>
            ${!isDefaultAccount ? `
                <div class="ff full">
                    <label>كلمة مرور الحساب *</label>
                    <input id="account-delete-password" type="password" placeholder="أدخل كلمة مرور الحساب للتأكيد">
                </div>
            ` : `
                <div class="ff full" style="background:rgba(0,212,255,.1);border:1px solid var(--accent);border-radius:8px;padding:12px">
                    <p style="color:var(--accent);font-size:13px;margin:0">
                        ℹ️ أنت مسجل في الحساب الافتراضي، يمكنك حذف الحسابات الأخرى مباشرة.
                    </p>
                </div>
            `}
            <div class="ff full" style="background:rgba(255,71,87,.1);border:1px solid var(--danger);border-radius:8px;padding:12px">
                <p style="color:var(--danger);font-size:13px;margin:0">
                    ⚠️ سيتم حذف جميع البيانات المرتبطة بهذا الحساب بشكل دائم ولا يمكن استعادتها.
                </p>
            </div>
        </div>
    `, `
        <button class="btn btn-ghost" onclick="cmo()">إلغاء</button>
        <button class="btn btn-danger" onclick="confirmDeleteAccount('${accountId}', '${accountName.replace(/'/g, "\'")}', true)">🗑️ حذف نهائي</button>
    `);
}

function confirmDeleteAccount(accountId, accountName, isDefaultAccount) {
    const account = DB.accounts.find(a => a.id === accountId);

    // إذا لم يكن الحساب الافتراضي، تحقق من كلمة المرور
    if (!isDefaultAccount) {
        const enteredPassword = document.getElementById('account-delete-password').value.trim();

        if (!enteredPassword) {
            toast('يرجى إدخال كلمة المرور', 'error');
            return;
        }

        // التحقق من كلمة المرور
        if (btoa(enteredPassword) !== account.password) {
            toast('كلمة المرور غير صحيحة', 'error');
            return;
        }
    }

    if (!confirm(`هل أنت متأكد تماماً من حذف حساب "${accountName}"؟

⚠️ هذه العملية لا يمكن التراجع عنها!`)) {
        return;
    }

    if (DB.deleteAccount(accountId)) {
        cmo();
        toast('✅ تم حذف الحساب بنجاح');
        accounts();
    }
}

function license() {
    const c = document.getElementById('pc');
    c.innerHTML = `
    <div class="tw">
        <div class="th"><h3>🔐 معلومات الترخيص</h3></div>
        <div style="padding:20px">
            <div style="background:var(--bg3);padding:15px;border-radius:8px;margin-bottom:15px">
                <h4 style="margin-bottom:10px;color:var(--accent)">المستمر للمحاسبة - النسخة المجانية</h4>
                <p style="margin-bottom:5px">الإصدار: 1.0.0</p>
                <p style="margin-bottom:5px">الترخيص: مجاني للاستخدام الشخصي</p>
                <p>للحصول على النسخة الكاملة، يرجى التواصل معنا</p>
            </div>
            <div style="text-align:center">
                <p style="margin-bottom:10px;color:var(--muted)">© 2024 المستمر للمحاسبة - جميع الحقوق محفوظة</p>
            </div>
        </div>
    </div>`;
}

// ============================================
// دالة التنقل بين الصفحات
// ============================================
function go(name) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`[data-p="${name}"]`)?.classList.add('active');
    document.getElementById('page-title').textContent = TITLES[name] || name;

    const fns = {
        dashboard,
        products,
        sales,
        purchases,
        pos,
        suppliers,
        customers,
        expenses,
        maintenance,
        reports,
        currency,
        barcode_sale,
        barcode_return,
        count,
        mobile,
        users,
        accounts,
        license,
        settings,
        inventory
    };

    if (fns[name]) {
        fns[name]();
    } else {
        document.getElementById('pc').innerHTML = `<div class="tw"><div class="th"><h3>${name}</h3></div><div style="padding:20px">✅ قسم ${TITLES[name] || name} - جاهز للاستخدام</div></div>`;
    }
}

// ============================================
// تهيئة التطبيق
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // تهيئة قاعدة البيانات
    DB.init();

    // دوال مساعدة لإدارة الفواتير
    function updatePurchaseTotals() {
        const itemRows = document.querySelectorAll('.purchase-item-row');
    let total = 0;

    itemRows.forEach(row => {
        const qty = parseFloat(row.querySelector('.pi-qty').value) || 0;
        const price = parseFloat(row.querySelector('.pi-price').value) || 0;
        total += qty * price;
    });

    document.getElementById('mp-total').value = total;
    }

    function removePurchaseItem(row) {
        row.remove();
        updatePurchaseTotals();
    }

    function updateEditPurchaseTotals() {
        const itemRows = document.querySelectorAll('.edit-purchase-item-row');
        let total = 0;

        itemRows.forEach(row => {
            const qty = parseFloat(row.querySelector('.epi-qty').value) || 0;
            const price = parseFloat(row.querySelector('.epi-price').value) || 0;
            total += qty * price;
        });

        document.getElementById('ep-total').value = total;
    }

    function removeEditPurchaseItem(row) {
        row.remove();
        updateEditPurchaseTotals();
    }

    // تسجيل الدخول التلقائي
    const autoLogin = Auth.login('admin', 'admin123');
    if (autoLogin) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        document.getElementById('u-name').textContent = Auth.currentUser.name;
        document.getElementById('sb-user').textContent = 'مرحباً، ' + Auth.currentUser.name;

        // عرض معلومات الحساب الحالي
        const currentAccount = DB.getCurrentAccount();
        document.getElementById('sb-account').textContent = '🏢 ' + (currentAccount?.name || 'الحساب الافتراضي');

        go('dashboard');
    }
});
