import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Employee class to define the structure of an employee object
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

  employeeForm: FormGroup; // Form group for managing employee form controls
  employees: employee[] = []; // Array to store the list of employees
  filteremployees: employee[] = []; // Array to store the filtered list of employees
  dataupdated: boolean = false; // Flag to indicate if data is updated
  pageIndex: number = 1; // Current page index for pagination

  constructor(private http: HttpClient, private FormBuilder: FormBuilder) {
    this.getEmployees(); // Fetch employees when the component is initialized
    this.InitializeForm(); // Initialize the form
    console.log(this.employeeForm.value); // Log the initial form values
  }

  // Method to initialize the employee form with default values and validation rules
  InitializeForm() {
    this.employeeForm = this.FormBuilder.group({
      id: [''],
      fullName: ['', Validators.required], // Full name is required
      email: ['', Validators.required], // Email is required
      address: ['', Validators.required], // Address is required
      contact: ['', Validators.required], // Contact is required
    });
  }

  // Method to add a new employee using the form data
  addEmployee() {
    if (this.employeeForm.invalid) {
      return; // Exit if the form is invalid
    }

    const requestDetails = {
      name: 'Amazon',
      data: this.employeeForm.value
    };
    console.log(requestDetails); // Log the request details

    try {
      this.http.post('https://api.restful-api.dev/objects', requestDetails).subscribe((response: any) => {
        if (response) {
          this.cancel(); // Reset the form and close the modal
          const existids = JSON.parse(localStorage.getItem('ids'));
          let ids = [];
          if (existids) {
            ids = [...existids];
          }
          ids.push(response.id);
          localStorage.setItem('ids', JSON.stringify(ids)); // Store the new employee ID in local storage

          this.getEmployees(); // Refresh the employee list
          return;
        }
        console.log('Failed to fetch employees'); // Log failure message
      });

    } catch (error) {
      // Handle error
    }

  }

  // Method to fetch the list of employees from the API
  getEmployees() {
    try {
      const existids = JSON.parse(localStorage.getItem('ids'));
      let url = '';
      if (existids && existids.length > 0) {
        for (let index = 0; index < existids.length; index++) {
          url += 'id=' + existids[index] + ((index < existids.length - 1) ? '&' : ''); // Construct URL with employee IDs
        }

      }

      this.http.get('https://api.restful-api.dev/objects?' + url).subscribe((response: any) => {
        if (response) {
          this.employees = response; // Store the fetched employees
          this.filteremployees = response; // Store the filtered employees (initially all)
          console.log(response); // Log the response

          return;
        }
        console.log('Failed to fetch employees'); // Log failure message
      });

    } catch (error) {
      // Handle error
    }
  }

  // Method to search employees based on the full name entered in the search box
  searchEmployee(event: any) {
    const searhValue = event.target.value.toLocaleLowerCase();
    if (searhValue) {
      this.filteremployees = this.employees.filter(item => item.data.fullName.toLocaleLowerCase() === searhValue); // Filter employees based on the search value
      return;
    }
    this.filteremployees = this.employees; // If search is empty, show all employees
  }

  // Method to handle pagination, showing a specific number of employees per page
  pagination(page: number) {
    this.pageIndex = page; // Update current page index
    const startIndex = (page - 1) * 3;
    const endIndex = startIndex + 3;
    this.filteremployees = this.employees.slice(startIndex, endIndex); // Show employees for the selected page
  }

  // Method to reset the form and close the modal
  cancel() {
    const button = document.getElementById('dismiss');
    button.click();
    this.dataupdated = false; // Reset data updated flag
    this.InitializeForm(); // Re-initialize the form
  }

  // Method to populate the form with employee data for editing
  edit(item: any) {
    this.employeeForm.get('id').patchValue(item.id); // Set the employee ID in the form
    this.employeeForm.patchValue(item.data); // Populate the form with employee data
  }

  // Method to update an existing employee's data
  UpdateEmployee() {
    if (this.employeeForm.invalid) {
      return; // Exit if the form is invalid
    }

    const requestDetails = {
      name: 'Amazon',
      data: this.employeeForm.value
    };
    console.log(requestDetails); // Log the request details

    try {
      this.http.post('https://api.restful-api.dev/objects/' + this.employeeForm.get('id').value, requestDetails).subscribe((response: any) => {
        if (response) {
          const button = document.getElementById('dismiss');
          button.click();
          this.dataupdated = false; // Reset data updated flag
          const existids = JSON.parse(localStorage.getItem('ids'));
          let ids = [];
          if (existids) {
            ids = [...existids];
          }
          ids.push(response.id);
          localStorage.setItem('ids', JSON.stringify(ids)); // Store the updated employee ID in local storage

          this.InitializeForm(); // Re-initialize the form
          this.getEmployees(); // Refresh the employee list
          return;
        }
        console.log('Failed to fetch employees'); // Log failure message
      });

    } catch (error) {
      // Handle error
    }

  }

  // Method to delete an employee by ID
  DeleteEmployee(id: string) {
    if (!id) {
      return; // Exit if no ID is provided
    }

    try {
      this.http.delete('https://api.restful-api.dev/objects/' + id).subscribe((response: any) => {
        if (response) {
          this.cancel(); // Reset the form and close the modal
          const existids = JSON.parse(localStorage.getItem('ids'));
          let ids = [];
          if (existids) {
            ids = [...existids];
          }
          ids.push(response.id);
          localStorage.setItem('ids', JSON.stringify(ids)); // Update the local storage with remaining employee IDs
          this.getEmployees(); // Refresh the employee list
          return;
        }
        console.log('Failed to fetch employees'); // Log failure message
      });

    } catch (error) {
      // Handle error
    }

  }

}
