import constant from '/js/constant.js';

let dataPrice = []
let dataTime = []
let dataContacts = []
let ids = []

const formTitle = document.querySelectorAll('.form-info-title')
const formCall = document.querySelectorAll(".form-call")
const tabBtn = document.querySelectorAll(".information-navigation-button");
const tabBlock = document.querySelectorAll('.tab')
const viewAll = document.querySelector(".view-all")
const collapse = document.querySelector(".collapse")
const monthSelect = document.querySelector("#months")

const swiper = new Swiper('.swiper-container.swiper-price', {
    slidesPerView: 1,
    allowTouchMove: false,
    navigation: {
        nextEl: '.swiper-price-next',
        prevEl: '.swiper-price-prev',
    },
});

monthSelect.addEventListener('change', function () {
    const selectedMonth = this.value;
    const slide = document.getElementById(selectedMonth);

    if (slide && slide.dataset.swiperSlideIndex !== undefined) {
        const slideIndex = parseInt(slide.dataset.swiperSlideIndex, 10);

        if (swiper && typeof swiper.slideTo === 'function') {
            swiper.slideTo(slideIndex);
        } else {
            console.error("Swiper не инициализирован или метод slideTo не найден.");
        }
    } else {
        console.error(`Слайд с id "${selectedMonth}" не найден или не содержит атрибута data-swiper-slide-index.`);
    }
});

function formData (){
    document.querySelectorAll('.form').forEach(form => {
        form.addEventListener('change', function(event) {
            const target = event.target;
            if (target.classList.contains('form-checkIn')) {
                const checkInDateSpan = target.closest('.form-group-input-data').querySelector('.checkInDateSpan');
                checkInDateSpan.textContent = formatDate(target.value);
                checkInDateSpan.style.color = '#4d4d4d';
            }
            if (target.classList.contains('form-checkOut')) {
                const checkOutDateSpan = target.closest('.form-group-input-data').querySelector('.checkOutDateSpan');
                checkOutDateSpan.textContent = formatDate(target.value);
                checkOutDateSpan.style.color = '#4d4d4d';
            }
        });

        form.addEventListener('focusin', function(event) {
            const target = event.target;
            if (target.classList.contains('numberInput')) {
                const numberDropdown = target.closest('.form-group-input-data').querySelector('.numberDropdown');
                numberDropdown.style.display = 'flex';
            }
        });

        form.addEventListener('focusout', function(event) {
            const target = event.target;
            if (target.classList.contains('numberInput')) {
                setTimeout(function() {
                    const numberDropdown = target.closest('.form-group-input-data').querySelector('.numberDropdown');
                    numberDropdown.style.display = 'none';
                }, 200);
            }
        });

        form.querySelectorAll('.numberDropdown .dropdown-item').forEach(item => {
            item.addEventListener('click', function() {
                const numberInput = item.closest('.form-group-input-data').querySelector('.numberInput');
                const numberLabel = item.closest('.form-group-input-data').querySelector('.number-label');
                numberInput.value = item.textContent;
                numberLabel.textContent = `${item.textContent}`;
                numberLabel.style.color = '#4d4d4d';
            });
        });

        form.querySelectorAll('.form-content-continue').forEach(item => {
            const contentDates = form.querySelector('.form-content-dates-arrival')
            const humanData = form.querySelector('.form-human-data')
            item.addEventListener('click', (e) =>{
                e.preventDefault()
                contentDates.classList.add('none');
                humanData.classList.remove('none')
            })
        })
        form.querySelectorAll('.form-button-prev').forEach(item => {
            const contentDates = form.querySelector('.form-content-dates-arrival')
            const humanData = form.querySelector('.form-human-data')
            item.addEventListener('click', (e) =>{
                e.preventDefault()
                contentDates.classList.remove('none');
                humanData.classList.add('none')
            })
        })
    });

    function formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        return `${day}.${month}.${year}`;
    }
}

function onTabclick(){
    tabBtn.forEach(item => {
        item.addEventListener('click', () =>{
            const attribute = item.getAttribute("data-id")
            const sectionTab = document.getElementById(attribute)
            tabBtn.forEach(item => {
                item.classList.remove('active')
            })
            if ( !item.classList.contains('active') ){
                item.classList.add('active')
            }

            tabBlock.forEach(item => {
                item.classList.add("none")
            })
            sectionTab.classList.remove("none")
        })
    });

    formTitle.forEach(item => {
        item.addEventListener("click", () => {
            const dataCall = item.getAttribute('data-call')
            const dataCallId = document.getElementById(dataCall)

            formTitle.forEach(item => {item.classList.remove("active")})

            if (!item.classList.contains('active')){
                item.classList.add("active")
            }


            formCall.forEach(item => {item.classList.add("none")})

            dataCallId.classList.remove('none')

        })     
    });

}

