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

// Carousel functionality with true infinite loop - FIXED VERSION
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
    
    // Правильный подсчет слайдов
    const totalSlides = slides.length; // Всего слайдов (включая клоны)
    const realSlidesCount = totalSlides - 2; // Реальные слайды (без клонов)
    
    console.log(`Total slides: ${totalSlides}, Real slides: ${realSlidesCount}`);
    
    let currentSlide = 1; // Начинаем с первого реального слайда
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = null;
    let lastPos = 0;
    let velocity = 0;
    let lastTime = 0;
    let slideWidth = 0;

    // Функция для получения актуальной ширины слайда
    function getSlideWidth() {
        return carousel.offsetWidth || carouselTrack.offsetWidth;
    }

    // Инициализация позиции
    function initializePosition() {
        slideWidth = getSlideWidth();
        currentTranslate = -currentSlide * slideWidth;
        prevTranslate = currentTranslate;
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
        
        updateIndicators();
    }

    // Обновление индикаторов
    function updateIndicators() {
        const realIndex = getRealSlideIndex(currentSlide);
        console.log(`Current slide: ${currentSlide}, Real index: ${realIndex}`);
        
        indicators.forEach(indicator => indicator.classList.remove('active'));
        if (indicators[realIndex]) {
            indicators[realIndex].classList.add('active');
        }
    }

    // Получить реальный индекс слайда
    function getRealSlideIndex(virtualIndex) {
        if (virtualIndex === 0) return realSlidesCount - 1; // Клон последнего -> последний реальный
        if (virtualIndex === totalSlides - 1) return 0; // Клон первого -> первый реальный
        return virtualIndex - 1; // Реальные слайды
    }

    // Получить виртуальный индекс для реального слайда
    function getVirtualSlideIndex(realIndex) {
        return realIndex + 1; // Реальные слайды начинаются с индекса 1
    }

    // Плавный переход к слайду
    function smoothTransitionToSlide(targetSlide) {
        slideWidth = getSlideWidth();
        currentTranslate = -targetSlide * slideWidth;
        
        carouselTrack.style.transition = 'transform 0.3s ease';
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
        
        currentSlide = targetSlide;
        prevTranslate = currentTranslate;
        
        updateIndicators();
        
        setTimeout(() => {
            carouselTrack.style.transition = '';
            
            // Бесшовный переход между клонами и реальными слайдами
            if (currentSlide === 0) {
                // Перешли на клон последнего слайда - прыгаем к реальному последнему
                currentSlide = realSlidesCount;
                currentTranslate = -currentSlide * slideWidth;
                carouselTrack.style.transition = 'none';
                carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
                prevTranslate = currentTranslate;
                updateIndicators();
            } else if (currentSlide === totalSlides - 1) {
                // Перешли на клон первого слайда - прыгаем к реальному первому
                currentSlide = 1;
                currentTranslate = -currentSlide * slideWidth;
                carouselTrack.style.transition = 'none';
                carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
                prevTranslate = currentTranslate;
                updateIndicators();
            }
        }, 300);
    }

    // Следующий слайд
    function nextSlide() {
        const nextSlideIndex = currentSlide + 1;
        console.log(`Next slide: ${nextSlideIndex}`);
        smoothTransitionToSlide(nextSlideIndex);
    }

    // Предыдущий слайд
    function prevSlide() {
        const prevSlideIndex = currentSlide - 1;
        console.log(`Prev slide: ${prevSlideIndex}`);
        smoothTransitionToSlide(prevSlideIndex);
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
        
        slideWidth = getSlideWidth();
        carouselTrack.style.transition = 'none';
        animationID = requestAnimationFrame(animation);
    }

    // Перетаскивание
    function drag(event) {
        if (!isDragging) return;
        
        const currentPosition = getPositionX(event);
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime > 0) {
            const deltaX = currentPosition - lastPos;
            velocity = deltaX / deltaTime;
            lastPos = currentPosition;
            lastTime = currentTime;
        }
        
        const dragDistance = currentPosition - startPos;
        currentTranslate = prevTranslate + dragDistance;
    }

    // Конец перетаскивания
    function endDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        carousel.classList.remove('grabbing');
        cancelAnimationFrame(animationID);
        
        const dragDistance = currentTranslate - prevTranslate;
        const slideWidth = getSlideWidth();
        
        let targetSlide = currentSlide;
        
        // Определяем направление свайпа
        if (dragDistance < -50) { // Свайп влево
            targetSlide = currentSlide + 1;
        } else if (dragDistance > 50) { // Свайп вправо
            targetSlide = currentSlide - 1;
        }
        
        console.log(`Drag ended, target slide: ${targetSlide}`);
        smoothTransitionToSlide(targetSlide);
    }

    // Анимация
    function animation() {
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    }

    // Обработчики событий
    carousel.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);

    carousel.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('touchend', endDrag);

    prevArrow.addEventListener('click', prevSlide);
    nextArrow.addEventListener('click', nextSlide);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            const virtualIndex = getVirtualSlideIndex(index);
            console.log(`Indicator clicked: ${index} -> virtual: ${virtualIndex}`);
            smoothTransitionToSlide(virtualIndex);
        });
    });

    carousel.addEventListener('dragstart', (e) => e.preventDefault());

    // Обработчик изменения размера окна
    window.addEventListener('resize', initializePosition);

    // Инициализация
    setTimeout(() => {
        initializePosition();
    }, 100);
}

// Инициализируем все после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initCarousel('women-tab');
});

// Initial check
handleScroll();
