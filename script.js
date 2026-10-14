/* =========================================================
   CARCONSTRUCTOR
   ENGINE + FUEL + DRIVE SYSTEM
========================================================= */


/* =========================================================
   ТЕКУЩАЯ КОНФИГУРАЦИЯ
========================================================= */

let car = {
    body: "SEDAN",
    fuel: "AI-92",
    engine: "I4-1.6-92",
    drive: "FWD",
    gearbox: "AT"
};


/* =========================================================
   КУЗОВА
========================================================= */

const bodyData = {

    SEDAN: {
        mass: 1500,
        baseAcceleration: 8.2
    },

    COUPE: {
        mass: 1450,
        baseAcceleration: 7.5
    },

    SUV: {
        mass: 1750,
        baseAcceleration: 9.0
    },

    WAGON: {
        mass: 1600,
        baseAcceleration: 8.7
    }

};


/* =========================================================
   ДВИГАТЕЛИ
   6 ДВИГАТЕЛЕЙ НА КАЖДЫЙ ТИП ТОПЛИВА
========================================================= */

const engineData = {

    /* ================= AI-92 ================= */

    "I4-1.6-92": {
        name: "1.6 I4",
        fuel: "AI-92",
        type: "I4",
        volume: "1.6 L",
        cylinders: 4,
        power: 120,
        mass: 140
    },

    "I4-1.8-92": {
        name: "1.8 I4",
        fuel: "AI-92",
        type: "I4",
        volume: "1.8 L",
        cylinders: 4,
        power: 135,
        mass: 150
    },

    "I4-2.0-92": {
        name: "2.0 I4",
        fuel: "AI-92",
        type: "I4",
        volume: "2.0 L",
        cylinders: 4,
        power: 155,
        mass: 165
    },

    "I5-2.5-92": {
        name: "2.5 I5",
        fuel: "AI-92",
        type: "I5",
        volume: "2.5 L",
        cylinders: 5,
        power: 200,
        mass: 185
    },

    "V6-3.0-92": {
        name: "3.0 V6",
        fuel: "AI-92",
        type: "V6",
        volume: "3.0 L",
        cylinders: 6,
        power: 260,
        mass: 210
    },

    "V8-4.0-92": {
        name: "4.0 V8",
        fuel: "AI-92",
        type: "V8",
        volume: "4.0 L",
        cylinders: 8,
        power: 380,
        mass: 245
    },


    /* ================= AI-95 ================= */

    "I4-1.5-95": {
        name: "1.5 I4 Turbo",
        fuel: "AI-95",
        type: "I4 Turbo",
        volume: "1.5 L",
        cylinders: 4,
        power: 150,
        mass: 145
    },

    "I4-2.0-95": {
        name: "2.0 I4",
        fuel: "AI-95",
        type: "I4",
        volume: "2.0 L",
        cylinders: 4,
        power: 175,
        mass: 165
    },

    "I4-2.0T-95": {
        name: "2.0 I4 Turbo",
        fuel: "AI-95",
        type: "I4 Turbo",
        volume: "2.0 L",
        cylinders: 4,
        power: 220,
        mass: 175
    },

    "I5-2.5-95": {
        name: "2.5 I5",
        fuel: "AI-95",
        type: "I5",
        volume: "2.5 L",
        cylinders: 5,
        power: 240,
        mass: 190
    },

    "V6-3.0-95": {
        name: "3.0 V6",
        fuel: "AI-95",
        type: "V6",
        volume: "3.0 L",
        cylinders: 6,
        power: 310,
        mass: 215
    },

    "V8-4.0-95": {
        name: "4.0 V8",
        fuel: "AI-95",
        type: "V8",
        volume: "4.0 L",
        cylinders: 8,
        power: 450,
        mass: 250
    },


    /* ================= AI-98 ================= */

    "I4-1.6-98": {
        name: "1.6 I4 Turbo",
        fuel: "AI-98",
        type: "I4 Turbo",
        volume: "1.6 L",
        cylinders: 4,
        power: 180,
        mass: 150
    },

    "I4-2.0-98": {
        name: "2.0 I4",
        fuel: "AI-98",
        type: "I4",
        volume: "2.0 L",
        cylinders: 4,
        power: 205,
        mass: 170
    },

    "I4-2.0T-98": {
        name: "2.0 I4 Turbo",
        fuel: "AI-98",
        type: "I4 Turbo",
        volume: "2.0 L",
        cylinders: 4,
        power: 250,
        mass: 180
    },

    "I5-2.5-98": {
         name: "2.5 I5 Turbo",
        fuel: "AI-98",
        type: "I5 Turbo",
        volume: "2.5 L",
        cylinders: 5,
        power: 300,
        mass: 195
    },

    "V6-3.0-98": {
        name: "3.0 V6 Turbo",
        fuel: "AI-98",
        type: "V6 Turbo",
        volume: "3.0 L",
        cylinders: 6,
        power: 370,
        mass: 225
    },

    "V8-4.0-98": {
        name: "4.0 V8 Turbo",
        fuel: "AI-98",
        type: "V8 Turbo",
        volume: "4.0 L",
        cylinders: 8,
        power: 520,
        mass: 260
    },


    /* ================= AI-100 ================= */

    "I4-1.6-100": {
        name: "1.6 I4 Turbo",
        fuel: "AI-100",
        type: "I4 Turbo",
        volume: "1.6 L",
        cylinders: 4,
        power: 195,
        mass: 150
    },

    "I4-2.0-100": {
        name: "2.0 I4 Turbo",
        fuel: "AI-100",
        type: "I4 Turbo",
        volume: "2.0 L",
        cylinders: 4,
        power: 270,
        mass: 180
    },

    "I5-2.5-100": {
        name: "2.5 I5 Turbo",
        fuel: "AI-100",
        type: "I5 Turbo",
        volume: "2.5 L",
        cylinders: 5,
        power: 330,
        mass: 200
    },

    "V6-3.0-100": {
        name: "3.0 V6 Turbo",
        fuel: "AI-100",
        type: "V6 Turbo",
        volume: "3.0 L",
        cylinders: 6,
        power: 420,
        mass: 230
    },

    "V8-4.0-100": {
        name: "4.0 V8 Turbo",
        fuel: "AI-100",
        type: "V8 Turbo",
        volume: "4.0 L",
        cylinders: 8,
        power: 580,
        mass: 265
    },

    "V12-6.0-100": {
        name: "6.0 V12",
        fuel: "AI-100",
        type: "V12",
        volume: "6.0 L",
        cylinders: 12,
        power: 700,
        mass: 315
    },


    /* ================= DIESEL ================= */

    "I4-1.6-DT": {
        name: "1.6 I4 Diesel",
        fuel: "ДТ",
        type: "I4 Diesel",
        volume: "1.6 L",
        cylinders: 4,
        power: 115,
        mass: 155
    },

    "I4-2.0-DT": {
        name: "2.0 I4 Diesel",
        fuel: "ДТ",
        type: "I4 Diesel",
        volume: "2.0 L",
        cylinders: 4,
        power: 150,
        mass: 175
    },

    "I4-2.2-DT": {
        name: "2.2 I4 Diesel",
        fuel: "ДТ",
        type: "I4 Diesel",
        volume: "2.2 L",
        cylinders: 4,
        power: 185,
        mass: 185
    },

    "I6-3.0-DT": {
        name: "3.0 I6 Diesel",
        fuel: "ДТ",
        type: "I6 Diesel",
        volume: "3.0 L",
        cylinders: 6,
        power: 250,
        mass: 220
    },

    "V6-3.0-DT": {
        name: "3.0 V6 Diesel",
        fuel: "ДТ",
        type: "V6 Diesel",
        volume: "3.0 L",
        cylinders: 6,
        power: 290,
        mass: 230
    },

    "V8-4.0-DT": {
        name: "4.0 V8 Diesel",
        fuel: "ДТ",
        type: "V8 Diesel",
        volume: "4.0 L",
        cylinders: 8,
        power: 380,
        mass: 270
    }

};


