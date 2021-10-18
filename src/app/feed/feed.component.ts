import { ActivatedRoute } from '@angular/router';
import { NewsRss } from './dto';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import * as xml2js from 'xml2js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// fix unsafe url error
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  RssData!: NewsRss;
  modalRef?: BsModalRef;
  iframeUrl: any = '';
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
  ) { }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: any) => {
      var symbol = params.params.q ?? 'AAPL';
      this.GetRssFeedData(symbol);
    });
  }
  // modal 
  openModal(template: TemplateRef<any>, url: string) {
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    this.modalRef = this.modalService.show(template);
  }

  GetRssFeedData(symbol: any) {
    const requestOptions: Object = {
      observe: 'body',
      responseType: 'text'
    };
    const _url = "https://timesofindia.indiatimes.com/rssfeeds/66949542.cms";
    this.http
      .get<any>(
        _url,
        requestOptions
      )
      .subscribe((data) => {
        let parseString = xml2js.parseString;
        parseString(data, (err: any, result: NewsRss) => {
          this.RssData = result;
          console.log(this.RssData)
        });
      });
  }
}