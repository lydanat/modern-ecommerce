import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { BRAND_NAME, BRAND_DESCRIPTION, CONTACT, SOCIALS, LAST_UPDATED } from "@/constants/footer"

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950 border-t border-white/5">

      {/* Start Main Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Start Brand */}
          <div className="flex flex-col gap-5">
            {/* Logo */}
            <span className="font-serif text-white text-2xl font-semibold tracking-[0.12em] uppercase">
              <Image
                src="/assets/logowhite.png"
                alt="Flash Of Build"
                width={200}
                height={60}
                priority
                className="object-contain"
              />
            </span>

            {/* Description */}
            <p className="font-sans font-light text-white text-sm leading-relaxed tracking-wide max-w-xs">
              {BRAND_DESCRIPTION}
            </p>
          </div>
          {/* End Brand */}

          {/* Start Contact Info */}
          <div className="flex flex-col gap-5">
            <p className="font-sans text-[0.68rem] tracking-[0.22em] uppercase text-white">
              Contact Info
            </p>

            <div className="flex flex-col gap-4">

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-white/80"/>
                <span className="font-sans font-light text-white text-sm tracking-wide">
                  {CONTACT.phone}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white/80"/>
                <span className="font-sans font-light text-white text-sm tracking-wide">
                  {CONTACT.location}
                </span>
              </div>

            </div>
          </div>
          {/* End Contact Info */}

          {/* Start Social Media */}
          <div className="flex flex-col gap-5">
            <p className="font-sans text-[0.68rem] tracking-[0.22em] uppercase text-white">
              Follow Us
            </p>

            <div className="flex flex-col gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3.5 w-fit"
                >
                  {/* Icon circle */}
                  <div className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white group-hover:border-white/30 group-hover:text-white/80 transition-all duration-200">
                    <Image
                      src={social.icon}
                      alt="social media link"
                      width={15}
                      height={15}
                    />
                  </div>
                  {/* Label */}
                  <span className="font-sans text-[0.78rem] tracking-widest uppercase text-white group-hover:text-white/65 transition-colors duration-200">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
          {/* End Social Media */}

        </div>
      </div>
      {/* End Main Grid */}

      {/* Start copyright + last updated */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-sans text-[0.68rem] tracking-[0.12em] uppercase text-white/80">
            © {new Date().getFullYear()} {BRAND_NAME}. All Rights Reserved.
          </p>
          <p className="font-sans text-[0.68rem] tracking-[0.12em] uppercase text-white/85">
            Last Updated: {LAST_UPDATED}
          </p>
        </div>
      </div>
      {/* End copyright + last updated */}

    </footer>
  );
}