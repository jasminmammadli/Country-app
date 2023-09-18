const DOM = {
    countries: document.querySelector(".countries"),
    inpVal: document.querySelector("#inp"),
    regionOption: document.querySelector("#select-country"),
    selectInput: document.querySelector(".text-icon span"),
    data:document.querySelector(".data")
}
const region = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania", "Antarctic"]
region.forEach(item => DOM.regionOption.innerHTML += `<div class="black">${item}</div>`)
async function dataFetching() {
    const url = await fetch("https://restcountries.com/v3.1/all")
    if (!url.ok) {
        throw new Error("Your have problem")
    }
    const data = await url.json()
    return data
}
async function showData() {
    try {
        const totalData = await dataFetching()
        totalData.sort((a, b) => a.name.common.localeCompare(b.name.common))
        countryInfo(totalData)
    }
    catch (err) {
        DOM.data.style.display="none"
        DOM.countries.innerHTML = `<h1 style="font-size:50px; color:red;">You have a problem...<i class="fa-regular fa-face-sad-tear"></i></h1>`
    }
}
showData()
function countryInfo(arr) {
    arr.slice(0, 10).forEach(item => DOM.countries.innerHTML += `
                                    <div class="country-box country-box-shadow">
                                        <div class="box-top">
                                        <img src="${item.flags.png}" />
                                        </div>
                                        <div class="box-bottom white">
                                        <p class="country-name black"><span class="black">${item.name.common}</span></p>
                                        <p><b class="black">Population: </b> <span class="black">${item.population}</span></p>
                                        <p><b class="black">Region: </b> <span class="black">${item.region}</span></p>
                                        <p><b class="black">Capital: </b> <span class="black">${item?.capital}</span></p>
                                        </div>
                                    </div>
    `)
}
async function selectData() {
    const totalData = await dataFetching()
    DOM.countries.innerHTML = ""
    totalData.sort((a, b) => a.name.common.localeCompare(b.name.common))
    const filteredData = totalData.filter(item => {
        if (DOM.selectInput.textContent == "All" || DOM.selectInput.textContent == "Filter by Region") {
            return totalData
        }
        return item.region == DOM.selectInput.textContent
    })
    countryInfo(filteredData)
    return filteredData
}
const searchingCountry = async () => {
    const newFilteredData = await selectData()
    DOM.countries.innerHTML = ""
    const inpValue = DOM.inpVal.value
    const filteredInputData = newFilteredData.filter(item => item.name.common.toLowerCase().includes(inpValue.trim().toLowerCase()))
    countryInfo(filteredInputData)
}
document.querySelector(".dark-mode").addEventListener("click", function (e) {
    console.log(e.target);
    if (e.target.textContent == "Dark Mode") {
        e.target.previousElementSibling.classList.toggle("fa-moon");
        e.target.previousElementSibling.classList.toggle("fa-sun");
        e.target.textContent = "Light Mode";
    } else if (e.target.textContent == "Light Mode") {
        e.target.previousElementSibling.classList.toggle("fa-moon");
        e.target.previousElementSibling.classList.toggle("fa-sun");
        e.target.textContent = "Dark Mode";
    }
    else if (e.target.textContent == "") {
        e.target.classList.toggle("fa-moon");
        e.target.classList.toggle("fa-sun");
        e.target.nextElementSibling.textContent = e.target.nextElementSibling.textContent === "Dark Mode" ? "Light Mode" : "Dark Mode";
    }
    const black = document.querySelectorAll(".black")
    black.forEach(item => item.classList.toggle("font-white"))
    const white = document.querySelectorAll(".white")
    white.forEach(item => item.classList.toggle("bg-black"))
    document.querySelector("body").classList.toggle("body-bg")
    document.querySelectorAll(".shadow-remove").forEach(item => item.classList.toggle("select-shadow"))
    document.querySelectorAll(".country-box").forEach(item => item.classList.toggle("country-box-shadow"))
});
document.querySelector(".text-icon").addEventListener("click", function () {
    const iconMove = document.querySelector(".text-icon i")
    iconMove.classList.toggle("move-icon")
    DOM.regionOption.classList.toggle("visible-bar")
    DOM.regionOption.classList.toggle("space-bar")
})
const option = document.querySelectorAll("#select-country div")
option.forEach(item => item.addEventListener("click", function (e) {
    DOM.selectInput.innerHTML = e.target.textContent
    document.querySelector(".text-icon i").classList.toggle("move-icon")
    DOM.regionOption.classList.add("visible-bar")
    selectData()
}))


