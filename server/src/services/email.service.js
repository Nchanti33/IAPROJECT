import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const emailTemplates = {
  orderConfirmation: (order) => ({
    subject: `E-Jardin - Confirmation de commande #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a; text-align: center;">Merci pour votre commande !</h1>
        
        <p>Cher(e) client(e),</p>
        
        <p>Nous avons bien reçu votre commande #${order._id}. Voici un récapitulatif :</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${order.items.map(item => `
            <div style="margin-bottom: 10px;">
              <strong>${item.product.name}</strong><br>
              Quantité: ${item.quantity}<br>
              Prix: ${item.price}€
            </div>
          `).join('')}
          
          <div style="border-top: 1px solid #d1d5db; margin-top: 15px; padding-top: 15px;">
            <strong>Total: ${order.totalPrice}€</strong>
          </div>
        </div>
        
        <p>Nous vous tiendrons informé(e) de l'avancement de votre commande.</p>
        
        <p>Cordialement,<br>L'équipe E-Jardin</p>
      </div>
    `,
  }),

  orderStatusUpdate: (order) => ({
    subject: `E-Jardin - Mise à jour de votre commande #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a; text-align: center;">Mise à jour de votre commande</h1>
        
        <p>Cher(e) client(e),</p>
        
        <p>Le statut de votre commande #${order._id} a été mis à jour :</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h2 style="color: #16a34a; margin: 0;">
            ${order.status === 'processing' ? 'En cours de préparation' :
              order.status === 'shipped' ? 'Expédiée' :
              order.status === 'delivered' ? 'Livrée' : 'En attente'}
          </h2>
        </div>
        
        ${order.status === 'shipped' ? `
          <p>Votre commande a été expédiée. Vous pouvez suivre votre colis avec le numéro de suivi :</p>
          <p style="text-align: center; font-size: 1.2em; font-weight: bold;">${order.trackingNumber}</p>
        ` : ''}
        
        <p>Vous pouvez suivre votre commande à tout moment sur votre compte E-Jardin.</p>
        
        <p>Cordialement,<br>L'équipe E-Jardin</p>
      </div>
    `,
  }),

  stockAlert: (product) => ({
    subject: `E-Jardin - Alerte stock faible : ${product.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626; text-align: center;">Alerte Stock</h1>
        
        <p>Le produit suivant a un stock faible :</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin: 0 0 10px 0;">${product.name}</h2>
          <p>Stock actuel : <strong>${product.stock}</strong></p>
        </div>
        
        <p>Veuillez réapprovisionner ce produit dès que possible.</p>
      </div>
    `,
  }),
};

export async function sendEmail(to, template, data) {
  try {
    const { subject, html } = emailTemplates[template](data);
    
    await transporter.sendMail({
      from: `"E-Jardin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    
    console.log(`Email sent successfully: ${template} to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}