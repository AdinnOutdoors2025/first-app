
import React, { useState, useEffect } from "react";
import "../components/B20CalenderMain.css";
import { formatIndianCurrency } from '../components/FORMATED_AMOUNT';
import axios from "axios";
import { baseUrl } from "./BASE_URL";



const CalendarOrderDetails = ({ isSmallScreen, closeCalender, selectedDates, generateMonth, handleDateClick, resetDates, getDateSelectionClass, goToNextMonth, goToPreviousMonth, bookedDates, currentMonth, confirmedDates, setConfirmedDates, pricePerDay, confirmDates, totalPrice, isPastDate, finalConfirmDate, orderId }) => {

  const [conflicts, setConflicts] = useState(null);

  const fetchOrderConflicts = async (orderId) => {
    try {
      const res = await axios.get(
        `${baseUrl}/checkOrderConflict/${orderId}`
      );
      return res.data;
    } catch (err) {
      console.error("Error fetching conflicts", err);
      return null;
    }
  };

  useEffect(() => {
    if (!orderId) return;

    const loadConflicts = async () => {
      const data = await fetchOrderConflicts(orderId);
      if (data?.success) {
        setConflicts(data); // ✅ same name as requested
      }
    };

    loadConflicts();
  }, [orderId]);




  const confirmedSet = React.useMemo(() => {
    return new Set(finalConfirmDate?.confirmed || []);
  }, [finalConfirmDate]);

  const isConfirmedDate = (date) => {
    if (!date) return false;
    const key = getDateKey(date);
    return confirmedSet.has(key);
  };



  ////////////////////////////////////////////////////////////////////////////////////////
  const conflictDotMap = React.useMemo(() => {
    const map = {};
    if (!conflicts) return map;

    const pushDate = (dateStr, payload) => {
      const d = new Date(dateStr);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!map[key]) map[key] = [];
      map[key].push(payload);
    };


    /* ---------- CURRENT ORDER ---------- */
    if (conflicts.currentOrder) {
      const { client, orderId, booking, bookedDates } = conflicts.currentOrder;

      bookedDates.forEach((d) =>
        pushDate(d, {
          type: "current",
          name: client.name || "Current Order",
          color: client.colorCode || "#000", // fallback color
          orderId,
          phone: client.contact || "--",
          start: booking.startDate,
          end: booking.endDate,
        })
      );
    }

    /* ---------- CONFLICT ORDERS ---------- */
    if (Array.isArray(conflicts.conflicts)) {
      conflicts.conflicts.forEach((order) => {
        const { client, orderId, booking, bookedDates } = order;

        bookedDates.forEach((d) =>
          pushDate(d, {
            type: "conflict",
            name: client.name,
            color: client.colorCode,
            orderId,
            phone: client.contact,
            start: booking.startDate,
            end: booking.endDate,
          })
        );
      });
    }

    return map;
  }, [conflicts]);


  const PieRing = ({ date, conflicts }) => {
    const size = 34;
    const radius = 14;
    const strokeWidth = 6;
    const circumference = 2 * Math.PI * radius;
    const slice = circumference / conflicts.length;

    return (
      <svg width={size} height={size} className="pie-ring">
        {conflicts.map((c, i) => {
          const dashOffset = i * slice;

          return (
            <circle
              key={`${c.orderId}-${c.type}-${date.toISOString()}`}
              r={radius}
              cx={size / 2}
              cy={size / 2}
              fill="transparent"
              stroke={c.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${slice} ${circumference}`}
              strokeDashoffset={-dashOffset}
            >
              <title key={`${c.orderId}-${date.toISOString()}`}>
                {`${c.name}
Order: ${c.orderId}
Phone: ${c.phone}
From: ${new Date(c.start).toDateString()}
To: ${new Date(c.end).toDateString()}`}
              </title>
            </circle>
          );
        })}

        {/* Center Date */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="10"
          fill={isConfirmedDate(date) ? "red" : "#000"}
        >
          {date.getDate()}
        </text>
      </svg>
    );
  };


  const getDateKey = (date) => {
    if (!date) return null;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  // CALENDER SECTION 
  // Inside the map function for each offset
  const isPastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0) < new Date();

  return (
    <div>
      <div className="calendar-container" style={{ marginBottom: '15px', width: '100%' }}>
        <div className="calendar-header">
          {isSmallScreen ? (
            <>
              <div className="nav-button" onClick={goToPreviousMonth}>
                <i className="fa-solid fa-arrow-left left-arr"></i>
              </div>
              <span className="month-year">
                {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
              </span>
              <div className="nav-button" onClick={goToNextMonth}>
                <i className="fa-solid fa-arrow-right right-arr"></i>
              </div>
            </>
          ) : (
            <>
              <div className="left-calender">
                <div className="nav-button" onClick={goToPreviousMonth}>
                  <i className="fa-solid fa-arrow-left left-arr"></i>
                </div>
                <span className="month-year">
                  {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
                </span>
              </div>
              <div className="right-calender">
                {/* <span className="month-year">
                {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).toLocaleString("default", {
                  month: "long",
                })}{" "}
                {currentMonth.getFullYear()}
              </span> */}

                {/* {(() => {
                  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
                  return (
                    <span className="month-year">
                      {nextMonthDate.toLocaleString("default", { month: "long" })} {nextMonthDate.getFullYear()}
                    </span>
                  );
                })()} */}

                <span className="month-year">
                  {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).toLocaleString("default", {
                    month: "long",
                  })}{" "}
                  {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).getFullYear()}
                </span>


                <div className="nav-button" onClick={goToNextMonth}>
                  <i className="fa-solid fa-arrow-right right-arr"></i>
                </div>
              </div>
            </>
          )}
          <button className="close-xmark" onClick={closeCalender}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>

        {/* CALENDER BODY  */}

        {/* Calendar Body */}
        <div className={`calendar-body ${isSmallScreen ? "small-screen-calendar" : "large-screen-calendar"}`}>
          {isSmallScreen ? (
            <>
              {/* One Calendar Grid */}
              <div className={`calendar-grid ${isPastMonth ? 'past-month' : ''}`}>
                <div className="day">Sun</div>
                <div className="day">Mon</div>
                <div className="day">Tue</div>
                <div className="day">Wed</div>
                <div className="day">Thu</div>
                <div className="day">Fri</div>
                <div className="day">Sat</div>
                {generateMonth(currentMonth).map((date, index) => {

                  return (
                    <div
                      key={index}
                      className={
                        `date 
       
        ${date ? (bookedDates.some(d =>
                          d.getUTCFullYear() === date.getUTCFullYear() &&
                          d.getUTCMonth() === date.getUTCMonth() &&
                          d.getUTCDate() === date.getUTCDate()
                        ) ? 'booked' : getDateSelectionClass(date)

                        ) : ''}
        ${isPastDate ? 'past' : ''}
      `}
                      onClick={() => !isPastDate && handleDateClick(date)}
                      style={{ pointerEvents: bookedDates.some((d) => d.getTime() === date?.getTime()) ? "none" : "auto" }}
                    >
                      {date && (
                        <>
                          {conflictDotMap[getDateKey(date)] ? (
                            <PieRing
                              date={date}
                              conflicts={conflictDotMap[getDateKey(date)]}
                            />
                          ) : (
                            <span
                              style={{
                                color: isConfirmedDate(date) ? "red" : undefined,
                                fontWeight: isConfirmedDate(date) ? "600" : undefined,
                              }}
                            >
                              {date.getDate()}
                            </span>



                          )}
                        </>
                      )}


                    </div>
                  )
                })}
              </div>

              {/* Legend Section */}
              <div className="calendar-legend">

                <div className="calendar-legend-responsive">
                  <div className=" calendar-legend-responsive-content1">
                    <i className="fa-solid fa-circle dot-booked"></i>
                    <span> Booked Dates</span> <br />
                    <i className="fa-solid fa-circle dot-available"></i>
                    <span> Available Dates</span> <br />

                  </div>
                  <div className="calendar-legend-responsive-content2">

                    <span>
                      Start Date: <span style={{ color: 'red' }}>
                        {selectedDates.start?.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          timeZone: 'UTC'
                        }) || "--"}
                      </span>
                    </span>

                    <span>
                      End Date: <span style={{ color: 'red' }}>
                        {selectedDates.end?.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          timeZone: 'UTC'
                        }) || "--"}
                      </span>
                    </span>
                    <br></br>
                    {/* Total Amount Calculation */}
                    <span>
                      {/* Amount: <span style={{ color: 'red' }}>₹{totalPrice.toLocaleString()}</span> */}
                      Amount: <span style={{ color: 'red' }}>{formatIndianCurrency(totalPrice, true)}</span>
                    </span>
                    <br />
                  </div>
                </div>
                <div className="calenderLegendButtons">
                  <div>   <div className="confirm-button" onClick={confirmDates}>Confirm</div> </div>
                  <div> <div className="reset-button" onClick={resetDates}>Reset Date</div></div></div>
              </div>
            </>
          ) : (
            // Large Screen Layout: Legend + 2 Months side by side
            <div className="large-calendar-layout">

              {/* Legend Section */}


              <div className="calendar-legend">
                <i className="fa-solid fa-circle dot-booked"></i>
                <span> Booked Dates</span> <br />
                <i className="fa-solid fa-circle dot-available"></i>
                <span> Available Dates</span> <br />
                <br />
                {/* <span> Start Date: {selectedDates.start ? selectedDates.start.getMonthYear() : "--"}</span> <br /> */}
                <span>
                  Start Date: <span style={{ color: 'red' }}>
                    {selectedDates.start
                      ? `${selectedDates.start.toLocaleString("en-US", { month: "short" })} ${selectedDates.start.getDate()}`
                      : "--"}
                  </span>
                </span> <br></br>

                <span>
                  End Date: <span style={{ color: 'red' }}>
                    {selectedDates.end
                      ? `${selectedDates.end.toLocaleString("en-US", { month: "short" })} ${selectedDates.end.getDate()}`
                      : "--"}
                  </span>
                </span> <br></br>

                <span>
                  {/* Amount: <span style={{ color: 'red' }}>₹{totalPrice.toLocaleString()}</span> */}
                  Amount: <span style={{ color: 'red' }}>{formatIndianCurrency(totalPrice, true)}</span>

                </span>
                <br />


                {/* <span> End Date: {selectedDates.end ? selectedDates.end.toDateString() : "--"}</span> <br /> */}
                <br />
                <div className="confirm-button" onClick={confirmDates}>Confirm</div>
                <div className="reset-button" onClick={resetDates}>
                  Reset Date
                </div>
              </div>

              {/* Calendar Grid for 2 months */}
              {[0, 1].map((offset) => {
                const monthToRender = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset);
                return (
                  <div key={offset} className="calendar-grid">
                    <div className="day">Sun</div>
                    <div className="day">Mon</div>
                    <div className="day">Tue</div>
                    <div className="day">Wed</div>
                    <div className="day">Thu</div>
                    <div className="day">Fri</div>
                    <div className="day">Sat</div>
                    {/* <div className="day">Sun</div> */}
                    {generateMonth(monthToRender).map((date, index) => (
                      <div
                        key={index}
                        className={`date ${bookedDates.some((d) => d.getTime() === date?.getTime())
                          ? "booked"
                          : getDateSelectionClass(date)
                          }`}

                        onClick={() => handleDateClick(date)}
                        style={{ pointerEvents: bookedDates.some((d) => d.getTime() === date?.getTime()) ? "none" : "auto" }}
                      >

                        {date && (
                          <>
                            {conflictDotMap[getDateKey(date)] ? (
                              <PieRing
                                date={date}
                                conflicts={conflictDotMap[getDateKey(date)]}
                              />
                            ) : (
                              <span
                                style={{
                                  color: isConfirmedDate(date) ? "red" : undefined,
                                  fontWeight: isConfirmedDate(date) ? "600" : undefined,
                                }}
                              >
                                {date.getDate()}
                              </span>


                            )}
                          </>
                        )}


                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

          )}
        </div>
      </div>
      {/* <button className="calendarSaveBtn">Save</button> */}
    </div>
  );
};

export default CalendarOrderDetails;