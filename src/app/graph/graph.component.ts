import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  title = 'Fitbit Project!';
  private apiUrl = 'https://address-book-demo.herokuapp.com/api/contacts';
  
  data: any = {};

  constructor(private http: Http) {
    console.log('Hello fellow user');
    this.getContacts();
//    this.getData();
  }

  getData() {
    return this.http.get(this.apiUrl)
      .map((res: Response) => res.json());
  }

  getContacts() {
    this.getData().subscribe(data => {
      console.log(data);
      this.data = data;
    });
  }
  something() {
    const chosen  = document.forms[0].date.value;
    console.log(chosen);
    const tday = new Date();
    const d = tday.getDate();
    const m = tday.getMonth() + 1; // January is 0!
    const y = tday.getFullYear();
    let dd;
    let mm;
    if (d < 10) {
        dd = '0' + d.toString();
    } else {
      dd = d.toString();
    }
    if (m < 10) {
        mm = '0' + m.toString();
    } else {
      mm = m.toString();
    }
    const today = y.toString() + '-' + mm + '-' + dd;
    console.log(today);

  }

}
