import React, { useState, useEffect } from 'react';
import { EditorState,convertToRaw, convertFromRaw } from 'draft-js';
import './App.css';
import Title from './components/Title';
import Btn from './components/Btn';
import MyEditor from './components/Editor';


function App() {
  const [editorState, setEditorState] = useState(() => {
    const content = window.localStorage.getItem('editorContent');
    return content ?
      EditorState.createWithContent(convertFromRaw(JSON.parse(content))) :
      EditorState.createEmpty();
  });

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem('editorContent', JSON.stringify(convertToRaw(contentState)));
  }, [editorState]);

  const saveContent = () => {
    const content = editorState.getCurrentContent();
    window.localStorage.setItem('editorContent', JSON.stringify(convertToRaw(content)));
  };

  return (
    <div className="App">
      <Title text={'Draft.js Editor'}/>
      <Btn onClick={saveContent} label="Save" />
      <MyEditor editorState={editorState} setEditorState={setEditorState} />
    </div>
  );
}


export default App;

