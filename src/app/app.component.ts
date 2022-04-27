import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LibraryService } from './services/library.service';
import { GenreModel } from './models/genre.model';
import { StepModel } from './models/step.model';
import { SubgenreModel } from './models/subgenre.model';
import { FormFieldModel, FieldType } from './models/form-field.model';
import { SelectOptionModel } from './models/select-option.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public genres: GenreModel[];
  public subgenres: SubgenreModel[];
  public steps: StepModel[];
  public selectedGenre: GenreModel | null;
  public selectedSubgenre: SubgenreModel | null;
  public currentStep: number;
  public addNewSubgenreSelected: boolean;
  public bookForm: FormGroup;
  public subgenreForm: FormGroup;
  public bookFormModel: FormFieldModel[][];
  public fieldTypes = FieldType;

  constructor(
    private _libraryService: LibraryService,
  ) {
    this.steps = [
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

    this.genres = [];
    this.subgenres = [];

    this.selectedGenre = null;
    this.selectedSubgenre = null;
    this.currentStep = 1;
    this.addNewSubgenreSelected = false;

    this.subgenreForm = new FormGroup({
      name: new FormControl(''),
      isDescriptionRequired: new FormControl(''),
    })

    this.bookForm = new FormGroup({});

    this.bookFormModel = [
      [
        {
          field: 'title',
          label: 'Book title',
          placeholder: 'Book title',
          inputType: FieldType.INPUT,
          width: 100,
        }
      ],
      [
        {
          field: 'author',
          label: 'Author',
          placeholder: 'Author',
          inputType: FieldType.SELECT,
          width: 100,
        }
      ],
      [
        {
          field: 'isbn',
          label: 'ISBN',
          placeholder: 'ISBN',
          inputType: FieldType.INPUT,
          width: 100,
        }
      ],
      [
        {
          field: 'publisher',
          label: 'Publisher',
          placeholder: 'Publisher',
          inputType: FieldType.SELECT,
          width: 100,
        }
      ],
      [
        {
          field: 'datePublished',
          label: 'Date published',
          placeholder: 'DD/MM/YYYY',
          inputType: FieldType.INPUT,
          width: 33,
        }
      ],
      [
        {
          field: 'numberOfPages',
          label: 'Number of pages',
          placeholder: 'Number of pages',
          inputType: FieldType.INPUT,
          width: 25,
        }
      ],
      [
        {
          field: 'format',
          label: 'Format',
          placeholder: 'Format',
          inputType: FieldType.SELECT,
          width: 33,
        }
      ],
      [
        {
          field: 'edition',
          label: 'Edition',
          placeholder: 'Edition',
          inputType: FieldType.INPUT,
          width: 33,
        },
        {
          field: 'editionLanguage',
          label: 'Edition language',
          placeholder: 'Edition language',
          inputType: FieldType.SELECT,
          width: 33,
        },
      ],
      [
        {
          field: 'description',
          label: 'Description',
          placeholder: 'Description',
          inputType: FieldType.TEXTAREA,
          width: 100,
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
    }
  }

  private _handleThirdStepNextClick(): void {
    this.bookFormModel
      .flat()
      .forEach((formItem: FormFieldModel) => {
        this.bookForm.addControl(formItem.field, new FormControl(''));
      })
  }

  public previousStep(): void {
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
}