/* =========================================================
   ВЛИЯНИЕ ТОПЛИВА
========================================================= */

const fuelData = {

    "AI-92": {
        powerMultiplier: 0.96
    },

    "AI-95": {
        powerMultiplier: 1.00
    },

    "AI-98": {
        powerMultiplier: 1.04
    },

    "AI-100": {
        powerMultiplier: 1.08
    },

    "ДТ": {
        powerMultiplier: 1.00
    }

};


/* =========================================================
   ВЛИЯНИЕ ПРИВОДА
========================================================= */

const driveData = {

    FWD: {
        mass: 0,
        accelerationBonus: 0,
        powerMultiplier: 1.00
    },

    RWD: {
        mass: 30,
        accelerationBonus: -0.15,
        powerMultiplier: 1.02
    },

    AWD: {
        mass: 80,
        accelerationBonus: -0.45,
        powerMultiplier: 1.05
    }

};


/* =========================================================
   КОРОБКИ
========================================================= */
const gearboxData = {

    AT: {
        mass: 40,
        accelerationBonus: 0
    },

    MT: {
        mass: 0,
        accelerationBonus: -0.35
    },

    CVT: {
        mass: 20,
        accelerationBonus: 0.25
    }

};


/* =========================================================
   ПОИСК ЭЛЕМЕНТОВ
========================================================= */

