interface GameHeroProps {
  children: React.ReactNode
  backgroundImageUrl: string
}

export function GameHero({ children, backgroundImageUrl }: GameHeroProps) {
  return (
    <main
      className="px-15 h-auto py-10 w-[100%] object-cover bg-top relative bg-no-repeat bg-cover before:absolute
    before:inset-0            
    before:bg-black/70          
    before:z-0                
    before:content-['']"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="flex flex-col md:flex-row justify-center items-start md:items-center relative z-10 gap-4 p-4">
        {children}
      </div>
    </main>
  )
}
