const apiEndpoints = {
    routes: 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=13cbf617-dd0c-40bb-8080-c7993faf3a77',
    guides: 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/{id-маршрута}/guides?api_key=13cbf617-dd0c-40bb-8080-c7993faf3a77',
    orders: 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=13cbf617-dd0c-40bb-8080-c7993faf3a77'
};

const xhr = new XMLHttpRequest();
let body = {};
let currentPage = 1;
const rowsPerPage = 10;
let routesData = [];
let tempBody = 0;
let selectedRouteId = 0;
let selectedGuideId = 0;
const quantity = document.getElementById("quantity");
const check = document.getElementById("check");
const check2 = document.getElementById("check2");
const duration = document.getElementById("duration");
const time = document.getElementById("time");
const date = document.getElementById("date");
const totalCost = document.getElementById("totalCost");
const sendButton = document.getElementById('send');

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


//заполнение таблицы маршрутов
function routesTable(page) {
    const first = (page - 1) * rowsPerPage;
    const last = first + rowsPerPage;
    const routesToDisplay = routesData.slice(first, last);
    const routesTable = document.getElementById('routesTable');

    while (routesTable.rows.length > 1) {
        routesTable.deleteRow(1);
    }

    routesToDisplay.forEach(route => {
        const row = routesTable.insertRow(-1);
        const cell_name = row.insertCell(0);
        const cell_des = row.insertCell(1);
        const cell_main = row.insertCell(2);
        const cell_btn = row.insertCell(3);
        cell_name.innerHTML = route.name;
        cell_des.innerHTML = route.description.length > 80 ? `${route.description.substring(0, 80)}... <a href="#" class="tooltip-wide" data-bs-toggle="tooltip" title="${route.description}">читать полностью</a>` : route.description;
        cell_main.innerHTML = route.mainObject.length > 80 ? `${route.mainObject.substring(0, 80)}... <a href="#" class="tooltip-wide" data-bs-toggle="tooltip" title="${route.mainObject}">читать полностью</a>` : route.mainObject;
        cell_btn.innerHTML = `<button class="btn btn-light" id="selectButton" onclick="selectRoute(event, '${route.name}', '${route.id}')">Выбрать</button>`;
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
}

//создание кнопок пагинации
function createPaginationBtns(totalPages) {
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
            routesTable(currentPage);
        };
        li.appendChild(button); 
        ul.appendChild(li);
    }
    paginationContainer.appendChild(ul);
}

function nextPageBtn() {
    if (currentPage < Math.ceil(routesData.length / rowsPerPage)) {
        currentPage++;
        routesTable(currentPage);
    }
}

function prevPageBtn() {
    if (currentPage > 1) {
        currentPage--;
        routesTable(currentPage);
    }
}

//отображение таблицы и кнопок пагинации
function displayRoutes() {
    sendRequest('GET', apiEndpoints.routes)
    .then(data => {
        routesData = data;
        const totalPages = Math.ceil(routesData.length / rowsPerPage);
        const next = document.getElementById('next');
        const prev = document.getElementById('prev');

        routesTable(currentPage);
        createPaginationBtns(totalPages);
        next.setAttribute('onclick', 'nextPageBtn()');
        prev.setAttribute('onclick', 'prevPageBtn()');
    }) 
}

displayRoutes();

