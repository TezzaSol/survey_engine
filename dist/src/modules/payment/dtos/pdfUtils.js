"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTable = void 0;
function generateTable(doc, data, columns, options = {}) {
    const startX = options.startX || 50;
    const startY = options.startY || 200;
    const rowHeight = options.rowHeight || 20;
    const headerFontSize = options.headerFontSize || 12;
    const cellPadding = options.cellPadding || 5;
    const columnWidths = options.columnWidths || [100, 100, 100];
    let currentY = startY;
    doc.fontSize(headerFontSize).fillColor("white").font("Helvetica-Bold");
    doc
        .rect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight)
        .fillAndStroke("#3b5998", "#000");
    for (let i = 0; i < columns.length; i++) {
        const cellX = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.text(columns[i], cellX + cellPadding, currentY + cellPadding, {
            width: columnWidths[i] - 2 * cellPadding,
            align: "center",
            valign: "center",
        });
    }
    currentY += rowHeight;
    doc.font("Helvetica").fillColor("black").fontSize(10);
    data.forEach((row, rowIndex) => {
        for (let i = 0; i < columns.length; i++) {
            const cellX = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
            doc.text(row[columns[i]], cellX + cellPadding, currentY + cellPadding, {
                width: columnWidths[i] - 2 * cellPadding,
                align: "center",
            });
        }
        if (rowIndex % 2 === 1) {
            doc
                .rect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight)
                .fill("#f2f2f2");
        }
        doc
            .rect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight)
            .stroke();
        currentY += rowHeight;
    });
}
exports.generateTable = generateTable;
//# sourceMappingURL=pdfUtils.js.map