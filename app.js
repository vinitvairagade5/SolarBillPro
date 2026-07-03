// DOM Elements
const inputPrevReading = document.getElementById('input-prev-reading');
const inputCurrReading = document.getElementById('input-curr-reading');
const calcUsedUnits = document.getElementById('calc-used-units');

const inputBillMonth = document.getElementById('input-bill-month');
const inputAddress = document.getElementById('input-address');
const inputMapLink = document.getElementById('input-map-link');

// Advanced factors
const factorFixCharge = document.getElementById('factor-fix-charge');
const factorElecRate = document.getElementById('factor-elec-rate');
const factorRatePerUnit = document.getElementById('factor-rate-per-unit');
const factorDutyPct = document.getElementById('factor-duty-pct');
const factorDutyTax = document.getElementById('factor-duty-tax');

const descRatePerUnit = document.getElementById('desc-rate-per-unit');
const descDutyTax = document.getElementById('desc-duty-tax');

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
const previewAddress = document.getElementById('preview-address');
const previewMapLink = document.getElementById('preview-map-link');
const previewMonth = document.getElementById('preview-month');
const previewCurrReading = document.getElementById('preview-curr-reading');
const previewPrevReading = document.getElementById('preview-prev-reading');
const previewUsedUnits = document.getElementById('preview-used-units');

const previewFactorFixCharge = document.getElementById('preview-factor-fix-charge');
const previewFactorElecRate = document.getElementById('preview-factor-elec-rate');
const previewFactorRatePerUnit = document.getElementById('preview-factor-rate-per-unit');
const previewFactorDutyPct = document.getElementById('preview-factor-duty-pct');
const previewFactorDutyTax = document.getElementById('preview-factor-duty-tax');

const previewDescRatePerUnit = document.getElementById('preview-desc-rate-per-unit');
const previewDescDutyTax = document.getElementById('preview-desc-duty-tax');

const previewAmtElecBill = document.getElementById('preview-amt-elec-bill');
const previewAmtRatePerUnit = document.getElementById('preview-amt-rate-per-unit');
const previewAmtFac = document.getElementById('preview-amt-fac');
const previewAmtDuty = document.getElementById('preview-amt-duty');
const previewAmtDutyTax = document.getElementById('preview-amt-duty-tax');

const previewTotalPayable = document.getElementById('preview-total-payable');
const previewPayableBar = document.getElementById('preview-payable-bar');

const documentImagePlaceholder = document.getElementById('document-image-placeholder');
const documentImage = document.getElementById('document-image');

// Default Factors
const DEFAULTS = {
  fixCharge: 517,
  elecRate: 8.00,
  ratePerUnit: 1.170,
  dutyPct: 21,
  dutyTax: 0.19,
  descRatePerUnit: 'वाहन आकार @ ₹1.47 / यु. (Electricity Rate per Unit)',
  descDutyTax: 'वीज शुल्क कर प्रत्येक युनिटमागे ₹0.1904 इतका "वीज शुल्क कर" (Electricity Duty Tax)',
  address: 'Survay No 911/2, Pathardi Rd, Phata, Nashik, Maharashtra 422009',
  mapLink: 'https://maps.app.goo.gl/HXJzoWqi6dG4AHh9A'
};

let uploadedImageSrc = null;

// Initialize Application
function init() {
  loadFromLocalStorage();
  registerEvents();
  calculateBill();
}

