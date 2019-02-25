import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Association, AssociationRepository, Competitor, CompetitorRepository, SportConfig } from 'ngx-sport';
import { Subscription } from 'rxjs';

import { IAlert } from '../../app.definitions';

@Component({
  selector: 'app-competitor-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class CompetitorListComponent implements OnInit, OnDestroy {

  protected sub: Subscription;
  competitors: Competitor[] = [];
  alert: IAlert;
  processing = true;
  associations: Association[];
  association: Association;
  useExternal = SportConfig.useExternal;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private competitorRepos: CompetitorRepository,
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
    this.competitorRepos.getObjects(association)
      .subscribe(
        /* happy path */(competitors: Competitor[]) => {
          this.competitors = competitors.sort((t1, t2) => {
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

  linkToExtern(competitor: Competitor) {
    this.router.navigate(
      ['/admin/competitor/extern', this.association.getId(), competitor.getId()],
      {
        queryParams: {
          returnAction: '/admin/competitor',
          returnParam: this.association.getId()
        }
      }
    );
  }


  add() {
    this.linkToEdit();
  }

  edit(competitor: Competitor) {
    this.linkToEdit(competitor);
  }

  linkToEdit(competitor?: Competitor) {
    this.router.navigate(
      ['/admin/competitor/edit', this.association.getId(), competitor ? competitor.getId() : 0],
      {
        queryParams: {
          returnAction: '/admin/competitor',
          returnParam: this.association.getId()
        }
      }
    );
  }

  remove(competitor: Competitor) {
    this.setAlert('info', 'competitor verwijderen..');
    this.processing = true;

    this.competitorRepos.removeObject(competitor)
      .subscribe(
        /* happy path */ competitorRes => {
          const index = this.competitors.indexOf(competitor);
          if (index > -1) {
            this.competitors.splice(index, 1);
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
