import { Injectable } from '@angular/core';

import * as firebase from 'firebase';

@Injectable()
export class AuthService {

	// Méthode pour créer un nouvel utilisateur 
	// Cette méthode prend en paramètres un email et un mdp et 
	// retourne une Promise (si création réussie) ou sera rejetée avec un message d'erreur (si création non réussie)
	createNewUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
	}

	// Méthode pour connecter un utilisateur déjà existant
	signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
	}
	
	// Méthode pour déconnecter un utilisateur
	signOutUser() {
    firebase.auth().signOut();
	}
	
}
