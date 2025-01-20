interface TableOptions {
  startX?: number;
  startY?: number;
  rowHeight?: number;
  headerFontSize?: number;
  cellPadding?: number;
  columnWidths?: number[];
}

// Function to generate a table in PDF
export function generateTable(doc, data, columns, options: TableOptions = {}) {
  const startX = options.startX || 50; // Starting X coordinate of the table
  const startY = options.startY || 200; // Starting Y coordinate of the table
  const rowHeight = options.rowHeight || 20; // Row height
  const headerFontSize = options.headerFontSize || 12; // Font size for headers
  const cellPadding = options.cellPadding || 5; // Padding inside cells
  const columnWidths = options.columnWidths || [100, 100, 100]; // Column widths

  let currentY = startY;

  // Draw table headers
  doc.fontSize(headerFontSize).fillColor("white").font("Helvetica-Bold");

  doc
    .rect(
      startX,
      currentY,
      columnWidths.reduce((a, b) => a + b, 0),
      rowHeight
    )
    .fillAndStroke("#3b5998", "#000"); // Header background color

  for (let i = 0; i < columns.length; i++) {
    const cellX = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
    doc.text(columns[i], cellX + cellPadding, currentY + cellPadding, {
      width: columnWidths[i] - 2 * cellPadding,
      align: "center",
      valign: "center",
    });
  }

  currentY += rowHeight;

  // Draw table rows
  doc.font("Helvetica").fillColor("black").fontSize(10);

  data.forEach((row, rowIndex) => {
    for (let i = 0; i < columns.length; i++) {
      const cellX =
        startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.text(row[columns[i]], cellX + cellPadding, currentY + cellPadding, {
        width: columnWidths[i] - 2 * cellPadding,
        align: "center",
      });
    }

    // Optional: Add alternating row background color
    if (rowIndex % 2 === 1) {
      doc
        .rect(
          startX,
          currentY,
          columnWidths.reduce((a, b) => a + b, 0),
          rowHeight
        )
        .fill("#f2f2f2");
    }

    // Draw cell borders
    doc
      .rect(
        startX,
        currentY,
        columnWidths.reduce((a, b) => a + b, 0),
        rowHeight
      )
      .stroke();

    currentY += rowHeight;
  });
}

