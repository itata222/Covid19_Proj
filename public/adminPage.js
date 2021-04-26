const token = localStorage.getItem('token')
// console.log(token)
const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
const today = new Date();
const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;

const bodyContainer = document.getElementById('body-container')
const allPersonsContainer = document.getElementById('admin-persons-table-container')
const allPersonsTemplate = document.getElementById('admin-persons').innerHTML
const allCitiesContainer = document.getElementById('admin-cities-table-container')
const allCitiesTemplate = document.getElementById('admin-cities').innerHTML

const adminLogoutButton = document.getElementById('admin-button')
const addPersonButton = document.getElementsByClassName('admin-persons-addPerson-button-pre')[0]
const addPersonFormContainer = document.getElementsByClassName('admin-persons-addPerson-form-container')[0];
const addPersonForm = document.getElementsByClassName('admin-persons-addPerson-form')[0];
const addDetailedPersonButton = document.getElementsByClassName('admin-persons-addPerson-button')[0];

const searchPersonInput = document.getElementsByClassName('admin-persons-search-input')[0];
const searchCityInput = document.getElementsByClassName('admin-cities-search-input')[0];
const sortCitiesSelect = document.getElementById('admin-cities-sort-select')
const selectSortPersons = document.getElementById('admin-persons-sort-select')
let filterPersonsBy = '', personsArr = [], isAToZOrder = true;
let filterCitiesBy = '', citiesArr = [], isMostPopulatedOnTop = true;
const searchPersonButton = document.getElementsByClassName('admin-persons-search-button')[0];

const getPersonsURL = '/Covid19-site/Admin/getAllPersons';
const getCitiesURL = '/Covid19-site/getDayDataCities';
const logoutAdminURL = '/Covid19-site/Admin/logout-admin';
const updatePersonData = '/Covid19-site/Admin/updatePersonData?id=';
const updateCityData = '/Covid19-site/Admin/updateCityData?city=';
const createPersonURL = '/Covid19-site/Admin/createPerson'

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
    }
}

fetch(getCitiesURL).then((res) => {
    if (res.ok)
        return res.json()
    else
        throw res;
}).then(({ citiesToday, citiesWeekAgo }) => {

    citiesArr = citiesToday
    renderData('cities')

    const allCitiesObjs = document.getElementsByClassName('admin-city-obj')
    const allCitiessData = document.getElementsByClassName('city-data')
    const saveCitiesDetailsButtons = document.getElementsByClassName('admin-city-saveButton');
    const citiesIds = document.getElementsByClassName('city-id');
    const spanBefores = document.getElementsByClassName('span-before-C')

    let spanBeforesArr = Array.from(spanBefores)
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
                const childrens = Array.from(allCitiesObjsArr[i].children)
                for (let j = 2; j < childrens.length; j++) {
                    childrens[j].classList.toggle('none')
                }
                spanBeforesArr.forEach(span => {
                    span.classList.toggle('none')
                })
                allCitiesObjsArr[i].classList.toggle('show-city')
            }
        })
    }

    allSaveCitiesDetailsButtons.forEach((saveButton, i) => {

        saveButton.addEventListener('click', (e) => {
            e.preventDefault();
            data = {
                date: todayDate,
                numberOfResidents: allCitiesIds[i].parentElement.parentElement.children[1].children[0].innerHTML,
                currentActivePatients: allCitiesIds[i].parentElement.parentElement.children[2].children[1].innerHTML,
                numberOfTests: allCitiesIds[i].parentElement.parentElement.children[3].children[1].innerHTML,
                numberOfPositiveTests: allCitiesIds[i].parentElement.parentElement.children[4].children[1].innerHTML,
                governmentScore: allCitiesIds[i].parentElement.parentElement.children[5].children[1].innerHTML,
                dailyScore: allCitiesIds[i].parentElement.parentElement.children[6].children[1].innerHTML
            }

            fetch((updateCityData + allCitiesIds[i].innerHTML), {
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
                alertModal('Updated City Successfully')
                console.log(resJson)
            }).catch((err) => {
                console.log(err)
                alertModal(err + 'whyyy')
            })

        })
    })

})

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
    personsArr = persons;
    renderData('persons')

    const allPersonsObjs = document.getElementsByClassName('admin-person-obj')
    const allpersonsData = document.getElementsByClassName('person-data')
    const savePersonDetailsButtons = document.getElementsByClassName('admin-person-saveButton');
    const personsIds = document.getElementsByClassName('person-id')
    const spanBefores = document.getElementsByClassName('span-before')

    let spanBeforesArr = Array.from(spanBefores)
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
                const childrens = Array.from(allPersonsObjsArr[i].children)
                for (let j = 2; j < childrens.length; j++) {
                    childrens[j].classList.toggle('none')
                }
                allPersonsObjsArr[i].classList.toggle('show-person')
                spanBeforesArr.forEach(span => {
                    span.classList.toggle('none')
                })
            }
        })
    }

    // console.log(allPersonsIds, allSavePersonsDetailsButtons)
    allSavePersonsDetailsButtons.forEach((saveButton, i) => {

        saveButton.addEventListener('click', (e) => {
            e.preventDefault();

            data = {
                city: allPersonsIds[i].parentElement.parentElement.children[2].children[1].innerHTML,
                phone: allPersonsIds[i].parentElement.parentElement.children[3].children[1].innerHTML,
                condition: allPersonsIds[i].parentElement.parentElement.children[4].children[1].innerHTML,
                quarantinedAt: allPersonsIds[i].parentElement.parentElement.children[5].children[1].innerHTML,
                vaccinated: allPersonsIds[i].parentElement.parentElement.children[6].children[1].innerHTML
            }
            // console.log(data, allPersonsIds[i].innerHTML)

            fetch((updatePersonData + allPersonsIds[i].innerHTML), {
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
                alertModal('Updated Person Successfully')
            }).catch((err) => {
                console.log(err)
                alertModal(err + 'whyyy')
            })

        })
    })

}).catch((e) => {
    console.log(e)
})

addPersonButton.addEventListener('click', (e) => {
    e.preventDefault();
    addPersonButton.classList.toggle('margin')
    addPersonFormContainer.classList.toggle('show-form');
})
adminLogoutButton.addEventListener('click', (e) => {
    e.preventDefault()
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
            window.location.href = '/home.html'
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})


addDetailedPersonButton.addEventListener('click', (e) => {
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
    console.log(data)

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
        console.log(person)
        alertModal(person.name + ' added successfully')
    }).catch((e) => {
        console.log(e)
    })
})

searchPersonInput.addEventListener('input', () => {
    filterPersonsBy = searchPersonInput.value.trim().toLowerCase()
    renderData('persons')
})

searchCityInput.addEventListener('input', () => {
    filterCitiesBy = searchCityInput.value.trim().toLowerCase()
    renderData('cities')
})

sortCitiesSelect.addEventListener('change', () => {
    isMostPopulatedOnTop = sortCitiesSelect.value === 'most-residents-AS' ? true : false
    renderData('cities')
})