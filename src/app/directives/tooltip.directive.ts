import { Directive, ElementRef, HostListener, Input, Renderer2, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipText: string = '';
  tooltipElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipElement) {
      this.showTooltip();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  showTooltip() {
    this.tooltipElement = this.renderer.createElement('span');
    if (this.tooltipElement) {
      this.renderer.appendChild(
        this.tooltipElement,
        this.renderer.createText(this.tooltipText)
      );
      this.renderer.appendChild(document.body, this.tooltipElement);

      const hostPos = this.el.nativeElement.getBoundingClientRect();
      const tooltipPos = this.tooltipElement.getBoundingClientRect();

      if (this.tooltipElement) {
        const top = hostPos.top - tooltipPos.height - 10;
        const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

        this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
        this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
        this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
        this.renderer.setStyle(this.tooltipElement, 'background-color', '#333');
        this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
        this.renderer.setStyle(this.tooltipElement, 'padding', '5px');
        this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
        this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
        this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
        this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
      }
    }

  }

  hideTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }

  ngOnDestroy() {
    this.hideTooltip();
  }
}
