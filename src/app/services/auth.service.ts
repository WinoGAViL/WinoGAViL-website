import {Injectable} from '@angular/core';
// Import the functions you need from the SDKs you need
import firebase from 'firebase';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {BehaviorSubject, interval, Observable, Subscription, timer} from 'rxjs';
import OAuthProvider = firebase.auth.OAuthProvider;
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {UserDashboard} from '../types/user-dashboard';
import {AngularFireAuth} from '@angular/fire/auth';

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
const DASHBOARD_POLLING_INTERVAL = 60000;

@Injectable()
export class AuthService {
    userLoggedIn$ = new BehaviorSubject<boolean>(null)
    userToken$ = new BehaviorSubject<string>('');
    shouldLogin = false;
    userDashboard$ = new BehaviorSubject<UserDashboard>(null);
    userDashboardSubscription = new Subscription();

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
        } else {
            this.getUserDashboard().subscribe((userDashboard: UserDashboard) => {
                this.userDashboard$.next(userDashboard);
            });
        }

        this.afAuth.onAuthStateChanged((user) => {
            if(!user) {
                this.userLoggedIn$.next(false);
            }
            user && user.getIdToken().then(idToken => {
                console.log(this.userToken$.value)
                document.cookie = `userToken=${idToken};`
                document.cookie = `userEmail=${user.email};`
                this.userDashboard$.next(null);
                this.userDashboardSubscription.unsubscribe();
                this.userDashboardSubscription = timer(0, DASHBOARD_POLLING_INTERVAL).subscribe(() => {
                    this.getUserDashboard().subscribe((userDashboard: UserDashboard) => {
                        this.userDashboard$.next(userDashboard);
                    });
                });
                this.userLoggedIn$.next(!!user);
                this.userToken$.next(idToken)
            }).catch((err) => {
            })
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

    logout() {
        this.afAuth.signOut().then(r => console.log(r))
    }

    yahooAuth() {
        return this.AuthLogin(new OAuthProvider('yahoo.com'));
    }

    googleAuth() {
        return this.AuthLogin(new GoogleAuthProvider());
    }

    registerUser(username) {
        const url = `https://gvlab-backend.herokuapp.com/register_player`;
        return this.httpClient.post<any>(url, {player_name: username}, this.getAuthOptions())
    }

    isUserExists() {
        // https://gvlab-backend.herokuapp2.com/player_status
        const url = `https://gvlab-backend.herokuapp.com/player_status`;
        return this.httpClient.get<any>(url, this.getAuthOptions())
    }

    getAuthOptions() {
        const headers = new HttpHeaders()
            .set('UserDetails', JSON.stringify(this.extractCookies(document.cookie)))
            .set('Content-Type' , 'application/json')
        return {withCredentials: true, headers}
    }


    private getUserDashboard(): Observable<UserDashboard> {
        const url = `https://gvlab-backend.herokuapp.com/dashboard`
        return this.httpClient.get<UserDashboard>(url, this.getAuthOptions())
    }

    private AuthLogin(provider) {
        this.afAuth.signInWithRedirect(provider).then((result) => {
            console.log(result)
            console.log('successfully logged in')
        }).catch((error) => {
            console.log(error)
        })
    }

    private extractCookies(cookieStr): object {
        const output = {};
        cookieStr.split(/\s*;\s*/).forEach(function (pair) {
            pair = pair.split(/\s*=\s*/);
            output[pair[0]] = pair.splice(1).join('=');
        });
        return output;
    }

}
