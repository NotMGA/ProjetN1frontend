import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

declare var CanvasJS: any;

@Component({
  selector: 'app-pays',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
/**
 * @class DetailComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
export class DetailComponant implements OnInit, OnDestroy {
  /**
   * @type {string}
   */
  public id: string = '';
  /**
   * @type {string}
   */
  public country: string = '';
  /**
   * @type {Observable<Olympic[]>}
   */
  public olympics$: Observable<Olympic[]> = of([]);
  /**
   * @type {number}
   */
  public Nbentry: number = 0;
  /**
   * @type {number}
   */
  public Tnbmedals: number = 0;
  /**
   * @type {number}
   */
  public Tnbathletes: number = 0;
  /**
   * @type {Subscription}
   */
  private olympicsDetailSubscription: Subscription = new Subscription();
  /**
   *
   * @param {ActivatedRoute} route
   * @param {OlympicService} olympicService
   * @param {Router} router
   */
  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {}
  // init the componants
  //  get the country inside the URL and the data corresponding to the country

  ngOnInit() {
    // Subscribe to route paramMap and olympics$
    const routeSubscription = this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') ?? 'unknown';
      this.olympics$ = this.olympicService.getOlympics().pipe(
        map((olympics) => olympics || []),
        map((olympics) =>
          olympics.filter((olympic) => olympic && olympic.id === +this.id)
        )
      );
    });
    const olympicsSubscription = this.olympics$.subscribe((olympics) => {
      // verify if we have data
      if (olympics && olympics.length > 0) {
        const selectedCountry = olympics[0];
        this.country = selectedCountry.country;

        this.calculateDetails(selectedCountry);

        const chartData = selectedCountry.participations.map(
          (participation) => ({
            label: participation.year.toString(),
            y: participation.medalsCount,
          })
        );

        const chart = new CanvasJS.Chart('chartContainer', {
          animationEnabled: true,
          axisX: { title: 'Years' },
          axisY: { title: 'Nombre of medal' },
          data: [
            {
              type: 'column',
              dataPoints: chartData,
            },
          ],
        });

        chart.render();
      } else {
        console.error('No Olympic data found.');
        this.navigateToHome();
      }
    });
    this.olympicsDetailSubscription.add(routeSubscription);
    this.olympicsDetailSubscription.add(olympicsSubscription);
  }
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.olympicsDetailSubscription.unsubscribe();
  }

  /**
   * calculate the addition of all athletes and all medals
   * @param {Olympic} olympic
   */
  calculateDetails(olympic: Olympic): void {
    if (olympic && olympic.participations) {
      this.Nbentry = olympic.participations.length;
      this.Tnbmedals = olympic.participations.reduce(
        (total, participation) => total + participation.medalsCount,
        0
      );
      this.Tnbathletes = olympic.participations.reduce(
        (total, participation) => total + participation.athleteCount,
        0
      );
    }
  }
  /**
   * Navigates the user back to the home
   */
  navigateToHome() {
    this.router.navigate(['/']);
  }
}
