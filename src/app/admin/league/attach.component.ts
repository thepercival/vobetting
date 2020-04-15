import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeagueRepository } from '../../lib/ngx-sport/league/repository';

import { IAlert } from '../../common/alert';
import { MyNavigation } from 'src/app/common/navigation';
import { ExternalObjectRepository } from 'src/app/lib/external/repository';
import { ExternalSourceRepository } from 'src/app/lib/external/source/repository';
import { ExternalSource } from 'src/app/lib/external/source';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceSelectModalComponent } from '../externalsource/selectmodal.component';
import { AttacherRepository } from 'src/app/lib/attacher/repository';
import { JsonAttacher } from 'src/app/lib/attacher/mapper';
import { League } from 'ngx-sport';

@Component({
  selector: 'app-league-attach',
  templateUrl: './attach.component.html',
  styleUrls: ['./attach.component.css']
})
export class LeagueAttachComponent implements OnInit {
  public alert: IAlert;
  public processing = true;
  public externalprocessing = false;
  league: League;
  externalSource: ExternalSource;
  externalLeagues: League[];

  constructor(
    private leagueRepos: LeagueRepository,
    private externalObjectRepos: ExternalObjectRepository,
    private externalSourceRepos: ExternalSourceRepository,
    private attacherRepos: AttacherRepository,
    private route: ActivatedRoute,
    protected myNavigation: MyNavigation,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.leagueRepos.getObject(+params.id)
        .subscribe(
        /* happy path */(league: League) => {
            this.league = league;
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );

      this.externalSourceRepos.getObject(+params.externalSourceId)
        .subscribe(
        /* happy path */(externalSource: ExternalSource) => {
            this.externalSource = externalSource;
            this.updateExternalLeagues();
          },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
        );
    });
  }

  protected updateExternalLeagues() {
    this.externalprocessing = true;
    this.externalObjectRepos.getLeagues(this.externalSource)
      .subscribe(
          /* happy path */(externalLeagues: League[]) => {
          this.externalLeagues = externalLeagues.sort((a, b) => a.getName() < b.getName() ? -1 : 0);
          this.externalprocessing = false;
        },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
      );
  }

  openExternalSource() {
    this.resetAlert();
    const modalRef = this.modalService.open(ExternalSourceSelectModalComponent);
    modalRef.componentInstance.showDeselect = false;
    modalRef.result.then((result) => {
      if (result instanceof ExternalSource) {
        this.externalSource = result;
        localStorage.setItem('externalSourceId', '' + result.getId());
        if (this.externalSource.hasLeagueImplementation() === false) {
          this.setAlert('danger', 'deze externe bron heeft geen leagues');
          return;
        }
        this.processing = true;
        this.updateExternalLeagues();
      }
    }, (reason) => {
    });
  }

  attach(externalLeague: League) {
    this.processing = true;
    const json: JsonAttacher = {
      importableId: +this.league.getId(),
      externalId: '' + externalLeague.getId()
    };
    this.attacherRepos.createLeague(json, this.externalSource)
      .subscribe(
        /* happy path */() => {
          this.navigateBack();
        },
        /* error path */ e => { this.processing = false; this.setAlert('danger', e); },
        /* onComplete */() => { this.processing = false; }
      );
  }

  navigateBack() {
    this.myNavigation.back();
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type, message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}

