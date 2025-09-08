// Установите дату события здесь
const eventDate = new Date('November 03, 2025 19:00:00').getTime();
let countdownTimer;

// Таймер обратного отсчета
function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    // Расчет дней, часов, минут и секунд
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Вывод результата в элементы с соответствующими id
    if (document.getElementById("days")) {
        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    }

    // Если время истекло
    if (distance < 0) {
        clearInterval(countdownTimer);
        if (document.getElementById("timer")) {
            document.getElementById("timer").innerHTML = "<h3>Праздник начался!</h3>";
        }
    }
}

// Анимация появления элементов при скролле
function checkScroll() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < windowHeight - 100) {
            section.classList.add('visible');
        }
    });
}

// Обработка формы
function handleForm() {
    const form = document.querySelector('.rsvp-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Отправлено!';
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
        
        // Анимация успешной отправки
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
        
        // Сброс формы через 2 секунды
        setTimeout(() => {
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = 'linear-gradient(135deg, #B22222, #8B0000)';
        }, 2000);
    });
}

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Добавляем параллакс-эффект для фона
function initParallax() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен');
    
    // Запускаем обновление таймера каждую секунду
    countdownTimer = setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // Проверяем видимость секций при загрузке и скролле
    checkScroll();
    window.addEventListener('scroll', checkScroll);
    
    // Инициализируем обработку формы
    handleForm();
    
    // Инициализируем плавную прокрутку
    initSmoothScroll();
    
    // Инициализируем параллакс
    initParallax();
    
    // Добавляем небольшую задержку для анимации появления секций
    setTimeout(checkScroll, 500);
});

// При полной загрузке страницы
window.addEventListener('load', function() {
    console.log('Страница полностью загружена');
});