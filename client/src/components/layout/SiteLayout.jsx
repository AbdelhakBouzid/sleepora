import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ContactModal from "../modals/ContactModal";
import Toast from "../Toast";
import useToast from "../../hooks/useToast";
import { useTheme } from "../../context/ThemeContext";

export default function SiteLayout({ children, hideFooter = false }) {
  const { theme, setTheme } = useTheme();
  const [contactOpen, setContactOpen] = useState(false);
  const [toastMessage, showToast] = useToast();

  useEffect(() => {
    if (theme !== "light") {
      setTheme("light");
    }
  }, [setTheme, theme]);

  return (
    <div className="site-shell">
      <Navbar onOpenContact={() => setContactOpen(true)} />
      <main>{children}</main>
      {hideFooter ? null : <Footer />}

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        onSubmitted={(message) => showToast(message)}
      />
      <Toast message={toastMessage} />
    </div>
  );
}
