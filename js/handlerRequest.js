import constant from '/js/constant.js';

let requests = [];

class Request {
    constructor(firstname, lastname, phone, connection, checkIn, checkOut, numberHouse) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.phone = phone;
        this.connection = connection;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.numberHouse = numberHouse;
    }
}

function addRequest(form) {
    const connections = {
        'Мне удобней звонок': 'BY_PHONE',
        'Мне удобней WhatsApp': 'BY_WHATS_APP',
        'Мне удобней Telegram': 'BY_TELEGRAM'
    };

    const formInputs = {
        firstname: form.querySelector('#main-name'),
        lastname: form.querySelector('#main-surname'),
        phone: form.querySelector('#main-phone'),
        connection: form.querySelector('.form-order-call-checkbox-title'),
        checkIn: form.querySelector('.form-checkIn'),
        checkOut: form.querySelector('.form-checkOut'),
        numberHouse: form.querySelector('.numberInput')
    };

    const request = new Request(
        formInputs.firstname.value,
        formInputs.lastname.value,
        formInputs.phone.value.replace("+", ''),
        connections[formInputs.connection.textContent.trim()],
        formInputs.checkIn.value,
        formInputs.checkOut.value,
        formInputs.numberHouse.value
    );

    requests.push(request);
    return { request, formInputs };
}

async function sendRequestToAPI(request, formInputs, form) {
    const queryString = `http://${constant}/api/client/create`;

    // Функция для отображения благодарственного сообщения
    function showThankYouModal() {
        const markup = `
            <div class="thanks-modal-wrapper fade-in">
                <div class="thanks-modal">
                    <img class="thanks-modal-img" src="/img/advantages/thanks.svg" alt="Thanks">
                    <div class="thanks-modal-text">
                        <h3 class="thanks-modal-text-title">Благодарим!</h3>
                        <p>После подтверждения мы перезвоним вам</p>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.container').insertAdjacentHTML('afterbegin', markup);

        document.querySelector('.thanks-modal-wrapper').addEventListener('click', (event) => {
            const modal = document.querySelector('.thanks-modal');
            if (modal && !modal.contains(event.target)) {
                const wrapper = document.querySelector('.thanks-modal-wrapper');
                if (wrapper) {
                    wrapper.classList.remove('fade-in');
                    wrapper.classList.add('fade-out');
                    window.setTimeout(() => {
                        wrapper.remove();
                    }, 500);
                }
            }
        });
    }

    // Функция для сброса формы
    function resetForm() {
        form.reset();
        const checkIn = form.querySelector('.checkInDateSpan');
        const checkOut = form.querySelector('.checkOutDateSpan');
        const numberLabel = form.querySelector('.number-label');

        form.querySelector('.form-content-dates-arrival').classList.remove('none');
        form.querySelector('.form-human-data').classList.add('none');

        checkIn.textContent = 'Заезд';
        checkIn.style.color = '#adadad';
        checkOut.textContent = 'Выезд';
        checkOut.style.color = '#adadad';
        numberLabel.textContent = 'Номер';
        numberLabel.style.color = '#adadad';
    }

    try {
        const response = await fetch(queryString, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (response.ok) {
            showThankYouModal();
            resetForm();
        } else {
            console.error(`Error: Received status code ${response.status}`);
            alert("Произошла ошибка при отправке запроса.");
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Произошла ошибка при отправке запроса.");
    }
}

document.querySelectorAll('.form-button-verify').forEach(submit => {
    submit.addEventListener('click', async (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
        const { request, formInputs } = addRequest(form);

        await sendRequestToAPI(request, formInputs, form);
    });
});

    