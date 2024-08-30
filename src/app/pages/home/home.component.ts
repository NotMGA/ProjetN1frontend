import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
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
/**
 *  @class HomeComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * Observable that holds an array of Olympic objects.
   * @type {Observable<Olympic[]>}
   */
  public olympics$: Observable<Olympic[]> = of([]);
  /**
   *  Boolean flag indicating whether the application is in mobile
   * @type {boolean}
   */
  public isMobile: boolean = false;
  /**
   *  Subscription object
   * @type {Subscription}
   */
  private olympicsSubscription: Subscription = new Subscription();
  /**
   *  Array that stores the  Olympic data
   * @type {Olympic[]}
   */
  private olympicsData: Olympic[] = [];
  /**
   * Constructor for HomeComponent
   * @param olympicService Service to fetch Olympic data
   * @param router  service for navigation
   */
  constructor(private olympicService: OlympicService, private router: Router) {}
  /**
   * Listener for the window resize to adjust the chart
   * @param event resize event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = window.innerWidth <= 768;
    this.renderChart(this.olympicsData);
  }
  /**
   * Called aftter the component is initialized
   * Subscribes to the olympic data and sets up the chart
   */
  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    this.olympics$ = this.olympicService
      .getOlympics()
      .pipe(map((olympics) => olympics ?? []));

    const olympicsSubscription = this.olympics$.subscribe((olympics) => {
      this.olympicsData = olympics;
      this.renderChart(olympics);
    });
    this.olympicsSubscription.add(olympicsSubscription);
  }
  /**
   * Called when the componnent is destroyed
   * unsubscribe all to prevent memory leaks
   */
  ngOnDestroy(): void {
    if (this.olympicsSubscription) {
      this.olympicsSubscription.unsubscribe();
    }
  }
  /**
   * Rends the charts with CanvasJS
   * @param olympics Array of olympic data
   */
  renderChart(olympics: Olympic[]) {
    const chartData = olympics.map((olympic) => ({
      label: olympic.country,
      id: olympic.id,
      y: olympic.participations.reduce(
        (totalMedals, participation) => totalMedals + participation.medalsCount,
        0
      ),
      participationsCount: olympic.participations.length,
    }));
    let chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      responsive: true,
      data: [
        {
          type: 'pie',
          startAngle: 240,
          yValueFormatString: '#,### médailles',
          indexLabel: '{label}',
          indexLabelPlacement: this.isMobile ? 'inside' : 'outside',
          indexLabelFontSize: this.isMobile ? 12 : 16,
          dataPoints: chartData,
          click: (e: any) => {
            const country = e.dataPoint.label;
            const id = e.dataPoint.id;
            this.router.navigate(['/pays/', id]);
          },
        },
      ],
    });
    /**
     * Render the chart
     */
    chart.render();
  }
}
