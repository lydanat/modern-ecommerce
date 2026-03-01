import Link from "next/link";
import { Send } from "lucide-react";
import { Card } from "../ui/card";
import { FieldSeparator } from "../ui/field";

const TELEGRAM_URL = "https://t.me/bleh_ll";

export default function ContactCard() {
  return (
    <section
      id="contact"
      className="w-full bg-white py-18 px-6 sm:px-10 lg:px-16 border"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 lg:gap-24">

          {/* Start Text content */}
          <div className="flex-1 max-w-xl">

            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block h-px w-8 bg-neutral-300" />
              <p className="font-sans text-xs tracking-[0.22em] uppercase text-neutral-400">
                Get in Touch
              </p>
            </div>

            <h2
              className="font-serif text-neutral-900 leading-none mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              Have a question{" "}
              <span className="italic font-semibold">about a product?</span>
            </h2>

            <p className="font-sans font-light text-neutral-500 text-base leading-relaxed tracking-wide max-w-md">
              Whether you want to know more about a specific product, need
              help with sizing, or are ready to make a purchase — we are
              just one message away on Telegram.
            </p>
          </div>
          {/* End Text content */}

          {/* Start Card */}
          <Card className="w-full lg:w-auto lg:min-w-90 bg-neutral-50 border border-neutral-200 rounded-2xl p-8 flex flex-col gap-8">

              <div className="flex flex-col gap-1">
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-neutral-400">
                  Direct Message
                </p>
                <p className="font-serif text-neutral-900 text-xl">
                  We reply within minutes
                </p>
              </div>

              {/* Availability dot */}
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                <p className="font-sans text-neutral-500 text-sm tracking-wide">
                  Available now on Telegram
                </p>
              </div>

              <FieldSeparator/>

              {/* CTA */}
              <Link
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full inline-flex items-center justify-center gap-3 bg-neutral-900 text-white font-sans font-medium text-[0.82rem] tracking-[0.12em] uppercase rounded-full py-4 px-6 transition-all duration-300 hover:bg-black active:scale-[0.98]"
              >
                <Send
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                Contact Us
              </Link>

              <p className="font-sans text-neutral-400 text-xs text-center tracking-wide">
                No account needed · Free · Instant
              </p>

          </Card>
          {/* End Card */}

        </div>
      </div>
    </section>
  );
}