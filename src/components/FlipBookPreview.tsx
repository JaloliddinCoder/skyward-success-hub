import { useRef, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lock, BookOpen } from "lucide-react";
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

const FlipBookPreview = () => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 6;

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
    <section id="preview" className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-gold font-body text-sm tracking-[0.2em] uppercase">
            Bepul ko'rish
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Kitobni <span className="text-gradient-gold italic">varoqlang</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Mundarija va kirish qismini bepul o'qing. Sahifalarni chapga/o'ngga suring
          </p>
        </motion.div>

        <div className="flex flex-col items-center">
          {/* Book */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mb-8"
          >
            {/* @ts-ignore */}
            <HTMLFlipBook
              ref={bookRef}
              width={300}
              height={420}
              size="stretch"
              minWidth={280}
              maxWidth={400}
              minHeight={400}
              maxHeight={560}
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
                  Cabin Crew Guide
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

              {/* Intro Page 1 */}
              <Page className="p-6 bg-background">
                <h2 className="font-display text-lg font-bold text-foreground mb-4 border-b border-gold/30 pb-2">
                  Kirish
                </h2>
                <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                  Assalomu alaykum, aziz o'quvchi!
                </p>
                <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                  Mening ismim Shohruh. Men 3 yildan ortiq vaqt davomida Emirates 
                  aviakompaniyasida bort kuzatuvchisi sifatida ishlayman.
                </p>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  Bu kitobni yozishdan maqsadim — o'z tajribamni siz bilan 
                  bo'lishish va sizga bort kuzatuvchisi bo'lish yo'lida yordam 
                  berishdir. Bu kasb haqida ko'p noto'g'ri tushunchalar bor...
                </p>
              </Page>

              {/* Locked Page */}
              <Page className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-background p-6">
                  <p className="text-foreground/40 text-sm leading-relaxed blur-sm select-none">
                    ...men har bir savolga qanday javob berish kerakligini batafsil 
                    tushuntiraman. Emirates intervyusi odatda 3 bosqichdan iborat: 
                    Open Day, Assessment Day va Final Interview. Har bir bosqichda 
                    nimalar kutilishini bilish juda muhim...
                  </p>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/5 backdrop-blur-sm">
                  <div className="bg-background/90 rounded-xl p-6 text-center shadow-lg border border-border">
                    <Lock className="w-10 h-10 text-gold mx-auto mb-3" />
                    <h3 className="font-display font-bold text-foreground mb-2">
                      Qolgan 90% qism
                    </h3>
                    <p className="text-muted-foreground text-xs mb-4">
                      To'liq kitobni o'qish uchun sotib oling
                    </p>
                    <Button variant="hero" size="sm">
                      Sotib olish
                    </Button>
                  </div>
                </div>
              </Page>
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
      </div>
    </section>
  );
};

export default FlipBookPreview;
