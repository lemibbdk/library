import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LibraryService } from './services/library.service';
import { GenreModel } from './models/genre.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public bookForm: FormGroup;
  public genres?: GenreModel[];

  constructor(
    private _libraryService: LibraryService,
  ) {
    this.bookForm = new FormGroup({
      genre: new FormControl(''),
      subgenre: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this._libraryService.getLibraryData()
      .subscribe((data: GenreModel[]) => {
        this.genres = data;
      })
  }
}
