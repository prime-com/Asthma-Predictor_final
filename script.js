const predictButton = document.getElementById("predictButton");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const breathingInput = document.getElementById("breathing");
const dryCoughInput = document.getElementById("dryCough");
const runnyNoseInput = document.getElementById("runnyNose");
const nasalCongestionInput = document.getElementById("nasalCongestion");

predictButton.addEventListener("click", function () {
    const patient = {
        age: ageInput.value,
        gender: genderInput.value,
        breathing: breathingInput.value,
        dryCough: dryCoughInput.value,
        runnyNose: runnyNoseInput.value,
        nasalCongestion: nasalCongestionInput.value
    };
    console.log(patient);
});