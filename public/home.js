const accessiblityButton = document.getElementById('accessibility-button')
const accessibilityText = document.getElementById('accessibility-text')
const bodyContainer = document.getElementById('body-container')
const cards = document.getElementsByClassName('main-box')
const arrayCards = Array.from(cards);
const svgPathsI = document.getElementsByClassName('i')
const arraySvgPathsI = Array.from(svgPathsI)
const indicesContainer = document.getElementsByClassName('main-indices-of-vaccination')[0]
const TotalDeathsGraphSymbol = document.querySelector('.totalDeaths-graph-symbol');
const indicesHeader = document.querySelector('.indices-header')
const otherBoxes = document.querySelector('.main-otherBoxes')
const otherBoxess = document.querySelectorAll('.indices-others-box')
const otherBoxesAbove = document.querySelectorAll('.others-indices-aboveone')
const selectElements = document.getElementsByTagName('select')
const otherBoxesBeneath = document.querySelectorAll('.others-indices-beneath')
const otherBoxesss = document.querySelectorAll('.main-new-patients')
const otherBox1 = document.querySelector('.main-vaccinated-cities')
const otherBox2 = document.querySelector('.main-others-cube-first')
const otherBox3 = document.querySelector('.main-others-cube-status-hospitals')
const otherBox4 = document.querySelector('.main-others-cube-piluah')
const otherBox5 = document.querySelector('.main-others-cube-workers')
const otherBox6 = document.querySelectorAll('.main-others-cube')
const otherBox7 = document.querySelector('.main-ramzor-plan')
const indicesGraphColor1 = document.querySelectorAll('.legend-circle-first')
const indicesGraphColor2 = document.querySelectorAll('.legend-circle-second')
const ramzorDateContainer = document.querySelector('.ramzor-date-container')
const otherBoxesGrouped = document.querySelectorAll('.main-others-indices-of-vaccination-grouped')
const ramzorShareSymbol = document.querySelector('.indices-secondBox-symbol-share-button')
const ramzorTableContainer = document.querySelector('.ramzor-table-container')
const allSymbols = document.querySelectorAll('.symbol')
const allIsymbols = document.getElementsByClassName('i')
const ramzorTableTitles = ramzorTableContainer.children
const ramzorSearchInput = document.querySelector('.ramzor-search-text')
// console.log(TotalDeathsGraphSymbol)
const indicesTimeframeDropdownBox1 = document.getElementById('indices-timeframe-dropdown')
const indicesTimeframeDropdownBox2 = document.getElementById('indices-timeframe-dropdown2')
const indicesTimeframeDropdownBox3 = document.getElementById('indices-timeframe-dropdown3')

const mylocalStorage = window.localStorage;

const adminButton = document.getElementById('admin-button');
let allCities = [];

let indicesGraph1Data = {}, indicesGraph2Data = {}, indicesGraph3Data = {};
let firstGraph, secondGraph, thirdGraph;

const ramzorCitiesTemplate = document.getElementById('ramzor-cities').innerHTML;
const ramzorCitiesContainer = document.getElementById('ramzor-table-inside-container')

const getVaccinatedDataURL = '/Covid19-site/GetDataPeriodOf?timeframe=';
const updateDataURL = '/Covid19-site/Admin/updateData';
const getCitiesURL = '/Covid19-site/getDayDataCities';
const adminLoginURL = '/Covid19-site/Admin/login-admin';


