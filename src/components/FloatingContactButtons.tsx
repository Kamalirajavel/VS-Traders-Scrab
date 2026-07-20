import { Phone } from "lucide-react";

const WHATSAPP_NUMBER = "919500805193"; // country code + number, no + or spaces
const PHONE_NUMBER = "+919500805193";

const FloatingContactButtons = () => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-5 items-end">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%20want%20to%20sell%20scrap`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:scale-110 transition-transform duration-200"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.623.859 5.045 2.316 7.008L4.9 28.1l6.27-1.646A11.94 11.94 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3Zm0 21.75a9.7 9.7 0 0 1-4.95-1.354l-.355-.21-3.72.976.994-3.63-.232-.372A9.71 9.71 0 1 1 25.71 15 9.72 9.72 0 0 1 16 24.75Zm5.34-7.28c-.293-.146-1.73-.854-2-.952-.268-.098-.463-.146-.658.146-.195.293-.756.952-.927 1.146-.171.195-.342.22-.634.073-.293-.146-1.238-.456-2.358-1.454-.872-.778-1.46-1.739-1.632-2.032-.171-.293-.018-.451.128-.597.132-.131.293-.342.44-.512.146-.171.195-.293.293-.488.098-.195.049-.366-.024-.512-.073-.146-.658-1.585-.902-2.171-.238-.57-.48-.494-.658-.503l-.561-.01c-.195 0-.512.073-.78.366-.268.293-1.024 1-1.024 2.439s1.049 2.83 1.195 3.025c.146.195 2.065 3.152 5.005 4.42.699.301 1.244.481 1.669.616.701.223 1.34.192 1.845.117.563-.084 1.73-.707 1.975-1.39.244-.683.244-1.268.171-1.39-.073-.122-.268-.195-.561-.341Z" />
        </svg>
      </a>

      {/* Call Button */}
      <a
        href={`tel:${PHONE_NUMBER}`}
        aria-label="Call us"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gold shadow-lg hover:scale-110 transition-transform duration-200"
      >
        <Phone className="w-6 h-6 text-white" />
      </a>
    </div>
  );
};

export default FloatingContactButtons;