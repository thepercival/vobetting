import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceRepository } from 'src/app/lib/ngx-sport/external/system/repository';
import { ExternalSource } from 'src/app/lib/externalsource';

@Component({
    selector: 'app-ngbd-modal-selectexternalsource',
    templateUrl: './selectmodal.component.html',
    styleUrls: ['./selectmodal.component.scss']
})
export class ExternalSourceSelectModalComponent implements OnInit {
    @Input() showDeselect: boolean;

    externalSources: ExternalSource[];
    processing = true;

    constructor(
        public activeModal: NgbActiveModal,
        private externalSourceRepos: ExternalSourceRepository
    ) {

    }

    ngOnInit() {
        this.externalSourceRepos.getObjects()
            .subscribe(
        /* happy path */(externalSources: ExternalSource[]) => {
                    this.externalSources = externalSources;
                    this.processing = false;
                },
        /* error path */ e => { },
        /* onComplete */() => { this.processing = false; }
            );
    }
}
