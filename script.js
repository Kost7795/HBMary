// Redirect from Telegram WebView to browser
if (navigator.userAgent.includes('Telegram')) {
    // Получаем текущий URL
    const currentUrl = window.location.href;
    
    // Создаем страницу-посредник с инструкциями
    const redirectPage = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Открыть в браузере</title>
            <meta charset="UTF-8">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px 20px;
                    background: #000;
                    color: white;
                }
                .container {
                    max-width: 500px;
                    margin: 0 auto;
                }
                .btn {
                    display: inline-block;
                    background: #0088cc;
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    margin: 10px;
                    font-size: 16px;
                }
                .btn:hover {
                    background: #0077b3;
                }
                .instructions {
                    text-align: left;
                    margin: 30px 0;
                    padding: 20px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 8px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📱 Открыть в браузере</h1>
                <p>Для лучшего отображения приглашения откройте сайт в браузере</p>
                
                <div class="instructions">
                    <h3>Инструкция:</h3>
                    <ol>
                        <li>Нажмите кнопку "Открыть в браузере" ниже</li>
                        <li>Или нажмите на три точки в правом верхнем углу</li>
                        <li>Выберите "Open in Browser"</li>
                    </ol>
                </div>
                
                <a href="${currentUrl}" class="btn" target="_blank" id="browserLink">
                    Открыть в браузере
                </a>
                
                <script>
                    // Пытаемся автоматически открыть в браузере
                    setTimeout(function() {
                        const link = document.getElementById('browserLink');
                        link.click();
                    }, 1000);
                    
                    // Альтернативный метод
                    document.addEventListener('click', function() {
                        window.open('${currentUrl}', '_blank');
                    });
                </script>
            </div>
        </body>
        </html>
    `;
    
    // Заменяем содержимое страницы
    document.write(redirectPage);
    document.close();
}

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

// Simple Carousel functionality without clones - FIXED VERSION
let carouselInstances = {};

function initCarousel(tabId = 'women-tab') {
    const currentTab = document.getElementById(tabId);
    if (!currentTab) return;
    
    // Очищаем предыдущие обработчики
    if (carouselInstances[tabId]) {
        carouselInstances[tabId].destroy();
    }
    
    const carouselTrack = currentTab.querySelector('.carousel-track');
    const slides = currentTab.querySelectorAll('.carousel-slide');
    const indicators = currentTab.querySelectorAll('.indicator');
    const prevArrow = currentTab.querySelector('.carousel-arrow-prev');
    const nextArrow = currentTab.querySelector('.carousel-arrow-next');
    const carousel = currentTab.querySelector('.carousel');
    
    if (!carouselTrack || !slides.length) return;
    
    const totalSlides = slides.length;
    let currentSlide = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = null;

    const eventHandlers = {
        mouseDown: null,
        mouseMove: null,
        mouseUp: null,
        touchStart: null,
        touchMove: null,
        touchEnd: null,
        prevClick: null,
        nextClick: null,
        indicatorClicks: [],
        resize: null
    };

    function getSlideWidth() {
        return carousel.offsetWidth;
    }

    function initializePosition() {
        const slideWidth = getSlideWidth();
        currentTranslate = -currentSlide * slideWidth;
        prevTranslate = currentTranslate;
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
        updateIndicators();
        updateArrows(); // ← ДОБАВЛЯЕМ ОБНОВЛЕНИЕ СТРЕЛОК ПРИ ИНИЦИАЛИЗАЦИИ
    }

    function updateIndicators() {
        indicators.forEach(indicator => indicator.classList.remove('active'));
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
    }

    function updateArrows() {
        const slideWidth = getSlideWidth();
        
        // Скрываем стрелку "назад" на первом слайде
        if (prevArrow) {
            if (currentSlide === 0) {
                prevArrow.style.opacity = '0.3';
                prevArrow.style.pointerEvents = 'none';
            } else {
                prevArrow.style.opacity = '1';
                prevArrow.style.pointerEvents = 'auto';
            }
        }
        
        // Скрываем стрелку "вперед" на последнем слайде
        if (nextArrow) {
            if (currentSlide === totalSlides - 1) {
                nextArrow.style.opacity = '0.3';
                nextArrow.style.pointerEvents = 'none';
            } else {
                nextArrow.style.opacity = '1';
                nextArrow.style.pointerEvents = 'auto';
            }
        }
    }

    function goToSlide(slideIndex) {
        const slideWidth = getSlideWidth();
        
        // Ограничиваем индекс слайда
        currentSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));
        
        carouselTrack.style.transition = 'transform 0.3s ease';
        carouselTrack.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
        
        // ОБНОВЛЯЕМ ПЕРЕМЕННЫЕ ПОЗИЦИИ
        currentTranslate = -currentSlide * slideWidth;
        prevTranslate = currentTranslate;
        
        updateIndicators();
        updateArrows(); // ← ДОБАВЛЯЕМ ОБНОВЛЕНИЕ СТРЕЛОК
        
        setTimeout(() => {
            carouselTrack.style.transition = '';
        }, 300);
    }

    function nextSlide() {
        // Сбрасываем стили стрелок перед анимацией
        resetArrowStyles();
        
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(0);
        }
    }

    function prevSlide() {
        // Сбрасываем стили стрелок перед анимацией
        resetArrowStyles();
        
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else {
            goToSlide(totalSlides - 1);
        }
    }

    // Новая функция для сброса стилей стрелок
    function resetArrowStyles() {
        // Принудительно сбрасываем hover-эффект через изменение стилей
        if (prevArrow) {
            prevArrow.style.background = 'rgba(0, 0, 0, 0.6)';
            prevArrow.style.transform = 'translateY(-50%) scale(1)';
        }
        if (nextArrow) {
            nextArrow.style.background = 'rgba(0, 0, 0, 0.6)';
            nextArrow.style.transform = 'translateY(-50%) scale(1)';
        }
        
        // Альтернативный вариант: добавляем небольшой таймаут для сброса
        setTimeout(() => {
            if (prevArrow) {
                prevArrow.style.background = '';
                prevArrow.style.transform = '';
            }
            if (nextArrow) {
                nextArrow.style.background = '';
                nextArrow.style.transform = '';
            }
        }, 300);
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function startDrag(event) {
        if (event.type === 'touchstart') event.preventDefault();
        
        isDragging = true;
        startPos = getPositionX(event);
        carousel.classList.add('grabbing');
        
        carouselTrack.style.transition = 'none';
        animationID = requestAnimationFrame(animation);
    }

    function drag(event) {
        if (!isDragging) return;
        
        const currentPosition = getPositionX(event);
        const dragDistance = currentPosition - startPos;
        currentTranslate = prevTranslate + dragDistance;
    }

    function endDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        carousel.classList.remove('grabbing');
        cancelAnimationFrame(animationID);
        
        const slideWidth = getSlideWidth();
        const dragDistance = currentTranslate - prevTranslate;
        
        // ПРОСТАЯ И НАДЕЖНАЯ ЛОГИКА
        let targetSlide = currentSlide;
        
        if (dragDistance < -50) {
            // Свайп влево - следующий слайд
            targetSlide = currentSlide + 1;
        } else if (dragDistance > 50) {
            // Свайп вправо - предыдущий слайд
            targetSlide = currentSlide - 1;
        }
        
        // Ограничиваем границы
        targetSlide = Math.max(0, Math.min(targetSlide, totalSlides - 1));
        
        // ВСЕГДА переходим к слайду, даже если он не изменился (сбрасываем позицию)
        goToSlide(targetSlide);
    }

    function animation() {
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    }

    function destroy() {
        // Удаляем все обработчики событий
        Object.keys(eventHandlers).forEach(key => {
            const handler = eventHandlers[key];
            if (handler && typeof handler === 'function') {
                if (key === 'mouseDown') carousel.removeEventListener('mousedown', handler);
                if (key === 'mouseMove') window.removeEventListener('mousemove', handler);
                if (key === 'mouseUp') window.removeEventListener('mouseup', handler);
                if (key === 'touchStart') carousel.removeEventListener('touchstart', handler);
                if (key === 'touchMove') window.removeEventListener('touchmove', handler);
                if (key === 'touchEnd') window.removeEventListener('touchend', handler);
                if (key === 'prevClick') prevArrow.removeEventListener('click', handler);
                if (key === 'nextClick') nextArrow.removeEventListener('click', handler);
                if (key === 'resize') window.removeEventListener('resize', handler);
            }
        });
        
        // Удаляем обработчики индикаторов
        eventHandlers.indicatorClicks.forEach((handler, index) => {
            if (indicators[index]) {
                indicators[index].removeEventListener('click', handler);
            }
        });
        
        if (animationID) {
            cancelAnimationFrame(animationID);
        }
    }

    // Сохраняем обработчики
    eventHandlers.mouseDown = startDrag;
    eventHandlers.mouseMove = drag;
    eventHandlers.mouseUp = endDrag;
    eventHandlers.touchStart = startDrag;
    eventHandlers.touchMove = drag;
    eventHandlers.touchEnd = endDrag;
    eventHandlers.prevClick = prevSlide;
    eventHandlers.nextClick = nextSlide;
    eventHandlers.resize = initializePosition;

    // Добавляем обработчики
    carousel.addEventListener('mousedown', eventHandlers.mouseDown);
    window.addEventListener('mousemove', eventHandlers.mouseMove);
    window.addEventListener('mouseup', eventHandlers.mouseUp);

    carousel.addEventListener('touchstart', eventHandlers.touchStart, { passive: false });
    window.addEventListener('touchmove', eventHandlers.touchMove, { passive: false });
    window.addEventListener('touchend', eventHandlers.touchEnd);

    prevArrow.addEventListener('click', eventHandlers.prevClick);
    nextArrow.addEventListener('click', eventHandlers.nextClick);

    // Обработчики для индикаторов
    indicators.forEach((indicator, index) => {
        const handler = () => goToSlide(index);
        eventHandlers.indicatorClicks[index] = handler;
        indicator.addEventListener('click', handler);
    });

    carousel.addEventListener('dragstart', (e) => e.preventDefault());
    window.addEventListener('resize', eventHandlers.resize);

    carouselInstances[tabId] = { destroy };

    // Инициализация
    setTimeout(() => {
        initializePosition();
    }, 100);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initCarousel('women-tab');
});

// Initial check
handleScroll();

// Enhanced fix for both browser and Telegram
document.addEventListener('DOMContentLoaded', function() {
    const bg = document.querySelector('.background-fixed');
    
    function lockBackgroundSize() {
        // Используем максимальные возможные размеры
        const width = Math.max(window.innerWidth, document.documentElement.clientWidth);
        const height = Math.max(window.innerHeight, document.documentElement.clientHeight);
        
        console.log('Locking background to:', width, 'x', height);
        
        // Фиксируем размеры в пикселях
        bg.style.width = width + 'px';
        bg.style.height = height + 'px';
        bg.style.position = 'fixed';
        bg.style.top = '0';
        bg.style.left = '0';
        bg.style.backgroundAttachment = 'fixed';
        
        // Добавляем атрибут чтобы отслеживать
        bg.setAttribute('data-size-locked', 'true');
    }
    
    // Фиксируем размер сразу
    lockBackgroundSize();
    
    // Дополнительная фиксация после полной загрузки
    window.addEventListener('load', lockBackgroundSize);
    
    // Фиксируем при изменении ориентации
    window.addEventListener('orientationchange', function() {
        setTimeout(lockBackgroundSize, 350);
    });
    
    // Блокируем любые изменения размера
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // В Telegram игнорируем resize события после первоначальной установки
            if (!bg.hasAttribute('data-telegram-resize-handled')) {
                lockBackgroundSize();
                bg.setAttribute('data-telegram-resize-handled', 'true');
            }
        }, 50);
    });
    
    // Специфичный фикс для Telegram WebView
    if (navigator.userAgent.includes('Telegram')) {
        console.log('Telegram WebView detected');
        
        // Дополнительная фиксация для Telegram
        setTimeout(() => {
            lockBackgroundSize();
            // Принудительно переустанавливаем фон
            bg.style.backgroundSize = 'cover';
            bg.style.backgroundPosition = 'center';
            bg.style.backgroundRepeat = 'no-repeat';
        }, 500);
        
        // Обработка скролла в Telegram
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Восстанавливаем размер если что-то изменилось
                const currentWidth = parseInt(bg.style.width);
                const currentHeight = parseInt(bg.style.height);
                
                if (currentWidth !== window.innerWidth || currentHeight !== window.innerHeight) {
                    lockBackgroundSize();
                }
            }, 100);
        });
    }
});

// Special Telegram fix with MutationObserver
function setupTelegramBackgroundFix() {
    const bg = document.querySelector('.background-fixed');
    
    // Фиксируем начальный размер
    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;
    
    bg.style.width = initialWidth + 'px';
    bg.style.height = initialHeight + 'px';
    
    // Наблюдаем за изменениями в DOM и стилях
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                // Восстанавливаем наши фиксированные размеры
                setTimeout(() => {
                    bg.style.width = initialWidth + 'px';
                    bg.style.height = initialHeight + 'px';
                }, 10);
            }
        });
    });
    
    // Начинаем наблюдение
    observer.observe(bg, {
        attributes: true,
        attributeFilter: ['style']
    });
    
    // Также блокируем через ResizeObserver
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === bg) {
                bg.style.width = initialWidth + 'px';
                bg.style.height = initialHeight + 'px';
            }
        }
    });
    
    resizeObserver.observe(bg);
    
    return observer;
}

// Инициализация для Telegram
if (navigator.userAgent.includes('Telegram')) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            setupTelegramBackgroundFix();
        }, 1000);
    });
}
