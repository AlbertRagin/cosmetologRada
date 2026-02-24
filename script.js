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
// const appointmentForm = document.getElementById('appointmentForm');
const formLoader = document.getElementById('formLoader');
const formSuccess = document.getElementById('formSuccess');

// if (appointmentForm) {
//     appointmentForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
        
//         // Валидация телефона (простая)
//         const phone = document.getElementById('phone').value;
//         const phonePattern = /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
        
//         if (!phonePattern.test(phone.replace(/\s/g, ''))) {
//             alert('Пожалуйста, введите корректный номер телефона');
//             return;
//         }
        
//         // Показать лоадер
//         const submitBtn = appointmentForm.querySelector('button[type="submit"]');
//         submitBtn.classList.add('loading');
        
//         try {
//             // Здесь будет ваш код отправки формы
//             // Например, отправка на Telegram бота или на сервер
            
//             // Имитация отправки (удалите этот setTimeout в продакшене)
//             await new Promise(resolve => setTimeout(resolve, 2000));
            
//             // Показать сообщение об успехе
//             formSuccess.style.display = 'block';
//             appointmentForm.reset();
            
//             // Скрыть лоадер
//             submitBtn.classList.remove('loading');
            
//             // Скрыть сообщение через 5 секунд
//             setTimeout(() => {
//                 formSuccess.style.display = 'none';
//             }, 5000);
            
//             // Отправить данные в консоль (для тестирования)
//             console.log('Форма отправлена:', {
//                 name: document.getElementById('name').value,
//                 phone: document.getElementById('phone').value,
//                 city: document.getElementById('city').value,
//                 service: document.getElementById('service').value,
//                 message: document.getElementById('message').value
//             });
            
//         } catch (error) {
//             console.error('Ошибка отправки формы:', error);
//             alert('Произошла ошибка при отправке заявки. Попробуйте снова.');
//             submitBtn.classList.remove('loading');
//         }
//     });

// 📩 Отправка формы в Telegram
const appointmentForm = document.getElementById('appointmentForm');

if (appointmentForm) {
    // Слушаем событие отправки формы
    appointmentForm.addEventListener('submit', async function(e) {
        // Предотвращаем стандартную отправку формы
        e.preventDefault();
        
        // Получаем кнопку отправки и сообщение об успехе
        const submitBtn = appointmentForm.querySelector('button[type="submit"]');
        const formSuccess = document.getElementById('formSuccess');
        
        // Валидация телефона
        // Получаем значение поля телефона
        const phoneInput = document.getElementById('phone');
        const phone = phoneInput.value;
        
        // Регулярное выражение для проверки формата: +7 (999) 999-99-99
        // ^ - начало строки
        // \+7 - символ +7
        // \(\d{3}\) - три цифры в скобках
        // \d{3}-\d{2}-\d{2} - три цифры, тире, две цифры, тире, две цифры
        // $ - конец строки
        const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        
        // Проверяем, соответствует ли телефон шаблону
        if (!phonePattern.test(phone)) {
            alert('Пожалуйста, введите корректный номер телефона');
            phoneInput.focus(); // Устанавливаем фокус на поле телефона
            return; // Прерываем выполнение функции
        }
        
        // Собираем данные из формы в объект FormData
        // FormData автоматически собирает все поля формы с атрибутом name
        const formData = new FormData(appointmentForm);
        
        // Показать лоадер на кнопке
        submitBtn.classList.add('loading');
        submitBtn.disabled = true; // Блокируем кнопку, чтобы нельзя было отправить дважды
        
        // Пытаемся отправить данные
        try {
            // Отправляем запрос на сервер (файл telegram.php)
            const response = await fetch('telegram.php', {
                method: 'POST',           // Метод отправки: POST
                body: formData            // Тело запроса: данные формы
            });
            
            // Ждём ответ от сервера и парсим его как JSON
            const result = await response.json();
            
            // Проверяем, успешная ли отправка
            if (result.success) {
                // Показываем сообщение об успехе
                formSuccess.style.display = 'block';
                formSuccess.textContent = result.message || 'Заявка отправлена! Я свяжусь с вами в течение 2 часов.';
                
                // Очищаем форму
                appointmentForm.reset();
                
                // Скрываем сообщение об успехе через 5 секунд
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            } else {
                // Если сервер вернул ошибку
                alert(result.message || 'Произошла ошибка. Попробуйте снова.');
            }
            
        } catch (error) {
            // Если произошла ошибка при отправке (нет интернета, сервер не отвечает и т.д.)
            console.error('Ошибка отправки:', error);
            
            // Показываем пользователю понятное сообщение
            alert('Ошибка подключения. Попробуйте снова или позвоните: +7 (917) 289-16-33');
        } finally {
            // В любом случае (успех или ошибка) убираем лоадер
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false; // Разблокируем кнопку
        }
    });
}


