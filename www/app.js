// DOM Elements
const inputPrevReading = document.getElementById('input-prev-reading');
const inputCurrReading = document.getElementById('input-curr-reading');
const calcUsedUnits = document.getElementById('calc-used-units');

const inputBillMonth = document.getElementById('input-bill-month');
const inputAddress = document.getElementById('input-address');
const inputMapLink = document.getElementById('input-map-link');

// Consumer Type Elements
const btnTypeResidential = document.getElementById('btn-type-residential');
const btnTypeCommercial = document.getElementById('btn-type-commercial');
const selectLt2Subcat = document.getElementById('select-lt2-subcat');
const inputSanctionedLoad = document.getElementById('input-sanctioned-load');
const lt2SubcatGroup = document.getElementById('lt2-subcat-group');

// Advanced Slabs / Factors
const slab0_100 = document.getElementById('slab-0-100');
const slab101_300 = document.getElementById('slab-101-300');
const slab301_500 = document.getElementById('slab-301-500');
const slabAbove500 = document.getElementById('slab-above-500');
const factorLt2EnergyRate = document.getElementById('factor-lt2-energy-rate');

const factorFixCharge = document.getElementById('factor-fix-charge');
const factorWheelingCharge = document.getElementById('factor-wheeling-charge');
const factorFac = document.getElementById('factor-fac');
const factorDutyPct = document.getElementById('factor-duty-pct');
const factorMeterRent = document.getElementById('factor-meter-rent');

const lt1SlabsGroup = document.getElementById('lt1-slabs-group');
const lt2FlatGroup = document.getElementById('lt2-flat-group');

const btnResetFactors = document.getElementById('btn-reset-factors');
const btnPrint = document.getElementById('btn-print');
const btnLoadSample = document.getElementById('btn-load-sample');
const btnShare = document.getElementById('btn-share');
const btnTakePhoto = document.getElementById('btn-take-photo');
const btnChooseGallery = document.getElementById('btn-choose-gallery');

// Mobile Tabs Navigation Elements
const tabEdit = document.getElementById('tab-edit');
const tabPreview = document.getElementById('tab-preview');
const appContainer = document.querySelector('.app-container');

// Accordion toggle
const factorsSection = document.getElementById('factors-section');
const factorsToggle = document.getElementById('factors-toggle');
const factorsContent = document.getElementById('factors-content');

// File Upload & OCR Elements
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const uploadPrompt = document.getElementById('upload-prompt');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const btnRemove = document.getElementById('btn-remove');
const btnOcr = document.getElementById('btn-ocr');
const ocrSpinner = document.getElementById('ocr-spinner');
const ocrBtnText = document.getElementById('ocr-btn-text');
const ocrStatus = document.getElementById('ocr-status');
const ocrCandidates = document.getElementById('ocr-candidates');
const candidatesList = document.getElementById('candidates-list');

// Preview elements in Document
const previewConsumerBadge = document.getElementById('preview-consumer-badge');
const previewAddress = document.getElementById('preview-address');
const previewMapLink = document.getElementById('preview-map-link');
const previewMonth = document.getElementById('preview-month');
const previewCurrReading = document.getElementById('preview-curr-reading');
const previewPrevReading = document.getElementById('preview-prev-reading');
const previewUsedUnits = document.getElementById('preview-used-units');

const previewFactorFixCharge = document.getElementById('preview-factor-fix-charge');
const previewAmtFixCharge = document.getElementById('preview-amt-fix-charge');
const previewFactorWheeling = document.getElementById('preview-factor-wheeling');
const previewAmtWheeling = document.getElementById('preview-amt-wheeling');
const previewFactorFac = document.getElementById('preview-factor-fac');
const previewAmtFac = document.getElementById('preview-amt-fac');
const previewEdLabel = document.getElementById('preview-ed-label');
const previewFactorDutyPct = document.getElementById('preview-factor-duty-pct');
const previewAmtDuty = document.getElementById('preview-amt-duty');
const previewAmtMeterRent = document.getElementById('preview-amt-meter-rent');

const previewTotalPayable = document.getElementById('preview-total-payable');
const previewPayableBar = document.getElementById('preview-payable-bar');

