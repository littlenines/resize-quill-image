import { useRef, useState } from 'react';
import Editor from './Editor';
import { Link } from 'react-router';

const App = () => {
  const quillRef = useRef(null);
  const [html, setHtml] = useState('');
  const [delta, setDelta] = useState(null);

  const handleShowContent = () => {
    if (quillRef.current) {
      const editor = quillRef.current;
      const htmlOutput = editor.root.innerHTML;
      const deltaOutput = editor.getContents();

      setHtml(htmlOutput);
      setDelta(deltaOutput);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Editor ref={quillRef} />

      <div style={{ marginTop: '1rem' }}>
        <Link to="/test-page">Another Page</Link>
      </div>

      <button onClick={handleShowContent} style={{ marginTop: '1rem' }}>
        Show HTML & Delta
      </button>

      {html && (
        <div style={{ marginTop: '2rem' }}>
          <h3>HTML Output</h3>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              background: '#fff',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}

      {delta && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Delta Output</h3>
          <pre
            style={{
              background: '#f9f9f9',
              padding: '10px',
              border: '1px solid #ccc',
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(delta, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default App;
