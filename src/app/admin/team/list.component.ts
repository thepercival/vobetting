import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Association, AssociationRepository, SportConfig, Team, TeamRepository } from 'ngx-sport';
import { Subscription } from 'rxjs/Subscription';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-team-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class TeamListComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  teams: Team[] = [];
  alert: IAlert;
  processing = true;
  associations: Association[];
  association: Association;
  useExternal = SportConfig.useExternal;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private teamRepos: TeamRepository,
    private associationRepos: AssociationRepository
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.associationRepos.getObjects()
        .subscribe(
        /* happy path */(associations: Association[]) => {
            this.associations = associations.filter(association => association.getChildren().length === 0);
            const associationId = +params.associationid;
            if (associationId > 0) {
              this.association = this.associations.find(associationIt => associationIt.getId() === associationId);
              this.onSelectAssociation(this.association);
            } else {
              this.processing = false;
            }
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );
    });
  }

  onSelectAssociation(association: Association) {
    this.association = association;
    this.processing = true;
    this.teamRepos.getObjects(association)
      .subscribe(
        /* happy path */(teams: Team[]) => {
          this.teams = teams.sort((t1, t2) => {
            return t1.getName() > t2.getName() ? 1 : -1;
          });
        },
        /* error path */ e => { this.processing = false; },
        /* onComplete */() => { this.processing = false; }
      );
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  linkToExtern(team: Team) {
    this.router.navigate(
      ['/admin/team/extern', this.association.getId(), team.getId()],
      {
        queryParams: {
          returnAction: '/admin/team',
          returnParam: this.association.getId()
        }
      }
    );
  }


  add() {
    this.linkToEdit();
  }

  edit(team: Team) {
    this.linkToEdit(team);
  }

  linkToEdit(team?: Team) {
    this.router.navigate(
      ['/admin/team/edit', this.association.getId(), team ? team.getId() : 0],
      {
        queryParams: {
          returnAction: '/admin/team',
          returnParam: this.association.getId()
        }
      }
    );
  }

  remove(team: Team) {
    this.setAlert('info', 'team verwijderen..');
    this.processing = true;

    this.teamRepos.removeObject(team)
      .subscribe(
        /* happy path */ teamRes => {
          const index = this.teams.indexOf(team);
          if (index > -1) {
            this.teams.splice(index, 1);
          }
          this.resetAlert();
        },
        /* error path */ e => { this.setAlert('danger', 'X' + e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}
