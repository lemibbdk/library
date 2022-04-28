import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LibraryService } from './services/library.service';
import { GenreModel } from './models/genre.model';
import { StepModel } from './models/step.model';
import { SubgenreModel } from './models/subgenre.model';
import { FormFieldModel, FieldType } from './models/form-field.model';
import { SelectOptionModel } from './models/select-option.model';
import { BookModel } from './models/book.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public genres: GenreModel[];
  public subgenres: SubgenreModel[];
  public steps!: StepModel[];
  public selectedGenre!: GenreModel | null;
  public selectedSubgenre!: SubgenreModel | null;
  public currentStep!: number;
  public addNewSubgenreSelected!: boolean;
  public bookForm!: FormGroup;
  public subgenreForm!: FormGroup;
  public bookFormModel: FormFieldModel[][];
  public fieldTypes = FieldType;

  private _initSteps: StepModel[] = [
    {
      step: 1,
      label: 'Genre',
    },
    {
      step: 2,
      label: 'Subgenre',
    },
    {
      step: null,
      label: '',
    },
  ];

  constructor(
    private _libraryService: LibraryService,
  ) {
    this.genres = [];
    this.subgenres = [];

    this._initFieldStates();

    this.bookFormModel = [
      [
        {
          field: 'title',
          label: 'Book title',
          placeholder: 'Book title',
          inputType: FieldType.INPUT,
          width: 100,
          validators: [Validators.required],
        }
      ],
      [
        {
          field: 'author',
          label: 'Author',
          placeholder: 'Author',
          inputType: FieldType.SELECT,
          width: 100,
          validators: [Validators.required],
        }
      ],
      [
        {
          field: 'isbn',
          label: 'ISBN',
          placeholder: 'ISBN',
          inputType: FieldType.INPUT,
          width: 100,
          validators: [Validators.required],
        }
      ],
      [
        {
          field: 'publisher',
          label: 'Publisher',
          placeholder: 'Publisher',
          inputType: FieldType.SELECT,
          width: 100,
          validators: [Validators.required],
        }
      ],
      [
        {
          field: 'datePublished',
          label: 'Date published',
          placeholder: 'DD/MM/YYYY',
          inputType: FieldType.INPUT,
          width: 33,
          validators: [
            Validators.required,
            Validators.pattern('^(0?[1-9]|[12][0-9]|3[01])[\\/\\-](0?[1-9]|1[012])[\\/\\-]\\d{4}$'),
          ],
        }
      ],
      [
        {
          field: 'numberOfPages',
          label: 'Number of pages',
          placeholder: 'Number of pages',
          inputType: FieldType.INPUT,
          width: 25,
          validators: [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
          ],
        }
      ],
      [
        {
          field: 'format',
          label: 'Format',
          placeholder: 'Format',
          inputType: FieldType.SELECT,
          width: 33,
          validators: [Validators.required],
        }
      ],
      [
        {
          field: 'edition',
          label: 'Edition',
          placeholder: 'Edition',
          inputType: FieldType.INPUT,
          width: 33,
          validators: [Validators.required],
        },
        {
          field: 'editionLanguage',
          label: 'Edition language',
          placeholder: 'Edition language',
          inputType: FieldType.SELECT,
          width: 33,
          validators: [Validators.required],
        },
      ],
      [
        {
          field: 'description',
          label: 'Description',
          placeholder: 'Description',
          inputType: FieldType.TEXTAREA,
          width: 100,
          validators: [],
        }
      ],
    ]
  }

  ngOnInit(): void {
    this._libraryService.getLibraryData()
      .subscribe((data: GenreModel[]) => {
        this.genres = data;
      })
  }

  private _initFieldStates(): void {
    this.steps = JSON.parse(JSON.stringify(this._initSteps));
    this.selectedGenre = null;
    this.selectedSubgenre = null;
    this.addNewSubgenreSelected = false;
    this.currentStep = 1;

    this.subgenreForm = new FormGroup({
      name: new FormControl('', Validators.required),
      isDescriptionRequired: new FormControl(''),
    });

    this.bookForm = new FormGroup({});
  }

  public selectGenre(genre: GenreModel): void {
    if (this.selectedGenre?.id === genre.id) {
      this.selectedGenre = null;
    } else {
      this.selectedGenre = genre;
    }
  }

  public nextStep(): void {
    switch (this.currentStep) {
      case 1:
        this._handleFirstStepNextClick();
        break;
      case 2:
        this._handleSecondStepNextClick();
        break;
      case 3:
        this._handleThirdStepNextClick();
        break;
    }
    this.currentStep++;
  }

  private _handleFirstStepNextClick(): void {
    if (!this.selectedGenre) {
      return;
    }

    this.subgenres = this.selectedGenre.subgenres;
  }

  private _handleSecondStepNextClick(): void {
    if (!this.selectedSubgenre && !this.addNewSubgenreSelected) {
      return;
    }

    if (this.addNewSubgenreSelected && this.steps.length === 3) {
      this.steps[2].step = 3;
      this.steps[2].label = 'Add new subgenre';
      this.steps.push({
        step: 4,
        label: 'Information',
      });
    }

    if (!this.addNewSubgenreSelected) {
      this.steps[2].step = 3;
      this.steps[2].label = 'Information';

      if (this.steps.length > 3) {
        this.steps = this.steps.slice(0, 3);
      }

      this._generateBookForm();
    }
  }

  private _generateBookForm(): void {
    this.bookFormModel
      .flat()
      .forEach((formItem: FormFieldModel) => {
        if (formItem.field === 'description' && !this.selectedSubgenre!.isDescriptionRequired) {
          this.bookForm.addControl(
            formItem.field,
            new FormControl(''),
          );
        } else {
          this.bookForm.addControl(
            formItem.field,
            new FormControl('', formItem.validators),
          );
        }
      })
  }

  private _handleThirdStepNextClick(): void {
    if (this.addNewSubgenreSelected) {
      let maxId = 0
      for (let genre of this.genres) {
        if (genre.id > maxId) {
          maxId = genre.id;
        }
        for (let subgenre of genre.subgenres) {
          if (subgenre.id > maxId) {
            maxId = subgenre.id;
          }
        }
      }
      const nextId = maxId + 1;

      const targetGenre = this.genres.find(el => el.id === this.selectedGenre!.id);
      const newSubgenre = {
        id: nextId,
        name: this.subgenreForm.get('name')!.value,
        isDescriptionRequired: this.subgenreForm.get('isDescriptionRequired')!.value ?? false,
      }
      targetGenre!.subgenres.push(newSubgenre);
      this.selectedSubgenre = newSubgenre;
    }

    if (this.steps.length === 4) {
      this._generateBookForm();
    }
  }

  public previousStep(): void {
    if (this.currentStep === this.steps.length) {
      this.bookForm = new FormGroup({});
    }
    if (this.currentStep === 1) {
      return;
    }
    this.currentStep--;
  }

  public selectSubgenre(subgenre: SubgenreModel): void {
    this.addNewSubgenreSelected = false;
    if (this.selectedSubgenre?.id === subgenre.id) {
      this.selectedSubgenre = null;
    } else {
      this.selectedSubgenre = subgenre;
    }
  }

  public onAddNewClick(): void {
    if (this.selectedSubgenre) {
      this.selectedSubgenre = null;
    }
    this.addNewSubgenreSelected = !this.addNewSubgenreSelected;
  }

  public toShowSubgenreForm(): boolean {
    return this.addNewSubgenreSelected && this.currentStep === 3;
  }

  public toShowBookForm(): boolean {
    return this.currentStep > 2 && this.steps.length === this.currentStep;
  }

  public isNextButtonDisabled(): boolean {
    switch (this.currentStep) {
      case 1:
        return !this.selectedGenre;
      case 2:
        return !this.selectedSubgenre && !this.addNewSubgenreSelected;
      case 3:
        return this.subgenreForm.invalid;
      default:
        return false;
    }
  }

  public getSelectOptions(field: FormFieldModel): SelectOptionModel[] {
    switch (field.field) {
      case 'author':
        return [
          { label: 'Aleksa Milenkovic', value: 'Aleksa Milenkovic' },
          { label: 'Marko Markovic', value: 'Marko Markovic' },
          { label: 'Petar Peric', value: 'Petar Peric' },
        ];
      case 'publisher':
        return [
          { label: 'Delphi', value: 'Delphi d.o.o.' },
          { label: 'Vulkan', value: 'Vulkan d.o.o.' },
        ];
      case 'format':
        return [
          { label: 'A4', value: 'A4 format' },
          { label: 'A3', value: 'A3 format' },
        ];
      case 'editionLanguage':
        return [
          { label: 'English', value: 'EN' },
          { label: 'Serbian', value: 'RS' },
          { label: 'French', value: 'FR' },
          { label: 'Spanish', value: 'ES' },
        ];
      default:
        return [
          { label: 'None', value: 'none' }
        ]
    }
  }

  public addBook(): void {
    const book: BookModel = {
      genre: this.selectedGenre?.name,
      subgenre: this.selectedSubgenre?.name,
      ...this.bookForm.value,
    };

    console.log(book);

    this.currentStep++;
  }

  public controlHasError(controlName: string): boolean {
    const control = this.bookForm.get(controlName) as FormControl;
    return control?.touched && control?.invalid;
  }

  public getControlError(controlName: string): string {
    let error: string;
    const control = this.bookForm.get(controlName) as FormControl;

    const controlErrors = control.errors;
    if (controlErrors) {
      error = Object.keys(controlErrors)[0] === 'pattern'
        ? '* Invalid format or input type'
        : '* ' + Object.keys(controlErrors)[0]
    } else {
      error = '';
    }

    return error
  }

  public resetForm(): void {
    this._initFieldStates();
  }
}
