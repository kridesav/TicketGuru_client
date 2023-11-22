import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("scanner", { fps: 10, qrbox: 250 });
    scanner.render(onScan);
    return () => scanner.clear();
  }, [onScan]);

  return <div id="scanner"></div>;
};

export default QRScanner;