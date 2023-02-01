import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {noop, Observable} from "rxjs";

import {createHttpObservable} from "../common/util";
import {map} from "rxjs/operators";
import {response} from "express";

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {

  }
}