function formOrderCall() {
    document.querySelectorAll('.form-order-call-checkbox').forEach(function(checkbox) {
        const toggleButton = checkbox.querySelector('.toggle-button');
        const titleText = checkbox.querySelector('.selected-title');
        const dataBlock = checkbox.querySelector('.data-block');
        const activeSvg = toggleButton.querySelector('.toggle-button-svg');

        function toggleBlock() {
            dataBlock.classList.toggle('none');
            if (dataBlock.classList.contains('none')) {
                activeSvg.classList.remove('active');
            } else {
                activeSvg.classList.add('active');
            }
        }

        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleBlock();
        });

        titleText.addEventListener('click', function(e) {
            e.preventDefault();
            toggleBlock();
        });

        checkbox.querySelectorAll('.form-order-call-list li').forEach(function(item) {
            item.addEventListener('click', function() {
                titleText.innerText = this.getAttribute('data-value');
                dataBlock.classList.add('none');
                activeSvg.classList.remove('active');
            });
        });
    });
}

document.querySelector(".advantages-button-order").addEventListener('click', (e) =>{
    modalBlock(e)
})

document.querySelector(".order-call").addEventListener('click', (e) =>{
    modalBlock(e)
})

document.querySelector(".reserve-order-call").addEventListener('click', (e) =>{
    modalBlock(e)
})

function modalBlock(e){
    e.preventDefault()
    const flutter =  document.querySelector(".flutter")
    flutter.classList.remove('none')
    document.body.style.overflow = 'hidden';

    document.querySelector('.flutter').addEventListener("click", (e) =>{
        if (e.target.classList[0] === 'flutter' ){
            flutter.classList.add('none')
            document.body.style.overflow = '';
        }
    })
}

document.getElementById('hamburger-menu').addEventListener('click', function () {
    const navList = document.getElementById('nav-list');
    const hamburger = document.getElementById('hamburger-menu');

    if (navList.style.display === 'flex') {
        navList.style.display = 'none';
        hamburger.classList.remove('active');
    } else {
        navList.style.display = 'flex';
        hamburger.classList.add('active');
    }
    const navItems = document.querySelectorAll('.layout-nav-list-el');
    navItems.forEach(function(navItem) {
        navItem.addEventListener('click', function() {
            const navList = document.getElementById('nav-list');
            const hamburger = document.getElementById('hamburger-menu');
            navList.style.display = 'none';
            hamburger.classList.remove('active');
        });
    });
});

viewAll.addEventListener('click', function(){
    document.querySelector(".row.second-row").style.display = 'flex'
    viewAll.classList.add('none')
    collapse.classList.remove('none')

    collapse.addEventListener('click', function(){
        document.querySelector(".row.second-row").style.display = 'none'
        viewAll.classList.remove('none')
        collapse.classList.add('none')
    })

})

// async function createPrice(){
//     await getDataPrice()
//     await addPrice()
// }

// async function createTime(){
//     await getDataTime()
//     await addTime()
// }

// async function createСontacts(){
//     await getContacts()
//     await addContacts()
// }

// async function getDataPrice() {
//     const queryString = `http://${constant}/api/setting/prices`;
//     try {
//         const response = await fetch(queryString)
//         dataPrice = await response.json()
//     }
//     catch (error) {
//         console.error("Error fetching dataPrice:", error);
//     }
// }

// function getPriceById(id) {
//     const item = dataPrice.find(item => item.id === id);
//     return item.price
// }

// async function addPrice() {

//     document.querySelectorAll("#price-list").forEach((item) => {
//         const id = parseInt(item.dataset.month); 
//         const price = getPriceById(id);
//         item.textContent = `${price} ₽`;
//     });
// }

// async function getDataTime() {
//     const queryString = `http://${constant}/api/setting/check-in/out`;
//     try {
//         const response = await fetch(queryString)
//         dataTime = await response.json()
//     }
//     catch (error) {
//         console.error("Error fetching dataTime:", error);
//     }
// }

// async function addTime(){
//     document.querySelectorAll("#checkIn").forEach((item) => {
//         item.textContent = `не раньше ${removeSeconds(dataTime.checkIn)}`
//     })

//     document.querySelectorAll("#checkOut").forEach((item) => {
//         item.textContent = ` не позже ${removeSeconds(dataTime.checkOut)}`
//     })
// }

// async function getContacts() {
//     const queryString = `http://${constant}/api/setting/my/contacts`;
//     try {
//         const response = await fetch(queryString)
//         dataContacts = await response.json()
//     }
//     catch (error) {
//         console.error("Error fetching dataPrice:", error);
//     }
// }

// async function addContacts(){
//     const rawPhoneNumber = `+${dataContacts.phone}`
//     const phoneNumber = rawPhoneNumber.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3-$4-$5');
//     document.querySelectorAll(".layout-info-list-el.phone-contacts").forEach( item => {
//         item.insertAdjacentHTML('beforeend', `<span>${phoneNumber}</span>`)
//     })
//     document.querySelectorAll(".form-self-call-phone").forEach(item => {
//         item.textContent = `${phoneNumber}`
//     })

//     document.querySelectorAll(".mail").forEach(item => {
//         item.textContent = dataContacts.email
//     })

// }

// Функция для удаления секунд из времени
function removeSeconds(time) {
    const parts = time.split(':');
    return parts.slice(0, 2).join(':'); 
}

createСontacts()
createPrice()
createTime()
formOrderCall()
onTabclick()
formData ()

