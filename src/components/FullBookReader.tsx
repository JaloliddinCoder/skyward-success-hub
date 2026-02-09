import { useRef, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import bookCover from "@/assets/book-cover.jpg";

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

const Page = ({ children, className = "" }: PageProps) => (
  <div className={`bg-background shadow-lg ${className}`}>
    {children}
  </div>
);

const tocItems = [
  { chapter: 1, title: "CV tayyorlash sirlari", page: 8 },
  { chapter: 2, title: "Intervyu savollari va javoblar", page: 24 },
  { chapter: 3, title: "Open Day tayyorgarlik", page: 42 },
  { chapter: 4, title: "Grooming standartlari", page: 58 },
  { chapter: 5, title: "Parvoz tajribasi", page: 72 },
  { chapter: 6, title: "Sog'liq talablari", page: 88 },
  { chapter: 7, title: "Xavfsizlik bilimi", page: 102 },
  { chapter: 8, title: "Ingliz tili tayyorligi", page: 118 },
  { chapter: 9, title: "Portfolio yaratish", page: 134 },
  { chapter: 10, title: "Muvaffaqiyat strategiyasi", page: 148 },
];

const chapters = [
  {
    title: "CV tayyorlash sirlari",
    content: `CV tayyorlash — bu birinchi qadam. Emirates HR xodimlari minglab CV'larni ko'rib chiqadi. Sizning CV'ingiz 30 soniyada e'tibor qozonishi kerak.

Muhim qoidalar:
• Foto professional bo'lishi kerak — tabassum bilan
• Ingliz tili grammatikasi 100% to'g'ri bo'lsin
• Customer service tajribangizni yozing
• Hobbies qismida aktiv va ijtimoiy narsalarni yozing`
  },
  {
    title: "Intervyu savollari",
    content: `Emirates intervyusida eng ko'p so'raladigan savollar:

1. "Tell me about yourself" — 2 daqiqalik speech tayyorlang
2. "Why Emirates?" — kompaniya haqida tadqiqot qiling
3. "Describe a difficult situation" — STAR metodidan foydalaning
4. "Why cabin crew?" — haqiqiy motivatsiyangizni ayting`
  },
  {
    title: "Open Day tayyorgarlik",
    content: `Open Day — bu birinchi bosqich. Minglab nomzodlar keladi, faqat eng yaxshilari keyingi bosqichga o'tadi.

Kiyim-kechak:
• Ayollar: Business attire, skirt yoki dress pants
• Erkaklar: Suit va tie
• Tabassum har doim yuzingizda bo'lsin!`
  },
  {
    title: "Grooming standartlari",
    content: `Emirates grooming standartlari juda qat'iy:

Ayollar uchun:
• Soch professional tarzda yig'ilgan bo'lishi kerak
• Makiyaj natural lekin professional
• Tirnoqlar red yoki French manicure

Erkaklar uchun:
• Yuz silliqlangan yoki soqol qisqa
• Soch qisqa va tartibli`
  },
  {
    title: "Parvoz tajribasi",
    content: `Parvoz haqida bilishingiz kerak bo'lgan narsalar:

• Time zones va jet lag
• Emergency procedures
• Service standards
• Passenger handling
• Team work muhim!`
  },
];

const FullBookReader = () => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 4 + chapters.length * 2; // Cover + Title + 2 TOC + chapters (2 pages each)

  const nextPage = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  const prevPage = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-8"
      >
        {/* @ts-ignore */}
        <HTMLFlipBook
          ref={bookRef}
          width={320}
          height={450}
          size="stretch"
          minWidth={300}
          maxWidth={450}
          minHeight={420}
          maxHeight={600}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          className="shadow-2xl"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={600}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          showPageCorners={true}
          disableFlipByClick={false}
          swipeDistance={30}
          clickEventForward={true}
          useMouseEvents={true}
        >
          {/* Cover */}
          <Page className="rounded-l-md overflow-hidden">
            <img
              src={bookCover}
              alt="Skyward Mentor Book Cover"
              className="w-full h-full object-cover"
            />
          </Page>

          {/* Title Page */}
          <Page className="p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-background to-muted">
            <div className="text-gold text-5xl mb-4">✈️</div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Skyward Mentor
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              Cabin Crew Guide — To'liq Versiya
            </p>
            <div className="w-16 h-px bg-gold/50 mb-6" />
            <p className="text-foreground/80 text-sm italic">
              Muallif: Shohruh
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              © 2025 Skyward Mentor
            </p>
          </Page>

          {/* TOC Page 1 */}
          <Page className="p-6 bg-background">
            <div className="border-b-2 border-gold/30 pb-3 mb-4">
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gold" />
                Mundarija
              </h2>
            </div>
            <div className="space-y-3">
              {tocItems.slice(0, 5).map((item) => (
                <div
                  key={item.chapter}
                  className="flex items-center justify-between text-sm group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {item.chapter}
                    </span>
                    <span className="text-foreground group-hover:text-gold transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {item.page}
                  </span>
                </div>
              ))}
            </div>
          </Page>

          {/* TOC Page 2 */}
          <Page className="p-6 bg-background">
            <div className="border-b-2 border-gold/30 pb-3 mb-4">
              <h2 className="font-display text-lg font-bold text-foreground">
                Mundarija (davomi)
              </h2>
            </div>
            <div className="space-y-3">
              {tocItems.slice(5).map((item) => (
                <div
                  key={item.chapter}
                  className="flex items-center justify-between text-sm group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {item.chapter}
                    </span>
                    <span className="text-foreground group-hover:text-gold transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {item.page}
                  </span>
                </div>
              ))}
            </div>
          </Page>

          {/* Chapter Pages */}
          {chapters.map((chapter, index) => (
            <>
              <Page key={`chapter-${index}-a`} className="p-6 bg-background">
                <div className="border-b-2 border-gold/30 pb-3 mb-4">
                  <span className="text-gold text-xs font-medium">
                    {index + 1}-bob
                  </span>
                  <h2 className="font-display text-lg font-bold text-foreground mt-1">
                    {chapter.title}
                  </h2>
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-line">
                  {chapter.content}
                </p>
              </Page>
              <Page key={`chapter-${index}-b`} className="p-6 bg-background">
                <p className="text-foreground/80 text-sm leading-relaxed">
                  Bu bob davom etadi... Keyingi sahifalarda ko'proq ma'lumotlar va amaliy maslahatlar berilgan.
                </p>
                <div className="mt-8 p-4 bg-gold/10 rounded-lg border border-gold/20">
                  <p className="text-foreground/70 text-xs italic">
                    💡 Maslahat: Har bir bobni bir necha marta o'qing va eslatmalar yozing.
                  </p>
                </div>
              </Page>
            </>
          ))}
        </HTMLFlipBook>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevPage}
          disabled={currentPage === 0}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <span className="text-sm text-muted-foreground min-w-[80px] text-center">
          {currentPage + 1} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={nextPage}
          disabled={currentPage >= totalPages - 1}
          className="rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <p className="text-muted-foreground/60 text-xs mt-4">
        💡 Sahifani bosib yoki suring
      </p>
    </div>
  );
};

export default FullBookReader;
