# features à faire :
 	- deplacer sensibilité, glycémie cible, coefficient par repas dans une view settings
 	- créer un onboarding pour init les settings + autorisation notification
  
  - passer en type safe


 	- recup la dernière injection depuis la db
 	- afficher calculatrice sur une page sans scroll
 	- bouton d'injection 100% de la dose + boutton 70%/30% avec confirmation de lancement minuteur 1h ou 2h
 		- workflow :
 			- clique boutton 100% -> modale confirmation d'injection
 			- clique bouton 70%/30% -> modale confirmation avec checkbox rappel 1h ou 2h -> lancement d'un timer visible dans le bandeaux en haut avec notification à la fin
 	- une view avec l'historique des calculs

premium (si traction): calculer les glucides et l'ig (via un agent convex) de mon repas à partir de la description et pouvoir lancer la calculatrice
  - rajouter la page avec juste une demande d'email qui va sync avec le client id

# Keep
- admin key : self-hosted-convex|0152260355bf6ae6c0920f2794e2df982bf5482409e4f02b724b1aa763c9f9796d5e461ab5
- convex dashboard: http://dashboard-sg80owk4ss8soow8w48ck0o8.72.61.194.79.sslip.io/
- convex backend : http://backend-sg80owk4ss8soow8w48ck0o8.72.61.194.79.sslip.io:3210
- corriger problème de compatibilité de dépendances : npx expo-doctor npx expo install --fix

# Deadline
il faut que cette app soit déployé d'ici dimanche pour commencer le marketing

# distractions/questions/FOMO
- bun c'est mieux ? à tester

- c'est quoi les sous agents ? surtout pour de la recherche avancé, ça reduit le context window

- convex je dois pratiquer pour maitriser la base ?
  - apperement c'est fonctions lambda en typescript qui reagissent au changement de la db comme usestate

- comment ne pas avoir a explorer le code a chaque instance de claude ?

- workflow agentic coding
  - en gros web dev cody regarde son app trouve des features/bugs, lance un claude
  - j'ai une playlist youtube pour ça 

- est ce que je relis le code et après je teste, ou l'inverse ?
  - ça bug et comme je n'ai pas relu je ne peux pas prompter precisement donc ça va dans tout les sens