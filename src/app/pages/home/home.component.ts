import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { ImageComponent } from 'src/app/components/image/image.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  images;
  pagesCount = 1;
  loadMoreEnabled: boolean;

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  getImages(): void {
    this.http.get<any[]>('/api/images').subscribe((res:any) => {
      this.images = res.pictures;
      this.loadMoreEnabled = res.hasMore;
    });
  }

  getPicture(id): Observable<any> {
    return this.http.get<any[]>(`/api/images/${id}`)
  }

  loadMore(): void {
    this.http.get<any[]>(`/api/images?page=${this.pagesCount}`).subscribe((res:any) => {
      this.images = [...this.images, ...res.pictures];
      this.loadMoreEnabled = res.hasMore;
    });
    this.pagesCount++;
  }

  openDialog(data): void {
    this.dialog.open(ImageComponent, {
      maxHeight: '90vh',
      data
    });
  }

  selectImage(id): void {
    this.getPicture(id).subscribe((res) => {
      this.openDialog(res);
    })
  }

  ngOnInit(): void {
    this.getImages();
  }

}
