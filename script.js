// ========================================
 // NAIL STUDIO — SUPABASE
 // ========================================

const SUPABASE_URL = "https://wgkssqygsmjnbcesjlmo.supabase.co";
const SUPABASE_KEY = "sb_publishable_dxlbMcH6wGVIYfijioXGAQ_SyIOiMFq";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let selectedStartAt = null;
let availableTimesRequest = 0;


// ========================================
// ЗАГРУЗКА УСЛУГ
// ========================================

async function loadServices() {
    const container = document.getElementById("services-list");
    const serviceSelect = document.getElementById("booking-service");

    if (!container) {
        console.error("Не найден элемент services-list в HTML");
        return;
    }

    container.textContent = "Загружаем услуги...";

    const { data, error } = await db
        .from("services")
        .select("id, name, description, price, duration_minutes")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Ошибка загрузки услуг:", error);
        container.textContent = "Не удалось загрузить услуги.";
        return;
    }

    container.replaceChildren();

    if (!data || data.length === 0) {
        container.textContent =
            "Пока нет доступных услуг. Скоро здесь появится каталог!";
    } else {
        data.forEach(function (service) {
            const card = document.createElement("article");
            card.className = "service-card";

            const title = document.createElement("h3");
            title.textContent = service.name;

            const description = document.createElement("p");
            description.textContent =
                service.description || "Описание скоро появится";

            const details = document.createElement("p");
            details.className = "service-details";
            details.textContent =
                `${service.duration_minutes} мин. · ${service.price} ₽`;

            card.append(title, description, details);
            container.appendChild(card);
        });
    }

    if (serviceSelect) {
        serviceSelect.replaceChildren();

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Выберите услугу";
        serviceSelect.appendChild(placeholder);

        (data || []).forEach(function (service) {
            const option = document.createElement("option");
            option.value = service.id;
            option.textContent =
                `${service.name} — ${service.price} ₽ (${service.duration_minutes} мин.)`;

            serviceSelect.appendChild(option);
        });
    }

    console.log("Услуги загружены:", data?.length || 0);
}


// ========================================
// ЗАГРУЗКА ИНФОРМАЦИИ О СТУДИИ
// ========================================

async function loadStudioSettings() {
    const { data, error } = await db
        .from("site_settings")
        .select("studio_name, description, address, confirmation_message")
        .eq("id", 1)
        .maybeSingle();

    if (error) {
        console.error("Ошибка загрузки настроек:", error);
        return;
    }

    if (!data) {
        console.warn("Настройки студии пока не заполнены");
        return;
    }

    const description = document.getElementById("studio-description");
    const address = document.getElementById("studio-address");

    if (description && data.description) {
        description.textContent = data.description;
    }

    if (address && data.address) {
        address.textContent = data.address;
    }

    if (data.studio_name) {
        document.title = data.studio_name;
    }

    console.log("Информация о студии загружена");
}


// ========================================
// ДАТА: НЕ РАНЬШЕ СЕГОДНЯ
// ========================================

function getMoscowDate() {
                const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Moscow",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const values = {};

    parts.forEach(function (part) {
        values[part.type] = part.value;
    });

    return `${values.year}-${values.month}-${values.day}`;
}


// ========================================
// ФОРМАТИРОВАНИЕ ВРЕМЕНИ
// ========================================

function formatTime(dateString) {
    return new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Europe/Moscow",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    }).format(new Date(dateString));
}


// ========================================
// ЗАГРУЗКА СВОБОДНОГО ВРЕМЕНИ
// ========================================

async function loadAvailableTimes() {
    const serviceSelect = document.getElementById("booking-service");
    const dateInput = document.getElementById("booking-date");
    const timesContainer = document.getElementById("available-times");
    const message = document.getElementById("booking-message");

    if (!serviceSelect || !dateInput || !timesContainer) {
        return;
    }

    // Сбрасываем ранее выбранное время
    selectedStartAt = null;
     const continueButton = document.getElementById("continue-booking");
if (continueButton) continueButton.disabled = true;

    if (message) {
        message.textContent = "";
    }

    const requestNumber = ++availableTimesRequest;
    const serviceId = serviceSelect.value;
    const date = dateInput.value;

    if (!serviceId || !date) {
        timesContainer.textContent =
            "Сначала выбери услугу и дату.";
        return;
    }

    if (date < getMoscowDate()) {
        timesContainer.textContent =
            "Нельзя выбрать дату в прошлом.";
        return;
    }

    timesContainer.textContent = "Ищем свободное время...";

    const { data, error } = await db.rpc("get_available_times", {
        p_service_id: serviceId,
        p_date: date
    });

    // Не показываем ответ от устаревшего запроса
    if (requestNumber !== availableTimesRequest) {
        return;
    }

    if (error) {
        console.error("Ошибка загрузки свободного времени:", error);
        timesContainer.textContent =
            "Не удалось загрузить время. Попробуй обновить страницу.";
        return;
    }

    timesContainer.replaceChildren();

    if (!data || data.length === 0) {
        timesContainer.textContent =
            "На эту дату свободного времени нет. Попробуй другой день.";
        return;
    }

    data.forEach(function (slot) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "time-option";
        button.textContent = formatTime(slot.start_at);
        button.setAttribute("aria-pressed", "false");

        button.addEventListener("click", function () {
    selectedStartAt = slot.start_at;

    timesContainer.querySelectorAll(".time-option").forEach(function (otherButton) {
        otherButton.classList.remove("selected");
        otherButton.setAttribute("aria-pressed", "false");
        otherButton.style.backgroundColor = "";
        otherButton.style.color = "";
        otherButton.style.borderColor = "";
    });

    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");

    button.style.backgroundColor = "#a66bb5";
    button.style.color = "#ffffff";
    button.style.borderColor = "#875095";

    updateContinueButton();

    if (message) {
        message.textContent = "Выбрано время: " + formatTime(slot.start_at) + ".";
    }

    console.log("Выбрано время:", selectedStartAt);
});

        timesContainer.appendChild(button);
    });

    console.log("Свободное время загружено:", data.length);
}


