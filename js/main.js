const prayerTime = document.querySelectorAll(".prayer-time");
const currentDay = document.getElementById("current-day");
const currentDate = document.getElementById("current-date");
const currentHijryDate = document.getElementById("current-hijry-date");
const currentLocation = document.getElementById("current-location");

async function getUserLocation(location) {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=pk.1b8798a6da62ec19f141fd591e4a48c2&lat=${latitude}&lon=${longitude}&format=json`
    );
    if (response.ok) {
        getCurrentDateAndTimings(latitude, longitude);
        const data = await response.json();
        //The Response {}
        console.log(data);
        //Country EX:Egypt
        console.log(data.address.country);
        // Town EX: Kom Hamada || City EX: Al-Zaqaziq
        console.log(data.address.town || data.address.city);
        if (data.address.city == undefined) {
            currentLocation.innerHTML = `${data.address.country + "-" + data.address.town}`;
        } else {
            currentLocation.innerHTML = `${data.address.country + "-" + data.address.city}`;
        }
    }
}
function error(error) {
    console.error(error);
}
navigator.geolocation.getCurrentPosition(getUserLocation, error);
async function getCurrentDateAndTimings(latitude, longitude) {
    // Get Current Day
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const response = await fetch(
        ` http://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=5`
    );
    if (response.ok) {
        const data = await response.json();
        const todayData = data.data.find((el) => el.date.gregorian.day == day);
        console.log(todayData);
        currentDay.innerHTML = `${todayData.date.gregorian.weekday.en}`;
        currentDate.innerHTML = `${todayData.date.readable}`;
        currentHijryDate.innerHTML = `${parseInt(todayData.date.hijri.day) +
            1 +
            " " +
            todayData.date.hijri.month.en +
            " " +
            todayData.date.hijri.year
            }`;
        prayerTime[0].innerHTML = `${todayData.timings.Fajr.slice(0, 6)}`;
        prayerTime[1].innerHTML = `${todayData.timings.Sunrise.slice(0, 6)}`;
        prayerTime[2].innerHTML = `${todayData.timings.Dhuhr.slice(0, 6)}`;
        prayerTime[3].innerHTML = `${todayData.timings.Asr.slice(0, 6)}`;
        prayerTime[4].innerHTML = `${todayData.timings.Maghrib.slice(0, 6)}`;
        prayerTime[5].innerHTML = `${todayData.timings.Isha.slice(0, 6)}`;
    }
}

getCurrentDateAndTimings();
