
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
}).then(({ todayData, yesterdayData, personsMidnight, allTimeSumVerified, alltimeVaccinatedFirst, alltimeVaccinatedSecond }) => {
    // console.log('todayData:', todayData)
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
        newVerifiedYesterday: new Intl.NumberFormat().format(yesterdayData.newVerified),
        newVerifiedMidNight: `${newPatientsMidnight}${newPatientsMidnight >= 0 ? '+' : '-'}`,
        newVerifiedAll: new Intl.NumberFormat().format(allTimeSumVerified)
    })
    mainBox1Container.insertAdjacentHTML('beforeend', mainBox1Rendered)

    const mainBox2Rendered = Mustache.render(mainBox2Template, {
        verifiedSum: new Intl.NumberFormat().format(todayData.activePatients),
        verifiedMidnight: `${activePatientsMidnight}${activePatientsMidnight >= 0 ? '+' : '-'}`,
        hospital: new Intl.NumberFormat().format(todayData.isolationAtHospitals),
        hotel: new Intl.NumberFormat().format(todayData.isolationAtHotels),
        home: new Intl.NumberFormat().format(todayData.isolationAtHome)
    })
    mainBox2Container.insertAdjacentHTML('beforeend', mainBox2Rendered)

    const mainBox3Rendered = Mustache.render(mainBox3Template, {
        severePatientsAll: new Intl.NumberFormat().format(todayData.severePatients),
        severePatientsMidNight: `${severePatientsMidnight}${severePatientsMidnight >= 0 ? '+' : '-'}`,
        criticalPatients: new Intl.NumberFormat().format(todayData.criticalPatients),
        ventilatedPatients: new Intl.NumberFormat().format(todayData.ventilatedPatients),
    })
    mainBox3Container.insertAdjacentHTML('beforeend', mainBox3Rendered)

    const mainBox4Rendered = Mustache.render(mainBox4Template, {
        vaccinatedFirst: new Intl.NumberFormat().format(alltimeVaccinatedFirst),
        vaccinatedFirstMidnight: `${vaccinatedFirstFromMidnight}${vaccinatedFirstFromMidnight >= 0 ? '+' : '-'}`,
        vaccinatedSecond: new Intl.NumberFormat().format(alltimeVaccinatedSecond),
        vaccinatedSecondMidnight: `${vaccinatedSecondFromMidnight}${vaccinatedSecondFromMidnight >= 0 ? '+' : '-'}`,
    })
    mainBox4Container.insertAdjacentHTML('beforeend', mainBox4Rendered)

    const mainBox5Rendered = Mustache.render(mainBox5Template, {
        totalDeaths: new Intl.NumberFormat().format(todayData.totalDeaths),
    })
    mainBox5Container.insertAdjacentHTML('beforeend', mainBox5Rendered)

    const mainBox6Rendered = Mustache.render(mainBox6Template, {
        PercentageOfPositiveTestsYesterday: `${0.5}%`,
        sumTestsYesterday: new Intl.NumberFormat().format(yesterdayData.numberOfTests)
    })
    mainBox6Container.insertAdjacentHTML('beforeend', mainBox6Rendered)
}).catch((e) => {
    console.log(e)
})

