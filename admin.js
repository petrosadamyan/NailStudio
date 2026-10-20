const SUPABASE_URL = "https://wgkssqygsmjnbcesjlmo.supabase.co";
const SUPABASE_KEY = "sb_publishable_dxlbMcH6wGVIYfijioXGAQ_SyIOiMFq";

const adminDb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const $ = (id) => document.getElementById(id);

const loginScreen = $("admin-login-screen");
const dashboard = $("admin-dashboard");
const loginForm = $("admin-login-form");
const loginMessage = $("admin-login-message");

let currentSection = "schedule";

// -------------------- ДАТА И ВРЕМЯ --------------------

function moscowDateTime(date, time) {
    return new Date(`${date}T${time}:00+03:00`).toISOString();
}

function moscowDayStart(date) {
    return new Date(`${date}T00:00:00+03:00`).toISOString();
}

function nextMoscowDayStart(date) {
    const [year, month, day] = date.split("-").map(Number);
    const nextDay = new Date(Date.UTC(year, month - 1, day + 1));

    const nextDate = [
        nextDay.getUTCFullYear(),
        String(nextDay.getUTCMonth() + 1).padStart(2, "0"),
        String(nextDay.getUTCDate()).padStart(2, "0")
    ].join("-");

    return moscowDayStart(nextDate);
}

function formatMoscowTime(value) {
    return new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Europe/Moscow",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(value));
}

function formatMoscowDate(value) {
    return new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Europe/Moscow",
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(new Date(value));
}

function getMoscowToday() {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Moscow",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const values = {};

    parts.forEach(part => {
        values[part.type] = part.value;
    });

    return `${values.year}-${values.month}-${values.day}`;
}

// -------------------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ --------------------

function showMessage(id, message) {
    const element = $(id);

    if (element) {
        element.textContent = message;
    }
}

function addTextElement(parent, tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;

    if (className) {
        element.className = className;
    }

    parent.appendChild(element);
    return element;
}

function addButton(
    parent,
    text,
    callback,
    className = "admin-action"
) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = text;
    button.className = className;
    button.addEventListener("click", callback);

    parent.appendChild(button);
    return button;
}

// -------------------- ОТКРЫТИЕ ПАНЕЛИ --------------------

function showDashboard() {
    loginScreen.hidden = true;
    dashboard.hidden = false;

    $("schedule-view-date").value =
        $("work-date").value || getMoscowToday();

    setSection("schedule");
}

async function restoreSession() {
    const { data, error } = await adminDb.auth.getSession();

    if (error || !data.session) {
        return;
    }

    const { data: isAdmin, error: adminError } =
        await adminDb.rpc("is_admin");

    if (adminError || isAdmin !== true) {
        await adminDb.auth.signOut();
        return;
    }

    $("work-date").value = getMoscowToday();
    $("schedule-view-date").value = getMoscowToday();

    showDashboard();
}

// -------------------- ВХОД --------------------

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = $("admin-email").value.trim();
    const password = $("admin-password").value;
    const button = loginForm.querySelector('button[type="submit"]');

    button.disabled = true;
    showMessage("admin-login-message", "Проверяем данные...");

    try {
        const { error: loginError } =
            await adminDb.auth.signInWithPassword({
                 email,
                password
            });

        if (loginError) {
            throw new Error(
                "Не удалось войти. Проверь почту и пароль."
            );
        }

        const { data: isAdmin, error: adminError } =
            await adminDb.rpc("is_admin");

        if (adminError || isAdmin !== true) {
            await adminDb.auth.signOut();

            throw new Error(
                "У аккаунта нет прав администратора."
            );
        }

        $("work-date").value = getMoscowToday();
        $("schedule-view-date").value = getMoscowToday();

        showDashboard();

        showMessage(
            "schedule-message",
            "Вход выполнен. Выбери рабочее время."
        );
    } catch (error) {
        showMessage("admin-login-message", error.message);
    } finally {
        button.disabled = false;
    }
});

// -------------------- РАЗДЕЛЫ --------------------

