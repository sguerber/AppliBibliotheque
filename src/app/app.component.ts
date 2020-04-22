import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mon-projet-biblio';
  
  constructor ()
  {
	 
	  const firebaseConfig = {
	  apiKey: "AIzaSyDf21lJDIi9ve2Jr4OgDBIcEghx4qNBviM",
	  authDomain: "angularbiblio-ae427.firebaseapp.com",
	  databaseURL: "https://angularbiblio-ae427.firebaseio.com",
	  projectId: "angularbiblio-ae427",
	  storageBucket: "angularbiblio-ae427.appspot.com",
	  messagingSenderId: "799405093468",
	  appId: "1:799405093468:web:3117a545a38fc174fb2c99",
	  measurementId: "G-DS8REM4JFE"
	  };
	 
	 firebase.initializeApp(firebaseConfig); 
  }
}
