import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {
    // this.http
    //   .get('https://etax.chanwanich.com/APIspec/api/v1/users')
    //   .subscribe(res => console.log(res));
  }

  private address: string = 'https://etax.chanwanich.com/APIspec/';

  requestGet(url: string) {
    return this.http
      .get(`${this.address}${url}`)
      // .pipe(catchError(err => this.handleError(err)));
  }

  requestPost(url: string, body: any) {
    return this.http
      .post(`${this.address}${url}`, body)
      // .pipe(catchError(err => this.handleError(err)));
  }

  // private handleError(errorResponse: HttpErrorResponse): Observable<any> {

  // }
}
