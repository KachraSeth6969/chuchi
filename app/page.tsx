import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-3xl mx-auto">
          {/* Main Heading */}
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-light text-neutral-900 mb-6 tracking-tight leading-tight">
            Dear
            <span className="block font-normal text-neutral-700 mt-2">
              CHUCHI,
            </span>
          </h1>

          {/* Short Paragraph */}
          <p className="text-base md:text-lg text-neutral-600 mb-2 leading-relaxed max-w-2xl mx-auto font-light">
            So this is it , a small collection of our memories, moments, and melodies.
            Damn bahut formal ho gaya 🤣🤣🤣, hmm if uk what i mean.
            Pata nai be kya hai but this is where u can and should visit whenever you feel like it.
            More often then not , aur kya bas.
            Khush rahe muskurate rahe. And remember ki , 
            "mai hai na tension kaiko leti, zyada load mat le🤣".
            Nah seriously i hope to put a smile on your face whenever you visit this page.
            Yep thats all , looking forward to see u soon and add to this collection.
            <br></br><br></br>
            PS: I have been promoted from just a friend.
            I want u to be happy always and yeah i wanna see u grow a lot.
            I will always respect u and just wanna spend some real good time with u and make a loooot of memories.

          </p>
          <h1 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-light text-neutral-900 mb-6 tracking-tight leading-tight">
            I love you 
          </h1>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/gallery">
<button
  className="group text-neutral-800 font-medium py-4 px-8 rounded-lg text-base transition-all duration-200 flex items-center gap-3 border border-neutral-300 hover:border-neutral-400"
  style={{ backgroundColor: 'lavender' }}
>
  View Gallery
  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
</button>
            </Link>
            
            <Link href="/trips">
              <button className="group bg-fuchsia-200 hover:bg-fuchsia-200 text-neutral-900 font-medium py-4 px-8 rounded-lg text-base transition-all duration-200 flex items-center gap-3 border border-rose-200 hover:border-rose-300">
                Our Adventures
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Text */}
      <footer className="text-center pb-8 px-6">
        <p className="text-neutral-600 text-sm">Explore the memories ✨</p>
        <p className="text-neutral-500 text-xs mt-2">And Take Care</p>
      </footer>
    </div>
  );
}
