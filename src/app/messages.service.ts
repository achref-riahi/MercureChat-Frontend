import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map, filter, catchError, switchMap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization' : 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http: HttpClient){}

  getMessages(): Observable<any>{
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer '+localStorage.getItem("token"));
    return this.http.get('http://localhost/api/messages', httpOptions).pipe(map(this.extractData));
  }

  subscribe(): Subject<any> {
    /**let url = new URL("http://127.0.0.1:3000/hub");
    url.searchParams.append('topic', 'http://localhost/api/messages/{id}');
    url.searchParams.append('topic', 'http://127.0.0.1/api/messages/{id}');
    let eventSource = new EventSource(url);*/

    let eventSource = new EventSource("http://127.0.0.1:3000/hub?topic=http://localhost/api/messages/{id}");
    let subscription = new Subject();
    eventSource.addEventListener("message", event=> {
      console.info("Got event: " + event);
      subscription.next(event);
    });
    return subscription;
  }


  postMessage(message): Observable<any>{
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer '+localStorage.getItem("token"));
    return this.http.post('http://localhost/api/messages',message, httpOptions)
      .pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
