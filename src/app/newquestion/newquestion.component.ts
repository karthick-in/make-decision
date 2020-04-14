import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Util } from '../util';
import { Question } from '../question';


@Component({
  selector: 'app-newquestion',
  templateUrl: './newquestion.component.html',
  styleUrls: ['./newquestion.component.css']
})
export class NewquestionComponent implements OnInit {

  _questions;
  _answer_types;
  mindate = new Date();
  minTime = new Date();

  //Form usages...
  _form;
  _question;
  _question_type;
  _daterange;
  _time;
  _needStartTime;

  constructor(
    public _apiService: ApiService,
    public _util: Util
  ) { }

  async ngOnInit() {
    await this.loadQuestions();
    this.setMinTime(null);
  }

  async loadQuestions() {
    await this._apiService.getQuestions().then(
      questions => {
        this._questions = questions;
      },
      err => {
        console.log("Some error occurred!" + err);
        this._util.logoutIf401Error(err);
      }
    )
    this._questions?.forEach(element => {
      element.from = this.getFormattedDateString(new Date(element.from));
      element.to = this.getFormattedDateString(new Date(element.to));
      element.created_time = this.getFormattedDateString(new Date(element.created_time));
    });

    await this.getAnswerType();
  }

  async getAnswerType() {
    await this._apiService.getAnswerType().then(
      atypes => {
        this._answer_types = atypes;
      },
      err => {
        console.log("Some error occurred!");
        this._util.logoutIf401Error(err);
      }
    )
  }

  getFilteredAnswertype(answertypeID) {
    if (this._answer_types != null) {
      return this._answer_types.filter(a => (a.id == answertypeID))[0].answer_type;
    }
    return "err";
  }

  async createQuestion(formdata) {
    var questionobj: Question = new Question();
    questionobj.question = this._question;
    questionobj.from = new Date(this._daterange[0]);
    questionobj.to = new Date(this._daterange[1]);
    questionobj.answer_type = this._question_type;
    console.log(questionobj);
    await this._apiService.insertQuestion(questionobj);
    await this.loadQuestions();
  }

  // Set min time only if from date is today
  setMinTime(daterange) {
    if (daterange == null)
      return;
    if (new Date(daterange[0]).toDateString() != new Date().toDateString()) {
      this.minTime = null;
    } else {
      this.minTime = new Date();
      this.minTime.setHours(new Date().getHours());
      this.minTime.setMinutes(new Date().getMinutes());
    }
  }

  getFormattedDateString(d: Date): String {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
  }

  isActiveDate(fromdate: any, todate: any): boolean {
    return (new Date() > new Date(fromdate) && new Date() < new Date(todate))
  }

}
