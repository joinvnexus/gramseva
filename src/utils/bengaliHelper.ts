// বাংলা টেক্সট ফরম্যাটিং ইউটিলিটি

export const banglaNumbers = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBanglaNumber(num: number | string): string {
  const str = num.toString();
  return str.replace(/[0-9]/g, (digit) => banglaNumbers[digit as keyof typeof banglaNumbers]);
}

export function toBanglaDate(date: Date | string): string {
  const d = new Date(date);
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল',
    'মে', 'জুন', 'জুলাই', 'আগস্ট',
    'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  
  const dayName = days[d.getDay()];
  const dateNum = toBanglaNumber(d.getDate());
  const monthName = months[d.getMonth()];
  const year = toBanglaNumber(d.getFullYear());
  
  return `${dayName}, ${dateNum} ${monthName} ${year}`;
}

export function toBanglaTime(date: Date | string): string {
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'বিকাল' : 'সকাল';
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  return `${toBanglaNumber(hours)}:${toBanglaNumber(minutes.toString().padStart(2, '0'))} ${ampm}`;
}

export function toBanglaDateTime(date: Date | string): string {
  return `${toBanglaDate(date)} ${toBanglaTime(date)}`;
}

export function formatCurrency(amount: number): string {
  return `৳ ${toBanglaNumber(amount)}`;
}

export function formatPhoneNumber(phone: string): string {
  if (phone.length === 11) {
    return `${phone.slice(0, 5)}-${phone.slice(5, 8)}-${phone.slice(8)}`;
  }
  return phone;
}