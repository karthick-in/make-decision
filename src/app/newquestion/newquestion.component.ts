import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Util } from '../util';

@Component({
  selector: 'app-newquestion',
  templateUrl: './newquestion.component.html',
  styleUrls: ['./newquestion.component.css']
})
export class NewquestionComponent implements OnInit {

  _questions;
  _answer_types;
  _fromdate;
  _form;
  
  constructor(
    public _apiService : ApiService,
    public _util : Util
  ) { }

  async ngOnInit() {
    await this.loadQuestions();
    await this.getAnswerType();
  }

  async loadQuestions(){
    await this._apiService.getQuestions().then(
      questions => {
        this._questions = questions;        
      },
      err =>{
        console.log("Some error occurred!");
        this._util.logoutIf401Error(err);
      }      
    )
    this._questions.forEach(element => {
      let fromdate = element.from;
      let date: Date = new Date(fromdate);  
      console.log("Date = " + date.toDateString());
    });
  }

  async getAnswerType(){
    await this._apiService.getAnswerType().then(
      atypes => {
        this._answer_types = atypes;        
      },
      err =>{
        console.log("Some error occurred!");
        this._util.logoutIf401Error(err);
      }
    )    
  }

  getFilteredAnswertype(answertypeID){
    if(this._answer_types != null){
      return this._answer_types.filter(a => (a.id == answertypeID))[0].answer_type;      
    }
    return "err";
  }

  isPastDate(date){
    let checkdate = new Date(date);   
    let currentdate = new Date();
    if(checkdate.toDateString() == currentdate.toDateString()){
      return false;
    }
        
    return checkdate < currentdate;
  }

}
