/**
 * Created by coen on 30-1-17.
 */

/**
 * Created by coen on 30-1-17.
 */

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import { AssociationRepository } from '../../repositories/association';
import { Association } from '../../domain/association';
import { VoetbalInterface } from '../../domain/interface';

// import {GlobalEventsManager} from "../../global-events-manager";

@Component({
    moduleId: module.id,
    selector: 'associations',
    templateUrl: 'association.html'/*,
     styleUrls: [ 'association.css' ]*/
})

export class AssociationDetailComponent implements OnInit, OnDestroy{
    @Input()
    association: VoetbalInterface;

    constructor(
        private repos: AssociationRepository,
        private route: ActivatedRoute,
        private location: Location,
        // private globalEventsManger: GlobalEventsManager
    ) {}

    ngOnInit(): void {

        this.route.params.forEach((params: Params) => {

            this.repos.getObject( params['id'] )
                .subscribe(
                    /* happy path */ association => {
                        this.association = association;
                        console.log( this.association );
                    },
                    /* error path */ e => {},
                    /* onComplete */ () => {}
                );
        });

        // this.globalEventsManger.showCompetitionSeasonDetailsInNavBar.emit( true );
    }

    ngOnDestroy(): void {

        // this.globalEventsManger.showCompetitionSeasonDetailsInNavBar.emit( false );
    }

    save(): void {
        /*this.cbjectService.update(this.object)
         .forEach(() => this.goBack());*/
    }


    goBack(): void {
        this.location.back();
    }
}