const documentImagePlaceholder = document.getElementById('document-image-placeholder');
const documentImage = document.getElementById('document-image');

// State Variables
let currentConsumerType = 'residential'; // 'residential' | 'commercial'
let uploadedImageSrc = null;

// Default Factors for MSEDCL (Mahavitaran) 2024-25 Nagpur
const DEFAULTS_RESIDENTIAL = {
  sanctionedLoad: 1,
  fixCharge: 125, // ₹125 per kW/month
  wheelingCharge: 1.17,
  fac: 0.25,
  dutyPct: 16,
  meterRent: 10,
  slab_0_100: 3.07,
  slab_101_300: 7.38,
  slab_301_500: 9.54,
  slab_above_500: 11.44,
  address: 'Survay No 911/2, Pathardi Rd, Phata, Nashik, Maharashtra 422009',
  mapLink: 'https://maps.app.goo.gl/HXJzoWqi6dG4AHh9A'
};

const DEFAULTS_COMMERCIAL = {
  subCat: 'A',
  sanctionedLoad: 1,
  fixCharge: 470, // ₹470 per connection/month (SubCat A) or per kVA/month (SubCat B & C)
  wheelingCharge: 1.17,
  fac: 0.25,
  dutyPct: 16,
  meterRent: 30,
  energyRate: 8.27, // SubCat A default
  address: 'Survay No 911/2, Pathardi Rd, Phata, Nashik, Maharashtra 422009',
  mapLink: 'https://maps.app.goo.gl/HXJzoWqi6dG4AHh9A'
};

// Initialize Application
function init() {
  loadFromLocalStorage();
  updateTypeUI();
  registerEvents();
  calculateBill();
}

// Register UI Events
function registerEvents() {
  // Inputs change trigger recalculation
  const inputsToTrack = [
    inputPrevReading, inputCurrReading, inputBillMonth, inputAddress, inputMapLink,
    inputSanctionedLoad, selectLt2Subcat,
    slab0_100, slab101_300, slab301_500, slabAbove500, factorLt2EnergyRate,
    factorFixCharge, factorWheelingCharge, factorFac, factorDutyPct, factorMeterRent
  ];

  inputsToTrack.forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        calculateBill();
        saveToLocalStorage();
      });
      input.addEventListener('change', () => {
        calculateBill();
        saveToLocalStorage();
      });
    }
  });

  // Consumer Type Toggles
  btnTypeResidential.addEventListener('click', () => {
    currentConsumerType = 'residential';
    updateTypeUI();
    resetFactorsToTypeDefaults();
    calculateBill();
    saveToLocalStorage();
  });

  btnTypeCommercial.addEventListener('click', () => {
    currentConsumerType = 'commercial';
    updateTypeUI();
    resetFactorsToTypeDefaults();
    calculateBill();
    saveToLocalStorage();
  });

  // Sub-category Selector Specific Logic
  selectLt2Subcat.addEventListener('change', () => {
    const subCat = selectLt2Subcat.value;
    if (subCat === 'A') {
      inputSanctionedLoad.value = 1;
      factorLt2EnergyRate.value = 8.27;
      factorFixCharge.value = 470;
      factorMeterRent.value = 30;
    } else if (subCat === 'B') {
      inputSanctionedLoad.value = 21;
      factorLt2EnergyRate.value = 12.63;
      factorFixCharge.value = 470;
      factorMeterRent.value = 30;
    } else if (subCat === 'C') {
      inputSanctionedLoad.value = 51;
      factorLt2EnergyRate.value = 14.93;
      factorFixCharge.value = 470;
      factorMeterRent.value = 30;
    }
    calculateBill();
    saveToLocalStorage();
  });

  // Accordion Toggle
  factorsToggle.addEventListener('click', () => {
    factorsContent.classList.toggle('hidden');
    factorsSection.classList.toggle('collapsed');
  });

  // Reset factors to defaults
  btnResetFactors.addEventListener('click', resetFactorsToTypeDefaults);

  // Print / PDF Button
  btnPrint.addEventListener('click', () => {
    generateAndExportPDF();
  });

  // Mobile Tabs switching logic
  if (tabEdit && tabPreview) {
    tabEdit.addEventListener('click', () => {
      tabEdit.classList.add('active');
      tabPreview.classList.remove('active');
      appContainer.classList.remove('show-preview');
    });
    tabPreview.addEventListener('click', () => {
      tabPreview.classList.add('active');
      tabEdit.classList.remove('active');
      appContainer.classList.add('show-preview');
    });
  }

  // Image Upload Trigger
  uploadZone.addEventListener('click', (e) => {
    if (e.target.closest('.upload-actions') || e.target.closest('button')) {
      return;
    }
    if (!uploadedImageSrc) {
      fileInput.click();
    }
  });

  // Direct Camera Trigger
  if (btnTakePhoto) {
    btnTakePhoto.addEventListener('click', (e) => {
      e.stopPropagation();
      capturePhoto(true);
    });
  }

  // Direct Gallery Trigger
  if (btnChooseGallery) {
    btnChooseGallery.addEventListener('click', (e) => {
      e.stopPropagation();
      capturePhoto(false);
    });
  }

  // Drag and drop support
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--accent-color)';
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  });

  // Remove uploaded image
  btnRemove.addEventListener('click', (e) => {
    e.stopPropagation();
    removeUploadedImage();
  });

  // Run OCR button
  btnOcr.addEventListener('click', runOCR);

  // Load sample image
  if (btnLoadSample) {
    btnLoadSample.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      loadSampleImage();
    });
  }

  // Capacitor Native Share integration
  if (typeof Capacitor !== 'undefined' && Capacitor.Plugins && Capacitor.Plugins.Share && btnShare) {
    btnShare.classList.remove('hidden');
    btnShare.addEventListener('click', generateAndSharePDF);
  }
}

