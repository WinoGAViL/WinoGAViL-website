import {Injectable} from '@angular/core';
// Import the functions you need from the SDKs you need
import firebase from 'firebase';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject} from 'rxjs';
import OAuthProvider = firebase.auth.OAuthProvider;
import {HttpClient} from '@angular/common/http';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: 'AIzaSyCX4MQQRcVBstXjEpNKpAJQqPPkLKYxVas',
    authDomain: 'winogavil.firebaseapp.com',
    projectId: 'winogavil',
    storageBucket: 'winogavil.appspot.com',
    messagingSenderId: '450431362263',
    appId: '1:450431362263:web:569e7f67d684fdbf127c92',
    measurementId: 'G-QLM3JGLSQ8'
};

// Initialize Firebase

@Injectable()
export class AuthService {
    userLoggedIn$ = new BehaviorSubject<boolean>(null)
    userToken$ = new BehaviorSubject<string>('');
    shouldLogin = false;

    constructor(private afAuth: AngularFireAuth,
                private httpClient: HttpClient) {
        // const app = initializeApp(firebaseConfig);
        // const analytics = getAnalytics(app);
    }

    init() {
        console.log('AuthService initialized')
        const cookies = this.extractCookies(document.cookie);
        if (!(cookies.hasOwnProperty('userToken') && cookies.hasOwnProperty('userEmail'))) {
            this.shouldLogin = true;
        }

        this.afAuth.onAuthStateChanged((user) => {
            if(!user) {
                this.userLoggedIn$.next(false);
            }
            user.getIdToken().then(idToken => {
                console.log(this.userToken$.value)
                document.cookie = `userToken=${idToken};`
                document.cookie = `userEmail=${user.email};`
                this.userLoggedIn$.next(!!user);
                this.userToken$.next(idToken)
            }).catch((err) => {
                console.log(err);
            })
            console.log(user)
        })
    }

    login(provider: 'google' | 'yahoo') {
        switch (provider) {
            case 'google':
                return this.googleAuth();
            case 'yahoo':
                return this.yahooAuth();
        }
    }

    yahooAuth() {
        return this.AuthLogin(new OAuthProvider('yahoo.com'));
    }

    googleAuth() {
        return this.AuthLogin(new GoogleAuthProvider());
    }

    registerUser(username) {
        const url = `https://gvlab-backend.herokuapp.com/register_player`;
        return this.httpClient.post<any>(url, {player_name: username}, {withCredentials: true})
    }

    isUserExists() {
        const url = `https://gvlab-backend.herokuapp.com/player_status`;
        return this.httpClient.get<any>(url, {withCredentials: true})
    }

    private AuthLogin(provider) {
        this.afAuth.signInWithRedirect(provider).then((result) => {
            console.log(result)
            console.log('successfully logged in')
        }).catch((error) => {
            console.log(error)
        })
    }

    private extractCookies(cookieStr) {
        const output = {};
        cookieStr.split(/\s*;\s*/).forEach(function (pair) {
            pair = pair.split(/\s*=\s*/);
            output[pair[0]] = pair.splice(1).join('=');
        });
        return output;
    }

}
