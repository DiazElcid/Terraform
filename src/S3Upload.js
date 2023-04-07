import './App.css';
import {useState} from "react";
import AWS from 'aws-sdk';
import { Row, Col, Button, Input, Alert } from 'reactstrap';

const [progress , setProgress] = useState(0);
const [selectedFile, setSelectedFile] = useState(null);
const [showAlert, setShowAlert] = useState(false);

const ACCESS_KEY = 'AKIAXBW72E6ZBPH2QF52';
const SECRET_ACCESS_KEY = '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';
const REGION = "ap-northeast-2";
const S3_BUCKET = 'reactbucketelcid11';

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET},
  region: REGION,
});

const handleFileInput = (e) => {
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    if(file.type !== 'image/jpeg' || fileExt !=='jpg'){
      alert('jpg 파일만 Upload 가능합니다.');
      return;
    }
    setProgress(0);
    setSelectedFile(e.target.files[0]);
  }
const uploadFile = (file) => {
  const params = {
    ACL: 'public-read',
    Body: file,
    Bucket: S3_BUCKET,
    Key: "upload/" + file.name
  };
  
  myBucket.putObject(params)
    .on('httpUploadProgress', (evt) => {
      setProgress(Math.round((evt.loaded / evt.total) * 100))
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setSelectedFile(null);
      }, 3000)
    })
    .send((err) => {
      if (err) console.log(err)
    })
}
  