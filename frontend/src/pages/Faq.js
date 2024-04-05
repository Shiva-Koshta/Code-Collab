import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faQuestionCircle,
  faCommentAlt,
} from "@fortawesome/free-solid-svg-icons"; // Import additional icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import faqData from "./faqdata.json";
import "../index";
import { useNavigate } from "react-router-dom";

const Faq = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const navigate = useNavigate();

  const handleCategoryToggle = (categoryIndex) => {
    setOpenCategory((prevIndex) =>
      prevIndex === categoryIndex ? null : categoryIndex
    );
  };

  return (
    <div style={{paddingTop: "6px", paddingLeft: "10px"}}>
      <ArrowBackIcon
            className="text-slate-300 cursor-pointer mt-3 ml-5"
            fontSize="large"
            onClick={() => navigate("/")}
          />
          <HomeOutlinedIcon
            className="text-slate-200 cursor-pointer mt-3"
            fontSize="large"
            onClick={() => navigate("/")}
          />
      <div className="bigCont flex flex-col overflow-y-auto">
        
        <div
          className="flex justify-center"
          style={{
            backgroundColor: "#1c1e29",
            padding: "10px",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "left",
            fontFamily: "Arial, sans-serif",
            boxShadow: "0px 0px 10px 0px rgba(255, 255, 255, 0.3)",
          }}
        >
          <p className="ml-8 text-red-300 font-bold text-5xl madimi-one-regular">
            FAQ
          </p>          
        </div>

        <div
          className="flex justify-center"
          style={{
            backgroundColor: "#1c1e29",
            minHeight: "100vh",
            // marginTop: "50px"
            paddingTop: "60px"
          }}
        >
          <div style={{ width: "80%", fontFamily: "Helvetica, sans-serif" }}>
            {faqData.map((category, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  transition:
                    "background-color 0.3s, color 0.3s, box-shadow 0.3s", // Add smooth transitions
                  boxShadow: "0px 0px 10px 0px rgba(255, 255, 255, 0.5)", // Add box shadow
                }}
              >
                <div
                  onClick={() => handleCategoryToggle(index)}
                  style={{
                    backgroundColor:
                      openCategory === index ? "#1c1e29" : "black",
                    color: openCategory === index ? "#FCA5A5" : "#FCA5A5",
                    padding: "10px",
                    cursor: "pointer",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between", // Align icon to the right
                    transition: "background-color 0.3s, color 0.3s", // Add smooth transitions
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      style={{ marginRight: "8px" }}
                    />
                    <span>{category.category}</span>
                  </span>
                  <FontAwesomeIcon
                    icon={openCategory === index ? faChevronUp : faChevronDown}
                  />
                </div>
                {openCategory === index && (
                  <div
                    style={{
                      color: "white",
                      backgroundColor: "black",
                      padding: "10px",
                      fontSize: "16px",
                      lineHeight: "1.6",
                      boxShadow: "0px 0px 5px 0px rgba(255, 255, 255, 0.1)",
                      maxHeight: "180px",
                      overflowY: "auto",
                    }}
                  >
                    {category.questions.map((question, subIndex) => (
                      <div key={subIndex} className="mb-4 ">
                        <h5
                          className="text-red-100"
                          style={{
                            marginBottom: "8px",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faQuestionCircle}
                            style={{ marginRight: "18px" }}
                          />
                          {question.question}
                        </h5>
                        <p style={{ marginLeft: "20px" }}>
                          {question.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