function setSection(name) {
    currentSection = name;

    document.querySelectorAll(".admin-nav button").forEach(button => {
        const active = button.dataset.section === name;

        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll(".admin-section").forEach(section => {
        section.hidden = section.id !== `section-${name}`;
    });

    if (name === "schedule") {
        loadSchedule();
    }

    if (name === "bookings") {
        loadBookings();
    }

    if (name === "services") {
        loadServices();
    }
}

document.querySelectorAll(".admin-nav button").forEach(button => {
    button.addEventListener("click", () => {
        setSection(button.dataset.section);
    });
});

// -------------------- ВЫХОД --------------------

$("admin-logout").addEventListener("click", async function () {
    const { error } = await adminDb.auth.signOut();

    if (error) {
        alert("Не удалось выйти. Попробуй ещё раз.");
        return;
    }

    dashboard.hidden = true;
    loginScreen.hidden = false;
    loginForm.reset();

    showMessage(
        "admin-login-message",
        "Ты вышла из аккаунта."
    );
});

// -------------------- РАСПИСАНИЕ --------------------

$("schedule-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const date = $("work-date").value;
    const start = $("work-start").value;
    const end = $("work-end").value;

    const button = $("schedule-form").querySelector(
        'button[type="submit"]'
    );

    if (!date || !start || !end || start >= end) {
        showMessage(
            "schedule-message",
            "Проверь дату и время: окончание должно быть позже начала."
        );
        return;
    }

    const startAt = moscowDateTime(date, start);
    const endAt = moscowDateTime(date, end);

    if (new Date(startAt) <= new Date()) {
        showMessage(
            "schedule-message",
            "Нельзя добавить рабочее время в прошлом."
        );
        return;
    }

    button.disabled = true;
    showMessage("schedule-message", "Сохраняем интервал...");

    try {
        // Проверяем, не пересекается ли новый интервал
        // с уже существующими рабочими интервалами.
        const { data: existing, error: readError } = await adminDb
            .from("work_slots")
            .select("id,start_at,end_at")
            .lt("start_at", endAt)
            .gt("end_at", startAt);

        if (readError) {
            throw readError;
        }

        if (existing && existing.length > 0) {
            throw new Error(
                "Этот интервал пересекается с уже добавленным рабочим временем."
            );
        }

        // Каждый рабочий промежуток сохраняется отдельной строкой.
        const { error: insertError } = await adminDb
            .from("work_slots")
            .insert({
                start_at: startAt,
                end_at: endAt,
                is_open: true
            });
         if (insertError) {
            throw insertError;
        }

        showMessage(
            "schedule-message",
            `Интервал ${start}–${end} успешно добавлен!`
        );

        $("schedule-view-date").value = date;

        await loadSchedule();
    } catch (error) {
        console.error("Schedule error:", error);

        showMessage(
            "schedule-message",
            "Не удалось сохранить время: " + error.message
        );
    } finally {
        button.disabled = false;
    }
});

$("schedule-filter-form").addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();
        await loadSchedule();
    }
);

async function loadSchedule() {
    const date = $("schedule-view-date").value;
    const list = $("schedule-list");

    if (!date || !list) {
        return;
    }

    list.replaceChildren();

    addTextElement(
        list,
        "p",
        "Загружаем расписание...",
        "schedule-loading"
    );

    const { data, error } = await adminDb
        .from("work_slots")
        .select("id,start_at,end_at,is_open")
        .lt("start_at", nextMoscowDayStart(date))
        .gt("end_at", moscowDayStart(date))
        .order("start_at", { ascending: true });

    list.replaceChildren();

    if (error) {
        addTextElement(
            list,
            "p",
            "Не удалось загрузить расписание: " + error.message
        );
        return;
    }

    if (!data || data.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "schedule-empty";

        addTextElement(
            emptyState,
            "span",
            "♡",
            "schedule-empty-icon"
        );

        addTextElement(
            emptyState,
            "h3",
            "Пока нет интервалов"
        );

        addTextElement(
            emptyState,
            "p",
            "Добавь рабочее время выше, и оно появится здесь."
        );

        list.appendChild(emptyState);
        return;
    }

    data.forEach((slot, index) => {
        const item = document.createElement("article");
        item.className = "admin-item schedule-item";

        const header = document.createElement("div");
        header.className = "schedule-item-header";

        const timeBlock = document.createElement("div");
        timeBlock.className = "schedule-time-block";

        addTextElement(
            timeBlock,
            "span",
            `ИНТЕРВАЛ ${index + 1}`,
            "schedule-item-number"
        );

        addTextElement(
            timeBlock,
            "strong",
            `${formatMoscowTime(slot.start_at)} — ${formatMoscowTime(slot.end_at)}`,
            "schedule-time"
        );

        header.appendChild(timeBlock);

        const status = document.createElement("span");
        status.className = slot.is_open
            ? "schedule-status schedule-status-open"
            : "schedule-status schedule-status-closed";

        status.textContent = slot.is_open
            ? "Открыт"
            : "Закрыт";

        header.appendChild(status);
        item.appendChild(header);

        addTextElement(
            item,
            "p",
            slot.is_open
                ? "Клиенты могут выбрать это время для записи."
                : "Новые записи на это время недоступны.",
            "schedule-item-description"
        );

        const actions = document.createElement("div");
        actions.className = "schedule-actions";

        if (slot.is_open) {
            addButton(
                actions,
                "Закрыть для записи",
                async () => {
                    await closeSlot(slot);
                },
                "admin-action schedule-close-button"
            );
        } else {
            addButton(
                actions,
                "Открыть для записи",
                async () => {
                    await reopenSlot(slot);
                },
                 "admin-action schedule-open-button"
            );
        }

        item.appendChild(actions);
        list.appendChild(item);
    });
}

