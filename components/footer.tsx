import Link from "next/link";
import {
  Milk,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { BUSINESS_PHONE_DISPLAY, SERVICE_CITY } from "@/lib/config";
import SocialIcons from "./CommonComponents/SocialIcons";

export function Footer() {
  return (
    <footer className="bg-foreground border-t mt-auto text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-5 md:gap-8">
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-xl"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Milk className="h-5 w-5 text-white" />
              </div>
              <span>FreshMilk</span>
            </Link>
            <p className="text-base text-white">
              Delivering pure, farm-fresh milk to your doorstep daily in{" "}
              {SERVICE_CITY}.
            </p>

            <div className="pt-4">
              <h3 className="font-semibold mb-4 text-xl uppercase border-b border-white/40 pb-2">
                Quick Links
              </h3>
              <SocialIcons />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-xl uppercase border-b border-white/40 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-base">
              <li>
                <Link
                  href="/products"
                  className="text-white hover:text-primary transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/refer-earn"
                  className="text-white hover:text-primary transition-colors"
                >
                  Refer & Earn
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-xl uppercase border-b border-white/40 pb-2">
              Service Areas
            </h3>
            <ul className="space-y-2 text-base text-white">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {SERVICE_CITY}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-xl uppercase border-b border-white/40 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-2 text-base text-white">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {BUSINESS_PHONE_DISPLAY}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@freshmilk.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-5 text-center text-base text-white">
          <p>
            &copy; {new Date().getFullYear()} FreshMilk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
