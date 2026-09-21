import { LanguageCode } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  categoryTag: string;
  getStarted: string;
  dashboardNav: string;
  contractsNav: string;
  remindersNav: string;
  calendarNav: string;
  documentsNav: string;
  analyticsNav: string;
  workflowNav: string;
  aboutNav: string;
  settingsNav: string;
  thankYouNav: string;
  welcomeBack: string;
  totalContracts: string;
  activeContracts: string;
  renewalsThisMonth: string;
  expiringSoon: string;
  safeContracts: string;
  criticalRisk: string;
  highRisk: string;
  mediumRisk: string;
  safeRisk: string;
  overallRiskIndex: string;
  addContract: string;
  searchContractsPlaceholder: string;
  allContracts: string;
  contractName: string;
  company: string;
  department: string;
  contractType: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  noticePeriod: string;
  contractValue: string;
  status: string;
  actions: string;
  viewDetails: string;
  editContract: string;
  deleteContract: string;
  setReminder: string;
  autoRenewal: string;
  daysRemaining: string;
  riskScore: string;
  statusActive: string;
  statusExpiringSoon: string;
  statusUnderReview: string;
  statusPendingApproval: string;
  statusRenewed: string;
  statusExpired: string;
  statusArchived: string;
  remindersTitle: string;
  remindersSubtitle: string;
  calendarTitle: string;
  documentsTitle: string;
  analyticsTitle: string;
  aiAssistant: string;
  askAiPlaceholder: string;
  chooseLanguage: string;
  chooseLanguageSubtitle: string;
  continueBtn: string;
  useEnglish: string;
  save: string;
  cancel: string;
  exportCsv: string;
  uploadDocument: string;
  ocrExtracting: string;
  escalationLevel: string;
  testSendAlert: string;
  alertSentSuccess: string;
}

export const enTranslations: TranslationDictionary = {
  appName: 'Contractly',
  tagline: 'Never Miss a Contract Renewal Again',
  heroHeadline: 'Stay Ahead of Every Contract Renewal.',
  heroSubtitle:
    'Manage contracts, track important dates, and receive timely reminders — all in one place.',
  categoryTag: 'CONTRACT MANAGEMENT | SMART REMINDERS | WORKFLOW',
  getStarted: 'GET STARTED',
  dashboardNav: 'Dashboard',
  contractsNav: 'Contracts',
  remindersNav: 'Reminders',
  calendarNav: 'Calendar',
  documentsNav: 'Documents',
  analyticsNav: 'Analytics',
  workflowNav: 'Renewals',
  aboutNav: 'About',
  settingsNav: 'Settings',
  thankYouNav: 'Thank You',
  welcomeBack: 'Good morning, Welcome back.',
  totalContracts: 'Total Contracts',
  activeContracts: 'Active Contracts',
  renewalsThisMonth: 'Renewals This Month',
  expiringSoon: 'Expiring Soon',
  safeContracts: 'Safe Contracts',
  criticalRisk: 'Critical (0–7 Days)',
  highRisk: 'High (8–30 Days)',
  mediumRisk: 'Medium (31–90 Days)',
  safeRisk: 'Safe (90+ Days)',
  overallRiskIndex: 'Portfolio Risk Index',
  addContract: 'Add Contract',
  searchContractsPlaceholder: 'Search contracts, vendors, or IDs...',
  allContracts: 'All Contracts',
  contractName: 'Contract Name',
  company: 'Company / Vendor',
  department: 'Department',
  contractType: 'Contract Type',
  startDate: 'Start Date',
  endDate: 'End Date',
  renewalDate: 'Renewal Date',
  noticePeriod: 'Notice Period',
  contractValue: 'Contract Value',
  status: 'Status',
  actions: 'Actions',
  viewDetails: 'View Details',
  editContract: 'Edit Contract',
  deleteContract: 'Delete',
  setReminder: 'Set Reminder',
  autoRenewal: 'Auto-Renewal',
  daysRemaining: 'Days Remaining',
  riskScore: 'Risk Score',
  statusActive: 'Active',
  statusExpiringSoon: 'Expiring Soon',
  statusUnderReview: 'Under Review',
  statusPendingApproval: 'Pending Approval',
  statusRenewed: 'Renewed',
  statusExpired: 'Expired',
  statusArchived: 'Archived',
  remindersTitle: 'Never Miss What Matters.',
  remindersSubtitle: 'Stay ahead of every important contract deadline and escalation.',
  calendarTitle: 'Renewal Calendar',
  documentsTitle: 'Your Documents, Organized.',
  analyticsTitle: 'Understand Your Contract Portfolio.',
  aiAssistant: 'AI Contract Assistant',
  askAiPlaceholder: 'Ask about expiring contracts, high-risk items, or auto-renewals...',
  chooseLanguage: 'Choose Your Language',
  chooseLanguageSubtitle:
    'Select the language you prefer for using Contractly. You can change it anytime from Settings.',
  continueBtn: 'Continue',
  useEnglish: 'Use English',
  save: 'Save Changes',
  cancel: 'Cancel',
  exportCsv: 'Export CSV',
  uploadDocument: 'Upload Document',
  ocrExtracting: 'Extracting key terms via OCR...',
  escalationLevel: 'Escalation Level',
  testSendAlert: 'Test Reminder Notification',
  alertSentSuccess: 'Notification simulated successfully!',
};

