const getCitiesURL = '/Covid19-site/getDayDataCities';


export class CityDataFunctions {

    static cityDailyDataFuncs = null;

    static get CityDailyDataFuncs() {
        if (this.cityDailyDataFuncs == null) {
            this.cityDailyDataFuncs = new CityDataFunctions();
        }
        return this.cityDailyDataFuncs;
    }

    getAllCitiesDailyStats() {
        return new Promise((resolve, reject) => {
            fetch(getCitiesURL).then((res) => {
                if (res.ok)
                    return res.json()
                else
                    throw res
            }).then(({ citiesToday, citiesWeekAgo }) => {
                citiesToday.forEach(cityToday => {
                    citiesWeekAgo.forEach(cityWeekAgo => {
                        if (cityToday.city === cityWeekAgo.city) {
                            const newVerifiedFor10K = String((cityToday.numberOfPositiveTests - cityWeekAgo.numberOfPositiveTests) / 100)
                            cityToday.newVerifiedFor10K = newVerifiedFor10K.includes('-') ? newVerifiedFor10K.substr(0, 5) : newVerifiedFor10K.substr(0, 4)
                            cityToday.percentagePositive = Math.floor(cityToday.numberOfPositiveTests * 100 / cityToday.numberOfTests) + '%'
                            cityToday.changeVerified = Math.floor(cityToday.currentActivePatients * 100 / cityWeekAgo.currentActivePatients) + '%';
                        }
                    })
                })
                resolve({ citiesToday, citiesWeekAgo })
            }).catch(e => reject(e))
        })
    }
}

