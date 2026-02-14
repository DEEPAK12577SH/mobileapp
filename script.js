let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = null;

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const nameInput = document.getElementById("name");
const subjectInput = document.getElementById("subject");
const marksInput = document.getElementById("marks");
const attendanceInput = document.getElementById("attendance");
const remarksInput = document.getElementById("remarks");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("search");

function renderStudents(filter = "") {
    studentList.innerHTML = "";

    students
        .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach((s, i) => {
            const progress = Math.min((s.marks + s.attendance) / 2, 100);

            studentList.innerHTML += `
            <div class="card">
                <div class="student-name">${s.name}</div>
                <div>📚 Subject: ${s.subject}</div>
                <div>📝 Marks: ${s.marks}</div>
                <div>📅 Attendance: ${s.attendance}%</div>
                <div>💬 ${s.remarks}</div>

                <div class="progress">
                    <div style="width:${progress}%"></div>
                </div>

                <div class="actions">
                    <button class="edit" onclick="editStudent(${i})">Edit</button>
                    <button class="danger" onclick="deleteStudent(${i})">Delete</button>
                </div>
            </div>`;
        });
}

function openModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
    clearForm();
}

function clearForm() {
    nameInput.value = "";
    subjectInput.value = "";
    marksInput.value = "";
    attendanceInput.value = "";
    remarksInput.value = "";
    editIndex = null;
    modalTitle.innerText = "Add Student";
}

function saveStudent() {
    if (!nameInput.value.trim()) {
        alert("Student name is required");
        return;
    }

    const student = {
        name: nameInput.value.trim(),
        subject: subjectInput.value.trim(),
        marks: Number(marksInput.value),
        attendance: Number(attendanceInput.value),
        remarks: remarksInput.value.trim()
    };

    if (editIndex === null) {
        students.push(student);
    } else {
        students[editIndex] = student;
    }

    localStorage.setItem("students", JSON.stringify(students));
    closeModal();
    renderStudents(searchInput.value);
}

function editStudent(index) {
    const s = students[index];
    nameInput.value = s.name;
    subjectInput.value = s.subject;
    marksInput.value = s.marks;
    attendanceInput.value = s.attendance;
    remarksInput.value = s.remarks;

    editIndex = index;
    modalTitle.innerText = "Edit Student";
    openModal();
}

function deleteStudent(index) {
    if (confirm("Delete this student?")) {
        students.splice(index, 1);
        localStorage.setItem("students", JSON.stringify(students));
        renderStudents(searchInput.value);
    }
}

searchInput.addEventListener("input", e => {
    renderStudents(e.target.value);
});

renderStudents();