// Update UI based on Consumer Type selection
function updateTypeUI() {
  if (currentConsumerType === 'residential') {
    btnTypeResidential.classList.add('active');
    btnTypeCommercial.classList.remove('active');
    lt2SubcatGroup.classList.add('hidden');
    lt1SlabsGroup.classList.remove('hidden');
    lt2FlatGroup.classList.add('hidden');
    previewConsumerBadge.innerHTML = '🏠 Residential — LT-1 (MSEDCL)';
  } else {
    btnTypeResidential.classList.remove('active');
    btnTypeCommercial.classList.add('active');
    lt2SubcatGroup.classList.remove('hidden');
    lt1SlabsGroup.classList.add('hidden');
    lt2FlatGroup.classList.remove('hidden');
    const subCat = selectLt2Subcat.value;
    previewConsumerBadge.innerHTML = `🏢 Commercial — LT-II (${subCat}) (MSEDCL)`;
  }
}

// Reset Billing factors to default MSEDCL settings based on current type
function resetFactorsToTypeDefaults() {
  if (currentConsumerType === 'residential') {
    inputSanctionedLoad.value = DEFAULTS_RESIDENTIAL.sanctionedLoad;
    factorFixCharge.value = DEFAULTS_RESIDENTIAL.fixCharge;
    factorWheelingCharge.value = DEFAULTS_RESIDENTIAL.wheelingCharge.toFixed(2);
    factorFac.value = DEFAULTS_RESIDENTIAL.fac.toFixed(2);
    factorDutyPct.value = DEFAULTS_RESIDENTIAL.dutyPct;
    factorMeterRent.value = DEFAULTS_RESIDENTIAL.meterRent;
    slab0_100.value = DEFAULTS_RESIDENTIAL.slab_0_100.toFixed(2);
    slab101_300.value = DEFAULTS_RESIDENTIAL.slab_101_300.toFixed(2);
    slab301_500.value = DEFAULTS_RESIDENTIAL.slab_301_500.toFixed(2);
    slabAbove500.value = DEFAULTS_RESIDENTIAL.slab_above_500.toFixed(2);
  } else {
    const subCat = selectLt2Subcat.value;
    inputSanctionedLoad.value = subCat === 'A' ? 1 : subCat === 'B' ? 21 : 51;
    factorFixCharge.value = DEFAULTS_COMMERCIAL.fixCharge;
    factorWheelingCharge.value = DEFAULTS_COMMERCIAL.wheelingCharge.toFixed(2);
    factorFac.value = DEFAULTS_COMMERCIAL.fac.toFixed(2);
    factorDutyPct.value = DEFAULTS_COMMERCIAL.dutyPct;
    factorMeterRent.value = DEFAULTS_COMMERCIAL.meterRent;
    
    // Set energy rate based on Commercial subcat
    if (subCat === 'A') factorLt2EnergyRate.value = 8.27;
    else if (subCat === 'B') factorLt2EnergyRate.value = 12.63;
    else if (subCat === 'C') factorLt2EnergyRate.value = 14.93;
  }
  
  calculateBill();
  saveToLocalStorage();
}

