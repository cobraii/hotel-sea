const monthItems = document.querySelectorAll(".month");

const swiper = new Swiper('.swiper-container.swiper-price', {
    slidesPerView: 1,
    allowTouchMove: false,
    navigation: {
        nextEl: '.swiper-price-next',
        prevEl: '.swiper-price-prev',
    },
});


function monthSlider() {
    monthItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            // Получаем значение data-month выбранного элемента
            const monthData = item.dataset.month;

            monthItems.forEach(item => item.classList.remove("active"));
            // Устанавливаем активный класс для выбранного элемента
            item.classList.add("active");

            // Переключение на соответствующий слайд
            swiper.slideTo(index);
        });
    });
}

swiper.on('slideChange', function () {
    const activeSlideIndex = swiper.activeIndex;
    const monthItems = document.querySelectorAll(".month");

    monthItems.forEach((item, index) => {
        if (index === activeSlideIndex) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
});



new Swiper('.swiper-container.swiper-photo', {
    loop: true, 
    slidesPerView: 1,
    centeredSlides: true,
    navigation: {
        nextEl: '.swiper-photo-next',
        prevEl: '.swiper-photo-prev',
    },
    pagination: {
        el: '.swiper-photo-pagination',
        clickable: true,
    },
});


new Swiper('.swiper-container.swiper-advantages', {
    slidesPerView: 1,
    allowTouchMove: true,   
    pagination: {
        el: '.swiper-advantages-pagination',
        clickable: true,
    },
    breakpoints: {
        1199: {
            allowTouchMove: false,   
            slidesPerView: 1,
            slidesPerGroup: 1,
        }
    }
});

monthSlider()
