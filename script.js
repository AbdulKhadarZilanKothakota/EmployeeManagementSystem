let api = "https://dummyjson.com/users";

let employees = [];
let currentEmployees = [];
let selectedDepartment = "All";


/* ----- DOM ELEMENTS ----- */

const employeeContainer = document.getElementById("employeeContainer");

const searchInput = document.getElementById("searching");

const searchBtn = document.getElementById("searchBtn");

const employeeCount = document.getElementById("employeeCount");

const dashboardEmployeeCount =
    document.getElementById("dashboardEmployeeCount");

const totalSalary =
    document.getElementById("totalSalary");

const averageSalary =
    document.getElementById("averageSalary");

const highestSalary =
    document.getElementById("highestSalary");

const highestEmployeeName =
    document.getElementById("highestEmployeeName");

const message =
    document.getElementById("message");

const employeeForm =
    document.getElementById("employeeForm");

const sortSelect =
    document.getElementById("sortSelect");


/* ----- FETCH EMPLOYEES ----- */

function fetchEmployees() {

    showMessage(
        "Loading employees...",
        "loading"
    );

    fetch(api)

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to fetch employees");
            }

            return response.json();

        })

        .then(data => {

            employees = data.users;

            /* Automatically generate salary */

            employees.forEach(employee => {

                employee.salary =
                    40000 + (employee.id % 6) * 5000;

            });

            currentEmployees = employees;

            displayEmployees(currentEmployees);

            showMessage(
                "Employee data loaded successfully.",
                "success",
                3000
            );

        })

        .catch(error => {

            console.log(error);

            showMessage(
                "Unable to load employee data.<br>Please try again.",
                "delete",
                3000
            );

        })

        .finally(() => {

            console.log("Employee loading completed.");

        });

}


/* ----- DISPLAY EMPLOYEES ----- */

function displayEmployees(users) {

    employeeContainer.innerHTML = "";

    if (users.length === 0) {

        employeeContainer.innerHTML = `
            <p>No employees found.</p>
        `;

        updateEmployeeCount(users);
        calculateSalary(users);

        return;
    }

    users.forEach(employee => {

        const card = document.createElement("div");

        card.className = "card";

        let name;
        let department;
        let email;
        let phone;
        let image;


        /* ----- API EMPLOYEE ----- */

        if (employee.firstName) {

            name = `${employee.firstName} ${employee.lastName}`;

            department = employee.company.department;

            email = employee.email;

            phone = employee.phone;

            image = employee.image;

        }


        /* ----- LOCAL EMPLOYEE ----- */

        else {

            name = employee.name;

            department = employee.department;

            email = employee.email;

            phone = employee.phone || "Not provided";

            image = "https://dummyjson.com/icon/user/128";

        }


        /* EMPLOYEE CARD */

        card.innerHTML = `

            <div class="card-top">

                <img
                    src="${image}"
                    alt="Employee Image"
                >

                <div>

                    <h3>
                        ${name}
                    </h3>

                </div>

            </div>


            <div class="card-details">

                <p>
                    <strong>Age:</strong>
                    ${employee.age}
                </p>


                <p title="${email}">
                    <strong>Email:</strong>
                    ${email}
                </p>


                <p>
                    <strong>Department:</strong>
                    ${department}
                </p>


                <p>
                    <strong>Phone:</strong>
                    ${phone}
                </p>


                <p>
                    <strong>Salary:</strong>
                    ₹${Number(employee.salary).toLocaleString("en-IN")}
                </p>


                <div class="card-buttons">

                    <button
                        class="editBtn"
                        onclick="editEmployee(${employee.id})"
                    >
                        Edit
                    </button>


                    <button
                        class="deleteBtn"
                        onclick="deleteEmployee(${employee.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `;

        employeeContainer.appendChild(card);

    });

    updateEmployeeCount(users);

    calculateSalary(users);

}


/* ----- EMPLOYEE COUNT ----- */

function updateEmployeeCount(users) {

    employeeCount.innerText = users.length;

    dashboardEmployeeCount.innerText = users.length;

}


/* ----- SEARCH ----- */

