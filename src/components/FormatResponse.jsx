import React from 'react';

const FormatResponse = ({ text }) => {
  if (typeof text !== 'string') {
    console.warn('FormatResponse: text is not a string', text);
    return <span>(invalid response)</span>;
  }

  const formatText = (input) => {
    return input
      .replace(/^####\s*(.*)$/gm, '<strong>‣‣ $1</strong>')
      .replace(/^###\s*(.*)$/gm, '<strong>‣ $1</strong>')
      .replace(/(\d+\.)/g, '<br/><strong>$1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<![A-Za-z0-9])\s*-\s*(?![A-Za-z0-9])/g, '<br/>');
  };

  return (
    <div
      className="format-response"
      dangerouslySetInnerHTML={{ __html: formatText(text) }}
    />
  );
};

export default FormatResponse;
