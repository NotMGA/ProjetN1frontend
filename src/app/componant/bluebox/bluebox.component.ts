import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-bluebox',
  templateUrl: './bluebox.component.html',
  styleUrl: './bluebox.component.scss',
})
export class BlueboxComponent {
  /**
   * Text label display int he blue box
   * @type {string}
   */
  @Input() txt: string = '';
  /**
   * Value displayed in the blue box related to the previous label
   * @type {any}
   */
  @Input() number: any = 0;
}
