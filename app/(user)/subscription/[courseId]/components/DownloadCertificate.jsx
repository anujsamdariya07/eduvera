import { Button } from '@nextui-org/react'
import { Download } from 'lucide-react'
import React from 'react'

const generateCertificate = async (studentName, courseName) => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set the canvas dimensions based on your template
  canvas.width = 1200; // Width of your template
  canvas.height = 800; // Height of your template

  // Load the certificate template image
  const template = new Image();
  template.src = '/certificate.png'; // Replace with your template path
  await new Promise((resolve) => {
    template.onload = resolve;
  });

  // Draw the template on the canvas
  ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

  // Load the Alex Brush font
  const font = new FontFace('Alex Brush', 'url(/alexBrushFont.ttf)');
  await font.load(); // Wait for the font to load
  document.fonts.add(font); // Add the font to the document
  
  // Add dynamic text Student Name 
  ctx.font = '71.4px Alex Brush';
  ctx.fillStyle = '#2b2d42'; // Black text
  ctx.textAlign = 'center';
  
  // Student Name
  ctx.fillText(studentName, canvas.width / 2, 320); // Adjust position as needed

  // Load the Jones font
  const font2 = new FontFace('Jones', 'url(/jones.ttf)');
  await font2.load(); // Wait for the font to load
  document.fonts.add(font2); // Add the font to the document
  
  // Add dynamic text Course Name
  ctx.font = '40px Jones';
  ctx.fillStyle = '#2b2d42'; // Black text
  ctx.textAlign = 'center';
  
  // Course Name
  ctx.fillText('"' + courseName + '"', canvas.width / 2, 450); // Adjust position as needed

  // Convert the canvas to a downloadable image
  const certificateImage = canvas.toDataURL('image/png');

  // Create a download link
  const link = document.createElement('a');
  link.href = certificateImage;
  link.download = `Certificate_${studentName}_${courseName}.png`;
  link.click();
};

const DownloadCertificate = ({studentName, courseName}) => {
  return (
    <div className='flex'>
      <Button
      onClick={() => {
        console.log('Clicked!')
        return generateCertificate(studentName, courseName)
      }}
      color='success'
      className='text-white font-mono font-semibold'
      >
        Download Course Certificate <Download />
      </Button>
    </div>
  )
}

export default DownloadCertificate