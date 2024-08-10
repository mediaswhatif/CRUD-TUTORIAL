import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

class employee {
  id: string;
  name: string;
  data: {
    firstName: string;
    lastName: string;
    fullName: string;
    jobTitle: string;
    empId: string;
    email: string;
    contact: string;
    address: string;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  employees: employee[] = [];
  filteremployees: employee[] = [];
  dataupdated: boolean = false;
  employeeForm: FormGroup

  constructor(private http: HttpClient, private FormBuilder: FormBuilder) {
    this.getEmployees()
    this.InitializeForm()
    console.log(this.employeeForm.value);

  }

  InitializeForm() {
    this.employeeForm = this.FormBuilder.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      contact: ['', Validators.required],
    })
  }

  addEmployee() {
    if (this.employeeForm.invalid) {
      return
    }

    const requestDetails = {
      name: 'Amazon',
      data: this.employeeForm.value
    }
    console.log(requestDetails);

    try {
      this.http.post('https://api.restful-api.dev/objects', requestDetails).subscribe((response: any) => {
        if (response) {
          const button = document.getElementById('dismiss')
          button.click()
          this.dataupdated = false
          const existids = JSON.parse(localStorage.getItem('ids'))
          let ids = []
          if (existids) {
            ids = [...existids]
          }
          ids.push(response.id)
          localStorage.setItem('ids', JSON.stringify(ids))

          this.InitializeForm()
          this.getEmployees()
          return
        }
        console.log('Failed to fetch employees');
      })

    } catch (error) {
      // error
    }

  }


  getEmployees() {
    try {
      const existids = JSON.parse(localStorage.getItem('ids'))
      let url = ''
      if (existids && existids.length > 0) {
        for (let index = 0; index < existids.length; index++) {
          url += 'id=' + existids[index] + ((index < existids.length - 1) ? '&' : '')
        }

      }

      this.http.get('https://api.restful-api.dev/objects?' + url).subscribe((response: any) => {
        if (response) {
          this.employees = response
          this.filteremployees = response
          console.log(response);

          return
        }
        console.log('Failed to fetch employees');
      })

    } catch (error) {
      // error
    }
  }

  searchEmployee(event: any) {
    const searhValue = event.target.value.toLocaleLowerCase()
    if (searhValue) {
      this.filteremployees = this.employees.filter(item => item.data.fullName.toLocaleLowerCase() === searhValue)
      return
    }
    this.filteremployees = this.employees

  }

  pagination(page:number){
    const startIndex = (page - 1) * 3
    const endIndex = startIndex + 3
    this.filteremployees = this.employees.slice(startIndex, endIndex)
  }
}