import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Book } from '../models/book.model';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable()
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>();
  
  // On récupère la liste de livres mise à jour au démarrage de l'application
  constructor () 
  {
	this.getBooks();
  }

  // Méthode mettant à jour la liste des livres
  emitBooks() {
    this.booksSubject.next(this.books);
  }
  // Méthode enregistrant la liste des livres sur le node "books" de la bdd
  saveBooks() {
    firebase.database().ref('/books').set(this.books);
  }
  
  // Méthode pour récupérer la liste des livres du node "books" de la bdd
  // Cela prend en compte toutes les modifications faites avant l'appel à cette fonction
  // et ce, quel que ce soit l'appareil utilisé pour faire les modifications
  getBooks() {
    firebase.database().ref('/books')
      .on('value', (data: DataSnapshot) => {
          this.books = data.val() ? data.val() : [];
          this.emitBooks();
        }
      );
  }

  // Méthode pour récupérer un livre du node "books" en bdd (à partir de son id)
  // Note : la méthode once() fait une seule requête et retourne une Promise dont on retourne le contenu grâce à then()
  getSingleBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }
  
  // Méthode pour créer un nouveau livre
  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }
  
  // Méthode de téléchargement d'un fichier (ici ce sera une image/photo)
  // cette méthode est asynchrone: prend un objet de type File et retourne une Promise car le téléchargement d'un fichier prend du temps
  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
		// on donne au fichier un nom UNIQUE (Date.now() retourne le nombre de millisecondes passées depuis le 1er janvier 1970)
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
	}
	
	// Méthode qui supprime un livre et son image associée :
	// avec delete() il faut la référence du fichier à supprimer, 
	// on récupère celle-ci en passant l'URL du fichier à refFromUrl()
	removeBook(book: Book) {
    if(book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo removed!');
        },
        (error) => {
          console.log('Could not remove photo! : ' + error);
        }
      );
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if(bookEl === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
	}
  
}