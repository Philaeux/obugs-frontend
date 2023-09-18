import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(

  ) { }

  ngOnInit(): void {

  }

  sections: section[] = [
    {
      "title": "Why oBugs?",
      "content": "test"
    }
  ]
}

interface section {
  title: string;
  content: string;
}