//выбор маршрута
function selectRoute(event, name, id) {
    const table_td = document.querySelectorAll('#routesTable td');
    const table_btn = document.querySelectorAll('#routesTable button');
    const table_a = document.querySelectorAll('#routesTable a');
    const orderBtn = document.getElementById('orderBtn');
    let selected = event.target.parentElement.parentElement;
    var activeGuides = document.querySelector('.guides');
    const modifiedGuidesApi = apiEndpoints.guides.replace('{id-маршрута}', `${id}`);

    table_td.forEach(row => {
        row.style.backgroundColor = '';
    });

    table_btn.forEach(row => {
        row.style.backgroundColor = '';
    });

    table_a.forEach(row => {
        row.style.backgroundColor = '';
    });

    selected.querySelectorAll('*').forEach(child => {
        child.style.backgroundColor = '#c8c8c8';
    });

    orderBtn.classList.add('disabled');
    activeGuides.classList.add('active');
    document.querySelector('#routeName').innerText = `${name}`;

    //заполнение таблицы гидов
    sendRequest('GET', modifiedGuidesApi)
    .then(data => {
        const guidesTable = document.getElementById('guidesTable');

        while (guidesTable.rows.length > 1) {
            guidesTable.deleteRow(1);
        }   
        
        data.forEach(guide => {
            const row = guidesTable.insertRow(-1);
            const cell_photo = row.insertCell(0);
            const cell_name = row.insertCell(1);
            const cell_lang = row.insertCell(2);
            const cell_exp = row.insertCell(3);
            const cell_price = row.insertCell(4);
            const cell_btn = row.insertCell(5);

            cell_photo.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
              </svg>`;
            cell_name.innerHTML = guide.name;
            cell_lang.innerHTML = guide.language;
            cell_exp.innerHTML = guide.workExperience;
            cell_price.innerHTML = `${guide.pricePerHour} руб.`;
            cell_btn.innerHTML = `<button class="btn btn-light" id="selectButton" onclick="selectGuide(event, '${name}', '${guide.name}', '${id}', '${guide.id}', '${guide.pricePerHour}')">Выбрать</button>`;
        });
    })
}

//выбор гида
function selectGuide(event, routeName, guideName, routeId, guideId, price) {
    const table_td = document.querySelectorAll('#guidesTable td');
    const table_btn = document.querySelectorAll('#guidesTable button');
    const table_a = document.querySelectorAll('#guidesTable a');
    const table_svg = document.querySelectorAll('#guidesTable svg');
    const orderBtn = document.getElementById('orderBtn');
    let selected = event.target.parentElement.parentElement;

    table_td.forEach(row => {
        row.style.backgroundColor = '';
    });

    table_btn.forEach(row => {
        row.style.backgroundColor = '';
    });

    table_a.forEach(row => {
        row.style.backgroundColor = '';
    });

    table_svg.forEach(row => {
        row.style.backgroundColor = '';
    });

    selected.querySelectorAll('*').forEach(child => {
        child.style.backgroundColor = '#c8c8c8';
    });

    document.querySelector('#guideName').innerText = `${guideName}`;
    document.querySelector('#routeName1').innerText = `${routeName}`;

    tempBody = price
    orderBtn.classList.remove('disabled');
    storeData();
    selectedRouteId = parseInt(routeId);
    selectedGuideId = parseInt(guideId);
}

//расчет стоимости заявки
function calculatePrice(guideCost) {
    const persons = parseInt(quantity.value);
    let increase = 0;

    if (persons > 5 && persons <= 10) {
        increase = 1000;
    } else if (persons > 10 && persons <= 20) {
        increase = 1500;
    }


    const durationValue = duration.value;
    const selectedDate = new Date(date.value);
    const selectedTime = new Date(`1970-01-01T${time.value}:00`);

    let totalPrice = guideCost * durationValue + increase;

    let optionFirst_value = false;
    if (check.checked) {
        totalPrice *= 0.75;
        optionFirst_value = true;
    }

    let optionSecond_value = check2.checked;
    if (optionSecond_value && durationValue <= 5) {
        totalPrice *= 1.15;
    } else if (optionSecond_value && durationValue > 5 && durationValue <= 10) {
        totalPrice *= 1.25;
    } else if (durationValue > 10) {
        check2.setAttribute("disabled", "disabled");
    }

    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 6 || dayOfWeek === 0) {
        totalPrice = (1.5 * guideCost * durationValue) + increase;
    }

    const hours = ('0' + selectedTime.getHours()).slice(-2);
    const minutes = ('0' + selectedTime.getMinutes()).slice(-2);

    if (selectedTime.getHours() >= 9 && selectedTime.getHours() < 12) {
        totalPrice += 400;
    }

    const date_value = selectedDate.toISOString().split('T')[0];
    const time_value = `${hours}:${minutes}`;
    const duration_value = parseInt(durationValue);
    const persons_value = parseInt(persons);
    const price_value = parseInt(totalPrice);

    totalCost.innerHTML = `${parseInt(totalPrice)} руб.`;

    const object = {
        guide_id: 0,
        route_id: 0,
        date: date_value,
        time: time_value,
        duration: duration_value,
        persons: persons_value,
        price: price_value,
        optionFirst: optionFirst_value,
        optionSecond: optionFirst_value
    }; 
  return object;
}

function storeData() {
    body = calculatePrice(tempBody);
    body.optionFirst = check.checked;
    body.optionSecond = check2.checked;
}

//отправка заявки на сервер
function sendOrder(event) {
    event.preventDefault();
    body.guide_id = selectedGuideId;
    body.route_id = selectedRouteId;
    sendRequest('POST', apiEndpoints.orders, body)
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

//Запрет выбора прошедшей или сегодняшней даты
function dateFormat() {
    var today = new Date();
    var dd = today.getDate() + 1;
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if(dd < 10){
      dd='0' + dd
    } 
    if(mm < 10){
      mm='0' + mm
    } 
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("date").setAttribute("min", today);
    document.getElementById("date").setAttribute("value", today);
}

dateFormat();

quantity.addEventListener('input', storeData);
date.addEventListener('input', storeData);
time.addEventListener('input', storeData);
check.addEventListener('change', storeData);
check2.addEventListener('change', storeData);
duration.addEventListener('change', storeData);    
sendButton.addEventListener('submit', sendOrder);



