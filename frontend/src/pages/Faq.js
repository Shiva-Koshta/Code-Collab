import React, { useState } from 'react';
import '../styles/faqPage.css'; // Assume you create faqPage.css for styling
import { useNavigate } from 'react-router-dom';
import faqData from './faqdata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Toaster } from 'react-hot-toast';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

const FaqPage = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const navigate = useNavigate();

  const handleCategoryToggle = (categoryIndex) => {
    setOpenCategory((prevIndex) => (prevIndex === categoryIndex ? null : categoryIndex));
  };

  return (
    <>
      <div className="faq-container" style={{ backgroundColor: '#1c1e29' }}>
        <div className="inner-container"><div
          className='flex justify-start gap-5 border-2 border-gray-600'
          style={{
            backgroundColor: '#111',
            padding: '10px',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'left',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          <HomeOutlinedIcon
            className='text-slate-300 cursor-pointer ml-8'
            fontSize='large'
            onClick={() => navigate('/')}
          />
        </div>
          <h1 className="text-center text-red-300 font-bold text-5xl satisfy-regular" style={{ margin: '20px' }} ><u>FAQ</u></h1>
          <div className="faq-content">
            {faqData.map((category, index) => (
              <div key={index} className="faq-category">
                <h2 className="category-title text-red-300 font-bold text-5xl satisfy-regular">{category.category}</h2>
                {category.questions.map((question, subIndex) => (
                  <div key={subIndex} className="faq-question">
                    <div
                      onClick={() => handleCategoryToggle(index)}
                      className="question-header cursor-pointer text-white text-lg font-bold mt-2"
                      style={{ backgroundColor: openCategory === index ? '#111' : 'black', borderRadius: '5px' }}
                    >
                      {question.question}
                      <FontAwesomeIcon icon={openCategory === index ? faChevronUp : faChevronDown} />
                    </div>
                    {openCategory === index && (
                      <p className="answer text-white mt-2 p-2 bg-black rounded-md">{question.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqPage;
