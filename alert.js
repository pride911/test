"use strict";

// Получаем элементы интерфейса (DOM):
// resultElement - строка с текущим числом,
// historyElement - строка с предыдущим числом и оператором,
// buttonsContainer - контейнер, где лежат все кнопки.
const resultElement = document.getElementById("result");
const historyElement = document.getElementById("history");
const buttonsContainer = document.querySelector(".buttons");

// Объект состояния приложения (state):
// current - текущее значение на экране (строка, чтобы удобно собирать "12.34"),
// previous - предыдущее значение перед вычислением,
// operator - выбранный оператор (+, -, *, /, %),
// shouldResetCurrent - флаг: нужно ли начать ввод нового числа с нуля.
const state = {
    current: "0",
    previous: null,
    operator: null,
    shouldResetCurrent: false
};

// Function Expression (функция как значение переменной).
// Здесь показываю этот стиль специально для обучения.
const toNumber = function (value) {
    return Number(value);
};

// Преобразует число в строку для вывода.
// Если получили бесконечность/NaN, возвращаем "Ошибка".
function formatNumber(value) {
    const number = toNumber(value); // Преобразование типов: string -> number
    if (!Number.isFinite(number)) {
        return "Ошибка";
    }

    return number.toString(); // number -> string
}

// Обновляет интерфейс после любого действия пользователя.
function updateScreen() {
    resultElement.textContent = state.current;

    // Условное ветвление if/else:
    // если есть прошлое значение и оператор, показываем "12 +",
    // иначе очищаем строку истории.
    if (state.previous !== null && state.operator) {
        historyElement.textContent = `${state.previous} ${state.operator}`;
    } else {
        historyElement.textContent = "";
    }
}

// Обрабатывает ввод цифры.
function inputNumber(number) {
    // Если только что выбрали оператор или получили результат,
    // следующий ввод должен начать новое число.
    if (state.shouldResetCurrent) {
        state.current = number;
        state.shouldResetCurrent = false;
        return;
    }

    // Тернарный оператор ? :
    // если на экране "0", заменяем его,
    // иначе дописываем цифру справа.
    state.current = state.current === "0" ? number : state.current + number;
}

// Добавляет десятичную точку.
function inputDecimal() {
    if (state.shouldResetCurrent) {
        state.current = "0.";
        state.shouldResetCurrent = false;
        return;
    }

    // Логический оператор ! и метод includes:
    // точку можно добавить только один раз.
    if (!state.current.includes(".")) {
        state.current += ".";
    }
}

// Полный сброс калькулятора.
function clearAll() {
    state.current = "0";
    state.previous = null;
    state.operator = null;
    state.shouldResetCurrent = false;
}

// Удаляет последний символ (кнопка DEL).
function deleteLast() {
    if (state.shouldResetCurrent) {
        state.current = "0";
        state.shouldResetCurrent = false;
        return;
    }

    if (state.current.length <= 1) {
        state.current = "0";
    } else {
        state.current = state.current.slice(0, -1);
    }
}

// Выполняет вычисление по выбранному оператору.
function calculate() {
    // Если нечего считать, выходим.
    if (state.previous === null || !state.operator) {
        return;
    }

    // Преобразование типов к number для математики.
    const prev = toNumber(state.previous);
    const current = toNumber(state.current);
    let output = 0;

    // switch - удобная конструкция, когда много вариантов одного условия.
    switch (state.operator) {
        case "+":
            output = prev + current;
            break;
        case "-":
            output = prev - current;
            break;
        case "*":
            output = prev * current;
            break;
        case "/":
            // Оператор сравнения === (строгое сравнение без приведения типов).
            if (current === 0) {
                state.current = "Ошибка";
                state.previous = null;
                state.operator = null;
                state.shouldResetCurrent = true;
                return;
            }
            output = prev / current;
            break;
        case "%":
            output = prev % current;
            break;
        default:
            return;
    }

    state.current = formatNumber(output);
    state.previous = null;
    state.operator = null;
    state.shouldResetCurrent = true;
}

// Сохраняет оператор и готовит ввод второго числа.
function setOperator(nextOperator) {
    // Если оператор уже есть и пользователь ввел второе число,
    // сначала считаем промежуточный результат.
    if (state.operator && !state.shouldResetCurrent) {
        calculate();
    }

    // Оператор нулевого слияния ??:
    // если справа null/undefined, берем "0".
    state.previous = state.current ?? "0";
    state.operator = nextOperator;
    state.shouldResetCurrent = true;

    // Оператор нулевого присваивания ??=:
    // присвоит значение только если там null/undefined.
    state.previous ??= "0";
}

// Стрелочная функция (arrow function) в обработчике событий.
buttonsContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
        return;
    }

    // data-action/data-value приходят как строки или undefined.
    const action = button.dataset.action;
    const value = button.dataset.value ?? "";

    switch (action) {
        case "number":
            inputNumber(value);
            break;
        case "decimal":
            inputDecimal();
            break;
        case "operator":
            setOperator(value);
            break;
        case "equals":
            calculate();
            break;
        case "clear":
            clearAll();
            break;
        case "delete":
            deleteLast();
            break;
        default:
            return;
    }

    updateScreen();
});

// Первый рендер экрана при загрузке страницы.
updateScreen();

/*
Учебные мини-примеры по темам, которые ты сейчас изучаешь.
Они не влияют на калькулятор, это как шпаргалка.

1) Взаимодействие: alert, prompt, confirm
--------------------------------------------------
alert("Привет!"); // Показывает сообщение
const name = prompt("Как тебя зовут?", "Гость"); // Возвращает строку или null
const isReady = confirm("Начать?"); // true/false

2) Циклы while и for
--------------------------------------------------
let i = 0;
while (i < 3) {
    i += 1;
}

for (let j = 0; j < 3; j += 1) {
    // j = 0, 1, 2
}

3) Функции и особенности JavaScript
--------------------------------------------------
// function declaration
function sum(a, b) {
    return a + b;
}

// function expression
const multiply = function (a, b) {
    return a * b;
};

// arrow function
const divide = (a, b) => (b === 0 ? null : a / b);

// Особенность JS: динамическая типизация
// "5" + 1 => "51" (конкатенация)
// "5" - 1 => 4    (приведение к числу)
*/