function searchEmployees() {

    const searchValue =
        searchInput.value.toLowerCase().trim();

    let result = employees.filter(employee => {

        let name;

        if (employee.firstName) {

            name = `${employee.firstName} ${employee.lastName}`;

        }

        else {

            name = employee.name;

        }

        return name.toLowerCase().includes(searchValue);

    });


    /* ----- DEPARTMENT FILTER ----- */

    if (selectedDepartment !== "All") {

        result = result.filter(employee => {

            let department;

            if (employee.firstName) {

                department = employee.company.department;

            }

            else {

                department = employee.department;

            }

            return department === selectedDepartment;

        });

    }

    currentEmployees = result;

    displayEmployees(currentEmployees);

}


/* ----- SEARCH BUTTON ----- */

searchBtn.addEventListener(
    "click",
    searchEmployees
);


/* ----- ENTER KEY ----- */

searchInput.addEventListener(
    "keyup",
    event => {

        if (event.key === "Enter") {
            searchEmployees();
        }

    }
);


/* ----- DEPARTMENT FILTER ----- */

const filterButtons =
    document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            selectedDepartment =
                button.dataset.department;

            searchEmployees();

        }
    );

});


/* ----- ADD EMPLOYEE ----- */

employeeForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        addEmployee();

    }
);


function addEmployee() {

    clearErrors();

    const name =
        document.getElementById("name").value.trim();

    const age =
        Number(document.getElementById("age").value);

    const email =
        document.getElementById("email").value.trim();

    const department =
        document.getElementById("department").value;


    /* ----- AUTO GENERATE SALARY ----- */

    const salary =
        40000 + Math.floor(Math.random() * 6) * 5000;


    const employee = {

        id: Date.now(),

        name: name,

        age: age,

        email: email,

        department: department,

        phone: "Not provided",

        salary: salary

    };


    if (!validateEmployee(employee)) {
        return;
    }

    employees.push(employee);

    currentEmployees = employees;

    displayEmployees(currentEmployees);

    clearForm();

    showMessage(
        "Employee added successfully.",
        "success",
        2500
    );

}


/* ----- VALIDATION ----- */

function validateEmployee(employee) {

    let valid = true;

    if (employee.name === "") {

        document.getElementById("nameError").innerText =
            "Name is required.";

        valid = false;
    }


    if (
        employee.age <= 18 ||
        isNaN(employee.age)
    ) {

        document.getElementById("ageError").innerText =
            "Age must be greater than 18.";

        valid = false;
    }


    if (employee.email === "") {

        document.getElementById("emailError").innerText =
            "Email is required.";

        valid = false;
    }


    if (employee.department === "") {

        document.getElementById("departmentError").innerText =
            "Please select a department.";

        valid = false;
    }

    return valid;

}


/* ----- EDIT EMPLOYEE ----- */

function editEmployee(id) {

    const employee =
        employees.find(employee => employee.id === id);

    if (!employee) {
        return;
    }


    /* ----- CURRENT VALUES ----- */

    const currentName =
        employee.firstName
            ? `${employee.firstName} ${employee.lastName}`
            : employee.name;

    const currentDepartment =
        employee.firstName
            ? employee.company.department
            : employee.department;

    const currentPhone =
        employee.phone || "Not provided";


    /* ----- EDIT NAME ----- */

    const newName =
        prompt(
            "Enter employee name:",
            currentName
        );

    if (newName === null) {
        return;
    }


    /* ----- EDIT AGE ----- */

    const newAge =
        prompt(
            "Enter employee age:",
            employee.age
        );

    if (newAge === null) {
        return;
    }


    /* ----- EDIT EMAIL ----- */

    const newEmail =
        prompt(
            "Enter employee email:",
            employee.email
        );

    if (newEmail === null) {
        return;
    }


    /* ----- EDIT DEPARTMENT ----- */

    const newDepartment =
        prompt(
            "Enter department:",
            currentDepartment
        );

    if (newDepartment === null) {
        return;
    }


    /* ----- EDIT PHONE ----- */

    const newPhone =
        prompt(
            "Enter phone number:",
            currentPhone
        );

    if (newPhone === null) {
        return;
    }


    /* ----- UPDATE API EMPLOYEE ----- */

    if (employee.firstName) {

        const nameParts =
            newName.trim().split(" ");

        employee.firstName = nameParts[0];

        employee.lastName =
            nameParts.slice(1).join(" ");

        employee.age = Number(newAge);

        employee.email = newEmail.trim();

        employee.company.department =
            newDepartment.trim();

        employee.phone = newPhone.trim();

    }


    /* ----- UPDATE LOCAL EMPLOYEE ----- */

    else {

        employee.name = newName.trim();

        employee.age = Number(newAge);

        employee.email = newEmail.trim();

        employee.department =
            newDepartment.trim();

        employee.phone = newPhone.trim();

    }


    /* ----- REFRESH CARDS ----- */

    displayEmployees(currentEmployees);

    showMessage(
        "Employee updated successfully.",
        "success",
        2500
    );

}


