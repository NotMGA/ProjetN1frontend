import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { map, tap } from 'rxjs/operators';
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
   * Store the id of the current country
   * @type {string}
   */
  public id: string = '';
  /**
   * Store the name of the current country
   * @type {string}
   */
  public country: string = '';
  /**
   * Observable that holds an array of Olympic objects
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
  /**
   * Called aftter the component is initialized
   * Subscribes to the olympic data and sets up the chart
   * redirect if the id is not in the array
   */
  ngOnInit() {
    const routeSubscription = this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') || 'unknown';
      this.olympics$ = this.olympicService.getOlympics().pipe(
        map((olympics) => olympics || []),
        map((olympics) =>
          olympics.filter((olympic) => olympic && olympic.id === +this.id)
        ),
        tap((filteredOlympics) => {
          if (filteredOlympics.length === 0) {
            this.navigateToHome();
          }
        })
      );
    });
    const olympicsSubscription = this.olympics$.subscribe((olympics) => {
      const selectedCountry = olympics[0];
      if (!olympics || olympics.length === 0) {
        return;
      }
      this.country = selectedCountry.country;

      this.calculateDetails(selectedCountry);

      const chartData = selectedCountry.participations.map((participation) => ({
        label: participation.year.toString(),
        y: participation.medalsCount,
      }));

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
    });
    this.olympicsDetailSubscription.add(routeSubscription);
    this.olympicsDetailSubscription.add(olympicsSubscription);
  }
  /**
   * Called when the componnent is destroyed
   * unsubscribe all to prevent memory leaks
   */
  ngOnDestroy(): void {
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
