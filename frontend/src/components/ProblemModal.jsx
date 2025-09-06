import React, { useState, useEffect } from 'react';
import './ProblemModal.css';
import RichTextEditor from './RichTextEditor';
// import { convertPlainTextToHtml } from '../utils/noteUtils'; // File removed

// Simple utility function to replace the deleted noteUtils
const convertPlainTextToHtml = (text) => {
  if (!text) return '';
  if (text.includes('<') && text.includes('>')) return text; // Already HTML
  return text.replace(/\n/g, '<br>'); // Convert line breaks
};
import { useTheme } from '../contexts/ThemeContext';

const ProblemModal = ({ isOpen, onClose, problem, userNote, onSaveNote, onDeleteNote }) => {
  const { isDark } = useTheme();
  const [note, setNote] = useState(userNote || '');
  const [activeTab, setActiveTab] = useState('note');

  useEffect(() => {
    // Convert plain text notes to HTML for backward compatibility
    const noteContent = userNote ? convertPlainTextToHtml(userNote) : '';
    setNote(noteContent);
  }, [userNote, problem]);

  if (!isOpen) return null;

  const getCompanyLogos = (companiesString) => {
    if (!companiesString) return [];
    
    const companyMap = {
      'Amazon': { name: 'Amazon', domain: 'amazon.com' },
      'Google': { name: 'Google', domain: 'google.com' },
      'Microsoft': { name: 'Microsoft', domain: 'microsoft.com' },
      'Facebook': { name: 'Facebook', domain: 'facebook.com' },
      'Apple': { name: 'Apple', domain: 'apple.com' },
      'Netflix': { name: 'Netflix', domain: 'netflix.com' },
      'Uber': { name: 'Uber', domain: 'uber.com' },
      'Adobe': { name: 'Adobe', domain: 'adobe.com' },
      'Samsung': { name: 'Samsung', domain: 'samsung.com' },
      'Goldman Sachs': { name: 'Goldman Sachs', domain: 'goldmansachs.com' },
      'Flipkart': { name: 'Flipkart', domain: 'flipkart.com' },
      'Paytm': { name: 'Paytm', domain: 'paytm.com' },
      'Walmart': { name: 'Walmart', domain: 'walmart.com' },
      'Oracle': { name: 'Oracle', domain: 'oracle.com' },
      'IBM': { name: 'IBM', domain: 'ibm.com' },
      'Accolite': { name: 'Accolite', domain: 'accolite.com' },
      'D-E-Shaw': { name: 'D-E-Shaw', domain: 'deshaw.com' },
      'FactSet': { name: 'FactSet', domain: 'factset.com' },
      'Hike': { name: 'Hike', domain: 'hike.in' },
      'MakeMyTrip': { name: 'MakeMyTrip', domain: 'makemytrip.com' },
      'MAQ Software': { name: 'MAQ Software', domain: 'maqsoftware.com' },
      'OYO Rooms': { name: 'OYO', domain: 'oyorooms.com' },
      'Qualcomm': { name: 'Qualcomm', domain: 'qualcomm.com' },
      'Snapdeal': { name: 'Snapdeal', domain: 'snapdeal.com' },
      'VMWare': { name: 'VMware', domain: 'vmware.com' },
      'Zoho': { name: 'Zoho', domain: 'zoho.com' },
      'Intuit': { name: 'Intuit', domain: 'intuit.com' },
      'Cisco': { name: 'Cisco', domain: 'cisco.com' },
      'Morgan Stanley': { name: 'Morgan Stanley', domain: 'morganstanley.com' },
      'Visa': { name: 'Visa', domain: 'visa.com' },
      'Directi': { name: 'Directi', domain: 'directi.com' },
      'Myntra': { name: 'Myntra', domain: 'myntra.com' },
      'Ola Cabs': { name: 'Ola', domain: 'olacabs.com' },
      'PayPal': { name: 'PayPal', domain: 'paypal.com' },
      'Swiggy': { name: 'Swiggy', domain: 'swiggy.com' },
      'Media.net': { name: 'Media.net', domain: 'media.net' },
      'Salesforce': { name: 'Salesforce', domain: 'salesforce.com' },
      'Sapient': { name: 'Sapient', domain: 'sapient.com' },
      'Pubmatic': { name: 'PubMatic', domain: 'pubmatic.com' },
      'Quikr': { name: 'Quikr', domain: 'quikr.com' },
      'Yatra.com': { name: 'Yatra', domain: 'yatra.com' },
      'Belzabar': { name: 'Belzabar', domain: 'belzabar.com' },
      'Brocade': { name: 'Brocade', domain: 'brocade.com' },
      'OATS Systems': { name: 'OATS Systems', domain: 'oatssystems.com' },
      'Synopsys': { name: 'Synopsys', domain: 'synopsys.com' },
      'Lybrate': { name: 'Lybrate', domain: 'lybrate.com' },
      'Mahindra Comviva': { name: 'Mahindra Comviva', domain: 'mahindracomviva.com' },
      'SAP Labs': { name: 'SAP', domain: 'sap.com' },
      'Veritas': { name: 'Veritas', domain: 'veritas.com' },
      'Kritikal Solutions': { name: 'Kritikal Solutions', domain: 'kritikalsolutions.com' },
      'Monotype Solutions': { name: 'Monotype', domain: 'monotype.com' },
      'Epic Systems': { name: 'Epic Systems', domain: 'epic.com' },
      'Citicorp': { name: 'Citigroup', domain: 'citigroup.com' },
      'CouponDunia': { name: 'CouponDunia', domain: 'coupondunia.in' },
      'FreeCharge': { name: 'FreeCharge', domain: 'freecharge.in' },
      'Cadence India': { name: 'Cadence', domain: 'cadence.com' },
      'Expedia': { name: 'Expedia', domain: 'expedia.com' },
      'Linkedin': { name: 'LinkedIn', domain: 'linkedin.com' },
      'InMobi': { name: 'InMobi', domain: 'inmobi.com' },
      'Yahoo': { name: 'Yahoo', domain: 'yahoo.com' },
      'Twitter': { name: 'Twitter', domain: 'twitter.com' },
      'Amdocs': { name: 'Amdocs', domain: 'amdocs.com' },
      'Barclays': { name: 'Barclays', domain: 'barclays.com' },
      'HSBC': { name: 'HSBC', domain: 'hsbc.com' },
      'Josh Technology Group': { name: 'Josh Technology', domain: 'joshtechnologygroup.com' },
      'Sap labs': { name: 'SAP', domain: 'sap.com' },
      'DE Shaw India': { name: 'D. E. Shaw', domain: 'deshaw.com' },
      'Payu': { name: 'PayU', domain: 'payu.in' },
      'Drishti-Soft': { name: 'Drishti-Soft', domain: 'drishti-soft.com' },
      'Trilogy': { name: 'Trilogy', domain: 'trilogy.com' },
      '24*7 Innovation Labs': { name: '24*7 Innovation Labs', domain: '247-inc.com' },
      'Atlassian': { name: 'Atlassian', domain: 'atlassian.com' },
      'MaQ Software': { name: 'MAQ Software', domain: 'maqsoftware.com' },
      'Vmware inc': { name: 'VMware', domain: 'vmware.com' },
      'Times Internet': { name: 'Times Internet', domain: 'timesinternet.in' },
      'Codenation': { name: 'CodeNation', domain: 'codenation.co.in' },
      'Infosys': { name: 'Infosys', domain: 'infosys.com' },
      'Moonfrog Labs': { name: 'Moonfrog Labs', domain: 'moonfrog.com' },
      'Housing.com': { name: 'Housing.com', domain: 'housing.com' },
      'Oxigen Wallet': { name: 'Oxigen Wallet', domain: 'oxigenwallet.com' },
      'BankBazaar': { name: 'BankBazaar', domain: 'bankbazaar.com' },
      'Juniper Networks': { name: 'Juniper Networks', domain: 'juniper.net' },
      'Unisys': { name: 'Unisys', domain: 'unisys.com' },
      'Nearbuy': { name: 'Nearbuy', domain: 'nearbuy.com' },
      'Opera': { name: 'Opera', domain: 'opera.com' },
      'Philips': { name: 'Philips', domain: 'philips.com' },
      'Service Now': { name: 'ServiceNow', domain: 'servicenow.com' },
      'Webarch Club': { name: 'Webarch Club', domain: 'webarchclub.com' },
      'Traveloca': { name: 'Traveloka', domain: 'traveloka.com' },
      'Kuliza': { name: 'Kuliza', domain: 'kuliza.com' },
      'Razorpay': { name: 'Razorpay', domain: 'razorpay.com' },
      'Payload': { name: 'Payload', domain: 'payload.co' },
      'Lenskart': { name: 'Lenskart', domain: 'lenskart.com' },
      'Sharechat': { name: 'ShareChat', domain: 'sharechat.com' },
      'Alibaba': { name: 'Alibaba', domain: 'alibaba.com' },
      'eBay': { name: 'eBay', domain: 'ebay.com' },
      'Paypal': { name: 'PayPal', domain: 'paypal.com' },
      'Maccafe': { name: 'Maccafe', domain: 'maccafe.com' },
      'Nagarro': { name: 'Nagarro', domain: 'nagarro.com' },
      'TCS': { name: 'TCS', domain: 'tcs.com' },
      'EPAM Systems': { name: 'EPAM', domain: 'epam.com' },
      'Streamoid Technologies': { name: 'Streamoid', domain: 'streamoid.com' },
      'Dunzo': { name: 'Dunzo', domain: 'dunzo.com' },
      'Grofers': { name: 'Grofers', domain: 'grofers.com' },
      'Societe Generale': { name: 'Societe Generale', domain: 'societegenerale.com' },
      'Sprinklr': { name: 'Sprinklr', domain: 'sprinklr.com' },
      'GeekyAnts': { name: 'GeekyAnts', domain: 'geekyants.com' },
      'Delhivery': { name: 'Delhivery', domain: 'delhivery.com' },
      'Fidelity International': { name: 'Fidelity', domain: 'fidelity.com' },
      'Siemens': { name: 'Siemens', domain: 'siemens.com' },
      'Arrays Dynamic Programming': { name: 'Arrays DP', domain: 'example.com' }
    };
    
    const companies = companiesString.split(/[+,\s]+/).filter(c => c.trim());
    return companies.slice(0, 10).map(company => {
      const cleanCompany = company.trim().replace(/\s+/g, ' ');
      return companyMap[cleanCompany] || { name: cleanCompany, domain: `${cleanCompany.toLowerCase().replace(/[\s-]+/g, '')}.com` };
    });
  };

  const handleSave = () => {
    if (note.trim()) {
      onSaveNote(problem.id, note);
    } else {
      onDeleteNote(problem.id);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${isDark ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
            </svg>
            {problem.title}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        
        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'note' ? 'active' : ''}`}
            onClick={() => setActiveTab('note')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            Note
          </button>
          <button 
            className={`tab-button ${activeTab === 'links' ? 'active' : ''}`}
            onClick={() => setActiveTab('links')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"/>
            </svg>
            Links
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'note' && (
            <div className="note-section">
              <RichTextEditor
                value={note}
                onChange={setNote}
                placeholder="Add your DSA notes here... Use the toolbar for formatting!"
              />
              <div className="note-actions">
                <button className="btn-save" onClick={handleSave}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"/>
                  </svg>
                  Save Note
                </button>
                {userNote && (
                  <button 
                    className="btn-delete" 
                    onClick={() => {
                      onDeleteNote(problem.id);
                      setNote('');
                      onClose();
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                    </svg>
                    Delete Note
                  </button>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'links' && (
            <div className="links-section">
              {(problem.leetcode || problem.link) && (
                <div className="link-item">
                  <span className="link-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}>
                      <path d="M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M8,7.5A1.5,1.5 0 0,0 6.5,9A1.5,1.5 0 0,0 8,10.5A1.5,1.5 0 0,0 9.5,9A1.5,1.5 0 0,0 8,7.5M15.5,7.5A1.5,1.5 0 0,0 14,9A1.5,1.5 0 0,0 15.5,10.5A1.5,1.5 0 0,0 17,9A1.5,1.5 0 0,0 15.5,7.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z"/>
                    </svg>
                    LeetCode:
                  </span>
                  <a href={problem.leetcode || problem.link} target="_blank" rel="noopener noreferrer" className="link-url">
                    {problem.leetcode || problem.link}
                  </a>
                </div>
              )}
              {problem.gfg && (
                <div className="link-item">
                  <span className="link-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}>
                      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                    </svg>
                    GeeksforGeeks:
                  </span>
                  <a href={problem.gfg} target="_blank" rel="noopener noreferrer" className="link-url">
                    {problem.gfg}
                  </a>
                </div>
              )}
              {(problem.youtube || problem.video) && (
                <div className="link-item">
                  <span className="link-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}>
                      <path d="M10,16.5V7.5L16,12M20,4.4C19.4,4.2 15.7,4 12,4C8.3,4 4.6,4.19 4,4.38C2.44,4.9 2,8.4 2,12C2,15.59 2.44,19.1 4,19.61C4.6,19.81 8.3,20 12,20C15.7,20 19.4,19.81 20,19.61C21.56,19.1 22,15.59 22,12C22,8.4 21.56,4.91 20,4.4Z"/>
                    </svg>
                    Video Solution:
                  </span>
                  <a href={problem.youtube || problem.video} target="_blank" rel="noopener noreferrer" className="link-url">
                    {problem.youtube || problem.video}
                  </a>
                </div>
              )}
              <div className="problem-info">
                <div className="info-item">
                  <span className="info-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}>
                      <path d="M12,2L13.09,8.26L22,9L14,14L17,23L12,18L7,23L10,14L2,9L10.91,8.26L12,2Z"/>
                    </svg>
                    Difficulty:
                  </span>
                  <span className={`difficulty-tag ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </div>
                {problem.companies && (
                  <div className="info-item">
                    <span className="info-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}>
                        <path d="M12,7V3H2V21H22V7H12M6,19H4V17H6V19M6,15H4V13H6V15M6,11H4V9H6V11M6,7H4V5H6V7M10,19H8V17H10V19M10,15H8V13H10V15M10,11H8V9H10V11M10,7H8V5H10V7M20,19H12V17H20V19M20,15H12V13H20V15M20,11H12V9H20V11Z"/>
                      </svg>
                      Companies:
                    </span>
                    <span className="companies-text">{Array.isArray(problem.companies) ? problem.companies.join(', ') : problem.companies}</span>
                    <div className="company-logos">
                      {getCompanyLogos(Array.isArray(problem.companies) ? problem.companies.join(', ') : problem.companies || '').map((company, idx) => (
                        <img 
                          key={idx}
                          src={`https://logo.clearbit.com/${company.domain}`}
                          alt={company.name}
                          className="company-logo"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {problem.hint && (
                  <div className="info-item">
                    <span className="info-label">Hint:</span>
                    <span className="hint-text">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}>
                        <path d="M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,10.68 7.8,12.17 9,13.09V16H15V13.09C16.2,12.17 17,10.68 17,9A5,5 0 0,0 12,4Z"/>
                      </svg>
                      {problem.hint}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemModal;