const emailMessage = ({ first_name, last_name, email, phone, message }) => {
  return `
  <div style="
    font-family: Arial, sans-serif; 
    color: #333; 
    line-height: 1.5; 
    max-width: 600px; 
    margin: 50px auto; 
    padding: 30px; 
    background-color: #f5f5f5; 
    border-radius: 10px; 
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  ">
    <h2 style="text-align: center; color: #222;">New Contact Request</h2>
  
    <p><strong>Name:</strong> ${first_name} ${last_name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "Not Provided"}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  
    <p style="margin-top: 20px; font-size: 12px; color: #777; text-align: center;">
      This message was sent from your website Contact Us form.
    </p>
  </div>
  `;
};

module.exports = emailMessage;
