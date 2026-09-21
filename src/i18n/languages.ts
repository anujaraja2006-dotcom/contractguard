import { LanguageInfo } from '../types';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    scriptSample: 'Renewals',
    isRTL: false,
  },
  {
    code: 'hi',
    nativeName: 'हिंदी',
    englishName: 'Hindi',
    scriptSample: 'अनुबंध नवीनीकरण',
    isRTL: false,
  },
  {
    code: 'ta',
    nativeName: 'தமிழ்',
    englishName: 'Tamil',
    scriptSample: 'ஒப்பந்தங்கள்',
    isRTL: false,
  },
  {
    code: 'te',
    nativeName: 'తెలుగు',
    englishName: 'Telugu',
    scriptSample: 'ఒప్పందాల పునరుద్ధరణ',
    isRTL: false,
  },
  {
    code: 'bn',
    nativeName: 'বাংলা',
    englishName: 'Bengali',
    scriptSample: 'চুক্তি নবীকরণ',
    isRTL: false,
  },
  {
    code: 'mr',
    nativeName: 'मराठी',
    englishName: 'Marathi',
    scriptSample: 'करार नूतनीकरण',
    isRTL: false,
  },
  {
    code: 'gu',
    nativeName: 'ગુજરાતી',
    englishName: 'Gujarati',
    scriptSample: 'કરાર નવીકરણ',
    isRTL: false,
  },
  {
    code: 'ur',
    nativeName: 'اردو',
    englishName: 'Urdu',
    scriptSample: 'معاہدہ کی تجدید',
    isRTL: true,
  },
  {
    code: 'kn',
    nativeName: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    scriptSample: 'ಒಪ್ಪಂದ ನವೀಕರಣ',
    isRTL: false,
  },
  {
    code: 'ml',
    nativeName: 'മലയാളം',
    englishName: 'Malayalam',
    scriptSample: 'കരാർ പുതുക്കൽ',
    isRTL: false,
  },
  {
    code: 'or',
    nativeName: 'ଓଡ଼ିଆ',
    englishName: 'Odia',
    scriptSample: 'ଚୁକ୍ତି ନବୀକରଣ',
    isRTL: false,
  },
  {
    code: 'pa',
    nativeName: 'ਪੰਜਾਬੀ',
    englishName: 'Punjabi',
    scriptSample: 'ਇਕਰਾਰਨਾਮਾ ਨਵੀਨੀਕਰਨ',
    isRTL: false,
  },
  {
    code: 'as',
    nativeName: 'অসমীয়া',
    englishName: 'Assamese',
    scriptSample: 'চুক্তি নবীকৰণ',
    isRTL: false,
  },
  {
    code: 'mai',
    nativeName: 'मैथिली',
    englishName: 'Maithili',
    scriptSample: 'अनुबंध नवीकरण',
    isRTL: false,
  },
  {
    code: 'sa',
    nativeName: 'संस्कृतम्',
    englishName: 'Sanskrit',
    scriptSample: 'अनुबन्ध नवीकरणम्',
    isRTL: false,
  },
  {
    code: 'ne',
    nativeName: 'नेपाली',
    englishName: 'Nepali',
    scriptSample: 'सम्झौता नवीकरण',
    isRTL: false,
  },
  {
    code: 'kok',
    nativeName: 'कोंकणी',
    englishName: 'Konkani',
    scriptSample: 'करार नूतनीकरण',
    isRTL: false,
  },
  {
    code: 'doi',
    nativeName: 'डोगरी',
    englishName: 'Dogri',
    scriptSample: 'समझौता नवीकरण',
    isRTL: false,
  },
  {
    code: 'ks',
    nativeName: 'کٲشُر / कश्मीरी',
    englishName: 'Kashmiri',
    scriptSample: 'معاہدہ تجدید',
    isRTL: false,
  },
  {
    code: 'brx',
    nativeName: 'बर’ / Bodo',
    englishName: 'Bodo',
    scriptSample: 'खौरां गोदान खालामनाय',
    isRTL: false,
  },
  {
    code: 'mni',
    nativeName: 'মৈতৈলোন্ / Manipuri',
    englishName: 'Manipuri',
    scriptSample: 'ৱাফম অনৌবা',
    isRTL: false,
  },
  {
    code: 'sd',
    nativeName: 'سنڌي',
    englishName: 'Sindhi',
    scriptSample: 'معاهدي جي تجديد',
    isRTL: true,
  },
  {
    code: 'sat',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ / Santali',
    englishName: 'Santali',
    scriptSample: 'ᱪᱩᱠᱛᱤ ᱱᱟᱶᱟ ᱠᱟᱹᱢᱤ',
    isRTL: false,
  },
];

export const INDIAN_LANGUAGES = SUPPORTED_LANGUAGES;
export type IndianLanguage = LanguageInfo;

export function getLanguageByCode(code: string): LanguageInfo {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
}