/* ----- DELETE EMPLOYEE ----- */

function deleteEmployee(id) {

    employees =
        employees.filter(
            employee => employee.id !== id
        );

    searchEmployees();

    showMessage(
        "Employee deleted successfully.",
        "delete",
        2500
    );

}


/* ----- SALARY CALCULATION ----- */

function calculateSalary(users) {

    if (users.length === 0) {

        totalSalary.innerText = "₹0";

        averageSalary.innerText = "₹0";

        highestSalary.innerText = "₹0";

        highestEmployeeName.innerText = "No Employee";

        return;
    }


    /* ----- TOTAL SALARY ----- */

    const total =
        users.reduce(
            (sum, employee) => {

                return sum + Number(employee.salary);

            },
            0
        );


    /* ----- AVERAGE SALARY ----- */

    const average =
        total / users.length;

    totalSalary.innerText =
        `₹${total.toLocaleString("en-IN")}`;

    averageSalary.innerText =
        `₹${Math.round(average).toLocaleString("en-IN")}`;

    displayHighestSalary(users);

}


/* ----- HIGHEST SALARY ----- */

    function displayHighestSalary(users) {

    const highest =
        Math.max(
            ...users.map(
                employee => Number(employee.salary)
            )
        );

    const highestEmployees =
        users.filter(
            employee =>
                Number(employee.salary) === highest
        );

    const names =
        highestEmployees.map(employee => {

            if (employee.firstName) {

                return `${employee.firstName} ${employee.lastName}`;

            }

            return employee.name;

        });

    highestSalary.innerText =
        `₹${highest.toLocaleString("en-IN")}`;

    highestEmployeeName.innerHTML =
        names.join("<br>");

}


/* ----- SORT ----- */

sortSelect.addEventListener(
    "change",
    () => {

        sortEmployees(sortSelect.value);

    }
);


function sortEmployees(type) {

    let sortedEmployees =
        [...currentEmployees];


    /* ----- SORT BY NAME ----- */

    if (type === "name") {

        sortedEmployees.sort(
            (a, b) => {

                let nameA =
                    a.firstName
                        ? `${a.firstName} ${a.lastName}`
                        : a.name;

                let nameB =
                    b.firstName
                        ? `${b.firstName} ${b.lastName}`
                        : b.name;

                return nameA.localeCompare(nameB);

            }
        );

    }


    /* ----- SORT BY AGE ----- */

    else if (type === "age") {

        sortedEmployees.sort(
            (a, b) => {

                return a.age - b.age;

            }
        );

    }


    /* ----- SORT BY SALARY ----- */

    else if (type === "salary") {

        sortedEmployees.sort(
            (a, b) => {

                return b.salary - a.salary;

            }
        );

    }


    currentEmployees = sortedEmployees;

    displayEmployees(currentEmployees);

}


/* ----- MESSAGE ----- */

function showMessage(
    text,
    type,
    duration = 0
) {

    message.innerHTML = text;

    if (type === "loading") {

        message.className = "message";

    }

    else if (type === "success") {

        message.className =
            "message message-success";

    }

    else {

        message.className =
            "message message-delete";

    }


    if (duration > 0) {

        setTimeout(
            () => {

                message.innerHTML = "";

                message.className = "message";

            },
            duration
        );

    }

}


/* ----- CLEAR FORM ----- */

function clearForm() {

    document.getElementById("name").value = "";

    document.getElementById("age").value = "";

    document.getElementById("email").value = "";

    document.getElementById("department").value = "";

}


/* ----- CLEAR ERRORS ----- */

function clearErrors() {

    document.getElementById("nameError").innerText = "";

    document.getElementById("ageError").innerText = "";

    document.getElementById("emailError").innerText = "";

    document.getElementById("departmentError").innerText = "";

}


/* ----- DATE & TIME ----- */

function updateDateTime() {

    const now = new Date();

    const date =
        now.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }
        );

    document.getElementById("today").innerText =
        `Today: ${date}`;

    document.getElementById("time").innerText =
        `Time: ${time}`;

}


updateDateTime();

setInterval(
    updateDateTime,
    1000
);


/* ----- START ----- */

fetchEmployees();

