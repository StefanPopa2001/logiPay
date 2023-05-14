availableId = 0

function generateId(){
    availableId ++
    return availableId
}

class Teacher{

    prepaPay;
    coursPay;

    generateWork() {
        let worksToReturn = []
        const workPrepaCours = new Work("preparation", "Préparation de cours", this.prepaPay)
        const workCours = new Work("cours", "Cours",this.coursPay)
        worksToReturn.push(workPrepaCours)
        worksToReturn.push(workCours)
        return worksToReturn
    }

    constructor() {}
}

class JuniorTeacher extends Teacher{

    prepaPay = 7.30
    coursPay = 17.70

}

class MediorTeacher extends Teacher{

    prepaPay = 9.80
    coursPay = 17.70

}

class SeniorTeacher extends Teacher{

    prepaPay = 12.30
    coursPay = 17.70

}

class Accueil{

    generateWork() {
        let worksToReturn = []
        const workAccueil = new Work("accueil", "Gestion de l'accueil", this.hourlyPay)
        worksToReturn.push(workAccueil)
        return worksToReturn
    }

    constructor(){}
}

class JuniorAccueil extends Accueil{

    hourlyPay = 10
}

class MediorAccueil extends Accueil{

    hourlyPay = 11
}


class SeniorAccueil extends Accueil{

    hourlyPay = 12.10
}

class Work{
    id;
    type;
    description;
    pay;

    constructor(typeOfWork, description, pay)
    {
        this.id = generateId()
        this.type = typeOfWork
        this.description = description
        this.pay = pay
    }
}

const dailyPayLimit = 40.67;
const yearlyPayLimit =  1626.77;
workedDaysArray = [];

//Util
function getLastDayOfMonth(monthName, year) {
    const monthIndex = new Date(Date.parse(monthName + " 1, " + year)).getMonth();
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    return lastDay;
}

class workDay{
    id;
    dayNumber;
    month;
    dayName;
    year;
    workArray;

    constructor(dayNumber, month, dayName) {
        this.id = generateId();
        this.dayNumber = parseInt(dayNumber);
        this.month = month;
        this.dayName = dayName;
        this.year = new Date().getFullYear();
        this.workArray = [];
    }

    equals(workDay)
    {
        return(this.dayNumber == workDay.dayNumber && this.month == workDay.month && this.year == workDay.year)
    }


    cutExtraWork()
    {
        let extraWorkToReturn = []
        while(this.calculatePay() > dailyPayLimit)
        {
            extraWorkToReturn.push(this.workArray.pop())
        }
        return extraWorkToReturn;
    }

    addWork(work)
    {
        this.workArray.push(work)
    }

    calculatePay()
    {
        let totalPay = 0;
        this.workArray.forEach(work => {
            totalPay += work.pay;
        })
        return totalPay;
    }

    checkIfIsAfter(workDay)
    {
        //this day is after the day entered?
        return(this.dayNumber == workDay.dayNumber+1)
    }


    returnNextDay() {
        const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        let currentDate = new Date(this.year, monthNames.indexOf(this.month), this.dayNumber);
        let nextDate = new Date(currentDate.getTime() + 86400000); // Add 1 day in milliseconds

        // Skip Sundays
        while (nextDate.getDay() === 0) { // 0 represents Sunday
            nextDate = new Date(nextDate.getTime() + 86400000); // Add 1 day in milliseconds
        }

        const nextDayNumber = nextDate.getDate();
        const nextMonth = monthNames[nextDate.getMonth()];
        const nextYear = nextDate.getFullYear();
        const nextDayName = nextDate.toLocaleString('fr-FR', { weekday: 'long' });

        return new workDay(nextDayNumber, nextMonth, nextDayName);
    }


    isSunday() {
        // assuming this.year, this.month and this.dayNumber exist and are in the correct format
        const date = new Date(this.year, this.month - 1, this.dayNumber); // month is 0-indexed
        return date.getDay() === 0; // 0 represents Sunday
    }

}