const loginAdmin = (email, password) => {
    const errorDiv = document.getElementsByClassName('onLoadModalError')[0]
    const data = { email, password }
    fetch(adminLoginURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            console.log(response)
            if (response.ok)
                return response.json()
            else
                throw response
        })
        .then(data => {
            localStorage.setItem('token', data.currentToken)
            window.location.href = '/adminPage.html'
        })
        .catch((error) => {
            errorDiv.className = 'onLoadModalError';
        });
}
const openModal = () => {
    const onLoadModal = document.createElement('div')
    onLoadModal.className = "onLoadModal"
    onLoadModal.style.display = "block";
    const onLoadModalContent = document.createElement('div')
    onLoadModalContent.className = "onLoadModalContent"
    const onLoadModalContentP1 = document.createElement('div')
    onLoadModalContentP1.className = "onLoadModalp1"
    const onLoadModalContentP1Span = document.createElement('span')
    onLoadModalContentP1Span.className = "onLoadModalp1-span"
    onLoadModalContentP1Span.innerHTML = "Login"
    const onLoadModalContentP2 = document.createElement('div')
    onLoadModalContentP2.className = "onLoadModalp2";
    const onLoadModalContentForm = document.createElement('form')
    onLoadModalContentForm.className = "onLoadModalForm";
    const onLoadModalContentInput1 = document.createElement('input')
    onLoadModalContentInput1.className = "onLoadModalInput-email";
    onLoadModalContentInput1.placeholder = "Email";
    const onLoadModalContentInput2 = document.createElement('input')
    onLoadModalContentInput2.setAttribute('type', 'password')
    onLoadModalContentInput2.className = "onLoadModalInput-pass";
    onLoadModalContentInput2.placeholder = "Password";
    onLoadModalContentForm.addEventListener('submit', (event) => {
        event.preventDefault()
        loginAdmin(onLoadModalContentInput1.value, onLoadModalContentInput2.value)
        // onLoadModalContentInput1.value = '';
        onLoadModalContentInput2.value = '';
    })
    const onLoadModalContentButton = document.createElement('button')
    onLoadModalContentButton.innerHTML = "Login"
    onLoadModalContentButton.className = "onLoadModalButton";
    const onLoadModalContentErrorDiv = document.createElement('div')
    onLoadModalContentErrorDiv.innerHTML = "Email or password didnt matched"
    onLoadModalContentErrorDiv.className = "onLoadModalError none";
    onLoadModalContentP1.appendChild(onLoadModalContentP1Span)
    onLoadModalContentForm.appendChild(onLoadModalContentInput1)
    onLoadModalContentForm.appendChild(onLoadModalContentInput2)
    onLoadModalContentForm.appendChild(onLoadModalContentErrorDiv)
    onLoadModalContentForm.appendChild(onLoadModalContentButton)
    onLoadModalContentP2.appendChild(onLoadModalContentForm)
    onLoadModalContent.appendChild(onLoadModalContentP1)
    onLoadModalContent.appendChild(onLoadModalContentP2)
    onLoadModal.appendChild(onLoadModalContent)
    bodyContainer.appendChild(onLoadModal)
    window.onclick = function (event) {
        if (event.target == onLoadModal) {
            bodyContainer.removeChild(onLoadModal)
            onLoadModal.style.display = "none";
        }
    }
}
adminButton.addEventListener('click', openModal)