async function closeSlot(slot) {
    if (!confirm("Закрыть этот интервал для новых записей?")) {
        return;
    }

    const { data: bookings, error: bookingError } = await adminDb
        .from("bookings")
        .select("id")
        .eq("status", "confirmed")
        .lt("start_at", slot.end_at)
        .gt("end_at", slot.start_at);

    if (bookingError) {
        showMessage(
            "schedule-message",
            "Не удалось проверить записи: " + bookingError.message
        );
        return;
    }

    if (bookings && bookings.length > 0) {
        showMessage(
            "schedule-message",
            "Внутри интервала есть подтверждённая запись. Сначала проверь её."
        );
        return;
    }

    const { error } = await adminDb
        .from("work_slots")
        .update({ is_open: false })
        .eq("id", slot.id);

    if (error) {
        showMessage(
            "schedule-message",
            "Не удалось закрыть интервал: " + error.message
        );
        return;
    }

    showMessage(
        "schedule-message",
        "Интервал закрыт для новых записей."
    );

    await loadSchedule();
}

async function reopenSlot(slot) {
    const { error } = await adminDb
        .from("work_slots")
        .update({ is_open: true })
        .eq("id", slot.id);

    if (error) {
        showMessage(
            "schedule-message",
            "Не удалось открыть интервал: " + error.message
        );
        return;
    }

    showMessage(
        "schedule-message",
        "Интервал снова открыт для записи."
    );

    await loadSchedule();
}

// -------------------- ЗАПИСИ КЛИЕНТОВ --------------------

$("bookings-filter-form").addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        const date = $("bookings-filter-date").value;
        await loadBookings(date);
    }
);

$("clear-bookings-filter").addEventListener("click", async function () {
    $("bookings-filter-date").value = "";
    await loadBookings("");
});

$("refresh-bookings").addEventListener("click", async function () {
    await loadBookings($("bookings-filter-date").value);
});

async function loadBookings(
    filterDate = $("bookings-filter-date").value
) {
    const list = $("bookings-list");

    if (!list) {
        return;
    }

    list.replaceChildren();
    showMessage("bookings-message", "Загружаем записи...");

    let query = adminDb
        .from("bookings")
        .select("*");

    if (filterDate) {
        query = query
            .gte("start_at", moscowDayStart(filterDate))
            .lt("start_at", nextMoscowDayStart(filterDate));
    }

    const { data, error } = await query
        .order("start_at", { ascending: true });

    if (error) {
        showMessage(
            "bookings-message",
            "Не удалось загрузить записи: " + error.message
        );
        return;
    }

    showMessage(
        "bookings-message",
        data.length
            ? `Найдено записей: ${data.length}`
            : filterDate
                ? "На выбранную дату записей нет."
                : "Записей пока нет."
    );

    data.forEach(booking => {
        const item = document.createElement("article");
        item.className = "admin-item";

        addTextElement(
            item,
            "h3",
            booking.service_name || "Услуга"
        );

        addTextElement(
            item,
            "p",
            `Клиент: ${booking.customer_name || "Не указано"}`
        );

        addTextElement(
            item,
            "p",
            `Телефон: ${booking.customer_phone || "Не указан"}`
        );

        addTextElement(
            item,
            "p",
            `${formatMoscowDate(booking.start_at)}, ${formatMoscowTime(booking.start_at)} — ${formatMoscowTime(booking.end_at)}`
             );

        addTextElement(
            item,
            "p",
            `Цена: ${booking.price_at_booking ?? "не указана"} ₽`
        );

        addTextElement(
            item,
            "p",
            `Статус: ${booking.status || "не указан"}`
        );

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "admin-action";
        deleteButton.textContent = "Удалить запись";

        deleteButton.addEventListener("click", async () => {
            const confirmed = confirm(
                `Удалить запись клиента ${booking.customer_name || ""} на ${formatMoscowDate(booking.start_at)} в ${formatMoscowTime(booking.start_at)}?`
            );

            if (!confirmed) {
                return;
            }

            deleteButton.disabled = true;
            deleteButton.textContent = "Удаляем...";

            const { error: deleteError } = await adminDb
                .from("bookings")
                .delete()
                .eq("id", booking.id);

            if (deleteError) {
                deleteButton.disabled = false;
                deleteButton.textContent = "Удалить запись";

                showMessage(
                    "bookings-message",
                    "Не удалось удалить запись: " + deleteError.message
                );
                return;
            }

            showMessage(
                "bookings-message",
                "Запись удалена."
            );

            await loadBookings($("bookings-filter-date").value);
        });

        item.appendChild(deleteButton);
        list.appendChild(item);
    });
}

