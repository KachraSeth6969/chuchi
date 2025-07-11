import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="text-center max-w-2xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 sm:mb-8 tracking-tight">
            FOR 

            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              CHUCHI,
            </span>
          </h1>

          {/* Short Paragraph */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-8 sm:mb-12 leading-relaxed px-2">
             Idhar kuch toh thha joh mai terko kal dikhana chahta thha , expect
          some shit to pop up here in some time. Ye tera safe place hai jaha tu
          aa sakti hai uk idk whenever i aint there or smth like that. Neend ki
          toh gaand maari di tune so yeah i hid whatever was here and made this.
          For our convo last knight all i gotta say is thank u. Ik i say this
          all the time but just trust urself ik u dont like discussing about all
          those things and i am sorry if i may have pushed u yesterday . I
          thought it was necessay, u are not an emotionless person , u just do
          things that sometimes hurt me and u punish urself unjutly. Aur bahut
          kuch bata karni hai , sunni hai and all . Ik i sat this all the time
          but tu please ro mat be kal firse royi tu cause of me mai hai na tu
          kaiko tension leti ha?. Dont worry just give urself a seconf chance, u
          are not doing anything wrong.....
          </p>

          {/* View Gallery Button */}
          <Link href="/gallery">
            <button className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-2 sm:gap-3 mx-auto touch-manipulation">
              View Gallery
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </main>

      {/* Footer Text */}
      <footer className="text-center pb-6 sm:pb-8 px-4">
        <p className="text-slate-400 text-base sm:text-lg animate-pulse">Scroll down for magic ✨</p>
        <p className="text-slate-500 text-xs sm:text-sm mt-2">Made with ❤️</p>
      </footer>
    </div>
  )
}
