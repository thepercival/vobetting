/**
 * Created by coen on 16-2-17.
 */

import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssociationRepository } from '../../../domain/association/repository';
import { Association } from '../../../domain/association';
import { CompetitionRepository } from '../../../domain/competition/repository';
import { Competition } from '../../../domain/competition';
import { SeasonRepository } from '../../../domain/season/repository';
import { Season } from '../../../domain/season';
import { CompetitionSeasonRepository } from '../../../domain/competitionseason/repository';
import { CompetitionSeason } from '../../../domain/competitionseason';

@Component({
    moduleId: module.id,
    selector: 'competitionseason-add-modal-content',
    templateUrl: 'add.html'
})
export class CompetitionSeasonAddModalContent implements OnInit{
    model: any = {};
    loading = false;
    error = '';
    associations: Association[];
    competitions: Competition[];
    seasons: Season[];

    constructor(
        public activeModal: NgbActiveModal,
        private repos: CompetitionSeasonRepository,
        private associationRepos: AssociationRepository,
        private competitionRepos: CompetitionRepository,
        private seasonRepos: SeasonRepository
    ) {

    }

    ngOnInit() {

        this.associationRepos.getObjects()
            .subscribe(
                /* happy path */ associations => {
                    this.associations = associations;
                },
                /* error path */ e => {
                },
                /* onComplete */ () => {
                }
            );
        this.competitionRepos.getObjects()
            .subscribe(
                /* happy path */ competitions => {
                    this.competitions = competitions;
                },
                /* error path */ e => {
                },
                /* onComplete */ () => {
                }
            );
        this.seasonRepos.getObjects()
            .subscribe(
                /* happy path */ seasons => {
                    this.seasons = seasons;
                },
                /* error path */ e => {
                },
                /* onComplete */ () => {
                }
            );
    }

    add(): boolean {
        let json = { "associationid": this.model.association.getId(), "competitionid": this.model.competition.getId(), "seasonid": this.model.season.getId() };

        this.repos.createObject( json )
            .subscribe(
                /* happy path */ competitionseason => {
                    this.activeModal.close(competitionseason);
                },
                /* error path */ e => { this.error = e; this.loading = false; },
                /* onComplete */ () => this.loading = false
            );

        return false;
    }
}
