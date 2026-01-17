document.getElementById("analyze-button").addEventListener("click", () => {
  const student = {
    name: document.getElementById("student-name").value,
    marks: {
      maths: parseFloat(document.getElementById("maths").value) || 0,
      science: parseFloat(document.getElementById("science").value) || 0,
      english: parseFloat(document.getElementById("english").value) || 0,
    },
  };

  const totalMarks =
    student.marks.maths + student.marks.science + student.marks.english;
  const averageMarks = totalMarks / 3;
  let grade = "";

  if (averageMarks >= 90) grade = "A";
  else if (averageMarks >= 80) grade = "B";
  else if (averageMarks >= 70) grade = "C";
  else if (averageMarks >= 60) grade = "D";
  else grade = "F";

  let result_status = averageMarks >= 40 ? "Pass" : "Fail";

  const resultContainer = document.getElementById("results-table");
  // Define table headers if the table is empty
  const tableHeaders = `
  <thead>
    <tr>
      <th>Student Name</th>
      <th>Total Marks</th>
      <th>Average</th>
      <th>Grade</th>
      <th>Status</th>
    </tr>
  </thead>`;

  // Define the data row (Columns)
  const dataRow = `
<tbody>
    <tr>
        <td>${student.name}</td>
        <td>${totalMarks}</td>
        <td>${averageMarks.toFixed(2)}</td>
        <td>${grade}</td>
        <td style="color: ${result_status === "Fail" ? "red" : "green"}">${result_status}</td>
    </tr>
</tbody>`;

  // Insert into the table
  resultContainer.innerHTML = tableHeaders + dataRow;
});
