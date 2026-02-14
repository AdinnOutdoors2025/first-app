let salesIQLoaded = false;
let pendingVisitorData = null;

export const loadZohoSalesIQ = () => {
  if (typeof window === "undefined") return;
  if (salesIQLoaded) return;

  salesIQLoaded = true;

  window.$zoho = window.$zoho || {};
  window.$zoho.salesiq = {
    widgetcode:
      "siq11ce1d7e46ca5d487931f9476eefc637eb976141c9b9b199592f0fe8501d669c46d66da8eb50c3b58f7bd26206f5a277",
    values: {},
    ready: function () {
      

      // 🔥 Apply pending visitor info AFTER widget is ready
      if (pendingVisitorData) {
        applyVisitorInfo(pendingVisitorData);
        pendingVisitorData = null;
      }
    },
  };

  const script = document.createElement("script");
  script.id = "zsiqscript";
  script.type = "text/javascript";
  script.defer = true;
  script.src = "https://salesiq.zoho.in/widget";

  document.body.appendChild(script);
};

const applyVisitorInfo = (user) => {
  if (!window.$zoho?.salesiq?.visitor) return;

  window.$zoho.salesiq.visitor.name(user.name);
  window.$zoho.salesiq.visitor.email(user.email);

  if (user.phone) {
    window.$zoho.salesiq.visitor.phone(user.phone);
  }

  if (user.userId) {
    window.$zoho.salesiq.visitor.addInfo("User ID", user.userId);
  }

  window.$zoho.salesiq.visitor.addInfo("User Type", "Logged In");
};

export const identifySalesIQUser = (user) => {
  if (!user?.email || !user?.name) return;

  // If widget not ready yet → store temporarily
  if (!window.$zoho?.salesiq?.visitor) {
    pendingVisitorData = user;
    return;
  }

  applyVisitorInfo(user);
};

export const resetSalesIQUser = () => {
  if (!window.$zoho?.salesiq?.visitor) return;
  window.$zoho.salesiq.visitor.logout();
};