const changeAccessibilityOfGraphsByState = () => {
    const graphsLabels = document.querySelectorAll('.ct-label')
    const graphsLines = document.querySelectorAll('.ct-grid')
    const graphsAreasA = document.querySelectorAll('.ct-series-a .ct-area, .ct-series-a .ct-slice-donut-solid, .ct-series-a .ct-slice-pie')
    const graphsAreasB = document.querySelectorAll('.ct-series-b .ct-area, .ct-series-b .ct-slice-donut-solid, .ct-series-b .ct-slice-pie')
    const graphsBars1 = document.querySelectorAll('.ct-series-b .ct-bar, .ct-series-b .ct-line, .ct-series-b .ct-point, .ct-series-b .ct-slice-donut')
    const graphsBars2 = document.querySelectorAll('.ct-series-a .ct-bar, .ct-series-a .ct-line, .ct-series-a .ct-point, .ct-series-a .ct-slice-donut')

    if (indicesContainer.className.includes('access')) {
        indicesGraphColor1.forEach(circle => {
            circle.style.backgroundColor = 'rgb(159, 250, 130)'
        })
        indicesGraphColor2.forEach(circle => {
            circle.style.backgroundColor = 'rgb(253, 130, 100)'
        })
        graphsAreasA.forEach(area => {
            area.style.fill = 'rgb(253, 130, 100)';
        })
        graphsAreasB.forEach(area => {
            area.style.fill = 'rgb(159, 250, 130)';
        })
        graphsLabels.forEach(text => {
            text.style.color = '#fff';
        })
        graphsLines.forEach(text => {
            text.style.stroke = '#fff';
            text.style.strokeWidth = '0.5px';
            text.style.strokeDasharray = '0';
        })
        graphsBars1.forEach(bar1 => {
            bar1.style.stroke = '#9ffa82';
        })
        graphsBars2.forEach(bar2 => {
            bar2.style.stroke = '#fd8264'
        })
    }
    else {
        graphsAreasA.forEach(area => {
            area.style.fill = 'rgb(182, 202, 81)';
        })
        graphsAreasB.forEach(area => {
            area.style.fill = 'rgb(28, 125, 126)';
        })
        indicesGraphColor1.forEach(circle => {
            circle.style.backgroundColor = 'rgb(28, 125, 126)'
        })
        indicesGraphColor2.forEach(circle => {
            circle.style.backgroundColor = 'rgb(182, 202, 81)'
        })
        graphsLabels.forEach(text => {
            text.style.color = 'rgba(0,0,0,.4)'
        })
        graphsLines.forEach(text => {
            console.log(text)
            text.style.stroke = 'rgba(0,0,0,.2)';
            text.style.strokeWidth = '1px';
            text.style.strokeDasharray = '2px';
        })
        graphsBars1.forEach(bar1 => {
            bar1.style.stroke = '#1c7d7e';
        })
        graphsBars2.forEach(bar2 => {
            bar2.style.stroke = '#b6ca51'
        })
    }
}
const changeAccessibility = () => {
    const PercentageOfPositiveTestsGraphSymbol = document.getElementsByClassName('.PercentageOfPositiveTests-graph-symbol')[0];

    bodyContainer.classList.toggle('layout-regular')
    bodyContainer.classList.toggle('layout-accessibility')
    accessibilityText.innerHTML.includes('תצוגה נגישה') ? accessibilityText.innerHTML = 'תצוגה רגילה' : accessibilityText.innerHTML = 'תצוגה נגישה';
    arrayCards.forEach(card => {
        card.classList.toggle('accessibility-main-box')
    });
    arraySvgPathsI.forEach(path => {
        path.classList.toggle('accessibility-Svg-path-I')
    });
    indicesContainer.classList.toggle('main-indices-of-vaccination-access')
    indicesHeader.classList.toggle('header-layout-access')
    otherBoxess.forEach(box => {
        box.classList.toggle('card-layout-access')
        box.classList.toggle('border-none')
    });
    otherBoxesAbove.forEach(box => {
        box.classList.toggle('above-cards-style')
    });
    const arrayOfiSymbols = Array.from(allIsymbols)
    arrayOfiSymbols.forEach(iSymbol => {
        iSymbol.classList.toggle('i-fill-access')
    });
    otherBoxesBeneath.forEach(box => {
        box.classList.toggle('beneath-cards-style')
    });
    otherBoxesss.forEach(box => {
        box.classList.toggle('card-layout-access')
    });
    otherBox6.forEach(box => {
        box.classList.toggle('card-layout-access')
    });
    otherBox1.classList.toggle('card-layout-access')
    otherBox2.classList.toggle('card-layout-access')
    otherBox3.classList.toggle('card-layout-access')
    otherBox4.classList.toggle('card-layout-access')
    otherBox5.classList.toggle('card-layout-access')
    otherBox7.classList.toggle('card-layout-access')
    otherBoxesGrouped.forEach(box => {
        box.classList.toggle('transparent')
    })
    allSymbols.forEach(symbol => {
        symbol.classList.toggle('symbol-access-type1')
    })
    changeAccessibilityOfGraphsByState()
    const arrayOfSelectTags = Array.from(selectElements)
    arrayOfSelectTags.forEach(selectTag => {
        selectTag.classList.toggle('select-access')
        let arr = Array.from(selectTag.children)
        arr.forEach(option => {
            option.classList.toggle('option-access')
        })
    })

    ramzorDateContainer.classList.toggle('ramzor-table-bg-access')
    ramzorSearchInput.classList.toggle('transparent')
    for (let i = 0; i < ramzorTableTitles.length - 1; i++) {
        if (i < 3 || i === ramzorTableTitles.length - 2)
            ramzorTableTitles[i].classList.toggle('ramzor-table-bg-access')
        else
            ramzorTableTitles[i].classList.toggle('ramzor-table-bg-3special')
    }

    TotalDeathsGraphSymbol.classList.toggle('accessiblity-graph')
}
accessiblityButton.addEventListener('click', changeAccessibility)

