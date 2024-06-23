import constant from '/js/constant.js';


let dataPrice = []
let dataTime = []
// Размер страницы (количество заявок на одной странице)

const redactionButtonPriceList = document.querySelector(".redaction-button-price-list")
const redactionButtonDataSetup = document.querySelector(".redaction-button-data-setup")
const buttonSavePassword = document.querySelector(".save-data-setup.password")
const buttonSaveContacts = document.querySelector(".save-data-setup.contacts")
const buttonCancel = document.querySelector(".cancel-data-setup")
const input = document.querySelectorAll(".input")

const titleInfo = document.querySelectorAll('.price-list-title-info')
const checkIn = document.querySelector('.price-list-info.checkIn')
const checkOut = document.querySelector('.price-list-info.checkOut')
// Получаем элементы, которые будут переключаться
const priceListSection = document.getElementById('price');
const personalDataSection = document.querySelector('.data-setup');

// Получаем кнопки для переключения между разделами
const priceListTab = document.querySelector('.redaction-data-title:nth-child(1)');
const personalDataTab = document.querySelector('.redaction-data-title:nth-child(2)');

// const csrfToken = document.querySelector('meta[name="_csrf"]').content;

redactionButtonPriceList.addEventListener('click', () => {
    if (!redactionButtonPriceList.classList.contains("none")){
        redactionButtonPriceList.classList.add('none')
    }

    document.querySelector('.modification-price-list').classList.remove('none')
    titleInfo.forEach(item => {
        item.removeAttribute("readonly")
        item.classList.add("border")
    })

    checkIn.removeAttribute("readonly")
    checkIn.classList.add("border")

    checkOut.removeAttribute("readonly")
    checkOut.classList.add("border")


})

buttonCancel.addEventListener('click', () => {
    document.querySelector('.modification-price-list').classList.add('none')
    redactionButtonPriceList.classList.remove('none')

    titleInfo.forEach(item => {
        item.readOnly = true;
        item.classList.remove("border")
    })

    checkIn.readOnly = true;
    checkIn.classList.remove("border")

    checkOut.readOnly = true;
    checkOut.classList.remove("border")

})

priceListTab.addEventListener('click', () => {
    priceListTab.classList.add('active')
    personalDataTab.classList.remove('active')

    priceListSection.classList.remove('none')
    personalDataSection.classList.add('none')
});

personalDataTab.addEventListener('click', () => {
    personalDataTab.classList.add('active')
    priceListTab.classList.remove('active')

    priceListSection.classList.add('none')
    personalDataSection.classList.remove('none')
});

document.querySelector('.form-tab-content.password').addEventListener('submit', async (event) => {
    event.preventDefault();

    const newPassword = document.querySelector('.input.password').value;

    redactionButtonDataSetup.classList.remove('none')
    buttonSavePassword.classList.add('none')
    buttonSaveContacts.classList.add('none')
    buttonCancel.classList.add('none')
    input.forEach(item => item.readOnly = true)
    document.querySelector(".input.password").value = ''
    try {
        const response = await fetch(`http://${constant}/api/admin/update/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*',
                // 'X-CSRF-TOKEN': csrfToken,
            },
            body: newPassword
        });

        if (response.ok) {
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


async function createPrice(){
    await getDataPrice()
    await addPrice()
}

async function createTime(){
    await getDataTime()
    await addTime()
}

async function getDataPrice() {
    const queryString = `http://${constant}/api/setting/prices`;
    try {
        const response = await fetch(queryString)
        dataPrice = await response.json()
    }
    catch (error) {
        console.error("Error fetching dataPrice:", error);
    }
}

function getPriceById(id) {
    const item = dataPrice.find(item => item.id === id);
    return item.price
}

async function addPrice() {
    document.querySelectorAll(".price-list-title-info").forEach((item) => {
        const id = parseInt(item.dataset.month);
        const price = getPriceById(id);
        item.value = `${price} ₽`;
    });
}

async function getDataTime() {
    const queryString = `http://${constant}/api/setting/check-in/out`;
    try {
        const response = await fetch(queryString)
        dataTime = await response.json()
    }
    catch (error) {
        console.error("Error fetching dataTime:", error);
    }
}

async function addTime(){
    document.querySelectorAll(".price-list-info.checkIn").forEach((item) => {
        item.value = `${removeSeconds(dataTime.checkIn)}`
    })

    document.querySelectorAll(".price-list-info.checkOut").forEach((item) => {
        item.value = `${removeSeconds(dataTime.checkOut)}`
    })
}

async function getSaveInput() {
    const dataToSend = [];

    titleInfo.forEach((item) => {
        const id = item.dataset.month;
        const value = item.value.replace('₽', '').trim();
        dataToSend.push({ id: Number(id), price: Number(value) });
        item.readOnly = true;
        item.classList.remove("border")
    });

    try {
        const response = await fetch(`http://${constant}/api/setting/update/prices`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            const responseData = await response.json();
            document.querySelector('.modification-price-list').classList.add('none')
            redactionButtonPriceList.classList.remove('none')
            // Обновление данных на клиенте после успешного запроса
            updateUIWithNewData(responseData);

        } else {
            console.error('Server error:', response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }

}

function updateUIWithNewData(data) {
    data.forEach((item) => {
        const element = document.querySelector(`[data-month="${item.id}"]`);
        element.value =`${item.price} ₽`;
    })
}

document.querySelector('.save-price-list').addEventListener('click', getSaveInput);

async function getSaveInputTime() {
    const checkInValue = document.querySelector(".price-list-info.checkIn").value;
    const checkOutValue = document.querySelector(".price-list-info.checkOut").value;

    const dataToSendTime = {
        checkIn: checkInValue,
        checkOut: checkOutValue
    };

    checkIn.readOnly = true;
    checkIn.classList.remove("border")

    checkOut.readOnly = true;
    checkOut.classList.remove("border")

    try {
        const response = await fetch(`http://${constant}/api/setting/update/check-in/out`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify(dataToSendTime)
        });

        if (!response.ok) {
            document.querySelector('.modification-price-list').classList.add('none')
            redactionButtonPriceList.classList.remove('none')
            throw new Error('Server error: ' + response.statusText);
        }

        const responseDataTime = await response.json();

        updateUIWithNewDataTime(responseDataTime);

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function updateUIWithNewDataTime(data) {
    document.querySelectorAll('.price-list-info.checkIn').forEach((item) => {
        item.value = removeSeconds(data.checkIn);

    });
    document.querySelectorAll('.price-list-info.checkOut').forEach((item) => {
        item.value = removeSeconds(data.checkOut);
    });
}

// Функция для удаления секунд из времени
function removeSeconds(time) {
    const parts = time.split(':');
    return parts.slice(0, 2).join(':'); // Берем только часы и минуты
}

document.querySelector('.save-price-list').addEventListener('click', getSaveInputTime);

createPrice()
createTime()