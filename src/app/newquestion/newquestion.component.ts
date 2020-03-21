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
  
  constructor(
    public _apiService : ApiService,
    public _util : Util
  ) { }

  ngOnInit(): void {
    this.loadQuestions();
    this._questions.forEach(element => {
      this.getAnswerType(element.answer_type)      
    });      
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
  }

  getAnswerType(answertypeID){
    this._apiService.getAnswerType().then(
      atypes => {
        this._answer_types = atypes;        
      },
      err =>{
        console.log("Some error occurred!");
        this._util.logoutIf401Error(err);
      }
    )

    if(this._answer_types != null){
      let map = new Map(this._answer_types);
      console.log(map);
      console.log(map.get(answertypeID));
      return map.get(answertypeID);
    }
    return "err";
  }

}
