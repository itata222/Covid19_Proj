
const mainBox1Template = document.getElementById('mainBox1NewVerifiedTemplate').innerHTML
const mainBox1Container = document.getElementById('main-box1-newVerified-container')
const mainBox2Template = document.getElementById('mainBox2Template').innerHTML
const mainBox2Container = document.getElementById('main-box2-activeVerified-container')
const mainBox3Template = document.getElementById('mainBox3Template').innerHTML
const mainBox3Container = document.getElementById('main-box3-severePatients-container')
const mainBox4Template = document.getElementById('mainBox4Template').innerHTML
const mainBox4Container = document.getElementById('main-box4-vaccinated-container')
const mainBox5Template = document.getElementById('mainBox5Template').innerHTML
const mainBox5Container = document.getElementById('main-box5-totalDeaths-container')
const mainBox6Template = document.getElementById('mainBox6Template').innerHTML
const mainBox6Container = document.getElementById('main-box6-PercentageOfPositiveTests-container')

const getTodayDataUrl = '/Covid19-site/GetDailyStatics'

fetch(getTodayDataUrl).then((res) => {
    if (res.ok)
        return res.json();
    else
        throw res;
}).then(({ todayData, yesterdayData, personsMidnight, allTimeSumVerified }) => {
    console.log('todayData:', todayData)
    // console.log(personsMidnight)
    let activePatientsMidnight = 0, newPatientsMidnight = 0, severePatientsMidnight = 0, vaccinatedFirstFromMidnight = 0, vaccinatedSecondFromMidnight = 0;
    personsMidnight.forEach(person => {
        if (person.condition !== 'Healthy') {
            activePatientsMidnight++;
            newPatientsMidnight++;
        }
        if (person.condition === 'Severe')
            severePatientsMidnight++;
        if (person.vaccinated === 1)
            vaccinatedFirstFromMidnight++;
        if (person.vaccinated === 2)
            vaccinatedSecondFromMidnight++;
    });
    const mainBox1Rendered = Mustache.render(mainBox1Template, {
        newVerifiedYesterday: yesterdayData.newVerified,
        newVerifiedMidNight: `${newPatientsMidnight}${newPatientsMidnight >= 0 ? '+' : '-'}`,
        newVerifiedAll: allTimeSumVerified
    })
    mainBox1Container.insertAdjacentHTML('beforeend', mainBox1Rendered)

    const mainBox2Rendered = Mustache.render(mainBox2Template, {
        verifiedSum: todayData.activePatients,
        verifiedMidnight: `${activePatientsMidnight}${activePatientsMidnight >= 0 ? '+' : '-'}`,
        hospital: todayData.isolationAtHospitals,
        hotel: todayData.isolationAtHotels,
        home: todayData.isolationAtHome
    })
    mainBox2Container.insertAdjacentHTML('beforeend', mainBox2Rendered)

    const mainBox3Rendered = Mustache.render(mainBox3Template, {
        severePatientsAll: todayData.severePatients,
        severePatientsMidNight: `${severePatientsMidnight}${severePatientsMidnight >= 0 ? '+' : '-'}`,
        criticalPatients: todayData.criticalPatients,
        ventilatedPatients: todayData.ventilatedPatients,
    })
    mainBox3Container.insertAdjacentHTML('beforeend', mainBox3Rendered)

    const mainBox4Rendered = Mustache.render(mainBox4Template, {
        vaccinatedFirst: todayData.vaccinatedFirst,
        vaccinatedFirstMidnight: `${vaccinatedFirstFromMidnight}${vaccinatedFirstFromMidnight >= 0 ? '+' : '-'}`,
        vaccinatedSecond: todayData.vaccinatedSecond,
        vaccinatedSecondMidnight: `${vaccinatedSecondFromMidnight}${vaccinatedSecondFromMidnight >= 0 ? '+' : '-'}`,
    })
    mainBox4Container.insertAdjacentHTML('beforeend', mainBox4Rendered)

    const mainBox5Rendered = Mustache.render(mainBox5Template, {
        totalDeaths: todayData.totalDeaths,
    })
    mainBox5Container.insertAdjacentHTML('beforeend', mainBox5Rendered)

    const mainBox6Rendered = Mustache.render(mainBox6Template, {
        PercentageOfPositiveTestsYesterday: `${0.5}%`,
        sumTestsYesterday: yesterdayData.numberOfTests
    })
    mainBox6Container.insertAdjacentHTML('beforeend', mainBox6Rendered)
}).catch((e) => {
    console.log(e)
})