// Formatting Helper (Commas for thousands)
function formatCurrency(val) {
  if (isNaN(val)) return '0';
  return Math.round(val).toLocaleString('en-IN');
}

// Core Math Calculations
function calculateBill() {
  const prev = parseInt(inputPrevReading.value) || 0;
  const curr = parseInt(inputCurrReading.value) || 0;
  const usedUnits = Math.max(0, curr - prev);

  // Update Left Panel Display
  calcUsedUnits.textContent = usedUnits;

  // Retrieve Common Factors
  const sanctionedLoadVal = parseFloat(inputSanctionedLoad.value) || 1;
  const fixChargeRate = parseFloat(factorFixCharge.value) || 0;
  const wheelingRate = parseFloat(factorWheelingCharge.value) || 0;
  const facRate = parseFloat(factorFac.value) || 0;
  const dutyPctVal = parseFloat(factorDutyPct.value) || 0;
  const meterRentVal = parseFloat(factorMeterRent.value) || 0;

  let energyChargeTotal = 0;
  const calculatedSlabs = [];

  if (currentConsumerType === 'residential') {
    // Progressive Slabs logic for LT-1
    const r0_100 = parseFloat(slab0_100.value) || 0;
    const r101_300 = parseFloat(slab101_300.value) || 0;
    const r301_500 = parseFloat(slab301_500.value) || 0;
    const rAbove500 = parseFloat(slabAbove500.value) || 0;

    let unitsLeft = usedUnits;

    // 0-100 Slab
    const u1 = Math.min(100, unitsLeft);
    if (u1 > 0) {
      const amt = u1 * r0_100;
      energyChargeTotal += amt;
      calculatedSlabs.push({ label: `पहिला स्लॅब (0–100 units)`, rate: r0_100, amount: amt });
      unitsLeft -= u1;
    }

    // 101-300 Slab
    const u2 = Math.min(200, unitsLeft);
    if (u2 > 0) {
      const amt = u2 * r101_300;
      energyChargeTotal += amt;
      calculatedSlabs.push({ label: `दुसरा स्लॅब (101–300 units)`, rate: r101_300, amount: amt });
      unitsLeft -= u2;
    }

    // 301-500 Slab
    const u3 = Math.min(200, unitsLeft);
    if (u3 > 0) {
      const amt = u3 * r301_500;
      energyChargeTotal += amt;
      calculatedSlabs.push({ label: `तिसरा स्लॅब (301–500 units)`, rate: r301_500, amount: amt });
      unitsLeft -= u3;
    }

    // Above 500 Slab
    if (unitsLeft > 0) {
      const amt = unitsLeft * rAbove500;
      energyChargeTotal += amt;
      calculatedSlabs.push({ label: `चौथा स्लॅब (Above 500 units)`, rate: rAbove500, amount: amt });
    }

    // If usedUnits is 0, add a placeholder slab row
    if (usedUnits === 0) {
      calculatedSlabs.push({ label: `0 units consumed`, rate: r0_100, amount: 0 });
    }
  } else {
    // Commercial LT-2 flat rate
    const commRate = parseFloat(factorLt2EnergyRate.value) || 0;
    const amt = usedUnits * commRate;
    energyChargeTotal = amt;
    const subCat = selectLt2Subcat.value;
    calculatedSlabs.push({ label: `Commercial LT-II (${subCat}) Flat Rate`, rate: commRate, amount: amt });
  }

  // Fixed Charge Math:
  // Residential: sanctionedLoad * fixChargeRate (MSEDCL is generally flat ₹125 for 1 kW, then scales per kW)
  // Commercial: Subcat A is flat connection, B/C is per kVA
  let finalFixedCharge = 0;
  if (currentConsumerType === 'residential') {
    finalFixedCharge = Math.max(1, sanctionedLoadVal) * fixChargeRate;
  } else {
    const subCat = selectLt2Subcat.value;
    if (subCat === 'A') {
      finalFixedCharge = fixChargeRate; // Flat ₹470
    } else {
      finalFixedCharge = sanctionedLoadVal * fixChargeRate; // ₹470 per kVA
    }
  }

  // Variable charges
  const amtWheeling = usedUnits * wheelingRate;
  const amtFac = usedUnits * facRate;

  // Subtotal for Duty Calculation (Energy + Wheeling + FAC)
  const subtotalForDuty = energyChargeTotal + amtWheeling + amtFac;
  const amtDuty = subtotalForDuty * (dutyPctVal / 100);

  // Total payable matches exact float sums, rounded at the very end
  const totalPayableRaw = finalFixedCharge + energyChargeTotal + amtWheeling + amtFac + amtDuty + meterRentVal;
  const totalPayableRounded = Math.round(totalPayableRaw);

  // Update Right Panel Preview Document
  previewAddress.textContent = inputAddress.value;
  previewMapLink.textContent = inputMapLink.value;
  previewMapLink.href = inputMapLink.value;
  
  previewMonth.textContent = inputBillMonth.value;
  previewCurrReading.textContent = curr.toLocaleString('en-IN');
  previewPrevReading.textContent = prev.toLocaleString('en-IN');
  previewUsedUnits.textContent = usedUnits.toLocaleString('en-IN');

  // Preview Row Values
  previewFactorFixCharge.textContent = `₹${fixChargeRate.toFixed(2)}${currentConsumerType === 'residential' ? '/kW' : selectLt2Subcat.value === 'A' ? '/month' : '/kVA'}`;
  previewAmtFixCharge.textContent = formatCurrency(finalFixedCharge);

  previewFactorWheeling.textContent = `₹${wheelingRate.toFixed(2)}/unit`;
  previewAmtWheeling.textContent = formatCurrency(amtWheeling);

  previewFactorFac.textContent = `₹${facRate.toFixed(2)}/unit`;
  previewAmtFac.textContent = formatCurrency(amtFac);

  previewEdLabel.textContent = `वीज शुल्क ${dutyPctVal}% — Electricity Duty (ED)`;
  previewFactorDutyPct.textContent = `${dutyPctVal}%`;
  previewAmtDuty.textContent = formatCurrency(amtDuty);

  previewAmtMeterRent.textContent = formatCurrency(meterRentVal);

  // Dynamic Slabs rendering
  document.querySelectorAll('.dynamic-slab-row').forEach(row => row.remove());
  const placeholder = document.getElementById('slab-rows-placeholder');
  let lastRow = placeholder;
  calculatedSlabs.forEach(slab => {
    const newRow = document.createElement('tr');
    newRow.className = 'dynamic-slab-row';
    newRow.innerHTML = `
      <td class="indent-1">${slab.label}</td>
      <td class="bg-factor-green align-right">₹${slab.rate.toFixed(2)}/unit</td>
      <td class="align-right">${formatCurrency(slab.amount)}</td>
    `;
    lastRow.parentNode.insertBefore(newRow, lastRow.nextSibling);
    lastRow = newRow;
  });

  const formattedTotal = formatCurrency(totalPayableRounded);
  previewTotalPayable.textContent = formattedTotal;
  previewPayableBar.textContent = formattedTotal;
}

