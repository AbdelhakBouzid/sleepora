import { Navigate } from "react-router-dom";

export default function CheckoutCardPage() {
  return <Navigate replace to="/checkout?method=card&step=payment" />;
}
