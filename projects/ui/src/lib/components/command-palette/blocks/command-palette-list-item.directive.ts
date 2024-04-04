import { computed, Directive, ElementRef, inject, input } from '@angular/core';
import { CommandPaletteGroupComponent } from './command-palette-group.component';

@Directive({
  selector: '[uiCmdPaletteListItem]',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class CommandPaletteListItem {
  public labelInput = input<string | undefined>(undefined, {
    alias: 'label',
  });

  public parentGroup? = inject(CommandPaletteGroupComponent, {
    optional: true,
  });

  public elRef = inject(ElementRef);

  public label = computed(() => {
    return this.labelInput ?? this.elRef.nativeElement.textContent.trim();
  });
}
