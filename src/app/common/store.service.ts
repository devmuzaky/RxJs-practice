import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Course} from "../model/course";
import {createHttpObservable} from "./util";
import {map} from "rxjs/operators";
import {fromPromise} from "rxjs/internal-compatibility";

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

  saveCourse(courseId: number, changes): Observable<any> {

    const courses = this.subject.getValue();

    const courseIndex = courses.findIndex(course => course.id == courseId);

    const newCourses = courses.slice(0);

    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    };
    this.subject.next(newCourses);

    return fromPromise(fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }
}
