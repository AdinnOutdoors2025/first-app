import React, { useState, useEffect } from "react";
import "./ad1OrderDetails.css";
import { useLocation } from "react-router-dom";
import CalendarOrderDetails from "./ad1CalenderOrderDetails";
import { baseUrl } from "./BASE_URL";
import { formatIndianCurrency } from "../components/FORMATED_AMOUNT";
import axios from "axios";
import { toast } from "react-toastify";
//FORMATTER DATE AND TIME
import {
  formatIndianDateTime,
  formatForTable,
  formatBookingRange,
  getBookingStatus,
} from "../../src/DateTimeFormatter";

// const formatEditedDateTime = (dateString) => {
//   if (!dateString) return "";

//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return "";

//   const day = date.getDate().toString().padStart(2, "0");
//   const month = date.toLocaleString("en-US", { month: "short" });
//   const year = date.getFullYear();

//   const time = date
//     .toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     })
//     .toLowerCase();

//   return `${day}-${month}-${year}, ${time}`;
// };

/* */
const fetchOrderConflicts = async (orderId) => {
  try {
    const res = await axios.get(`${baseUrl}/checkOrderConflict/${orderId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching conflicts", err);
    return null;
  }
};

const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

const tooltipDates = (dates) => {
  return dates.map((date, index) => <div key={index}>{formatDate(date)}</div>);
};

/* */

const formatEditedDateTime = (dateString) => {
  if (!dateString) return "";
  return formatIndianDateTime(dateString);
};

function OrderDetails({ order, onOrderUpdate }) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleteProductName, setDeleteProductName] = useState("");
  const [handlerName, setHandlerName] = useState("");

  // Add the handleConfirmOrder function
  const [confirmationNotes, setConfirmationNotes] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Payment history state - ensure it's always an array
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const refreshOrderData = async () => {
    try {
      const response = await fetch(`${baseUrl}/prodOrders/${safeOrder._id}`);
      const updatedOrder = await response.json();

      if (updatedOrder) {
        setOrderData(updatedOrder);
        setLocalOrder(updatedOrder);

        // Ensure payment history is always an array
        const normalizedPaymentHistory = Array.isArray(
          updatedOrder.client?.paidAmount,
        )
          ? updatedOrder.client.paidAmount
          : [];
        setPaymentHistory(normalizedPaymentHistory);

        if (onOrderUpdate) {
          onOrderUpdate(updatedOrder);
        }
      }
    } catch (error) {
      console.error("Error refreshing order data:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      const orderToDeleteFrom = safeOrder;
      const product = safeOrder.products.find(
        (p) => p._id === selectedProductId,
      );
      const isCurrentlyDeleted = product?.deleted || false;

      // Use _id for API calls
      let endpoint = "";

      if (isCurrentlyDeleted) {
        // Restore product
        endpoint = `${baseUrl}/deleteProductOrder/${safeOrder._id}/${selectedProductId}?deletedBy=${encodeURIComponent(handlerName)}`;
      } else {
        // Delete product
        endpoint = `${baseUrl}/deleteProductOrder/${safeOrder._id}/${selectedProductId}?deletedBy=${encodeURIComponent(handlerName)}`;
      }

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.status) {
        // Update local state immediately
        const updatedProducts = safeOrder.products.map((p) => {
          if (p._id === selectedProductId) {
            return {
              ...p,
              deleted: !isCurrentlyDeleted,
              deletedAt: isCurrentlyDeleted ? null : new Date(),
              deletedBy: isCurrentlyDeleted ? null : handlerName,
            };
          }
          return p;
        });

        // Calculate new totals
        const activeProducts = updatedProducts.filter((p) => !p.deleted);
        const newTotalAmount = activeProducts.reduce(
          (sum, p) => sum + (p.booking?.totalPrice || 0),
          0,
        );

        // Create updated order with all changes
        const updatedOrder = {
          ...safeOrder,
          products: updatedProducts,
          client: {
            ...safeOrder.client,
            totalAmount: newTotalAmount,
            balanceAmount: Math.max(newTotalAmount - totalPaidAmount, 0),
          },
          last_edited: new Date().toISOString(),
        };

        // Update local state immediately
        setOrderData(updatedOrder);
        setLocalOrder(updatedOrder);

        // Send email notification with UPDATED order data
        try {
          const notificationResponse = await fetch(
            `${baseUrl}/notifications/send-product-deletion-notification`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: safeOrder.orderId,
                productId: selectedProductId,
                productName: deleteProductName,
                client: updatedOrder.client, // Send updated client info
                orderDetails: updatedOrder, // Send COMPLETELY UPDATED order
                action: isCurrentlyDeleted ? "restore" : "delete",
                handler: handlerName,
                createdAt: safeOrder.createdAt,
              }),
            },
          );

          const notificationResult = await notificationResponse.json();
          console.log(
            "Notification sent with counts:",
            notificationResult.counts,
          );

          if (!notificationResult.success) {
            toast.warning(
              `Product ${isCurrentlyDeleted ? "restored" : "deleted"} but email notification failed: ${notificationResult.error}`,
            );
          }
        } catch (emailError) {
          console.error("Failed to send notification:", emailError);
          toast.warning(
            isCurrentlyDeleted
              ? "Product restored but email notification failed"
              : "Product marked as deleted but email notification failed",
          );
        }

        toast.success(
          isCurrentlyDeleted
            ? "Product restored successfully"
            : "Product marked as deleted successfully",
        );
      } else {
        toast.error(result.message || "Failed to update product status");
      }
    } catch (err) {
      console.error("Error in confirmDelete:", err);
      toast.error("Failed to update product status");
    }
    setShowDeletePopup(false);
  };

  const handleDeleteClick = (orderId, productId, productName) => {
    setSelectedOrderId(orderId);
    setSelectedProductId(productId);
    setDeleteProductName(productName || "Product");

    const currentHandler = safeOrder.handled_by || "Admin";
    setHandlerName(currentHandler);

    setShowDeletePopup(true);
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
  };
  // RAC CONCEPTS
  const handleConfirmOrder = async () => {
    if (!safeOrder.handled_by) {
      toast.error("Please assign a handler before confirming");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${baseUrl}/orders/${safeOrder._id}/confirm`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            confirmedBy: safeOrder.handled_by,
            notes: confirmationNotes,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        // Update local state
        const updatedOrder = {
          ...safeOrder,
          order_status: "confirmed",
          status: "Confirmed",
          confirmed_at: new Date().toISOString(),
          confirmed_by: safeOrder.handled_by,
          confirmation_notes: confirmationNotes,
          last_edited: new Date().toISOString(),
        };

        setOrderData(updatedOrder);
        setLocalOrder(updatedOrder);

        toast.success("✅ Order confirmed successfully!");
        setShowConfirmDialog(false);
        setConfirmationNotes("");

        // Refresh order data
        await refreshOrderData();
      } else {
        toast.error(result.message || "Failed to confirm order");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      toast.error("Failed to confirm order");
    } finally {
      setIsLoading(false);
    }
  };
  // RAC CONCEPTS

  const location = useLocation();
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);

  const openCalender = () => setIsCalenderOpen(!isCalenderOpen);
  const closeCalender = () => setIsCalenderOpen(false);

  /* */
  const [currentOrder, setCurrentOrder] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [fullConflicts, setFullConflicts] = useState([]);
  /* */
  const [localOrder, setLocalOrder] = useState(null);

  useEffect(() => {
    const newOrder = order ||
      location.state?.order || {
        products: [{}],
        client: {},
        status: "",
      };
    setLocalOrder(newOrder);
  }, [order, location.state]);

  /* */
  useEffect(() => {
    const loadConflicts = async () => {
      const data = await fetchOrderConflicts(safeOrder.orderId);
      if (data?.success) {
        setCurrentOrder(data.currentOrder);
        setConflicts(data.conflicts);
        // setFullConflicts(data);
      }
    };

    loadConflicts();
  }, []);
  /* */

  const initialOrder = localOrder ||
    order ||
    location.state?.order || {
      products: [{}],
      client: {},
      status: "",
    };

  const [orderData, setOrderData] = useState(initialOrder);
  const safeOrder = orderData;

  const [orderStatuses, setOrderStatuses] = useState([]);
  const [selectOrderStatus, setSelectOrderStatus] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [showCancelReasonInput, setShowCancelReasonInput] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [hasHandlerAssigned, setHasHandlerAssigned] = useState(
    safeOrder.handled_by && safeOrder.handled_by.trim() !== "",
  );
  const [isOrderCancelled, setIsOrderCancelled] = useState(
    safeOrder.order_status === "Cancelled",
  );

  // Calculate active and deleted products
  const activeProducts = safeOrder.products?.filter((p) => !p.deleted) || [];
  const deletedProducts = safeOrder.products?.filter((p) => p.deleted) || [];

  // Calculate totals - FIXED VERSION
  const calculateActiveTotals = () => {
    if (!safeOrder.products) return 0;
    return safeOrder.products.reduce((sum, product) => {
      if (!product.deleted) {
        return sum + (product.booking?.totalPrice || 0);
      }
      return sum;
    }, 0);
  };

  // Payment calculations - FIXED
  const totalAmount = calculateActiveTotals();

  // Ensure payment history is always an array
  const initialPaidArray = Array.isArray(safeOrder.client?.paidAmount)
    ? safeOrder.client.paidAmount
    : [];

  const totalPaidAmount = initialPaidArray.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0,
  );

  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(
    Math.max(totalAmount - totalPaidAmount, 0),
  );

  // Initialize payment history
  useEffect(() => {
    if (safeOrder.client?.paidAmount) {
      if (Array.isArray(safeOrder.client.paidAmount)) {
        setPaymentHistory(safeOrder.client.paidAmount);
      } else if (typeof safeOrder.client.paidAmount === "number") {
        // Convert single number to array format
        setPaymentHistory([
          {
            amount: safeOrder.client.paidAmount,
            paidAt: safeOrder.createdAt || new Date(),
          },
        ]);
      } else {
        setPaymentHistory([]);
      }
    } else {
      setPaymentHistory([]);
    }
  }, [safeOrder.client?.paidAmount, safeOrder.createdAt]);

  // Recalculate remaining amount when totals change
  useEffect(() => {
    const activeTotal = calculateActiveTotals();
    const paidTotal = paymentHistory.reduce(
      (sum, p) => sum + (p.amount || 0),
      0,
    );
    const newRemaining = Math.max(activeTotal - paidTotal, 0);
    setRemainingAmount(newRemaining);
  }, [safeOrder.products, paymentHistory]);

  const handleAdvanceChange = (e) => {
    if (isFullyPaid) return;
    let value = e.target.value.replace(/[^0-9]/g, "");
    const adv = Number(value);
    setAdvanceAmount(adv);
    setRemainingAmount(Math.max(totalAmount - (totalPaidAmount + adv), 0));
  };

  const handleSaveAmounts = async () => {
    
    if(safeOrder.order_status == 'Pending Client Confirmation')
    {
      toast.error("Please change the order status from 'Pending Client Confirmation' before updating the order details.");
      return;
      
    }
     
    try {
     
      if (advanceAmount <= 0) {
        toast.error("Enter valid amount");
        return;
      }
      setIsSaving(true); 
      const payload = {
        orderId: safeOrder.orderId,
        advanceAmount: advanceAmount,
      };

      const response = await fetch(`${baseUrl}/updateOrderAmounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status) {
        // Update payment history - ensure it's an array
        const updatedPaid = Array.isArray(data.data?.client?.paidAmount)
          ? data.data.client.paidAmount
          : [];

        setPaymentHistory(updatedPaid);
        setAdvanceAmount(0);

        // Update local state
        setOrderData((prev) => ({
          ...prev,
          client: {
            ...prev.client,
            paidAmount: updatedPaid,
            balanceAmount: data.data?.client?.balanceAmount || remainingAmount,
            totalAmount: totalAmount,
          },
          last_edited: new Date().toISOString(),
        }));

        toast.success("Amounts saved successfully!");

        // Refresh data to ensure consistency
        await refreshOrderData();
        setIsSaving(false);
      } else {
        setIsSaving(false);
        toast.error(data.message || "Failed to save amounts");
      }
    } catch (error) {
      setIsSaving(false);
      console.error("Error saving amounts:", error);
      toast.error("Error saving amounts");
    }
  };

  // Calendar state
  const [selectedDates, setSelectedDates] = useState({
    start: null,
    end: null,
  });
  const [bookedDates, setBookedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [confirmedDates, setConfirmedDates] = useState({});
  const [finalConfirmDate, setFinalConfirmDates] = useState(null);

  // Fetch booked dates - UPDATED to exclude deleted products
  useEffect(() => {
    const fetchBookedDates = async () => {
      const currentProduct = safeOrder.products?.[activeProductIndex];

      // Don't fetch dates for deleted products
      if (currentProduct?.deleted) {
        setBookedDates([]);
        return;
      }

      if (currentProduct?.prodCode) {
        try {
          const cleanProductCode = currentProduct.prodCode
            .replace(/^#/, "")
            .trim();
          let url = `${baseUrl}/booked-dates/${encodeURIComponent(cleanProductCode)}`;

          // if (safeOrder._id) {
          //   url += `?excludeOrderId=${safeOrder._id}`;
          // }

          const res = await fetch(url);
          if (res.ok) {
            const dates = await res.json();
            setFinalConfirmDates(dates);

            const dateObjects = dates.map((d) => {
              const date = new Date(d);
              return new Date(
                Date.UTC(
                  date.getUTCFullYear(),
                  date.getUTCMonth(),
                  date.getUTCDate(),
                ),
              );
            });
            setBookedDates(dateObjects);
          } else {
            setBookedDates([]);
          }
        } catch (error) {
          console.error("Error fetching booked dates:", error);
          setBookedDates([]);
        }
      } else {
        setBookedDates([]);
      }
    };

    fetchBookedDates();
  }, [safeOrder.products, activeProductIndex, safeOrder._id]);

  // Update selected dates when product changes
  useEffect(() => {
    if (
      safeOrder.products[activeProductIndex]?.booking &&
      !safeOrder.products[activeProductIndex]?.deleted
    ) {
      const booking = safeOrder.products[activeProductIndex].booking;
      setSelectedDates({
        start: booking.startDate ? new Date(booking.startDate) : null,
        end: booking.endDate ? new Date(booking.endDate) : null,
      });
    } else {
      setSelectedDates({ start: null, end: null });
    }
  }, [activeProductIndex, safeOrder.products]);

  // Helper functions for calendar
  const isPastDate = (date) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const normalizedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    return normalizedDate < today;
  };

  const generateMonth = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    while (days.length < 42) days.push(null);
    return days;
  };

  const handleDateClick = (date) => {
    setHasUserSelected(true);
    if (!date || isNaN(date.getTime())) return;

    const normalizedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );

    const isBooked = bookedDates.some((d) => {
      const bookedDate = new Date(d);
      return (
        bookedDate.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
        bookedDate.getUTCMonth() === normalizedDate.getUTCMonth() &&
        bookedDate.getUTCDate() === normalizedDate.getUTCDate()
      );
    });

    const isPast = isPastDate(normalizedDate);

    if (isBooked || isPast) return;

    if (!selectedDates.start || selectedDates.end) {
      setSelectedDates({ start: normalizedDate, end: null });
    } else {
      if (normalizedDate < selectedDates.start) {
        setSelectedDates({ start: normalizedDate, end: selectedDates.start });
      } else {
        setSelectedDates({ start: selectedDates.start, end: normalizedDate });
      }
    }
  };

  const resetDates = () => {
    setSelectedDates({ start: null, end: null });
    setConfirmedDates({ start: null, end: null });
  };

  const getDateSelectionClass = (date) => {
    if (!date || isNaN(date.getTime())) return "disabled";

    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );

    /* ---------- BOOKED / PAST ---------- */
    const isBooked = bookedDates.some((d) => {
      const bookedDate = new Date(d);
      return (
        bookedDate.getUTCFullYear() === utcDate.getUTCFullYear() &&
        bookedDate.getUTCMonth() === utcDate.getUTCMonth() &&
        bookedDate.getUTCDate() === utcDate.getUTCDate()
      );
    });

    const isPast = isPastDate(utcDate);

    if (isBooked && isPast) return "past booked";
    if (isBooked) return "booked";
    if (isPast) return "past";

    /* ---------- CONFIRMED ---------- */
    const dateKey = `${utcDate.getUTCFullYear()}-${String(
      utcDate.getUTCMonth() + 1,
    ).padStart(2, "0")}-${String(utcDate.getUTCDate()).padStart(2, "0")}`;

    const isConfirmed = finalConfirmDate?.confirmed?.includes(dateKey);

    /* ❌ KEY RULE
     Do NOT apply any green styles
     until user clicks the calendar
  */
    if (!hasUserSelected && isConfirmed) {
      return ""; // red text only, no background
    }

    /* ---------- USER SELECTION ---------- */
    if (!hasUserSelected) return "";

    const startUTC = selectedDates.start
      ? new Date(
          Date.UTC(
            selectedDates.start.getFullYear(),
            selectedDates.start.getMonth(),
            selectedDates.start.getDate(),
          ),
        )
      : null;

    const endUTC = selectedDates.end
      ? new Date(
          Date.UTC(
            selectedDates.end.getFullYear(),
            selectedDates.end.getMonth(),
            selectedDates.end.getDate(),
          ),
        )
      : null;

    if (startUTC && utcDate.getTime() === startUTC.getTime())
      return "selected-start";

    if (endUTC && utcDate.getTime() === endUTC.getTime()) return "selected-end";

    if (startUTC && endUTC && utcDate > startUTC && utcDate < endUTC)
      return "selected-range";

    return "";
  };

  const getDateSelectionClass_old = (date) => {
    if (!date || isNaN(date.getTime())) return "disabled";

    const normalizedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );

    const isBooked = bookedDates.some((d) => {
      const bookedDate = new Date(d);
      return (
        bookedDate.getUTCFullYear() === normalizedDate.getUTCFullYear() &&
        bookedDate.getUTCMonth() === normalizedDate.getUTCMonth() &&
        bookedDate.getUTCDate() === normalizedDate.getUTCDate()
      );
    });

    const isPast = isPastDate(normalizedDate);

    if (isBooked && isPast) return "past booked";
    if (isBooked) return "booked";
    if (isPast) return "past";

    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const startUTC = selectedDates.start
      ? new Date(
          Date.UTC(
            selectedDates.start.getFullYear(),
            selectedDates.start.getMonth(),
            selectedDates.start.getDate(),
          ),
        )
      : null;

    const endUTC = selectedDates.end
      ? new Date(
          Date.UTC(
            selectedDates.end.getFullYear(),
            selectedDates.end.getMonth(),
            selectedDates.end.getDate(),
          ),
        )
      : null;

    if (startUTC && utcDate.getTime() === startUTC.getTime())
      return "selected-start";
    if (endUTC && utcDate.getTime() === endUTC.getTime()) return "selected-end";
    if (startUTC && endUTC && utcDate > startUTC && utcDate < endUTC) {
      return "selected-range";
    }

    return "";
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const pricePerDay = safeOrder.products[activeProductIndex]?.price || 0;

  const getAvailableDaysInRange = (start, end) => {
    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return [];
    }

    const days = [];
    const current = new Date(start);
    const lastDay = new Date(end);

    current.setUTCHours(0, 0, 0, 0);
    lastDay.setUTCHours(0, 0, 0, 0);

    const bookedUTCDates = new Set(
      bookedDates.map((d) =>
        Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),
      ),
    );

    while (current <= lastDay) {
      const currentUTC = Date.UTC(
        current.getFullYear(),
        current.getMonth(),
        current.getDate(),
      );

      if (!bookedUTCDates.has(currentUTC) && !isPastDate(current)) {
        days.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const availableDays =
    selectedDates.start && selectedDates.end
      ? getAvailableDaysInRange(selectedDates.start, selectedDates.end)
      : [];
  const totalDays = availableDays.length;
  const totalPrice = totalDays * pricePerDay;

  const confirmDates = async () => {
    if (!selectedDates.start || !selectedDates.end) {
      alert("Please select both start and end dates");
      return;
    }

    const startUTC = new Date(
      Date.UTC(
        selectedDates.start.getFullYear(),
        selectedDates.start.getMonth(),
        selectedDates.start.getDate(),
      ),
    );

    const endUTC = new Date(
      Date.UTC(
        selectedDates.end.getFullYear(),
        selectedDates.end.getMonth(),
        selectedDates.end.getDate(),
      ),
    );

    if (isNaN(startUTC.getTime()) || isNaN(endUTC.getTime())) {
      alert("Invalid date selection");
      return;
    }

    if (startUTC > endUTC) {
      alert("Start date must be before end date");
      return;
    }

    const selectedRangeDates = [];
    const current = new Date(startUTC);

    while (current <= endUTC) {
      selectedRangeDates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const hasConflict = selectedRangeDates.some((selectedDate) => {
      return bookedDates.some((bookedDate) => {
        const selectedUTC = new Date(
          Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
          ),
        );
        const bookedUTC = new Date(
          Date.UTC(
            bookedDate.getFullYear(),
            bookedDate.getMonth(),
            bookedDate.getDate(),
          ),
        );
        return selectedUTC.getTime() === bookedUTC.getTime();
      });
    });

    if (hasConflict) {
      alert(
        "Selected dates conflict with existing bookings for THIS PRODUCT. Please choose different dates.",
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedBookedDates = [];
      const currentDate = new Date(startUTC);

      while (currentDate <= endUTC) {
        updatedBookedDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const totalDays = updatedBookedDates.length;
      const productPrice = safeOrder.products[activeProductIndex]?.price || 0;
      const totalPrice = totalDays * productPrice;

      const updatedProducts = safeOrder.products.map((product, index) => {
        if (index === activeProductIndex) {
          return {
            ...product,
            booking: {
              startDate: startUTC.toISOString(),
              endDate: endUTC.toISOString(),
              totalDays: totalDays,
              totalPrice: totalPrice,
            },
            bookedDates: updatedBookedDates.map((d) => d.toISOString()),
          };
        }
        return product;
      });

      const response = await fetch(`${baseUrl}/prodOrders/${safeOrder._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: updatedProducts }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const updatedOrder = await response.json();

      // Store old dates for email notification
      const oldBookingData = safeOrder.products[activeProductIndex]?.booking;

      // Send email notification for date update
      try {
        await axios.post(
          `${baseUrl}/notifications/send-date-update-notification`,
          {
            orderId: safeOrder.orderId,
            client: safeOrder.client,
            product: safeOrder.products[activeProductIndex],
            oldDates: oldBookingData,
            newDates: {
              startDate: startUTC.toISOString(),
              endDate: endUTC.toISOString(),
              totalDays: totalDays,
              totalPrice: totalPrice,
            },
            orderDetails: safeOrder,
            handler: safeOrder.handled_by,
            createdAt: safeOrder.createdAt,
          },
        );
      } catch (emailError) {
        console.error("Failed to send date update email:", emailError);
        toast.warning("Dates updated but email notification failed");
      }

      setConfirmedDates({ start: startUTC, end: endUTC });
      setIsCalenderOpen(false);

      // Update local state
      setOrderData((prev) => ({
        ...prev,
        products: updatedProducts,
        last_edited: new Date().toISOString(),
      }));

      toast.success("✅ Dates updated successfully and notifications sent!");
    } catch (error) {
      console.error("❌ Update error:", error);
      setError(error.message || "Failed to update dates");
      toast.error(`❌ Update failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 991);
    };
    window.addEventListener("resize", handleResize);

    fetchOrderStatuses();

    if (safeOrder.handled_by && safeOrder.handled_by.trim() !== "") {
      setHasHandlerAssigned(true);
    } else {
      setHasHandlerAssigned(false);
    }

    const isCancelled = safeOrder.order_status === "Cancelled";
    setIsOrderCancelled(isCancelled);

    if (safeOrder.order_status && safeOrder.order_status.trim() !== "") {
      setSelectOrderStatus(safeOrder.order_status);
    } else {
      setSelectOrderStatus("");
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [safeOrder.handled_by, safeOrder.order_status]);

  const fetchOrderStatuses = async () => {
    try {
      const res = await fetch(`${baseUrl}/getOrderStatuses`);
      const data = await res.json();
      setOrderStatuses(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // const handleStatusChange = (e) => {
  //   const value = e.target.value;
  //   if (value === "__add_new__") {
  //     setShowAddInput(true);
  //     setShowCancelReasonInput(false);
  //     return;
  //   } else if (value === "Cancelled") {
  //     setShowCancelReasonInput(true);
  //     setSelectOrderStatus(value);
  //   } else {
  //     setShowCancelReasonInput(false);
  //     setShowAddInput(false);
  //     setSelectOrderStatus(value);
  //     updateOrderStatus(value);
  //   }
  // };

  // Update handleStatusChange function in ad1OrderDetails.js
  const handleStatusChange = (e) => {
    const value = e.target.value;

    // Special handling for "Order Confirmed"
    if (value === "Order Confirmed") {
      const confirmChange = window.confirm(
        "⚠️ IMPORTANT: Changing status to 'Order Confirmed' will:\n\n" +
          "1. Lock the booking dates (turn them RED)\n" +
          "2. Make dates unavailable for other users\n" +
          "3. Cannot be undone automatically\n\n" +
          "Are you sure you want to confirm this order?",
      );

      if (!confirmChange) {
        setSelectOrderStatus((prev) => prev); // Keep previous value
        return;
      }
    }

    if (value === "__add_new__") {
      setShowAddInput(true);
      setShowCancelReasonInput(false);
      return;
    } else if (value === "Cancelled") {
      setShowCancelReasonInput(true);
      setSelectOrderStatus(value);
    } else {
      setShowCancelReasonInput(false);
      setShowAddInput(false);
      setSelectOrderStatus(value);

      // Update order status immediately for "Order Confirmed"
      if (value === "Order Confirmed") {
        updateOrderStatus(value, true); // Pass true for confirmation
      } else {
        updateOrderStatus(value);
      }
    }
  };
  const setNewStatusInput = (newStatus) => {
    setNewStatus(newStatus);
  };

  const setCancelReasonValue = (cancelReason) => {
    setCancelReason(cancelReason);
  };

  // const updateOrderStatus = async (statusValue) => {
  //   if (!statusValue || statusValue.trim() === "") return;

  //   try {
  //     const response = await fetch(`${baseUrl}/updateOrderStatus/${safeOrder._id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         cancel: false,
  //         status: statusValue,
  //       })
  //     });

  //     const res = await response.json();

  //     if (res?.status === true) {
  //       setIsOrderCancelled(statusValue === "Cancelled");
  //       setOrderData(prev => ({
  //         ...prev,
  //         order_status: statusValue
  //       }));

  //       toast.success(res.message || "Status Updated successfully!");
  //     } else {
  //       toast.error(res.message || "Server Error!");
  //     }
  //   } catch (err) {
  //     console.error("Status update failed", err);
  //   }
  // };

  // const saveCancelReason = async () => {
  //   if (!cancelReason.trim()) {
  //     toast.error("Please enter a cancel reason");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${baseUrl}/updateOrderStatus/${safeOrder._id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         cancel: true,
  //         reason: cancelReason,
  //         status: 'Cancelled'
  //       })
  //     });

  //     const res = await response.json();

  //     if (res?.status === true) {
  //       // Send cancellation email
  //       try {
  //         await fetch(`${baseUrl}/notifications/send-cancellation-notification`, {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({
  //             orderId: safeOrder.orderId,
  //             client: safeOrder.client,
  //             cancelReason: cancelReason,
  //             orderDetails: safeOrder,
  //             handler: safeOrder.handled_by,
  //             createdAt : safeOrder.createdAt,
  //             totalItems : safeOrder.products.length
  //           })
  //         });
  //       } catch (emailError) {
  //         console.error("Failed to send cancellation email:", emailError);
  //         toast.warning("Order cancelled but email notification failed");
  //       }

  //       // Update local state
  //       setIsOrderCancelled(true);
  //       setShowCancelReasonInput(false);
  //       setCancelReason("");
  //       setOrderData(prev => ({
  //         ...prev,
  //         order_status: 'Cancelled',
  //         cancel_reason: cancelReason
  //       }));

  //       toast.success(res.message || "Order cancelled successfully!");
  //     } else {
  //       toast.error(res.message || "Server Error!");
  //     }
  //   } catch (err) {
  //     console.error("Error adding status", err);
  //     toast.error("Failed to cancel order");
  //   }
  // };

  // In the saveCancelReason function, add date release logic
  // Update updateOrderStatus function
  // const updateOrderStatus = async (statusValue, isConfirmation = false) => {
  //   if (!statusValue || statusValue.trim() === "") return;

  //   try {
  //     const response = await fetch(`${baseUrl}/updateOrderStatus/${safeOrder._id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         cancel: false,
  //         status: statusValue,
  //         isConfirmation: isConfirmation // Flag for confirmation
  //       })
  //     });

  //     const res = await response.json();

  //     if (res?.status === true) {
  //       setIsOrderCancelled(statusValue === "Cancelled");
  //       setOrderData(prev => ({
  //         ...prev,
  //         order_status: statusValue,
  //         // If confirming, also update status to "Confirmed"
  //         ...(isConfirmation && { status: "Confirmed" })
  //       }));

  //       // If confirming order, send confirmation notifications
  //       if (isConfirmation) {
  //         try {
  //           await fetch(`${baseUrl}/notifications/send-order-confirmation`, {
  //             method: 'POST',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify({
  //               orderId: safeOrder.orderId,
  //               client: safeOrder.client,
  //               orderDetails: safeOrder,
  //               confirmedBy: safeOrder.handled_by || "Admin",
  //               confirmedAt: new Date().toISOString()
  //             })
  //           });

  //           toast.success("✅ Order confirmed! Dates are now locked and notifications sent.");
  //         } catch (notifyError) {
  //           console.error("Notification error:", notifyError);
  //           toast.success("✅ Order confirmed! (Notifications failed)");
  //         }
  //       } else {
  //         toast.success(res.message || "Status Updated successfully!");
  //       }
  //     } else {
  //       toast.error(res.message || "Server Error!");
  //     }
  //   } catch (err) {
  //     console.error("Status update failed", err);
  //   }
  // };

  const updateOrderStatus = async (statusValue, isConfirmation = false) => {
    if (!statusValue || statusValue.trim() === "") return;

    try {
      const response = await fetch(
        `${baseUrl}/updateOrderStatus/${safeOrder._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cancel: false,
            status: statusValue,
            isConfirmation: isConfirmation,
          }),
        },
      );

      const res = await response.json();

      if (res?.status === true) {
        setIsOrderCancelled(statusValue === "Cancelled");
        // ONLY update order_status, NOT the main status field
        setOrderData((prev) => ({
          ...prev,
          order_status: statusValue,
        }));

        toast.success(res.message || "Status Updated successfully!");
      } else {
        toast.error(res.message || "Server Error!");
      }
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const saveCancelReason = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please enter a cancel reason");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/updateOrderStatus/${safeOrder._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cancel: true,
            reason: cancelReason,
            status: "Cancelled",
          }),
        },
      );

      const res = await response.json();

      if (res?.status === true) {
        // Mark all products as deleted when order is cancelled
        const cancelledProducts = safeOrder.products.map((product) => ({
          ...product,
          deleted: true,
          deletedAt: new Date(),
          deletedBy: handlerName || "System",
          cancellationReason: cancelReason,
        }));

        // Update local state
        const updatedOrder = {
          ...safeOrder,
          products: cancelledProducts,
          order_status: "Cancelled",
          order_cancel_reason: cancelReason,
          client: {
            ...safeOrder.client,
            totalAmount: 0, // No active products, so total is 0
            balanceAmount: 0,
          },
        };

        setOrderData(updatedOrder);
        setIsOrderCancelled(true);
        setShowCancelReasonInput(false);
        setCancelReason("");

        // Send cancellation email
        try {
          await fetch(
            `${baseUrl}/notifications/send-cancellation-notification`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: safeOrder.orderId,
                client: safeOrder.client,
                cancelReason: cancelReason,
                orderDetails: updatedOrder,
                handler: safeOrder.handled_by,
                createdAt: safeOrder.createdAt,
                totalItems: safeOrder.products.length,
              }),
            },
          );
        } catch (emailError) {
          console.error("Failed to send cancellation email:", emailError);
          toast.warning("Order cancelled but email notification failed");
        }

        // Update each product to mark as deleted (free up dates)
        try {
          for (const product of safeOrder.products) {
            if (!product.deleted) {
              await fetch(
                `${baseUrl}/deleteProductOrder/${safeOrder._id}/${product._id}?deletedBy=${encodeURIComponent(handlerName || "System")}`,
                {
                  method: "GET",
                },
              );
            }
          }
        } catch (productUpdateError) {
          console.error(
            "Error updating products on cancellation:",
            productUpdateError,
          );
          toast.warning("Order cancelled but product updates incomplete");
        }

        toast.success(res.message || "Order cancelled successfully!");
      } else {
        toast.error(res.message || "Server Error!");
      }
    } catch (err) {
      console.error("Error adding status", err);
      toast.error("Failed to cancel order");
    }
  };

  const addNewStatus = async () => {
    if (!newStatus.trim()) return;

    try {
      const response = await fetch(`${baseUrl}/addOrderStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newStatus,
          createdAt: new Date(),
          updatedAt: null,
        }),
      });

      const res = await response.json();

      if (res?.status === true) {
        setShowAddInput(false);
        setNewStatus("");
        fetchOrderStatuses();
        toast.success("Status added successfully!");
      } else {
        toast.error(res.message || "Failed to add status");
      }
    } catch (err) {
      console.error("Error adding status", err);
      toast.error("Failed to add status");
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const updateHandlerName = async (newHandlerName) => {
    if (!newHandlerName || newHandlerName.trim() === "") {
      toast.error("Handler name cannot be empty");
      return;
    }

    if (newHandlerName.trim() === safeOrder.handled_by) {
      toast.info("No changes made. Handler name is the same.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${baseUrl}/prodOrders/${safeOrder._id}/handled-by`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            handled_by: newHandlerName.trim(),
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();

        const updatedOrder = {
          ...safeOrder,
          handled_by: newHandlerName.trim(),
          last_edited: new Date().toISOString(),
        };

        setLocalOrder(updatedOrder);
        setOrderData(updatedOrder);
        setHasHandlerAssigned(true);

        if (onOrderUpdate) {
          onOrderUpdate(updatedOrder);
        }

        toast.success("Handler updated successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update handler");
      }
    } catch (error) {
      console.error("Error updating handler:", error);
      toast.error(`❌ Error: ${error.message || "Failed to update handler"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditHandler = () => {
    const newHandler = prompt(
      `Current handler: ${
        safeOrder.handled_by || "-"
      }\n\nEnter new handler name:`,
      safeOrder.handled_by || "",
    );

    if (
      newHandler &&
      newHandler.trim() !== "" &&
      newHandler.trim() !== safeOrder.handled_by
    ) {
      updateHandlerName(newHandler.trim());
    } else if (newHandler && newHandler.trim() === safeOrder.handled_by) {
      toast.info("No changes made. Handler name is the same.");
    }
  };

  const canEditDelete = hasHandlerAssigned && !isOrderCancelled;
  const isFullyPaid = remainingAmount <= 0;

  // Render product row
  const renderProductRow = (product, index) => {
    const isDeleted = product.deleted;
    const rowClass = isDeleted ? "deleted-product-row" : "";

    return (
      <tr
        key={index}
        className={`${activeProductIndex === index ? "active-product" : ""} ${rowClass}`}
      >
        <td>
          <img
            src={product.image}
            alt="Product"
            className={`productImg ${isDeleted ? "deleted-product-image" : ""}`}
          />
          {isDeleted && <div className="deleted-badge">DELETED</div>}
        </td>
        <td>
          <div className={isDeleted ? "strikethrough-text" : ""}>
            {product.prodCode}
          </div>
        </td>

        <td className="order-TableOrderName">
          <div className={isDeleted ? "strikethrough-text" : ""}>
            {product.name || "No name"}
          </div>
          {/* {isDeleted && product.deletedBy && (
            <div className="deleted-info">
              <small>Deleted by: {product.deletedBy}</small>
              {product.deletedAt && (
                <small> on {formatDateTime(product.deletedAt)}</small>
              )}
            </div>
          )} */}
          {isDeleted && product.deletedBy && (
            <div className="deleted-info">
              <small>Deleted by: {product.deletedBy}</small>
              {product.deletedAt && (
                <small> on {formatIndianDateTime(product.deletedAt)}</small>
              )}
            </div>
          )}
        </td>
        <td>
          <div className={isDeleted ? "strikethrough-text" : ""}>
            {safeOrder.status}
          </div>
        </td>
        <td>
          <div className={isDeleted ? "strikethrough-text" : ""}>
            ₹{product.price || 0}
          </div>
        </td>
        <td>
          {product.booking?.startDate ? (
            <div className={isDeleted ? "strikethrough-text" : ""}>
              {new Date(product.booking.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {new Date(product.booking.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              ({product.booking?.totalDays || 0} Days)
            </div>
          ) : (
            "--"
          )}
        </td>

        <td>
          {canEditDelete && !isOrderCancelled && (
            <div className="action-buttons">
              {!isDeleted && (
                <>
                  <i
                    className="fa-solid fa-pen-to-square status-edit-icon"
                    title="Edit Dates"
                    onClick={() => {
                          if(safeOrder.order_status == 'Pending Client Confirmation')
                          {
                            toast.error("Please change the order status from 'Pending Client Confirmation' before updating the order details.");
                            return;
                            
                          }
                      setActiveProductIndex(index);
                      setIsCalenderOpen(true);
                    }}
                  ></i>
                  <i
                    className="fa-solid fa-trash status-delete-icon"
                    title="Delete Product"
                    onClick={() => {
                          if(safeOrder.order_status == 'Pending Client Confirmation')
                          {
                            toast.error("Please change the order status from 'Pending Client Confirmation' before updating the order details.");
                            return;
                            
                          }
                      handleDeleteClick(
                        safeOrder._id,
                        product._id,
                        product.name,
                      );
                    }}
                  ></i>
                </>
              )}
              {isDeleted && (
                <i
                  className="fa-solid fa-rotate-left status-restore-icon"
                  title="Restore Product"
                  onClick={() => {
                    handleDeleteClick(safeOrder._id, product._id, product.name);
                  }}
                ></i>
              )}
            </div>
          )}
          {isOrderCancelled && (
            <div className="disabled-actions">
              <span className="disabled-text">Actions disabled</span>
            </div>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="adminOrderDetailsMain">
      {/* Handler Assignment Section */}
      <div className="order-card-header">
        <div className="handler-info-section">
          <span className="order-taken-by">
            <i className="fas fa-user-circle"></i>
            Order Handled By: {safeOrder.handled_by || "-"}
          </span>
          <button
            className="edit-handler-btn"
            onClick={handleEditHandler}
            disabled={isLoading}
          >
            {safeOrder.handled_by && safeOrder.handled_by.trim() !== "" ? (
              <>
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-edit"></i> Edit Handler
                  </>
                )}
              </>
            ) : (
              <>
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Assigning...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i> Assign Handler
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cancellation Warning Banner */}
      {isOrderCancelled && (
        <div className="cancelled-order-banner">
          <i className="fas fa-exclamation-triangle"></i>
          <span>This order has been CANCELLED. Editing is disabled.</span>
          {safeOrder.cancel_reason && (
            <span className="cancel-reason">
              Reason: {safeOrder.cancel_reason}
            </span>
          )}
        </div>
      )}

      {!safeOrder._id ? (
        <div className="no-order-selected">
          <h3>No order selected</h3>
          <p>Please choose an order to show details</p>
        </div>
      ) : (
        <>
          {/* Order details Section */}
          <div className="order-manageClientSection">
            <div className="order-manageRightSideHeading">
              Order Information
            </div>

            {hasHandlerAssigned && (
              <div className="order-status-container">
                <div className="order-status-header">
                  <label className="order-status-label">Order Status</label>
                  <div
                    className={`current-status-display ${isOrderCancelled ? "cancelled-status" : ""}`}
                  >
                    {selectOrderStatus || "Select Status"}
                  </div>
                </div>

                {!isOrderCancelled && (
                  <div className="order-status-dropdown">
                    <div className="dropdown-wrapper">
                      <select
                        onChange={handleStatusChange}
                        value={selectOrderStatus}
                        className="status-select"
                        disabled={isOrderCancelled}
                      >
                        <option value="">Select Status</option>
                        {orderStatuses.map((status) => (
                          <option key={status._id} value={status.name}>
                            {status.name}
                          </option>
                        ))}
                        <option value="__add_new__">+ Add New Status</option>
                      </select>
                      <div className="dropdown-arrow">
                        <i className="fas fa-chevron-down"></i>
                      </div>
                    </div>
                  </div>
                )}

                {showAddInput && !isOrderCancelled && (
                  <div className="add-status-section">
                    <div className="add-status-input-group">
                      <input
                        onChange={(e) => setNewStatusInput(e.target.value)}
                        type="text"
                        placeholder="Enter new status"
                        className="new-status-input"
                      />
                      <button
                        onClick={addNewStatus}
                        className="add-status-button"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {showCancelReasonInput && !isOrderCancelled && (
                  <div className="add-status-section">
                    <div className="add-status-input-group">
                      <input
                        onChange={(e) => setCancelReasonValue(e.target.value)}
                        type="text"
                        placeholder="Enter cancellation reason"
                        className="new-status-input"
                        value={cancelReason}
                      />
                      <button
                        onClick={saveCancelReason}
                        className="add-status-button cancel-reason-btn"
                      >
                        Confirm Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="d-flex order-manageClientInformation">
              <div className="order-manageClientInfoLeft">
                <div className="order-clientDetailSection">
                  <div className="order-clientDetailHeading">Order ID</div>
                  <input
                    type="text"
                    placeholder="Enter Order ID"
                    className="order-clientDetailsInput"
                    value={safeOrder.orderId || ""}
                    readOnly
                  ></input>
                </div>
                <div className="order-clientDetailSection">
                  <div className="order-clientDetailHeading">Payment</div>
                  <input
                    type="text"
                    placeholder="Enter Payment"
                    className="order-clientDetailsInput"
                    value={formatIndianCurrency(totalAmount, true)}
                    readOnly
                  ></input>
                </div>

                {safeOrder?.handled_by && (
                  <div className="order-clientDetailSection">
                    <div className="order-clientDetailHeading">
                      Advance Amount
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Advance"
                      className="order-clientDetailsInput"
                      value={advanceAmount}
                      onChange={handleAdvanceChange}
                      disabled={isOrderCancelled}
                    />
                  </div>
                )}
                <div className="order-clientDetailSection">
                  <div className="order-clientDetailHeading">
                    Remaining Amount
                    <span className="tooltip-icon-wrapper">
                      <span className="info-icon">ⓘ</span>
                      <span className="tooltip-label">
                        View payment history
                      </span>

                      <div className="tooltip-content">
                        <div className="tooltip-title">Payment History</div>

                        {paymentHistory.length === 0 ? (
                          <div className="tooltip-row">No payments made</div>
                        ) : (
                          <table className="payment-table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Amount</th>
                                <th>Date & Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paymentHistory.map((p, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>₹{formatIndianCurrency(p.amount)}</td>
                                  {/* <td>{formatDateTime(p.paidAt)}</td> */}
                                  <td>{formatIndianDateTime(p.paidAt)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        <hr />

                        <div className="tooltip-summary">
                          <div>
                            <strong>Total Paid:</strong> ₹
                            {formatIndianCurrency(totalPaidAmount)}
                          </div>
                          <div>
                            <strong>Remaining:</strong> ₹
                            {formatIndianCurrency(remainingAmount)}
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>

                  <input
                    type="text"
                    className="order-clientDetailsInput"
                    value={
                      remainingAmount >= 0
                        ? formatIndianCurrency(remainingAmount, true)
                        : "₹0"
                    }
                    readOnly
                  />
                </div>

                {safeOrder?.handled_by && (
                  <button
                    className="saveAmountButton"
                    style={{
                      background: isSaving ? "#999" : "green",
                      color: "#fff",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: isSaving ? "not-allowed" : "pointer",
                    }}
                    onClick={handleSaveAmounts}
                    disabled={isOrderCancelled || isFullyPaid || isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                )}
              </div>

              <div className="order-manageClientInfoRight">
                {/* <div className="order-clientDetailSection">
                  <div className="order-clientDetailHeading">Date</div>
                  <input
                    type="text"
                    placeholder="Enter Date"
                    className="order-clientDetailsInput"
                    value={
                      safeOrder.createdAt
                        ? new Date(safeOrder.createdAt).toLocaleDateString("en-GB")
                        : ""
                    }
                    readOnly
                  ></input>
                </div> */}

                <div className="order-clientDetailSection">
                  <div className="order-clientDetailHeading">Date & Time</div>
                  <input
                    type="text"
                    placeholder="Enter Date"
                    className="order-clientDetailsInput"
                    value={
                      safeOrder.createdAt
                        ? formatIndianDateTime(safeOrder.createdAt)
                        : ""
                    }
                    readOnly
                  ></input>
                </div>
                <div className="order-clientDetailSection">
                  <div className="order-clientDetailHeading">
                    Order Taken By
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Status"
                    className="order-clientDetailsInput"
                    value={safeOrder.status || ""}
                    readOnly
                  ></input>
                </div>

                {/* show all booked dates with users list */}
                <div className="conflict-list">
                  {/* 🔵 CURRENT ORDER */}
                  {currentOrder && (
                    <div className="conflict-row current-order">
                      {/* 1️⃣ Color */}
                      <div
                        className="color-box"
                        style={{
                          backgroundColor: currentOrder.client.colorCode,
                        }}
                      />

                      {/* 2️⃣ User Info */}
                      <div className="user-info">
                        <strong>{currentOrder.client.name}</strong>
                        <div>Current Order</div>
                      </div>

                      {/* 3️⃣ Booking with tooltip */}
                      <div className="date-info">
                        <span className="tooltip-conflict">
                          ℹ️
                          <span className="tooltip-text-conflict">
                            {tooltipDates(currentOrder.bookedDates)}
                          </span>
                        </span>
                        {formatDate(currentOrder.booking.startDate)} –{" "}
                        {formatDate(currentOrder.booking.endDate)}
                      </div>
                    </div>
                  )}

                  {/* 🔴 CONFLICT ORDERS */}
                  {conflicts.map((conflict, index) => (
                    <div className="conflict-row" key={index}>
                      {/* 1️⃣ Color */}
                      <div
                        className="color-box"
                        style={{ backgroundColor: conflict.client.colorCode }}
                      />

                      {/* 2️⃣ User Info */}
                      <div className="user-info-conflict">
                        <strong>{conflict.client.name}</strong>
                        <div>{conflict.client.contact}</div>
                      </div>

                      {/* 3️⃣ Booking with tooltip */}
                      <div className="date-info">
                        <span className="tooltip-conflict">
                          ℹ️
                          <span className="tooltip-text-conflict">
                            {tooltipDates(conflict.bookedDates)}
                          </span>
                        </span>
                        {formatDate(conflict.booking.startDate)} –{" "}
                        {formatDate(conflict.booking.endDate)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* show all booked dates with users list */}
              </div>
            </div>
          </div>

          {/* Client Section */}
          <div className="order-manageClientSection">
            <div className="order-manageRightSideHeading">
              Client Information
            </div>
            <div className="d-flex order-manageClientInformation">
              <div className="order-manageClientInfoLeft">
                <div className="order-clientDetailSection">
                  <div className="order-clientDetailHeading">Client Name</div>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="order-clientDetailsInput"
                    value={safeOrder.client?.name || ""}
                    readOnly
                  ></input>
                </div>
                <div className="order-clientDetailSection">
                  <div className="order-clientDetailHeading">Client Email</div>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="order-clientDetailsInput"
                    value={safeOrder.client?.email || ""}
                    readOnly
                  ></input>
                </div>
              </div>
              <div className="order-manageClientInfoRight">
                <div className="order-clientDetailSection">
                  <div className="order-clientDetailHeading">
                    Client Contact
                  </div>
                  <input
                    type="number"
                    maxLength="10"
                    placeholder="Enter Contact"
                    className="order-clientDetailsInput"
                    value={safeOrder.client?.contact || ""}
                    readOnly
                  ></input>
                </div>
                <div className="order-clientDetailSection">
                  <div className="order-clientDetailHeading">Company Name</div>
                  <input
                    type="text"
                    placeholder="Enter Company"
                    className="order-clientDetailsInput"
                    value={safeOrder.client?.company || ""}
                    readOnly
                  ></input>
                </div>
              </div>
            </div>
          </div>

          {/* Product Section */}
          <div className="order-manageClientSection adminOrder_productSection">
            <div
              className="order-manageRightSideHeading admin-OrderTableHeading"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Product Information</span>
              {safeOrder.last_edited && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    fontStyle: "italic",
                    marginLeft: "10px",
                  }}
                >
                  Last Edited: {formatEditedDateTime(safeOrder.last_edited)}
                </span>
              )}
            </div>

            {/* Product Summary Stats */}
            <div className="product-summary-stats">
              <span className="active-products-count">
                <i className="fas fa-check-circle"></i> Active Products:{" "}
                {activeProducts.length}
              </span>
              {deletedProducts.length > 0 && (
                <span className="deleted-products-count">
                  <i className="fas fa-trash"></i> Deleted Products:{" "}
                  {deletedProducts.length}
                </span>
              )}
              <span className="total-products-count">
                <i className="fas fa-boxes"></i> Total Products:{" "}
                {safeOrder.products.length}
              </span>
            </div>

            {/* Product Tabs */}
            <div className="product-tabs">
              {safeOrder.products.map((product, index) => (
                <button
                  key={index}
                  className={`product-tab ${
                    activeProductIndex === index ? "active" : ""
                  } ${product.deleted ? "deleted-tab" : ""}`}
                  onClick={() => setActiveProductIndex(index)}
                  disabled={isOrderCancelled}
                >
                  Product {index + 1}
                  {product.deleted && (
                    <span className="tab-deleted-icon">
                      <i className="fas fa-ban"></i>
                    </span>
                  )}
                </button>
              ))}
            </div>

            <table>
              <thead>
                <tr>
                  <th>
                    <div></div>
                  </th>
                  <th>
                    <div>Product ID</div>
                  </th>
                  <th>
                    <div className="TableOrderName">Name</div>
                  </th>
                  <th>
                    <div>Status</div>
                  </th>
                  <th>
                    <div>Amount</div>
                  </th>
                  <th>
                    <div>Booked Date</div>
                  </th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {safeOrder.products.map((product, index) =>
                  renderProductRow(product, index),
                )}
              </tbody>
            </table>

            {isCalenderOpen &&
              canEditDelete &&
              !safeOrder.products[activeProductIndex]?.deleted && (
                <div className="calendar_admin">
                  <CalendarOrderDetails
                    selectedDates={selectedDates}
                    setSelectedDates={setSelectedDates}
                    generateMonth={generateMonth}
                    handleDateClick={handleDateClick}
                    resetDates={resetDates}
                    getDateSelectionClass={getDateSelectionClass}
                    goToNextMonth={goToNextMonth}
                    goToPreviousMonth={goToPreviousMonth}
                    bookedDates={bookedDates}
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    confirmedDates={confirmedDates}
                    setConfirmedDates={setConfirmedDates}
                    pricePerDay={
                      safeOrder.products[activeProductIndex]?.price || 0
                    }
                    confirmDates={confirmDates}
                    totalDays={totalDays}
                    totalPrice={totalPrice}
                    isSmallScreen={isSmallScreen}
                    closeCalender={closeCalender}
                    isValidDate={(date) => date && !isNaN(date.getTime())}
                    isPastDate={isPastDate}
                    finalConfirmDate={finalConfirmDate}
                    hasUserSelected={hasUserSelected}
                    orderId={safeOrder.orderId}
                  />
                  {error && (
                    <div className="error-messageOrderDetails">
                      <i className="fas fa-exclamation-circle"></i>
                      {error}
                    </div>
                  )}
                  {isLoading && (
                    <div className="loading-overlay">
                      <div className="spinner"></div>
                      <p>Updating dates...</p>
                    </div>
                  )}
                </div>
              )}

            <div className="admin-order-pricing">
              <div className="admin-orderContent">
                <div className="admin-orderContentLeft">Active Products</div>
                <div className="admin-orderContentRight">
                  {activeProducts.length}
                </div>
              </div>
              <div className="admin-orderContent">
                <div className="admin-orderContentLeft">Deleted Products</div>
                <div className="admin-orderContentRight">
                  {deletedProducts.length}
                </div>
              </div>
              <div className="admin-orderContent">
                <div className="admin-orderContentLeft">Total Products</div>
                <div className="admin-orderContentRight">
                  {safeOrder.products.length}
                </div>
              </div>
              <div className="admin-orderContent">
                <div className="admin-orderContentLeft">Total Amount</div>
                <div
                  className="admin-orderContentRight"
                  style={{ width: "auto" }}
                >
                  {formatIndianCurrency(totalAmount, true)}
                </div>
              </div>
            </div>
          </div>
          {/* 
{safeOrder.order_status === 'pending' && (
  <div className="confirm-order-section">
    <button 
      className="confirm-order-btn"
      onClick={() => setShowConfirmDialog(true)}
      disabled={!safeOrder.handled_by}
    >
      <i className="fas fa-check-circle"></i> Confirm Order
    </button>
    {!safeOrder.handled_by && (
      <small className="confirm-order-hint">
        Assign a handler first to confirm order
      </small>
    )}
  </div>
)}

{showConfirmDialog && (
  <div className="confirm-dialog-overlay">
    <div className="confirm-dialog">
      <h3>Confirm Order</h3>
      <p>Are you sure you want to confirm order <strong>{safeOrder.orderId}</strong>?</p>
      <p>This will:</p>
      <ul>
        <li>Change order status from Pending to Confirmed</li>
        <li>Make booked dates unavailable for others</li>
        <li>Send confirmation email to customer</li>
        <li>Cannot be undone automatically</li>
      </ul>
      
      <div className="confirm-dialog-buttons">
        <button 
          className="confirm-dialog-confirm"
          onClick={confirmOrder}
          disabled={isLoading}
        >
          {isLoading ? 'Confirming...' : 'Yes, Confirm Order'}
        </button>
        <button 
          className="confirm-dialog-cancel"
          onClick={() => setShowConfirmDialog(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)} */}

          <div className="order-confirmation-section">
            {safeOrder.order_status === "pending" && (
              <>
                <div className="order-queue-status">
                  <h4>Queue Status</h4>
                  <div className="queue-info">
                    <div className="queue-badge pending">
                      <i className="fas fa-clock"></i> PENDING CONFIRMATION
                    </div>
                    <p>
                      This order is in the queue. Dates are shown as orange to
                      other users.
                    </p>
                    <p>
                      Confirming will make dates red (unavailable) for others.
                    </p>
                  </div>
                </div>

                <div className="confirm-order-action">
                  <button
                    className="btn-confirm-order"
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={!safeOrder.handled_by}
                  >
                    <i className="fas fa-check-circle"></i> Confirm Order
                  </button>

                  {!safeOrder.handled_by && (
                    <small className="confirm-order-note">
                      Assign a handler first to confirm order
                    </small>
                  )}
                </div>
              </>
            )}

            {safeOrder.order_status === "confirmed" && (
              <div className="order-confirmation-status">
                <div className="confirmation-badge confirmed">
                  <i className="fas fa-check-circle"></i> CONFIRMED
                </div>
                {/* <p>Confirmed by: {safeOrder.confirmed_by}</p>
      <p>Confirmed on: {safeOrder.confirmed_at ? new Date(safeOrder.confirmed_at).toLocaleString('en-IN') : 'N/A'}</p>
      {safeOrder.confirmation_notes && (
        <p>Notes: {safeOrder.confirmation_notes}</p>
      )} */}
                <p>Confirmed by: {safeOrder.confirmed_by}</p>
                <p>
                  Confirmed on:{" "}
                  {safeOrder.confirmed_at
                    ? formatIndianDateTime(safeOrder.confirmed_at)
                    : "N/A"}
                </p>
                {safeOrder.confirmation_notes && (
                  <p>Notes: {safeOrder.confirmation_notes}</p>
                )}
              </div>
            )}
          </div>

          {showConfirmDialog && (
            <div className="confirm-order-dialog-overlay">
              <div className="confirm-order-dialog">
                <div className="dialog-header">
                  <h3>
                    <i className="fas fa-check-circle"></i> Confirm Order
                  </h3>
                  <button
                    className="close-dialog"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="dialog-body">
                  <div className="confirmation-warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    <p>
                      <strong>Warning:</strong> Confirming this order will:
                    </p>
                  </div>

                  <ul className="confirmation-effects">
                    <li>
                      <i className="fas fa-calendar-times"></i> Make booked
                      dates <span className="red-text">RED</span> (unavailable)
                      for others
                    </li>
                    <li>
                      <i className="fas fa-envelope"></i> Send confirmation
                      email to customer
                    </li>
                    <li>
                      <i className="fas fa-lock"></i> Lock the dates for this
                      customer
                    </li>
                    <li>
                      <i className="fas fa-sync-alt"></i> Update all pending
                      queue positions
                    </li>
                    <li>
                      <i className="fas fa-undo"></i> Cannot be automatically
                      undone
                    </li>
                  </ul>

                  <div className="order-summary">
                    <h5>Order Summary:</h5>
                    <p>
                      <strong>Order ID:</strong> {safeOrder.orderId}
                    </p>
                    <p>
                      <strong>Customer:</strong> {safeOrder.client?.name}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> ₹
                      {safeOrder.client?.totalAmount?.toLocaleString("en-IN")}
                    </p>
                    <p>
                      <strong>Dates:</strong>{" "}
                      {safeOrder.products?.length > 0
                        ? `${new Date(safeOrder.products[0].booking.startDate).toLocaleDateString("en-IN")} to ${new Date(safeOrder.products[0].booking.endDate).toLocaleDateString("en-IN")}`
                        : "N/A"}
                    </p>
                  </div>

                  <div className="confirmation-notes">
                    <label htmlFor="confirmNotes">Add Notes (Optional):</label>
                    <textarea
                      id="confirmNotes"
                      placeholder="Add any notes about this confirmation..."
                      value={confirmationNotes}
                      onChange={(e) => setConfirmationNotes(e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>

                <div className="dialog-footer">
                  <button
                    className="btn-confirm"
                    onClick={handleConfirmOrder}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Confirming...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check"></i> Confirm Order
                      </>
                    )}
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setShowConfirmDialog(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="admin-orderContent admin-totalPaidAmt">
            <div className="admin-orderContentLeft adminTotalAmt">
              Paid Amount
            </div>
            <div
              className="admin-orderContentRight adminTotalAmt"
              style={{ width: "auto" }}
            >
              {formatIndianCurrency(totalPaidAmount, true)}
            </div>
          </div>
        </>
      )}

      {/* Delete/Restore Confirmation Popup */}
      {showDeletePopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup-content">
            <div className="delete-popup-header">
              {safeOrder.products.find((p) => p._id === selectedProductId)
                ?.deleted ? (
                <>
                  <i className="fas fa-rotate-left restore-icon"></i>
                  <h3>Restore Product</h3>
                </>
              ) : (
                <>
                  <i className="fas fa-exclamation-triangle warning-icon"></i>
                  <h3>Mark Product as Deleted</h3>
                </>
              )}
            </div>

            <div className="delete-popup-body">
              {safeOrder.products.find((p) => p._id === selectedProductId)
                ?.deleted ? (
                <>
                  <p>
                    Are you sure you want to restore{" "}
                    <strong>"{deleteProductName}"</strong> in Order{" "}
                    <strong>{selectedOrderId}</strong>?
                  </p>
                  <p className="restore-warning">
                    <i className="fas fa-check-circle"></i>
                    The product will be restored and included in total
                    calculations again.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Are you sure you want to mark{" "}
                    <strong>"{deleteProductName}"</strong> as DELETED in Order{" "}
                    <strong>{selectedOrderId}</strong>?
                  </p>
                  <p className="delete-warning">
                    <i className="fas fa-exclamation-circle"></i>
                    The product will be shown with strikeout but not removed. It
                    will not be included in total calculations.
                  </p>
                </>
              )}

              <div className="affected-products">
                <p>
                  <strong>After this action:</strong>
                </p>
                <ul>
                  <li>
                    Product will be{" "}
                    {safeOrder.products.find((p) => p._id === selectedProductId)
                      ?.deleted
                      ? "restored"
                      : "marked as deleted"}
                  </li>
                  <li>Total amount will be recalculated</li>
                  <li>Email notifications will be sent</li>
                  <li>
                    Product will{" "}
                    {safeOrder.products.find((p) => p._id === selectedProductId)
                      ?.deleted
                      ? ""
                      : "NOT"}{" "}
                    be included in totals
                  </li>
                </ul>
              </div>

              <div className="action-by-section">
                <p>
                  <strong>Action will be performed by:</strong> {handlerName}
                </p>
              </div>
            </div>

            <div className="delete-popup-buttons">
              <button
                onClick={confirmDelete}
                className={
                  safeOrder.products.find((p) => p._id === selectedProductId)
                    ?.deleted
                    ? "restore-confirm-btn"
                    : "delete-confirm-btn"
                }
              >
                {safeOrder.products.find((p) => p._id === selectedProductId)
                  ?.deleted ? (
                  <>
                    <i className="fas fa-rotate-left"></i> Yes, Restore Product
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash"></i> Yes, Mark as Deleted
                  </>
                )}
              </button>

              <button onClick={cancelDelete} className="delete-cancel-btn">
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;
