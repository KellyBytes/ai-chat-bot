import React from 'react';

const FormatResponse = ({ text }) => {
  const formatText = (input) => {
    return input
      .replace(/###/g, '<strong>✔</strong>')
      .replace(/(\d+\.)/g, '<br/><strong>$1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\s*-\s*/g, '<br/>');
  };

  return <div className="format-response" dangerouslySetInnerHTML={{ __html: formatText(text) }} />;
};

export default FormatResponse;
