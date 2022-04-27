import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LibraryService } from './services/library.service';
import { GenreModel } from './models/genre.model';
import { StepModel } from './models/step.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public bookForm: FormGroup;
  public genres?: GenreModel[];
  public steps: StepModel[];

  constructor(
    private _libraryService: LibraryService,
  ) {
    this.bookForm = new FormGroup({
      genre: new FormControl(''),
      subgenre: new FormControl(''),
    });

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
    ]
  }

  ngOnInit(): void {
    this._libraryService.getLibraryData()
      .subscribe((data: GenreModel[]) => {
        this.genres = data;
      })
  }
}
