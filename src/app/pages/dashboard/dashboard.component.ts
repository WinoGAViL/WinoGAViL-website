import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as d3 from 'd3';
import {UserDashboard} from '../../types/user-dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{
  data = [{category: 'Fool the AI', score: 0}, {category: 'Solvable By Humans', score: 0}, {category: 'Association Solved', score: 0}];
  basicData: any;
  horizontalOptions: any
  @Output() backarrow$ = new EventEmitter<void>()

  constructor() {
    this.basicData = {
      labels: this.data.map((x => x.category)),
      datasets: [
        {
          label: 'scores',
          backgroundColor: '#fbdddf',
          data: this.data.map((x => x.score))
        }
      ]
    };

    this.horizontalOptions = {
      legend: {
        display: false,
        labels: {
          fontColor: '#495057'
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 100,
            fontColor: '#495057'
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: 14,
            fontColor: '#495057',

          }
        }]
      }
    };
  }

  @Input()
  set dashboardData(userData: UserDashboard) {
    if (userData && this.isUserDataChanged(userData)) {
      this.data = [
        {category: 'Fool the AI', score: userData['fool-the-ai'] || 0},
        {category: 'Solvable By Humans', score: userData['solvable-by-humans'] || 0},
        {category: 'Association Solved', score: userData['solving-existing-associations'] || 0}
      ];
      this.basicData = {
        labels: this.data.map((x => x.category)),
        datasets: [
          {
            label: 'scores',
            backgroundColor: '#fbdddf',
            data: this.data.map((x => x.score))
          }
        ]
      };
    }
  }



  isUserDataChanged(newUserData: UserDashboard) {
    return newUserData['fool-the-ai'] !== this.data[0]?.score ||
        newUserData['solvable-by-humans'] !== this.data[1]?.score ||
        newUserData['solving-existing-associations'] !== this.data[2]?.score
  }
}