// Register UI Events
function registerEvents() {
  // Inputs change trigger recalculation
  const inputsToTrack = [
    inputPrevReading, inputCurrReading, inputBillMonth, inputAddress, inputMapLink,
    factorFixCharge, factorElecRate, factorRatePerUnit, factorDutyPct, factorDutyTax,
    descRatePerUnit, descDutyTax
  ];

  inputsToTrack.forEach(input => {
    input.addEventListener('input', () => {
      calculateBill();
      saveToLocalStorage();
    });
  });

  // Accordion Toggle
  factorsToggle.addEventListener('click', () => {
    factorsContent.classList.toggle('hidden');
    factorsSection.classList.toggle('collapsed');
  });

  // Reset factors to defaults
  btnResetFactors.addEventListener('click', resetFactors);

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

  // Image Upload Trigger (click on upload zone falls back to file selection, ignoring buttons)
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
    e.stopPropagation(); // Prevent triggering file input click
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

// Reset Billing factors to default MSEDCL settings
function resetFactors() {
  factorFixCharge.value = DEFAULTS.fixCharge;
  factorElecRate.value = DEFAULTS.elecRate.toFixed(2);
  factorRatePerUnit.value = DEFAULTS.ratePerUnit.toFixed(3);
  factorDutyPct.value = DEFAULTS.dutyPct;
  factorDutyTax.value = DEFAULTS.dutyTax.toFixed(2);
  descRatePerUnit.value = DEFAULTS.descRatePerUnit;
  descDutyTax.value = DEFAULTS.descDutyTax;
  
  calculateBill();
  saveToLocalStorage();
}

// Formatting Helper (Commas for thousands)
function formatCurrency(val) {
  if (isNaN(val)) return '0';
  // Standard format without decimals for finalized amounts in this bill
  return Math.round(val).toLocaleString('en-IN');
}

// Core Math Calculations
function calculateBill() {
  const prev = parseInt(inputPrevReading.value) || 0;
  const curr = parseInt(inputCurrReading.value) || 0;
  const usedUnits = Math.max(0, curr - prev);

  // Update Left Panel Display
  calcUsedUnits.textContent = usedUnits;

  // Retrieve Factor inputs
  const fixChargeVal = parseFloat(factorFixCharge.value) || 0;
  const elecRateVal = parseFloat(factorElecRate.value) || 0;
  const ratePerUnitVal = parseFloat(factorRatePerUnit.value) || 0;
  const dutyPctVal = parseFloat(factorDutyPct.value) || 0;
  const dutyTaxVal = parseFloat(factorDutyTax.value) || 0;

  // Perform Billing Formula Math
  // Electricity Bill Amount = Used Units * Rate per Unit
  const amtElecBill = usedUnits * elecRateVal;
  
  // Electricity Rate per Unit (Tax/Wheeling) = Used Units * Factor
  const amtRatePerUnit = usedUnits * ratePerUnitVal;
  
  // Electricity Duty (ED) = (Bill Amount + Rate per Unit Amount) * Duty %
  const amtDuty = (amtElecBill + amtRatePerUnit) * (dutyPctVal / 100);
  
  // Electricity Duty Tax = Used Units * Duty Tax Rate
  const amtDutyTax = usedUnits * dutyTaxVal;

  // Total payable matches exact float sums, rounded at the very end
  // (Fix Charge is shown as 0 finalized in the bill, we add 0 by default)
  const fixChargeFinalAmt = 0; 
  const totalPayableRaw = fixChargeFinalAmt + amtElecBill + amtRatePerUnit + amtDuty + amtDutyTax;
  const totalPayableRounded = Math.round(totalPayableRaw);

  // Update Right Panel Preview Document
  previewAddress.textContent = inputAddress.value;
  previewMapLink.textContent = inputMapLink.value;
  previewMapLink.href = inputMapLink.value;
  
  previewMonth.textContent = inputBillMonth.value;
  previewCurrReading.textContent = curr.toLocaleString('en-IN');
  previewPrevReading.textContent = prev.toLocaleString('en-IN');
  previewUsedUnits.textContent = usedUnits.toLocaleString('en-IN');

  previewFactorFixCharge.textContent = Math.round(fixChargeVal).toLocaleString('en-IN');
  previewFactorElecRate.textContent = Math.round(elecRateVal).toLocaleString('en-IN');
  previewFactorRatePerUnit.textContent = ratePerUnitVal.toFixed(3);
  previewFactorDutyPct.textContent = dutyPctVal + '%';
  previewFactorDutyTax.textContent = dutyTaxVal.toFixed(2);

  previewDescRatePerUnit.textContent = descRatePerUnit.value;
  previewDescDutyTax.textContent = descDutyTax.value;

  previewAmtElecBill.textContent = formatCurrency(amtElecBill);
  previewAmtRatePerUnit.textContent = formatCurrency(amtRatePerUnit);
  previewAmtFac.textContent = ''; // Blank as in image
  previewAmtDuty.textContent = formatCurrency(amtDuty);
  previewAmtDutyTax.textContent = formatCurrency(amtDutyTax);

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

    // Regex to scan for numeric values (candidates for readings)
    // Matches 3-digit, 4-digit, or 5-digit numbers (like 528, 826, etc.)
    const numbersFound = text.match(/\b\d{3,6}\b/g) || [];
    
    // De-duplicate and filter
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
          
          // Flash animation on Current Reading to show update
          inputCurrReading.focus();
          inputCurrReading.style.borderColor = 'var(--accent-success)';
          setTimeout(() => {
            inputCurrReading.style.borderColor = '';
          }, 1500);
        });
        candidatesList.appendChild(chip);
      });

      // Smart pre-fill: Find the first candidate that is greater than the previous reading
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
    prevReading: inputPrevReading.value,
    currReading: inputCurrReading.value,
    billMonth: inputBillMonth.value,
    address: inputAddress.value,
    mapLink: inputMapLink.value,
    fixCharge: factorFixCharge.value,
    elecRate: factorElecRate.value,
    ratePerUnit: factorRatePerUnit.value,
    dutyPct: factorDutyPct.value,
    dutyTax: factorDutyTax.value,
    descRatePerUnit: descRatePerUnit.value,
    descDutyTax: descDutyTax.value
  };
  localStorage.setItem('solar_bill_generator_data', JSON.stringify(data));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('solar_bill_generator_data');
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    if (data.prevReading !== undefined) inputPrevReading.value = data.prevReading;
    if (data.currReading !== undefined) inputCurrReading.value = data.currReading;
    if (data.billMonth !== undefined) inputBillMonth.value = data.billMonth;
    if (data.address !== undefined) inputAddress.value = data.address;
    if (data.mapLink !== undefined) inputMapLink.value = data.mapLink;
    
    if (data.fixCharge !== undefined) factorFixCharge.value = data.fixCharge;
    if (data.elecRate !== undefined) factorElecRate.value = data.elecRate;
    if (data.ratePerUnit !== undefined) factorRatePerUnit.value = data.ratePerUnit;
    if (data.dutyPct !== undefined) factorDutyPct.value = data.dutyPct;
    if (data.dutyTax !== undefined) factorDutyTax.value = data.dutyTax;
    
    if (data.descRatePerUnit !== undefined) descRatePerUnit.value = data.descRatePerUnit;
    if (data.descDutyTax !== undefined) descDutyTax.value = data.descDutyTax;
  } catch (e) {
    console.error('Error parsing stored settings', e);
  }
}