const bodyOptions =
    document.querySelectorAll(".option");

const fuelOptions =
    document.querySelectorAll(".fuel");

const driveOptions =
    document.querySelectorAll(".drive-option");

const gearboxOptions =
    document.querySelectorAll(".gearbox");

const powerDisplay =
    document.querySelector(
        ".power-card .big-number"
    );

const accelerationDisplay =
    document.querySelector(
        ".dashboard-card:nth-child(2) .big-number"
    );

const massDisplay =
    document.querySelector(
        ".dashboard-card:nth-child(3) .big-number"
    );

const driveDisplay =
    document.querySelector(".drive-name");

const selectedData =
    document.querySelectorAll(
        ".selected-data > div"
    );

const continueButton =
    document.querySelector(
        ".continue-button"
    );

const headerButton =
    document.querySelector(
        ".header-button"
    );

const buildName =
    document.querySelector(
        ".build-name h3"
    );


/* =========================================================
   СОЗДАНИЕ БЛОКА ДВИГАТЕЛЕЙ
========================================================= */

function createEngineBlock() {

    const constructorMain =
        document.querySelector(
            ".constructor-main"
        );

    if (!constructorMain) {
        return;
    }


    if (
        document.querySelector(
            ".engine-config-block"
        )
    ) {
        return;
    }


    const gearboxBlock =
        document.querySelector(
            ".gearbox-grid"
        )?.closest(
            ".config-block"
        );


    if (!gearboxBlock) {
        return;
    }


    const block =
        document.createElement("div");


    block.className =
        "config-block engine-config-block";


    const title =
        document.createElement("div");

    title.className =
        "config-title";


    title.innerHTML =
        "<div>" +
        "<span>STEP 03</span>" +
        "<h3>ДВИГАТЕЛЬ</h3>" +
        "</div>" +
        "<span class=\"required\">REQUIRED</span>";


    block.appendChild(title);


    const engineGrid =
        document.createElement("div");


    engineGrid.className =
        "gearbox-grid engine-grid";


    /*
       Создаём только 6 двигателей,
       соответствующих выбранному топливу.
    */

    createEngineCards(
        engineGrid,
        car.fuel
    );


    block.appendChild(
        engineGrid
    );


    constructorMain.insertBefore(
        block,
        gearboxBlock
    );
}


/* =========================================================
   СОЗДАНИЕ КАРТОЧЕК ДВИГАТЕЛЕЙ
========================================================= */

function createEngineCards(
    container,
    fuel
) {

    container.innerHTML = "";


    let engines =
        Object.keys(engineData)
        .filter(function(id) {

            return (
                engineData[id].fuel === fuel
            );

        });


    engines.forEach(function(id) {

        const engine =
            engineData[id];


        const card =
            document.createElement("div");


        card.className =
            "gearbox engine-option";


        if (
            id === car.engine
        ) {

            card.classList.add(
                "selected"
            );
        }


        card.dataset.engine =
            id;


        const title =
            document.createElement(
                "strong"
            );


        title.textContent =
            engine.name;


        const stats =
            document.createElement(
                "span"
            );


        stats.textContent =
          engine.power +
            " HP / " +
            engine.mass +
            " KG";


        const infoButton =
            document.createElement(
                "button"
            );


        infoButton.type =
            "button";


        infoButton.className =
            "gear-info";


        infoButton.textContent =
            "?";


        infoButton.dataset.info =
            engine.name +
            " • " +
            engine.volume +
            " • " +
            engine.cylinders +
            " цилиндров • " +
            engine.power +
            " л.с. • " +
            engine.mass +
            " кг";


        card.appendChild(title);

        card.appendChild(stats);

        card.appendChild(infoButton);

        container.appendChild(card);
    });


    addEngineListeners();
}


/* =========================================================
   ПЕРЕСТРОЕНИЕ ДВИГАТЕЛЕЙ
========================================================= */

