import React, { useState } from 'react';
import AWS from 'aws-sdk';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = () => {
    setShowAlert(true);

    AWS.config.update({
      accessKeyId: 'AKIAXBW72E6ZBPH2QF52',
      secretAccessKey: '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',
    });

    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      region: 'ap-northeast-2',
      params: { Bucket: 'reactbucketelcid11' },
    });

    const params = {
      Key: selectedFile.name,
      ContentType: selectedFile.type,
      Body: selectedFile,
      ACL: 'public-read',
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(data);
    }).on('httpUploadProgress', (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setProgress(percentCompleted);
    });
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>File Upload</h1>
      </div>
      <div className="App-body">
        {showAlert ? (
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: `${progress}%` }}
            >
              {`${progress}%`}
            </div>
          </div>
        ) : (
          <div>
            <input type="file" onChange={handleFileInput} />
            {selectedFile ? (
              <button onClick={uploadFile}>Upload to S3</button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