// 📱 Маска для телефона
// const phoneInput = document.getElementById('phone');

// if (phoneInput) {
//     phoneInput.addEventListener('input', function (e) {
//         let value = e.target.value.replace(/\D/g, '');
        
//         if (value.length > 0) {
//             value = '+7 (' + value;
//         }
//         if (value.length > 4) {
//             value = value.slice(0, 4) + ') ' + value.slice(4);
//         }
//         if (value.length > 9) {
//             value = value.slice(0, 9) + '-' + value.slice(9);
//         }
//         if (value.length > 12) {
//             value = value.slice(0, 12) + '-' + value.slice(12);
//         }
        
//         e.target.value = value.slice(0, 18);
//     });
// }

// 📱 Маска для телефона (исправленная)

// 📱 Маска телефона (гарантированно рабочая)
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    
    if (!phoneInput) return;
    
    // Форматирование при вводе
    phoneInput.addEventListener('input', function(e) {
        // Сохраняем позицию курсора
        const selectionStart = e.target.selectionStart;
        
        // Убираем всё кроме цифр
        let value = e.target.value.replace(/\D/g, '');
        
        // Ограничиваем до 11 цифр (7 + 10 цифр)
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        // Форматируем
        let formatted = '+7';
        
        if (value.length > 1) {
            formatted += ' (' + value.substring(1, 4);
        }
        if (value.length >= 4) {
            formatted += ') ' + value.substring(4, 7);
        }
        if (value.length >= 7) {
            formatted += '-' + value.substring(7, 9);
        }
        if (value.length >= 9) {
            formatted += '-' + value.substring(9, 11);
        }
        
        // Устанавливаем значение
        e.target.value = formatted;
        
        // Восстанавливаем позицию курсора (простой вариант)
        setTimeout(() => {
            e.target.selectionStart = e.target.selectionEnd = formatted.length;
        }, 0);
    });
    
    // Валидация при потере фокуса
    phoneInput.addEventListener('blur', function() {
        const isValid = this.value.length === 18; // +7 (XXX) XXX-XX-XX = 18 символов
        
        if (this.value && !isValid) {
            this.style.borderColor = '#ff4444';
            this.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.2)';
        } else {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        }
    });
    
    // Сброс стилей при фокусе
    phoneInput.addEventListener('focus', function() {
        this.style.borderColor = '';
        this.style.boxShadow = '';
    });
});


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

// 🎯 Аккордеон для вопросов
document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            
            // Закрываем все открытые
            accordionHeaders.forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('show'));
            
            // Открываем текущий (если был закрыт)
            if (!isActive) {
                header.classList.add('active');
                content.classList.add('show');
                
                // Плавная прокрутка к открытому вопросу
                setTimeout(() => {
                    const elementPosition = header.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - 100;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 350);
            }
        });
    });
    
    // Автооткрытие вопроса из ссылки (например: #faq?question=3)
    const urlParams = new URLSearchParams(window.location.search);
    const questionParam = urlParams.get('question');
    
    if (questionParam && accordionHeaders[questionParam - 1]) {
        setTimeout(() => {
            accordionHeaders[questionParam - 1].click();
        }, 500);
    }
});    