import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiManager {
    static readonly baseUrlDev: String = 'http://localhost:3000';
    private separator :String ='/';

    constructor(private http: Http) { }

    fireSignupService(resouceurl: string, methodUrl: String, params) {
        let result: Observable<Response>;
        console.log(ApiManager.baseUrlDev+'/'+resouceurl+'/'+methodUrl);
        result = this.http.post(ApiManager.baseUrlDev+'/'+resouceurl+'/'+methodUrl,params);
        return result.map((res: Response) => {
            console.log("API Call Success");

            return res.json();
        }).catch((error: Response | any) => {
            console.log("API call failure: Catch");
            let errMsg: string = "";
            if (error instanceof Response) {
                const body = error.json() || '';
                const err = body.error || JSON.stringify(body);
                errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            } else {
                errMsg = error.message ? error.message : error.toString();
            }
            console.error(errMsg);
            return Observable.throw(errMsg);
        });
    }

}