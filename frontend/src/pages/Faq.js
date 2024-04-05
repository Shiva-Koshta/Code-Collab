// Faq.js
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import faqData from './faqdata'
import '../index'
import { useNavigate } from 'react-router-dom'

const Faq = () => {
  const [openCategory, setOpenCategory] = useState(null)

  const handleCategoryToggle = (categoryIndex) => {
    setOpenCategory((prevIndex) => (prevIndex === categoryIndex ? null : categoryIndex))
  }

  const navigate = useNavigate()
  return (
    <div>
      {/* Blue banner with "FAQ" */}
      <div className='flex justify-start gap-5' style={{ backgroundColor: '#1c1e29', padding: '10px', color: 'white', fontSize: '24px', fontWeight: 'bold', textAlign: 'left', fontFamily: 'Arial, sans-serif', boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.3)' }}>
        <HomeOutlinedIcon
          className='text-slate-300 cursor-pointer ml-8'
          fontSize='large'
          onClick={() => navigate('/')}
        />
        <p className='ml-8  text-red-300 font-bold text-5xl madimi-one-regular'>FAQ</p>
      </div>

      {/* FAQ content */}
      <div style={{ backgroundColor: '#1c1e29', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '80%', fontFamily: 'Helvetica, sans-serif' }}>
          {faqData.map((category, index) => (
            <div
              key={index}
              style={{
                marginBottom: '20px',
                borderRadius: '10px',
                overflow: 'hidden',
                transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s', // Add smooth transitions
                boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.5)' // Add box shadow
              }}
            >
              <div
                onClick={() => handleCategoryToggle(index)}
                style={{
                  backgroundColor: openCategory === index ? '#1c1e29' : 'black',
                  color: openCategory === index ? '#FCA5A5' : '#FCA5A5',
                  padding: '10px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between', // Align icon to the right
                  transition: 'background-color 0.3s, color 0.3s' // Add smooth transitions
                }}
              >
                {category.category}{' '}
                <FontAwesomeIcon icon={openCategory === index ? faChevronUp : faChevronDown} />
              </div>
              {openCategory === index && (
                <div style={{ color: 'white', backgroundColor: 'black', padding: '10px', fontSize: '16px', lineHeight: '1.6', boxShadow: '0px 0px 5px 0px rgba(255, 255, 255, 0.1)' }}>
                  {category.questions.map((question, subIndex) => (
                    <div key={subIndex} className='mb-4'>
                      <h5 style={{ color: 'white', marginBottom: '8px', fontSize: '18px' }}>{question.question}</h5>
                      <p>{question.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Faq