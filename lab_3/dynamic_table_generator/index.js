const tableForm = document.getElementById("table-form");
const rowsInput = document.getElementById("rows");
const columnsInput = document.getElementById("columns");
const addRowBtn = document.getElementById("add-row-btn");
const deleteRowBtn = document.getElementById("delete-row-btn");
const highlightEvenBtn = document.getElementById("highlight-even-btn");
const dynamicTable = document.getElementById("dynamic-table");
const statusText = document.getElementById("status-text");

let columnCount = 0;
let highlightEvenRows = false;

function getRowCount() {
  return dynamicTable.rows.length;
}

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.classList.toggle("error", isError);
}

function createCell(rowNumber, columnNumber) {
  const cell = document.createElement("td");
  cell.textContent = `R${rowNumber}C${columnNumber}`;
  return cell;
}

function applyRowHighlighting() {
  const rows = Array.from(dynamicTable.rows);
  rows.forEach((row, index) => {
    const isEvenRow = (index + 1) % 2 === 0;
    row.classList.toggle("even-row-highlight", highlightEvenRows && isEvenRow);
  });
}

function updateActionButtons() {
  const rowCount = getRowCount();
  const hasTableShape = columnCount > 0;

  addRowBtn.disabled = !hasTableShape;
  deleteRowBtn.disabled = !hasTableShape || rowCount === 0;
  highlightEvenBtn.disabled = !hasTableShape || rowCount === 0;
  highlightEvenBtn.textContent = highlightEvenRows
    ? "Remove Highlight"
    : "Highlight Even Rows";
}

function renderTable(rows, columns) {
  dynamicTable.textContent = "";
  columnCount = columns;
  highlightEvenRows = false;

  for (let row = 1; row <= rows; row += 1) {
    const tableRow = document.createElement("tr");
    for (let col = 1; col <= columns; col += 1) {
      tableRow.appendChild(createCell(row, col));
    }
    dynamicTable.appendChild(tableRow);
  }

  rowsInput.value = String(rows);
  applyRowHighlighting();
  updateActionButtons();
  setStatus(`Generated a ${rows} x ${columns} table.`);
}

tableForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const rows = Number.parseInt(rowsInput.value, 10);
  const columns = Number.parseInt(columnsInput.value, 10);

  if (!Number.isInteger(rows) || !Number.isInteger(columns) || rows <= 0 || columns <= 0) {
    setStatus("Rows and columns must be positive whole numbers.", true);
    return;
  }

  renderTable(rows, columns);
});

addRowBtn.addEventListener("click", () => {
  const nextRowNumber = getRowCount() + 1;
  const tableRow = document.createElement("tr");

  for (let col = 1; col <= columnCount; col += 1) {
    tableRow.appendChild(createCell(nextRowNumber, col));
  }

  dynamicTable.appendChild(tableRow);
  rowsInput.value = String(nextRowNumber);

  applyRowHighlighting();
  updateActionButtons();
  setStatus(`Row ${nextRowNumber} added.`);
});

deleteRowBtn.addEventListener("click", () => {
  const rowCount = getRowCount();

  if (rowCount === 0) {
    setStatus("No rows left to delete.", true);
    updateActionButtons();
    return;
  }

  dynamicTable.deleteRow(rowCount - 1);
  rowsInput.value = String(getRowCount());

  applyRowHighlighting();
  updateActionButtons();

  if (getRowCount() === 0) {
    setStatus("All rows deleted. Click Add Row to create a new row.");
    return;
  }

  setStatus(`Row ${rowCount} deleted.`);
});

highlightEvenBtn.addEventListener("click", () => {
  if (getRowCount() === 0) {
    setStatus("Generate a table before highlighting rows.", true);
    return;
  }

  highlightEvenRows = !highlightEvenRows;
  applyRowHighlighting();
  updateActionButtons();
  setStatus(highlightEvenRows ? "Even rows highlighted." : "Even-row highlight removed.");
});

updateActionButtons();
