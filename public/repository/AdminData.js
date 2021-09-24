const adminLoginURL = '/Covid19-site/Admin/login-admin';
const getPersonsURL = '/Covid19-site/Admin/getAllPersons';
const getCitiesURL = '/Covid19-site/getDayDataCities';
const logoutAdminURL = '/Covid19-site/Admin/logout-admin';
const updatePersonData = '/Covid19-site/Admin/updatePersonData?id=';
const updateCityData = '/Covid19-site/Admin/updateCityData?city=';
const createPersonURL = '/Covid19-site/Admin/createPerson';
const updateDailyData = '/Covid19-site/Admin/updateDailyData';

const token = localStorage.getItem('token')

export class AdminFunctions {
    static adminFuncs = null;

    static get AdminFuncs() {
        if (this.adminFuncs == null) {
            this.adminFuncs = new AdminFunctions();
        }
        return this.adminFuncs;
    }

    loginAdminFunc(data) {
        return new Promise((resolve, reject) => {
            fetch(adminLoginURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => {
                    if (response.ok)
                        return response.json()
                    else
                        throw response
                })
                .then(res => {
                    resolve(res)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    logoutAdminFunc() {
        return new Promise((resolve, reject) => {
            fetch(logoutAdminURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({}),
            })
                .then(response => response.json())
                .then(data => {
                    resolve(data)
                })
                .catch((error) => {
                    reject(error)
                });
        })
    }

    updateDailyData() {
        return new Promise((resolve, reject) => {
            fetch(updateDailyData, {
                method: 'PATCH',
                headers: {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                }
            }).then(res => res.json())
                .then((resJson) => {
                    resolve(resJson)
                })
                .catch((e) => {
                    reject(e.message)
                })
        })

    }

    getAllCitiesData() {
        return new Promise((resolve, reject) => {
            fetch(getCitiesURL).then((res) => {
                if (res.ok)
                    return res.json()
                else
                    throw res;
            }).then(({ citiesToday, citiesWeekAgo }) => {
                resolve({ citiesToday, citiesWeekAgo })
            }).catch((e) => {
                reject(e.message)
            })
        })
    }

    updateCityData(city, data) {
        return new Promise((resolve, reject) => {
            fetch((updateCityData + city), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            }).then((res) => {
                if (res.ok)
                    return res.json();
                else
                    throw res
            }).then((resJson) => {
                resolve(resJson)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    getAllPersons() {
        return new Promise((resolve, reject) => {
            fetch(getPersonsURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }).then((res) => {
                if (res.ok)
                    return res.json()
                else
                    throw res
            }).then((persons) => {
                resolve(persons)
            }).catch(e => reject(e))
        })
    }

    updatePersonData(id, data) {
        return new Promise((resolve, reject) => {
            fetch((updatePersonData + id), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            }).then((res) => {
                if (res.ok)
                    return res.json();
                else
                    throw res
            }).then((resJson) => {
                resolve(resJson)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    createPerson(data) {
        return new Promise((resolve, reject) => {
            fetch(createPersonURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            }).then((res) => {
                if (res.ok)
                    return res.json()
                else
                    throw res
            }).then((person) => {
                resolve(person)
            }).catch((e) => {
                reject(e.message)
            })
        })
    }
}