const getDataByDropDownLists = (BoxNumber, timeframe) => {
    let arrayOfDates = [], arrayOfVaccinatedFirst = [], arrayOfVaccinatedSecond = [];
    let arrayOfSumVaccinatedFirst = [], arrayOfSumVaccinatedSecond = [];
    let arrayOfPercentageVaccinateFirstWithinAllPopulation = [], arrayOfPercentageVaccinateSecondWithinAllPopulation = [];
    fetch(getVaccinatedDataURL + timeframe).then((res) => {
        if (res.ok)
            return res.json()
        else
            throw res
    }).then((data) => {
        let SumVaccinatedFirst = data[0].vaccinatedFirst, SumVaccinatedSecond = data[0].vaccinatedSecond;
        let frequancy, entirePopulation = 80000;
        switch (timeframe) {
            case 30:
                frequancy = 5
                break;
            case 14:
                frequancy = 3;
                break;
            case 7:
                frequancy = 1;
                break;
            default:
                frequancy = 10;
                break;

        }
        data.forEach((dayData, i) => {
            if (i % frequancy === 0) {
                let newDate = dayData.date.substring(0, dayData.date.length - 5)
                arrayOfDates.push(newDate)
            }
            else
                arrayOfDates.push('')
            arrayOfVaccinatedFirst.push(dayData.vaccinatedFirst)
            arrayOfVaccinatedSecond.push(dayData.vaccinatedSecond)
            for (let j = 0; j < i; j++) {
                SumVaccinatedFirst += data[j + 1].vaccinatedFirst;
                SumVaccinatedSecond += data[j + 1].vaccinatedSecond;
            }
            arrayOfSumVaccinatedFirst.push(SumVaccinatedFirst)
            arrayOfSumVaccinatedSecond.push(SumVaccinatedSecond)
            arrayOfPercentageVaccinateFirstWithinAllPopulation.push(arrayOfSumVaccinatedFirst[i] / entirePopulation)
            arrayOfPercentageVaccinateSecondWithinAllPopulation.push(arrayOfSumVaccinatedSecond[i] / entirePopulation)
        });

        if (BoxNumber === 1) {
            indicesGraph1Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfVaccinatedSecond,
                    arrayOfVaccinatedFirst,
                ]
            }
            firstGraph.update(indicesGraph1Data)
            changeAccessibilityOfGraphsByState()
        }
        else if (BoxNumber === 2) {
            indicesGraph2Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfSumVaccinatedSecond,
                    arrayOfSumVaccinatedFirst,
                ]
            };
            secondGraph.update(indicesGraph2Data)
            changeAccessibilityOfGraphsByState()
        }
        else if (BoxNumber === 3) {
            indicesGraph3Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfPercentageVaccinateSecondWithinAllPopulation,
                    arrayOfPercentageVaccinateFirstWithinAllPopulation
                ]
            };
            thirdGraph.update(indicesGraph3Data)
            changeAccessibilityOfGraphsByState()
        }
        else {
            indicesGraph1Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfVaccinatedSecond,
                    arrayOfVaccinatedFirst,
                ]
            }
            indicesGraph2Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfSumVaccinatedSecond,
                    arrayOfSumVaccinatedFirst,
                ]
            };
            indicesGraph3Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfPercentageVaccinateSecondWithinAllPopulation,
                    arrayOfPercentageVaccinateFirstWithinAllPopulation
                ]
            };

        }
        if (BoxNumber === 0)
            createGraphs()
    })
}