export const hiTranslations: Partial<TranslationDictionary> = {
  appName: 'कंट्रैक्टली (Contractly)',
  tagline: 'कभी भी अनुबंध नवीनीकरण न चूकें',
  heroHeadline: 'हर अनुबंध नवीनीकरण में आगे रहें।',
  heroSubtitle:
    'अनुबंध प्रबंधित करें, महत्वपूर्ण तारीखों को ट्रैक करें और समय पर अनुस्मारक प्राप्त करें — सब एक जगह।',
  categoryTag: 'अनुबंध प्रबंधन | स्मार्ट रिमाइंडर | वर्कफ़्लो',
  getStarted: 'शुरू करें',
  dashboardNav: 'डैशबोर्ड',
  contractsNav: 'अनुबंध',
  remindersNav: 'रिमाइंडर',
  calendarNav: 'कैलेंडर',
  documentsNav: 'दस्तावेज़',
  analyticsNav: 'विश्लेषण',
  workflowNav: 'नवीनीकरण',
  aboutNav: 'परिचय',
  settingsNav: 'सेटिंग्स',
  thankYouNav: 'धन्यवाद',
  welcomeBack: 'सुप्रभात, आपका पुनः स्वागत है।',
  totalContracts: 'कुल अनुबंध',
  activeContracts: 'सक्रिय अनुबंध',
  renewalsThisMonth: 'इस महीने नवीनीकरण',
  expiringSoon: 'शीघ्र समाप्त होने वाले',
  safeContracts: 'सुरक्षित अनुबंध',
  criticalRisk: 'गंभीर जोखिम (0–7 दिन)',
  highRisk: 'उच्च जोखिम (8–30 दिन)',
  mediumRisk: 'मध्यम जोखिम (31–90 दिन)',
  safeRisk: 'सुरक्षित (90+ दिन)',
  overallRiskIndex: 'पोर्टफोलियो जोखिम सूचकांक',
  addContract: 'नया अनुबंध जोड़ें',
  searchContractsPlaceholder: 'अनुबंध, विक्रेता या आईडी खोजें...',
  allContracts: 'सभी अनुबंध',
  contractName: 'अनुबंध का नाम',
  company: 'कंपनी / विक्रेता',
  department: 'विभाग',
  contractType: 'अनुबंध प्रकार',
  startDate: 'प्रारंभ तिथि',
  endDate: 'समाप्ति तिथि',
  renewalDate: 'नवीनीकरण तिथि',
  noticePeriod: 'नोटिस अवधि',
  contractValue: 'अनुबंध मूल्य',
  status: 'स्थिति',
  actions: 'कार्रवाई',
  viewDetails: 'विवरण देखें',
  editContract: 'संपादित करें',
  deleteContract: 'हटाएं',
  setReminder: 'रिमाइंडर सेट करें',
  autoRenewal: 'स्वतः नवीनीकरण',
  daysRemaining: 'शेष दिन',
  riskScore: 'जोखिम स्कोर',
  statusActive: 'सक्रिय',
  statusExpiringSoon: 'शीघ्र समाप्त',
  statusUnderReview: 'समीक्षाधीन',
  statusPendingApproval: 'स्वीकृति लंबित',
  statusRenewed: 'नवीनीकृत',
  statusExpired: 'समाप्त',
  statusArchived: 'संग्रहीत',
  remindersTitle: 'महत्वपूर्ण कभी न भूलें।',
  remindersSubtitle: 'हर महत्वपूर्ण अनुबंध समय-सीमा और एस्केलेशन से आगे रहें।',
  calendarTitle: 'नवीनीकरण कैलेंडर',
  documentsTitle: 'आपके दस्तावेज़, व्यवस्थित।',
  analyticsTitle: 'अपने अनुबंध पोर्टफोलियो को समझें।',
  aiAssistant: 'एआई अनुबंध सहायक',
  askAiPlaceholder: 'समाप्त होने वाले अनुबंधों या जोखिम के बारे में पूछें...',
  chooseLanguage: 'अपनी भाषा चुनें',
  chooseLanguageSubtitle:
    'कॉन्ट्रैक्टली का उपयोग करने के लिए अपनी पसंदीदा भाषा चुनें। आप इसे कभी भी सेटिंग्स से बदल सकते हैं।',
  continueBtn: 'जारी रखें',
  useEnglish: 'अंग्रेज़ी का उपयोग करें',
  save: 'परिवर्तन सहेजें',
  cancel: 'रद्द करें',
  exportCsv: 'सीएसवी निर्यात',
  uploadDocument: 'दस्तावेज़ अपलोड करें',
  ocrExtracting: 'ओसीआर से डेटा निकाला जा रहा है...',
  escalationLevel: 'एस्केलेशन स्तर',
  testSendAlert: 'परीक्षण सूचना भेजें',
  alertSentSuccess: 'सूचना सफलतापूर्वक प्रेषित की गई!',
};