// Handle Meter Image upload
function handleImageUpload(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedImageSrc = e.target.result;
    
    // Update Upload Zone UI
    imagePreview.src = uploadedImageSrc;
    uploadPrompt.classList.add('hidden');
    previewContainer.classList.remove('hidden');
    
    // Update Preview Document Attachment
    documentImage.src = uploadedImageSrc;
    documentImage.classList.remove('hidden');
    documentImagePlaceholder.classList.add('hidden');

    // Enable OCR Action
    btnOcr.disabled = false;
    
    // Clear old candidates
    ocrCandidates.classList.add('hidden');
    ocrStatus.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

// Fetch and load the default sample meter photo for quick testing
async function loadSampleImage() {
  try {
    const response = await fetch('sample_meter.jpg');
    if (!response.ok) throw new Error('Failed to fetch sample image');
    const blob = await response.blob();
    const file = new File([blob], 'sample_meter.jpg', { type: 'image/jpeg' });
    handleImageUpload(file);
  } catch (error) {
    console.error('Error loading sample image:', error);
  }
}

// Remove Uploaded Image
function removeUploadedImage() {
  uploadedImageSrc = null;
  fileInput.value = '';
  
  // Reset Upload Zone UI
  imagePreview.src = '#';
  uploadPrompt.classList.remove('hidden');
  previewContainer.classList.add('hidden');

  // Reset Preview Document Attachment
  documentImage.src = '#';
  documentImage.classList.add('hidden');
  documentImagePlaceholder.classList.remove('hidden');

  // Disable OCR Action
  btnOcr.disabled = true;
  ocrSpinner.classList.add('hidden');
  ocrBtnText.textContent = '🔍 Run OCR Auto-Read';
  ocrStatus.classList.add('hidden');
  ocrCandidates.classList.add('hidden');
}

// Run OCR text recognition on uploaded meter image
async function runOCR() {
  if (!uploadedImageSrc) return;

  // UI state for loading
  btnOcr.disabled = true;
  ocrSpinner.classList.remove('hidden');
  ocrBtnText.textContent = 'Analyzing image...';
  ocrStatus.classList.remove('hidden');
  ocrStatus.textContent = 'Starting OCR Engine...';
  ocrCandidates.classList.add('hidden');
  candidatesList.innerHTML = '';

  try {
    const worker = await Tesseract.createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          const progress = Math.round(m.progress * 100);
          ocrStatus.textContent = `Scanning image digits... (${progress}%)`;
        }
      }
    });

    const ret = await worker.recognize(uploadedImageSrc);
    await worker.terminate();

    const text = ret.data.text;
    console.log('OCR Output Text:', text);

    const numbersFound = text.match(/\b\d{3,6}\b/g) || [];
    const uniqueNumbers = [...new Set(numbersFound)].map(n => parseInt(n));

    if (uniqueNumbers.length > 0) {
      ocrStatus.textContent = `Analysis complete. Found ${uniqueNumbers.length} reading candidates.`;
      ocrCandidates.classList.remove('hidden');
      
      uniqueNumbers.forEach(num => {
        const chip = document.createElement('div');
        chip.className = 'candidate-chip';
        chip.textContent = num;
        chip.addEventListener('click', () => {
          inputCurrReading.value = num;
          calculateBill();
          saveToLocalStorage();
          
          inputCurrReading.focus();
          inputCurrReading.style.borderColor = 'var(--accent-success)';
          setTimeout(() => {
            inputCurrReading.style.borderColor = '';
          }, 1500);
        });
        candidatesList.appendChild(chip);
      });

      const prevVal = parseInt(inputPrevReading.value) || 0;
      const smartCandidate = uniqueNumbers.find(n => n > prevVal);
      if (smartCandidate) {
        inputCurrReading.value = smartCandidate;
        calculateBill();
        saveToLocalStorage();
        ocrStatus.textContent += ` Auto-filled Current Reading to ${smartCandidate}.`;
      }

    } else {
      ocrStatus.textContent = 'No clear reading numbers (3-6 digits) detected. Please enter manually.';
    }

  } catch (error) {
    console.error('OCR Error:', error);
    ocrStatus.textContent = 'Error scanning image. Please input reading values manually.';
  } finally {
    btnOcr.disabled = false;
    ocrSpinner.classList.add('hidden');
    ocrBtnText.textContent = '🔍 Run OCR Auto-Read';
  }
}

