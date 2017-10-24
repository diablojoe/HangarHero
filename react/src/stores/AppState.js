import {observable, action} from "mobx";
import axios from "axios";
import superagent from 'superagent'

export default class AppState {
  @observable authenticated;
  @observable authenticating;
  @observable items;
  @observable item;

  @observable testval;

  constructor() {
    this.authenticated = false;
    this.authenticating = false;
    this.items = [];
    this.item = {};

    this.testval = "Cobbled together by ";
  }

  async fetchData(pathname, id) {
    let {data} = await axios.get(`https://jsonplaceholder.typicode.com${pathname}`);
    console.log(data);
    data.length > 0
      ? this.setData(data)
      : this.setSingle(data);
  }

  @action setData(data) {
    this.items = data;
  }

  @action setSingle(data) {
    this.item = data;
  }

  @action clearItems() {
    this.items = [];
    this.item = {};
  }

  @action authenticate() {
    return new Promise((resolve, reject) => {
      this.authenticating = true;
      setTimeout(() => {
        this.authenticated = !this.authenticated;
        this.authenticating = false;
        resolve(this.authenticated);
      }, 0);
    });
  }

  @action
  login() {
    this.authenticated = false;
    this.authenticating = true;
    superagent.post('/api/pet').send({name: 'Manny', species: 'cat'}). // sends a JSON post body
    set('X-API-Key', 'foobar').set('accept', 'json').then(projects => {
      console.log(projects);

      this.authenticating = false
    }, error => {
      console.log(error)
      this.authenticated = true
    })
  }
}