function rebuildEngines() {

    const grid =
        document.querySelector(
            ".engine-grid"
        );


    if (!grid) {
        return;
    }


    /*
       Если выбранный двигатель
       не подходит новому топливу,
       выбираем первый доступный.
    */

    const available =
        Object.keys(engineData)
        .filter(function(id) {

            return (
                engineData[id].fuel ===
                car.fuel
            );

        });


    if (
        !available.includes(
            car.engine
        )
    ) {

        car.engine =
            available[0];
    }


    createEngineCards(
        grid,
        car.fuel
    );
}


/* =========================================================
   ОБРАБОТКА ДВИГАТЕЛЕЙ
========================================================= */

function addEngineListeners() {

    const engineOptions =
        document.querySelectorAll(
            ".engine-option"
        );


    engineOptions.forEach(
        function(engine) {

            engine.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target.classList.contains(
                            "gear-info"
                        )
                    ) {
                        return;
                    }


                    engineOptions.forEach(
                        function(item) {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    engine.classList.add(
                        "selected"
                    );


                    car.engine =
                        engine.dataset.engine;


                    updateCar();
                }
            );
        }
    );


    const infoButtons =
        document.querySelectorAll(
            ".engine-option .gear-info"
        );


    infoButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();


                    const parent =
                        button.closest(
                            ".gearbox"
                        );


                    if (!parent) {
                        return;
                    }


                    const old =
                        parent.querySelector(
                            ".gear-description"
                        );


                    if (old) {

                        old.remove();

                        return;
                    }


                    document
                        .querySelectorAll(
                            ".gear-description"
                        )
                        .forEach(
                            function(item) {

                                item.remove();

                            }
    );


                    const description =
                        document.createElement(
                            "div"
                        );


                    description.className =
                        "gear-description";


                    description.textContent =
                        button.dataset.info;


                    parent.appendChild(
                        description
                    );
                }
            );
        }
    );
}


/* =========================================================
   СОЗДАЁМ ДВИГАТЕЛИ
========================================================= */

createEngineBlock();


/* =========================================================
   РАСЧЁТ АВТОМОБИЛЯ
========================================================= */

function updateCar() {

    const body =
        bodyData[car.body];

    const engine =
        engineData[car.engine];

    const fuel =
        fuelData[car.fuel];

    const drive =
        driveData[car.drive];

    const gearbox =
        gearboxData[car.gearbox];


    if (
        !body ||
        !engine ||
        !fuel ||
        !drive ||
        !gearbox
    ) {

        return;
    }


    /* =====================================================
       ИТОГОВАЯ МОЩНОСТЬ
    ===================================================== */

    let power =
        engine.power *
        fuel.powerMultiplier;


    /*
       Привод тоже влияет
       на итоговую отдачу.
    */

    power =
        power *
        drive.powerMultiplier;


    power =
        Math.round(power);


    /* =====================================================
       ИТОГОВАЯ МАССА
    ===================================================== */

    const mass =
        body.mass +
        engine.mass +
        drive.mass +
        gearbox.mass;


    /* =====================================================
       РАЗГОН
    ===================================================== */

    let acceleration =
        body.baseAcceleration;


    /*
       Чем выше отношение
       мощности к массе,
       тем быстрее машина.
    */

    const powerToMass =
        power / mass;


    const performance =
        powerToMass * 100;


    acceleration -=
        performance * 0.055;


    /*
       Влияние привода.
    */

    acceleration +=
        drive.accelerationBonus;


    /*
       Влияние коробки.
    */

    acceleration +=
        gearbox.accelerationBonus;


    /*
       Более тяжёлый двигатель
       немного ухудшает разгон.
    */

    if (engine.mass > 250) {

        acceleration += 0.15;
    }


    /*
       Ограничение.
    */

    acceleration =
        Math.max(
            2.8,
            acceleration
        );


    acceleration =
        Math.min(
            15.0,
            acceleration
        );


    /* =====================================================
       DASHBOARD
    ===================================================== */

    if (powerDisplay) {

        powerDisplay.textContent =
            power;
    }


    if (accelerationDisplay) {

        accelerationDisplay.textContent =
            acceleration.toFixed(1);
    }


    if (massDisplay) {

        massDisplay.textContent =
            mass;
    }


    if (driveDisplay) {

        driveDisplay.textContent =
            car.drive;
    }


    /* =====================================================
       ПРАВАЯ ПАНЕЛЬ
    ===================================================== */

    if (
        selectedData.length >= 4
    ) {

        selectedData[0]
            .querySelector("strong")
            .textContent =
            car.body;


        selectedData[1]
            .querySelector("strong")
            .textContent =
            car.fuel;


        selectedData[2]
            .querySelector("strong")
            .textContent =
            car.drive;


        selectedData[3]
            .querySelector("strong")
    .textContent =
            car.gearbox;
    }


    if (buildName) {

        buildName.textContent =
            "PROJECT CC-001";
    }


    /*
       Сохраняем конфигурацию.
    */

    localStorage.setItem(
        "carConstructor",
        JSON.stringify(car)
    );
}


