import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {UserStats} from '../../types/user-stats';
import {LeaderboardService} from '../../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  isCollapsed = true;
  leaderboard$: Observable<UserStats[]>
  models = [
      {
          name: 'Humans',
          '10&12': '90',
          '5&6': '92',
          '5&6SWOW': '95'
      },
      {
        name: 'CLIP-RN50x64/14',
        '10&12': '38',
        '5&6': '50',
        '5&6SWOW': '70'
      },
      {
          name: 'CLIP-VIT-L/14',
          '10&12': '40',
          '5&6': '53',
          '5&6SWOW': '74'
      },
      {
          name: 'CLIP-VIT-B/32',
          '10&12': '41',
          '5&6': '53',
          '5&6SWOW': '74'
      },
      {
          name: 'CLIP-RN50',
          '10&12': '35',
          '5&6': '50',
          '5&6SWOW': '73'
      },
      {
          name: 'CLIP-VIL',
          '10&12': '15',
          '5&6': '47',
          '5&6SWOW': '66'
      },
      {
          name: 'ViLT',
          '10&12': '52',
          '5&6': '55',
          '5&6SWOW': '59'
      },
      {
          name: 'X-VLM',
          '10&12': '46',
          '5&6': '53',
          '5&6SWOW': '68'
      }
  ].sort((a,b) => Number(b['10&12']) - Number(a['10&12']))

  constructor(private leaderboardService: LeaderboardService) {
    this.leaderboard$ = this.leaderboardService.leaderboard;
  }

  ngOnInit(): void {
  }

}