export const taTranslations: Partial<TranslationDictionary> = {
  appName: 'கான்ட்ராக்ட்லி (Contractly)',
  tagline: 'எந்தவொரு ஒப்பந்த புதுப்பித்தலையும் தவறவிடாதீர்கள்',
  heroHeadline: 'ஒவ்வொரு ஒப்பந்த புதுப்பிப்பிலும் முன்னணியில் இருங்கள்.',
  heroSubtitle:
    'ஒப்பந்தங்களை நிர்வகியுங்கள், முக்கியமான தேதிகளைக் கண்காணியுங்கள், சரியான நேரத்தில் நினைவூட்டல்களைப் பெறுங்கள்.',
  categoryTag: 'ஒப்பந்த மேலாண்மை | ஸ்மார்ட் நினைவூட்டல்கள் | பணிப்பாய்வு',
  getStarted: 'தொடங்கவும்',
  dashboardNav: 'டாஷ்போர்டு',
  contractsNav: 'ஒப்பந்தங்கள்',
  remindersNav: 'நினைவூட்டல்கள்',
  calendarNav: 'நாட்காட்டி',
  documentsNav: 'ஆவணங்கள்',
  analyticsNav: 'பகுப்பாய்வு',
  workflowNav: 'புதுப்பிப்புகள்',
  aboutNav: 'பற்றி',
  settingsNav: 'அமைப்புகள்',
  thankYouNav: 'நன்றி',
  welcomeBack: 'காலை வணக்கம், மீண்டும் வருக.',
  totalContracts: 'மொத்த ஒப்பந்தங்கள்',
  activeContracts: 'செயலில் உள்ள ஒப்பந்தங்கள்',
  renewalsThisMonth: 'இந்த மாதம் புதுப்பிப்புகள்',
  expiringSoon: 'விரைவில் காலாவதியாகிறது',
  safeContracts: 'பாதுகாப்பான ஒப்பந்தங்கள்',
  criticalRisk: 'அபாயகரமானது (0–7 நாட்கள்)',
  highRisk: 'அதிக ஆபத்து (8–30 நாட்கள்)',
  mediumRisk: 'நடுத்தர ஆபத்து (31–90 நாட்கள்)',
  safeRisk: 'பாதுகாப்பானது (90+ நாட்கள்)',
  overallRiskIndex: 'ஒட்டுமொத்த ஆபத்து குறியீடு',
  addContract: 'ஒப்பந்தத்தைச் சேர்க்கவும்',
  searchContractsPlaceholder: 'ஒப்பந்தம், விற்பனையாளர் அல்லது ஐடி தேடவும்...',
  allContracts: 'அனைத்து ஒப்பந்தங்கள்',
  contractName: 'ஒப்பந்தத்தின் பெயர்',
  company: 'நிறுவனம் / விற்பனையாளர்',
  department: 'துறை',
  contractType: 'ஒப்பந்த வகை',
  startDate: 'தொடக்க தேதி',
  endDate: 'முடிவு தேதி',
  renewalDate: 'புதுப்பிப்பு தேதி',
  noticePeriod: 'அறிவிப்பு காலம்',
  contractValue: 'ஒப்பந்த மதிப்பு',
  status: 'நிலை',
  actions: 'செயல்கள்',
  viewDetails: 'விவரங்களைப் பார்க்கவும்',
  editContract: 'திருத்து',
  deleteContract: 'நீக்கு',
  setReminder: 'நினைவூட்டல் அமைக்கவும்',
  autoRenewal: 'தானியங்கி புதுப்பிப்பு',
  daysRemaining: 'மீதமுள்ள நாட்கள்',
  riskScore: 'ஆபத்து மதிப்பெண்',
  statusActive: 'செயலில் உள்ளது',
  statusExpiringSoon: 'விரைவில் காலாவதியாகிறது',
  statusUnderReview: 'மதிப்பாய்வில் உள்ளது',
  statusPendingApproval: 'ஒப்புதலுக்காகக் காத்திருக்கிறது',
  statusRenewed: 'புதுப்பிக்கப்பட்டது',
  statusExpired: 'காலாவதியானது',
  statusArchived: 'காப்பகப்படுத்தப்பட்டது',
  remindersTitle: 'முக்கியமான எதையும் தவறவிடாதீர்கள்.',
  remindersSubtitle: 'ஒவ்வொரு ஒப்பந்த காலக்கெடுவிற்கும் முன்னதாக தயாராக இருங்கள்.',
  calendarTitle: 'புதுப்பிப்பு நாட்காட்டி',
  documentsTitle: 'உங்கள் ஆவணங்கள், நேர்த்தியாக.',
  analyticsTitle: 'உங்கள் ஒப்பந்தங்களை பகுப்பாய்வு செய்யுங்கள்.',
  aiAssistant: 'AI ஒப்பந்த உதவியாளர்',
  askAiPlaceholder: 'காலாவதியாகும் ஒப்பந்தங்கள் பற்றி கேளுங்கள்...',
  chooseLanguage: 'உங்கள் மொழியைத் தேர்வுசெய்யவும்',
  chooseLanguageSubtitle:
    'Contractly-ஐப் பயன்படுத்த உங்கள் மொழியைத் தேர்ந்தெடுக்கவும். அமைப்புகளில் எப்போது வேண்டுமானாலும் மாற்றலாம்.',
  continueBtn: 'தொடரவும்',
  useEnglish: 'ஆங்கிலத்தைப் பயன்படுத்துங்கள்',
  save: 'சேமிக்கவும்',
  cancel: 'ரத்து செய்',
  exportCsv: 'CSV ஏற்றுமதி',
  uploadDocument: 'ஆவணத்தைப் பதிவேற்றவும்',
  ocrExtracting: 'OCR மூலம் பிரித்தெடுக்கப்படுகிறது...',
  escalationLevel: 'எஸ்கலேஷன் நிலை',
  testSendAlert: 'நினைவூட்டல் அறிவிப்பைச் சோதிக்கவும்',
  alertSentSuccess: 'அறிவிப்பு வெற்றிகரமாக உருவகப்படுத்தப்பட்டது!',
};

