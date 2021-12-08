import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, map, Observable, share, Subscription } from 'rxjs';
import { Title } from './title.model';
import { TitleService } from './title.service';

@Component({
  selector: 'simple-form',
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.scss'],
})
export class SimpleFormComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public title$: Observable<Title[]>;

  private _subscriptions: Subscription[] = [];

  constructor(private titleService: TitleService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();

    this.initSubscriptions();
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.value);
  }

  private buildForm() {
    this.form = this.fb.group({
      title: [''],
      firstName: [''],
      lastName: ['', Validators.required],
      acceptTerms: [false],
    });
  }

  public initSubscriptions() {
    const title$ = this.titleService.getTitles().pipe(
      map((titles) =>  {
        return titles.filter((t) => t.name !== '!')
                     .sort((a,b)=> a.name.localeCompare(b.name))
      }),
      share()
    );

    const sub = title$
      .pipe(
        map((titles) => titles.find((t) => t.isDefault)),
        filter((t) => !!t)
      )
      .subscribe((title) => {
        this.form.patchValue({ title: title.name });
      });

    this.title$ = title$;

    this._subscriptions.push(sub);
  }
}
