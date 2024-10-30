# 🌿 E-Jardin

E-Jardin est une plateforme e-commerce complète dédiée à la vente de matériel de jardinage, permettant aux particuliers et aux professionnels d'acheter en ligne avec livraison à domicile.

## 🚀 Fonctionnalités

### Pour les Clients
- 🛍️ Catalogue produits avec recherche et filtres
- 🛒 Gestion du panier d'achat
- 👤 Authentification sécurisée à double facteur
- 📦 Suivi des commandes
- 💳 Paiement sécurisé (Stripe)
- 📧 Notifications par email

### Pour les Administrateurs
- 📊 Tableau de bord analytique
- 📈 Rapports personnalisables (PDF, Excel, CSV)
- 📅 Planification automatique des rapports
- 📦 Gestion des stocks
- 🏷️ Gestion des produits
- 👥 Gestion des utilisateurs

## 🛠️ Technologies Utilisées

### Frontend
- React.js avec TypeScript
- Tailwind CSS pour le style
- React Router pour la navigation
- Lucide React pour les icônes
- React DatePicker pour la sélection de dates
- Chart.js pour les graphiques

### Backend
- Node.js avec Express
- MongoDB avec Mongoose
- JWT pour l'authentification
- Stripe pour les paiements
- Nodemailer pour les emails
- Speakeasy pour la 2FA

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- MongoDB
- Compte Stripe
- Compte SMTP pour les emails

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone [url-du-repo]
cd e-jardin
```

2. **Installer les dépendances**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../server
npm install
```

3. **Configuration**

Créer un fichier `.env` dans le dossier `server` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/e-jardin
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
ADMIN_EMAIL=admin@e-jardin.com
```

4. **Lancer l'application**
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd ../server
npm run dev
```

## 📱 Utilisation

### Interface Client
- Accédez à `http://localhost:5173`
- Créez un compte ou connectez-vous
- Parcourez le catalogue
- Ajoutez des produits au panier
- Procédez au paiement

### Interface Admin
- Connectez-vous avec un compte admin
- Accédez au tableau de bord
- Gérez les produits et les stocks
- Consultez les rapports
- Planifiez les exports automatiques

## 🔒 Sécurité

- Double authentification (2FA)
- Tokens JWT
- Protection CSRF
- Rate Limiting
- Validation des données
- Sanitization des entrées
- Headers de sécurité (Helmet)

## 📊 Base de Données

### Collections MongoDB
- Users
- Products
- Orders
- ReportSchedules

## 📧 Notifications

Le système envoie des emails automatiques pour :
- Confirmation de commande
- Mise à jour du statut de commande
- Alerte de stock faible
- Rapports programmés

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- [Votre Nom] - Développeur Full Stack
- [Autre Membre] - Designer UI/UX
- [Autre Membre] - Backend Developer

## 📞 Support

Pour toute question ou support :
- Email : support@e-jardin.com
- Issue Tracker : [Lien vers les issues GitHub]