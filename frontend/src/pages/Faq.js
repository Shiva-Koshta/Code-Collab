// Faq.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import faqData from './faqdata';
import '../index';
import { useNavigate } from 'react-router-dom';
import './Faq.css'; // Import a new CSS file for better styling management

const Faq = () => {
  const [openCategory, setOpenCategory] = useState(null);

  const handleCategoryToggle = (categoryIndex) => {
    setOpenCategory((prevIndex) => (prevIndex === categoryIndex ? null : categoryIndex));
  };

  const navigate = useNavigate();

  return (
    <div>
      {/* Blue banner with "FAQ" */}
      <div className="banner">
        <HomeOutlinedIcon
          className="text-slate-300 cursor-pointer ml-8"
          fontSize="large"
          onClick={() => navigate("/")}
        />
        <p className='ml-8 text-3xl madimi-one-regular'>FAQ</p>
      </div>

      {/* FAQ content */}
      <div className="faq-content">
        <div className="faq-container">
          {faqData.map((category, index) => (
            <div
              key={index}
              className={`category-container ${openCategory === index ? 'active' : ''}`}
              onClick={() => handleCategoryToggle(index)}
            >
              <div className="category-title">
                {category.category}{' '}
                <FontAwesomeIcon icon={openCategory === index ? faChevronUp : faChevronDown} />
              </div>
              {openCategory === index && (
                <div className="questions-container">
                  {category.questions.map((question, subIndex) => (
                    <div key={subIndex} className="question-container">
                      <h5 className="question">{question.question}</h5>
                      <p className="answer">{question.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;


.banner {
  background-color: #136163;
  padding: 10px;
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  font-family: Arial, sans-serif;
  box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
}

.faq-content {
  background-color: #140314;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.faq-container {
  width: 80%;
  font-family: Helvetica, sans-serif;
}

.category-container {
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
  box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.category-container.active {
  background-color: #136163;
}

.category-title {
  background-color: #136163;
  color: white;
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.3s, color 0.3s;
}

.questions-container {
  color: white;
  background-color: black;
  padding: 10px;
  font-size: 16px;
  line-height: 1.6;
  box-shadow: 0px 0px 5px 0px rgba(255, 255, 255, 0.1);
}

.question-container {
  margin-bottom: 16px;
}

.question {
  color: white;
  margin-bottom: 8px;
  font-size: 18px;
}

.answer {
  color: #136163;
}