async function spreadWork() {
    let index = 0;

    while (index < workedDaysArray.length) {
        let dayOfWork = workedDaysArray[index];
        let extraWork = dayOfWork.cutExtraWork();

        if (extraWork.length > 0) {
            let nextDay = dayOfWork.returnNextDay();

            // Skip if the next day is Sunday
            if (nextDay.isSunday()) {
                index++;
                continue;
            }

            let existingNextDay = workedDaysArray.find(day => day.equals(nextDay));
            if (existingNextDay) {
                extraWork.forEach(work => existingNextDay.addWork(work));
            } else {
                extraWork.forEach(work => nextDay.addWork(work));
                if (!workedDaysArray.some(day => day.equals(nextDay))) {
                    workedDaysArray.push(nextDay);
                }
                // Sort the array after pushing the new day
                workedDaysArray.sort((a, b) => {
                    if (a.year !== b.year) {
                        return a.year - b.year;
                    }
                    if (a.month !== b.month) {
                        return new Date(Date.parse(a.month + " 1," + a.year)).getMonth() - new Date(Date.parse(b.month + " 1," + b.year)).getMonth();
                    }
                    return a.dayNumber - b.dayNumber;
                });
            }
        } else {
            index++;
        }
    }
}


//Generate a day based on the user's click on the calendar
async function addWorkedDay(dayNumber, monthName, dayName)
{
    //alert(dayNumber+" "+monthName+" "+dayName);
    const newWorkDay = new workDay(dayNumber, monthName, dayName);
    newWorkDayIsAlreadyPresent = false
    workedDaysArray.forEach(dayOfWork => {
        //console.log(dayOfWork.eqauls(newWorkDay))
        if(dayOfWork.equals(newWorkDay))
        {
            newWorkDayIsAlreadyPresent = true
            generatedWork = addWork()
            generatedWork.forEach(work => {
                dayOfWork.addWork(work)
            })
            return 0
        }
    })
    if(!newWorkDayIsAlreadyPresent)
    {
        workToAdd = new workDay(dayNumber, monthName, dayName)
        workedDaysArray.push(workToAdd)
        generatedWork = addWork()
        generatedWork.forEach(work => {
            workToAdd.addWork(work)
        })
    }

}


//Generate and returns work value based on the dropdowns
function addWork()
{
    const typeOfWork = document.getElementById("functionDropDown").value;
    const experienceOfWork = document.getElementById("levelDropDown").value;

    if(typeOfWork == 0 || experienceOfWork == 0)
    {
        alert("wtf")
    }

    let functionWorked = ""
    if(typeOfWork === "professeur")
    {
        switch (experienceOfWork)
        {
            case "junior":
                functionWorked = new JuniorTeacher()
                break;
            case "medior":
                functionWorked = new MediorTeacher()
                break;
            case "senior":
                functionWorked = new SeniorTeacher()
                break;
        }
    }
    else if(typeOfWork === "accueil")
    {
        switch (experienceOfWork)
        {
            case "junior":
                functionWorked = new JuniorAccueil()
                break;
            case "medior":
                functionWorked = new MediorAccueil()
                break;
            case "senior":
                functionWorked = new SeniorAccueil()
                break;
        }
    }

    console.log(`Generated work : `+JSON.stringify(functionWorked.generateWork()))
    return functionWorked.generateWork();
}



