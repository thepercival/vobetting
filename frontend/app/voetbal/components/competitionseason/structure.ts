/**
 * Created by coen on 27-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/map';

import { CompetitionSeason } from '../../domain/competitionseason';
import { CompetitionSeasonRepository } from '../../domain/competitionseason/repository';

@Component({
    moduleId: module.id,
    selector: 'competitionseason-structure',
    templateUrl: 'structure.html'/*,
     styleUrls: [ 'competitionseason.css' ]*/

})

export class CompetitionSeasonStructureComponent implements OnInit{
    @Input() competitionseason: CompetitionSeason;
    loading: boolean = false;
    message: any = null;

    constructor(
        private repos: CompetitionSeasonRepository,
        private route: ActivatedRoute

    ) {

    }

    ngOnInit(): void {

        this.route.params
            .switchMap((params: Params) => this.repos.getObject(+params['id']))
            .subscribe(competitionseason => {
                    this.competitionseason = competitionseason
                },
                    e => { this.message = { "type": "danger", "message": e}; }
            );
    }
}