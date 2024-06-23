import constant from '/js/constant.js';


let contacts = []

const buttonRedaction = document.querySelector(".redaction-button-data-setup")
const buttonCancel = document.querySelector(".cancel-data-setup")
const formSavePassword = document.querySelector(".form-tab-content.password")
const buttonSavePassword = document.querySelector(".save-data-setup.password")
const formSaveContacts = document.querySelector(".form-tab-content.contacts")
const buttonSaveContacts = document.querySelector(".save-data-setup.contacts")
const input = document.querySelectorAll(".input")

// const csrfToken = document.querySelector('meta[name="_csrf"]').content;


buttonRedaction.addEventListener('click', () => {
    if (!buttonRedaction.classList.contains("none")){
        buttonRedaction.classList.add('none')
    }
    buttonSavePassword.classList.remove('none')
    buttonSaveContacts.classList.remove('none')
    buttonCancel.classList.remove('none')

    input.forEach(item => item.removeAttribute("readonly"))

})

buttonCancel.addEventListener('click', () => {
    buttonRedaction.classList.remove('none')
    buttonSavePassword.classList.add('none')
    buttonSaveContacts.classList.add('none')
    buttonCancel.classList.add('none')
    input.forEach(item => item.readOnly = true)
})

formSaveContacts.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Функция для нормализации номера телефона
    function normalizePhoneNumber(phoneNumber) {
        if (phoneNumber.startsWith('+7')) {
            return '7' + phoneNumber.slice(2);
        } else if (phoneNumber.startsWith('8')) {
            return '7' + phoneNumber.slice(1);
        }
        return phoneNumber;
    }

    const phoneInput = document.querySelector(".input.phone").value;
    const emailInput = document.querySelector(".input.email").value;

    // Нормализация номера телефона
    const normalizedPhone = normalizePhoneNumber(phoneInput);
    console.log("🚀 ~ formSaveContacts.addEventListener ~ dataContacts.normalizedPhone:", normalizedPhone)

    const dataContacts = {
        phone: normalizedPhone,
        email: emailInput
    };

    try {
        const response = await fetch(`http://${constant}/api/setting/update/my/contacts`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify(dataContacts)
        });

        if (response.ok) {
            const responseData = await response.json();

            buttonSavePassword.classList.add('none');
            buttonSaveContacts.classList.add('none');
            buttonCancel.classList.add('none');
            buttonRedaction.classList.remove('none');
            input.forEach(item => item.readOnly = true)


        } else {
            console.error('Server error:', response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
});

async function createTime(){
    await getContacts()
    await addContacts()
}

async function getContacts() {
    const queryString = `http://${constant}/api/setting/my/contacts`;
    try {
        const response = await fetch(queryString)
        contacts = await response.json()
    }
    catch (error) {
        console.error("Error fetching dataPrice:", error);
    }
}

async function addContacts(){
    document.querySelector(".input.phone").value = `${contacts.phone}`
    document.querySelector(".input.email").value = contacts.email
}

function updateUIWithNewData(data) {
    data.forEach((item) => {
        const element = document.querySelector(`[data-month="${item.id}"]`);
        element.value =`${item.price} ₽`;
    })
}

createTime()