//Display all the days
async function displayWorkedDaysRecap(){

    await spreadWork()

    stats = {
        preparations : 0,
        cours: 0,
        accueil : 0,
        total : 0,
    }

    const workedDaysDiv = document.getElementById("workedDaysList");
    workedDaysDiv.innerHTML = "";

    workedDaysArray.forEach(dayOfWork => {

        const dayDiv = document.createElement("div");
        dayDiv.innerText = `${dayOfWork.dayName} ${dayOfWork.dayNumber} ${dayOfWork.month}`;
        workedDaysDiv.appendChild(dayDiv)
        dayDiv.classList.add("workedDayDiv")

        dayOfWork.workArray.forEach((work, index) => {

            console.log(dayOfWork);

            const workDiv = document.createElement("div");
            workDiv.classList.add("workEntryDiv")
            workDiv.innerText = `${work.description} (${work.pay}€)`;
            dayDiv.appendChild(workDiv)

            let deleted = false;
            //delete button
            const deleteButton = document.createElement("button");
            deleteButton.innerText = "X";
            deleteButton.classList.add("deleteButton");
            workDiv.appendChild(deleteButton);

            //remove work day
            deleteButton.addEventListener("click", () => {

                //dayOfWork.workArray.splice(index, 1);

                dayOfWork.workArray.splice(index);
                deleted = true;

                workDiv.remove();

                if (work.type == "cours") {
                    stats.cours--;
                } else if (work.type == "accueil") {
                    stats.accueil--;
                } else if (work.type == "preparation") {
                    stats.preparations--;
                }
                stats.total -= work.pay;
                recapDivText();

            });

            if (!deleted) {
                //add work day
                if (work.type == "cours") {
                    stats.cours++
                }

                else if (work.type == "accueil") {
                    stats.accueil++
                }
                else if (work.type == "preparation") {
                    stats.preparations++
                }

                stats.total += work.pay
            }
            recapDivText();
        })
    })

    recapDivToAppend = document.getElementById("recapDiv")
    recapDivToAppend.innerText = ""
    recapDiv = document.createElement("div");
    recapDiv.classList.add("recapDiv")
    recapDiv.innerText = "Heures d'Accueil : "+stats.accueil + " Nombre de Cours : "+stats.cours+" Nombre de Preparations : "+stats.preparations+" Défraiement total : "+Math.round(stats.total)+"€"
    recapDivToAppend.append(recapDiv)


    payGrid= document.getElementById("defraiementPayGrid")
    payGrid.innerHTML =""

    const table = document.createElement('table');
    table.className="table"
    const headerRow = document.createElement('tr');
    const headers = ['DATE', 'OBJET', 'DEFRAIMENT', 'NOMBRE', 'TOTAL'];

    for (let header of headers) {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    let totalWorkCount = 0;
    let totalWorkPay = 0;

    for (let workDay of workedDaysArray) {
        let workCount = {};
        let workPayTotal = {};

        workDay.workArray.forEach(work=>{
            if(work.description in workCount){
                workCount[work.description]++;
                workPayTotal[work.description] += work.pay;
            }
            else{
                workCount[work.description] = 1;
                workPayTotal[work.description] = work.pay;
            }
        });

        for(let workDescription in workCount){
            const row = document.createElement('tr');
            const dateCell = document.createElement('td');
            dateCell.textContent = workDay.dayNumber+" "+workDay.month+" "+workDay.year;
            row.appendChild(dateCell);

            const objectCell = document.createElement('td');
            objectCell.textContent = workDescription;
            row.appendChild(objectCell);

            const defraimentCell = document.createElement('td');
            defraimentCell.textContent = workPayTotal[workDescription];
            row.appendChild(defraimentCell);

            const nombreCell = document.createElement('td');
            nombreCell.textContent = workCount[workDescription];
            row.appendChild(nombreCell);

            const totalCell = document.createElement('td');
            totalCell.textContent = workPayTotal[workDescription];
            row.appendChild(totalCell);

            totalWorkCount += workCount[workDescription];
            totalWorkPay += workPayTotal[workDescription];

            table.appendChild(row);
        }
    }

    // Add a final row with the totals
    const totalRow = document.createElement('tr');
    totalRow.appendChild(document.createElement('td')); // Empty cell
    totalRow.appendChild(document.createElement('td')); // Empty cell
    totalRow.appendChild(document.createElement('td')); // Empty cell


    const totalNombreCell = document.createElement('td');
    totalNombreCell.textContent = totalWorkCount;
    totalRow.appendChild(totalNombreCell);

    const grandTotalCell = document.createElement('td');
    grandTotalCell.textContent = totalWorkPay.toFixed(2);
    totalRow.appendChild(grandTotalCell);

    table.appendChild(totalRow);


    payGrid.appendChild(table)
}