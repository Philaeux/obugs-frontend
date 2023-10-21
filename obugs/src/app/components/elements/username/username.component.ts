import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/models';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent {

  @Input()
  user: User | null = null;

  getUserName(user: User): string {
    if (user.githubName != null) return user.githubName
    return user.username
  }

  getUserProvider(user: User | null): string {
    if (user == null) return 'oBugs';
    if (user.githubName != null) return 'Github'
    return 'oBugs'
  }
}
