import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(
    private title: Title
  ) {
    this.title.setTitle('oBugs - Community-driven bug tracker')
  }

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
