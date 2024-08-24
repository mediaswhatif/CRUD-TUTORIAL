import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { concatMap, filter, Observable, of, Subject } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  userLogged$: Subject<true> = new Subject();
  data$ = of(1, 2, 3, 5)

  constructor(private http: HttpClient) {
    this.fetchAPI()
    this.data$.pipe(
      filter(data => data != 2)
    ).subscribe(data => {
      console.log(data);
    }, err => {
      console.error(err);
    })
  }

  login() {
    this.userLogged$.next(true);
  }

  getUserDetails(): Observable<any> {
    return this.http.get('https://api.example.com/userinfo');
  }

  getMessages(): Observable<any> {
    return this.http.get('https://api.example.com/messages');
  }

  getPosts(): Observable<any> {
    return this.http.get('https://api.example.com/posts');
  }

  getComments(): Observable<any> {
    return this.http.get('https://api.example.com/comments');
  }

  fetchAPI() {
    this.getUserDetails().pipe(concatMap((data: any) => {
      return this.getPosts()
    }, err => {
      return of()
    })).pipe(concatMap((data: any) => {
      if (data.status === 200) {
        //  fetch user details
      }
      else {
        console.log('Error fetching data')
      }
      return this.getComments()
    }, err => {
      return of()
    })).pipe(concatMap((data: any) => {
      return this.getMessages()
    }, err => {
      return of()
    })).pipe(concatMap((data: any) => {
      return this.getComments()
    }, err => {
      return of()
    })).subscribe((data: any) => {

    }, err => {
      console.log('Error fetching data', err)
    }

    )

  }

}