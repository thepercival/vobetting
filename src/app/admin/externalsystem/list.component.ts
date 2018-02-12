import { ExternalSystem, ExternalSystemRepository } from 'ngx-sport';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-externalsystem-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ExternalSystemListComponent implements OnInit {

  externalSystems: ExternalSystem[];

  constructor(
    private router: Router,
    private externalSystemRepos: ExternalSystemRepository
  ) { }

  ngOnInit() {
    this.externalSystemRepos.getObjects()
      .subscribe(
        /* happy path */(externalSystems: ExternalSystem[]) => {
        this.externalSystems = externalSystems;
      },
        /* error path */ e => { },
        /* onComplete */() => { }
      );
  }

  add() {
    this.linkToEdit();
  }

  edit(externalSystem: ExternalSystem) {
    this.linkToEdit(externalSystem);
  }

  linkToEdit(externalSystem?: ExternalSystem) {
    this.router.navigate(
      ['/admin/externalsystem/edit', externalSystem ? externalSystem.getId() : 0],
      {
        queryParams: {
          returnAction: '/admin/externalsystem'
        }
      }
    );
  }

  remove(externalSystem: ExternalSystem) {
    // this.setAlert('info', 'scheidsrechter verwijderen..');
    // this.processing = true;

    // this.refereeRepository.removeObject(referee)
    //   .subscribe(
    //         /* happy path */ refereeRes => {

    //     const index = this.referees.indexOf(referee);
    //     if (index > -1) {
    //       this.referees.splice(index, 1);
    //     }
    //     const firstRound = this.structureService.getFirstRound();
    //     const planningService = new PlanningService(this.structureService);
    //     planningService.reschedule(firstRound.getNumber());
    //     this.structureRepository.editObject(firstRound, this.structureService.getCompetitionseason())
    //       .subscribe(
    //                     /* happy path */ roundRes => {
    //         this.updateRound.emit(roundRes);
    //         this.processing = false;
    //         this.setAlert('info', 'scheidsrechter verwijderd');
    //       },
    //             /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
    //             /* onComplete */() => this.processing = false
    //       );
    //   },
    //         /* error path */ e => { this.setAlert('danger', 'X' + e); this.processing = false; },
    // );
  }

}
