import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { EmbedVideoService } from 'ngx-embed-video';

@Component({
  selector: 'app-video-preview',
  templateUrl: './video-preview.component.html',
  styleUrls: ['./video-preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPreviewComponent implements OnInit {
  yt_iframe_html: any;
  //   vimeoUrl = 'https://vimeo.com/422101082';
  // videoUrl : any;

  constructor(
    private embedService: EmbedVideoService,
    public dialogRef: MatDialogRef<VideoPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private sanitizer: DomSanitizer
  ) {
    this.yt_iframe_html = this.embedService.embed(this.data.videoUrl, {
      attr: { width: '700', height: '400' },
    });
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  videoUrl: any;
}
