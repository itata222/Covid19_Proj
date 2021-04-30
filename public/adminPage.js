import { AdminFunctions } from './repository/AdminData.js'

const today = new Date();
const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;

const bodyContainer = document.getElementById('body-container')
const allPersonsContainer = document.getElementById('admin-persons-table-container')
const allPersonsTemplate = document.getElementById('admin-persons').innerHTML
const allCitiesContainer = document.getElementById('admin-cities-table-container')
const allCitiesTemplate = document.getElementById('admin-cities').innerHTML;
const allDailyData = document.getElementsByClassName('dailyData-value')

const adminLogoutButton = document.getElementById('admin-button')
const addPersonButton = document.getElementsByClassName('admin-persons-addPerson-button-pre')[0]
const addPersonFormContainer = document.getElementsByClassName('admin-persons-addPerson-form-container')[0];
const addPersonForm = document.getElementsByClassName('admin-persons-addPerson-form')[0];
const addDetailedPersonButton = document.getElementsByClassName('admin-persons-addPerson-button')[0];

const searchPersonInput = document.getElementsByClassName('admin-persons-search-input')[0];
const searchCityInput = document.getElementsByClassName('admin-cities-search-input')[0];
const sortCitiesSelect = document.getElementById('admin-cities-sort-select');

let filterPersonsBy = '', personsArr = [];
let filterCitiesBy = '', citiesArr = [], isMostPopulatedOnTop = true;

document.getElementById('accessibility-button').className = 'none'
const alertModal = (message) => {
    const alertModal = document.createElement('div')
    alertModal.className = "alertModal alertModal-phone";
    const alertModalContent = document.createElement('div')
    alertModalContent.className = 'alertNotLogged alertNotLogged-phone'
    alertModalContent.innerHTML = message;

    window.addEventListener('click', (event) => {
        // const currentModal = document.querySelector('.modal')
        const currentModal = document.querySelector('.modal')
        if (event.target == currentModal) {
            currentModal.remove();
        }
        if (event.target == alertModal) {
            alertModal.remove();
        }
    })
    alertModal.appendChild(alertModalContent)
    bodyContainer.appendChild(alertModal)
}

const renderData = (table) => {
    if (table === 'persons') {
        while (allPersonsContainer.children.length > 1) {
            allPersonsContainer.removeChild(allPersonsContainer.lastChild)
        }
        let personsFiltered = personsArr.filter(({ id }) => {
            return id.includes(filterPersonsBy)
        })

        const html = Mustache.render(allPersonsTemplate, {
            persons: personsFiltered
        })
        allPersonsContainer.insertAdjacentHTML('beforeend', html)
    }
    else if (table === 'cities') {
        // console.log(isMostPopulatedOnTop)

        while (allCitiesContainer.children.length > 1) {
            allCitiesContainer.removeChild(allCitiesContainer.lastChild)
        }

        let citiesFiltered = citiesArr.filter(({ city }) => {
            return city.includes(filterCitiesBy)
        })

        // console.log(citiesFiltered)
        citiesFiltered.sort((a, b) => {
            a.numberOfResidents = parseFloat(a.numberOfResidents)
            b.numberOfResidents = parseFloat(b.numberOfResidents)
            // console.log(isMostPopulatedOnTop, a.numberOfResidents, b.numberOfResidents)
            if (isMostPopulatedOnTop) {
                if (a.numberOfResidents > b.numberOfResidents) return 1
                if (a.numberOfResidents < b.numberOfResidents) return -1
                return 0
            } else {
                if (a.numberOfResidents > b.numberOfResidents) return -1
                if (a.numberOfResidents > b.numberOfResidents) return 1
                return 0
            }
        })

        // console.log(citiesFiltered)
        const html = Mustache.render(allCitiesTemplate, {
            cities: citiesFiltered
        })
        allCitiesContainer.insertAdjacentHTML('beforeend', html)

        searchCityInput.addEventListener('input', () => {
            filterCitiesBy = searchCityInput.value.trim().toLowerCase()
            renderData('cities')
        })

        sortCitiesSelect.addEventListener('change', () => {
            isMostPopulatedOnTop = sortCitiesSelect.value === 'most-residents-AS' ? true : false
            renderData('cities')
        })
    }
}

