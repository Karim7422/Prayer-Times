const prayerTime = document.querySelectorAll(".prayer-time");
const currentDay = document.getElementById("current-day");
const currentDate = document.getElementById("current-date");
const currentHijryDate = document.getElementById("current-hijry-date");
const currentLocation = document.getElementById("current-location");
const contentBox = document.getElementById('content-box')
const errorMessage = document.getElementById('error-message')

async function getUserLocation(location) {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=pk.1b8798a6da62ec19f141fd591e4a48c2&lat=${latitude}&lon=${longitude}&format=json`
    );
    if (response.ok) {
        errorMessage.classList.add('hidden')
        getCurrentDateAndTimings(latitude, longitude);
        const data = await response.json();
        //The Response {}
        console.log(data);
        //Country EX:Egypt
        console.log(data.address.country);
        // Town EX: Kom Hamada || City EX: Al-Zaqaziq
        console.log(data.address.town || data.address.city);
        if (data.address.city == undefined) {
            currentLocation.innerHTML = `${data.address.country + "-" + data.address.town
                }`;
        } else {
            currentLocation.innerHTML = `${data.address.country + "-" + data.address.city
                }`;
        }
    }
}
function errorHandling() {
    errorMessage.classList.remove('hidden')
    errorMessage.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="#fff">
                    <path
                        d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z">
                    </path>
                </svg>
                <p class="text-white text-[14px] md:text-xl font-semibold">Please turn on your location to display the prayer times.</p>
`
    contentBox.innerHTML = ""

}
navigator.geolocation.getCurrentPosition(getUserLocation, errorHandling);
async function getCurrentDateAndTimings(latitude, longitude) {
    // Get Current Day
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const response = await fetch(
        ` https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=5`
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
