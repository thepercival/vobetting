/**
 * Created by coen on 10-2-17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { CompetitionSeason } from '../../domain/competitionseason';
import { Association } from '../../domain/association';
import { Competition } from '../../domain/competition';
import { Season } from '../../domain/season';
import { CompetitionSeasonRepository } from '../../domain/competitionseason/repository';
import { AssociationRepository } from '../../domain/association/repository';
import { CompetitionRepository } from '../../domain/competition/repository';
import { SeasonRepository } from '../../domain/season/repository';
import { CompetitionSeasonAddModalContent } from './modal/add';
import { CompetitionSeasonEditModalContent } from './modal/edit';
import { CompetitionSeasonAddExternalModalContent } from './modal/addexternal';
import { ExternalSystem } from '../../domain/external/system';
import { ExternalObject } from '../../domain/external/object';
import { ExternalSystemRepository } from '../../domain/external/system/repository';
import { ExternalObjectRepository } from '../../domain/external/object/repository';

@Component({
    moduleId: module.id,
    selector: 'competitionseasons-external',
    templateUrl: 'external.html'/*,
     styleUrls: [ 'competitionseason.css' ]*/

})

export class CompetitionSeasonsExternalComponent implements OnInit{
    @Input()
    competitionseasons: CompetitionSeason[];
    associations: Association[];
    competitions: Competition[];
    seasons: Season[];

    externalcompetitionseasons: CompetitionSeason[];
    externalsystem: ExternalSystem;
    externalsystems: ExternalSystem[];
    externalobjects: ExternalObject[];
    loading: boolean = false;
    message: any = null;
    classname: string;

    constructor(
        private repos: CompetitionSeasonRepository,
        private associationRepos: AssociationRepository,
        private competitionRepos: CompetitionRepository,
        private seasonRepos: SeasonRepository,
        private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        private reposExternalSystem: ExternalSystemRepository,
        private externalObjectRepository: ExternalObjectRepository
        // private globalEventsManger: GlobalEventsManager
    ) {
        this.classname = CompetitionSeason.classname;
    }

