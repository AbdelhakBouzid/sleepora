import { useState } from "react";
import { useTranslation } from "react-i18next";

const initialForm = { email: "", message: "" };

export default function ContactModal({ isOpen, onClose, onSubmitted }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);

  if (!isOpen) return null;

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.email.trim() || !form.message.trim()) return;
    setForm(initialForm);
    onClose();
    onSubmitted?.(t("contact.success"));
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-head">
          <h2>{t("contact.title")}</h2>
          <button className="icon-close" onClick={onClose} type="button" aria-label="Close">
            ×
          </button>
        </div>
        <p className="modal-subtitle">{t("contact.subtitle")}</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>{t("contact.email")}</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              required
            />
          </label>

          <label>
            <span>{t("contact.message")}</span>
            <textarea
              value={form.message}
              onChange={(event) => setField("message", event.target.value)}
              required
              rows={5}
            />
          </label>

          <button className="btn btn-primary btn-md" type="submit">
            {t("contact.send")}
          </button>
        </form>
      </div>
    </div>
  );
}
