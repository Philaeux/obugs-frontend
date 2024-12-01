import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EntryMessage, ApiError, User } from 'src/app/models/models';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@UntilDestroy()
@Component({
    selector: 'app-app-manage',
    templateUrl: './app-manage.component.html',
    styleUrls: ['./app-manage.component.scss'],
    standalone: false
})
export class AppManageComponent implements OnInit {

  softwareId: string | null = null;
  patches: EntryMessage[] = [];
  userNameFilter: string = "";

  users: User[] = [];
  selectedUser: User | null = null;
  selectedIsMod = false;
  selectedIsCurator = false;
  selectedIsEditor = false;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.softwareId = this.route.snapshot.paramMap.get("software");
    if (this.softwareId == null) this.router.navigate([`/apps`]);

    this.auth.currentUser$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user === undefined) return;
      if (user === null) {
        this.router.navigate(['/s/' + this.softwareId]);
      }
    })

    this.title.setTitle('oBugs ' + this.softwareId + ' - Manage')
  }

  updateTitle(): void {
    if (this.patches.length != 0) {
      this.title.setTitle('(' + this.patches.length + ') oBugs ' + this.softwareId + ' - Manage')
    } else {
      this.title.setTitle('oBugs ' + this.softwareId + ' - Manage')
    }
  }

  refreshPatchList() {
    if (this.softwareId == null) return
    this.api.patchListOpen(this.softwareId).subscribe((response) => {
      this.patches = response.data.openPatches
      this.updateTitle()
    })
  }

  onPatchSelect(row: EntryMessage) {
    const url = this.router.createUrlTree(['/s/' + row.entry.softwareId + '/' + row.entry.id]).toString();
    window.open(url, '_blank');
  }

  refreshUserList() {
    this.api.users(this.userNameFilter).subscribe((response) => {
      this.users = response.data.users
    })
  }

  onUserSelect(row: User) {
    this.selectedUser = row;
    this.selectedIsMod = this.auth.isUserRole(this.selectedUser, this.softwareId, 1)
    this.selectedIsCurator = this.auth.isUserRole(this.selectedUser, this.softwareId, 2)
    this.selectedIsEditor = this.auth.isUserRole(this.selectedUser, this.softwareId, 4)
  }

  onRoleChange(role: number, e: MatCheckboxChange) {
    if (this.selectedUser == null || this.softwareId == null) return

    this.api.userRoleChange(this.selectedUser.id, this.softwareId, role, e.checked).subscribe((response) => {
      const result = response.data!.changeRole
      if (result.__typename === 'ApiError') {
        const error = result as ApiError
        console.log(error.message)
      }
    })
  }
}
