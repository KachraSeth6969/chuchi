import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-3xl mx-auto">
          {/* Main Heading */}
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-light text-neutral-900 mb-6 tracking-tight leading-tight">
            FOR 
            <span className="block font-normal text-neutral-700 mt-2">
              CHUCHI,
            </span>
          </h1>

          {/* Short Paragraph */}
          <p className="text-base md:text-lg text-neutral-600 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
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
            <button className="group bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-4 px-8 rounded-lg text-base transition-all duration-200 flex items-center gap-3 mx-auto border border-neutral-900 hover:border-neutral-800">
              View Gallery
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>
        </div>
      </main>

      {/* Footer Text */}
      <footer className="text-center pb-8 px-6">
        <p className="text-neutral-400 text-sm">Explore the memories ✨</p>
        <p className="text-neutral-300 text-xs mt-2">Made with ❤️</p>
      </footer>
    </div>
  )
}
