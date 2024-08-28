import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-bluebox',
  templateUrl: './bluebox.component.html',
  styleUrl: './bluebox.component.scss',
})
export class BlueboxComponent {
  @Input() txt: string = '';
  @Input() number: any = 0;
}
