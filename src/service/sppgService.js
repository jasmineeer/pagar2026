const sppgRepository = require('../repositories/sppgRepository');
const { sequelize } = require('../models');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit-table');

class SppgService {
    async getProfile(id_user) {
        const profile = await sppgRepository.findProfileWithUser(id_user);
        if (!profile) throw new Error('NOT_FOUND');
        return profile;
    }

    async updateProfile(id_user, updateData) {
        const sppg = await sppgRepository.findSppgByUserId(id_user);
        if (!sppg) throw new Error('NOT_FOUND');

        await sppg.update({
            sppg_name: updateData.sppg_name || sppg.sppg_name,
            sppg_address: updateData.sppg_address || sppg.sppg_address,
        });
        return sppg;
    }

    async getDashboardData(id_user) {
        const sppg = await sppgRepository.findSppgByUserId(id_user);
        if (!sppg) throw new Error('NOT_FOUND');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { reportToday, recentReports } = await sppgRepository.findDashboardReports(
            sppg.id_sppg, 
            today
        );
        const { reviews, totalReviews } = await sppgRepository.findDashboardReviews(sppg.id_sppg);
        const averageEnergy = await sppgRepository.getAverageEnergy(sppg.id_sppg);

        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const currentMonthReports = await sppgRepository.getReportsByDateRange(
            sppg.id_sppg, 
            firstDay, 
            lastDay, 
            ['total_expense']
        );
        
        const totalPengeluaranBulanIni = currentMonthReports.reduce((sum, report) => sum + Number(report.total_expense || 0), 0);
        const sisaAnggaran = (sppg.monthly_budget && sppg.monthly_budget > 0) 
            ? sppg.monthly_budget - totalPengeluaranBulanIni 
            : null;

        return {
            sppg_name: sppg.sppg_name,
            widgets: {
                status_hari_ini: reportToday ? 'SELESAI' : 'BELUM',
                rata_rata_kalori: Math.round(averageEnergy) || 0,
                sisa_anggaran: sisaAnggaran,
                total_laporan_masyarakat: totalReviews
            },
            riwayat_laporan: recentReports,
            laporan_masyarakat: reviews
        };
    }

    async getReportById(id_user, id_report) {
        const sppg = await sppgRepository.findSppgByUserId(id_user);
        if (!sppg) throw new Error('NOT_FOUND');
        
        const report = await sppgRepository.findReportById(id_report, sppg.id_sppg);
        if (!report) throw new Error('NOT_FOUND');
        return report;
    }

    async getPeriodicReports(id_user, start_date, end_date, page = 1, limit = 10) {
        const sppg = await sppgRepository.findSppgByUserId(id_user);
        if (!sppg) throw new Error('NOT_FOUND');

        const offset = (page - 1) * limit;
        const result = await sppgRepository.findPeriodicReportsPaginated(
            sppg.id_sppg, 
            start_date, 
            end_date, 
            limit, 
            offset
        );

        const total_budget_period = result.rows.reduce((sum, report) => sum + Number(report.total_expense || 0), 0);

        return {
            period: { 
                start_date, 
                end_date 
            },
            total_budget_spent: total_budget_period,
            pagination: {
                totalItems: result.count,
                totalPages: Math.ceil(result.count / limit),
                currentPage: page
            },
            reports: result.rows
        };
    }

    async getDailyReports(id_user, page = 1, limit = 10) {
        const sppg = await sppgRepository.findSppgByUserId(id_user);
        if (!sppg) throw new Error('NOT_FOUND');

        const offset = (page - 1) * limit;
        const result = await sppgRepository.findAllDailyReportsPaginated(sppg.id_sppg, limit, offset);

        return {
            pagination: {
                totalItems: result.count,
                totalPages: Math.ceil(result.count / limit),
                currentPage: page
            },
            reports: result.rows
        };
    }

