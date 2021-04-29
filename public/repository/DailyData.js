
const getTodayDataUrl = '/Covid19-site/GetDailyStatics';
const getPeriodDataURL = '/Covid19-site/GetDataPeriodOf?timeframe=';


export class DailyDataFunctions {

    static dailyDataFuncs = null;

    static get DailyDataFuncs() {
        if (this.dailyDataFuncs == null) {
            this.dailyDataFuncs = new DailyDataFunctions();
        }
        return this.dailyDataFuncs;
    }

    getTodayData() {
        return new Promise((resolve, reject) => {
            fetch(getTodayDataUrl).then((res) => {
                if (res.ok)
                    return res.json();
                else
                    throw res;
            }).then(({ todayData, yesterdayData, allTimeSumVerified, alltimeVaccinatedFirst, alltimeVaccinatedSecond, personsMidnight }) => {
                let newPatientsMidnight = 0, severePatientsMidnight = 0, vaccinatedFirstFromMidnight = 0, vaccinatedSecondFromMidnight = 0;
                personsMidnight.forEach(person => {
                    if (person.condition.trim() !== 'healthy')
                        newPatientsMidnight++;
                    if (person.condition.trim() === 'severe') {
                        severePatientsMidnight++;
                    }
                    if (person.vaccinated === 1)
                        vaccinatedFirstFromMidnight++;
                    if (person.vaccinated === 2)
                        vaccinatedSecondFromMidnight++;
                });
                todayData.allTimeSumVerified = allTimeSumVerified;
                todayData.alltimeVaccinatedFirst = alltimeVaccinatedFirst;
                todayData.alltimeVaccinatedSecond = alltimeVaccinatedSecond;
                todayData.personsMidnight = personsMidnight;
                todayData.severePatientsMidnight = severePatientsMidnight;
                todayData.newPatientsMidnight = newPatientsMidnight;
                todayData.vaccinatedFirstFromMidnight = vaccinatedFirstFromMidnight;
                todayData.vaccinatedSecondFromMidnight = vaccinatedSecondFromMidnight;
                resolve({ todayData, yesterdayData })
            }).catch((e) => {
                reject(e)
            })
        });
    }

    getDataOfSpecificTimeFrame(timeframe) {

        return new Promise((resolve, reject) => {
            fetch(getPeriodDataURL + timeframe)
                .then((res) => {
                    if (res.ok)
                        return res.json()
                    else
                        throw res
                }).then((data) => {
                    resolve(data)
                }).catch((e) => {
                    reject(e)
                })

        })
    }
}