import React from 'react';

const FormatResponse = ({ text }) => {
  if (typeof text !== 'string') {
    console.warn('FormatResponse: text is not a string', text);
    return <span>(invalid response)</span>;
  }

  const formatText = (input) => {
    return input
      .replace(/###/g, '<strong>✔</strong>')
      .replace(/(\d+\.)/g, '<br/><strong>$1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\s*-\s*/g, '<br/>');
  };

  return (
    <div
      className="format-response"
      dangerouslySetInnerHTML={{ __html: formatText(text) }}
    />
  );
};

export default FormatResponse;