    async createDailyReport(id_user, data, files) {
        const sppg = await sppgRepository.findSppgByUserId(id_user);
        if (!sppg) throw new Error('NOT_FOUND');

        const { budgets, ...reportData } = data;
    
        const parsedBudgets = typeof budgets === 'string' ? JSON.parse(budgets) : budgets;
    
        const grandTotal = parsedBudgets.reduce((sum, b) => sum + Number(b.item_price || 0), 0);

        reportData.id_sppg = sppg.id_sppg;
        reportData.total_expense = grandTotal;

        const t = await sequelize.transaction();
        try {
            const newReport = await sppgRepository.createDailyReportWithTransaction(reportData, parsedBudgets, files || [], t);
            await t.commit();
            return { 
                id_daily_report: newReport.id_daily_report, 
                total_expense: grandTotal 
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updateMonthlyBudget(id_user, monthly_budget) {
        const sppg = await sppgRepository.findSppgByUserId(id_user);
        if (!sppg) throw new Error('NOT_FOUND');

        await sppg.update({ monthly_budget });
        return sppg;
    }

    async getReportData(id_user, start_date, end_date) {
        const sppg = await sppgRepository.findSppgByUserId(id_user);
        if (!sppg) throw new Error('NOT_FOUND');

        return await sppgRepository.getReportsByDateRange(
            sppg.id_sppg,
            start_date,
            end_date
        )
    }

    async generateExcel(id_user, start_date, end_date) {
        const reports = await this.getReportData(id_user, start_date, end_date);
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorkSheet('Laporan Periodik');

        sheet.columns = [
            { header: 'Tanggal', key: 'date', width: 15 },
            { header: 'Nama Menu', key: 'menu', width: 25 },
            { header: 'Waktu Makan', key: 'time', width: 12 },
            { header: 'Total Porsi', key: 'portion', width: 12 },
            { header: 'Energi (kcal)', key: 'energy', width: 12 },
            { header: 'Protein (g)', key: 'protein', width: 10 },
            { header: 'Lemak (g)', key: 'fat', width: 10 },
            { header: 'Karbo (g)', key: 'carb', width: 10 },
            { header: 'Total Biaya (Rp)', key: 'total_expense', width: 15 },
            { header: 'Rincian Belanja', key: 'budget_details', width: 40 },
            { header: 'Link Lampiran', key: 'attachments', width: 40 }
        ];

        reports.forEach(r => {
            const budgetString = r.budgets ? r.budgets.map(b => `- ${b.item_name}: Rp ${b.item-price.toLocaleString('id-ID')}`).join('\n') : '-';

            const attachmentString = r.attachments ? r.attachments.map(a => a.file_url).join('\n') : '-';

            const row = sheet.addRow({
                date: r.date_report,
                menu: r.menu_name,
                time: r.meal_time,
                portion: r.total_portion,
                energy: r.energy,
                protein: r.protein,
                fat: r.fat,
                carb: r.carbohydrate,
                total_expense: r.total_expense,
                budget_details: budgetString,
                attachments: attachmentString
            });

            row.getCell('budget_details').alignment = { wrapText: true, vertical: 'top' };
            row.getCell('attachments').alignment = { wrapText: true, vertical: 'top' };
        });

        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).alignment = { horizontal: 'center' };

        return workbook;
    }

    async generatePDF(id_user, start_date, end_date) {
        const reports = await this.getReportData(id_user, start_date, end_date);
        const doc = new PDFDocument({ margin: 20, size: 'A4', layout: 'landscape' });

        const table = {
            title: `LAPORAN HARIAN SPPG (${start_date} s/d ${end_date})`,
            subtitle: `Menu: ${reports.length > 0 ? 'Data Terlampir' : 'Tidak ada data'}`,
            headers: ['Tanggal', 'Menu', 'Porsi', 'Energi', 'Protein', 'Biaya', 'Item Belanja'],
            rows: reports.map(r => [
                r.date_report,
                r.menu_name,
                r.total_portion,
                `${r.energy} kcal`,
                `${r.protein}g`,
                `Rp ${Number(r.total_expense).toLocaleString('id-ID')}`,
                (r.budgets || []).map(b => b.item_name).join(', ')
            ])
        };

        await doc.table(table, { 
            width: 750,
            prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font('Helvetica').fontSize(8);
            },
        });

        doc.end();
        return doc;
    }
}

module.exports = new SppgService();
