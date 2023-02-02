import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Course} from "../model/course";
import {createHttpObservable} from "./util";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable()

  init() {
    const http$ = createHttpObservable('/api/courses');
    http$
      .pipe(
        map(res => res['payload']))
      .subscribe(
        courses => this.subject.next(courses)
      );
  }

  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER')
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED')
  }

  filterByCategory(category: string) {
    return this.courses$.pipe(
      map(courses => courses
        .filter(course => course.category == category))
    );
  }

}
