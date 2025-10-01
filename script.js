// Mobile Menu Toggle
document.getElementById('mobile-menu').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Countdown Timer
function updateCountdown() {
    const targetDate = new Date('November 3, 2025 19:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Smooth Scrolling with performance optimization
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 70;
            
            // Используем requestAnimationFrame для плавной прокрутки
            const startPosition = window.pageYOffset;
            const distance = offsetTop - startPosition;
            const duration = 800;
            let start = null;
            
            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const percentage = Math.min(progress / duration, 1);
                
                // easing function для более плавной анимации
                const easeInOut = percentage < 0.5 
                    ? 4 * percentage * percentage * percentage 
                    : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
                
                window.scrollTo(0, startPosition + distance * easeInOut);
                
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            }
            
            window.requestAnimationFrame(step);
            
            // Закрытие мобильного меню
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// Fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const nav = document.querySelector('.nav-container');
    const menu = document.querySelector('.nav-links');
    if (!nav.contains(e.target) && menu.classList.contains('active')) {
        menu.classList.remove('active');
    }
});

// Scroll Down Arrow functionality
const scrollDownArrow = document.getElementById('scroll-down-arrow');

// Click event to scroll to next section
scrollDownArrow.addEventListener('click', function() {
    const nextSection = document.getElementById('invitation');
    if (nextSection) {
        const offsetTop = nextSection.offsetTop - 70;
        
        const startPosition = window.pageYOffset;
        const distance = offsetTop - startPosition;
        const duration = 800;
        let start = null;
        
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            const easeInOut = percentage < 0.5 
                ? 4 * percentage * percentage * percentage 
                : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easeInOut);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }
        
        window.requestAnimationFrame(step);
    }
});

// Show/hide arrow based on scroll position
function handleScroll() {
    const heroSection = document.querySelector('.hero');
    const scrollPosition = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;
    
    // Hide arrow when scrolled down more than 20% of hero section
    if (scrollPosition > heroHeight * 0.2) {
        scrollDownArrow.classList.add('hidden');
    } else {
        scrollDownArrow.classList.remove('hidden');
    }
}

// Tabs functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок и панелей
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке и панели
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Переинициализируем карусель для активной вкладки
            setTimeout(() => {
                initCarousel(`${tabId}-tab`);
            }, 50);
        });
    });
}

// Carousel functionality with real-time dragging and infinite loop
function initCarousel(tabId = 'women-tab') {
    const currentTab = document.getElementById(tabId);
    if (!currentTab) return;
    
    const carouselTrack = currentTab.querySelector('.carousel-track');
    const slides = currentTab.querySelectorAll('.carousel-slide');
    const indicators = currentTab.querySelectorAll('.indicator');
    const prevArrow = currentTab.querySelector('.carousel-arrow-prev');
    const nextArrow = currentTab.querySelector('.carousel-arrow-next');
    const carousel = currentTab.querySelector('.carousel');
    
    if (!carouselTrack || !slides.length) return;
    
    let currentSlide = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = null;
    let lastPos = 0;
    let velocity = 0;
    let lastTime = 0;
    const totalSlides = slides.length;

    // Функция для показа слайда с поддержкой зацикливания
    function showSlide(index) {
        currentSlide = index;
        
        // Зацикливание: если вышли за границы, переходим на противоположный конец
        if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
        } else if (currentSlide >= totalSlides) {
            currentSlide = 0;
        }
        
        currentTranslate = currentSlide * -carouselTrack.offsetWidth;
        prevTranslate = currentTranslate;
        
        // Плавный переход
        carouselTrack.style.transition = 'transform 0.3s ease';
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
        
        // Обновляем индикаторы
        indicators.forEach(indicator => indicator.classList.remove('active'));
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
        
        // Убираем transition после анимации
        setTimeout(() => {
            carouselTrack.style.transition = '';
        }, 300);
    }

    // Следующий слайд с зацикливанием
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Предыдущий слайд с зацикливанием
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Получить позицию X
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Начало перетаскивания
    function startDrag(event) {
        if (event.type === 'touchstart') event.preventDefault();
        
        isDragging = true;
        startPos = getPositionX(event);
        lastPos = startPos;
        lastTime = Date.now();
        velocity = 0;
        carousel.classList.add('grabbing');
        
        // Отключаем transition во время перетаскивания
        carouselTrack.style.transition = 'none';
        
        // Запускаем анимацию
        animationID = requestAnimationFrame(animation);
    }

    // Перетаскивание
    function drag(event) {
        if (!isDragging) return;
        
        const currentPosition = getPositionX(event);
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        
        // Рассчитываем скорость для плавности
        if (deltaTime > 0) {
            const deltaX = currentPosition - lastPos;
            velocity = deltaX / deltaTime;
            lastPos = currentPosition;
            lastTime = currentTime;
        }
        
        // Двигаем карточку ровно на столько, насколько двигается палец
        const dragDistance = currentPosition - startPos;
        currentTranslate = prevTranslate + dragDistance;
    }

    // Конец перетаскивания с поддержкой зацикливания
    function endDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        carousel.classList.remove('grabbing');
        cancelAnimationFrame(animationID);
        
        const dragDistance = currentTranslate - prevTranslate;
        
        // Простая логика переключения на 1 слайд с зацикливанием
        let targetSlide = currentSlide;
        
        if (dragDistance < -50) { // Свайп влево
            targetSlide = currentSlide + 1;
        } else if (dragDistance > 50) { // Свайп вправо
            targetSlide = currentSlide - 1;
        }
        // Если движение меньше 50px - остаемся на текущем слайде
        
        // Плавно переходим к выбранному слайду (зацикливание обработается в showSlide)
        showSlide(targetSlide);
    }

    // Анимация
    function animation() {
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    }

    // Обработчики для мыши
    carousel.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);

    // Обработчики для тач-устройств
    carousel.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('touchend', endDrag);

    // Обработчики для стрелок
    prevArrow.addEventListener('click', prevSlide);
    nextArrow.addEventListener('click', nextSlide);

    // Обработчики для индикаторов
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Предотвращаем стандартное поведение браузера при перетаскивании изображений
    carousel.addEventListener('dragstart', (e) => e.preventDefault());

    // Инициализация первого слайда
    showSlide(0);
}

// Инициализируем все после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initCarousel('women-tab');
});

// Initial check
handleScroll();
