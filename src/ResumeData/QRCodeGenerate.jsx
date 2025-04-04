// Rajlaxmi Jagadale Added that QR code Date 2/04/2025

import { useEffect, useRef, useState } from "react"
import { toPng } from "html-to-image"
import { FaDownload, FaShareAlt } from "react-icons/fa"
import { QRCodeCanvas } from "qrcode.react"
import uploadingResumeGif from "../assets/icons8-download.gif";
import SharingResumeGif from "../assets/icons8-connect.gif";


import logoImage from "../assets/157logo_Circular.png"
import "../ResumeData/QRCodeGenerate.css"
import { DownloadOutlined, LoadingOutlined, ShareAltOutlined } from "@ant-design/icons"
import { Spin } from "antd"
import html2canvas from "html2canvas";

function QRCodeGenerate({shareUrl, loginEmployeeName, sendOfficailMailForQr}) {
  const websiteURL = shareUrl;
  const qrRef = useRef(null)
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    if (qrRef.current) {
      try {
        const dataUrl = await toPng(qrRef.current, {
          quality: 1.0,
          pixelRatio: 1.5,
          backgroundColor: "#526d82",
          width: 250,
          height: 350,
        })

        return new Promise((resolve) => {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.src = dataUrl

          img.onload = () => {
            const labelHeight = 20
            canvas.width = img.width
            canvas.height = img.height + labelHeight

            // Draw QR code with background
            ctx.drawImage(img, 0, 0)

            // Draw label text
            ctx.fillStyle = "white"
            ctx.font = "bold 20px Poppins" // Reduced from 28px
            ctx.textAlign = "center"

            resolve(canvas.toDataURL("image/png"))
          }
        })
      } catch (error) {
        console.error("Error generating QR code:", error)
        return null
      }
    }
  }

  // Function to download QR Code
  const downloadQRCode = async () => {
    setLoading(true);
    const qrWithLabel = await generateQRCode()
    if (qrWithLabel) {
      const link = document.createElement("a")
      link.href = qrWithLabel
      link.download = "qr_code.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    setLoading(false);
  }

  const shareQRCode = async () => {


    try {
      const input = document.getElementById("shareQR");
      const canvas = await html2canvas(input, { scale: 2, logging: true });

      const imgName = `${loginEmployeeName}_QRcode.png`;
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (
        navigator.canShare &&
        navigator.canShare({ files: [new File([blob], imgName)] })
      ) {
        const file = new File([blob], imgName, { type: "image/png" });
        await navigator.share({
          title: loginEmployeeName,
          text: "Check out this QR.",
          files: [file],
        });
      } else {
        console.warn("Sharing not supported, downloading the image instead.");
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = imgName;
        link.click();
      }

    } catch (error) {
      toast.error("Error generating image:", error);
    }

  }

  useEffect(() => {
    const qrlogocontainer = document.getElementsByClassName("qr-inner-container1111");
    if (qrlogocontainer.length > 0) {
      const image = qrlogocontainer[0].getElementsByTagName("img");
      if (image.length > 0) {
        image[0].style.borderRadius = "50%";
      }
    }
  }, []);
  

  return (
    <div className="container56565">
      <h2 className="title">🔗 QR Code Generator</h2>
      {/* <input type="text" value={websiteURL} readOnly className="qr-input" /> */}
      <div className="qr-wrapper">
        <div ref={qrRef} className="qr-container"  id="shareQR">
        <div className="label767657">157 Careers</div>
        <div className="label767657 label766543">Applicant Form</div>
          <div className="qr-inner-container qr-inner-container1111">
            <QRCodeCanvas
              id="qrCode"
              size={200}
              bgColor="#FFFFFF"
              fgColor="#27374d"
              value={websiteURL}
              level="H"
              eyeRadius={10}
              includeMargin={true}
              imageSettings={{
                src: logoImage,
                x: undefined,
                y: undefined,
                height: 50,
                width: 50,
                // excavate: true,
                borderRadius: "50%",
                
                
              }}
              

            />
          </div>
          
          <div className="label767657">{loginEmployeeName}</div>
          <div className="label767657 label766543">{sendOfficailMailForQr}</div>
        </div>
      </div>
      <div className="button-group123">
        <button onClick={downloadQRCode} className="download-btn">
         {/* Download QR */}
        {
          loading ? (
             <img
             className="removebackgroundfromimagedownloading"
                      src={uploadingResumeGif}
                      alt="Uploading"
                      style={{ width: 20, height: 20 }}
                    />
          ):(
<DownloadOutlined />
          )
        } 
         
        </button>
        <button onClick={shareQRCode} className="share-btn">

         <ShareAltOutlined />
        </button>
      </div>
    </div>
  )
}

export default QRCodeGenerate

