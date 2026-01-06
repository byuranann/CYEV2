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

    
const submitBtn = form.querySelector('[type="submit"]');

  // --- VALIDATION ขั้นพื้นฐาน ---
  // 1) ตรวจว่าค่า number ไม่เป็น NaN
  const numericInputs = {
    rowSpacing, earsIn4Meters, kernelsPerEar, femaleArea,
    uniformFactor, kernelsPerKg, standingArea
  };
  for (const [key, val] of Object.entries(numericInputs)) {
    if (Number.isNaN(val)) {
      console.warn(`Invalid input: ${key} is NaN`);
      alert('กรุณากรอกค่าตัวเลขให้ครบทุกช่อง (รวมถึงค่าอัตโนมัติจากตัวเลือกด้วย)');
      // อย่า disable ปุ่มก่อน validation ผ่าน ดังนั้นไม่ต้องเปิดปุ่มที่นี่
      return;
    }
  }

  // 2) (ทางเลือก) ตรวจว่า select ถูกเลือก (ไม่ใช่ placeholder)
  // สมมติ option แรกคือ placeholder
  if (hybridDropdown.selectedIndex === 0) {
    alert('กรุณาเลือกสายพันธุ์ (Hybrid)');
    return;
  }
  if (femaleAreaRatioDropdown.selectedIndex === 0) {
    alert('กรุณาเลือกร้อยละพื้นที่ตัวเมีย');
    return;
  }

  // ผ่าน validation แล้วค่อยปิดปุ่ม (กันกดซ้ำ)
  if (submitBtn) submitBtn.disabled = true;

  // --- คำนวณ ---
  let yieldEstimate, totalWetEar, population;
  try {
    yieldEstimate =
      (((((1600 / (rowSpacing / 100)) / (4 / earsIn4Meters)) * femaleArea) *
        kernelsPerEar *
        (uniformFactor / 100)) /
      kernelsPerKg) / 0.6;

    totalWetEar = standingArea * yieldEstimate;
    population = ((1600 / (rowSpacing / 100)) / (4 / earsIn4Meters)) * femaleArea;
  } catch (err) {
    console.error('Error during calculation:', err);
    alert('เกิดข้อผิดพลาดในการคำนวณ กรุณาตรวจสอบข้อมูลอีกครั้ง');
    if (submitBtn) submitBtn.disabled = false; // เปิดปุ่มกลับก่อนออก
    return;
  }


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
    mode: "no-cors",
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

.then(() => {
  // หมายเหตุ: no-cors จะได้ response แบบ opaque อ่านเนื้อไม่ได้
  console.log("Request sent (no-cors).");
})
.catch(err => {
  console.error("Error sending data", err);
});

form.reset();


hybridDropdown.selectedIndex = 0;           // ให้กลับไปตัวเลือกแรก เช่น "เลือกสายพันธุ์"
femaleAreaRatioDropdown.selectedIndex = 0;  // ให้กลับไปตัวเลือกแรก เช่น "เลือกร้อยละพื้นที่ตัวเมีย"

// เคลียร์ค่าช่องที่ถูก auto-fill ด้วยมือด้วย (กัน edge-case)
kernelsPerKgInput.value = "";
femaleAreaInput.value = "";

});





