import constant from '/js/constant.js';


let previousLengthNew = 0;
let requestsAll = []
let requestsNew = []
let currentPage = 0;
let page = 0
const size = 3; 

// const csrfToken = document.querySelector('meta[name="_csrf"]').content;

function hideNotification() {
    document.querySelector('.notification').classList.add('none');
}

function showNotification() {
    document.querySelector('.notification').classList.remove('none');
    document.querySelector('.close').addEventListener('click', hideNotification);
    window.setTimeout(hideNotification, 10000);
    document.getElementById('audio').play();
}

async function getRequestNew() {
    const queryString = `http://${constant}/api/clients?page=${page}&size=${size}&sort=id%2Cdesc&isProcessed=false`;
    try {
        const response = await fetch(queryString);
        requestsNew = await response.json();
        let previousLength = requestsNew.totalElements;
        if (previousLength > previousLengthNew && previousLengthNew !== 0) {
            showNotification();
        }
        previousLengthNew = previousLength;
        addRequestNew(page);

        if (requestsNew.totalElements !== 0) {
            document.querySelector(".icon-message").classList.remove('none');
        } else {
            document.querySelector(".icon-message").classList.add('none');
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

setInterval(getRequestNew, 6000);

async function getRequestAll() {
    const queryString = `http://${constant}/api/clients?page=${page}&size=${size}&sort=id%2Cdesc&isProcessed=true`;
    try {
        const response = await fetch(queryString);
        requestsAll = await response.json();
        addRequestAll(page);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function addRequestNew(page) {
    document.querySelector(".new-bids-content").innerHTML = '';

    const getConnectionText = connectionValue => {
        const connections = {
            'BY_PHONE': 'Звонок',
            'BY_WHATS_APP': 'WhatsApp',
            'BY_TELEGRAM': 'Telegram'
        };
        return connections[connectionValue] || connectionValue;
    };

    function formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        return `${day}.${month}.${year}`;
    }

    requestsNew.content.forEach(bid => {
        const createdAt = new Date(bid.createAt);
        const timeWithoutSeconds = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const markup = `
            <div class="new-bids-content-wrapper">
                <div class="new-bids-content-bid">
                    <div class="bid-personal-data">
                        <span class="bid-name">${bid.firstname} ${bid.lastname}</span>
                        <span class="bid-phone">${bid.phone}</span>
                        <span class="bid-call">${getConnectionText(bid.connection)}</span>
                    </div>
                    <div class="bid-date-dates-arrival">
                        <span class="bid-checkIn">Заезд: ${formatDate(bid.checkIn)}</span>
                        <span class="bid-checkOut">Выезд: ${formatDate(bid.checkOut)}</span>
                        <span class="bid-home-number">Дом ${bid.numberHouse}</span>
                    </div>
                    <div class="bid-date-wrapper">
                        <span class="bid-date">${createdAt.toLocaleDateString()}</span>
                        <span class="bid-time">${timeWithoutSeconds}</span>
                    </div>
                </div>
                <button class="handler-request" data-id="${bid.id}"><img src="./img/admin/bids-tick.svg" alt=""></button>
            </div>
        `;
        document.querySelector(".new-bids-content").insertAdjacentHTML("beforeend", markup);
    });

    getId();
    createPagination('pagination-new-bids', requestsNew.totalPages, page, navigateToPageForNewBids);
}

function createPagination(containerId, totalPages, currentPage, navigateFunction) {
    const paginationDiv = document.getElementById(containerId);
    if (!paginationDiv) {
        console.error(`Pagination element for ${containerId} not found`);
        return;
    }
    paginationDiv.innerHTML = '';

    const visiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + visiblePages - 1);

    if (endPage - startPage < visiblePages - 1) {
        startPage = Math.max(0, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('page');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.textContent = i + 1;
        pageButton.addEventListener('click', () => navigateFunction(i));
        paginationDiv.appendChild(pageButton);
    }

    if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        paginationDiv.appendChild(ellipsis);

        const lastPageButton = document.createElement('button');
        lastPageButton.classList.add('page');
        lastPageButton.textContent = totalPages;
        lastPageButton.addEventListener('click', () => navigateFunction(totalPages - 1));
        paginationDiv.appendChild(lastPageButton);
    }
}

function navigateToPageForNewBids(pageNumber) {
    page = pageNumber;
    getRequestNew();
}

async function addRequestAll(page) {
    document.querySelector(".all-bids-content").innerHTML = '';

    const getConnectionText = connectionValue => {
        const connections = {
            'BY_PHONE': 'Звонок',
            'BY_WHATS_APP': 'WhatsApp',
            'BY_TELEGRAM': 'Telegram'
        };
        return connections[connectionValue] || connectionValue;
    };

    function formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        return `${day}.${month}.${year}`;
    }
    
    requestsAll.content.forEach(bid => {
        const createdAt = new Date(bid.createAt);
        const timeWithoutSeconds = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const markup = `
            <div class="all-bids-content-bid">
                <div class="bid-personal-data">
                    <span class="bid-name">${bid.firstname} ${bid.lastname}</span>
                    <span class="bid-phone">${bid.phone}</span>
                    <span class="bid-call">${getConnectionText(bid.connection)}</span>
                </div>
                <div class="bid-date-dates-arrival">
                    <span class="bid-checkIn">Заезд: ${formatDate(bid.checkIn)}</span>
                    <span class="bid-checkOut">Выезд: ${formatDate(bid.checkOut)}</span>
                    <span class="bid-home-number">Дом ${bid.numberHouse}</span>
                </div>
                <div class="bid-date-wrapper">
                    <span class="bid-date">${createdAt.toLocaleDateString()}</span>
                    <span class="bid-time">${timeWithoutSeconds}</span>
                </div>
            </div>
        `;
        document.querySelector(".all-bids-content").insertAdjacentHTML("beforeend", markup);
    });

    createPagination('pagination-all-bids', requestsAll.totalPages, page, navigateToPageForAllBids);
}

async function getId() {
    document.querySelectorAll('.handler-request').forEach(button => {
        button.addEventListener('click', async (event) => {
            const idRequest = event.currentTarget.getAttribute('data-id');
            await handlerRequest(idRequest);
        });
    });
}

async function handlerRequest(clientId) {
    try {
        const response = await fetch(`http://${constant}/api/client/processing?clientId=${clientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRF-TOKEN': csrfToken,
            }
        });

        let processed = requestsNew.content.find(item => item.id == clientId);
        processed.processed = !processed.processed;

        requestsAll.content.unshift(processed);
        window.location.reload();

        addRequestAll();
    } catch (error) {
        console.error('Fetch error:', error);
        return false;
    }
}

function navigateToPageForAllBids(pageNumber) {
    page = pageNumber;
    getRequestAll();
}

getRequestNew();
getRequestAll();