/* =========================================================
   ВЫБОР КУЗОВА
========================================================= */

bodyOptions.forEach(
    function(option) {

        option.addEventListener(
            "click",
            function() {

                bodyOptions.forEach(
                    function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                option.classList.add(
                    "selected"
                );


                const strong =
                    option.querySelector(
                        "strong"
                    );


                if (strong) {

                    car.body =
                        strong.textContent
                        .trim()
                        .toUpperCase();
                }


                updateCar();
            }
        );
    }
);


/* =========================================================
   ВЫБОР ТОПЛИВА
========================================================= */

fuelOptions.forEach(
    function(option) {

        option.addEventListener(
            "click",
            function() {

                fuelOptions.forEach(
                    function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                option.classList.add(
                    "selected"
                );


                const strong =
                    option.querySelector(
                        "strong"
                    );


                if (!strong) {
                    return;
                }


                const value =
                    strong.textContent
                    .trim()
                    .toUpperCase();


                if (value === "92") {

                    car.fuel =
                        "AI-92";

                }

                else if (value === "95") {

                    car.fuel =
                        "AI-95";

                }

                else if (value === "98") {

                    car.fuel =
                        "AI-98";

                }

                else if (value === "100") {

                    car.fuel =
                        "AI-100";

                }

                else if (
                    value === "ДТ" ||
                    value === "DIESEL"
                ) {

                    car.fuel =
                        "ДТ";
                }


                /*
                   Меняем список двигателей
                   под новое топливо.
                */

                rebuildEngines();


                updateCar();
            }
        );
    }
);


/* =========================================================
   ВЫБОР ПРИВОДА
========================================================= */

driveOptions.forEach(
    function(option) {

        option.addEventListener(
            "click",
            function() {

                driveOptions.forEach(
                    function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                option.classList.add(
                    "selected"
                );


                const strong =
                    option.querySelector(
                        "strong"
                    );


                if (strong) {

                    car.drive =
                        strong.textContent
                        .trim()
    .toUpperCase();
                }


                updateCar();
            }
        );
    }
);


/* =========================================================
   ВЫБОР КОРОБКИ
========================================================= */

gearboxOptions.forEach(
    function(option) {

        option.addEventListener(
            "click",
            function(event) {

                if (
                    event.target.classList.contains(
                        "gear-info"
                    )
                ) {
                    return;
                }


                gearboxOptions.forEach(
                    function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                option.classList.add(
                    "selected"
                );


                const strong =
                    option.querySelector(
                        "strong"
                    );


                if (strong) {

                    car.gearbox =
                        strong.textContent
                        .trim()
                        .toUpperCase();
                }


                updateCar();
            }
        );
    }
);


/* =========================================================
   ИНФОРМАЦИЯ О КОРОБКЕ
========================================================= */

document
    .querySelectorAll(
        ".gearbox:not(.engine-option) .gear-info"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();


                    const parent =
                        button.closest(
                            ".gearbox"
                        );


                    if (!parent) {
                        return;
                    }


                    const old =
                        parent.querySelector(
                            ".gear-description"
                        );


                    if (old) {

                        old.remove();

                        return;
                    }


                    document
                        .querySelectorAll(
                            ".gear-description"
                        )
                        .forEach(
                            function(item) {

                                item.remove();

                            }
                        );


                    const description =
                        document.createElement(
                            "div"
                        );


                    description.className =
                        "gear-description";


                    description.textContent =
                        button.dataset.info;


                    parent.appendChild(
                        description
                    );
                }
            );
        }
    );


/* =========================================================
   НОВЫЙ АВТОМОБИЛЬ
========================================================= */

if (headerButton) {

    headerButton.addEventListener(
        "click",
        function() {

            car.body =
                "SEDAN";

            car.fuel =
                "AI-92";

            car.engine =
                "I4-1.6-92";

            car.drive =
                "FWD";

            car.gearbox =
                "AT";


            /*
               Кузов
            */

            bodyOptions.forEach(
                function(item) {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


            if (bodyOptions[0]) {

                bodyOptions[0]
                    .classList.add(
                        "selected"
                    );
            }
    /*
               Топливо
            */

            fuelOptions.forEach(
                function(item) {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


            if (fuelOptions[0]) {

                fuelOptions[0]
                    .classList.add(
                        "selected"
                    );
            }


            /*
               Привод
            */

            driveOptions.forEach(
                function(item) {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


            if (driveOptions[0]) {

                driveOptions[0]
                    .classList.add(
                        "selected"
                    );
            }


            /*
               Коробка
            */

            gearboxOptions.forEach(
                function(item) {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


            if (gearboxOptions[0]) {

                gearboxOptions[0]
                    .classList.add(
                        "selected"
                    );
            }


            /*
               Перестраиваем двигатели.
            */

            rebuildEngines();


            updateCar();
        }
    );
}


/* =========================================================
   КНОПКА ПРОДОЛЖИТЬ
========================================================= */

if (continueButton) {

    continueButton.addEventListener(
        "click",
        function() {

            const constructor =
                document.querySelector(
                    "#constructor"
                );


            if (constructor) {

                constructor.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    );
}


/* =========================================================
   ЗАГРУЗКА СОХРАНЁННОЙ МАШИНЫ
========================================================= */

const savedCar =
    localStorage.getItem(
        "carConstructor"
    );


if (savedCar) {

    try {

        const saved =
            JSON.parse(savedCar);


        if (
            saved.body &&
            bodyData[saved.body]
        ) {

            car.body =
                saved.body;
        }


        if (
            saved.fuel &&
            fuelData[saved.fuel]
        ) {

            car.fuel =
                saved.fuel;
        }


        if (
            saved.engine &&
            engineData[saved.engine]
        ) {

            car.engine =
                saved.engine;
        }
        if (
            saved.drive &&
            driveData[saved.drive]
        ) {
            car.drive =
                saved.drive;
        }
        if (
            saved.gearbox &&
            gearboxData[saved.gearbox]
        ) {
            car.gearbox =
                saved.gearbox;
        }
    }
    catch (error) {
        console.log(
            "Ошибка загрузки сохранённого автомобиля."
        );
    }
}
/* =========================================================
   ВОССТАНОВЛЕНИЕ ВЫБОРА
========================================================= */
function restoreSelection() {
    /*
       Кузов
    */
    bodyOptions.forEach(
        function(option) {
            const strong =
                option.querySelector(
                    "strong"
                );
            if (
                strong &&
                strong.textContent
                    .trim()
                    .toUpperCase() ===
                    car.body
            ) {
                option.classList.add(
                    "selected"
                );
            }
            else {
                option.classList.remove(
                    "selected"
                );
                 }
        }
    );
    /*
       Топливо
    */
    fuelOptions.forEach(
        function(option) {
            const strong =
                option.querySelector(
                    "strong"
                );
            if (!strong) {
                return;
            }
            const value =
                strong.textContent
                .trim()
                .toUpperCase();
            let fuelName = "";
            if (value === "92") {
                fuelName =
                    "AI-92";
            }
            else if (value === "95") {
                fuelName =
                    "AI-95";
            }
            else if (value === "98") {
                fuelName =
                    "AI-98";
            }
            else if (value === "100") {
                fuelName =
                    "AI-100";
            }
            else if (
                value === "ДТ" ||
                value === "DIESEL"
            ) {
                fuelName =
                    "ДТ";
            }
            if (
                fuelName === car.fuel
            ) {
                option.classList.add(
                    "selected"
                );

            }
            else {
                option.classList.remove(
                    "selected"
                );
            }
        }
    );
    /*
       Привод
    */
    driveOptions.forEach(
        function(option) {
            const strong =
                option.querySelector(
                    "strong"
                );
            if (
                strong &&
                strong.textContent
                    .trim()
                    .toUpperCase() ===
                    car.drive
            ) {
                option.classList.add(
                    "selected"
                );
            }
            else {
                option.classList.remove(
                    "selected"
                );
            }
        }
    );
    /*
       Коробка
    */
    gearboxOptions.forEach(
        function(option) {
            const strong =
                option.querySelector(
                    "strong"
                );
            if (
                strong &&
                strong.textContent
                    .trim()
                    .toUpperCase() ===
                    car.gearbox
            ) {
                option.classList.add(
                    "selected"
                );
            }
            else {
                option.classList.remove(
                    "selected"
                );
            }
        }
    );
}
restoreSelection();
rebuildEngines();
updateCar();  