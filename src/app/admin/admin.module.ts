import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AssociationListComponent } from './association/list.component';
import { AssociationEditComponent } from './association/edit.component';
import { ExternalSourceEditComponent } from './externalsource/edit.component';
import { ExternalSourceListComponent } from './externalsource/list.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  NgbAlertModule, NgbDatepickerModule, NgbTimepickerModule, NgbNavModule, NgbPopoverModule,
  NgbCollapseModule, NgbButtonsModule, NgbModalModule
} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AssociationMapper, SportMapper, SeasonMapper, LeagueMapper, CompetitionMapper, RefereeMapper, FieldMapper, SportConfigMapper, SportConfigService, SportScoreConfigService, StructureMapper, RoundNumberMapper, QualifyGroup, RoundMapper, PouleMapper, PlaceMapper, PlanningConfigMapper, SportScoreConfigMapper, CompetitorMapper, GameMapper, GamePlaceMapper, GameScoreMapper, PlanningMapper } from 'ngx-sport';
import { faTrashAlt, faCloud, faCompressAlt, faExpandAlt, faCheckCircle, faBezierCurve } from '@fortawesome/free-solid-svg-icons';
import { AssociationRepository } from '../lib/ngx-sport/association/repository';
import { ExternalSourceSelectModalComponent } from './externalsource/selectmodal.component';
import { ExternalSourceRepository } from '../lib/external/source/repository';
import { ExternalSourceMapper } from '../lib/external/source/mapper';
import { AttacherRepository } from '../lib/attacher/repository';
import { AttacherMapper } from '../lib/attacher/mapper';
import { ExternalObjectRepository } from '../lib/external/repository';
import { AssociationAttachComponent } from './association/attach.component';
import { SportListComponent } from './sport/list.component';
import { SportEditComponent } from './sport/edit.component';
import { SportAttachComponent } from './sport/attach.component';
import { SportRepository } from '../lib/ngx-sport/sport/repository';
import { SeasonListComponent } from './season/list.component';
import { SeasonEditComponent } from './season/edit.component';
import { SeasonAttachComponent } from './season/attach.component';
import { LeagueListComponent } from './league/list.component';
import { LeagueEditComponent } from './league/edit.component';
import { LeagueAttachComponent } from './league/attach.component';
import { SeasonRepository } from '../lib/ngx-sport/season/repository';
import { LeagueRepository } from '../lib/ngx-sport/league/repository';
import { CompetitionRepository } from '../lib/ngx-sport/competition/repository';
import { CompetitionListComponent } from './competition/list.component';
import { CompetitionEditComponent } from './competition/edit.component';
import { CompetitionAttachComponent } from './competition/attach.component';
import { CompetitionStructureComponent } from './competition/structure.component';
import { StructureRepository } from '../lib/ngx-sport/structure/repository';
import { QualifyGroupMapper } from 'ngx-sport/src/qualify/group/mapper';


@NgModule({
  declarations: [ExternalSourceSelectModalComponent,
    SportListComponent, SportEditComponent, SportAttachComponent,
    AssociationListComponent, AssociationEditComponent, AssociationAttachComponent,
    SeasonListComponent, SeasonEditComponent, SeasonAttachComponent,
    LeagueListComponent, LeagueEditComponent, LeagueAttachComponent,
    CompetitionListComponent, CompetitionEditComponent, CompetitionAttachComponent,
    CompetitionStructureComponent,
    ExternalSourceEditComponent, ExternalSourceListComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    NgbDatepickerModule, NgbTimepickerModule, NgbAlertModule, NgbPopoverModule, NgbCollapseModule, NgbModalModule, NgbButtonsModule,
    NgbNavModule,
    ReactiveFormsModule,
  ],
  entryComponents: [ExternalSourceSelectModalComponent],
  providers: [
    AttacherRepository,
    AttacherMapper,
    ExternalObjectRepository,
    ExternalSourceRepository,
    ExternalSourceMapper,
    SportRepository,
    SportMapper,
    AssociationRepository,
    AssociationMapper,
    SeasonRepository,
    SeasonMapper,
    LeagueRepository,
    LeagueMapper,
    CompetitionRepository,
    CompetitionMapper,
    RefereeMapper,
    FieldMapper,
    SportConfigMapper, SportScoreConfigMapper,
    SportConfigService, SportScoreConfigService,
    StructureRepository, StructureMapper, RoundNumberMapper, RoundMapper, PouleMapper, PlaceMapper, PlanningConfigMapper,
    CompetitorMapper, GameMapper, GamePlaceMapper, GameScoreMapper, PlanningMapper,
  ]
})
export class AdminModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTrashAlt, faCloud, faCompressAlt, faExpandAlt, faCheckCircle, faBezierCurve);
  }
}