export const teTranslations: Partial<TranslationDictionary> = {
  appName: 'కాంట్రాక్ట్లీ (Contractly)',
  tagline: 'ఏ ఒప్పంద పునరుద్ధరణను ఎప్పటికీ మిస్ కాకండి',
  heroHeadline: 'ప్రతి కాంట్రాక్ట్ పునరుద్ధరణలో ముందంజలో ఉండండి.',
  heroSubtitle:
    'ఒప్పందాలను నిర్వహించండి, ముఖ్యమైన తేదీలను ట్రాక్ చేయండి మరియు సమయానుకూల రిమైండర్‌లను పొందండి.',
  categoryTag: 'ఒప్పంద నిర్వహణ | స్మార్ట్ రిమైండర్‌లు | వర్క్‌ఫ్లో',
  getStarted: 'ప్రారంభించండి',
  dashboardNav: 'డాష్‌బోర్డ్',
  contractsNav: 'ఒప్పందాలు',
  remindersNav: 'రిమైండర్‌లు',
  calendarNav: 'క్యాలెండర్',
  documentsNav: 'పత్రాలు',
  analyticsNav: 'విశ్లేషణలు',
  workflowNav: 'పునరుద్ధరణలు',
  aboutNav: 'గురించి',
  settingsNav: 'సెట్టింగ్‌లు',
  thankYouNav: 'ధన్యవాదాలు',
  welcomeBack: 'శుభోదయం, స్వాగతం.',
  totalContracts: 'మొత్తం ఒప్పందాలు',
  activeContracts: 'క్రియాశీల ఒప్పందాలు',
  renewalsThisMonth: 'ఈ నెల పునరుద్ధరణలు',
  expiringSoon: 'త్వరలో గడువు ముగుస్తుంది',
  safeContracts: 'సురక్షిత ఒప్పందాలు',
  criticalRisk: 'క్లిష్టమైన ప్రమాదం (0–7 రోజులు)',
  highRisk: 'అధిక ప్రమాదం (8–30 రోజులు)',
  mediumRisk: 'మధ్యస్థ ప్రమాదం (31–90 రోజులు)',
  safeRisk: 'సురక్షితం (90+ రోజులు)',
  overallRiskIndex: 'పోర్ట్‌ఫోలియో రిస్క్ ఇండెక్స్',
  addContract: 'ఒప్పందాన్ని జోడించండి',
  searchContractsPlaceholder: 'ఒప్పందాలు లేదా కంపెనీలను శోధించండి...',
  contractName: 'ఒప్పందం పేరు',
  company: 'కంపెనీ / విక్రేత',
  department: 'విభాగం',
  startDate: 'ప్రారంభ తేదీ',
  endDate: 'ముగింపు తేదీ',
  renewalDate: 'పునరుద్ధరణ తేదీ',
  noticePeriod: 'నోటీసు వ్యవధి',
  contractValue: 'ఒప్పందం విలువ',
  status: 'స్థితి',
  chooseLanguage: 'మీ భాషను ఎంచుకోండి',
  chooseLanguageSubtitle:
    'Contractly ఉపయోగించడానికి మీ ప్రాధాన్య భాషను ఎంచుకోండి. సెట్టింగ్‌ల నుండి ఎప్పుడైనా మార్చవచ్చు.',
  continueBtn: 'కొనసాగించండి',
  useEnglish: 'ఆంగ్లాన్ని ఉపయోగించండి',
};

