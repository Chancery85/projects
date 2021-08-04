import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { GameService } from '../../services/game.service';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  gameData: Game[] = [];
  filteredGameData: Game[] = [];
  filter: FormControl;
  onDestroy$ = new Subject();
  loggedIn = false;

  constructor(private gameService: GameService) {
    this.gameService.fetchGames().pipe(
      tap(data => {
        this.gameData = data;
        this.filteredGameData = [...this.gameData];
      })
    ).subscribe();
  }

  filterData(input: string): Game[] {
    return this.filteredGameData = this.gameData.filter(item => item.name.toLowerCase().indexOf(input) !== -1);
  }

  ngOnInit(): void {
    this.filter = new FormControl('');
    this.filter.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap((input) => this.filterData(input)),
      takeUntil(this.onDestroy$),
    ).subscribe();
  }

  openAddGame(): void {

  }

  ngOnDestroy(): void {
    this.onDestroy$.unsubscribe();
  }

}
