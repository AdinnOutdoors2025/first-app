
import React from 'react';
import { privacyPolicyData } from '../data/privacyPolicyData';
import './PrivacyPolicy.css';
import FooterMain from './A1FOOTER';

const PrivacyPolicy = () => {
  const { headerInfo, sections } = privacyPolicyData;

  return (
    <> 
      <div className="privacy-policy-container">
     
        <header className="policy-header">
          <h1>Privacy Policy - Client App</h1>
        </header>

        <table className="policy-info-table">
          <tbody>
            <tr>
              <td className="label">App</td>
              <td className="value">{headerInfo.appName}</td>
            </tr>
            <tr>
              <td className="label">Policy type</td>
              <td className="value">{headerInfo.policyType}</td>
            </tr>
            <tr>
              <td className="label">Effective date</td>
              <td className="value">{headerInfo.effectiveDate}</td>
            </tr>
            <tr>
              <td className="label">Company</td>
              <td className="value">{headerInfo.companyName}</td>
            </tr>
            <tr>
              <td className="label">Address</td>
              <td className="value">{headerInfo.address}</td>
            </tr>
          </tbody>
        </table>

        {sections.map((section, index) => (
          <section key={section.id || index} className="policy-section">
            <h2>{section.title}</h2>
            {section.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </section>
        ))}

      </div>

    
      <FooterMain />
    </>
  );
};

export default PrivacyPolicy;