// LocalStorage Persistence
function saveToLocalStorage() {
  const data = {
    consumerType: currentConsumerType,
    subCat: selectLt2Subcat.value,
    sanctionedLoad: inputSanctionedLoad.value,
    prevReading: inputPrevReading.value,
    currReading: inputCurrReading.value,
    billMonth: inputBillMonth.value,
    address: inputAddress.value,
    mapLink: inputMapLink.value,
    fixCharge: factorFixCharge.value,
    wheelingCharge: factorWheelingCharge.value,
    fac: factorFac.value,
    dutyPct: factorDutyPct.value,
    meterRent: factorMeterRent.value,
    slab_0_100: slab0_100.value,
    slab_101_300: slab101_300.value,
    slab_301_500: slab301_500.value,
    slab_above_500: slabAbove500.value,
    commRate: factorLt2EnergyRate.value
  };
  localStorage.setItem('solar_bill_generator_data', JSON.stringify(data));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('solar_bill_generator_data');
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    if (data.consumerType !== undefined) currentConsumerType = data.consumerType;
    if (data.subCat !== undefined) selectLt2Subcat.value = data.subCat;
    if (data.sanctionedLoad !== undefined) inputSanctionedLoad.value = data.sanctionedLoad;
    if (data.prevReading !== undefined) inputPrevReading.value = data.prevReading;
    if (data.currReading !== undefined) inputCurrReading.value = data.currReading;
    if (data.billMonth !== undefined) inputBillMonth.value = data.billMonth;
    if (data.address !== undefined) inputAddress.value = data.address;
    if (data.mapLink !== undefined) inputMapLink.value = data.mapLink;
    
    if (data.fixCharge !== undefined) factorFixCharge.value = data.fixCharge;
    if (data.wheelingCharge !== undefined) factorWheelingCharge.value = data.wheelingCharge;
    if (data.fac !== undefined) factorFac.value = data.fac;
    if (data.dutyPct !== undefined) factorDutyPct.value = data.dutyPct;
    if (data.meterRent !== undefined) factorMeterRent.value = data.meterRent;
    
    if (data.slab_0_100 !== undefined) slab0_100.value = data.slab_0_100;
    if (data.slab_101_300 !== undefined) slab101_300.value = data.slab_101_300;
    if (data.slab_301_500 !== undefined) slab301_500.value = data.slab_301_500;
    if (data.slab_above_500 !== undefined) slabAbove500.value = data.slab_above_500;
    if (data.commRate !== undefined) factorLt2EnergyRate.value = data.commRate;
  } catch (e) {
    console.error('Error parsing stored settings', e);
  }
}

