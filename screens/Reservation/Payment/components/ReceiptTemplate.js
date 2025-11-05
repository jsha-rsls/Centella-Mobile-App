// services/ReceiptTemplate.js
// Professional PDF receipt template with corporate styling

const styles = `
  @page {
    size: A4;
    margin: 20mm;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #1f2937;
    background: white;
    font-size: 13px;
  }
  
  .container {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    background: white;
  }
  
  /* Header Section */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 24px;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 32px;
  }
  
  .header-left h1 {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
    letter-spacing: -0.5px;
  }
  
  .header-left p {
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }
  
  .header-right {
    text-align: right;
  }
  
  .receipt-number {
    font-size: 11px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }
  
  .receipt-number-value {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 1px;
  }
  
  /* Alert Banner */
  .alert-banner {
    background: #fef3c7;
    border-left: 3px solid #d97706;
    padding: 16px;
    margin-bottom: 24px;
    border-radius: 4px;
  }
  
  .alert-banner h3 {
    color: #92400e;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 6px;
  }
  
  .alert-banner p {
    color: #78350f;
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 4px;
  }
  
  .alert-banner p:last-child {
    margin-bottom: 0;
  }
  
  .deadline-highlight {
    color: #dc2626;
    font-weight: 700;
  }
  
  /* Two Column Layout */
  .two-column {
    display: flex;
    gap: 32px;
    margin-bottom: 24px;
  }
  
  .column {
    flex: 1;
  }
  
  /* Section Styling */
  .section {
    margin-bottom: 24px;
  }
  
  .section-title {
    font-size: 11px;
    color: #6b7280;
    text-transform: uppercase;
    margin-bottom: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 8px;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f3f4f6;
    font-size: 13px;
  }
  
  .info-row:last-child {
    border-bottom: none;
  }
  
  .info-label {
    color: #6b7280;
    font-weight: 500;
  }
  
  .info-value {
    color: #111827;
    font-weight: 600;
  }
  
  /* Amount Box */
  .amount-box {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    padding: 24px;
    border-radius: 6px;
    margin: 24px 0;
    text-align: center;
  }
  
  .amount-label {
    font-size: 11px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  .amount-value {
    font-size: 40px;
    color: #111827;
    font-weight: 700;
    letter-spacing: -1px;
  }
  
  /* Instructions Box */
  .instructions-box {
    background: #f0fdf4;
    border-left: 3px solid #16a34a;
    padding: 16px;
    border-radius: 4px;
    margin: 24px 0;
  }
  
  .instructions-box h3 {
    font-size: 13px;
    font-weight: 700;
    color: #15803d;
    margin-bottom: 12px;
  }
  
  .instructions-box ol {
    margin-left: 20px;
    color: #166534;
  }
  
  .instructions-box li {
    margin-bottom: 8px;
    font-size: 12px;
    line-height: 1.5;
  }
  
  .instructions-box li:last-child {
    margin-bottom: 0;
  }
  
  .instructions-box strong {
    font-weight: 700;
    color: #15803d;
  }
  
  /* Footer */
  .footer {
    background: #f9fafb;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #e5e7eb;
    margin-top: 32px;
    border-radius: 4px;
    font-size: 11px;
    color: #6b7280;
  }
  
  .footer p {
    margin-bottom: 4px;
  }
  
  .footer p:last-child {
    margin-bottom: 0;
  }
  
  .footer-company {
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
  }
  
  .timestamp {
    margin-top: 8px;
    font-size: 10px;
    color: #9ca3af;
  }
  
  /* Status Badge */
  .status-badge {
    display: inline-block;
    background: #fef3c7;
    color: #92400e;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

// Reusable template sections
const createHeader = () => `
  <div class="header">
    <div class="header-left">
      <h1>Facility Reservation Receipt</h1>
      <p>Cash Payment Pending Verification</p>
    </div>
    <div class="header-right">
      <div class="receipt-number">Receipt ID</div>
      <div class="receipt-number-value">#${new Date().getTime().toString().slice(-8)}</div>
    </div>
  </div>
