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
// ------------------------------------

export const Footer = () => {
  return (
    <footer className="bg-white/50 border-t border-gray-100">
      <Container className="py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 lg:gap-16">
          <div className="col-span-2">
            <p className="text-sm text-gray-500 mt-4 max-w-sm">
              Найсмачніша піца у Чернівцях. Швидка доставка та завжди свіжі
              інгредієнти, приготовані з любов'ю.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Навігація</h3>
            <ul className="space-y-3">
              {navLinks.map(({ href, text }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Контакти</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+380990589564"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  +38 (099) 0589564
                </a>
              </li>
              <li>
                <p className="text-gray-600">Працюємо щодня: 10:00 - 22:00</p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Наші адреси:</h3>
            <ul className="space-y-3">
              {pickupAddresses.map((address, index) => (
                <li key={index}>
                  <p className="text-gray-600">{address}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">Слідкуйте за нами</h3>
            <div className="flex gap-4">
              {socialLinks.map(({ href, Icon }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-primary hover:text-white transition-all"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div className="bg-gray-50 py-5 border-t">
        <Container className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Republic Pizza. Всі права
            захищено.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span>Приймаємо до оплати:</span>
            <div className="flex items-center gap-2">
              <Image
                src="/payment-icons/visa.svg"
                alt="Visa"
                width={35}
                height={22}
              />
              <Image
                src="/payment-icons/mastercard.svg"
                alt="Mastercard"
                width={35}
                height={22}
              />
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
