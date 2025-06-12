// File.js

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import File from "../models/File.js";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fetch from 'node-fetch';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const fontkit = require('fontkit');

const customColor = rgb(0.188, 0.212, 0.259);




dotenv.config();

const router = express.Router();


const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`; // "02/06/2025"
};


// Multer setup
const uploadPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
  const uploadDir = 'uploads/';
  const originalName = file.originalname;

  const filepath = path.join(uploadDir, originalName);

  // Delete if file exists (optional, but you had this logic)
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }

  cb(null, originalName);
}

});


const upload = multer({ storage: storage });


router.post('/upload', upload.fields([{ name: 'photo' }, { name: 'aadhar' }]), async (req, res) => {
  const {
    name, mobile, dob, gender, email, permanentadd, presentadd, pincode,
    institutename, education, currentstatus, techopted, duration,
    fees, pendingfees, referedby, startDate, endDate
  } = req.body;

  try {
    // Handle file uploads
    const photoFile = req.files['photo'] ? req.files['photo'][0].filename : null;
    const aadharFile = req.files['aadhar'] ? req.files['aadhar'][0].filename : null;

    // Calculate paid fees
    const paidfees = Number(fees) - Number(pendingfees);

    // Create new registration record
    const newFile = await File.create({
      // Personal Information
      name,
      mobile,
      dob: formatDate(dob),
      gender,
      email,
      
      // Address Information
      permanentadd,
      presentadd,
      pincode,
      
      // Education Information
      institutename,
      education,
      currentstatus,
      
      // Internship Information
      techopted,
      duration,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      
      // Financial Information
      fees: Number(fees),
      pendingfees: Number(pendingfees),
      referedby,
      
      // Documents
      photo: photoFile,
      aadhar: aadharFile,
      
      // Set default status values
      offerStatus: "pending",
      status: "unreviewed",
      completionStatus: "pending"
    });

    // Prepare email content
    const currentDate = formatDate(new Date());
    const rawDate = new Date();
    const formattedDate = `${rawDate.getDate()}/${rawDate.getMonth() + 1}/${rawDate.getFullYear()}`;

    const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465, // or 587 if you use TLS
  secure: true, // true for port 465, false for 587
  auth: {
    user: "hrteam@v-extechsolution.in", // your Hostinger email
    pass: "Veer@2238",        // NOT your Hostinger login, just the email password
  },
});

    // Email options
    const mailOptions = {
      from: '"HR Team" <hrteam@v-extechsolution.in>',
      to: email,
      subject: `Registration | V-Ex Tech Solution`,
      html: `<div style="background-color: #f3f3f3; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
            <h1 style="text-align: center; font-size: 24px; color: #333;">V-Ex Tech Solution</h1>
            <p style="color: #333; font-size: 18px;">Dear ${name},</p>
            <p style="color: #333; font-size: 16px;">Thank you for registering with V-Ex Tech Solution!</p>
            <p style="color: #333; font-size: 16px;">We sincerely appreciate your interest in our ${techopted} program and are delighted to welcome you to our learning community.</p>
            
            <div style="background-color: #f9f9f9; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;">
                <p style="color: #333; font-size: 16px; margin: 0;"><strong>Your registration details:</strong></p>
                <ul style="list-style-type: none; padding-left: 0;">
                    <li><strong>Program:</strong> ${techopted}</li>
                    <li><strong>Duration:</strong> ${duration}</li>
                    <li><strong>Start Date:</strong> ${formatDate(new Date(startDate))}</li>
                    <li><strong>End Date:</strong> ${formatDate(new Date(endDate))}</li>
                    <li><strong>Registration Date:</strong> ${formattedDate}</li>
                </ul>
            </div>

            <p style="color: #333; font-size: 16px;">Our team will review your registration and contact you shortly with the next steps. We're committed to providing you with an exceptional learning experience.</p>
            
            <p style="color: #333; font-size: 16px;">Should you have any questions in the meantime, please don't hesitate to reach out to us.</p>
            
            <p style="color: #666; font-size: 16px;">Best regards,</p>
            <p style="color: #666; font-size: 16px;">The V-Ex Tech Solution Team</p>
            
            <div style="margin-top: 20px;">
                <a href="https://v-extechsolution.in" style="color: #3498db; font-size: 16px;">v-extechsolution.in</a><br><br>
                <a href="mailto:veeragraval@v-extechsolution.in" style="color: #3498db; font-size: 16px;">veeragraval@v-extechsolution.in</a><br><br>
                <a href="tel:9664768292" style="color: #3498db; font-size: 16px;">+91 9664768292</a>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <a href="https://www.linkedin.com/company/v-ex-tech-software-company-in-vadodara/mycompany/" style="text-decoration: none; color: #333; padding:0 14px;">
                    <img src="https://i.ibb.co/1MpdrG8/download-1.png" alt="LinkedIn" style="width: 15%;">
                </a>
                <a href="https://www.youtube.com/@Veer_Agraval" style="text-decoration: none; color: #333; padding:0 14px;">
                    <img src="https://i.ibb.co/b60S7TZ/download.png" alt="YouTube" style="width: 15%;">
                </a>
                <a href="https://www.instagram.com/v_extech/?igshid=Zjc2ZTc4Nzk%3D" style="text-decoration: none; color: #333; padding:0 14px;">
                    <img src="https://i.ibb.co/xYLHv49/download.jpg" alt="Instagram" style="width: 15%;">
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px; text-align: center;">
                Dhun Complex-301, Above Riya Bridal, near Amritsari Kulcha,<br>
                opp. Pavan Park Society, Nizampura, Vadodara, Gujarat 390002
            </p>
        </div>
    </div>`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    res.json({ 
      success: true, 
      message: 'Thanks, registration details have been sent',
      data: {
        registrationId: newFile._id,
        name,
        email,
        program: techopted
      }
    });

  } catch (err) {
    console.error("Error saving file to database:", err);
    res.status(500).json({ 
      success: false, 
      error: 'Registration failed. Please try again.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


// POST route to generate and send invoice for a specific student
router.post('/api/send-invoice/:id', async (req, res) => {
  try {
    const student = await File.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const {
      name, email, presentadd, permanentadd, techopted,
      fees, pendingfees, duration
    } = student;

    const paidfees = fees - pendingfees;
    const templateBytes = fs.readFileSync(path.join(process.cwd(), 'slip.pdf'));
    const pdfDoc = await PDFDocument.load(templateBytes);
    const firstPage = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (text, x, y, size = 12) => {
      firstPage.drawText(text, {
        x, y, size,
        font,
        color: rgb(0, 0, 0),
      });
    };

    // const currentDate = new Date().toLocaleDateString();
    // const formattedDate = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

    const currentDate = formatDate(new Date());
const formattedDate = currentDate;

    drawText(name, 65, 525);
    drawText(presentadd || permanentadd, 65, 510);
    drawText(currentDate, 400, 540);
    drawText(techopted, 60, 410);
    drawText(fees.toString(), 495, 410);
    drawText(fees.toString(), 495, 235);
    drawText(paidfees.toString(), 495, 203);
    drawText(pendingfees.toString(), 495, 183);

    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(process.cwd(), 'uploads', `invoice_${name}.pdf`);
    fs.writeFileSync(pdfPath, pdfBytes);

    const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465, // or 587 if you use TLS
  secure: true, // true for port 465, false for 587
  auth: {
    user: "hrteam@v-extechsolution.in", // your Hostinger email
    pass: "Veer@2238",        // NOT your Hostinger login, just the email password
  },
});

    // Email options
    const mailOptions = {
      from: '"HR Team" <hrteam@v-extechsolution.in>',
      to: email,
      subject: `Receipt for Your Registration | V-Ex Tech Solution`,
      attachments: [
        {
          filename: `invoice_${name}.pdf`,
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ],
      html: `<div style="background-color: #f3f3f3; padding: 20px;">
         <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
             <h1 style="text-align: center; font-size: 24px; color: #333;">V-Ex Tech Solution</h1>
             <p style="color: #333; font-size: 18px;">${name}</p>
             <p style="color: #333; font-size: 16px;">Thank you for registering with us!</p>
             <p style="color: #333; font-size: 16px;">Below is your receipt:</p>
             <hr style="border: 1px solid #ccc;">
             <div style="margin-top: 20px;">
                 <p style="color: #333; font-size: 16px;"><strong>Registration Details:</strong></p>
                 <ul style="list-style-type: none; padding-left: 0;">
                     <li><strong>Student Name:</strong> ${name}</li><br>
                     <li><strong>Technology:</strong> ${techopted}</li><br>
                     <li><strong>Duration:</strong> ${duration}</li><br>
                     <li><strong>Total Amount:</strong> ${fees}</li><br>
                     <li><strong>Paid Amount:</strong> ${paidfees}</li><br>
                     <li style="color: red;"><strong>Pending Amount:</strong> ${pendingfees}</li><br>
                     <li><strong>Date:</strong> ${formattedDate}</li>
                 </ul>
             </div>
             <hr style="border: 1px solid #ccc;">
             <p style="color: #333; font-size: 16px;">If you have any questions or concerns, feel free to contact us.</p>
             <p style="color: #666; font-size: 16px;">Best regards,</p>
             <p style="color: #666; font-size: 16px;">V-Ex Tech Solution Team</p>
             <div style="margin-top: 20px;">
                <a href="https://v-extechsolution.in" style="color: #3498db; font-size: 16px;">v-extechsolution.in</a><br><br>
                 <a href="mailto:veeragraval@v-extechsolution.in" style="color: #3498db; font-size: 16px;">veeragraval@v-extechsolution.in</a><br><br>
                 <a href="tel:9664768292" style="color: #3498db; font-size: 16px;">+91 9664768292</a>
             </div>
             <div style="margin-top: 20px;">
                 <a href="https://www.linkedin.com/company/v-ex-tech-software-company-in-vadodara/mycompany/" style="text-decoration: none; color: #333; padding:0 14px;">
                     <img src="https://i.ibb.co/1MpdrG8/download-1.png" alt="LinkedIn" style="width: 15%;">
                 </a>
                 <a href="https://www.youtube.com/@Veer_Agraval" style="text-decoration: none; color: #333; padding:0 14px;">
                     <img src="https://i.ibb.co/b60S7TZ/download.png" alt="YouTube" style="width: 15%;">
                 </a>
                 <a href="https://www.instagram.com/v_extech/?igshid=Zjc2ZTc4Nzk%3D" style="text-decoration: none; color: #333; padding:0 14px;">
                     <img src="https://i.ibb.co/xYLHv49/download.jpg" alt="Instagram" style="width: 15%;">
                 </a>
             </div>
             <p style="color: #666; font-size: 16px; margin-top: 20px;">
                Dhun Complex-301, Above Riya Bridal, near Amritsari Kulcha, opp. Pavan Park Society, Nizampura, Vadodara, Gujarat 390002
             </p>
         </div>
     </div>
      `, // Use same HTML from your existing mail template
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice Email sent:', info.response);

    res.json({ success: true, message: 'Invoice sent successfully' });
  } catch (err) {
    console.error("Error sending invoice:", err);
    res.status(500).json({ success: false, message: 'Failed to send invoice' });
  }
});

function wrapText(text, font, fontSize, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (let word of words) {
    const testLine = currentLine + word + " ";
    const width = font.widthOfTextAtSize(testLine.trim(), fontSize);

    if (width < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    }
  }

  if (currentLine) lines.push(currentLine.trim());

  return lines;
}




router.post('/api/send-offer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      internshipDate,
      startDate,
      responsibilities,
      returnBy
    } = req.body;

    // Update first
    await File.findByIdAndUpdate(id, {
      internshipDate,
      startDate,
      responsibilities,
      returnBy,
      offerStatus: 'offered'
    });

    const student = await File.findById(id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const {
      name, email, techopted,
      internshipDate: dbInternshipDate,
      startDate: dbStartDate,
      responsibilities: dbResponsibilities,
      returnBy: dbReturnBy
    } = student;

    const templateBytes = fs.readFileSync(path.join(process.cwd(), 'offer_letter.pdf'));
    const pdfDoc = await PDFDocument.load(templateBytes);

    const pages = pdfDoc.getPages();
const firstPage = pages[0];
const secondPage = pages[1]; // this is your second page
pdfDoc.registerFontkit(fontkit);
const openSansBytes = fs.readFileSync('fonts/OpenSans-Regular.ttf');
const openSansFont = await pdfDoc.embedFont(openSansBytes);



    const drawText = (page, text, x, y, size = 14, fontType = openSansFont) => {
  page.drawText(text?.toString() || "N/A", {
    x,
    y,
    size,
    font: fontType,
    color: customColor, // <- apply here
  });
};





    drawText(firstPage, formatDate(dbInternshipDate) || "N/A", 458, 640);

    drawText(firstPage, name || "N/A", 93, 572);

    const techPara = `We are pleased to offer you the position of ${techopted} Internship at V-Ex Tech Solution. We are excited to have you join our team and are confident that your skills and experience will be a valuable addition to the company.`;
const techLines = wrapText(techPara, openSansFont, 14, 500);

let techStartY = 529;
techLines.forEach((line, i) => {
  drawText(firstPage, line, 57, techStartY - i * 18);
});


    drawText(firstPage, formatDate(dbStartDate) || "N/A", 208, 435);
    
const wrappedLines = wrapText(dbResponsibilities || "N/A", openSansFont, 14, 500);

let startY = 350;
wrappedLines.forEach((line, i) => {
  drawText(firstPage, line, 57, startY - i * 18);
});


    drawText(secondPage, formatDate(dbReturnBy) || "N/A", 130, 623);

    const namePara = `Employee Acknowledgement: I, ${name}, accept the offer of Internship as outlined above and agree to the terms and conditions stated.`;
const nameLines = wrapText(namePara, openSansFont, 14, 500);

let nameStartY = 550;
nameLines.forEach((line, i) => {
  drawText(secondPage, line, 70, nameStartY - i * 18);
});

    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(process.cwd(), 'uploads', `offer_letter_${name}.pdf`);
    fs.writeFileSync(pdfPath, pdfBytes);

    const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465, // or 587 if you use TLS
  secure: true, // true for port 465, false for 587
  auth: {
    user: "hrteam@v-extechsolution.in", // your Hostinger email
    pass: "Veer@2238",        // NOT your Hostinger login, just the email password
  },
});

    // Email options
    const mailOptions = {
      from: '"HR Team" <hrteam@v-extechsolution.in>',
      to: email,
      subject: `Internship Offer Letter | V-Ex Tech Solution`,
      html: `
        <p>Dear ${name},</p>
        <p>We are pleased to offer you an internship for the <strong>${techopted}</strong> program at V-Ex Tech Solution.</p>
        <p>Please find your offer letter attached. Kindly review and return a signed copy by <strong>${dbReturnBy}</strong>.</p>
        <p>Best regards,<br/>V-Ex Tech Solution Team</p>
      `,
      attachments: [
        {
          filename: `offer_letter_${name}.pdf`,
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log('Offer letter sent to:', email);

    res.json({ success: true, message: 'Offer letter sent successfully' });

  } catch (error) {
    console.error("Error sending offer letter:", error);
    res.status(500).json({ success: false, message: "Failed to send offer letter" });
  }
});




router.post('/api/send-completion/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      completionDate,
      completionTo,
      completionName,
      completionStartDate,
      completionEndDate,
      workSummary,
      performance,
      appreciation
    } = req.body;

    // Update first
    await File.findByIdAndUpdate(id, {
      completionDate,
      completionTo,
      completionName,
      completionStartDate,
      completionEndDate,
      workSummary,
      performance,
      appreciation,
      completionStatus: 'sent'
    });

    const student = await File.findById(id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const {
      name, email, techopted, institutename, startDate, endDate,
      completionDate: dbCompletionDate,
      completionTo: dbCompletionTo,
      completionName: dbCompletionName,
      completionStartDate: dbcompletionStartDate,
      completionEndDate: dbcompletionEndDate,
      workSummary: dbWorkSummary,
      performance: dbPerformance,
      appreciation: dbAppreciation
    } = student;

    // Load PDF template
    const templateBytes = fs.readFileSync(path.join(process.cwd(), 'completion_letter.pdf'));
    const pdfDoc = await PDFDocument.load(templateBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    pdfDoc.registerFontkit(fontkit);
    const PoppinsBytes = fs.readFileSync('fonts/Poppins.ttf');
    const PoppinsFont = await pdfDoc.embedFont(PoppinsBytes);

    const drawText = (page, text, x, y, size = 10, fontType = PoppinsFont) => {
      page.drawText(text?.toString() || "N/A", {
        x,
        y,
        size,
        font: fontType,
        color: customColor,
      });
    };

    // Fill completion letter template
    drawText(firstPage, formatDate(dbCompletionDate) || "N/A", 492, 604);
    // drawText(firstPage, dbCompletionTo || "N/A", 50, 603);

    const completionToLines = (dbCompletionTo || "N/A").split('\n');
let toStartY = 603;

completionToLines.forEach((line, i) => {
  drawText(firstPage, line.trim(), 50, toStartY - i * 15); // Adjust spacing as needed
});






    const clarifyPara = `This is to clarify that ${name}, a student of ${institutename}, has successfully completed internship in ${techopted} at V-Ex Tech Solution from ${dbcompletionStartDate} to ${dbcompletionEndDate}.`;
const clarifyLines = wrapText(clarifyPara, PoppinsFont, 10, 480);

let clarifyStartY = 480;
clarifyLines.forEach((line, i) => {
  drawText(firstPage, line, 50, clarifyStartY - i * 18);
});



const wrappedLines = wrapText(dbWorkSummary || "N/A", PoppinsFont, 10, 480);

let startY = 430;
wrappedLines.forEach((line, i) => {
  drawText(firstPage, line, 50, startY - i * 18);
});


const lines = wrapText(dbPerformance || "N/A", PoppinsFont, 10, 480);

let startYAxis = 343;
lines.forEach((line, i) => {
  drawText(firstPage, line, 50, startYAxis - i * 18);
});

const appreciationLines = wrapText(dbAppreciation || "N/A", PoppinsFont, 10, 480);

let onY = 250;
appreciationLines.forEach((line, i) => {
  drawText(firstPage, line, 50, onY - i * 18);
});





    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(process.cwd(), 'uploads', `completion_letter_${name}.pdf`);
    fs.writeFileSync(pdfPath, pdfBytes);

    // Send email with attachment
    const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465, // or 587 if you use TLS
  secure: true, // true for port 465, false for 587
  auth: {
    user: "hrteam@v-extechsolution.in", // your Hostinger email
    pass: "Veer@2238",        // NOT your Hostinger login, just the email password
  },
});

    // Email options
    const mailOptions = {
      from: '"HR Team" <hrteam@v-extechsolution.in>',
      to: email,
      subject: `Internship Completion Certificate | V-Ex Tech Solution`,
      html: `
        <p>Dear ${name},</p>
        <p>Congratulations on successfully completing your <strong>${techopted}</strong> internship at V-Ex Tech Solution from <strong>${dbcompletionStartDate}</strong> to <strong>${dbcompletionEndDate}</strong>.</p>
        <p>Please find your completion certificate attached.</p>
        <p>Best regards,<br/>V-Ex Tech Solution Team</p>
      `,
      attachments: [
        {
          filename: `completion_certificate_${name}.pdf`,
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log('Completion letter sent to:', email);

    res.json({ success: true, message: 'Completion letter sent successfully' });

  } catch (error) {
    console.error("Error sending completion letter:", error);
    res.status(500).json({ success: false, message: "Failed to send completion letter" });
  }
});





// GET route to fetch all data
router.get('/api/get-file-data', async (req, res) => {
  try {
    // const fileData = await File.find({ approved: true });
    const fileData = await File.find();

    res.json(fileData);
  } catch (err) {
    console.error("Error fetching file data:", err);
    res.status(500).send("Error fetching file data");
  }
});


router.put('/api/update-file/:id', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 },
]), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files.photo) {
      updateData.photo = req.files.photo[0].filename;
    }

    if (req.files.aadhar) {
      updateData.aadhar = req.files.aadhar[0].filename;
    }

    const updated = await File.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ error: 'Update failed' });
  }
});


// PUT route to update file details (description, status, etc.)
router.put("/update-file/:id", upload.single("photo"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = { ...req.body }; // includes description, status

    // If a new photo is uploaded
    if (req.file) {
      updateFields.photo = req.file.filename;
    }

    const updated = await File.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Update failed" });
  }
});










// DELETE route to delete a file record and its associated files
router.delete('/api/delete-file/:id', async (req, res) => {
  try {
    const fileRecord = await File.findById(req.params.id);
    if (!fileRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Delete photo file if exists
    if (fileRecord.photo) {
      const photoPath = path.join(process.cwd(), 'uploads', fileRecord.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // Delete aadhar file if exists
    if (fileRecord.aadhar) {
      const aadharPath = path.join(process.cwd(), 'uploads', fileRecord.aadhar);
      if (fs.existsSync(aadharPath)) {
        fs.unlinkSync(aadharPath);
      }
    }

    // Delete the document from database
    await File.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: 'Delete failed' });
  }
});





export default router;