// Native Photo Capture helper (from camera or gallery)
async function capturePhoto(fromCamera) {
  if (typeof Capacitor !== 'undefined' && Capacitor.Plugins && Capacitor.Plugins.Camera) {
    try {
      const { Camera } = Capacitor.Plugins;
      
      if (fromCamera) {
        const check = await Camera.checkPermissions();
        if (check.camera !== 'granted') {
          const req = await Camera.requestPermissions({ permissions: ['camera'] });
          if (req.camera !== 'granted') {
            alert("Camera permission is required to take photos.");
            return;
          }
        }
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: 'dataUrl',
        source: fromCamera ? 'CAMERA' : 'PHOTOS'
      });

      if (image && image.dataUrl) {
        const arr = image.dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], 'captured_meter.jpg', { type: mime });
        handleImageUpload(file);
      }
    } catch (err) {
      console.warn('Native camera capture failed or cancelled:', err);
    }
  } else {
    fileInput.click();
  }
}

// Client-side PDF Generation Options
function getPdfOptions() {
  const cleanMonth = (inputBillMonth.value || 'temp').replace(/[^a-zA-Z0-9]/g, '_');
  return {
    margin: [10, 10, 10, 10],
    filename: `solar_bill_${cleanMonth}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 1,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
}

// Helper to create a temporary visible render element for html2pdf
function createRenderClone() {
  const original = document.getElementById('bill-document');
  const clone = original.cloneNode(true);
  
  clone.style.display = 'flex';
  clone.style.position = 'absolute';
  clone.style.top = '0';
  clone.style.left = '-9999px';
  clone.style.zIndex = '9999';
  clone.style.width = '794px';
  clone.style.height = 'auto';
  clone.style.background = '#ffffff';
  clone.style.color = '#000000';
  clone.style.pointerEvents = 'none';
  
  clone.style.setProperty('--doc-bg', '#ffffff', 'important');
  clone.style.setProperty('--doc-text', '#000000', 'important');
  
  document.body.appendChild(clone);
  
  clone.offsetHeight;
  
  return clone;
}

// Export PDF (Save file or Native Share)
async function generateAndExportPDF() {
  if (typeof Capacitor === 'undefined') {
    window.print();
    return;
  }

  document.body.classList.add('printing-pdf');
  const clone = createRenderClone();

  try {
    await new Promise(resolve => setTimeout(resolve, 150));

    const worker = html2pdf().set(getPdfOptions()).from(clone);
    const pdfOutput = await worker.outputPdf('datauristring');
    const base64Data = pdfOutput.split(',')[1];
    await savePdfToDisk(base64Data);
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("PDF Generation Error: " + err.message);
  } finally {
    document.body.removeChild(clone);
    document.body.classList.remove('printing-pdf');
  }
}

// Share PDF
async function generateAndSharePDF() {
  document.body.classList.add('printing-pdf');
  const clone = createRenderClone();

  try {
    await new Promise(resolve => setTimeout(resolve, 150));

    const worker = html2pdf().set(getPdfOptions()).from(clone);
    const pdfOutput = await worker.outputPdf('datauristring');
    const base64Data = pdfOutput.split(',')[1];
    await saveAndSharePdfFile(base64Data);
  } catch (err) {
    console.error("PDF share failed:", err);
    alert("PDF Share Error: " + err.message);
  } finally {
    document.body.removeChild(clone);
    document.body.classList.remove('printing-pdf');
  }
}

// Helper to save PDF and trigger Share dialog
async function saveAndSharePdfFile(base64Data) {
  if (typeof Capacitor === 'undefined' || !Capacitor.Plugins || !Capacitor.Plugins.Filesystem) {
    alert("Native Share is only supported on Android/iOS devices.");
    return;
  }
  
  const { Filesystem, Share } = Capacitor.Plugins;
  const cleanMonth = (inputBillMonth.value || 'temp').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `solar_bill_${cleanMonth}.pdf`;
  
  try {
    const writeResult = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: 'CACHE'
    });
    
    await Share.share({
      title: `Solar Bill ${inputBillMonth.value}`,
      url: writeResult.uri,
      dialogTitle: 'Share Solar Bill PDF'
    });
  } catch (err) {
    console.error('Error saving or sharing file:', err);
    alert('Share Error: ' + err.message);
  }
}

// Helper to save PDF directly to the public Documents directory
async function savePdfToDisk(base64Data) {
  if (typeof Capacitor === 'undefined' || !Capacitor.Plugins || !Capacitor.Plugins.Filesystem) {
    alert("Save to Disk is only supported on Android/iOS devices.");
    return;
  }
  
  const { Filesystem } = Capacitor.Plugins;
  const cleanMonth = (inputBillMonth.value || 'temp').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `solar_bill_${cleanMonth}.pdf`;

  try {
    const writeResult = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: 'DOCUMENTS',
      recursive: true
    });

    alert(`PDF successfully saved to normal storage:\nDocuments/${fileName}`);
  } catch (err) {
    console.warn('Could not write directly to Documents directory, requesting permissions or falling back...', err);
    try {
      const perm = await Filesystem.requestPermissions();
      if (perm.publicStorage === 'granted') {
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: 'DOCUMENTS',
          recursive: true
        });
        alert(`PDF successfully saved to normal storage:\nDocuments/${fileName}`);
      } else {
        alert('Permission denied. Opening Share dialog instead so you can send or save the file.');
        await saveAndSharePdfFile(base64Data);
      }
    } catch (permErr) {
      console.error('Permission request failed, falling back to share:', permErr);
      await saveAndSharePdfFile(base64Data);
    }
  }
}

// Start App on page load
window.addEventListener('DOMContentLoaded', init);