// ========================================
// НАСТРОЙКА ФОРМЫ ЗАПИСИ
// ========================================

function setupBookingForm() {
    const serviceSelect = document.getElementById("booking-service");
    const dateInput = document.getElementById("booking-date");

    if (!serviceSelect || !dateInput) {
        console.warn("Поля выбора услуги или даты не найдены");
        return;
    }
     dateInput.min = getMoscowDate();

    serviceSelect.addEventListener("change", loadAvailableTimes);
    dateInput.addEventListener("change", loadAvailableTimes);
}


// ========================================
// ЗАПУСК САЙТА
// ========================================

async function initSite() {
    if (!window.supabase) {
        console.error(
            "Supabase не подключён. Проверь подключение библиотеки в index.html."
        );
        return;
    }

    setupBookingForm();

    await Promise.all([
        loadServices(),
        loadStudioSettings()
    ]);
}
document.addEventListener("DOMContentLoaded", function () {
    initSite();
    setupBookingConfirmation();
});


// ========================================
// ПРЕДВАРИТЕЛЬНОЕ ПОДТВЕРЖДЕНИЕ ЗАПИСИ
// ========================================

function setupBookingConfirmation() {
    const serviceSelect = document.getElementById("booking-service");
    const dateInput = document.getElementById("booking-date");
    const nameInput = document.getElementById("customer-name");
    const phoneInput = document.getElementById("customer-phone");

    const continueButton = document.getElementById("continue-booking");
    const confirmation = document.getElementById("booking-confirmation");
    const summary = document.getElementById("booking-summary");
    const masterMessage = document.getElementById("master-confirmation-message");
    const confirmButton = document.getElementById("confirm-booking");
    const editButton = document.getElementById("edit-booking");
    const status = document.getElementById("booking-message");

    if (
        !serviceSelect || !dateInput || !nameInput || !phoneInput ||
        !continueButton || !confirmation || !summary ||
        !masterMessage || !confirmButton || !editButton
    ) {
        console.error("Не найдены элементы подтверждения записи в HTML.");
        return;
    }

    let settingsMessage = "Проверь данные перед подтверждением.";
    let bookingInProgress = false;
     function updateContinueButton() {
    continueButton.disabled = !(
        serviceSelect.value &&
        dateInput.value &&
        selectedStartAt &&
        nameInput.value.trim() &&
        phoneInput.value.trim()
    );
}

[
    serviceSelect,
    dateInput,
    nameInput,
    phoneInput
].forEach(function (field) {
    field.addEventListener("input", updateContinueButton);
    field.addEventListener("change", updateContinueButton);
});

    // Получаем сообщение мастера из настроек студии
    async function loadConfirmationMessage() {
        const { data, error } = await db
            .from("site_settings")
            .select("confirmation_message")
            .eq("id", 1)
            .maybeSingle();

        if (!error && data && data.confirmation_message) {
            settingsMessage = data.confirmation_message;
        }

        masterMessage.textContent = settingsMessage;
    }

    loadConfirmationMessage();

    // Продолжить — показать сводку, но пока не создавать бронь
    continueButton.addEventListener("click", function () {
        if (bookingInProgress) return;

        if (!serviceSelect.value || !dateInput.value || !selectedStartAt) {
            status.textContent = "Сначала выбери услугу, дату и время.";
            return;
        }

        if (!nameInput.value.trim() || !phoneInput.value.trim()) {
            status.textContent = "Введи своё имя и номер телефона.";
            return;
        }

        if (dateInput.value < getMoscowDate()) {
            status.textContent = "Нельзя выбрать дату в прошлом.";
            return;
        }

        const serviceName =
            serviceSelect.options[serviceSelect.selectedIndex].textContent;

        const startDate = new Date(selectedStartAt);

        if (!Number.isFinite(startDate.getTime()) || startDate <= new Date()) {
            status.textContent = "Выбранное время уже прошло. Выбери другое.";
            return;
        }

        summary.replaceChildren();

        const details = [
            ["Услуга", serviceName],
            ["Дата", new Intl.DateTimeFormat("ru-RU", {
                timeZone: "Europe/Moscow",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }).format(startDate)],
            ["Время", formatTime(selectedStartAt)],
            ["Имя", nameInput.value.trim()],
            ["Телефон", phoneInput.value.trim()]
        ];

        details.forEach(function (item) {
            const line = document.createElement("p");
            const label = document.createElement("strong");
            label.textContent = item[0] + ": ";

            line.append(label, document.createTextNode(item[1]));
            summary.appendChild(line);
        });

        masterMessage.textContent = settingsMessage;
        confirmation.hidden = false;
        status.textContent = "";
        confirmation.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    // Вернуться к форме
     editButton.addEventListener("click", function () {
        confirmation.hidden = true;
        status.textContent = "";
    });

    // Окончательное создание брони
    confirmButton.addEventListener("click", async function () {
        if (bookingInProgress) return;

        if (!selectedStartAt || !serviceSelect.value) {
            status.textContent = "Выбери услугу и время заново.";
            confirmation.hidden = true;
            return;
        }

        if (!nameInput.value.trim() || !phoneInput.value.trim()) {
            status.textContent = "Заполни имя и телефон.";
            confirmation.hidden = true;
            return;
        }

        bookingInProgress = true;
        confirmButton.disabled = true;
        confirmButton.textContent = "Сохраняем запись...";

        try {
            const { data, error } = await db.rpc("create_booking", {
                p_service_id: serviceSelect.value,
                p_customer_name: nameInput.value.trim(),
                p_customer_phone: phoneInput.value.trim(),
                p_start_at: selectedStartAt
            });

            if (error) {
                console.error("Ошибка создания записи:", error);

                status.textContent =
                    "Не удалось подтвердить запись. Возможно, время уже занято. Обнови свободное время и попробуй снова.";

                confirmation.hidden = true;
                await loadAvailableTimes();
                return;
            }

            status.textContent =
                "Запись сохранена! Спасибо. Если мастер должен дополнительно связаться с тобой, дождись подтверждения.";
             const successPopup = document.getElementById("booking-success-popup");
const successDetails = document.getElementById("success-booking-details");

if (successDetails) {
    successDetails.replaceChildren();

    const serviceName =
        serviceSelect.options[serviceSelect.selectedIndex]?.textContent || "Услуга";

    const details = [
        ["Услуга", serviceName],
        ["Дата", new Intl.DateTimeFormat("ru-RU", {
            timeZone: "Europe/Moscow",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }).format(new Date(selectedStartAt))],
        ["Время", formatTime(selectedStartAt)],
        ["Имя", nameInput.value.trim()]
    ];

    details.forEach(function (item) {
        const line = document.createElement("p");
        const label = document.createElement("strong");

        label.textContent = item[0] + ": ";
        line.append(label, document.createTextNode(item[1]));
        successDetails.appendChild(line);
    });
}

if (successPopup) {
    successPopup.hidden = false;
}

            confirmation.hidden = true;
            selectedStartAt = null;
            serviceSelect.value = "";
            dateInput.value = "";
            nameInput.value = "";
            phoneInput.value = "";

            const timesContainer = document.getElementById("available-times");
            if (timesContainer) {
                timesContainer.textContent =
                    "Запись оформлена. Для новой записи выбери услугу и дату.";
            }

            console.log("Запись создана в Supabase:", data);
        } catch (error) {
            console.error("Ошибка подтверждения:", error);
            status.textContent =
                "Произошла ошибка. Проверь подключение и попробуй снова.";
        } finally {
            bookingInProgress = false;
            confirmButton.disabled = false;
            confirmButton.textContent = "Подтвердить запись →";
        }
    });
}
// ========================================
// ЗАКРЫТИЕ ОКНА УСПЕШНОЙ ЗАПИСИ
// ========================================

document.addEventListener("DOMContentLoaded", function () {
    const successPopup = document.getElementById("booking-success-popup");
    const closeButton = document.getElementById("close-success-popup");
    const doneButton = document.getElementById("success-popup-done");

    function closeSuccessPopup() {
        if (successPopup) {
            successPopup.hidden = true;
        }
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeSuccessPopup);
    }

    if (doneButton) {
        doneButton.addEventListener("click", closeSuccessPopup);
    }

    if (successPopup) {
        successPopup.addEventListener("click", function (event) {
            if (event.target === successPopup) {
                closeSuccessPopup();
            }
        });
    }
});