//---------chart1 data and settings----------
getDataByDropDownLists(0, 30)

createGraphs = () => {
    firstGraph = new Chartist.Bar('.ct-chart1', indicesGraph1Data, {
        stackBars: true,
        fullWidth: true,
        height: '259px',
        axisX: {
            showGrid: false,
        },
    })
    secondGraph = new Chartist.Line('.ct-chart2', indicesGraph2Data, {
        low: 0,
        showArea: true,
        fullWidth: true,
        height: '259px',
        axisX: {
            showGrid: false
        }

    });
    thirdGraph = new Chartist.Line('.ct-chart3', indicesGraph3Data, {
        high: 100,
        low: 0,
        fullWidth: true,
        height: '259px',
        // As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
        axisY: {
            onlyInteger: true,
            offset: 20
        },
        axisX: {
            showGrid: false,
        }
    });
}

indicesTimeframeDropdownBox1.addEventListener('change', (e) => {
    let timeframeINT;
    let currentTimeFrame = indicesTimeframeDropdownBox1.value;
    switch (currentTimeFrame) {
        case 'till-now':
            document.getElementById('1till-now').setAttribute('selected', 'selected')
            document.getElementById('1last-week').selected = false;
            document.getElementById('1last-2weeks').selected = false;
            document.getElementById('1last-month').selected = false;
            timeframeINT = -1;
            break;
        case 'last-week':
            timeframeINT = 7;
            break;
        case 'last-2weeks':
            timeframeINT = 14;
            break;
        case 'last-month':
            timeframeINT = 30;
            break;
    }
    getDataByDropDownLists(1, timeframeINT)
})
indicesTimeframeDropdownBox2.addEventListener('change', () => {
    let timeframeINT;
    let currentTimeFrame = indicesTimeframeDropdownBox2.value;
    switch (currentTimeFrame) {
        case 'till-now':
            timeframeINT = -1;
            break;
        case 'last-week':
            timeframeINT = 7;
            break;
        case 'last-2weeks':
            timeframeINT = 14;
            break;
        case 'last-month':
            timeframeINT = 30;
            break;
    }
    getDataByDropDownLists(2, timeframeINT)
})
indicesTimeframeDropdownBox3.addEventListener('change', () => {
    let timeframeINT;
    let currentTimeFrame = indicesTimeframeDropdownBox3.value;
    switch (currentTimeFrame) {
        case 'till-now':
            timeframeINT = -1;
            break;
        case 'last-week':
            timeframeINT = 7;
            break;
        case 'last-2weeks':
            timeframeINT = 14;
            break;
        case 'last-month':
            timeframeINT = 30;
            break;
    }
    getDataByDropDownLists(3, timeframeINT)
})

//-----------------------
//cities need to be an array of objects. each object possess data for a city !

fetch(getCitiesURL).then((res) => {
    if (res.ok)
        return res.json()
    else
        throw res
}).then(({ citiesToday, citiesWeekAgo }) => {
    console.log(citiesToday)
    console.log(citiesWeekAgo)
    citiesToday.forEach(cityToday => {
        citiesWeekAgo.forEach(cityWeekAgo => {
            if (cityToday.city === cityWeekAgo.city) {
                console.log(cityToday.numberOfPositiveTests - cityWeekAgo.numberOfPositiveTests)
                const newVerifiedFor10K = String((cityToday.numberOfPositiveTests - cityWeekAgo.numberOfPositiveTests) / 100)
                cityToday.newVerifiedFor10K = newVerifiedFor10K.includes('-') ? newVerifiedFor10K.substr(0, 5) : newVerifiedFor10K.substr(0, 4)
                cityToday.percentagePositive = Math.floor(cityToday.numberOfTests / cityToday.numberOfPositiveTests) + '%'
                cityToday.changeVerified = Math.floor(cityToday.currentActivePatients * 100 / cityWeekAgo.currentActivePatients) + '%';
            }
        })
    })

    const html = Mustache.render(ramzorCitiesTemplate, {
        cities: citiesToday
    })
    ramzorCitiesContainer.innerHTML = html
})
