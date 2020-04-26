import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Util } from '../util';
import { Question } from '../question';
import { NgForm } from '@angular/forms';


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

  _questionObj: Question = new Question;

  hideTime: boolean = true;
  msg = "";
  TotalQuestionCount = 0;
  ActiveQuestionCount = 0;

  selectedQuestion: any = "";

  constructor(
    public _apiService: ApiService,
    public _util: Util
  ) { }

  async ngOnInit() {
    await this.loadQuestions();
    this.setMinTime(null);
  }

  async loadQuestions() {
    //resetting count...
    this.ActiveQuestionCount = this.TotalQuestionCount = 0;

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
      this.TotalQuestionCount++;
      element.active = this.isActiveDate(element.from, element.to);
      if (element.active)
        this.ActiveQuestionCount++;
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

  async createQuestion(form: NgForm) {
    let _from = this.formatFromToTime(this._questionObj.time, this._questionObj.daterange[0]);
    this._questionObj.from = new Date(_from).toString();
    this._questionObj.to = new Date(this._questionObj.daterange[1]).toString();
    console.log(this._questionObj);
    await this._apiService.insertQuestion(this._questionObj);
    this.msg = "Question added";
    this.reset(form);
    await this.loadQuestions();
  }

  formatFromToTime(_time, _date): string {

    _time = new Date(_time);
    _date = new Date(_date);

    return `${_date.getMonth() + 1}/${_date.getDate()}/${_date.getFullYear()} ${_time.getHours()}:${_time.getMinutes()}`;


  }

  // Set min time only if from date is today
  setMinTime(daterange) {

    if (daterange == null)
      return;

    this.hideTime = false;

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

  reset(form: NgForm) {
    form.resetForm();
    this._questionObj = this._util.resetValues(this._questionObj);
    this.hideTime = true;
    setTimeout(() => {
      this.msg = "";
    }, 3000)

  }

  async deleteQuestion(id) {
    await this._apiService.deleteQuestion(JSON.parse(`{"id" : ${id}}`));
    await this.loadQuestions();
    alert("Question deleted");

  }

}
