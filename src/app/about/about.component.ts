import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
    const http$ = Observable.create(observer => {
      fetch('/api/courses')
        .then(response => {
          return response.json()
        })
        .then(body => {
          observer.next();
          observer.complete();
        })
        .catch(error => {
          observer.error(error)
        })
    })
  }

}
