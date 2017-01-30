/**
 * Created by coen on 30-1-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import { AssociationRepository } from '../repositories/association';
import { Association } from '../domain/association';
import { VoetbalInterface } from '../domain/interface';

// import {GlobalEventsManager} from "../../global-events-manager";

@Component({
    moduleId: module.id,
    selector: 'associations',
    templateUrl: 'associations.html'/*,
    styleUrls: [ 'association.css' ]*/
})

export class AssociationsComponent implements OnInit{
    @Input()
    associations: VoetbalInterface[];

    constructor(
        private repos: AssociationRepository,
        private route: ActivatedRoute,
        private location: Location,
        // private globalEventsManger: GlobalEventsManager
    ) {}

    ngOnInit(): void {

        this.repos.getObjects()
            .subscribe(
                /* happy path */ associations => {
                    this.associations = associations;
                    console.log( this.associations );
                },
                /* error path */ e => {},
                /* onComplete */ () => {}
            );
    }

    goBack(): void {
        this.location.back();
    }
}
