// 🎯 Smooth scroll для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Закрываем меню на мобильных
            const navList = document.querySelector('.nav-list');
            navList.classList.remove('active');
            
            // Скролл к элементу
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 📱 Бургер-меню
const burgerMenu = document.querySelector('.burger-menu');
const navList = document.querySelector('.nav-list');

burgerMenu.addEventListener('click', () => {
    navList.classList.toggle('active');
    burgerMenu.classList.toggle('active');
    
    // Анимация бургера
    const spans = burgerMenu.querySelectorAll('span');
    if (navList.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'rotate(0) translate(0, 0)';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'rotate(0) translate(0, 0)';
    }
});

// 📱 Закрытие меню при клике вне
document.addEventListener('click', (e) => {
    if (!navList.contains(e.target) && !burgerMenu.contains(e.target) && navList.classList.contains('active')) {
        navList.classList.remove('active');
        burgerMenu.classList.remove('active');
        
        const spans = burgerMenu.querySelectorAll('span');
        spans[0].style.transform = 'rotate(0) translate(0, 0)';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'rotate(0) translate(0, 0)';
    }
});

// 📱 Фиксированный хедер при скролле
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
});

// 📱 Валидация и отправка формы
const appointmentForm = document.getElementById('appointmentForm');
const formLoader = document.getElementById('formLoader');
const formSuccess = document.getElementById('formSuccess');

if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Валидация телефона (простая)
        const phone = document.getElementById('phone').value;
        const phonePattern = /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
        
        if (!phonePattern.test(phone.replace(/\s/g, ''))) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }
        
        // Показать лоадер
        const submitBtn = appointmentForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        
        try {
            // Здесь будет ваш код отправки формы
            // Например, отправка на Telegram бота или на сервер
            
            // Имитация отправки (удалите этот setTimeout в продакшене)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Показать сообщение об успехе
            formSuccess.style.display = 'block';
            appointmentForm.reset();
            
            // Скрыть лоадер
            submitBtn.classList.remove('loading');
            
            // Скрыть сообщение через 5 секунд
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
            
            // Отправить данные в консоль (для тестирования)
            console.log('Форма отправлена:', {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            });
            
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            alert('Произошла ошибка при отправке заявки. Попробуйте снова.');
            submitBtn.classList.remove('loading');
        }
    });
}

// 📱 Маска для телефона
const phoneInput = document.getElementById('phone');

if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = '+7 (' + value;
        }
        if (value.length > 4) {
            value = value.slice(0, 4) + ') ' + value.slice(4);
        }
        if (value.length > 9) {
            value = value.slice(0, 9) + '-' + value.slice(9);
        }
        if (value.length > 12) {
            value = value.slice(0, 12) + '-' + value.slice(12);
        }
        
        e.target.value = value.slice(0, 18);
    });
}

// 📱 Анимация при скролле (появление элементов)
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .review-card, .gallery-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Инициализация анимаций
document.querySelectorAll('.service-card, .review-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// 📱 Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Сайт косметолога Рады Бурнаевой загружен!');
    console.log('💡 Для отправки формы настройте бэкенд или интеграцию с Telegram');
});