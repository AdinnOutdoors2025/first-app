
import React, { useEffect, useState } from "react";
import { gsap } from "gsap"; // Import GSAP
import ScrollTrigger from "gsap/ScrollTrigger"; // Import ScrollTrigger from GSAP
import "odometer/themes/odometer-theme-default.css"; // Odometer styles

// Register GSAP's ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function OdometerComponent() {
  const [counters, setCounters] = useState({
    completedProjects: 0,
    ongoingProjects: 0,
    expertWorkers: 0,
    satisfiedCustomers: 0,
  });

  const [showPlus, setShowPlus] = useState(false); // To toggle the `+` symbol dynamically

  useEffect(() => {
    ScrollTrigger.create({
      trigger: ".achieved-inside",
      start: "top bottom",
      onEnter: () => {
        setCounters({
          completedProjects: 6500,
          ongoingProjects: 100,
          expertWorkers: 250,
          satisfiedCustomers: 7000,
        });
      },
      onLeaveBack: () => {
        setCounters({
          completedProjects: 0,
          ongoingProjects: 0,
          expertWorkers: 0,
          satisfiedCustomers: 0,
        });
        setShowPlus(false); // Hide the `+` when leaving the viewport
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (typeof window.Odometer !== "undefined") {
      const odometers = {
        completedProjects: new window.Odometer({
          el: document.getElementById("completedProjects"),
          value: counters.completedProjects,
          format: "d",
          duration: 2000, // Odometer animation duration in ms
        }),
        ongoingProjects: new window.Odometer({
          el: document.getElementById("ongoingProjects"),
          value: counters.ongoingProjects,
          format: "d",
          duration: 2000,
        }),
        expertWorkers: new window.Odometer({
          el: document.getElementById("expertWorkers"),
          value: counters.expertWorkers,
          format: "d",
          duration: 2000,
        }),
        satisfiedCustomers: new window.Odometer({
          el: document.getElementById("satisfiedCustomers"),
          value: counters.satisfiedCustomers,
          format: "d",
          duration: 2000,
        }),
      };

      // Trigger the update for all odometers and wait for completion
      Object.keys(odometers).forEach((key) => {
        odometers[key].update(counters[key]);
      });

      // Show the `+` symbol after the animation
      const animationTimeout = setTimeout(() => {
        setShowPlus(true);
      }, 2000); // Match this duration with Odometer's animation time

      return () => clearTimeout(animationTimeout);
    }
  }, [counters]);

  return (
    <div>
      {/* What we Achieved section */}
      <div className="achieved container-fluid">
        <h1 className="heading achieved-heading">
          What we <span className="highlight">achieved</span>
        </h1>
        <div className="achieved-content container">
          <p className="achieved-para">
            "At Adinn Outdoor, our journey is marked by significant milestones that underscore our dedication and hard work. Each accomplishment is a testament to our commitment to excellence in outdoor advertising."
          </p>

          <div className="achieved-inside">
            {/* Inside content */}
            <div className="inside-content">
              <div id="completedProjects" className="inside-num" style={{display:'flex'}}>
              {showPlus && counters.completedProjects > 0 && (
              <span className="plus-symbol">+</span>
            )}
              </div>
              <div className="inside-para">Completed Projects</div>
            </div>


            <div className="inside-content">
              <div id="ongoingProjects" className="inside-num" style={{display:'flex'}}>
              
              {showPlus && counters.ongoingProjects > 0 && (
              <span className="plus-symbol">+</span>
            )}            
          </div>
              <div className="inside-para">Ongoing Projects</div>
            </div>


            <div className="inside-content">
              <div id="expertWorkers" className="inside-num" >
             000
              </div>
              <div className="inside-para">Expert Workers</div>
            </div>


            <div className="inside-content">
              <div id="satisfiedCustomers" className="inside-num" style={{display:'flex'}}>
              {showPlus && counters.satisfiedCustomers > 0 && (
              <span className="plus-symbol">+</span>
            )}
              </div>
              <div className="inside-para">Satisfied Customers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OdometerComponent;
