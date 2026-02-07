// src/utils/SalesIQTracker.jsx

import { useEffect, useRef } from "react";
import { useLogin } from "../components/LoginContext.jsx";
import { identifySalesIQUser } from "./zohoSalesIQ";

const SalesIQTracker = () => {
  const { user } = useLogin();
  const identifiedRef = useRef(false);

  useEffect(() => {
    if (user?.email && user?.userName && !identifiedRef.current) {
      identifySalesIQUser({
        name: user.userName,   // ✅ FIXED
        email: user.email,
        phone: user.phone,
        userId: user._id,      // ✅ FIXED
      });

      identifiedRef.current = true;
    }
  }, [user]);

  return null;
};

export default SalesIQTracker;
