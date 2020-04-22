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

  // Méthode pour supprimer un livre
  removeBook(book: Book) {
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