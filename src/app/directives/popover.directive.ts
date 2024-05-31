import { Directive, ElementRef, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import * as bootstrap from 'bootstrap'; // Import Bootstrap JavaScript

@Directive({
  selector: '[appBootstrapPopover]'
})
export class BootstrapPopoverDirective implements AfterViewInit, OnDestroy {
  private popover: bootstrap.Popover | null = null; // Initialize popover variable

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    // Initialize Bootstrap popover
    this.popover = new bootstrap.Popover(this.elementRef.nativeElement, {
      trigger: 'manual' // Set trigger to manual
    });

     // Add custom class to the popover element
     this.elementRef.nativeElement.classList.add('custom-popover');

    // Listen to mouseenter event and show popover
    this.elementRef.nativeElement.addEventListener('mouseenter', () => {
      if (this.popover) {
        this.popover.show();
      }
    });

    // Listen to mouseleave event and hide popover
    this.elementRef.nativeElement.addEventListener('mouseleave', () => {
      if (this.popover) {
        this.popover.hide();
      }
    });
  }

  ngOnDestroy(): void {
    // Dispose popover when the directive is destroyed
    if (this.popover) {
      this.popover.dispose();
    }
  }
}
