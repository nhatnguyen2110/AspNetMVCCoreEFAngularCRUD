import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ServerDataSource } from 'ng2-smart-table';
import { ServerSourceConf } from 'ng2-smart-table/lib/lib/data-source/server/server-source.conf';
import { Observable } from 'rxjs';

@Injectable()
export class CustomServerDataSource extends ServerDataSource {

  httpHeaders: HttpHeaders;
  constructor(protected http: HttpClient, headers: HttpHeaders, conf: ServerSourceConf | {} = {}) {
    super(http, conf);
    this.httpHeaders = headers;
  }

  protected requestElements(): Observable<any> {
    const httpParams = this.createRequesParams();
    return this.http.get(this.conf.endPoint, { params: httpParams, headers: this.httpHeaders, observe: 'response' });
  }
}