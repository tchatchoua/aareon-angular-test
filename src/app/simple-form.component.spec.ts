import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SimpleFormComponent } from './simple-form.component';
import { TitleService } from './title.service';

describe('SimpleFormComponent', () => {
  let component: SimpleFormComponent;
  let fixture: ComponentFixture<SimpleFormComponent>;

  const mockTitleService = {
    getTitles: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SimpleFormComponent],
      providers: [{ provide: TitleService, useValue: mockTitleService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter <!> from the list of titles', (done) => {
    // arrange
    spyOn(mockTitleService, 'getTitles').and.returnValue(
      of([
        { name: 'Mr', isDefault: false },
        { name: '!', isDefault: false },
        { name: 'Dr', isDefault: true },
      ])
    );

    const expectedValues = [
      { name: 'Mr', isDefault: false },
      { name: 'Dr', isDefault: true },
    ];

    // act
    component.ngOnInit();

    //assert
    component.title$.subscribe((titles) => {
      expect(titles).toEqual(expectedValues);
      done();
    });
  });

  it('should set the correct form default title', (done) => {
    // arrange
    spyOn(mockTitleService, 'getTitles').and.returnValue(
      of([
        { name: 'Mr', isDefault: false },
        { name: '!', isDefault: false },
        { name: 'xxx', isDefault: true },
      ])
    );

    const expectedTitle = 'xxx';

    // act
    component.ngOnInit();

    //assert
    const title = component.form.get('title').value;

    expect(title).toBe(expectedTitle);
    done();
  });

  it('should mark the form as touched if it is invalid', () => {
    // arrange
    const formSpy = spyOn(component.form, 'markAllAsTouched');

    //act
    component.submitForm();

    //assert
    expect(formSpy).toHaveBeenCalled();
  });

  it('should not mark the form as touched if it is valid', () => {
    // arrange
    component.form.patchValue({ lastName: 'francis' });

    const formSpy = spyOn(component.form, 'markAllAsTouched');

    //act
    component.submitForm();

    //assert
    expect(formSpy).toHaveBeenCalledTimes(0);
  });

  it('should disable the submit button if terms and condition checkbox not checked', () => {
    // arrange
    component.form.patchValue({ acceptTerms: false });

    //act
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.submit-form button'));

    //assert
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should enable the submit button if terms and condition checkbox is checked', () => {
    // arrange
    component.form.patchValue({ acceptTerms: true });

    //act
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.submit-form button'));

    //assert
    expect(button.nativeElement.disabled).toBeFalsy();
  });
});
