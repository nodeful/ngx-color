import { Component, OnInit, Input, OnChanges } from '@angular/core';


@Component({
  selector: 'color-photoshop-previews',
  template: `
  <div>
    <div class="photoshop-label">new</div>
    <div class="photoshop-swatches">
      <div class="photoshop-new" [style.background]="backgroundNew"></div>
      <div class="photoshop-current" [style.background]="currentColor"></div>
    </div>
    <div class="photoshop-label">current</div>
  </div>
  `,
  styles: [`
    .photoshop-swatches {
      border: 1px solid #B3B3B3;
      border-bottom: 1px solid #F0F0F0;
      margin-bottom: 2px;
      margin-top: '1px;
    }
    .photoshop-new {
      height: 34px;
      box-shadow: inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000;
    }
    .photoshop-current {
      height: 34px;
      box-shadow: inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 -1px 0 #000;
    }
    .photoshop-label {
      font-size: 14px;
      color: #000;
      text-align: center;
    }
  `],
})
export class PhotoshopPreviewsComponent implements OnInit, OnChanges {
  @Input() rgb: any;
  @Input() currentColor = '';
  backgroundNew = '';
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    console.log(this.currentColor)
    this.backgroundNew = `rgb(${ this.rgb.r },${ this.rgb.g }, ${ this.rgb.b })`;
  }

}