`

const createAlertBanner = (expiryDate) => `
  <div class="alert-banner">
    <h3>Payment Deadline Notice</h3>
    <p>Payment must be completed in cash at the HOA office within <strong>1 hour</strong> from receipt generation.</p>
    <p>Failure to pay by the deadline will result in automatic reservation cancellation.</p>
    <p><strong>Payment Deadline:</strong> <span class="deadline-highlight">${expiryDate}</span></p>
  </div>
`

const createFacilityDetails = (bookingData) => `
  <div class="section">
    <div class="section-title">Facility Details</div>
    <div class="info-row">
      <span class="info-label">Facility Name</span>
      <span class="info-value">${bookingData.facility}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Reservation Date</span>
      <span class="info-value">${bookingData.date}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Time Slot</span>
      <span class="info-value">${bookingData.time}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Status</span>
      <span class="status-badge">Pending Payment</span>
    </div>
  </div>
`

const createAmountBox = (price) => `
  <div class="amount-box">
    <div class="amount-label">Amount Due</div>
    <div class="amount-value">₱${price}</div>
  </div>
`

const createInstructions = (price) => `
  <div class="instructions-box">
    <h3>Payment Instructions</h3>
    <ol>
      <li>Print or save this receipt on your mobile device</li>
      <li>Visit the HOA office during business hours</li>
      <li>Present this receipt to the administrative staff</li>
      <li>Pay the exact amount of <strong>₱${price}</strong> in cash</li>
      <li>Obtain an official payment receipt from the HOA office</li>
      <li>Your reservation will be confirmed upon payment verification</li>
    </ol>
  </div>
`

const createPaymentInfo = (currentDate, expiryDate) => `
  <div class="two-column">
    <div class="section">
      <div class="section-title">Payment Information</div>
      <div class="info-row">
        <span class="info-label">Payment Method</span>
        <span class="info-value">Cash</span>
      </div>
      <div class="info-row">
        <span class="info-label">Payment Location</span>
        <span class="info-value">HOA Office</span>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Timeline</div>
      <div class="info-row">
        <span class="info-label">Receipt Generated</span>
        <span class="info-value">${currentDate}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Valid Until</span>
        <span class="info-value">${expiryDate}</span>
      </div>
    </div>
  </div>
`

const createFooter = (currentDate) => `
  <div class="footer">
    <div class="footer-company">HOA Facility Management System</div>
    <p>For inquiries or assistance, contact the HOA administrative office</p>
    <div class="timestamp">Generated on ${currentDate}</div>
  </div>
`

// Main template generator
export const generateCashReceiptHTML = (bookingData, reservationId) => {
  const currentDate = new Date().toLocaleString("en-PH", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  })

  const expiryDate = new Date(Date.now() + 60 * 60 * 1000).toLocaleString("en-PH", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${styles}</style>
</head>
<body>
  <div class="container">
    ${createHeader()}
    ${createAlertBanner(expiryDate)}
    ${createFacilityDetails(bookingData)}
    ${createAmountBox(bookingData.price)}
    ${createInstructions(bookingData.price)}
    ${createPaymentInfo(currentDate, expiryDate)}
    ${createFooter(currentDate)}
  </div>
</body>
</html>
  `
}

// Optional: Function to generate custom receipts with different sections
export const generateCustomReceipt = (config) => {
  const {
    bookingData,
    reservationId,
    sections = ["header", "alert", "details", "amount", "instructions", "payment", "footer"],
  } = config

  const currentDate = new Date().toLocaleString("en-PH", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  })

  const expiryDate = new Date(Date.now() + 60 * 60 * 1000).toLocaleString("en-PH", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  })

  const sectionMap = {
    header: createHeader(),
    alert: createAlertBanner(expiryDate),
    details: createFacilityDetails(bookingData),
    amount: createAmountBox(bookingData.price),
    instructions: createInstructions(bookingData.price),
    payment: createPaymentInfo(currentDate, expiryDate),
    footer: createFooter(currentDate),
  }

  const content = sections.map((section) => sectionMap[section] || "").join("\n")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${styles}</style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>
  `
}
