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
  // Get the selected option element
  const selectedOption = hybridDropdown.options[hybridDropdown.selectedIndex];
  // Get the kernels per kg from the data-kernels attribute
  const selectedKernelsPerKg = selectedOption.getAttribute('data-kernels');

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
  e.preventDefault();

  // อ่านค่าอินพุต
  const rowSpacing = parseFloat(document.getElementById('rowSpacing').value);
  const earsIn4Meters = parseFloat(document.getElementById('earsIn4Meters').value);
  const kernelsPerEar = parseFloat(document.getElementById('kernelsPerEar').value);
  const femaleArea = parseFloat(document.getElementById('femaleArea').value);
  const uniformFactor = parseFloat(document.getElementById('uniformFactor').value);
  const kernelsPerKg = parseFloat(document.getElementById('kernelsPerKg').value);
  const standingArea = parseFloat(document.getElementById('standingArea').value);
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
    const hybridRecoveryFactor = parseFloat(hybridDropdown.value); // Selected hybrid recovery factor
    yieldEstimate =
      (((((1600 / (rowSpacing / 100)) / (4 / earsIn4Meters)) * femaleArea) *
        kernelsPerEar *
        (uniformFactor / 100)) /
        kernelsPerKg) / hybridRecoveryFactor;

    totalWetEar = standingArea * yieldEstimate;
    population = ((1600 / (rowSpacing / 100)) / (4 / earsIn4Meters)) * femaleArea;
  } catch (err) {
    console.error('Error during calculation:', err);
    alert('เกิดข้อผิดพลาดในการคำนวณ กรุณาตรวจสอบข้อมูลอีกครั้ง');
    if (submitBtn) submitBtn.disabled = false; // เปิดปุ่มกลับก่อนออก
    return;
  }

  // --- แสดงผล ---
  populationElement.innerHTML = `
    <strong>จำนวนประชากรของตัวเมียต่อไร่:</strong><br>
    <span class="highlight-number">${population.toFixed(2)}</span> ต้น ต่อ ไร่
  `;
  resultElement.innerHTML = `
    <strong>ผลผลิตต่อไร่:</strong><br>
    <span class="highlight-number">${yieldEstimate.toFixed(2)}</span> กิโลกรัม ต่อ ไร่
  `;
  totalWetEarElement.innerHTML = `
    <strong>ผลผลิตรวม (กก.):</strong><br>
    <span class="highlight-number">${totalWetEar.toFixed(2)}</span> กิโลกรัม
  `;
  resultsSection.hidden = false;

  // --- ส่งข้อมูลไป Google Apps Script ---
  console.log('Sending data to Apps Script…');
  fetch("https://script.google.com/macros/s/AKfycbwrjHKV-BZi7H-ODdsVnjNTGG2cwycoOd_lFOU0FgGb2XReurlXJDoHlW0oa8GACLZr/exec", {
    method: "POST",
    mode: "no-cors", // response จะเป็น opaque
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
      population,
      yieldEstimate: yieldEstimate.toFixed(2),
      totalWetEar: totalWetEar.toFixed(2)
    })
  })
    .then(() => {
      console.log("Request sent (no-cors).");
    })
    .catch(err => {
      console.error("Error sending data", err);
      alert('ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    })
    .finally(() => {
      // เปิดปุ่มกลับเสมอ
      if (submitBtn) submitBtn.disabled = false;
    });

  // --- รีเซ็ตฟอร์ม (คงผลลัพธ์ที่แสดงไว้) ---
  form.reset();

  // รีเซ็ต dropdown กลับไป placeholder และเคลียร์ช่อง auto-fill
  hybridDropdown.selectedIndex = 0;
  femaleAreaRatioDropdown.selectedIndex = 0;

  kernelsPerKgInput.value = "";
  femaleAreaInput.value = "";
});