const updateDailyDataFunc = async () => {
    allDailyData.forEach((data) => {
        data.setAttribute('contenteditable', 'true')
    });
    data = {
        newVerified: allDailyData[1].value,
        activePatients: allDailyData[2].value,
        isolationAtHotels: allDailyData[3].value,
        isolationAtHospitals: allDailyData[4].value,
        isolationAtHome: allDailyData[5].value,
        severePatients: allDailyData[6].value,
        criticalPatients: allDailyData[7].value,
        ventilatedPatients: allDailyData[8].value,
        vaccinatedFirst: allDailyData[9].value,
        vaccinatedSecond: allDailyData[10].value,
        totalDeaths: allDailyData[11].value,
        numberOfTests: allDailyData[12].value
    }
    let updateDailyDataResponse = await AdminFunctions.AdminFuncs.updateDailyData(data)
    console.log(updateDailyDataResponse)
    // if (good)
    //     alertModal('Updated Daily Data Successfully')
    // else
    //     alertModal(e.message)
}
const getAllCitiesDataFunc = async () => {

    let response = await AdminFunctions.AdminFuncs.getAllCitiesData();
    if (response.citiesToday) {
        citiesArr = response.citiesToday
        renderData('cities')

        const allCitiesObjs = document.getElementsByClassName('admin-city-obj')
        const allCitiessData = document.getElementsByClassName('city-data')
        const saveCitiesDetailsButtons = document.getElementsByClassName('admin-city-saveButton');
        const citiesIds = document.getElementsByClassName('city-id');


        let allCitiesIds = Array.from(citiesIds)
        let allSaveCitiesDetailsButtons = Array.from(saveCitiesDetailsButtons)
        let allCitiesDatasArr = Array.from(allCitiessData);
        let allCitiesObjsArr = Array.from(allCitiesObjs);


        allCitiesDatasArr.forEach((cityData) => {
            cityData.setAttribute('contenteditable', 'true')
        });

        for (let i = 0; i < allCitiesObjsArr.length; i++) {
            allCitiesObjsArr[i].addEventListener('click', (e) => {
                e.stopPropagation();

                if (!e.target.className.includes('city-data') && !e.target.className.includes('admin-city-saveButton')) {
                    allCitiesObjsArr[i].classList.toggle('show-city')
                    const cityObjDataHeaders = Array.from(allCitiesObjsArr[i].children)
                    for (let j = 2; j < cityObjDataHeaders.length; j++)
                        cityObjDataHeaders[j].classList.toggle('none')
                    if (allCitiesObjsArr[i].className.includes('show-city')) {
                        const spanBefores = document.querySelectorAll('.show-city .span-before-C')
                        let spanBeforesArr = Array.from(spanBefores)
                        spanBeforesArr.forEach(span => {
                            span.classList.remove('none')
                        })
                    }
                    else {
                        const spanBefores = document.querySelectorAll('.span-before-C')
                        let spanBeforesArr = Array.from(spanBefores)
                        spanBeforesArr.forEach(span => {
                            span.classList.add('none')
                        })
                    }
                }
            })
        }

        allSaveCitiesDetailsButtons.forEach((saveButton, i) => {

            saveButton.addEventListener('click', async (e) => {
                e.preventDefault();
                const data = {
                    date: todayDate,
                    numberOfResidents: allCitiesIds[i].parentElement.parentElement.children[1].children[0].innerHTML,
                    currentActivePatients: allCitiesIds[i].parentElement.parentElement.children[2].children[1].innerHTML,
                    numberOfTests: allCitiesIds[i].parentElement.parentElement.children[3].children[1].innerHTML,
                    numberOfPositiveTests: allCitiesIds[i].parentElement.parentElement.children[4].children[1].innerHTML,
                    governmentScore: allCitiesIds[i].parentElement.parentElement.children[5].children[1].innerHTML,
                    dailyScore: allCitiesIds[i].parentElement.parentElement.children[6].children[1].innerHTML
                }

                let updateCityDataResponse = await AdminFunctions.AdminFuncs.updateCityData(allCitiesIds[i].innerHTML, data)
                // console.log(updateCityDataResponse)
                if (!updateCityDataResponse.status)
                    alertModal('Updated City Successfully')
                else
                    alertModal(error)

            })
        })
    }
    else
        alertModal(response)
}

