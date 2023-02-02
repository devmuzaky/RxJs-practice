import {Component, OnInit} from "@angular/core";
import {Course} from "../model/course";
import {Observable, of, timer} from 'rxjs';
import {catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable} from "../common/util";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {
  }

  ngOnInit() {

    const http$ = createHttpObservable('/api/courses');

    const courses$: Observable<Course[]> = http$
      .pipe(
        tap(() => console.log('HTTP request executed')),
        map(res => res['payload']),
        shareReplay(),
        retryWhen(errors => errors.pipe(
          tap(val => console.log('HTTP request failed, retrying in 1 second...')),
          delayWhen(() => timer(2000))
        ))
      );

    this.beginnerCourses$ = courses$.pipe(
      map(courses => courses
        .filter(course => course.category == 'BEGINNER'))
    );

    this.advancedCourses$ = courses$.pipe(
      map(courses => courses
        .filter(course => course.category == 'ADVANCED'))
    );
  }

}
