// عرض تفاصيل النسخة الاحتياطية من ملف DB
function showBackupDetailsFromDb(uint8Array) {
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

    // قراءة الجداول الأساسية
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

    // التحقق من وجود جدول sale_details (هيكل بايثون القديم)
    try {
        const saleDetailsStmt = db.exec(`SELECT * FROM sale_details`);
        if (saleDetailsStmt.length > 0) {
            const columns = saleDetailsStmt[0].columns;
            const values = saleDetailsStmt[0].values;
            
            // إنشاء خريطة لتفاصيل المبيعات
            const saleDetailsMap = {};
            values.forEach(row => {
                const detail = {};
                columns.forEach((col, i) => {
                    detail[col] = row[i];
                });
                const saleId = detail.sale_id;
                if (!saleDetailsMap[saleId]) {
                    saleDetailsMap[saleId] = [];
                }
                saleDetailsMap[saleId].push(detail);
            });

            // إضافة تفاصيل المبيعات إلى كل فاتورة
            backupData.sales.forEach(sale => {
                if (saleDetailsMap[sale.id]) {
                    sale.items = saleDetailsMap[sale.id].map(detail => ({
                        product_id: detail.product_id,
                        quantity: detail.quantity,
                        unit_price: detail.unit_price,
                        total_price: detail.total_price,
                        cost_price: detail.cost_price,
                        profit: detail.profit
                    }));
                }
            });
        }
    } catch (err) {
        console.log('No sale_details table found, using current structure');
    }

    // حفظ البيانات مؤقتاً للاستخدام في الاسترداد
    window.pendingRestoreData = {
        backupData: backupData,
        db: db
    };

    showBackupDetails(backupData, db);
}

// تأكيد الاسترداد
function confirmRestore() {
    if (window.pendingRestoreData && window.pendingRestoreData.backupData) {
        const prefix = DB.getDBPrefix();
        
        // تحويل البيانات من هيكل بايثون القديم إلى الهيكل الحالي
        const backupData = window.pendingRestoreData.backupData;
        
        // التأكد من أن كل فاتورة تحتوي على items
        backupData.sales.forEach(sale => {
            if (!sale.items || !Array.isArray(sale.items)) {
                sale.items = [];
            }
        });
        
        Object.keys(backupData).forEach(key => {
            localStorage.setItem(prefix + key, JSON.stringify(backupData[key]));
        });
        
        cmo();
        setTimeout(() => location.reload(), 500);
    }
}

// عرض تفاصيل النسخة الاحتياطية
function showBackupDetails(backupData, db) {
    // جمع إحصائيات النسخة الاحتياطية
    const stats = {
        users: backupData.users.length,
        products: backupData.products.length,
        sales: backupData.sales.length,
        expenses: backupData.expenses.length,
        maintenance: backupData.maintenance.length,
        purchases: backupData.purchases.length,
        suppliers: backupData.suppliers.length,
        totalSales: backupData.sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0),
        totalProfit: backupData.sales.reduce((sum, sale) => sum + (sale.profit || 0), 0),
        lastSaleDate: backupData.sales.length > 0 ? backupData.sales[backupData.sales.length - 1].sale_date : '-',
        firstSaleDate: backupData.sales.length > 0 ? backupData.sales[0].sale_date : '-'
    };

    // عرض تفاصيل الفواتير
    let salesHtml = '';
    if (backupData.sales.length > 0) {
        salesHtml = `
            <div style="background: var(--bg2); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h4 style="margin-bottom: 15px; color: var(--text);">اخر الفواتير</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: var(--bg3);">
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">رقم الفاتورة</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">التاريخ</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">المبلغ</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">الربح</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">عدد المنتجات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${backupData.sales.slice(-10).reverse().map(sale => {
                            const itemsCount = sale.items && Array.isArray(sale.items) ? sale.items.length : 0;
                            return `
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 10px;">${sale.invoice_number || '-'}</td>
                                <td style="padding: 10px;">${sale.sale_date || '-'}</td>
                                <td style="padding: 10px; font-weight: bold;">${fmt(sale.total_amount || 0)}</td>
                                <td style="padding: 10px; color: var(--accent2);">${fmt(sale.profit || 0)}</td>
                                <td style="padding: 10px;">${itemsCount}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // عرض تفاصيل المنتجات
    let productsHtml = '';
    if (backupData.products.length > 0) {
        productsHtml = `
            <div style="background: var(--bg2); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h4 style="margin-bottom: 15px; color: var(--text);">المنتجات</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: var(--bg3);">
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">اسم المنتج</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">الكمية</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">سعر الشراء</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid var(--border); color: var(--muted);">سعر البيع</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${backupData.products.slice(0, 10).map(product => `
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 10px;">${product.name || '-'}</td>
                                <td style="padding: 10px;">${product.quantity || 0}</td>
                                <td style="padding: 10px;">${fmt(product.purchase_price || 0)}</td>
                                <td style="padding: 10px; font-weight: bold;">${fmt(product.sale_price || 0)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    let html = `
        <div style="padding: 20px;">
            <h3 style="color: var(--accent); margin-bottom: 20px;">تفاصيل النسخة الاحتياطية</h3>

            <div style="background: var(--bg2); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h4 style="margin-bottom: 15px; color: var(--text);">الاحصائيات العامة</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">عدد المستخدمين:</div>
                        <div style="font-size: 16px; font-weight: bold;">${stats.users}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">عدد المنتجات:</div>
                        <div style="font-size: 16px; font-weight: bold;">${stats.products}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">عدد الفواتير:</div>
                        <div style="font-size: 16px; font-weight: bold;">${stats.sales}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">عدد المصروفات:</div>
                        <div style="font-size: 16px; font-weight: bold;">${stats.expenses}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">عدد عمليات الصيانة:</div>
                        <div style="font-size: 16px; font-weight: bold;">${stats.maintenance}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">عدد المشتريات:</div>
                        <div style="font-size: 16px; font-weight: bold;">${stats.purchases}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">عدد الموردين:</div>
                        <div style="font-size: 16px; font-weight: bold;">${stats.suppliers}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">اول فاتورة:</div>
                        <div style="font-size: 16px; font-weight: bold;">${stats.firstSaleDate}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--muted);">اخر فاتورة:</div>
                        <div style="font-size: 16px; font-weight: bold;">${stats.lastSaleDate}</div>
                    </div>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border);">
                    <div style="font-size: 14px; color: var(--muted);">اجمالي المبيعات:</div>
                    <div style="font-size: 28px; font-weight: bold; color: var(--accent);">${fmt(stats.totalSales)}</div>
                    <div style="font-size: 14px; color: var(--accent2); margin-top: 10px;">اجمالي الربح: ${fmt(stats.totalProfit)}</div>
                </div>
            </div>

            ${salesHtml}
            ${productsHtml}
        </div>
    `;

    omo('تفاصيل النسخة الاحتياطية', html, `
        <button class="btn btn-ghost" onclick="cmo()">اغلاق</button>
        <button class="btn btn-success" onclick="confirmRestore()">استعادة النسخة</button>
    `);
}
