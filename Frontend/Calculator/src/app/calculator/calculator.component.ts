import { Component, OnInit } from '@angular/core';
import { CalculatorService } from '../services/calculator.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {


  currentNumber = '0';
  operator = null;
  waitForSecondNumber = false;
  subText = '';
  mainText = '0';
  operand1: number = null; // The first operand
  operand2: number = null; // The second operand

  constructor(private calc: CalculatorService) { }

  ngOnInit(): void {
  }

  getOperation(operation: string){

    if(this.operand1 === null){
      this.operand1 = Number(this.currentNumber);
      this.currentNumber = '0';

    }

    if(operation === '!' || operation === 'exp' || operation === 'ln'|| operation === 'sqrt'){
      this.operator = operation;
    }


    else {
      this.operator = operation;
      this.waitForSecondNumber = true
    }

  }

  getAnswer() {

    if (this.operand1 != null && this.operand2 != null){
        this.calc.sendOperations(this.operator, this.operand1, this.operand2)
        this.subText = this.operand1 + this.operator + this.operand2
    }

    else{

      if (this.operator ==='exp' || this.operator === 'ln' || this.operator ==='sqrt')
        this.subText = this.operator + '(' + this.operand1 + ')'

      else
        this.subText = this.operand1 + this.operator

      this.calc.sendOperations(this.operator, this.operand1);


    }
    setTimeout( () => this.display(), 350);
  }

  getDecimal(){
    if(!this.currentNumber.includes('.')){
      this.currentNumber += '.';
    }
  }

  getNumber(v: string){

    if(this.waitForSecondNumber) {
      this.currentNumber === '0'? this.currentNumber = v: this.currentNumber += v;
      this.operand2 = Number(this.currentNumber)
    }

    else{
      this.currentNumber === '0'? this.currentNumber = v: this.currentNumber += v;
    }
  }


  clear(){
    this.currentNumber = '0'
    this.waitForSecondNumber= false;
    this.operator = null;
    this.operand1 = null;
    this.operand2 = null;
    this.subText = ''
    this.mainText = '0';


  }

  display(){

    this.mainText = this.calc.fetchResponse()

  }

}