export const bnTranslations: Partial<TranslationDictionary> = {
  appName: 'কন্ট্রাক্টলি (Contractly)',
  tagline: 'কখনোই কোনো চুক্তি নবীকরণ মিস করবেন না',
  heroHeadline: 'প্রতিটি চুক্তি নবীকরণে সর্বদা এগিয়ে থাকুন।',
  heroSubtitle:
    'চুক্তি পরিচালনা করুন, গুরুত্বপূর্ণ তারিখ ট্র্যাক করুন এবং সময়মতো অনুস্মারক পান — সবই এক জায়গায়।',
  categoryTag: 'চুক্তি পরিচালনা | স্মার্ট অনুস্মারক | ওয়ার্কফ্লো',
  getStarted: 'শুরু করুন',
  dashboardNav: 'ড্যাশবোর্ড',
  contractsNav: 'চুক্তিগুলি',
  remindersNav: 'অনুস্মারক',
  calendarNav: 'ক্যালেন্ডার',
  documentsNav: 'নথিপত্র',
  analyticsNav: 'অ্যানালিটিক্স',
  workflowNav: 'নবীকরণ',
  aboutNav: 'পরিচিতি',
  settingsNav: 'সেটিংস',
  thankYouNav: 'ধন্যবাদ',
  welcomeBack: 'সুপ্রভাত, আবার স্বাগতম।',
  totalContracts: 'মোট চুক্তি',
  activeContracts: 'সক্রিয় চুক্তি',
  renewalsThisMonth: 'এই মাসের নবীকরণ',
  expiringSoon: 'শীঘ্রই মেয়াদ শেষ',
  safeContracts: 'নিরাপদ চুক্তি',
  criticalRisk: 'সংকটপূর্ণ ঝুঁকি (০-৭ দিন)',
  highRisk: 'উচ্চ ঝুঁকি (৮-৩০ দিন)',
  mediumRisk: 'মাঝারি ঝুঁকি (৩১-৯০ দিন)',
  safeRisk: 'নিরাপদ (৯০+ দিন)',
  overallRiskIndex: 'পোর্টফোলিও ঝুঁকি সূচক',
  addContract: 'চুক্তি যোগ করুন',
  searchContractsPlaceholder: 'চুক্তি বা ভেন্ডর অনুসন্ধান করুন...',
  contractName: 'চুক্তির নাম',
  company: 'কোম্পানি / বিক্রেতা',
  department: 'বিভাগ',
  startDate: 'শুরুর তারিখ',
  endDate: 'শেষের তারিখ',
  renewalDate: 'নবীকরণের তারিখ',
  noticePeriod: 'নোটিশের সময়কাল',
  contractValue: 'চুক্তির মূল্য',
  status: 'অবস্থা',
  chooseLanguage: 'আপনার ভাষা বেছে নিন',
  chooseLanguageSubtitle:
    'Contractly ব্যবহার করতে আপনার পছন্দের ভাষা নির্বাচন করুন। সেটিংস থেকে যেকোনো সময় পরিবর্তন করা যাবে।',
  continueBtn: 'চালিয়ে যান',
  useEnglish: 'ইংরেজি ব্যবহার করুন',
};