// -------------------- УСЛУГИ --------------------

$("refresh-services").addEventListener("click", loadServices);
$("service-form").addEventListener("submit", saveService);
$("cancel-service-edit").addEventListener("click", cancelServiceEdit);

async function loadServices() {
    const list = $("services-list");

    if (!list) {
        return;
    }

    list.replaceChildren();
    showMessage("services-message", "Загружаем услуги...");

    const { data, error } = await adminDb
        .from("services")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        showMessage(
            "services-message",
            "Не удалось загрузить услуги: " + error.message
        );
        return;
    }

    showMessage(
        "services-message",
        data.length
            ? `Найдено услуг: ${data.length}`
            : "Услуг пока нет."
    );

    data.forEach(service => {
        const item = document.createElement("article");
        item.className = "admin-item";

        addTextElement(
            item,
            "h3",
            service.name || "Услуга"
        );

        addTextElement(
            item,
            "p",
            `Описание: ${service.description || "не указано"}`
        );

        addTextElement(
            item,
            "p",
            `Цена: ${service.price ?? "не указана"} ₽`
        );

        addTextElement(
            item,
            "p",
            `Длительность: ${service.duration_minutes ?? "не указана"} мин.`
        );

        addTextElement(
            item,
            "p",
            service.is_active ? "Активна" : "Неактивна"
        );

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "admin-action";
        editButton.textContent = "Изменить";

        editButton.addEventListener("click", () => {
            $("service-id").value = service.id;
            $("service-name").value = service.name || "";
            $("service-description").value = service.description || "";
            $("service-price").value = service.price ?? "";
            $("service-duration").value =
                service.duration_minutes ?? 60;
            $("service-active").checked = Boolean(service.is_active);
             $("save-service").textContent = "Сохранить изменения";
            $("cancel-service-edit").hidden = false;

            $("service-form").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "admin-action";
        deleteButton.textContent = "Удалить";

        deleteButton.addEventListener("click", async () => {
            const confirmed = confirm(
                `Удалить услугу «${service.name}»?`
            );

            if (!confirmed) {
                return;
            }

            const { error: deleteError } = await adminDb
                .from("services")
                .delete()
                .eq("id", service.id);

            if (deleteError) {
                showMessage(
                    "services-message",
                    "Не удалось удалить услугу: " + deleteError.message
                );
                return;
            }

            cancelServiceEdit();

            showMessage(
                "services-message",
                "Услуга удалена."
            );

            await loadServices();
        });

        item.append(editButton, deleteButton);
        list.appendChild(item);
    });
}

async function saveService(event) {
    event.preventDefault();

    const serviceId = $("service-id").value;

    const service = {
        name: $("service-name").value.trim(),
        description: $("service-description").value.trim(),
        price: Number($("service-price").value),
        duration_minutes: Number($("service-duration").value),
        is_active: $("service-active").checked
    };

    if (!service.name) {
        showMessage(
            "services-message",
            "Укажи название услуги."
        );
        return;
    }

    if (
        !Number.isFinite(service.price) ||
        service.price < 0 ||
        !Number.isInteger(service.duration_minutes) ||
        service.duration_minutes < 15 ||
        service.duration_minutes % 15 !== 0
    ) {
        showMessage(
            "services-message",
            "Проверь цену и длительность. Длительность должна быть кратна 15 минутам."
        );
        return;
    }

    $("save-service").disabled = true;

    showMessage(
        "services-message",
        "Сохраняем услугу..."
    );

    try {
        let result;

        if (serviceId) {
            result = await adminDb
                .from("services")
                .update(service)
                .eq("id", serviceId);
        } else {
            result = await adminDb
                .from("services")
                .insert([service]);
        }

        if (result.error) {
            throw result.error;
        }

        $("service-form").reset();
        $("service-id").value = "";
        $("service-duration").value = 60;
        $("service-active").checked = true;

        $("save-service").textContent = "Добавить услугу";
        $("cancel-service-edit").hidden = true;

        showMessage(
            "services-message",
            serviceId
                ? "Изменения сохранены."
                : "Услуга добавлена."
        );

        await loadServices();
    } catch (error) {
        showMessage(
            "services-message",
            "Не удалось сохранить услугу: " + error.message
        );
    } finally {
        $("save-service").disabled = false;
    }
}

function cancelServiceEdit() {
    $("service-form").reset();
    $("service-id").value = "";
    $("service-duration").value = 60;
    $("service-active").checked = true;

    $("save-service").textContent = "Добавить услугу";
    $("cancel-service-edit").hidden = true;
}

// -------------------- ЗАПУСК --------------------

restoreSession();