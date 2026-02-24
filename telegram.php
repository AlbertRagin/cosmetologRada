<?php
/**
 * Скрипт отправки заявок в Telegram
 * Косметолог Рада Бурнаева
 */

// ⚙️ НАСТРОЙКИ — ЗАМЕНИ НА СВОИ ДАННЫЕ!
$botToken = "7782475847:AAGfyXPbDUPkskNK3UEPvOkiSIh5sRWHnTg"; // Токен от @BotFather
$chatId = "214298737"; // Твой ID из @userinfobot

// 📧 Опционально: резервная почта для копий
$backupEmail = "raginalbert@gmail.com"; // Твоя почта

// 🔒 Защита от прямого доступа
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed');
}

// 📥 Получаем данные из формы
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$city = trim($_POST['city'] ?? '');
$service = trim($_POST['service'] ?? '');
$message = trim($_POST['message'] ?? '');

// ✅ Валидация
if (empty($name) || empty($phone) || empty($city)) {
    http_response_code(400);
    die('Заполните все обязательные поля');
}

// 📝 Формируем текст сообщения
$text = "🔔 <b>Новая заявка на сайте</b>\n\n";
$text .= "👤 <b>Имя:</b> $name\n";
$text .= "📱 <b>Телефон:</b> $phone\n";
$text .= "📍 <b>Город:</b> $city\n";

// Словарь услуг для красивого отображения
$servicesDict = [
    'teen' => 'Уход за подростковой кожей',
    'rf' => 'RF-лифтинг Secret RF',
    'cryo' => 'Криолиполиз',
    'laser' => 'Лазерная эпиляция Soprano Titanium',
    'cleaning' => 'Чистка лица',
    'peeling' => 'Пилинги',
    'emscella' => 'Кресло Кегеля (EMSELLA)',
    'massage' => 'Спа массаж головы',
    'biorevital' => 'Биоревитализация',
    'prp' => 'PRP-терапия (плазмотерапия)',
    'tattoo' => 'Удаление тату, татуажа',
    'papilloma' => 'Удаление папиллом, родинок',
    'meso' => 'Мезотерапия',
    'vessels' => 'Удаление сосудистых сеток',
    'baroforez' => 'Барофорез',
    'ems' => 'EMS-тренировки',
    'indiba' => 'Аппарат INDIBA',
    'course' => 'Курс ухода (абонемент)',
    'consult' => 'Консультация косметолога'
];

if ($service && isset($servicesDict[$service])) {
    $text .= "💅 <b>Услуга:</b> {$servicesDict[$service]}\n";
} elseif ($service) {
    $text .= "💅 <b>Услуга:</b> $service\n";
}

if ($message) {
    $text .= "💬 <b>Комментарий:</b>\n$message\n";
}

$text .= "\n🌐 <i>Источник: rada-cosmetolog.ru</i>";
$text .= "\n⏰ <i>" . date('d.m.Y H:i') . "</i>";

// 🤖 Отправляем в Telegram
$telegramUrl = "https://api.telegram.org/bot$botToken/sendMessage";
$telegramData = [
    'chat_id' => $chatId,
    'text' => $text,
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => true
];

$ch = curl_init($telegramUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $telegramData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

// 📧 Резервная копия на почту (опционально)
if ($backupEmail && filter_var($backupEmail, FILTER_VALIDATE_EMAIL)) {
    $subject = "Новая заявка на сайте — " . date('d.m.Y');
    $emailBody = strip_tags($text);
    $headers = "From: noreply@rada-cosmetolog.ru\r\n";
    $headers .= "Reply-To: $backupEmail\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    
    mail($backupEmail, $subject, $emailBody, $headers);
}

// ✅ Проверяем результат
$result = json_decode($response, true);

if ($result && $result['ok']) {
    // Успешно отправлено
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'message' => 'Заявка отправлена! Я свяжусь с вами в течение 2 часов.'
    ]);
    exit();
} else {
    // Ошибка отправки
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка отправки. Попробуйте снова или позвоните: +7 (927) 123-45-67'
    ]);
    exit();
}
?>