import {Component, OnInit} from '@angular/core';
import {PersistenceService, StorageType} from "angular-persistence";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public container;
  title = 'app';

  constructor(private persistenceService: PersistenceService) {
    this.container = persistenceService.createContainer('com.wasoftware.fitbit', {type: StorageType.SESSION});
  }

  ngOnInit(): void {
  }
}
