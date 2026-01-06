// Get the form and result elements
const form = document.getElementById('yieldForm');
const resultElement = document.getElementById('result');
const totalWetEarElement = document.getElementById('totalWetEar');
const hybridDropdown = document.getElementById('hybrid');
const femaleAreaRatioDropdown = document.getElementById('femaleAreaRatio');
const kernelsPerKgInput = document.getElementById('kernelsPerKg');
const femaleAreaInput = document.getElementById('femaleArea');
const populationElement = document.getElementById('population');
const resultsSection = document.getElementById('resultsSection');

// Add event listener for hybrid selection
hybridDropdown.addEventListener('change', function () {
    // Get the selected value (kernels per kg)
    const selectedKernelsPerKg = hybridDropdown.value;

    // Auto-fill the Kernels per Kg (BB) field
    kernelsPerKgInput.value = selectedKernelsPerKg;
});

// Add event listener for female area ratio selection
femaleAreaRatioDropdown.addEventListener('change', function () {
    // Get the selected value (female area ratio)
    const selectedFemaleArea = femaleAreaRatioDropdown.value;

    // Auto-fill the Female Area (B) field
    femaleAreaInput.value = selectedFemaleArea;
});

// Add event listener for form submission
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from submitting

    // Get input values
    const rowSpacing = parseFloat(document.getElementById('rowSpacing').value); // K
    const earsIn4Meters = parseFloat(document.getElementById('earsIn4Meters').value); // N
    const kernelsPerEar = parseFloat(document.getElementById('kernelsPerEar').value); // W
    const femaleArea = parseFloat(document.getElementById('femaleArea').value); // B
    const uniformFactor = parseFloat(document.getElementById('uniformFactor').value); // X
    const kernelsPerKg = parseFloat(document.getElementById('kernelsPerKg').value); // BB
    const standingArea = parseFloat(document.getElementById('standingArea').value); // Standing Area (Rai)
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const UserLocation = document.getElementById('location').value;

    // Perform the calculation using the provided formula
    const yieldEstimate =
        (((((1600 / (rowSpacing / 100)) / (4 / earsIn4Meters)) * femaleArea) *
            kernelsPerEar *
            (uniformFactor / 100)) /
        kernelsPerKg) / 0.6;

    // Calculate Total Wet Ear (Kg)
    const totalWetEar = standingArea * yieldEstimate;

    // Calculate Population
    const population = ((1600 / (rowSpacing / 100)) / (4 / earsIn4Meters)) * femaleArea;

    // Display the population
    populationElement.innerHTML = `
        <strong>จำนวนประชากรของตัวเมียต่อไร่:</strong><br>
        <span class="highlight-number">${population.toFixed(2)}</span> ต้น ต่อ ไร่
    `;

    // Display the result
    resultElement.innerHTML = `
        <strong>ผลผลิตต่อไร่:</strong><br>
        <span class="highlight-number">${yieldEstimate.toFixed(2)}</span> กิโลกรัม ต่อ ไร่
    `;

    // Display Total Wet Ear (Kg)
    totalWetEarElement.innerHTML = `
        <strong>ผลผลิตรวม (กก.):</strong><br>
        <span class="highlight-number">${totalWetEar.toFixed(2)}</span> กิโลกรัม
    `;

     // Show the results section
     resultsSection.hidden = false; // Remove the hidden attribute

    fetch("https://script.google.com/macros/s/AKfycbwrjHKV-BZi7H-ODdsVnjNTGG2cwycoOd_lFOU0FgGb2XReurlXJDoHlW0oa8GACLZr/exec", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        firstName,
        lastName,
        location: UserLocation,
        hybrid: hybridDropdown.options[hybridDropdown.selectedIndex].text,
        rowSpacing,
        earsIn4Meters,
        kernelsPerEar,
        femaleArea,
        uniformFactor,
        standingArea,
        yieldEstimate: yieldEstimate.toFixed(2),
        totalWetEar: totalWetEar.toFixed(2)
    })
})
.then(res => res.json())
.then(data => {
    console.log("Saved to Google Sheet", data);
})
.catch(err => {
    console.error("Error sending data", err);
});
});
