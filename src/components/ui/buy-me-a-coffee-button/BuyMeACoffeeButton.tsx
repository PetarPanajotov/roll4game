import Image from 'next/image'

export function BuyMeACoffeeButton() {
  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50">
      <a
        href="https://buymeacoffee.com/laserline"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-28 sm:w-36 md:w-40"
      >
        <Image
          src="/bmc-button.png"
          alt="Buy me a coffee"
          width={300}
          height={112}
          className="w-full h-auto"
          priority
        />
      </a>
    </div>
  )
}
