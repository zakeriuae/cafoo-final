export interface Country {
  name: string
  code: string
  flag: string
  dialCode: string
}

export const countries: Country[] = [
  { name: 'Iran', code: 'IR', flag: '🇮🇷', dialCode: '+98' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', dialCode: '+971' },
  { name: 'United States', code: 'US', flag: '🇺🇸', dialCode: '+1' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', dialCode: '+44' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', dialCode: '+1' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', dialCode: '+61' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', dialCode: '+49' },
  { name: 'France', code: 'FR', flag: '🇫🇷', dialCode: '+33' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷', dialCode: '+90' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', dialCode: '+966' },
  { name: 'Qatar', code: 'QA', flag: '🇶🇦', dialCode: '+974' },
  { name: 'Kuwait', code: 'KW', flag: '🇰🇼', dialCode: '+965' },
  { name: 'Oman', code: 'OM', flag: '🇴🇲', dialCode: '+968' },
]
