let batchCounter = 1;
let selectedCell;

function openBatchPopup() {
document.getElementById("batchPopup").style.display = "block";
}

function closeBatchPopup() {
document.getElementById("batchPopup").style.display = "none";
}
function getLightColor() {
// Generate R, G, B values in the range (150-255) to ensure a light color
let r = Math.floor(Math.random() * 106) + 150; // 150 to 255
let g = Math.floor(Math.random() * 106) + 150;
let b = Math.floor(Math.random() * 106) + 150;
return `rgb(${r}, ${g}, ${b})`;
}

function addRows() {
let table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];
let year = document.getElementById("year").value;
let semester = document.getElementById("semester").value;
let batchName = document.getElementById("batchName").value;
let sections = ["A section", "B section", "C section"];
let rowGroup = [];
let color = getLightColor();
let currentRow_number = table.rows.length + 1;
console.log("Number Of Rows: "+currentRow_number);
for (let i = 0; i < 3; i++) {
    let newRow = table.insertRow();
    rowGroup.push(newRow);
    
    for (let j = 0; j < 11; j++) {
        let cell = newRow.insertCell(j);
        cell.style.backgroundColor = color;
        if (j === 0) {
            cell.innerHTML = `${year} Year<br>${semester} Semester<br>${sections[i]}<br>(${batchName})`;
        }
        else if(j === 10)
        {
            cell.classList.add("report-cell");
            cell.setAttribute("id", `rowReport${i + currentRow_number}`);
            console.log(`rowReport${i + currentRow_number}`);
        }
        else {
            cell.innerHTML = ``;
            cell.onclick = function () { openPopup(this); };
        }
    }
}

let deleteCell = rowGroup[0].insertCell(11);
let deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.onclick = function () { deleteRows(rowGroup); };
deleteCell.appendChild(deleteButton);
closeBatchPopup();
}

function openPopup(cell) {
if (cell.classList.contains("report-cell")) return; 
selectedCell = cell; // Store the clicked cell
document.getElementById("popup").style.display = "block";

// Pre-fill with existing values (if available)
let existingData = cell.innerText.split("\n");
document.getElementById("courseCode").value = existingData[0] || "";

// Reset dynamic fields
document.getElementById("teacherContainer").innerHTML = "";
document.getElementById("roomContainer").innerHTML = "";

if (existingData[1]) {
    existingData[1].split("/").forEach(teacher => addTeacher(teacher));
} else {
    addTeacher(); // Add one empty teacher input
}

if (existingData[2]) {
    existingData[2].split("/").forEach(room => addRoom(room));
} else {
    addRoom(); // Add one empty room input
}
//document.getElementById("expandCell").checked = selectedCell.hasAttribute("colspan") && selectedCell.getAttribute("colspan") === "3";
}

function closePopup() {
document.getElementById("popup").style.display = "none";
}

function addTeacher(value = "") {
let teacherContainer = document.getElementById("teacherContainer");
let newTeacherInput = document.createElement("label");
newTeacherInput.innerHTML = `Teacher: <input type="text" name="teacher" value="${value}"> 
    <button type="button" onclick="removeElement(this)">Remove</button>`;
teacherContainer.appendChild(newTeacherInput);
}

function addRoom(value = "") {
let roomContainer = document.getElementById("roomContainer");
let newRoomInput = document.createElement("label");
newRoomInput.innerHTML = `Room Number: <input type="text" name="room" value="${value}"> 
    <button type="button" onclick="removeElement(this)">Remove</button>`;
roomContainer.appendChild(newRoomInput);
}

function removeElement(button) {
button.parentElement.remove();
}