const getAllPersons = async () => {
    let response = await AdminFunctions.AdminFuncs.getAllPersons()

    if (!response.status) {
        personsArr = response;
        renderData('persons')

        const allPersonsObjs = document.getElementsByClassName('admin-person-obj')
        const allpersonsData = document.getElementsByClassName('person-data')
        const savePersonDetailsButtons = document.getElementsByClassName('admin-person-saveButton');
        const personsIds = document.getElementsByClassName('person-id')

        let allPersonsIds = Array.from(personsIds)
        let allSavePersonsDetailsButtons = Array.from(savePersonDetailsButtons)
        let allpersonsDatasArr = Array.from(allpersonsData);
        let allPersonsObjsArr = Array.from(allPersonsObjs);


        allpersonsDatasArr.forEach((personData) => {
            personData.setAttribute('contenteditable', 'true')
        });

        for (let i = 0; i < allPersonsObjsArr.length; i++) {
            allPersonsObjsArr[i].addEventListener('click', (e) => {
                e.stopPropagation()
                if (!e.target.className.includes('person-data') && !e.target.className.includes('admin-person-saveButton')) {
                    allPersonsObjsArr[i].classList.toggle('show-person')

                    const childrens = Array.from(allPersonsObjsArr[i].children)
                    for (let j = 2; j < childrens.length; j++) {
                        childrens[j].classList.toggle('none')
                    }

                    if (allPersonsObjsArr[i].className.includes('show-person')) {
                        const spanBefores = document.querySelectorAll('.show-person .span-before')
                        let spanBeforesArr = Array.from(spanBefores)
                        spanBeforesArr.forEach(span => {
                            span.classList.remove('none')
                        })
                    } else {
                        const spanBefores = document.querySelectorAll('.span-before')
                        let spanBeforesArr = Array.from(spanBefores)
                        spanBeforesArr.forEach(span => {
                            span.classList.add('none')
                        })
                    }
                }
            })
        }

        // console.log(allPersonsIds, allSavePersonsDetailsButtons)

        allSavePersonsDetailsButtons.forEach((saveButton, i) => {
            saveButton.addEventListener('click', async (e) => {
                e.preventDefault();

                const data = {
                    city: allPersonsIds[i].parentElement.parentElement.children[2].children[1].innerHTML,
                    phone: allPersonsIds[i].parentElement.parentElement.children[3].children[1].innerHTML,
                    condition: allPersonsIds[i].parentElement.parentElement.children[4].children[1].innerHTML,
                    qurantinedAt: allPersonsIds[i].parentElement.parentElement.children[5].children[1].innerHTML,
                    vaccinated: parseInt(allPersonsIds[i].parentElement.parentElement.children[6].children[1].innerHTML)
                }
                let updatedPersonResponse = await AdminFunctions.AdminFuncs.updatePersonData(allPersonsIds[i].innerHTML, data)
                if (!updatedPersonResponse.status)
                    alertModal('Updated Person Successfully')
                else
                    alertModal(updatedPerson + 'failed')
            })
        })
    }
    else
        alertModal(response)
}
getAllPersons();
getAllCitiesDataFunc();

addPersonButton.addEventListener('click', (e) => {
    e.preventDefault();
    addPersonButton.classList.toggle('margin')
    addPersonFormContainer.classList.toggle('show-form');
})
adminLogoutButton.addEventListener('click', async (e) => {
    e.preventDefault()
    let logoutResponse = await AdminFunctions.AdminFuncs.logoutAdminFunc()
    if (!logoutResponse.status)
        window.location.href = '/home.html';
    else
        alertModal('something went wrong')
})

addDetailedPersonButton.addEventListener('click', async (e) => {
    e.preventDefault()
    const data = {
        id: addPersonForm.children[0].value,
        name: addPersonForm.children[1].value,
        phone: addPersonForm.children[2].value,
        condition: addPersonForm.children[3].value,
        quarantinedAt: addPersonForm.children[4].value,
        vaccinated: addPersonForm.children[5].value,
        city: addPersonForm.children[6].value
    }
    let personCreated = await AdminFunctions.AdminFuncs.createPerson(data)
    if (!personCreated.status)
        alertModal(personCreated.name + ' added successfully')
    else
        alertModal(personCreated.name + 'NOT added successfully')
})

searchPersonInput.addEventListener('input', () => {
    filterPersonsBy = searchPersonInput.value.trim().toLowerCase()
    renderData('persons')
})
