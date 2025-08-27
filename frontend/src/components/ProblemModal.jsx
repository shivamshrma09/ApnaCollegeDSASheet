import React, { useState, useEffect } from 'react';
import './ProblemModal.css';

const ProblemModal = ({ isOpen, onClose, problem, userNote, onSaveNote, onDeleteNote }) => {
  const [note, setNote] = useState(userNote || '');
  const [activeTab, setActiveTab] = useState('note');

  useEffect(() => {
    setNote(userNote || '');
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{problem.title}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'note' ? 'active' : ''}`}
            onClick={() => setActiveTab('note')}
          >
            📝 Note
          </button>
          <button 
            className={`tab-button ${activeTab === 'links' ? 'active' : ''}`}
            onClick={() => setActiveTab('links')}
          >
            🔗 Links
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'note' && (
            <div className="note-section">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your notes here..."
                className="note-textarea"
                rows={8}
              />
              <div className="note-actions">
                <button className="btn-save" onClick={handleSave}>
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
                    Delete Note
                  </button>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'links' && (
            <div className="links-section">
              <div className="link-item">
                <span className="link-label">Practice:</span>
                <a href={problem.link} target="_blank" rel="noopener noreferrer" className="link-url">
                  {problem.link}
                </a>
              </div>
              <div className="link-item">
                <span className="link-label">Video Solution:</span>
                <a href={problem.video} target="_blank" rel="noopener noreferrer" className="link-url">
                  {problem.video}
                </a>
              </div>
              <div className="problem-info">
                <div className="info-item">
                  <span className="info-label">Difficulty:</span>
                  <span className={`difficulty-tag ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Companies:</span>
                  <span className="companies-text">{problem.companies}</span>
                  <div className="company-logos">
                    {getCompanyLogos(problem.companies).map((company, idx) => (
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
                {problem.hint && (
                  <div className="info-item">
                    <span className="info-label">Hint:</span>
                    <span className="hint-text">💡 {problem.hint}</span>
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