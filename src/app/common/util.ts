import {Observable} from "rxjs";
import {HttpEvent} from "@angular/common/http";

export function createHttpObservable(url: string): Observable<HttpEvent<any>> {
  return Observable.create(observer => {
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(
        body => {
          observer.next(body);
          observer.complete();
        }
      ).catch(err => {
      observer.error(err);
    });
  });
}