    ngOnInit(): void {

        this.repos.getObjects()
            .subscribe(
                /* happy path */ competitionseasons => {
                    this.competitionseasons = competitionseasons;
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );

        this.reposExternalSystem.getObjects()
            .subscribe(
                /* happy path */ externalsystems => {
                    this.externalsystems = externalsystems.filter(
                        externalsystem => externalsystem.hasAvailableExportClass( this.classname )
                    );
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );

        this.associationRepos.getObjects()
            .subscribe(
                /* happy path */ associations => {
                    this.associations = associations;
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );

        this.competitionRepos.getObjects()
            .subscribe(
                /* happy path */ competitions => {
                    this.competitions = competitions;
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );

        this.seasonRepos.getObjects()
            .subscribe(
                /* happy path */ seasons => {
                    this.seasons = seasons;
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => {}
            );
    }

    onSelectExternalSystem( externalSystem: any ): void {
        this.externalsystem = externalSystem;
        this.externalcompetitionseasons = [];
        externalSystem.getCompetitionSeasons()
            .subscribe(
                /* happy path */ competitionseasons => {
                    for( let competitionseason of competitionseasons ) {
                        this.externalcompetitionseasons.push(competitionseason);
                    }
                    this.selectExternalSystemHelper( competitionseasons, this.competitionseasons);
                },
                /* error path */ e => { this.message = { "type": "danger", "message": e}; },
                /* onComplete */ () => { console.log('complete'); }
            );
    }

    selectExternalSystemHelper( externalObjects, internalObjects ) {

        for( let externalObject of externalObjects ) {
            console.log(externalObject.getId());
            let foundAppObjects = internalObjects.filter( objectFilter => objectFilter.hasExternalid( externalObject.getId().toString(), this.externalsystem ) );

            let foundAppObject = foundAppObjects.shift();
            if ( foundAppObject ){
                let jsonExternal = { "externalid" : foundAppObject.getId(), "externalsystem": null };
                externalObject.addExternals(this.externalObjectRepository.jsonArrayToObject([jsonExternal],externalObject));
            }

        }
    }

    onAdd(): void {
        this.message = null;
        const modalRef = this.modalService.open(CompetitionSeasonAddModalContent, { backdrop : 'static' } );

        modalRef.result.then((competitionseason) => {
            this.competitionseasons.push( competitionseason );
            this.message = { "type": "success", "message": "competitieseizoen("+competitionseason.getName()+") toegevoegd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onEdit( competitionseason: CompetitionSeason ): void {
        this.message = null;
        /*let competitionseason = this.competitionseasons.find( function(item: CompetitionSeason) {
         return ( item.getId() == competitionseasonId );
         }, competitionseasonId);*/

        if ( competitionseason == null) {
            this.message = { "type": "danger", "message": "de competitieseizoen kan niet gewijzigd worden"};
        }

        const modalRef = this.modalService.open(CompetitionSeasonEditModalContent, { backdrop : 'static' } );
        modalRef.componentInstance.competitionseason = competitionseason;
        modalRef.result.then((competitionseason) => {
            this.message = { "type": "success", "message": "competitieseizoen("+competitionseason.getName()+") gewijzigd"};
        }/*, (reason) => {
         modalRef.closeResult = reason;
         }*/);
    }

    onAddExternal( externalcompetitionseason: CompetitionSeason): void {
        this.message = null;
        // const modalRef = this.modalService.open(CompetitionSeasonAddExternalModalContent, { backdrop : 'static' } );
        //
        // modalRef.componentInstance.competitionseasons = this.competitionseasons.filter(
        //     competitionseason => !competitionseason.hasExternalid( externalcompetitionseason.getId().toString(), this.externalsystem )
        // );
        //
        // modalRef.result.then((competitionseason) => {
        //     this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), competitionseason, externalcompetitionseason.getId().toString(), this.externalsystem )
        //         .subscribe(
        //             /* happy path */ externalobject => {
        //                 this.onAddExternalHelper( competitionseason, externalobject, externalcompetitionseason );
        //                 this.message = { "type": "success", "message": "externe competitieseizoen "+externalcompetitionseason.getName()+" gekoppeld aan ("+competitionseason.getName()+") toegevoegd"};
        //             },
        //             /* error path */ e => { this.message = { "type": "success", "message": e}; this.loading = false; },
        //             /* onComplete */ () => this.loading = false
        //         );
        //
        // }/*, (reason) => {
        //  modalRef.closeResult = reason;
        //  }*/);
    }

    // onAddExternalHelper( competitionseason: CompetitionSeason, externalobject: ExternalObject, externalcompetitionseason: CompetitionSeason ): void {
    //     // @todo following code should move to service
    //     // add to internal
    //     competitionseason.getExternals().push(externalobject);
    //     // add to external
    //     let jsonExternal = { "externalid" : competitionseason.getId(), "externalsystem": null };
    //     externalcompetitionseason.addExternals(this.externalObjectRepository.jsonArrayToObject([jsonExternal],externalcompetitionseason));
    // }

    onRemove( externalObject: ExternalObject ): void
    {
        // // @todo following code should move to service
        // // remove from internal
        // let internalcompetitionseason = this.getCompetitionSeason( externalObject.getImportableObject() );
        // if ( internalcompetitionseason == null ) {
        //     this.message = { "type": "danger", "message": "interne competitieseizoen niet gevonden"};
        //     return;
        // }
        //
        // let internalexternal = internalcompetitionseason.getExternal(externalObject.getImportableObject().getId(), this.externalsystem);
        //
        // this.externalObjectRepository.removeObject( this.repos.getUrlpostfix(), internalexternal )
        //     .subscribe(
        //         /* happy path */ retval => {
        //
        //             let indextmp = internalcompetitionseason.getExternals().indexOf(internalexternal);
        //             if (indextmp > -1) {
        //                 internalcompetitionseason.getExternals().splice(indextmp, 1);
        //             }
        //
        //             // remove from external
        //             let externals = externalObject.getImportableObject().getExternals();
        //             let index = externals.indexOf(externalObject);
        //             if (index > -1) {
        //                 externals.splice(index, 1);
        //             }
        //
        //             this.message = { "type": "success", "message": "externe competitieseizoen "+externalObject.getImportableObject().getName()+" ontkoppeld van ("+internalcompetitionseason.getName()+") toegevoegd"};
        //         },
        //         /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
        //         /* onComplete */ () => this.loading = false
        //     );
    }

    onImportExternalAll(): void
    {
        for( let externalcompetitionseason of this.externalcompetitionseasons) {
            this.importExternalHelper(externalcompetitionseason);
        }
    }

    onImportExternal(externalcompetitionseason): void
    {
        try {
            this.importExternalHelper(externalcompetitionseason);
        }
        catch( e ){
            this.message = { "type": "danger", "message": e};
        }
    }

    importExternalHelper(externalcompetitionseason): void
    {
        // // check if has internal
        // // if ( false ) { // update internal
        // //     // update
        // // }
        // // else { // add
        //
        // let externalAssociationId = externalcompetitionseason.getAssociation().getId().toString();
        // let appAssociation = this.associations.filter(
        //     association => false /*association.hasExternalid( externalAssociationId, this.externalsystem )*/
        // ).shift();
        // if ( appAssociation == null ){
        //     throw new Error("de bond, voor externid "+externalAssociationId+" en het externe systeem "+this.externalsystem.getName()+", kan niet gevonden worden, importeer eerst de bonden");
        // }
        //
        // let externalCompetitionId = externalcompetitionseason.getCompetition().getId().toString();
        // let appCompetition = this.competitions.filter(
        //     competition => competition.hasExternalid( externalCompetitionId, this.externalsystem )
        // ).shift();
        // if ( appCompetition == null ){
        //     throw new Error("de competitie, voor externid "+externalCompetitionId+" en het externe systeem "+this.externalsystem.getName()+", kan niet gevonden worden, importeer eerst de competities");
        // }
        //
        //
        // let externalSeasonId = externalcompetitionseason.getSeason().getId().toString();
        // let appSeason = this.seasons.filter(
        //     season => season.hasExternalid( externalSeasonId, this.externalsystem )
        // ).shift();
        // if ( appSeason == null ){
        //     throw new Error("het seizoen, voor externid "+externalSeasonId+" en het externe systeem "+this.externalsystem.getName()+", kan niet gevonden worden, importeer eerst de seizoenen");
        // }
        //
        // let json = {
        //     "associationid": appAssociation.getId(),
        //     "competitionid": appCompetition.getId(),
        //     "seasonid": appSeason.getId()
        // };
        //
        // this.repos.createObject( json )
        //     .subscribe(
        //         /* happy path */ competitionseason => {
        //             this.competitionseasons.push(competitionseason);
        //
        //             this.externalObjectRepository.createObject( this.repos.getUrlpostfix(), competitionseason, externalcompetitionseason.getId().toString(), this.externalsystem )
        //                 .subscribe(
        //                     /* happy path */ externalobject => {
        //                         this.onAddExternalHelper( competitionseason, externalobject, externalcompetitionseason );
        //                     },
        //                     /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
        //                     /* onComplete */ () => this.loading = false
        //                 );
        //
        //         },
        //         /* error path */ e => { this.message = { "type": "danger", "message": e}; this.loading = false; },
        //         /* onComplete */ () => this.loading = false
        //     );
        // // }
    }

    goBack(): void {
        this.location.back();
    }

    getExternalObjects(importableObject: any): ExternalObject[] {
        return this.externalObjectRepository.getExternalObjects(
            this.externalobjects,
            importableObject);
    }

    getExternalObject(externalid: string, importableObject: any): ExternalObject {
        return this.externalObjectRepository.getExternalObject(
            this.externalobjects,
            this.externalsystem,
            importableObject != null ? importableObject.getId().toString() : null,
            null)
    }

    private getCompetitionSeason( externalcompetitionseason: CompetitionSeason): CompetitionSeason
    {
        let externalObject = this.getExternalObject(externalcompetitionseason.getId().toString(),null);
        if ( externalObject == null ){
            return null;
        }
        return externalObject.getImportableObject();
    }

    getCompetitionSeasonName( externalcompetitionseason: CompetitionSeason): string
    {
        let internalcompetitionseason = this.getCompetitionSeason(externalcompetitionseason);
        if ( internalcompetitionseason == null ){
            return;
        }
        return internalcompetitionseason.getName();
    }
}