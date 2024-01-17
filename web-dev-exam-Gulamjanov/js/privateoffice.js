const apiEndpoints = {
    routes: 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=13cbf617-dd0c-40bb-8080-c7993faf3a77',
    guides: 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/{id-маршрута}/guides?api_key=13cbf617-dd0c-40bb-8080-c7993faf3a77',
    orders: 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=13cbf617-dd0c-40bb-8080-c7993faf3a77'
};

async function getOrders(api) {
    const response = await fetch(api);
    const data = await response.json();
    return data;
}

async function displayOrdersInTable() {
    const orders = await getOrders(apiEndpoints.orders);
    const tableBody = document.getElementById('routesBody');

    // Очистить текущие данные в таблице
    tableBody.innerHTML = '';

    // Заполнить таблицу данными из API
    orders.forEach(async (order) => {
        const row = document.createElement('tr');
        const modifiedGuidesApi = apiEndpoints.guides.replace('{id-маршрута}', `${order.route_id}`);
        const guides = await getOrders(modifiedGuidesApi);
        const routes = await getOrders(apiEndpoints.routes);

        row.innerHTML = `
            <td>${guides.find(guide => guide.id === order.guide_id)?.name || 'Неизвестно'}</td>
            <td>${routes.find(route => route.id === order.route_id)?.name || 'Неизвестно'}</td>
            <td>${order.date}</td>
            <td>${order.time}</td>
            <td>${order.duration} ч. </td>
            <td>${order.persons}</td>
            <td>${order.optionFirst ? 'Есть' : 'Нет'}</td>
            <td>${order.optionSecond ? 'Есть' : 'Нет'}</td>
            <td>${order.price} &#8381</td>
        `;
        tableBody.appendChild(row);
    });
}

// Call the function to display data in the table
displayOrdersInTable();
