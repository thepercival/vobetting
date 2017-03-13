/**
 * Created by coen on 15-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Season } from '../domain/season';
import { SeasonRepository } from '../domain/season/repository';
import { SeasonAddModalContent } from './season/modal/add';
import { SeasonEditModalContent } from './season/modal/edit';

// import {GlobalEventsManager} from "../../global-events-manager";

@Component({
    moduleId: module.id,
    selector: 'seasons',
    templateUrl: 'seasons.html'/*,
     styleUrls: [ 'season.css' ]*/

})

export class SeasonsComponent implements OnInit{
    @Input()
    seasons: Season[];

    message: any = null;

    constructor(
        private repos: SeasonRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal
        // private globalEventsManger: GlobalEventsManager
    ) {}

    ngOnInit(): void {

        this.repos.getObjects()
            .subscribe(
                /* happy path */ seasons => {
                    this.seasons = seasons;
                    console.log(seasons);
                },
                /* error path */ e => {},
                /* onComplete */ () => {}
            );
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(SeasonAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((season) => {
            this.seasons.push( season );
            this.message = { "type": "success", "message": "het seizoen("+season.getName()+") is toegevoegd"};
        }, (reason) => {
            if ( reason ){ this.message = { "type": "danger", "message": reason}; }
         });
    }

    onEdit( season: Season ): void {
        this.message = null;
        /*let season = this.seasons.find( function(item: Season) {
         return ( item.getId() == seasonId );
         }, seasonId);*/

        if ( season == null) {
            this.message = { "type": "danger", "message": "het seizoen kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(SeasonEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.season = season;
        modalRef.result.then((season) => {
            this.message = { "type": "success", "message": "het seizoen("+season.getName()+") is gewijzigd"};
        }, (reason) => {
            if ( reason ){ this.message = { "type": "danger", "message": reason}; }
        });
    }

    onRemove(seasonParam: Season): void {
        this.message = null;
        let season = this.seasons.find( function(item) {
            return ( item == this );
        }, seasonParam);
        if ( season == null) {
            this.message = { "type": "danger", "message": "het seizoen kan niet gevonden worden"};
        }
        this.repos.removeObject( season )
            .subscribe(
                /* happy path */ retval => {
                    let index = this.seasons.indexOf( season );
                    if (index > -1) {
                        this.seasons.splice(index, 1);
                        this.message = { "type": "success", "message": "het seizoen is verwijderd"};
                    }
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; }
            );
    }

    goBack(): void {
        this.location.back();
    }
}