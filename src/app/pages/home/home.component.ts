import { Component, OnInit, HostListener } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { map } from 'rxjs';
import { Router } from '@angular/router';





declare var CanvasJS: any;

@Component({
  selector: 'app-home', 
  templateUrl: './home.component.html', 
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // init data
  public olympics$: Observable<Olympic[]> = of([]);
  public isMobile: boolean = false;

  constructor(private olympicService: OlympicService, private router: Router) {}
  //detect the size of the window 
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = window.innerWidth <= 768; // Considérer <= 768px comme mobile
    this.olympics$.subscribe(olympics => {
      this.renderChart(olympics);
    });
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    this.olympics$ = this.olympicService.getOlympics().pipe(
      map(olympics => olympics ?? [])
    );

    this.olympics$.subscribe(olympics => {
      this.renderChart(olympics);
    });
  }

  renderChart(olympics: Olympic[]) {
      //set up data for the graph 
    const chartData = olympics.map(olympic => ({
      label: olympic.country,
      y: olympic.participations.reduce((totalMedals, participation) => totalMedals + participation.medalsCount, 0),
      participationsCount: olympic.participations.length,
    }));

      //Graph bar set up 
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      responsive: true,
      data: [{
        type: "pie",
        startAngle: 240,
        yValueFormatString: "#,### médailles",
        indexLabel: "{label}", 
        // change the label of each country depending on the window
        indexLabelPlacement: this.isMobile ? "inside" : "outside",
        indexLabelFontSize: this.isMobile ? 12 : 16,
        dataPoints: chartData,
        // event click on any quarter to navigate to the desirade page 
        click: (e: any) => {
          const country = e.dataPoint.label;
          this.router.navigate(['/pays', country]);
        }
      }]
    });

    chart.render();
  }
}
