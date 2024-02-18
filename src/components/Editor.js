import React from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';

const styleMap = {
  'RED': {
    color: 'rgba(255, 0, 0, 1.0)',
  },
  'UNDERLINE': {
    textDecoration: 'underline',
  },
};


const MyEditor = ({ editorState, setEditorState }) => {

  const resetBlockType = (editorState) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const blockType = RichUtils.getCurrentBlockType(editorState);

    if (blockType !== 'unstyled') {
      return RichUtils.toggleBlockType(editorState, 'unstyled');
    }

    return editorState;
  };

  const resetInlineStyles = (editorState) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const styles = ['BOLD', 'RED', 'UNDERLINE'];

    // Loop through each style and remove them from the selection
    const newContentState = styles.reduce((contentState, style) => {
      return Modifier.removeInlineStyle(contentState, selection, style);
    }, currentContent);

    return EditorState.push(editorState, newContentState, 'change-inline-style');

  };


  const onChange = (newEditorState) => {
    const currentContent = editorState.getCurrentContent();
    const newContent = newEditorState.getCurrentContent();

    // Check if the content has changed
    if (currentContent !== newContent) {
      // Detecting if block type needs to be reset
      const lastChangeType = newEditorState.getLastChangeType();

      if (lastChangeType === 'split-block') {
        // Reset block type when new line is entered

        let resetState = resetBlockType(newEditorState);
        resetState = resetInlineStyles(resetState);
        setEditorState(resetState);
      } else {
        setEditorState(newEditorState);
      }
    }
  };


  const keyBindingFunction = (e) => {
    if (e.keyCode === 32) {
      const selection = editorState.getSelection();
      const anchorKey = selection.getAnchorKey();
      const currentContent = editorState.getCurrentContent();
      const currentContentBlock = currentContent.getBlockForKey(anchorKey);
      const start = selection.getStartOffset();
      const text = currentContentBlock.getText();

      const blockType = text.slice(0, start);
      if (blockType === '#' || blockType === '*' || blockType === '**' || blockType === '***') {
        return 'apply-custom-style';
      }
    }
    return getDefaultKeyBinding(e);
  };

  // Handle key commands for custom markdown-like syntax
  const handleKeyCommand = (command) => {
    if (command === 'apply-custom-style') {
      const selection = editorState.getSelection();
      const anchorKey = selection.getAnchorKey();
      const currentContent = editorState.getCurrentContent();
      const currentContentBlock = currentContent.getBlockForKey(anchorKey);
      const start = selection.getStartOffset();
      const text = currentContentBlock.getText();
      const blockType = text.slice(0, start);

      let newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: start,
        }),
        'backward'
      );

      let newState = EditorState.push(editorState, newContentState, 'remove-range');
      if (blockType === '#') {
        newState = RichUtils.toggleBlockType(newState, 'header-one');
      } else if (blockType === '*') {
        newState = RichUtils.toggleInlineStyle(newState, 'BOLD');
      } else if (blockType === '**') {
        newState = RichUtils.toggleInlineStyle(newState, 'RED');
      } else if (blockType === '***') {
        newState = RichUtils.toggleInlineStyle(newState, 'UNDERLINE');
      }

      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  return (
    <div>
      <div style={{ border: '1px solid black', minHeight: '100px' }}>
        <Editor
          customStyleMap={styleMap}
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFunction}
        />
      </div>
    </div>
  );
};

export default MyEditor;