export const mrTranslations: Partial<TranslationDictionary> = {
  appName: 'कंट्रॅक्टली (Contractly)',
  tagline: 'कोणतेही करार नूतनीकरण कधीही चुकवू नका',
  heroHeadline: 'प्रत्येक करार नूतनीकरणात पुढे राहा.',
  heroSubtitle:
    'करार व्यवस्थापित करा, महत्त्वाच्या तारखा ट्रॅक करा आणि वेळेवर स्मरणपत्रे मिळवा — सर्व एकाच ठिकाणी.',
  categoryTag: 'करार व्यवस्थापन | स्मार्ट स्मरणपत्रे | वर्कफ्लो',
  getStarted: 'सुरू करा',
  dashboardNav: 'डॅशबोर्ड',
  contractsNav: 'करार',
  remindersNav: 'स्मरणपत्रे',
  calendarNav: 'कॅलेंडर',
  documentsNav: 'कागदपत्रे',
  analyticsNav: 'अॅनालिटिक्स',
  workflowNav: 'नूतनीकरण',
  aboutNav: 'माहिती',
  settingsNav: 'सेटिंग्ज',
  thankYouNav: 'धन्यवाद',
  welcomeBack: 'शुभ प्रभात, पुन्हा स्वागत आहे.',
  totalContracts: 'एकूण करार',
  activeContracts: 'सक्रिय करार',
  renewalsThisMonth: 'या महिन्यातील नूतनीकरणे',
  expiringSoon: 'लवकरच संपणारे',
  safeContracts: 'सुरक्षित करार',
  criticalRisk: 'गंभीर जोखीम (०-७ दिवस)',
  highRisk: 'उच्च जोखीम (८-३० दिवस)',
  mediumRisk: 'मध्यम जोखीम (३१-९० दिवस)',
  safeRisk: 'सुरक्षित (९०+ दिवस)',
  overallRiskIndex: 'पोर्टफोलिओ जोखीम निर्देशांक',
  addContract: 'नवीन करार जोडा',
  contractName: 'कराराचे नाव',
  company: 'कंपनी / विक्रेता',
  chooseLanguage: 'तुमची भाषा निवडा',
  chooseLanguageSubtitle:
    'कंट्रॅक्टली वापरण्यासाठी आपली भाषा निवडा. आपण नंतर सेटिंग्जमधून बदलू शकता.',
  continueBtn: 'पुढे सुरू ठेवा',
  useEnglish: 'इंग्रजी वापरा',
};

export const guTranslations: Partial<TranslationDictionary> = {
  appName: 'કોન્ટ્રેક્ટલી (Contractly)',
  tagline: 'કોઈપણ કરાર નવીકરણ ક્યારેય ચૂકશો નહીં',
  heroHeadline: 'દરેક કરાર નવીકરણમાં આગળ રહો.',
  heroSubtitle:
    'કરારોનું સંચાલન કરો, મહત્વપૂર્ણ તારીખો ટ્રૅક કરો અને સમયસર રિમાઇન્ડર્સ મેળવો — બધું એક જ જગ્યાએ.',
  getStarted: 'શરૂ કરો',
  dashboardNav: 'ડેશબોર્ડ',
  contractsNav: 'કરારો',
  remindersNav: 'રિમાઇન્ડર્સ',
  calendarNav: 'કેલેન્ડર',
  documentsNav: 'દસ્તાવેજો',
  analyticsNav: 'વિશ્લેષણ',
  welcomeBack: 'સુપ્રભાત, ફરી સ્વાગત છે.',
  totalContracts: 'કુલ કરાર',
  activeContracts: 'સક્રિય કરાર',
  renewalsThisMonth: 'આ મહિનાના નવીકરણ',
  expiringSoon: 'ટૂંક સમયમાં સમાપ્ત',
  chooseLanguage: 'તમારી ભાષા પસંદ કરો',
  chooseLanguageSubtitle:
    'કોન્ટ્રેક્ટલી વાપરવા માટે આપની ભાષા પસંદ કરો. સેટિંગ્સમાંથી બદલી શકો છો.',
  continueBtn: 'આગળ વધો',
  useEnglish: 'અંગ્રેજી વાપરો',
};