function saveCell() {
if (!selectedCell) return;

let courseCode = document.getElementById("courseCode").value;
let teachers = Array.from(document.getElementsByName("teacher")).map(input => input.value).filter(Boolean);
let rooms = Array.from(document.getElementsByName("room")).map(input => input.value).filter(Boolean);
//let expandCell = document.getElementById("expandCell").checked;
let lastChar = courseCode.trim().slice(-1); // Get the last character
let lastDigit = parseInt(lastChar, 10); // Convert to number
let row = selectedCell.parentElement;
let cellIndex = Array.from(row.children).indexOf(selectedCell);

if (!isNaN(lastDigit)) {
    if (lastDigit % 2 === 0) {
        let lab_positions = [1,4,7];
        if (!lab_positions.includes(cellIndex)) {
            alert(`Sessional courses are only allowed in 1st, 4th, and 7th periods.`);
            closePopup();
            return;
        }
        selectedCell.setAttribute("colspan", "3");
        let next1 = row.children[cellIndex + 1];
        let next2 = row.children[cellIndex + 2];

        if (next1){
            next1.innerText = `${courseCode},${teachers.join("/")},${rooms.join("/")}`;
            next1.style.display = "none";
        }
        if (next2){
            next2.innerText = `${courseCode},${teachers.join("/")},${rooms.join("/")}`;
            next2.style.display = "none";
        }
    } else {
        selectedCell.setAttribute("colspan", "1");
        // Restore hidden cells
        let next1 = row.children[cellIndex + 1];
        let next2 = row.children[cellIndex + 2];
        if (next1)
        {
            if(next1.style.display == "none")
            {
                next1.style.display = "table-cell";
                next1.innerText = "";
            }
        }
        if (next2)
        {
            if(next2.style.display == "none")
            {
                next2.style.display = "table-cell";
                next2.innerText = "";
            }
        }
    }
    selectedCell.innerText = `${courseCode}\n${teachers.join("/")}\n${rooms.join("/")}`;
    checkDuplicates();
    closePopup();
} else if(!courseCode)
{
    selectedCell.setAttribute("colspan", "1");
    // Restore hidden cells
    let next1 = row.children[cellIndex + 1];
    let next2 = row.children[cellIndex + 2];
    if (next1)
    {
        if(next1.style.display == "none")
        {
            next1.style.display = "table-cell";
            next1.innerText = "";
        }
    }
    if (next2)
    {
        if(next2.style.display == "none")
        {
            next2.style.display = "table-cell";
            next2.innerText = "";
        }
    }
    selectedCell.innerText = "";
    checkDuplicates();
    closePopup();
}
else {
    alert("Invalid course code. Please enter a valid course code.");
    closePopup()
    return;
}
}

function deleteRows(rows) {
let userResponse = confirm("Are you sure you want to delete this item?");
if (userResponse) {
    rows.forEach(row => row.remove());
    alert("Item deleted successfully!");
} else {
    alert("Delete operation canceled.");
}
}

function checkDuplicates() {
let colwise_table = document.getElementById("routineTable");
let rowwise_table = document.getElementById("dynamicTable");
let rows = rowwise_table.rows;
let columns = 10;
console.log("Duplicate: "+rows.length);
for (let i = 1; i < rows.length; i++) {
    let firstLineSet = new Set();
    let firstLineDuplicates = [];

    for (let j = 1; j < 10; j++) {
        if(rows[i].cells[j].style.display == "none")
        {
            continue;
        }
        let cellText = rows[i].cells[j].innerText.split("\n");
        let firstLine = cellText[0] || "";

        if (firstLine && firstLineSet.has(firstLine)) firstLineDuplicates.push(firstLine);
        else firstLineSet.add(firstLine);
    }
    console.log(`rowReport${i}`);
    document.getElementById(`rowReport${i}`).innerText = `${[...new Set(firstLineDuplicates)].join(", ")}`;
}

for (let j = 1; j < 10; j++) {
    let secondLineSet = new Set();
    let thirdLineSet = new Set();
    let secondLineDuplicates = [];
    let thirdLineDuplicates = [];

    for (let i = 1; i < rows.length; i++) {
        console.log(i+" "+j+" "+rows[i].cells[j].innerText);
        let cellText = ""; 
        if(rows[i].cells[j].style.display == "none")
        {
            cellText = rows[i].cells[j].innerText.split(",");
        }else{
            cellText = rows[i].cells[j].innerText.split("\n");
        }  
        let secondLine = cellText[1] || "";
        let thirdLine = cellText[2] || "";

        if (secondLine) {
            secondLine.split("/").forEach(teacher => {
                if (secondLineSet.has(teacher)) secondLineDuplicates.push(teacher);
                else secondLineSet.add(teacher);
            });
        }
        if (thirdLine) {
            thirdLine.split("/").forEach(room => {
                if (thirdLineSet.has(room)) thirdLineDuplicates.push(room);
                else thirdLineSet.add(room);
            });
        }
    }

    document.getElementById(`colReport${j}`).innerText = `T:[${[...new Set(secondLineDuplicates)].join(", ")}]\nR:[${[...new Set(thirdLineDuplicates)].join(", ")}]`;
            }
}