import React from "react";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Send } from "lucide-react";

const navLinks = [
  { href: "/", text: "Головна" },
  { href: "/menu", text: "Меню" },
  { href: "/about", text: "Про нас" },
  { href: "/contacts", text: "Контакти" },
];

const socialLinks = [
  { href: "#", Icon: Facebook },
  { href: "#", Icon: Instagram },
  { href: "#", Icon: Send },
];

const pickupAddresses = [
  "вул. Головна, 125",
  "вул. Богдана Хмельницького, 56",
  "просп. Незалежності, 222",
];

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-800 to-fuchsia-800 border-t border-purple-900 shadow-[0_-5px_30px_rgba(120,0,255,0.3)]">
      <Container className="py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 lg:gap-16">
          <div className="col-span-2">
            <h2 className="text-3xl font-bold text-fuchsia-200">
              Republic Pizza
            </h2>
            <p className="text-sm text-white/80 mt-4 max-w-sm leading-relaxed">
              Найсмачніша піца у Чернівцях. Швидка доставка та завжди свіжі
              інгредієнти, приготовані з любов'ю.💜
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-fuchsia-300">
              Навігація
            </h3>
            <ul className="space-y-2">
              {navLinks.map(({ href, text }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/80 hover:text-fuchsia-300 transition-colors duration-300"
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-fuchsia-300">
              Контакти
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+380990589564"
                  className="text-white/80 hover:text-fuchsia-300 transition-colors duration-300"
                >
                  +38 (099) 0589564
                </a>
              </li>
              <li>
                <p className="text-white/70 text-sm">
                  Працюємо щодня: 10:00 - 22:00
                </p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-fuchsia-300">
              Наші адреси
            </h3>
            <ul className="space-y-2">
              {pickupAddresses.map((address, index) => (
                <li key={index}>
                  <p className="text-white/80">{address}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4 text-fuchsia-300">
              Слідкуйте за нами
            </h3>
            <div className="flex gap-4">
              {socialLinks.map(({ href, Icon }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-fuchsia-200 hover:text-purple-900 rounded-full text-white transition-all duration-300 hover:shadow-[0_0_10px_rgba(255,200,255,0.8)]"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div className="py-5 border-t border-white/10 backdrop-blur-sm">
        <Container className="flex flex-col md:flex-row justify-between items-center text-sm text-white/70">
          <p>
            &copy; {new Date().getFullYear()} Republic Pizza. Всі права
            захищено.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span>Приймаємо до оплати:</span>
            <div className="flex items-center gap-2">
               <div className="bg-white rounded-lg px-2 py-1 shadow-md">
                <Image
                  src="/images/assets/Visa.png"
                  alt="Visa"
                  width={35}
                  height={22}
                  loading="lazy"
                />
              </div>
              <div className="bg-white rounded-lg px-2 py-1 shadow-md">
                <Image
                  src="/images/assets/mastercard.webp"
                  alt="Mastercard"
                  width={35}
                  height={22}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