export const urTranslations: Partial<TranslationDictionary> = {
  appName: 'کنٹریکٹلی (Contractly)',
  tagline: 'کسی بھی معاہدے کی تجدید کو کبھی مت چھوڑیں',
  heroHeadline: 'معاہدوں کی ہر تجدید میں ہمیشہ آگے رہیں۔',
  heroSubtitle:
    'معاہدات کا انتظام کریں، اہم تاریخوں پر نظر رکھیں اور بروقت یاددہانیاں حاصل کریں — سب ایک جگہ۔',
  getStarted: 'شروع کریں',
  dashboardNav: 'ڈیش بورڈ',
  contractsNav: 'معاہدات',
  remindersNav: 'یادہانیاں',
  calendarNav: 'کیلنڈر',
  documentsNav: 'دستاویزات',
  analyticsNav: 'تجزیات',
  welcomeBack: 'صبح بخیر، دوبارہ خوش آمدید۔',
  totalContracts: 'کل معاہدات',
  activeContracts: 'فعال معاہدات',
  renewalsThisMonth: 'اس ماہ کی تجدیدات',
  expiringSoon: 'جلد ختم ہونے والے',
  chooseLanguage: 'اپنی زبان منتخب کریں',
  chooseLanguageSubtitle:
    'کنٹریکٹلی استعمال کرنے کے لیے اپنی پسندیدہ زبان منتخب کریں۔ آپ اسے ترتیبات سے کبھی بھی تبدیل کر سکتے ہیں۔',
  continueBtn: 'آگے بڑھیں',
  useEnglish: 'انگریزی استعمال کریں',
};

