import React from 'react';
import dynamic from 'react-quill';
// Note: react-quill is imported directly in CreateJob; this is a placeholder wrapper if you want to extend.

export default function RichTextEditor({ value, onChange }){
  const ReactQuill = require('react-quill');
  return <ReactQuill theme="snow" value={value} onChange={onChange} />;
}
