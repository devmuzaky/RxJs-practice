import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {distinctUntilChanged, map, startWith, switchMap, throttleTime} from 'rxjs/operators';
import {forkJoin, fromEvent, Observable} from 'rxjs';
import {createHttpObservable} from "../common/util";
import {Course} from "../model/course";
import {Lesson} from "../model/lesson";
import {debug, RxJsLoggingLevel, setRxJsLoggingLevel} from "../common/debug";
import {StoreService} from "../common/store.service";


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  courseId: number;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', {static: true}) input: ElementRef;

  constructor(private route: ActivatedRoute,
              private storeService: StoreService) {
  }

  ngOnInit() {

    this.courseId = this.route.snapshot.params['id'];
    this.course$ = this.storeService.selectCourseById(this.courseId);



    // this.lessons$ = this.loadLessons();
    // forkJoin(this.course$, this.lessons$).pipe(
    //   // tap(([course, lessons]) => {
    //   //   console.log('course', course);
    //   //   console.log('lessons', lessons);
    //   // })
    //   debug(RxJsLoggingLevel.INFO, 'course and lessons value'),
    // );

    // setRxJsLoggingLevel(RxJsLoggingLevel.DEBUG);
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(''),
        debug(RxJsLoggingLevel.TRACE, 'search'),
        throttleTime(500),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search)),
        debug(RxJsLoggingLevel.DEBUG, 'lessons value'),
      );

  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(res => res["payload"]),
      );
  }

}
