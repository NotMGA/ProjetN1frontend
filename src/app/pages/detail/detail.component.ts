  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute } from '@angular/router';
  import { Observable, of } from 'rxjs';
  import { OlympicService } from 'src/app/core/services/olympic.service';
  import { Olympic } from 'src/app/core/models/Olympic';
  import { map } from 'rxjs/operators';
  import { Router } from '@angular/router';
  
  declare var CanvasJS: any;
  
  @Component({
    selector: 'app-pays',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
  })
  // init data 
  export class DetailComponant implements OnInit {
    public country: string = '';
    public olympics$: Observable<Olympic[]> = of([]);
    public Nbentry: number = 0;
    public Tnbmedals: number = 0;
    public Tnbathletes: number = 0;
  
    constructor(
      private route: ActivatedRoute,
      private olympicService: OlympicService,
      private router: Router
    ) {}
    // init the componants 
    //  get the country inside the URL and the data corresponding to the country 
    ngOnInit() {
      
      this.route.paramMap.subscribe(params => {
        this.country = params.get('country') ?? 'unknown';
        this.olympics$ = this.olympicService.getOlympics().pipe(
          map(olympics => olympics || []),
          map(olympics => olympics.filter(olympic => olympic && olympic.country === this.country))
        );
      });
      this.olympics$.subscribe(olympics => {
        // verify if we have data 
        if (olympics && olympics.length > 0) {
          const selectedCountry = olympics[0];
  
          if (selectedCountry) {
            this.calculateDetails(selectedCountry);
  
            const chartData = selectedCountry.participations.map(participation => ({
              label: participation.year.toString(),
              y: participation.medalsCount
            }));
  
            const chart = new CanvasJS.Chart("chartContainer", {
              animationEnabled: true,
              axisX: { title: "Years" },
              axisY: { title: "Nombre of medal" },
              data: [{
                type: "column",
                dataPoints: chartData
              }]
            });
  
            chart.render();
          } else {
            console.error(`No country found with the name : ${this.country}`);
          }
        } else {
          console.error('No Olympic data found.');
        }
      });
    }
  // calculate the addition of all athletes and all medals
    calculateDetails(olympic: Olympic): void {
      if (olympic && olympic.participations) {
        this.Nbentry = olympic.participations.length;
        this.Tnbmedals = olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0);
        this.Tnbathletes = olympic.participations.reduce((total, participation) => total + participation.athleteCount, 0);
      }
    }
  
    navigateToHome() {
      this.router.navigate(['/']);
    }
  }