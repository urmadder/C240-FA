// ==========================
// Schedule Helper
// ==========================

export function getTodaySchedule() {

    return JSON.parse(

        localStorage.getItem("todaySchedule") || "[]"

    );

}

export function saveTodaySchedule(schedule) {

    localStorage.setItem(

        "todaySchedule",

        JSON.stringify(schedule)

    );

}
