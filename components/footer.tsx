import Link from "next/link"
import { Milk, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground border-t mt-auto text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-5 md:gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Milk className="h-5 w-5 text-white" />
              </div>
              <span>FreshMilk</span>
            </Link>
            <p className="text-sm text-white">
              Delivering pure, farm-fresh milk to your doorstep daily in Surat and Navsari.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-white hover:text-foreground transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Service Areas</h3>
            <ul className="space-y-2 text-sm text-white">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Surat
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Navsari
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-white">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +91 12345 67890
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@freshmilk.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-white">
          <p>&copy; {new Date().getFullYear()} FreshMilk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
