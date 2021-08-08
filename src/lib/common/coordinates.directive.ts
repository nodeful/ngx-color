import {
  Directive,
  ElementRef,
  HostListener,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Directive({ selector: '[ngx-color-coordinates]' })
export class CoordinatesDirective implements OnInit, OnDestroy {
  @Output()
  coordinatesChange = new Subject<{
    x: number;
    y: number;
    top: number;
    left: number;
    containerWidth: number;
    containerHeight: number;
    $event: any;
  }>();
  private mousechange = new Subject<{
    x: number;
    y: number;
    $event: any;
    isTouch: boolean;
  }>();

  private mouseListening = false;
  private sub!: Subscription;
  @HostListener('window:mousemove', ['$event', '$event.pageX', '$event.pageY'])
  @HostListener('window:touchmove', [
    '$event',
    '$event.touches[0].clientX',
    '$event.touches[0].clientY',
    'true',
  ])
  mousemove($event: Event, x: number, y: number, isTouch = false) {
    if (this.mouseListening) {
      $event.preventDefault();
      this.mousechange.next({ $event, x, y, isTouch });
    }
  }
  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  mouseup() {
    this.mouseListening = false;
  }
  @HostListener('mousedown', ['$event', '$event.pageX', '$event.pageY'])
  @HostListener('touchstart', [
    '$event',
    '$event.touches[0].clientX',
    '$event.touches[0].clientY',
    'true',
  ])
  mousedown($event: Event, x: number, y: number, isTouch = false) {
    $event.preventDefault();
    this.mouseListening = true;
    this.mousechange.next({ $event, x, y, isTouch });
  }

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.sub = this.mousechange
      .pipe(
        // limit times it is updated for the same area
        distinctUntilChanged((p, q) => p.x === q.x && p.y === q.y),
      )
      .subscribe(n => this.handleChange(n.x, n.y, n.$event, n.isTouch));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  handleChange(x: number, y: number, $event: Event, isTouch: boolean) {
    const el = this.el.nativeElement
    const containerWidth = el.clientWidth;
    const containerHeight = el.clientHeight;
    const rect = el.getBoundingClientRect()
    let left = x - (rect.left + window.pageXOffset);
    let top = y - rect.top;
    const scale = rect.width / el.clientWidth
    if (!isTouch) {
      top = top - window.pageYOffset;
    }
    left /= scale
    top /= scale
    this.coordinatesChange.next({
      x,
      y,
      top,
      left,
      containerWidth,
      containerHeight,
      $event,
    });
  }
}

@NgModule({
  declarations: [CoordinatesDirective],
  exports: [CoordinatesDirective],
})
export class CoordinatesModule {}
