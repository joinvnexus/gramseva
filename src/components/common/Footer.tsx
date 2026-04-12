export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white mt-auto">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2 sm:mb-3">গ্রামসেবা</h3>
            <p className="text-sm opacity-80">গ্রামের হাতে ডিজিটাল বাংলাদেশ</p>
            <p className="text-sm opacity-80 mt-1 sm:mt-2">মাটি ও মানুষ - আপনার পাশে</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 sm:mb-3">লিংক</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm opacity-80">
              <li><a href="/about" className="hover:opacity-100">আমাদের সম্পর্কে</a></li>
              <li><a href="/contact" className="hover:opacity-100">যোগাযোগ</a></li>
              <li><a href="/privacy" className="hover:opacity-100">গোপনীয়তা নীতি</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 sm:mb-3">যোগাযোগ</h3>
            <p className="text-sm opacity-80">হটলাইন: ০১৭XX-XXXXXX</p>
            <p className="text-sm opacity-80">support@gramseva.com</p>
          </div>
        </div>
        <div className="border-t border-primary-light mt-5 sm:mt-6 pt-4 text-center text-xs sm:text-sm opacity-60">
          © ২০২৪ গ্রামসেবা। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
}