availableId = 0

function generateId(){
    availableId ++
    return availableId
}

class Teacher{

    generateWork()
    {
        return []
    }



    constructor() {}
}

class JuniorTeacher extends Teacher{

    prepaPay = 7.30
    coursPay = 17.70

    generateWork() {
        let worksToReturn = []
        const workPrepaCours = new Work("preparation", "Préparation de cours", this.prepaPay)
        const workCours = new Work("cours", "Cours",this.coursPay)
        worksToReturn.push(workPrepaCours)
        worksToReturn.push(workCours)
        return worksToReturn
    }
}

class MediorTeacher extends Teacher{

    prepaPay = 8.55
    coursPay = 17.70

    generateWork() {
        let worksToReturn = []
        const workPrepaCours = new Work("preparation", "Préparation de cours", this.prepaPay)
        const workCours = new Work("cours", "Cours",this.coursPay)
        worksToReturn.push(workPrepaCours)
        worksToReturn.push(workCours)
        return worksToReturn
    }
}

class SeniorTeacher extends Teacher{

    prepaPay = 9.80
    coursPay = 17.70

    generateWork() {
        let worksToReturn = []
        const workPrepaCours = new Work("preparation", "Préparation de cours", this.prepaPay)
        const workCours = new Work("cours", "Cours",this.coursPay)
        worksToReturn.push(workPrepaCours)
        worksToReturn.push(workCours)
        return worksToReturn
    }
}

class Accueil{

    generateWork(){
        return [];
    }

    constructor()
    {

    }
}

class JuniorAccueil extends Accueil{

    hourlyPay = 10

    generateWork() {
        let worksToReturn = []
        const workAccueil = new Work("accueil", "Gestion de l'accueil", this.hourlyPay)
        worksToReturn.push(workAccueil)
        return worksToReturn
    }
}

class MediorAccueil extends Accueil{

    hourlyPay = 11

    generateWork() {
        let worksToReturn = []
        const workAccueil = new Work("accueil", "Gestion de l'accueil", this.hourlyPay)
        worksToReturn.push(workAccueil)
        return worksToReturn
    }
}


class SeniorAccueil extends Accueil{

    hourlyPay = 12.10

    generateWork() {
        let worksToReturn = []
        const workAccueil = new Work("accueil", "Gestion de l'accueil", this.hourlyPay)
        worksToReturn.push(workAccueil)
        return worksToReturn
    }
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

const dailyPayLimit = 35.41;
const yearlyPayLimit = 1416.16;
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