const TRANSLATION_MAP: Record<LanguageCode, Partial<TranslationDictionary>> = {
  en: enTranslations,
  hi: hiTranslations,
  ta: taTranslations,
  te: teTranslations,
  bn: bnTranslations,
  mr: mrTranslations,
  gu: guTranslations,
  ur: urTranslations,
  kn: {
    appName: 'ಕಾಂಟ್ರಾಕ್ಟ್ಲಿ (Contractly)',
    tagline: 'ಯಾವುದೇ ಒಪ್ಪಂದ ನವೀಕರಣವನ್ನು ತಪ್ಪಿಸಿಕೊಳ್ಳಬೇಡಿ',
    heroHeadline: 'ಪ್ರತಿ ಒಪ್ಪಂದ ನವೀಕರಣದಲ್ಲಿ ಮುಂದಿರಿ.',
    dashboardNav: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    contractsNav: 'ಒಪ್ಪಂದಗಳು',
    remindersNav: 'ಜ್ಞಾಪನೆಗಳು',
    totalContracts: 'ಒಟ್ಟು ಒಪ್ಪಂದಗಳು',
    activeContracts: 'ಸಕ್ರಿಯ ಒಪ್ಪಂದಗಳು',
    chooseLanguage: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    continueBtn: 'ಮುಂದುವರಿಯಿರಿ',
    useEnglish: 'ಇಂಗ್ಲಿಷ್ ಬಳಸಿ',
  },
  ml: {
    appName: 'കോൺട്രാക്റ്റ്‌ലി (Contractly)',
    tagline: 'ഒരു കരാർ പുതുക്കലും നഷ്ടപ്പെടുത്തരുത്',
    heroHeadline: 'ഓരോ കരാർ പുതുക്കലിലും മുന്നിൽ നിൽക്കൂ.',
    dashboardNav: 'ഡാഷ്‌ബോർഡ്',
    contractsNav: 'കരാറുകൾ',
    remindersNav: 'ഓർമ്മപ്പെടുത്തലുകൾ',
    totalContracts: 'ആകെ കരാറുകൾ',
    activeContracts: 'സജീവ കരാറുകൾ',
    chooseLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    continueBtn: 'തുടരുക',
    useEnglish: 'ഇംഗ്ലീഷ് ഉപയോഗിക്കുക',
  },
  pa: {
    appName: 'ਕੰਟਰੈਕਟਲੀ (Contractly)',
    tagline: 'ਕਦੇ ਵੀ ਕੋਈ ਇਕਰਾਰਨਾਮਾ ਨਵੀਨੀਕਰਨ ਨਾ ਖੁੰਝਾਓ',
    heroHeadline: 'ਹਰ ਇਕਰਾਰਨਾਮੇ ਦੇ ਨਵੀਨੀਕਰਨ ਵਿੱਚ ਅੱਗੇ ਰਹੋ।',
    dashboardNav: 'ਡੈਸ਼ਬੋਰਡ',
    contractsNav: 'ਇਕਰਾਰਨਾਮੇ',
    remindersNav: 'ਯਾਦ-ਦਹਾਨੀਆਂ',
    totalContracts: 'ਕੁੱਲ ਇਕਰਾਰਨਾਮੇ',
    activeContracts: 'ਸਰਗਰਮ ਇਕਰਾਰਨਾਮੇ',
    chooseLanguage: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    continueBtn: 'ਜਾਰੀ ਰੱਖੋ',
    useEnglish: 'ਅੰਗਰੇਜ਼ੀ ਵਰਤੋ',
  },
  or: {
    appName: 'କଣ୍ଟ୍ରାକ୍ଟଲି (Contractly)',
    tagline: 'କୌଣସି ଚୁକ୍ତି ନବୀକରଣ କେବେ ମିସ୍ କରନ୍ତୁ ନାହିଁ',
    heroHeadline: 'ପ୍ରତ୍ୟେକ ଚୁକ୍ତି ନବୀକରଣରେ ଆଗରେ ରୁହନ୍ତୁ।',
    dashboardNav: 'ଡ୍ୟାସବୋର୍ଡ',
    contractsNav: 'ଚୁକ୍ତିନାମା',
    totalContracts: 'ମୋଟ ଚୁକ୍ତି',
    chooseLanguage: 'ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ',
    continueBtn: 'ଆଗକୁ ବଢ଼ନ୍ତୁ',
    useEnglish: 'ଇଂରାଜୀ ବ୍ୟବହାର କରନ୍ତୁ',
  },
  as: {
    appName: 'কন্ট্ৰাক্টলি (Contractly)',
    tagline: 'কোনো চুক্তি নবীকৰণ কেতিয়াও হেৰুৱাব নালাগে',
    chooseLanguage: 'আপোনাৰ ভাষা বাছক',
    continueBtn: 'অব্যাহত ৰাখক',
  },
  mai: {
    appName: 'कंट्रैक्टली (Contractly)',
    chooseLanguage: 'अपन भाषा चुनू',
    continueBtn: 'आगाँ बढ़ू',
  },
  sa: {
    appName: 'कॉन्ट्रैक्टली (Contractly)',
    tagline: 'अनुबन्ध नवीकरणं कदापि मा विस्मरतु',
    chooseLanguage: 'स्वभाषां चिनोतु',
    continueBtn: 'अनुवर्तताम्',
  },
  ne: {
    appName: 'कन्ट्र्याक्टली (Contractly)',
    tagline: 'कुनै पनि सम्झौता नवीकरण नछुटाउनुहोस्',
    chooseLanguage: 'आफ्नो भाषा छान्नुहोस्',
    continueBtn: 'अगाडि बढ्नुहोस्',
  },
  kok: {
    appName: 'कंट्रॅक्टली (Contractly)',
    chooseLanguage: 'तुमची भास निवडा',
    continueBtn: 'फुडें वचा',
  },
  doi: {
    appName: 'कंट्रैक्टली (Contractly)',
    chooseLanguage: 'अपनी भाशा चुनो',
    continueBtn: 'अगें बद्घो',
  },
  ks: {
    appName: 'کنٹریکٹلی',
    chooseLanguage: 'پنی زبان ژارِو',
    continueBtn: 'جاری تھاوِو',
  },
  brx: {
    appName: 'कन्ट्राक्टली',
    chooseLanguage: 'नोंथांनि रावखौ सायख’',
    continueBtn: 'थांगासिनो था',
  },
  mni: {
    appName: 'কন্ট্রাক্টলী',
    chooseLanguage: 'নহাক্কী লোন খনবিয়ু',
    continueBtn: 'মখা চত্থখো',
  },
  sd: {
    appName: 'ڪنٽريڪٽلي',
    chooseLanguage: 'پنهنجي ٻولي چونڊيو',
    continueBtn: 'جاري رکو',
  },
  sat: {
    appName: 'ᱠᱚᱱᱴᱨᱟᱠᱴᱞᱤ',
    chooseLanguage: 'ᱟᱢᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
    continueBtn: 'ᱞᱟᱦᱟᱜ ᱢᱮ',
  },
};

export function getTranslations(lang: LanguageCode): TranslationDictionary {
  const specific = TRANSLATION_MAP[lang] || {};
  return {
    ...enTranslations,
    ...specific,
  };
}
