document.addEventListener("DOMContentLoaded", function () {
    const weekdays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];

    const date = new Date();
    const year = date.getFullYear();

    const monthDropDown = document.getElementById("monthDropDown");
    monthDropDown.value = date.getMonth() + 1;

    monthDropDown.addEventListener("change", function () {
        const selectedMonth = parseInt(monthDropDown.value) - 1;
        renderCalendar(selectedMonth, year, weekdays, months);
    });

    renderCalendar(date.getMonth(), year, weekdays, months);
});

function renderCalendar(month, year, weekdays, months) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay() - 1;
    const startingDays = firstDayOfWeek < 0 ? 6 : firstDayOfWeek;

    let calendarHtml = `
                     <h2 class="calendarHeader">${months[month]} ${year}</h2>
                     <table class="table table-bordered"> 
                      <thead>
                        <tr>
                          ${weekdays.map((weekday) => `<th scope="col" class="calendarDayHeader calendarDayHeader${weekday}">${weekday}</th>`).join("")}
                        </tr>
                      </thead>
                      <tbody>`;

    let dayOfMonth = 1;
    let dayOfWeek = startingDays;
    let rowHtml = "<tr>";

    if (startingDays > 0) {
        for (let i = 0; i < startingDays; i++) {
            rowHtml += `<td class="calendarDayEmpty"></td>`;
        }
    }

    while (dayOfMonth <= daysInMonth) {
        while (dayOfWeek < weekdays.length && dayOfMonth <= daysInMonth) {

            if(weekdays[dayOfWeek] === "Dimanche")
            {
                rowHtml += `<td data-day="${dayOfMonth}" class ="calendarDayHoliday" data-month="${months[month]}" data-dayname="${weekdays[dayOfWeek]}">${dayOfMonth}</td>`;
            }
            else
            {
                rowHtml += `<td  data-day="${dayOfMonth}" class ="calendarDay" data-month="${months[month]}" data-dayname="${weekdays[dayOfWeek]}">${dayOfMonth}</td>`;
            }

            dayOfMonth++;
            dayOfWeek++;
        }

        if (dayOfMonth <= daysInMonth) {
            calendarHtml += `${rowHtml}</tr>`;
            rowHtml = "<tr class='calendarDayEmpty'>";
            dayOfWeek = 0;
        }
    }

    if (dayOfWeek > 0) {
        for (let i = dayOfWeek; i < weekdays.length; i++) {
            rowHtml += `<td></td>`;
        }
        calendarHtml += `${rowHtml}</tr>`;
    }

    calendarHtml += "</tbody></table>";

    document.getElementById("calendar").innerHTML = calendarHtml;

    const calendarDays = document.querySelectorAll("#calendar td");
    calendarDays.forEach((day) => {
        if (day.innerHTML !== "") {
            day.classList.add("text-center");
        }
    });

    calendarDays.forEach((day) => {
        day.addEventListener("click", () => {

            if(day.dataset.day !=  undefined)
            {
                const dayNumber = day.dataset.day;
                const monthName = day.dataset.month;
                const dayName = day.dataset.dayname;
                console.log(`Click sur le ${dayNumber} du ${monthName} (${dayName})`);
                addWorkedDay(dayNumber, monthName, dayName);
                displayWorkedDaysRecap()
            }
        });
    });
}
