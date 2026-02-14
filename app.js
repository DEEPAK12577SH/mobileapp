/* ---------- PWA ---------- */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

/* ---------- DATA ---------- */
let students = JSON.parse(localStorage.getItem("students")) || [];

function save() {
  localStorage.setItem("students", JSON.stringify(students));
}

/* ---------- STUDENTS ---------- */
function addStudent() {
  if (!studentName.value || !studentClass.value) {
    alert("Enter student details");
    return;
  }

  students.push({
    id: Date.now(),
    name: studentName.value,
    class: studentClass.value,
    attendance: [],
    tests: []
  });

  studentName.value = "";
  studentClass.value = "";
  save();
  render();
}

function render() {
  students.innerHTML = "";
  students.forEach(s => {
    students.innerHTML += `
      <div class="student-card">
        <b>${s.name}</b><br>
        Class: ${s.class}<br><br>
        <button onclick="openProfile(${s.id})">View Report</button>
      </div>
    `;
  });
}

/* ---------- PROFILE ---------- */
function openProfile(id) {
  const s = students.find(x => x.id === id);
  students.style.display = "none";
  profile.classList.remove("hidden");

  profile.innerHTML = `
    <button onclick="back()">⬅ Back</button>
    <h3>${s.name} (Class ${s.class})</h3>

    <h4>Attendance</h4>
    <div class="row">
      <input type="date" id="attDate">
      <select id="attStatus">
        <option>Present</option>
        <option>Absent</option>
      </select>
      <button onclick="addAttendance(${id})">Add</button>
    </div>

    <h4>Test Marks</h4>
    <div class="row">
      <input id="testName" placeholder="Test Name">
      <input id="maths" type="number" placeholder="Maths">
      <input id="science" type="number" placeholder="Science">
      <input id="english" type="number" placeholder="English">
    </div>
    <button onclick="addTest(${id})">Save Test</button>

    <canvas id="chart" height="200"></canvas>
    <br>
    <button onclick="downloadPDF(${id})">Download PDF</button>
  `;

  setTimeout(() => drawChart(s), 100);
}

function back() {
  profile.classList.add("hidden");
  students.style.display = "block";
}

/* ---------- ATTENDANCE ---------- */
function addAttendance(id) {
  const s = students.find(x => x.id === id);
  s.attendance.push({ date: attDate.value, status: attStatus.value });
  save();
  openProfile(id);
}

/* ---------- TESTS ---------- */
function addTest(id) {
  const s = students.find(x => x.id === id);
  const m = +maths.value, sc = +science.value, e = +english.value;
  const percent = Math.round((m + sc + e) / 3);
  const grade = percent >= 80 ? "A" : percent >= 60 ? "B" : percent >= 40 ? "C" : "D";

  s.tests.push({ name: testName.value, maths: m, science: sc, english: e, percent, grade });
  save();
  openProfile(id);
}

/* ---------- CHART ---------- */
function drawChart(s) {
  new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: s.tests.map(t => t.name),
      datasets: [
        { label: "Maths", data: s.tests.map(t => t.maths) },
        { label: "Science", data: s.tests.map(t => t.science) },
        { label: "English", data: s.tests.map(t => t.english) }
      ]
    }
  });
}

/* ---------- PDF ---------- */
function downloadPDF(id) {
  const s = students.find(x => x.id === id);
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.text("STUDENT PROGRESS REPORT", 105, 15, { align: "center" });
  pdf.text(`Name: ${s.name}`, 15, 30);
  pdf.text(`Class: ${s.class}`, 15, 40);

  let y = 55;
  s.tests.forEach(t => {
    pdf.text(`${t.name} | ${t.maths} | ${t.science} | ${t.english} | ${t.percent}%`, 15, y);
    y += 7;
  });

  pdf.save(`${s.name}_Report.pdf`);
}

render();
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

// Listen for install availability
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
});

// Install button click
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;

  if (choice.outcome === "accepted") {
    console.log("App installed");
  }

  deferredPrompt = null;
  installBtn.classList.add("hidden");
});

// Hide button after install
window.addEventListener("appinstalled", () => {
  installBtn.classList.add("hidden");
});
