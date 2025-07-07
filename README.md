# Assistant d'Inspection Mécanique avec Reconnaissance Vocale

Une application web française pour l'inspection mécanique de véhicules utilisant la reconnaissance vocale.

## 🚗 Fonctionnalités

### Inspection Complète
- **16 points de contrôle** couvrant tous les systèmes critiques
- **Freinage** : Épaisseur des plaquettes, niveau du liquide
- **Pneumatiques** : Profondeur de sculpture, pression
- **Éclairage** : Phares, feux arrière, clignotants
- **Fluides** : Niveaux d'huile et de liquide de refroidissement
- **Mécanique** : État des courroies, tension de la batterie
- **Sécurité** : Pare-brise, klaxon, rétroviseurs
- **Suspension/Direction** : État et fonctionnement

### Reconnaissance Vocale Avancée
- **Interface vocale française** optimisée pour le contexte technique
- **Validation automatique** des réponses selon le type de question
- **Confirmation interactive** avant enregistrement
- **Gestion d'erreurs** robuste avec feedback utilisateur

### Interface Utilisateur Moderne
- **Design responsive** adapté mobile et desktop
- **Progression visuelle** avec barre de progression
- **Catégorisation** des réponses par système
- **Statuts visuels** : Conforme ✓, Non-conforme ✗, À surveiller ⚠, Indéterminé ?

### Fonctionnalités Avancées
- **Export de rapports** au format JSON
- **Navigation flexible** avec possibilité d'ignorer des questions
- **Redémarrage d'inspection** pour un nouveau véhicule
- **Résumé automatique** avec statistiques

## 🛠️ Technologies

- **React 18** avec hooks modernes
- **CSS3** avec animations et design responsive
- **Web Speech API** pour la reconnaissance vocale
- **Vite** pour le développement et le build

## 🚀 Installation

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm start

# Build pour la production
npm run build
```

## 💡 Utilisation

1. **Démarrer l'inspection** : Cliquez sur le bouton "🎤 Répondre"
2. **Répondre vocalement** : Parlez clairement en français
3. **Confirmer la réponse** : Validez ou réenregistrez si nécessaire
4. **Continuer l'inspection** : Passez automatiquement à la question suivante
5. **Exporter le rapport** : Téléchargez les résultats en fin d'inspection

## 📱 Compatibilité

- **Navigateurs supportés** : Chrome, Edge, Safari (avec Web Speech API)
- **Langues** : Français (fr-FR) optimisé pour le vocabulaire technique
- **Appareils** : Desktop, tablette, mobile

## 🔧 Types de Questions

### Questions Numériques
- Validation automatique des valeurs
- Contrôle des tolérances (ex: plaquettes ≥ 3mm)
- Unités de mesure incluses

### Questions Oui/Non
- Reconnaissance des variantes ("oui", "non", "yes", "no")
- Feedback immédiat sur le statut

### Questions Descriptives
- Analyse du sentiment pour évaluation automatique
- Détection des mots-clés critiques

## 📊 Système de Statuts

- **🟢 Conforme** : Élément en bon état
- **🔴 Non conforme** : Réparation nécessaire
- **🟡 À surveiller** : Attention requise
- **⚪ Indéterminé** : Réponse non claire

## 🚀 Déploiement

L'application est prête pour le déploiement sur :
- **Netlify** (configuration incluse)
- **Vercel**
- **GitHub Pages**
- **Serveur web statique**

## 🔒 Confidentialité

- **Traitement local** : Aucune donnée vocale n'est envoyée sur internet
- **Web Speech API native** : Utilise l'API du navigateur
- **Stockage temporaire** : Les données restent dans la session

## 📝 Licence

Projet open source - Licence MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Ajouter de nouveaux points de contrôle

---

**Développé pour simplifier les inspections mécaniques avec la technologie vocale moderne.**