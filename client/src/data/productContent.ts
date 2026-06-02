// Product-specific content data
// This file contains detailed content for each product that can be reused

export interface ProductShortHighlight {
  icon: string; // Emoji or icon identifier
  text: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

export interface KeyFeature {
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ProductContent {
  shortHighlights: ProductShortHighlight[];
  howItWorks: {
    headline: string;
    steps: HowItWorksStep[];
    note?: string;
  };
  keyFeatures: {
    headline: string;
    features: KeyFeature[];
  };
  faqs: {
    headline: string;
    items: FAQ[];
  };
  complianceNote?: string;
  metaTitle?: string;
  metaDescription?: string;
}

// Product content mapping
export const productContentMap: Record<string, ProductContent> = {
  aadhaar: {
    shortHighlights: [
      { icon: "✅", text: "Verify Aadhaar via OTP (eKYC)" },
      { icon: "📄", text: "Extract Data from Aadhaar Card" },
      { icon: "🔒", text: "Download Aadhaar Info PDF" },
    ],
    howItWorks: {
      headline: "How It Works",
      steps: [
        {
          step: 1,
          title: "Enter Your Aadhaar Number",
          description: "Safely input your Aadhaar for verification.",
        },
        {
          step: 2,
          title: "Complete OTP Verification",
          description: "Receive an OTP on your registered mobile and confirm identity.",
        },
        {
          step: 3,
          title: "Instant Results",
          description: "Get verified Aadhaar details instantly, securely, and accurately.",
        },
      ],
      note: "All data is processed in real-time using secure UIDAI-compliant APIs.",
    },
    keyFeatures: {
      headline: "Key Features",
      features: [
        {
          title: "OTP-based eKYC Verification",
          description: "Instant authentication using registered mobile OTP.",
        },
        {
          title: "Data Extraction",
          description: "Retrieve verified Aadhaar details like Name, DOB, Gender, and Address.",
        },
        {
          title: "Download Options",
          description: "Get a verified Aadhaar Information PDF for records.",
        },
        {
          title: "High Accuracy",
          description: "99% match rate with UIDAI database.",
        },
        {
          title: "Instant Processing",
          description: "Results within seconds, 24×7 availability.",
        },
        {
          title: "Secure & Compliant",
          description: "End-to-end encryption and consent-based verification.",
        },
      ],
    },
    faqs: {
      headline: "FAQs",
      items: [
        {
          question: "How does Aadhaar verification work?",
          answer: "It verifies your Aadhaar details directly through UIDAI servers using OTP-based authentication.",
        },
        {
          question: "Is my Aadhaar data safe?",
          answer: "Yes, we follow strict data privacy and encryption protocols. Your Aadhaar number is never stored or shared.",
        },
        {
          question: "Can I download my Aadhaar details?",
          answer: "Yes, you can download verified details as a secure PDF for your personal use.",
        },
        {
          question: "How long does verification take?",
          answer: "Verification completes within seconds after OTP confirmation.",
        },
        {
          question: "Is this service government-approved?",
          answer: "Yes, we use UIDAI-compliant APIs and adhere to data protection guidelines.",
        },
      ],
    },
    complianceNote: "We comply with UIDAI and data privacy norms. User consent is mandatory before verification. No biometric data is stored or shared.",
    metaTitle: "Aadhaar Verification | Verify My KYC",
    metaDescription: "Instantly verify your Aadhaar using OTP-based eKYC. Download Aadhaar PDF securely. Trusted, fast, and UIDAI-compliant verification platform.",
  },
  pan: {
    shortHighlights: [
      { icon: "✅", text: "Verify PAN Holder Name & Status" },
      { icon: "📊", text: "Fetch Father's Name from PAN Database" },
      { icon: "🔗", text: "Check PAN Aadhaar Linking Status" },
      { icon: "🧾", text: "Retrieve Associated GSTIN/DIN/CIN" },
      { icon: "📄", text: "Download PAN info PDF" },
    ],
    howItWorks: {
      headline: "How It Works",
      steps: [
        {
          step: 1,
          title: "Enter PAN Number",
          description: "Safely input your PAN for instant verification.",
        },
        {
          step: 2,
          title: "System Checks Validity",
          description: "The platform connects with verified government databases.",
        },
        {
          step: 3,
          title: "Instant Results",
          description: "Get real-time verification details including PAN holder name, status, and linkage info.",
        },
      ],
      note: "All results are fetched securely and verified via official data sources.",
    },
    keyFeatures: {
      headline: "Key Features",
      features: [
        {
          title: "Instant PAN Validation",
          description: "Verify PAN status in real time with NSDL/ITD data.",
        },
        {
          title: "Data Fetching",
          description: "Retrieve PAN holder details including Father's Name and category.",
        },
        {
          title: "Linkage Check",
          description: "Verify PAN-Aadhaar link status in seconds.",
        },
        {
          title: "Extended Lookup",
          description: "Fetch GSTIN, DIN, or CIN linked to the same PAN.",
        },
        {
          title: "Dashboard View",
          description: "Manage and track all PAN verifications easily.",
        },
        {
          title: "Compliant & Secure",
          description: "End-to-end encrypted and consent-based verification.",
        },
      ],
    },
    faqs: {
      headline: "FAQs",
      items: [
        {
          question: "How does PAN verification work?",
          answer: "Our system checks PAN details directly from NSDL/ITD databases and verifies name, status, and linkage.",
        },
        {
          question: "What additional details can I fetch?",
          answer: "You can get Father's Name, GSTIN, DIN, and CIN associated with the PAN.",
        },
        {
          question: "How long does it take to verify?",
          answer: "PAN verification happens within seconds.",
        },
        {
          question: "Is my data safe?",
          answer: "Absolutely. All data is encrypted and deleted as per privacy policy.",
        },
      ],
    },
    complianceNote: "We comply with government and data protection standards. PAN data is used only for verification and never shared with third parties.",
    metaTitle: "PAN Verification | Verify My KYC",
    metaDescription: "Instantly verify PAN holder name, status, Aadhaar linkage, and related GSTIN/DIN/CIN. Secure, accurate, and government-compliant PAN verification platform.",
  },
  voterid: {
    shortHighlights: [
      { icon: "🧾", text: "Fetch Voter Name, Age & EPIC Number" },
      { icon: "🗳️", text: "Retrieve Constituency, State & Booth Info" },
      { icon: "✅", text: "Verify Voter ID Authenticity & Status" },
    ],
    howItWorks: {
      headline: "How It Works",
      steps: [
        {
          step: 1,
          title: "Enter Voter ID Number (EPIC)",
          description: "Safely input your Voter ID for verification.",
        },
        {
          step: 2,
          title: "System Connects with Database",
          description: "The platform cross-verifies data from official election records.",
        },
        {
          step: 3,
          title: "Instant Results",
          description: "Get details like Voter Name, Age, State, and Booth information instantly.",
        },
      ],
      note: "All information is fetched from trusted and government-authorized sources.",
    },
    keyFeatures: {
      headline: "Key Features",
      features: [
        {
          title: "Voter Info Retrieval",
          description: "Instantly fetch full voter details — name, age, EPIC number, and gender.",
        },
        {
          title: "Constituency Details",
          description: "Retrieve your assembly constituency, state, and polling booth data.",
        },
        {
          title: "Authenticity Check",
          description: "Validate whether the Voter ID is active and genuine.",
        },
        {
          title: "Error-Free & Updated",
          description: "Data sourced from the Election Commission for accuracy.",
        },
        {
          title: "Compliant & Secure",
          description: "Fully encrypted process ensuring user data protection.",
        },
      ],
    },
    faqs: {
      headline: "FAQs",
      items: [
        {
          question: "What details can I verify using Voter ID verification?",
          answer: "You can fetch Voter Name, Age, Gender, EPIC number, and constituency details.",
        },
        {
          question: "How is Voter ID authenticity checked?",
          answer: "Our system cross-checks data directly from the Election Commission database.",
        },
        {
          question: "How fast will I get results?",
          answer: "Verification is completed within seconds.",
        },
        {
          question: "Is my data safe during verification?",
          answer: "Absolutely. All processes are encrypted and privacy compliant.",
        },
      ],
    },
    complianceNote: "We comply with Election Commission and data privacy norms. Voter ID data is used only for verification purposes and never shared externally.",
    metaTitle: "Voter ID Verification | Verify My KYC",
    metaDescription: "Instantly verify Voter ID details — name, age, EPIC, constituency, and authenticity. Secure, real-time verification powered by government data.",
  },
  passport: {
    shortHighlights: [
      { icon: "✅", text: "Verify Passport Holder & Validity" },
      { icon: "📄", text: "Generate Machine Readable Zone (MRZ)" },
      { icon: "🔍", text: "Validate MRZ Checksum & Authenticity" },
      { icon: "📅", text: "Retrieve Issue/Expiry Date & Authority" },
    ],
    howItWorks: {
      headline: "How It Works",
      steps: [
        {
          step: 1,
          title: "Enter Passport Number or Upload Scan",
          description: "Securely input or upload the passport for verification.",
        },
        {
          step: 2,
          title: "System Reads MRZ Code",
          description: "The system extracts MRZ (Machine Readable Zone) data from the document.",
        },
        {
          step: 3,
          title: "Validation & Cross-check",
          description: "Information is cross-verified with authorized data sources.",
        },
        {
          step: 4,
          title: "Instant Results",
          description: "Get verified passport details, including issue and expiry dates, within seconds.",
        },
      ],
      note: "All verifications are processed through secure and compliant channels.",
    },
    keyFeatures: {
      headline: "Key Features",
      features: [
        {
          title: "Authenticity Check",
          description: "Confirms if the passport is genuine and valid.",
        },
        {
          title: "MRZ Validation",
          description: "Automatically extracts and verifies MRZ checksum for accuracy.",
        },
        {
          title: "Full Detail Retrieval",
          description: "Instantly fetch issue date, expiry date, and issuing authority details.",
        },
        {
          title: "API & Dashboard Support",
          description: "Designed for seamless integration into your existing workflow.",
        },
        {
          title: "Error-Free Verification",
          description: "High-accuracy results powered by government and global data sources.",
        },
        {
          title: "Compliance-Ready",
          description: "Built for KYC, travel, HR, and financial verification requirements.",
        },
      ],
    },
    faqs: {
      headline: "FAQs",
      items: [
        {
          question: "What details can I verify using Passport Verification?",
          answer: "You can verify holder name, passport number, issue date, expiry date, and MRZ authenticity.",
        },
        {
          question: "How is authenticity validated?",
          answer: "Our system cross-checks MRZ checksum and matches key data fields for accuracy.",
        },
        {
          question: "How long does the verification take?",
          answer: "Verification is completed instantly — results are displayed within seconds.",
        },
        {
          question: "Is my data secure?",
          answer: "Absolutely. All verifications are encrypted and compliant with data privacy laws.",
        },
      ],
    },
    complianceNote: "Verify My KYC adheres to strict data privacy and compliance regulations. All verification processes follow IT Act and GDPR guidelines, ensuring no personal data is stored or shared.",
    metaTitle: "Passport Verification | Verify My KYC",
    metaDescription: "Instantly verify passport authenticity, MRZ checksum, and validity. Get fast and secure passport verification with real-time results and compliance-ready checks.",
  },
  epfo: {
    shortHighlights: [
      { icon: "📱", text: "Fetch UAN by Mobile or PAN" },
      { icon: "📋", text: "Retrieve Employment History by UAN" },
      { icon: "🏢", text: "Verify Employer Establishment Details" },
    ],
    howItWorks: {
      headline: "How It Works",
      steps: [
        {
          step: 1,
          title: "Enter Mobile Number or PAN",
          description: "Start by entering registered mobile or PAN to fetch UAN.",
        },
        {
          step: 2,
          title: "Fetch Employment Data",
          description: "System retrieves employment history and passbook information.",
        },
        {
          step: 3,
          title: "Verification Summary",
          description: "Get complete verification details — UAN, employer, and contribution data — instantly.",
        },
      ],
      note: "All details are sourced securely from EPFO-authorized data repositories.",
    },
    keyFeatures: {
      headline: "Key Features",
      features: [
        {
          title: "UAN Retrieval",
          description: "Fetch Universal Account Number using registered mobile or PAN.",
        },
        {
          title: "Employment History",
          description: "Instantly view past and current employer details.",
        },
        {
          title: "Employer Verification",
          description: "Confirm establishment information and registration validity.",
        },
        {
          title: "Accurate & Compliant",
          description: "Data fetched through trusted EPFO portals for authenticity.",
        },
      ],
    },
    faqs: {
      headline: "FAQs",
      items: [
        {
          question: "What can I verify using EPFO Verification?",
          answer: "You can verify UAN details, employment history, and employer establishment information.",
        },
        {
          question: "How is employment data fetched?",
          answer: "The system securely connects with EPFO records to retrieve verified employment and contribution data.",
        },
        {
          question: "Do I need the employee's OTP for verification?",
          answer: "No, the verification process doesn't require any OTP. The data is securely fetched from authorized EPFO sources without employee intervention.",
        },
        {
          question: "How accurate is the data?",
          answer: "Data is sourced directly from EPFO databases, ensuring authenticity and reliability.",
        },
        {
          question: "Is my information safe during verification?",
          answer: "Absolutely. All processes are encrypted and privacy-compliant.",
        },
      ],
    },
    complianceNote: "Verify My KYC follows strict data privacy and compliance standards. All EPFO data is accessed securely and never stored or shared externally.",
    metaTitle: "EPFO Verification | Verify My KYC",
    metaDescription: "Instantly verify EPFO details, UAN, and employment history. Fetch employer and passbook information securely with real-time validation powered by trusted sources.",
  },
  drivinglicense: {
    shortHighlights: [
      { icon: "👤", text: "Fetch DL Holder Name, DOB & Address" },
      { icon: "✅", text: "Check DL Validity & Expiry Date" },
      { icon: "🚗", text: "Retrieve Issuing RTO & Vehicle Class" },
      { icon: "📊", text: "Get DL Status (Active/Suspended)" },
    ],
    howItWorks: {
      headline: "How It Works",
      steps: [
        {
          step: 1,
          title: "Enter Driving License Number",
          description: "Safely input the DL number for verification.",
        },
        {
          step: 2,
          title: "System Connects with Database",
          description: "The platform validates details from authorized transport records.",
        },
        {
          step: 3,
          title: "Instant Verification",
          description: "Get license holder name, issue/expiry date, RTO info, and DL status within seconds.",
        },
      ],
      note: "All results are fetched from official and verified data sources.",
    },
    keyFeatures: {
      headline: "Key Features",
      features: [
        {
          title: "DL Holder Verification",
          description: "Instantly verify the holder's name, DOB, and address.",
        },
        {
          title: "License Validity Check",
          description: "Know if the DL is active, expired, or suspended.",
        },
        {
          title: "Issuing RTO Details",
          description: "Retrieve information about the issuing authority and vehicle class.",
        },
        {
          title: "Error Free Results",
          description: "Accurate data directly from government transport records.",
        },
        {
          title: "Compliance-Ready",
          description: "Suitable for employment, background, and identity verification needs.",
        },
        {
          title: "Secure Process",
          description: "All verifications are performed through encrypted channels.",
        },
      ],
    },
    faqs: {
      headline: "FAQs",
      items: [
        {
          question: "What details can I verify using Driving License Verification?",
          answer: "You can verify the license holder's name, DOB, address, validity, and RTO information.",
        },
        {
          question: "How does the system verify license authenticity?",
          answer: "It cross-verifies entered DL data with official transport databases for validation.",
        },
        {
          question: "Can I check if a license is active or suspended?",
          answer: "Yes, the system shows the current DL status, including validity and suspension details.",
        },
        {
          question: "How accurate are the results?",
          answer: "All data is fetched from authorized government sources, ensuring maximum accuracy.",
        },
        {
          question: "Is my information secure?",
          answer: "Yes, all verification processes are fully encrypted and compliant with data privacy laws.",
        },
      ],
    },
    complianceNote: "Verify My KYC ensures complete data security and compliance with IT Act and government norms. Verification data is accessed securely and never stored or shared externally.",
    metaTitle: "Driving License Verification | Verify My KYC",
    metaDescription: "Instantly verify driving license holder name, validity, and RTO details. Get real-time, accurate, and secure license verification results within seconds.",
  },
  vehicle: {
    shortHighlights: [
      { icon: "🚗", text: "Fetch Basic RC Details (Owner, Reg. No.)" },
      { icon: "📋", text: "Get Detailed RC: Engine, Chassis, Fuel Type" },
      { icon: "🚨", text: "Retrieve Active E-Challans & Pending Fines" },
      { icon: "🔍", text: "Lookup Vehicle by Chassis Number" },
    ],
    howItWorks: {
      headline: "How It Works",
      steps: [
        {
          step: 1,
          title: "Enter Vehicle Registration or Chassis Number",
          description: "Begin by entering the vehicle's registration or chassis details.",
        },
        {
          step: 2,
          title: "System Fetches Data from Transport Records",
          description: "The platform retrieves details from verified databases.",
        },
        {
          step: 3,
          title: "Instant Report Generation",
          description: "Get ownership, RC, and challan details within seconds.",
        },
      ],
      note: "All data is securely sourced from authorized government transport portals.",
    },
    keyFeatures: {
      headline: "Key Features",
      features: [
        {
          title: "RC Verification",
          description: "Instantly verify ownership, registration number, and vehicle details.",
        },
        {
          title: "Chassis & Engine Info",
          description: "Retrieve engine number, chassis number, and fuel type.",
        },
        {
          title: "Challan Lookup",
          description: "Check for any active e-challans or pending fines.",
        },
        {
          title: "Accurate & Updated",
          description: "Data fetched directly from verified RTO sources.",
        },
        {
          title: "Secure & Compliant",
          description: "End-to-end encrypted verification process.",
        },
        {
          title: "Quick Insights",
          description: "Ideal for pre-purchase, insurance, or background verification checks.",
        },
      ],
    },
    faqs: {
      headline: "FAQs",
      items: [
        {
          question: "What can I verify using Vehicle Verification?",
          answer: "You can verify vehicle ownership, registration number, RC details, and challan status.",
        },
        {
          question: "Can I check pending challans or fines?",
          answer: "Yes, the system retrieves any active e-challans and pending fines.",
        },
        {
          question: "How does the system ensure accuracy?",
          answer: "All vehicle details are fetched directly from government transport databases.",
        },
        {
          question: "Is the chassis number required for verification?",
          answer: "You can verify using either registration number or chassis number.",
        },
        {
          question: "Is my data secure during the process?",
          answer: "Absolutely. The entire verification process is encrypted and privacy-compliant.",
        },
      ],
    },
    complianceNote: "Verify My KYC complies with data security and privacy regulations. All vehicle verification data is accessed through authorized government portals and never stored or shared externally.",
    metaTitle: "Vehicle Verification | Verify My KYC",
    metaDescription: "Instantly verify vehicle registration, RC, and challan details. Check ownership, engine, and chassis information with real-time, secure vehicle verification.",
  },
  company: {
    shortHighlights: [
      { icon: "✅", text: "Verify Company Name & Registration Status" },
      { icon: "📅", text: "Fetch Incorporation Date & ROC Details" },
      { icon: "👥", text: "Retrieve Director List via DIN" },
      { icon: "💰", text: "Get Authorized Capital & Company Type" },
    ],
    howItWorks: {
      headline: "How It Works",
      steps: [
        {
          step: 1,
          title: "Enter Company Name or CIN",
          description: "Begin by entering the registered company name or Corporate Identification Number.",
        },
        {
          step: 2,
          title: "System Connects with MCA Records",
          description: "The platform retrieves details from verified corporate databases.",
        },
        {
          step: 3,
          title: "Instant Verification",
          description: "Get company registration, director details, and incorporation info within seconds.",
        },
      ],
      note: "All company data is fetched from government-authorized MCA sources.",
    },
    keyFeatures: {
      headline: "Key Features",
      features: [
        {
          title: "Company Registration Check",
          description: "Verify legal status, CIN, and incorporation details.",
        },
        {
          title: "Director Verification",
          description: "Retrieve active and past directors via Director Identification Number (DIN).",
        },
        {
          title: "ROC Details",
          description: "Access information about the registered office and ROC jurisdiction.",
        },
        {
          title: "Financial Insights",
          description: "Get authorized capital, company type, and class.",
        },
        {
          title: "Error-Free Verification",
          description: "Data fetched from reliable and updated MCA databases.",
        },
        {
          title: "Secure Process",
          description: "Fully encrypted verification ensuring data integrity.",
        },
      ],
    },
    faqs: {
      headline: "FAQs",
      items: [
        {
          question: "What can I verify using Company Verification?",
          answer: "You can verify company registration, incorporation date, ROC details, and directors' list.",
        },
        {
          question: "Where is the data sourced from?",
          answer: "All details are fetched directly from the Ministry of Corporate Affairs (MCA) database.",
        },
        {
          question: "Can I verify company directors?",
          answer: "Yes, you can retrieve active and inactive director details using their DIN.",
        },
        {
          question: "How accurate is the information?",
          answer: "Data is pulled directly from MCA records, ensuring high accuracy and compliance.",
        },
        {
          question: "Is my search data private?",
          answer: "Yes, all verification activity is encrypted and fully privacy compliant.",
        },
      ],
    },
    complianceNote: "Verify My KYC adheres to all data security and privacy regulations. Company verification data is accessed securely from MCA portals and never stored or shared externally.",
    metaTitle: "Company Verification | Verify My KYC",
    metaDescription: "Instantly verify company registration, incorporation, and director details. Secure, real-time company verification powered by trusted MCA records.",
  },
  gstin: {
    shortHighlights: [
      { icon: "✅", text: "Verify Business Name & Legal Status" },
      { icon: "📅", text: "Fetch GST Registration Date & State Code" },
      { icon: "👥", text: "Retrieve Proprietor/Partner/Director Info" },
      { icon: "📍", text: "Get Business Address & Constitution Type" },
    ],
    howItWorks: {
      headline: "How It Works",
      steps: [
        {
          step: 1,
          title: "Enter GSTIN or Business Name",
          description: "Input the GST number or legal business name.",
        },
        {
          step: 2,
          title: "System Fetches GSTN Data",
          description: "Instantly connects with official GST records.",
        },
        {
          step: 3,
          title: "Instant Report",
          description: "View registration, business type, and contact details within seconds.",
        },
      ],
      note: "All details are verified using live GSTN data sources.",
    },
    keyFeatures: {
      headline: "Key Features",
      features: [
        {
          title: "GSTIN Verification",
          description: "Confirm the validity and registration status of any GST number.",
        },
        {
          title: "Legal Entity Information",
          description: "Retrieve the business's registered name, constitution type, and address.",
        },
        {
          title: "Owner/Partner Details",
          description: "Access details of proprietors, directors, or partners associated with the GSTIN.",
        },
        {
          title: "State Code & Registration Date",
          description: "Identify the issuing state and the date of GST registration.",
        },
        {
          title: "Live Data Sync",
          description: "Updated directly from government GSTN databases for accuracy.",
        },
        {
          title: "Secure & Private",
          description: "100% encrypted and compliant verification.",
        },
      ],
    },
    faqs: {
      headline: "FAQs",
      items: [
        {
          question: "What details can I verify with GST Verification?",
          answer: "You can verify business name, legal status, registration date, address, and associated owners.",
        },
        {
          question: "Is the GST data updated in real time?",
          answer: "Yes, information is fetched directly from the GSTN database and updated regularly.",
        },
        {
          question: "Can I verify a business using its name only?",
          answer: "No, verification is done only using the GST number provided.",
        },
        {
          question: "Is this verification valid for compliance use?",
          answer: "Yes, all data is sourced from government-verified databases for legitimate verification.",
        },
        {
          question: "Does this service require the business's consent?",
          answer: "No, GST data is publicly available under compliance norms for verification purposes.",
        },
      ],
    },
    complianceNote: "Verify My KYC uses official GSTN APIs and public databases for validation. All data handling follows government and data privacy guidelines to ensure security and compliance.",
    metaTitle: "Online GST Verification | GST Verification | Verify My KYC",
    metaDescription: "Instantly verify GST registration, business name, and legal details. Secure and real-time GST verification with data sourced from official GSTN records.",
  },
  ccrv: {
    shortHighlights: [
      { icon: "🔍", text: "Search Criminal Records by Name & DOB" },
      { icon: "📄", text: "Fetch FIR & Court Case Details" },
      { icon: "⚖️", text: "Verify Case Status: Pending/Disposed" },
      { icon: "📥", text: "Download Verifiable PDF Report" },
    ],
    howItWorks: {
      headline: "How It Works",
      steps: [
        {
          step: 1,
          title: "Enter Name & DOB",
          description: "Provide the individual's Full Name, DOB, Father Name, Address, Aadhar Pan Card, Pan Card.",
        },
        {
          step: 2,
          title: "Automated Database Search",
          description: "The system scans verified legal and court records.",
        },
        {
          step: 3,
          title: "Instant Report",
          description: "View criminal case summaries and download a verified PDF report.",
        },
      ],
      note: "All data is fetched from authorized legal databases for accuracy and compliance.",
    },
    keyFeatures: {
      headline: "Key Features",
      features: [
        {
          title: "Comprehensive Search",
          description: "Access FIR, case numbers, and status details instantly.",
        },
        {
          title: "Court Record Validation",
          description: "Verify pending or disposed cases with court references.",
        },
        {
          title: "Secure PDF Reports",
          description: "Get downloadable reports with reference IDs for record-keeping.",
        },
        {
          title: "Multi State Coverage",
          description: "Includes major High Courts, District Courts, and FIR records.",
        },
        {
          title: "Data Privacy First",
          description: "All checks are encrypted and compliant with data laws.",
        },
      ],
    },
    faqs: {
      headline: "FAQs",
      items: [
        {
          question: "What details are required for a criminal case check?",
          answer: "You need the Full Name, DOB, Father Name, Address, Aadhar Pan Card, Pan Card of the individual to perform the search.",
        },
        {
          question: "Are FIR and court records both included?",
          answer: "Yes, the system scans both FIR listings and court case records for comprehensive results.",
        },
        {
          question: "Is the information reliable?",
          answer: "Yes, data is sourced from official legal databases and verified through secure channels.",
        },
        {
          question: "Can I download the results?",
          answer: "Yes, a verifiable PDF report is available after each search.",
        },
        {
          question: "Is this data public?",
          answer: "No, the data is not public. The verification results are securely stored and accessible only through the user's dashboard.",
        },
      ],
    },
    complianceNote: "All verifications comply with data privacy and security standards. Information is accessed only through authorized legal databases and is visible exclusively on the user's secure dashboard. No public or unauthorized data is disclosed.",
    metaTitle: "Criminal Verification | Crime Check | Online Court Case Check | Criminal Case Record Verification | Verify My KYC",
    metaDescription: "Instantly verify criminal records, FIR details, and court cases by name and DOB. Secure, fast, and compliant background verification for businesses.",
  },
  "bank-account": {
    shortHighlights: [
      { icon: "✅", text: "Verify Account Number & IFSC Code" },
      { icon: "👤", text: "Match Account Holder Name" },
      { icon: "📊", text: "Confirm Account Status (Active/Closed)" },
      { icon: "🔒", text: "Instant, Secure, and Accurate Verification" },
    ],
    howItWorks: {
      headline: "How It Works",
      steps: [
        {
          step: 1,
          title: "Enter Account Details",
          description: "Input the account number and IFSC code.",
        },
        {
          step: 2,
          title: "System Validates Information",
          description: "The platform checks the details from authorized banking data sources.",
        },
        {
          step: 3,
          title: "Instant Result",
          description: "View the verified account holder name and account status within seconds.",
        },
      ],
      note: "Verification is done securely without storing or sharing banking credentials.",
    },
    keyFeatures: {
      headline: "Key Features",
      features: [
        {
          title: "Account Validation",
          description: "Instantly confirm account authenticity and active status.",
        },
        {
          title: "Name Match",
          description: "Check if the entered name matches the bank records.",
        },
        {
          title: "IFSC Lookup",
          description: "Verify bank name, branch, and location.",
        },
        {
          title: "Error-Free Checks",
          description: "Avoid failed payments or fraudulent transactions.",
        },
        {
          title: "Secure Process",
          description: "End-to-end encrypted data handling.",
        },
      ],
    },
    faqs: {
      headline: "FAQs",
      items: [
        {
          question: "What details are required for bank verification?",
          answer: "You need the account number and IFSC code for verification.",
        },
        {
          question: "Do I need the account holder's consent?",
          answer: "No, verification is done securely and compliantly without needing direct consent.",
        },
        {
          question: "What can I verify?",
          answer: "You can verify the account holder's name, bank branch, IFSC details, and account status.",
        },
        {
          question: "Is this a secure process?",
          answer: "Yes, all data is end-to-end encrypted and never stored or shared.",
        },
        {
          question: "Can I verify multiple accounts?",
          answer: "Yes, multiple accounts can be verified from your dashboard as per your plan.",
        },
      ],
    },
    complianceNote: "All bank verifications comply with RBI guidelines and data privacy standards. Verification results are accessible only through the user's secure dashboard and never shared publicly.",
    metaTitle: "Bank Account Verification | Verify My KYC",
    metaDescription: "Instantly verify bank account details — name, IFSC, and status. Secure, compliant, and accurate verification for employee or vendor onboarding.",
  },
};

// Helper function to get product content
export function getProductContent(productId: string): ProductContent | null {
  return productContentMap[productId] || null;
}

