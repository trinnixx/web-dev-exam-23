const requestURL = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=13cbf617-dd0c-40bb-8080-c7993faf3a77';
const requestURL2 = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/{id-маршрута}/guides?api_key=13cbf617-dd0c-40bb-8080-c7993faf3a77';
const requestURL3 = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=13cbf617-dd0c-40bb-8080-c7993faf3a77';

const xhr = new XMLHttpRequest()
function sendRequest (method, url, body = null) {
    return new Promise((resolve, reject) => {
        xhr.open(method, url)
        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            } else {  
                resolve(xhr.response)
            }
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }

        if (body && typeof body === 'object') {
            const encodedData = Object.keys(body)
                .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key]))
                .join('&');
            xhr.send(encodedData);
        } else {
            xhr.send();
        }
    })
}

const rowsPerPage = 10;
let currentPage = 1;
let routesData = [];

function displayDataOnPage(page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const dataToDisplay = routesData.slice(startIndex, endIndex);

    const routesTable = document.getElementById('routesTable');
    while (routesTable.rows.length > 1) {
        routesTable.deleteRow(1);
    }

    dataToDisplay.forEach(route => {
        const row = routesTable.insertRow(-1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        cell1.innerHTML = route.name;
        cell2.innerHTML = route.description.length > 150 ? `${route.description.substring(0, 150)} <a href="#" class="tooltip-wide" data-bs-toggle="tooltip" title="${route.description}">читать полностью</a>` : route.description;
        cell3.innerHTML = route.mainObject.length > 150 ? `${route.mainObject.substring(0, 150)} <a href="#" class="tooltip-wide" data-bs-toggle="tooltip" title="${route.mainObject}">читать полностью</a>` : route.mainObject;
        cell4.innerHTML = `<button class="btn btn-light" id="selectButton" onclick="selectRoute(event, '${route.name}', '${route.id}')">Выбрать</button>`;
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
}

function createPaginationButtons(totalPages) {
    const paginationContainer = document.getElementById('paginationButtons');
    paginationContainer.innerHTML = '';

    const ul = document.createElement('ul');
    ul.classList.add('pagination');
    ul.className += ' justify-content-center';
  
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-link');
        button.onclick = function() {
            currentPage = i;
            displayDataOnPage(currentPage);
        };
        li.appendChild(button); 
        ul.appendChild(li);
    }

    paginationContainer.appendChild(ul);
}

function loadDataAndDisplay() {
    sendRequest('GET', requestURL)
    .then(data => {
        routesData = data;
        const totalPages = Math.ceil(routesData.length / rowsPerPage);
        createPaginationButtons(totalPages);
        displayDataOnPage(currentPage);
    }) 
}

function nextPage() {
    if (currentPage < Math.ceil(routesData.length / rowsPerPage)) {
        currentPage++;
        displayDataOnPage(currentPage);
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayDataOnPage(currentPage);
    }
}

loadDataAndDisplay();

const prev = document.getElementById('prev');
prev.setAttribute('onclick', 'prevPage()');
const next = document.getElementById('next');
next.setAttribute('onclick', 'nextPage()');

function selectRoute(event, name, id) {
    const tableRows1 = document.querySelectorAll('#routesTable td');
    tableRows1.forEach(row => {
        row.style.backgroundColor = '';
    });

    const tableRows2 = document.querySelectorAll('#routesTable button');
    tableRows2.forEach(row => {
        row.style.backgroundColor = '';
    });

    const tableRows3 = document.querySelectorAll('#routesTable a');
    tableRows3.forEach(row => {
        row.style.backgroundColor = '';
    });

    let selectedEl = event.target.parentElement.parentElement;
    selectedEl.querySelectorAll('*').forEach(child => {
        child.style.backgroundColor = '#c8c8c8';
    });

    const orderBtn = document.getElementById('orderBtn');
    orderBtn.classList.add('disabled');

    var active = document.querySelector('.guides');
    active.classList.add('active');
    document.querySelector('#routeName').innerText = `${name}`;

    const modifiedURL2 = requestURL2.replace('{id-маршрута}', `${id}`);
    sendRequest('GET', modifiedURL2)

    .then(data => {
        const guidesTable = document.getElementById('guidesTable');
        while (guidesTable.rows.length > 1) {
            guidesTable.deleteRow(1);
        }   
        data.forEach(guide => {
            const row = guidesTable.insertRow(-1);
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
            const cell6 = row.insertCell(5);

            cell1.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
              </svg>`;
            cell2.innerHTML = guide.name;
            cell3.innerHTML = guide.language;
            cell4.innerHTML = guide.workExperience;
            cell5.innerHTML = `${guide.pricePerHour} руб.`;
            cell6.innerHTML = `<button class="btn btn-light" id="selectButton" onclick="selectGuide(event, '${name}', '${guide.name}', '${id}', '${guide.id}', '${guide.pricePerHour}')">Выбрать</button>`;
        });
    })
}

let body = {};
let guide1 = 0;
let selectedRouteId = 0;
let selectedGuideId = 0;
const input = document.getElementById("quantity");
const check = document.getElementById("check");
const select = document.getElementById("duration");
const time = document.getElementById("time");
const date = document.getElementById("date");
const output = document.getElementById("totalCost");

function selectGuide(event, routeName, guideName, routeId, guideId, price) {
    const tableRows1 = document.querySelectorAll('#guidesTable td');
    tableRows1.forEach(row => {
        row.style.backgroundColor = '';
    });

    const tableRows2 = document.querySelectorAll('#guidesTable button');
    tableRows2.forEach(row => {
        row.style.backgroundColor = '';
    });

    const tableRows3 = document.querySelectorAll('#guidesTable a');
    tableRows3.forEach(row => {
        row.style.backgroundColor = '';
    });

    const tableRows4 = document.querySelectorAll('#guidesTable svg');
    tableRows4.forEach(row => {
        row.style.backgroundColor = '';
    });

    let selectedEl = event.target.parentElement.parentElement;
    selectedEl.querySelectorAll('*').forEach(child => {
        child.style.backgroundColor = '#c8c8c8';
    });

    const orderBtn = document.getElementById('orderBtn');
    orderBtn.classList.remove('disabled');
    document.querySelector('#guideName').innerText = `${guideName}`;
    document.querySelector('#routeName1').innerText = `${routeName}`;
    
    guide1 = price
    calculateAndStore();
    selectedRouteId = parseInt(routeId);
    selectedGuideId = parseInt(guideId);
}

function sendOrder(event) {
    event.preventDefault();
    body.guide_id = selectedGuideId;
    body.route_id = selectedRouteId;
    sendRequest('POST', requestURL3, body)
    .then(response => {
        console.log('Order placed successfully:', response);
        const alert = document.getElementById('alert');
        alert.classList.add('active');
        setTimeout(() => {
            alert.classList.remove('active');
        }, 5000);
    })
    .catch(error => {
        console.error('Error placing order:', error);
    });
    console.log(body);
}

const sendButton = document.getElementById('send');
sendButton.addEventListener('submit', sendOrder);

input.addEventListener('input', calculateAndStore);
date.addEventListener('input', calculateAndStore);
time.addEventListener('input', calculateAndStore);
check.addEventListener('change', calculateAndStore);
select.addEventListener('change', calculateAndStore);

function calculateAndStore() {
    body = calculate(guide1);
}


function calculate(guideCost) {
    const inputValue = parseInt(input.value);
    let increase = 0;

    if (inputValue>5 && inputValue<=10) {
        increase = 1000;
    } else if (inputValue>10 && inputValue<=20) {
        increase = 1500;
    }

    const selectValue = select.value;
    const selectedDate = new Date(date.value);
    const selectedTime = new Date(`1970-01-01T${time.value}:00`);

    let totalValue = guideCost * selectValue + increase;

    let optionFirst_value = false;
    if (check.checked) {
        totalValue *= 0.75;
        optionFirst_value = true;
    }

    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 6 || dayOfWeek === 0) {
        totalValue = (1.5 * guideCost * selectValue) + increase;
    }

    const hours = ('0' + selectedTime.getHours()).slice(-2);
    const minutes = ('0' + selectedTime.getMinutes()).slice(-2);

    if (selectedTime.getHours() >= 9 && selectedTime.getHours() < 12) {
        totalValue += 400;
    }

    const date_value = selectedDate.toISOString().split('T')[0];
    const time_value = `${hours}:${minutes}`;

    const duration_value = parseInt(selectValue);
    const persons_value = parseInt(inputValue);
    const price_value = parseInt(totalValue);

    output.innerHTML = `${totalValue} руб.`;

    const object = {
        guide_id: 0,
        route_id: 0,
        date: date_value,
        time: time_value,
        duration: duration_value,
        persons: persons_value,
        price: price_value,
        optionFirst: optionFirst_value,
        optionSecond: false,
        student_id: 10800
    }; 
  return object;
}













    