// Native Photo Capture helper (from camera or gallery)
async function capturePhoto(fromCamera) {
  if (typeof Capacitor !== 'undefined' && Capacitor.Plugins && Capacitor.Plugins.Camera) {
    try {
      const { Camera } = Capacitor.Plugins;
      
      // Request camera permissions if capturing from camera
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
        resultType: 'dataUrl', // Base64 data URL
        source: fromCamera ? 'CAMERA' : 'PHOTOS' // String literals for CameraSource
      });

      if (image && image.dataUrl) {
        // Convert base64 data URL to File object without network fetching
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
    margin: [10, 10, 10, 10], // Margins (top, left, bottom, right) in mm
    filename: `solar_bill_${cleanMonth}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 1, // Set scale to 1 on mobile to prevent memory limits/blank canvas
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
  
  // Position off-screen with positive z-index so GPU paints it, but user doesn't see it
  clone.style.display = 'flex';
  clone.style.position = 'absolute';
  clone.style.top = '0';
  clone.style.left = '-9999px';
  clone.style.zIndex = '9999';
  clone.style.width = '794px';
  clone.style.height = 'auto';
  clone.style.background = '#ffffff'; // Ensure white background
  clone.style.color = '#000000';      // Ensure black text
  clone.style.pointerEvents = 'none'; // Prevent interaction
  
  // Explicitly override CSS variables inline for the clone and its children 
  // to bypass WebView bugs with html2canvas CSS variables resolution
  clone.style.setProperty('--doc-bg', '#ffffff', 'important');
  clone.style.setProperty('--doc-text', '#000000', 'important');
  
  document.body.appendChild(clone);
  
  // Force a synchronous reflow
  clone.offsetHeight;
  
  return clone;
}

// Export PDF (Save file or Native Share)
async function generateAndExportPDF() {
  if (typeof Capacitor === 'undefined') {
    window.print();
    return;
  }

  // Add printing class to body to restore desktop width for A4 render on mobile
  document.body.classList.add('printing-pdf');
  const clone = createRenderClone();

  try {
    // Wait for the browser rendering engine to resolve styles and paint the clone
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
  // Add printing class to body to restore desktop width for A4 render on mobile
  document.body.classList.add('printing-pdf');
  const clone = createRenderClone();

  try {
    // Wait for the browser rendering engine to resolve styles and paint the clone
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
    // Write PDF to cache directory
    const writeResult = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: 'CACHE'
    });
    
    // Open Android share sheet
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
    // Write PDF directly to public Documents folder on Android/iOS normal disk
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
      // Request permissions
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
        // Fallback to sharing via Cache
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
