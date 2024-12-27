// src/components/AddDocumentPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiFileText, FiDownload } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa'; // For displaying the confidence score
import '../theme/AddDocumentPage.css';

function AddDocumentPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const [error, setError] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [pdfLink, setPdfLink] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSources([]);
    setConfidenceScore(null);
    setPdfLink(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a file.');
      return;
    }

    setLoading(true);
    setError(null);
    setSources([]);
    setConfidenceScore(null);
    setPdfLink(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const score = Math.floor(Math.random() * 31) + 70;
      setConfidenceScore(score);

      const mockPdfLink = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      setPdfLink(mockPdfLink);

      const hardcodedSources = [
        {
          title: 'Source 1: The New York Times',
          location: 'Page 2, Line 15',
          paragraph: `As the sun sets over the rolling fields of Iowa, farmer Daniel Carter surveys his land with a mix of pride and growing concern. "It used to be predictable," Carter says, pointing to dry, cracked soil beneath his boots. "We'd get rain at the right times, and the crops would thrive. But now, it's different every year."  
          
          Across the Midwest, prolonged droughts and unpredictable rainfall patterns are wreaking havoc on agricultural communities, driving down crop yields and increasing operational costs. According to a recent study by the U.S. Department of Agriculture, average yields of corn and soybeans have declined by 12% over the past five years, with regions like Nebraska and Kansas seeing even sharper drops.  
          
          "Federal support is essential," says Mark Thompson, a climate policy analyst at the University of Michigan. "We need funding not just for immediate disaster relief, but for new technologies that will help these communities thrive despite changing conditions."`,
        },
        {
          title: 'Source 2: BBC News',
          location: 'Page 5, Line 3',
          paragraph: `In the small coastal town of Brighton, the once-bustling seafront businesses now face an uncertain future. Over the past five years, rising sea levels and increasingly severe storms have led to significant erosion along the waterfront, damaging roads, shops, and essential infrastructure.  

          "This is the third time we've had to rebuild part of the café in just two years," says Mark Evans, owner of the Seaside Café. "Every storm season, it's the same story."  

          Across the UK, SMEs in coastal regions are grappling with the financial toll of climate change. A report by the British Chamber of Commerce found that 67% of coastal SMEs experienced direct losses related to flooding or storm damage. Insurance costs have skyrocketed, and some businesses are turning to local governments for adaptive strategies like flood barriers and raised foundations.`,
        },
        {
          title: 'Source 3: CNN',
          location: 'Page 3, Line 8',
          paragraph: `When Hurricane Franklin tore through New Orleans last August, entire neighborhoods were left uninhabitable, displacing thousands of residents and dealing a heavy blow to the local economy.  

          For Maria Gonzalez, a mother of three, the storm was life-changing. "We lost everything," she says. "Our home, my job – it's all gone. We're staying in a temporary shelter now, but it's hard to see what the future holds."  

          Gonzalez's story mirrors the experiences of many across the U.S. as climate-induced natural disasters become more severe. A joint study by FEMA found that urban populations are disproportionately affected by hurricanes and floods, with economic damage exceeding $100 billion last year alone.`,
        },
        {
          title: 'Source 4: Reuters',
          location: 'Page 4, Line 22',
          paragraph: `A recent economic forecast from the International Monetary Fund warns that if left unchecked, climate change could reduce global GDP by up to 10% by 2050. Industries like agriculture, manufacturing, and tourism are particularly vulnerable.  

          In Asia, droughts and heatwaves have already begun slashing rice production. In Southern Europe, vineyards and olive groves are reporting record-low harvests.  

          "The impacts are real, and they’re happening now," says IMF lead economist Helena Li. "Aggressive investments in green technology and global cooperation are vital to counteract these economic threats."`,
        },
      ];

      setSources(hardcodedSources);
    } catch (err) {
      setError('An error occurred while processing the document.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="add-document-container">
      <button onClick={handleBack} className="back-button" aria-label="Back">
        <FiArrowLeft size={24} /> Back
      </button>
      <form onSubmit={handleSubmit} className="add-document-form">
        <div className="form-group">
          <label htmlFor="document">Select a document (PDF, DOCX):</label>
          <input
            type="file"
            id="document"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          <FiUpload size={20} /> Verify
        </button>
      </form>

      {loading && <div className="loading-indicator">Processing document...</div>}

      {error && <p className="error-message">{error}</p>}

      {confidenceScore !== null && (
        <div className="confidence-score">
          <h3>Confidence Score</h3>
          <div className="score-display">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={index < Math.round(confidenceScore / 20) ? 'star filled' : 'star'}
              />
            ))}
            <span>{confidenceScore}%</span>
          </div>
        </div>
      )}

      {sources.length > 0 && (
        <div className="sources-container">
          <h3>Detected Sources</h3>
          <ul>
            {sources.map((source, index) => (
              <li key={index}>
                <strong>{source.title}</strong> - {source.location}
                <p>{source.paragraph}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddDocumentPage;
